"""Render resume/resume.html to docs/assets/files/Resume.pdf with headless Chrome.

Usage: python resume/build.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "resume" / "resume.html"
OUT = ROOT / "docs" / "assets" / "files" / "Resume.pdf"

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "google-chrome",
    "chromium",
]


def main() -> int:
    for chrome in CHROME_CANDIDATES:
        try:
            subprocess.run(
                [
                    chrome,
                    "--headless=new",
                    "--disable-gpu",
                    "--no-pdf-header-footer",
                    f"--print-to-pdf={OUT}",
                    SRC.as_uri(),
                ],
                check=True,
                capture_output=True,
            )
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue
        print(f"Wrote {OUT}")
        return 0
    print("No Chrome or Edge found to render the PDF.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
