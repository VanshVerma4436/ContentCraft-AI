"""
ContentCraft AI - FastAPI Backend
Integrates with OpenRouter API for AI-powered content generation.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="ContentCraft AI",
    description="AI-powered content generation API using OpenRouter",
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

# Configure OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.2-3b-instruct:free")

if OPENROUTER_API_KEY:
    print(f"✅ OpenRouter API key loaded successfully.")
else:
    print("⚠️  WARNING: OPENROUTER_API_KEY not found in environment variables.")


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
    Constructs a detailed prompt for OpenRouter based on user inputs.
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
    Generate AI-powered content using OpenRouter.

    - **content_type**: Type of content to generate (Blog Post, LinkedIn Post, etc.)
    - **topic**: The subject or topic to write about
    - **tone**: Writing tone (Professional, Casual, Friendly, Marketing, Educational)
    - **length**: Content length (Short, Medium, Long)
    """

    # Validate API key is configured
    if not OPENROUTER_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in the .env file."
        )

    # Validate required fields
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty.")

    if not request.content_type.strip():
        raise HTTPException(status_code=400, detail="Content type must be specified.")

    # Fallback models list for robust generation
    fallback_models = [
        OPENROUTER_MODEL,
        "meta-llama/llama-3.2-3b-instruct:free",
        "google/gemma-4-26b-a4b-it:free",
        "google/gemma-4-31b-it:free",
        "nousresearch/hermes-3-llama-3.1-405b:free",
        "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        "cohere/north-mini-code:free"
    ]
    # Remove duplicates while preserving order
    models_to_try = []
    for m in fallback_models:
        if m and m not in models_to_try:
            models_to_try.append(m)

    try:
        # Build the prompt
        prompt = build_prompt(
            content_type=request.content_type,
            topic=request.topic,
            tone=request.tone,
            length=request.length
        )

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "ContentCraft AI"
        }

        last_error_msg = "Unknown error"

        async with httpx.AsyncClient() as client:
            for current_model in models_to_try:
                payload = {
                    "model": current_model,
                    "max_tokens": 2000,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                }

                try:
                    response = await client.post(
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        json=payload,
                        timeout=60.0
                    )
                    response.raise_for_status()
                    response_data = response.json()

                    if "error" in response_data:
                        last_error_msg = response_data["error"].get("message", "Unknown OpenRouter error")
                        print(f"⚠️ Model {current_model} failed: {last_error_msg}")
                        continue

                    choices = response_data.get("choices", [])
                    if not choices:
                        continue

                    generated_text = choices[0].get("message", {}).get("content", "")

                    if generated_text:
                        return ContentResponse(content=generated_text)

                except httpx.HTTPStatusError as e:
                    error_msg = str(e)
                    try:
                        res_json = e.response.json()
                        if "error" in res_json:
                            error_msg = res_json["error"].get("message", error_msg)
                    except Exception:
                        pass
                    last_error_msg = error_msg
                    print(f"⚠️ Model {current_model} HTTP error: {error_msg}")
                    continue
                except Exception as e:
                    last_error_msg = str(e)
                    print(f"⚠️ Model {current_model} exception: {str(e)}")
                    continue

        # If we exit the loop, all models failed
        raise HTTPException(
            status_code=500,
            detail=f"All fallback models failed. Last error: {last_error_msg}"
        )

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Content generation failed: {str(e)}"
        )
