import os
import faiss
import numpy as np
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Global FAISS index
index = None
stored_chunks = []  # Will store dicts with metadata


# ------------------------
# Load PDF with page tracking
# ------------------------
def load_pdf(path):
    try:
        reader = PdfReader(path)
        pages = []

        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and text.strip():  # Check for non-empty text
                pages.append({
                    "page_number": i + 1,
                    "text": text
                })
        return pages
    except Exception as e:
        print(f"Error reading PDF {path}: {e}")
        return []


# ------------------------
# Split into chunks with metadata
# ------------------------
def chunk_text(pages, chunk_size=500):
    chunks = []

    for page in pages:
        text = page["text"]
        page_number = page["page_number"]

        for i in range(0, len(text), chunk_size):
            chunk_text = text[i:i+chunk_size]
            
            # Skip very small/empty chunks
            if len(chunk_text) < 50:
                continue

            chunks.append({
                "content": chunk_text,
                "page_number": page_number
            })

    return chunks


# ------------------------
# Build FAISS index (append support)
# ------------------------
def build_index(new_chunks):
    global index, stored_chunks

    # CRASH FIX: If no chunks, stop immediately
    if not new_chunks:
        print("⚠ No text chunks found to index.")
        return

    embeddings = model.encode([c["content"] for c in new_chunks])
    
    # Check if embeddings were actually generated
    if len(embeddings) == 0:
        return

    # Convert to numpy array if it's not already
    embeddings = np.array(embeddings)
    dimension = embeddings.shape[1]

    if index is None:
        index = faiss.IndexFlatL2(dimension)

    index.add(embeddings)
    stored_chunks.extend(new_chunks)


# ------------------------
# Search relevant docs with metadata
# ------------------------
def search_docs(query, top_k=3):
    global index, stored_chunks

    if index is None or not stored_chunks:
        return []

    query_embedding = model.encode([query])
    distances, indices = index.search(np.array(query_embedding), top_k)

    results = []

    for i in indices[0]:
        if i != -1 and i < len(stored_chunks):  # Check for invalid index
            results.append(stored_chunks[i])

    return results