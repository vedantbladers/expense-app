from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from receipt_parser import ReceiptParser

# Initialize FastAPI app (minimal variant)
app = FastAPI(title="Receipt Parser API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get Gemini API key from environment variable
from dotenv import load_dotenv
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize receipt parser
receipt_parser = ReceiptParser(GEMINI_API_KEY)

# (Removed expense management & database initialization for minimal build)

@app.post("/parse-receipt/")
async def parse_receipt(receipt: UploadFile = File(...)):
    """
    Upload a receipt image and get extracted information using Gemini AI.
    """
    try:
        # Read the file
        contents = await receipt.read()
        
        # Check file type
        file_type = receipt.content_type
        if not file_type.startswith('image/'):
            return {
                "success": False,
                "error": f"Invalid file type: {file_type}. Please upload an image file."
            }
        
        # Parse the receipt using Gemini AI
        result = await receipt_parser.parse_receipt(contents)
        
        if result:
            return {
                "success": True,
                "data": result
            }
        else:
            return {
                "success": False,
                "error": "Failed to parse receipt. Please ensure the image is clear and contains readable text."
            }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Mount static files for the frontend (mounted last so API routes take precedence)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/", StaticFiles(directory="static", html=True), name="root")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)