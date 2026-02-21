import os
import uuid
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from pinecone import Pinecone

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to Pinecone Cloud Database
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = "enterprise-knowledge"
pinecone_index = pc.Index(index_name)

# ------------------------
# Load PDF with page tracking
# ------------------------
def load_pdf(path):
    try:
        reader = PdfReader(path)
        pages = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and text.strip():
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
            chunk_content = text[i:i+chunk_size]
            if len(chunk_content) < 50:
                continue

            chunks.append({
                "content": chunk_content,
                "page_number": page_number
            })
    return chunks

# ------------------------
# Build Pinecone Index (Cloud Upload)
# ------------------------
def build_index(new_chunks, filename):
    if not new_chunks:
        print("⚠ No text chunks found to index.")
        return

    vectors = []
    for chunk in new_chunks:
        chunk_id = str(uuid.uuid4())
        
        # Convert text to numbers
        embedding = model.encode(chunk["content"]).tolist()
        
        # Attach text data so AI can read it later
        metadata = {
            "content": chunk["content"],
            "page_number": chunk["page_number"],
            "source": filename
        }
        
        vectors.append({"id": chunk_id, "values": embedding, "metadata": metadata})

    # Upload to Pinecone in batches
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        pinecone_index.upsert(vectors=vectors[i:i+batch_size])

# ------------------------
# Search relevant docs (Cloud Pull)
# ------------------------
def search_docs(query, top_k=3):
    query_embedding = model.encode(query).tolist()
    
    # Search Pinecone database
    results = pinecone_index.query(
        vector=query_embedding, 
        top_k=top_k, 
        include_metadata=True
    )
    
    # Format results
    contexts = []
    for match in results["matches"]:
        contexts.append({
            "content": match["metadata"]["content"],
            "page_number": int(match["metadata"]["page_number"]),
            "source": match["metadata"]["source"]
        })
        
    return contexts