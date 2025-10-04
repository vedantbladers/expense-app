import google.generativeai as genai
from typing import Optional
import json
import base64
import asyncio
import re

class ReceiptParser:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self._gemini_ready = False
        self._configuration_error = None
        self._configure_once()

    def _configure_once(self):
        """Attempt to configure Gemini once; log errors but don't crash app."""
        if not self.api_key:
            self._configuration_error = "GEMINI_API_KEY is not set"
            print(f"[Gemini] {self._configuration_error} — receipt parsing endpoint will return an error until it's provided.")
            return
        try:
            print(f"[Gemini] Configuring with key: {self.api_key[:10]}... (truncated)")
            genai.configure(api_key=self.api_key)
            # Light validation (non-fatal if fails)
            try:
                models = genai.list_models()
                sample = [m.name for m in models][:5]
                print(f"[Gemini] Sample models: {sample}")
            except Exception as inner:
                print(f"[Gemini] Model listing failed (continuing): {inner}")
            self._gemini_ready = True
        except Exception as e:
            self._configuration_error = str(e)
            print(f"[Gemini] Configuration failed (will retry on first parse): {e}")

    def _ensure_configured(self):
        if not self._gemini_ready and self._configuration_error:
            # Retry once lazily
            self._configure_once()

    async def parse_receipt(self, image_bytes: bytes) -> Optional[dict]:
        """Uses Gemini to extract details. Adds robust JSON repair and retry."""
        self._ensure_configured()
        if not self._gemini_ready:
            return {"error": f"Gemini not configured: {self._configuration_error}"}

        print("Starting receipt parsing process...")
        print(f"Image size: {len(image_bytes)} bytes")

        generation_config = {
            "temperature": 0.2,
            "top_p": 1,
            "top_k": 32,
            "max_output_tokens": 512,  # Smaller to reduce truncation risk
        }

        # Prefer a current flash model if available; fallback kept for compatibility
        preferred_model = 'models/gemini-2.5-flash'
        model_name = preferred_model
        try:
            model = genai.GenerativeModel(model_name, generation_config=generation_config)
        except Exception:
            model = genai.GenerativeModel('models/gemini-pro-latest', generation_config=generation_config)

        base_prompt = (
            "Extract receipt data and return ONLY compact JSON. Schema strictly: "
            '{"merchant_name": string|null, "total": number|null, "currency": string|null, '
            '"date": "YYYY-MM-DD"|null, "items": [{"name": string, "price": number}], '
            '"tax": number|null, "discount": number|null}. Rules: 1) One JSON object only. '
            '2) No markdown. 3) Items array empty if none. 4) Use null if unknown. 5) Ensure valid JSON. '
            '6) Date must be full YYYY-MM-DD or null.'
        )

        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        img_part = {"mime_type": "image/png", "data": image_b64}

        async def request_once(extra_instruction: str = ""):
            resp = await model.generate_content_async([base_prompt + (" " + extra_instruction if extra_instruction else ""), img_part])
            return resp.text if hasattr(resp, 'text') else None

        raw_text = await request_once()
        print(f"Raw response from Gemini: {raw_text}")

        def strip_fences(s: str) -> str:
            if not s:
                return ""
            s = s.strip()
            if '```' in s:
                # take content between first fenced block if present
                parts = s.split('```')
                # Attempt to find json fenced block
                for i, part in enumerate(parts):
                    if part.lower().startswith('json') and i + 1 < len(parts):
                        return parts[i + 1].strip()
                # fallback: remove all fences
                s = ''.join(p for idx, p in enumerate(parts) if idx % 2 == 0).strip()
            return s

        def extract_json_fragment(s: str) -> str:
            # Find first '{' and last '}' to mitigate truncation mid-line
            if not s:
                return s
            start = s.find('{')
            end = s.rfind('}')
            if start != -1 and end != -1 and end > start:
                return s[start:end+1]
            return s

        def basic_repair(s: str) -> Optional[str]:
            # If truncated (e.g., missing closing braces or quotes), attempt simple fixes
            if not s:
                return None
            # Remove trailing unmatched backslashes or incomplete escape
            s = re.sub(r'\\+$', '', s)
            # Count braces
            open_braces = s.count('{')
            close_braces = s.count('}')
            if close_braces < open_braces:
                s += '}' * (open_braces - close_braces)
            # Attempt to fix an unterminated string at end (e.g., "2024-05-1)
            if re.search(r'"date"\s*:\s*"[0-9]{4}-[0-9]{2}-[0-9]{1}$', s):
                # remove partial date entirely -> set null
                s = re.sub(r'"date"\s*:\s*"[0-9]{4}-[0-9]{2}-[0-9]{1}$', '"date": null', s)
            # Ensure required keys exist; if obviously truncated after a comma
            if s.strip().endswith(':'):
                s += ' null'
            return s

        def try_parse(candidate: str) -> Optional[dict]:
            try:
                return json.loads(candidate)
            except Exception as e:
                print(f"Parse attempt failed: {e}")
                return None

        cleaned = strip_fences(raw_text)
        fragment = extract_json_fragment(cleaned)
        data = try_parse(fragment)
        if data is None:
            repaired = basic_repair(fragment)
            if repaired:
                data = try_parse(repaired)

        # Retry with explicit re-ask if still failing
        if data is None:
            print("Initial parse failed; requesting re-output.")
            retry_text = await request_once("Repeat EXACT valid JSON now.")
            cleaned_retry = extract_json_fragment(strip_fences(retry_text))
            data = try_parse(cleaned_retry)
            if data is None:
                repaired_retry = basic_repair(cleaned_retry)
                if repaired_retry:
                    data = try_parse(repaired_retry)

        if data is None:
            print("Failed to obtain valid JSON after repair attempts.")
            return {"error": "Could not parse receipt JSON", "raw": raw_text}

        print(f"Successfully parsed JSON: {data}")
        return data