from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List
import os
import requests
import shutil

# RAG
from rag import load_pdf, chunk_text, build_index, search_docs


# -------------------------
# Load Env
# -------------------------
load_dotenv()


# -------------------------
# App
# -------------------------
app = FastAPI(
    title="Brandstori AI Backend",
    description="RAG-powered PDF Chat System",
    version="1.0.0"
)


# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# API Key
# -------------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("❌ GROQ API KEY NOT LOADED")
else:
    print("✅ GROQ API KEY LOADED")


# -------------------------
# Groq
# -------------------------
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


# -------------------------
# Home
# -------------------------
@app.get("/")
def home():
    return {
        "status": "Backend running 🚀",
        "engine": "Groq + RAG",
        "version": "1.0"
    }


# -------------------------
# Upload PDFs (MULTI)
# -------------------------
@app.post("/upload")
def upload_pdf(files: List[UploadFile] = File(...)):

    os.makedirs("data", exist_ok=True)

    total_chunks = 0
    uploaded_files = []

    for file in files:

        file_path = f"data/{file.filename}"

        # Save
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract
        text = load_pdf(file_path)

        # Chunk
        chunks = chunk_text(text)

        # Index
        build_index(chunks)

        total_chunks += len(chunks)
        uploaded_files.append(file.filename)

    return {
        "message": "PDFs uploaded & indexed successfully",
        "files": uploaded_files,
        "total_chunks": total_chunks
    }

# -------------------------
# Ask AI
# -------------------------
@app.post("/ask")
def ask_ai(data: dict):

    question = data.get("question")

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required"
        )

    # Search
    contexts = search_docs(question)

    if not contexts:
        return {
            "answer": "No relevant information found in documents.",
            "sources": []
        }

    # Join chunks (Fixed Indentation Here)
    context_text = "\n\n".join(
        [f"(Page {c['page_number']}) {c['content']}" for c in contexts]
    )

    # Prompt
    prompt = f"""
You are an AI assistant for answering questions using uploaded documents.

Answer ONLY from the provided context.
If the answer is not in context, say "Not found in document".

--------------------
Context:
{context_text}
--------------------

Question:
{question}

Answer clearly and professionally:
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.2,
        "max_tokens": 800
    }

    try:
        response = requests.post(
            GROQ_URL,
            json=payload,
            headers=headers,
            timeout=60
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to connect to AI server"
        )

    result = response.json()

    print("Groq Raw Response:", result)

    if "error" in result:
        return {
            "error": result["error"]["message"]
        }

    if "choices" in result:
        return {
            "answer": result["choices"][0]["message"]["content"],
            # Return the actual context list for citations
            "sources": contexts 
        }

    return {
        "error": "Unexpected response from Groq",
        "raw": result
    }