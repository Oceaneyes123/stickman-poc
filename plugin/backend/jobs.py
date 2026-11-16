"""Bounded asynchronous jobs with cancellable, disposable worker processes."""
import asyncio
from collections import deque
from datetime import datetime, timezone
import json
import os
import re
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile
import uuid

from plugin.backend.transcripts import sidecars, video_id

TERMINAL = {"complete", "error", "cancelled"}


def contained(root: Path, *parts: str) -> Path:
    path = root.joinpath(*parts)
    if path.resolve() != path.absolute() or not path.resolve().is_relative_to(root.resolve()):
        raise ValueError("Output links or paths outside the configured local directory are not allowed.")
    return path


def publish(root: Path, identity: str, document: dict, folder: Path, retain: bool):
    if video_id(identity) != identity or document.get("videoId") != identity:
        raise ValueError("Transcript identity mismatch.")
    destination = contained(root, identity, "transcript")
    destination.mkdir(parents=True, exist_ok=True)
    payloads = sidecars(document)
    retained = None
    try:
        # Prepare every sidecar before replacing any previously saved transcript.
        for name, contents in payloads.items():
            temporary = contained(root, identity, "transcript", name + ".pending")
            temporary.write_bytes(contents)
        if retain and (folder / "normalized.wav").is_file():
            name = document.get("retainedAudio", "")
            if not re.fullmatch(r"audio_[a-f0-9]{32}\.wav", name):
                raise ValueError("Invalid retained audio identifier.")
            retained = contained(root, identity, "transcript", name)
            os.replace(folder / "normalized.wav", retained)
        for name in payloads:
            target = contained(root, identity, "transcript", name)
            temporary = contained(root, identity, "transcript", name + ".pending")
            os.replace(temporary, target)
    except BaseException:
        if retained:
            retained.unlink(missing_ok=True)
        raise
    finally:
        for name in payloads:
            contained(root, identity, "transcript", name + ".pending").unlink(missing_ok=True)
    # JSON is replaced last and is the authoritative committed transcript.


class Jobs:
    def __init__(self, result_root: Path, work_root: Path):
        self.root = result_root.resolve()
        self.work = work_root.absolute()
        self.records = {}
        self.gate = asyncio.Semaphore(1)
        self.lock_file = None

    async def start(self):
        if self.work.resolve() != self.work:
            raise RuntimeError("The private work directory cannot be a symbolic link or junction.")
        self.work.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.root.mkdir(parents=True, exist_ok=True)
        self.lock_file = open(self.work / "backend.lock", "a+b")
        self.lock_file.seek(0)
        if os.name == "nt":
            import msvcrt
            if not self.lock_file.read(1):
                self.lock_file.write(b"1")
                self.lock_file.flush()
            self.lock_file.seek(0)
            msvcrt.locking(self.lock_file.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(self.lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
        # The instance lock makes stale-job cleanup safe after a previous crash.
        for folder in self.work.glob("job_*"):
            if folder.is_dir() and folder.resolve() == folder.absolute():
                shutil.rmtree(contained(self.work, folder.name))

    def create(self, identity, options, **extra):
        if sum(record["status"] not in TERMINAL for record in self.records.values()) >= 4:
            raise ValueError("Job queue is full (one running, up to three waiting). Cancel a job or wait.")
        while len(self.records) >= 64:
            old = next((key for key, record in self.records.items() if record["status"] in TERMINAL), None)
            if old is None:
                break
            del self.records[old]
        identity = video_id(identity)
        folder = Path(tempfile.mkdtemp(prefix="job_", dir=self.work))
        record = {"id": uuid.uuid4().hex, "videoId": identity, "status": "uploading" if extra.get("upload") else "queued",
                  "phase": "queued", "progress": 0, "message": "Waiting for the local worker.",
                  "createdAt": datetime.now(timezone.utc).isoformat(), "error": None, "warnings": [],
                  "cancel": False, "folder": folder, "process": None, "task": None, "upload_task": None,
                  "request": {"videoId": identity, "options": options.model_dump(), **extra}}
        self.records[record["id"]] = record
        return record

    @staticmethod
    def snapshot(record):
        return {key: record[key] for key in ("id", "videoId", "status", "phase", "progress", "message", "createdAt", "error", "warnings")}

    def enqueue(self, record):
        record["status"] = "queued"
        record["task"] = asyncio.create_task(self.execute(record))

    async def stop_process(self, process):
        if process.returncode is not None:
            return
        if os.name == "nt":
            # PID is from our own subprocess, never from an HTTP argument.
            killer = await asyncio.create_subprocess_exec("taskkill", "/PID", str(process.pid), "/T", "/F",
                         stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL,
                         creationflags=subprocess.CREATE_NO_WINDOW)
            await killer.wait()
        else:
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
        await process.wait()

    async def cancel(self, record):
        if record["status"] in TERMINAL:
            return
        record["cancel"] = True
        record["status"] = "cancelling"
        if record["upload_task"]:
            task = record["upload_task"]
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)
            return
        if record["process"]:
            await self.stop_process(record["process"])
        elif record["task"]:
            record["task"].cancel()
            await asyncio.gather(record["task"], return_exceptions=True)
            self.cleanup(record)
            self.mark_cancelled(record)
        else:
            self.cleanup(record)
            self.mark_cancelled(record)

    @staticmethod
    def mark_cancelled(record):
        record.update(status="cancelled", phase="cancelled", message="Cancelled. Temporary audio deleted.", error=None)

    def cleanup(self, record):
        folder = contained(self.work, record["folder"].name)
        if folder.exists():
            shutil.rmtree(folder)

    async def execute(self, record):
        stderr = deque(maxlen=8)
        reader_task = None
        try:
            async with self.gate:
                if record["cancel"]:
                    return
                record.update(status="running", phase="starting", message="Starting local transcription worker.")
                folder = record["folder"]
                (folder / "request.json").write_text(json.dumps(record["request"]), encoding="utf-8")
                process = await asyncio.create_subprocess_exec(
                    sys.executable, "-u", "-m", "plugin.backend.worker", str(folder),
                    cwd=Path(__file__).resolve().parents[2], stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    **({"creationflags": subprocess.CREATE_NO_WINDOW} if os.name == "nt" else {"start_new_session": True}))
                record["process"] = process
                if record["cancel"]:
                    await self.stop_process(process)
                async def read_errors():
                    while chunk := await process.stderr.read(1024):
                        stderr.append(chunk.decode("utf-8", errors="replace"))
                reader_task = asyncio.create_task(read_errors())
                async def watch():
                    while line := await process.stdout.readline():
                        try:
                            event = json.loads(line)
                            for key in ("phase", "progress", "message", "warnings"):
                                if key in event:
                                    record[key] = event[key]
                            if event.get("phase") == "error":
                                record["error"] = event["message"]
                        except (ValueError, TypeError):
                            continue
                    return await process.wait()
                code = await asyncio.wait_for(watch(), timeout=6 * 3600)
                await reader_task
                if record["cancel"]:
                    return
                if code != 0:
                    detail = "".join(stderr)[-1200:].replace(str(folder), "<temporary audio>")
                    raise RuntimeError(record["error"] or f"Worker stopped unexpectedly. Check RAM, GPU libraries, and installed dependencies; try tiny on CPU or upload a transcript. {detail}")
                path = folder / "result.json"
                if path.stat().st_size > 20 * 1024 * 1024:
                    raise ValueError("Transcript result is too large. Upload a shorter audio segment.")
                document = json.loads(path.read_text(encoding="utf-8"))
                document["createdAt"] = datetime.now(timezone.utc).isoformat()
                document["jobId"] = record["id"]
                document["retainedAudio"] = f"audio_{record['id']}.wav" if record["request"]["options"]["retain_audio"] and (folder / "normalized.wav").is_file() else None
                publish(self.root, record["videoId"], document, folder, record["request"]["options"]["retain_audio"])
                record.update(status="complete", phase="complete", progress=100, message="Transcript JSON, TXT, and SRT saved locally.", warnings=document.get("warnings", []))
        except asyncio.CancelledError:
            record["cancel"] = True
            if record["process"]:
                await self.stop_process(record["process"])
        except Exception as error:
            if record["process"] and record["process"].returncode is None:
                await self.stop_process(record["process"])
            message = "Job exceeded the six-hour execution limit. Use a shorter audio file or a faster model/device." if isinstance(error, TimeoutError) else str(error)[:1500]
            record.update(status="error", phase="error", error=message, message=message)
        finally:
            if reader_task:
                await asyncio.gather(reader_task, return_exceptions=True)
            try:
                self.cleanup(record)
            except OSError:
                record.update(status="error", phase="error", error="Temporary audio cleanup failed. Check disk permissions and restart the backend.", message="Temporary audio cleanup failed. Check disk permissions and restart the backend.")
            else:
                if record["cancel"]:
                    self.mark_cancelled(record)
            record["process"] = None

    async def close(self):
        for record in list(self.records.values()):
            await self.cancel(record)
        await asyncio.gather(*(record["task"] for record in self.records.values() if record["task"]), return_exceptions=True)
        if self.lock_file:
            self.lock_file.close()
