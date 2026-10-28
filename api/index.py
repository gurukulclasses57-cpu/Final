import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from backend.server import app

# Vercel exposes this function under /api, while the FastAPI app itself keeps
# the normal /api router prefix for local development and production APIs.
