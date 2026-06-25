"""
ContentCraft AI - FastAPI Backend
Integrates with Google Gemini API for AI-powered content generation.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="ContentCraft AI",
    description="AI-powered content generation API using Google Gemini",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    print(f"✅ Gemini API key loaded successfully.")
else:
    print("⚠️  WARNING: GOOGLE_API_KEY not found in environment variables.")


# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────

class ContentRequest(BaseModel):
    """Request model for content generation."""
    content_type: str  # e.g., Blog Post, LinkedIn Post
    topic: str         # Subject/topic to write about
    tone: str          # Writing tone (Professional, Casual, etc.)
    length: str        # Content length (Short, Medium, Long)


class ContentResponse(BaseModel):
    """Response model for generated content."""
    content: str


# ─────────────────────────────────────────────
# Helper: Build Prompt
# ─────────────────────────────────────────────

def build_prompt(content_type: str, topic: str, tone: str, length: str) -> str:
    """
    Constructs a detailed prompt for Gemini based on user inputs.
    """
    length_guide = {
        "Short": "Keep it concise, around 150-250 words.",
        "Medium": "Aim for 400-600 words with good structure.",
        "Long": "Write a comprehensive piece of 800-1200 words with detailed sections.",
    }

    content_guidelines = {
        "Blog Post": "Write an engaging blog post with a catchy title, introduction, key sections with subheadings, and a compelling conclusion.",
        "LinkedIn Post": "Write a professional LinkedIn post that drives engagement, uses relevant emojis sparingly, and ends with a thought-provoking question or call-to-action.",
        "Instagram Caption": "Write an eye-catching Instagram caption with relevant hashtags at the end. Make it punchy and visually descriptive.",
        "Product Description": "Write a persuasive product description that highlights benefits, features, and unique selling points. Focus on value proposition.",
        "Email": "Write a professional email with a clear subject line suggestion, greeting, body, and closing. Keep it actionable.",
        "Marketing Copy": "Write compelling marketing copy with a strong headline, engaging body, and a clear call-to-action.",
        "YouTube Script": "Write a YouTube video script with intro hook, main content sections, transitions, and an outro with subscribe CTA.",
    }

    guidelines = content_guidelines.get(content_type, "Create engaging, high-quality content.")
    length_instruction = length_guide.get(length, "Write a medium-length piece.")

    prompt = f"""You are an expert content creator and copywriter.

Task: Generate a {content_type} about "{topic}".

Guidelines:
- {guidelines}
- Tone: {tone} — Ensure the entire content reflects this tone consistently.
- Length: {length_instruction}
- Make the content original, engaging, and high-quality.
- Do NOT include meta-commentary like "Here is your content:" or "Sure, I'll write...". 
- Start directly with the content itself.

Topic: {topic}

Generate the content now:"""

    return prompt


# ─────────────────────────────────────────────
# API Endpoints
# ─────────────────────────────────────────────

@app.get("/", summary="Health Check")
async def root():
    """Root endpoint to verify the API is running."""
    return {"message": "ContentCraft AI API Running", "status": "healthy", "version": "1.0.0"}


@app.post("/generate", response_model=ContentResponse, summary="Generate Content")
async def generate_content(request: ContentRequest):
    """
    Generate AI-powered content using Google Gemini.

    - **content_type**: Type of content to generate (Blog Post, LinkedIn Post, etc.)
    - **topic**: The subject or topic to write about
    - **tone**: Writing tone (Professional, Casual, Friendly, Marketing, Educational)
    - **length**: Content length (Short, Medium, Long)
    """

    # Validate API key is configured
    if not GOOGLE_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Google API key is not configured. Please set GOOGLE_API_KEY in the .env file."
        )

    # Validate required fields
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    if not request.content_type.strip():
        raise HTTPException(status_code=400, detail="Content type must be specified.")

    try:
        # Initialize Gemini model
        model = genai.GenerativeModel("gemini-2.5-flash")

        # Build the prompt
        prompt = build_prompt(
            content_type=request.content_type,
            topic=request.topic,
            tone=request.tone,
            length=request.length
        )

        # Generate content using Gemini
        response = model.generate_content(prompt)

        # Extract generated text
        generated_text = response.text

        if not generated_text:
            raise HTTPException(status_code=500, detail="Gemini returned an empty response.")

        return ContentResponse(content=generated_text)

    except genai.types.BlockedPromptException:
        raise HTTPException(
            status_code=400,
            detail="The prompt was blocked by Gemini's safety filters. Please modify your topic."
        )
    except Exception as e:
        error_message = str(e)
        if "API_KEY_INVALID" in error_message or "INVALID_ARGUMENT" in error_message:
            raise HTTPException(
                status_code=401,
                detail="Invalid Google API key. Get a valid key at https://aistudio.google.com/app/apikey"
            )
        if "PERMISSION_DENIED" in error_message or "403" in error_message:
            raise HTTPException(
                status_code=403,
                detail="Permission denied. Your API key may not have Gemini API access enabled."
            )
        if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please wait a moment and try again."
            )
        if "404" in error_message or "not found" in error_message.lower():
            raise HTTPException(
                status_code=404,
                detail="Gemini model not found. The model 'gemini-2.0-flash' may not be available in your region."
            )
        raise HTTPException(
            status_code=500,
            detail=f"Content generation failed: {error_message}"
        )
