export interface Document {
  id: string;
  name: string;
  folderId: string;
  status: 'indexed' | 'processing' | 'failed';
  tags: string[];
  uploadDate: string;
  pageCount: number;
  size: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children?: Folder[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceRef[];
}

export interface SourceRef {
  docId: string;
  docName: string;
  page: number;
  excerpt: string;
  relevance: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  messageCount: number;
}

export const folders: Folder[] = [
  { id: 'f1', name: 'Research Papers', parentId: null },
  { id: 'f2', name: 'Product Docs', parentId: null },
  { id: 'f3', name: 'Legal', parentId: null },
  { id: 'f4', name: 'Q4 Reports', parentId: 'f2' },
  { id: 'f5', name: 'API Specs', parentId: 'f2' },
];

export const documents: Document[] = [
  { id: 'd1', name: 'Market Analysis 2025.pdf', folderId: 'f1', status: 'indexed', tags: ['research', 'market'], uploadDate: '2025-12-15', pageCount: 42, size: '3.2 MB' },
  { id: 'd2', name: 'Product Roadmap.pdf', folderId: 'f2', status: 'indexed', tags: ['product', 'strategy'], uploadDate: '2025-12-20', pageCount: 18, size: '1.8 MB' },
  { id: 'd3', name: 'NDA Template.pdf', folderId: 'f3', status: 'indexed', tags: ['legal', 'template'], uploadDate: '2025-11-10', pageCount: 6, size: '420 KB' },
  { id: 'd4', name: 'Q4 Revenue Report.pdf', folderId: 'f4', status: 'processing', tags: ['finance', 'quarterly'], uploadDate: '2026-01-05', pageCount: 28, size: '5.1 MB' },
  { id: 'd5', name: 'API v3 Specification.pdf', folderId: 'f5', status: 'indexed', tags: ['technical', 'api'], uploadDate: '2025-12-01', pageCount: 64, size: '2.4 MB' },
  { id: 'd6', name: 'Competitive Landscape.pdf', folderId: 'f1', status: 'failed', tags: ['research', 'competitive'], uploadDate: '2026-01-12', pageCount: 0, size: '8.7 MB' },
  { id: 'd7', name: 'Brand Guidelines.pdf', folderId: 'f2', status: 'indexed', tags: ['brand', 'design'], uploadDate: '2025-10-22', pageCount: 34, size: '12.3 MB' },
  { id: 'd8', name: 'User Research Summary.pdf', folderId: 'f1', status: 'indexed', tags: ['research', 'ux'], uploadDate: '2026-02-01', pageCount: 22, size: '1.9 MB' },
];

export const conversations: Conversation[] = [
  { id: 'c1', title: 'Market trends analysis', lastMessage: 'Based on the Q4 report...', date: '2026-02-15', messageCount: 12 },
  { id: 'c2', title: 'API integration questions', lastMessage: 'The v3 endpoint supports...', date: '2026-02-14', messageCount: 8 },
  { id: 'c3', title: 'Legal compliance review', lastMessage: 'The NDA template covers...', date: '2026-02-13', messageCount: 5 },
  { id: 'c4', title: 'Product strategy discussion', lastMessage: 'According to the roadmap...', date: '2026-02-10', messageCount: 15 },
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: "Welcome to Brandstori AI! I'm your knowledge assistant. I can help you find insights across your document library, answer questions about your indexed content, and provide source-backed analysis. What would you like to explore?",
    timestamp: '2026-02-15T09:00:00Z',
  },
];

export const sampleAIResponse = `Based on the **Market Analysis 2025** report, here are the key findings:

1. **Total addressable market** grew by 23% year-over-year, reaching $4.2B
2. **AI-powered solutions** captured 38% of new enterprise deals in Q4
3. **Customer retention rates** improved to 94% among organizations using integrated knowledge platforms

The report particularly highlights that companies investing in AI knowledge management saw a **2.7x improvement** in employee productivity for information retrieval tasks.

Notably, the competitive landscape analysis suggests that the market is consolidating around platforms that offer **unified document intelligence** combined with conversational interfaces.`;

export const sampleSources: SourceRef[] = [
  { docId: 'd1', docName: 'Market Analysis 2025.pdf', page: 12, excerpt: 'Total addressable market grew by 23% year-over-year, reaching $4.2B in enterprise knowledge management.', relevance: 0.95 },
  { docId: 'd2', docName: 'Product Roadmap.pdf', page: 5, excerpt: 'AI-powered solutions captured 38% of new enterprise deals in Q4, driven by demand for unified platforms.', relevance: 0.87 },
  { docId: 'd8', docName: 'User Research Summary.pdf', page: 8, excerpt: 'Organizations using integrated knowledge platforms reported 2.7x improvement in information retrieval productivity.', relevance: 0.82 },
];

export const analyticsData = {
  totalQueries: 12847,
  documentsIndexed: 342,
  activeUsers: 89,
  avgResponseTime: '1.2s',
  tokenUsage: [
    { date: 'Jan 1', input: 45000, output: 32000 },
    { date: 'Jan 8', input: 52000, output: 38000 },
    { date: 'Jan 15', input: 48000, output: 35000 },
    { date: 'Jan 22', input: 61000, output: 44000 },
    { date: 'Jan 29', input: 58000, output: 41000 },
    { date: 'Feb 5', input: 67000, output: 49000 },
    { date: 'Feb 12', input: 72000, output: 53000 },
  ],
  recentActivity: [
    { id: 'a1', type: 'query', user: 'Sarah Chen', action: 'Asked about Q4 market trends', time: '2 min ago' },
    { id: 'a2', type: 'upload', user: 'James Wilson', action: 'Uploaded Competitive Landscape.pdf', time: '15 min ago' },
    { id: 'a3', type: 'query', user: 'Maya Patel', action: 'Analyzed product roadmap priorities', time: '32 min ago' },
    { id: 'a4', type: 'error', user: 'System', action: 'Failed to index Competitive Landscape.pdf', time: '45 min ago' },
    { id: 'a5', type: 'upload', user: 'Alex Kim', action: 'Uploaded User Research Summary.pdf', time: '1 hr ago' },
    { id: 'a6', type: 'query', user: 'Sarah Chen', action: 'Queried NDA compliance requirements', time: '2 hr ago' },
  ],
  errorLog: [
    { id: 'e1', timestamp: '2026-02-15 08:45:12', type: 'Upload Failed', message: 'File exceeds maximum size limit (50MB)', document: 'Competitive Landscape.pdf', status: 'unresolved' },
    { id: 'e2', timestamp: '2026-02-14 14:22:08', type: 'Indexing Error', message: 'OCR failed on scanned pages 12-15', document: 'Legacy Report.pdf', status: 'resolved' },
    { id: 'e3', timestamp: '2026-02-13 09:11:45', type: 'Query Timeout', message: 'Response generation exceeded 30s limit', document: 'N/A', status: 'resolved' },
  ],
};
