import sys
from pathlib import Path

# Make backend modules importable
BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
sys.path.append(str(BACKEND_DIR))

from app import app as flask_app


def handler(request, context=None):
    if request.get("method", "").upper() == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
            },
            "body": "",
        }

    with flask_app.test_client() as client:
        response = client.get("/health")
        return {
            "statusCode": response.status_code,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": response.get_data(as_text=True),
        }


app = handler
application = handler