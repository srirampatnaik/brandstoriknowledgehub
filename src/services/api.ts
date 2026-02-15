import axios from 'axios';
import { documents, sampleAIResponse, sampleSources, conversations, type ChatMessage, type SourceRef } from '@/data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Mock delay helper
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Mock: GET /documents
export async function fetchDocuments() {
  await delay(400);
  return documents;
}

// Mock: POST /upload
export async function uploadDocument(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ id: string; name: string; status: string }> {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await delay(200);
    onProgress?.(i);
  }
  return { id: `d${Date.now()}`, name: file.name, status: 'processing' };
}

// Mock: POST /ask — streams character by character via callback
export async function askQuestion(
  question: string,
  onChunk: (text: string) => void,
  onSources: (sources: SourceRef[]) => void
): Promise<void> {
  await delay(800);
  const chars = sampleAIResponse.split('');
  for (let i = 0; i < chars.length; i++) {
    await delay(12);
    onChunk(chars[i]);
  }
  onSources(sampleSources);
}

// Mock: GET /history
export async function fetchHistory() {
  await delay(300);
  return conversations;
}

export default apiClient;
