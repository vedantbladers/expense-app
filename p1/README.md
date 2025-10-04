# Receipt Parser (Minimal Version)

This project is a lightweight FastAPI service with a single purpose: parse receipt images using Google Gemini and return structured JSON.

## Features
* Upload a receipt image (`/parse-receipt/`) and get merchant name, total, currency, date, items, tax, discount (best-effort).
* Simple static frontend (drop a file and view parsed results).
* Robust JSON post-processing to repair truncated AI responses.

## Prerequisites
* Python 3.9+
* A valid `GEMINI_API_KEY` from Google AI Studio.

## Setup
```bash
python -m venv venv
./venv/Scripts/activate  # (Windows PowerShell may require: Set-ExecutionPolicy -Scope Process Bypass)
pip install -r requirements.txt
```

Create a `.env` file:
```env
GEMINI_API_KEY=YOUR_KEY_HERE
```

## Run
```bash
./venv/Scripts/python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open: http://127.0.0.1:8000

API docs: http://127.0.0.1:8000/docs

## Endpoint
`POST /parse-receipt/` (multipart form field: `receipt`)

Response (success):
```json
{
  "success": true,
  "data": {
    "merchant_name": "...",
    "total": 12.34,
    "currency": "USD",
    "date": "2024-05-10",
    "items": [...],
    "tax": 0.75,
    "discount": null
  }
}
```

## Directory (trimmed)
```
.
├── main.py
├── receipt_parser.py
├── static/
├── uploads/
├── requirements.txt
├── .env (not committed)
└── README.md
```

## Notes
* All former expense management, database, and currency conversion code removed for minimal footprint.
* If Gemini returns malformed JSON, the parser attempts fenced block stripping, fragment extraction, and simple repairs before retrying.
* Do NOT commit real API keys.

## Future Ideas
* Add unit tests for JSON repair utility
* Optional: Switch to a single shared parsing utility for multiple models
* Add rate limit backoff metrics

Enjoy the minimal build!