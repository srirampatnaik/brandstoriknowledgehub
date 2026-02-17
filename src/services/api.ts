const API_BASE = "http://127.0.0.1:8000";

// =======================
// Upload PDF (Backend)
// =======================
export async function uploadPDF(files: File[]) {
  const formData = new FormData();

  // 1. Loop through all files
  // 2. Use the key "files" (plural) to match FastAPI
  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  return res.json();
}

// =======================
// Wrapper for UI (Progress)
// =======================
export async function uploadDocument(
  file: File,
  onProgress?: (pct: number) => void
) {
  // Fake progress animation
  if (onProgress) {
    for (let i = 0; i <= 90; i += 10) {
      await new Promise((r) => setTimeout(r, 80));
      onProgress(i);
    }
  }

  // Real upload
  // FIX IS HERE: We wrap the single 'file' in brackets [ ]
  const res = await uploadPDF([file]);

  if (onProgress) onProgress(100);

  return {
    id: Date.now().toString(),
    name: file.name,
    status: "indexed",
    backend: res,
  };
}

// =======================
// Ask AI (RAG)
// =======================
export async function askQuestion(question: string) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ask failed: ${err}`);
  }

  return res.json();
}