from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List
import os
import requests
import shutil
import uvicorn

# RAG (Now using Pinecone)
from rag import load_pdf, chunk_text, build_index, search_docs

load_dotenv()

app = FastAPI(
    title="Enterprise Knowledge Hub API",
    description="Multi-Document Cloud RAG System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("❌ GROQ API KEY NOT LOADED")
else:
    print("✅ GROQ API KEY LOADED")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.get("/")
def home():
    return {
        "status": "Backend running 🚀",
        "engine": "Pinecone Cloud + Groq",
        "version": "2.0"
    }

@app.post("/upload")
def upload_pdf(files: List[UploadFile] = File(...)):
    os.makedirs("data", exist_ok=True)
    total_chunks = 0
    uploaded_files = []

    for file in files:
        file_path = f"data/{file.filename}"

        # Save temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract & Chunk
        text = load_pdf(file_path)
        chunks = chunk_text(text)

        # Index to Pinecone Cloud! (Pass the filename so we know where it came from)
        build_index(chunks, file.filename)

        total_chunks += len(chunks)
        uploaded_files.append(file.filename)
        
        # Clean up the local file since it is now safely in the cloud
        os.remove(file_path)

    return {
        "message": "PDFs uploaded & permanently indexed in the cloud!",
        "files": uploaded_files,
        "total_chunks": total_chunks
    }

@app.post("/ask")
def ask_ai(data: dict):
    question = data.get("question")

    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    # Search Pinecone Cloud
    contexts = search_docs(question)

    if not contexts:
        return {
            "answer": "No relevant information found in the uploaded documents.",
            "sources": []
        }

    # Join chunks
    context_text = "\n\n".join(
        [f"(Source: {c['source']} - Page {c['page_number']}) {c['content']}" for c in contexts]
    )

    prompt = f"""
    You are an Enterprise AI assistant for answering questions using uploaded documents.
    Answer ONLY from the provided context. If the answer is not in context, say "Not found in documents".

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
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "max_tokens": 800
    }

    try:
        response = requests.post(GROQ_URL, json=payload, headers=headers, timeout=60)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to connect to AI server")

    result = response.json()

    if "error" in result:
        return {"error": result["error"]["message"]}

    if "choices" in result:
        return {
            "answer": result["choices"][0]["message"]["content"],
            "sources": contexts 
        }

    return {"error": "Unexpected response from Groq", "raw": result}

# Railway Port Logic
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)