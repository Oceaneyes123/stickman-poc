from contextlib import asynccontextmanager
import asyncio
import json
from pathlib import Path
import re
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware

from plugin.backend.jobs import Jobs, contained
from plugin.backend.transcripts import MAX_TRANSCRIPT, TranscriptRequest, UploadOptions, validate_segments, video_id

PLUGIN = Path(__file__).resolve().parent.parent
AUDIO_SUFFIXES = {".wav", ".mp3", ".m4a", ".flac", ".ogg", ".webm", ".mp4", ".opus", ".aac"}


def create_app(extension_id: str, result_root: Path | None = None, work_root: Path | None = None):
    if not re.fullmatch(r"[a-p]{32}", extension_id):
        raise ValueError("Provide the authorized Chrome extension ID (32 letters a–p).")
    origin = f"chrome-extension://{extension_id}"
    jobs = Jobs(result_root or PLUGIN / "result", work_root or PLUGIN / "backend" / ".work")

    @asynccontextmanager
    async def lifespan(_app):
        await jobs.start()
        try:
            yield
        finally:
            await jobs.close()

    app = FastAPI(title="Frame Study local transcripts", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
    app.state.jobs = jobs
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1"])
    app.add_middleware(CORSMiddleware, allow_origins=[origin], allow_methods=["GET", "POST"],
                       allow_headers=["Content-Type", "X-Frame-Study-Extension", "X-Upload-Name"], max_age=600)

    @app.middleware("http")
    async def authorized(request: Request, call_next):
        supplied_origin = request.headers.get("origin")
        # Host-permitted Chrome requests can omit Origin. A custom header is
        # mandatory, and browser pages cannot supply it without CORS preflight.
        if supplied_origin not in (None, origin):
            return JSONResponse({"detail": "Unauthorized extension origin."}, status_code=403)
        if request.method == "OPTIONS":
            if supplied_origin != origin:
                return JSONResponse({"detail": "Unauthorized preflight."}, status_code=403)
        elif request.headers.get("x-frame-study-extension") != extension_id:
            return JSONResponse({"detail": "Authorized extension header required."}, status_code=403)
        try:
            length = int(request.headers.get("content-length", "0"))
        except ValueError:
            return JSONResponse({"detail": "Invalid content length."}, status_code=400)
        limit = 256 * 1024 * 1024 if request.url.path.startswith("/api/transcript/upload/") else 32768
        if length < 0 or length > limit:
            return JSONResponse({"detail": "Request exceeds the size limit."}, status_code=413)
        # Count streamed JSON too; Content-Length alone is not a trust boundary.
        if request.url.path == "/api/transcript" and request.method == "POST":
            body = bytearray()
            async for chunk in request.stream():
                body.extend(chunk)
                if len(body) > limit:
                    return JSONResponse({"detail": "Request exceeds the size limit."}, status_code=413)
            request._body = bytes(body)
        return await call_next(request)

    def identity(value):
        try:
            return video_id(value)
        except ValueError as error:
            raise HTTPException(422, str(error)) from error

    def job_record(job_id):
        record = jobs.records.get(job_id)
        if not record:
            raise HTTPException(404, "Job not found. Jobs reset on backend restart; saved transcripts remain available.")
        return record

    @app.get("/api/health")
    async def health():
        return {"status": "ok", "extensionOrigin": origin, "outputDirectory": str(jobs.root), "concurrency": 1}

    @app.post("/api/transcript", status_code=202)
    async def extract(payload: TranscriptRequest):
        try:
            record = jobs.create(identity(payload.url), payload)
            # Worker options never include a user URL or arbitrary yt-dlp flags.
            record["request"]["options"].pop("url", None)
            jobs.enqueue(record)
            return jobs.snapshot(record)
        except ValueError as error:
            raise HTTPException(429, str(error)) from error

    @app.get("/api/jobs")
    async def list_jobs(video_id: str):
        target = identity(video_id)
        return [jobs.snapshot(record) for record in jobs.records.values() if record["videoId"] == target]

    @app.get("/api/jobs/{job_id}")
    async def get_job(job_id: str):
        return jobs.snapshot(job_record(job_id))

    @app.post("/api/jobs/{job_id}/cancel")
    async def cancel_job(job_id: str):
        record = job_record(job_id)
        await jobs.cancel(record)
        return jobs.snapshot(record)

    @app.get("/api/transcript/{video_id}")
    async def transcript(video_id: str):
        try:
            path = contained(jobs.root, identity(video_id), "transcript", "transcript.json")
            if not path.is_file():
                raise HTTPException(404, "No saved transcript for this video.")
            if path.stat().st_size > 20 * 1024 * 1024:
                raise HTTPException(413, "Saved transcript is too large.")
            document = json.loads(path.read_text(encoding="utf-8"))
            if not isinstance(document, dict) or document.get("videoId") != video_id:
                raise ValueError("Saved transcript has a different video identity.")
            document["segments"] = validate_segments(document.get("segments"))
            return document
        except (ValueError, OSError) as error:
            raise HTTPException(409, "Transcript cannot be read safely. Check its local file and permissions.") from error

    @app.post("/api/transcript/upload/{video_id}", status_code=202)
    async def upload(video_id: str, request: Request, options: Annotated[UploadOptions, Query()]):
        name = request.headers.get("x-upload-name", "")
        suffix = Path(name).suffix.lower()
        allowed = AUDIO_SUFFIXES if options.kind == "audio" else {".json", ".vtt", ".srt", ".txt"}
        if suffix not in allowed:
            raise HTTPException(422, "Unsupported audio/transcript extension.")
        try:
            record = jobs.create(identity(video_id), options, upload=True, suffix=suffix, kind=options.kind)
            record["request"]["options"].pop("kind", None)
        except ValueError as error:
            raise HTTPException(429, str(error)) from error
        # Track the receiving request so cancellation/shutdown also cleans uploads.
        record["upload_task"] = asyncio.current_task()
        try:
            size = 0
            limit = 256 * 1024 * 1024 if options.kind == "audio" else MAX_TRANSCRIPT
            with (record["folder"] / ("upload" + suffix)).open("wb") as output:
                async with asyncio.timeout(300):
                    async for chunk in request.stream():
                        size += len(chunk)
                        if size > limit:
                            raise HTTPException(413, "Upload exceeds 256 MiB for audio or 5 MiB for transcripts.")
                        output.write(chunk)
            if not size:
                raise HTTPException(422, "Uploaded file is empty.")
            jobs.enqueue(record)
            return jobs.snapshot(record)
        except BaseException as error:
            record["cancel"] = True
            jobs.cleanup(record)
            jobs.mark_cancelled(record)
            if isinstance(error, TimeoutError):
                raise HTTPException(408, "Upload timed out. Temporary audio was deleted; try a smaller file.") from error
            if isinstance(error, OSError):
                raise HTTPException(507, "Upload could not be saved. Check free disk space and folder permissions.") from error
            raise
        finally:
            record["upload_task"] = None

    return app
