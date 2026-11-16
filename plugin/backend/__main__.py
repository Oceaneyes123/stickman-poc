import argparse
import os

import uvicorn

from plugin.backend.app import create_app


def main():
    parser = argparse.ArgumentParser(description="Run Frame Study transcripts on 127.0.0.1:8765 only.")
    parser.add_argument("--extension-id", default=os.environ.get("FRAME_STUDY_EXTENSION_ID"), help="Authorized ID shown in the extension's Transcript section")
    arguments = parser.parse_args()
    if not arguments.extension_id:
        parser.error("--extension-id is required. Copy the ID shown in the extension or chrome://extensions.")
    app = create_app(arguments.extension_id)
    uvicorn.run(app, host="127.0.0.1", port=8765, workers=1, access_log=False)


if __name__ == "__main__":
    main()
