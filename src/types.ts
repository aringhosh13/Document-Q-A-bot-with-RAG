export type DocumentCategory = 'academic' | 'research' | 'user_upload' | 'technical';

export interface DocumentChunk {
  id: string;
  docId: string;
  docTitle: string;
  chunkIndex: number;
  totalChunks: number;
  text: string;
  charStart: number;
  charEnd: number;
  tokenEstimate: number;
  vector?: number[];
  norm?: number;
  sparseTerms?: Record<string, number>;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  institution?: 'Computer Science' | 'AI & Data Science' | 'Information Systems' | 'Systems & Design' | 'General AI' | string;
  summary: string;
  content: string;
  charCount: number;
  wordCount: number;
  pageCount: number;
  dateAdded: string;
  fileType: 'pdf' | 'txt' | 'md' | 'code';
  chunks: DocumentChunk[];
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  similarity: number;
  denseScore: number;
  sparseScore: number;
  rank: number;
  isCited?: boolean;
}

export interface GroundingClaim {
  claim: string;
  supported: boolean;
  sourceChunk: number;
  explanation: string;
}

export interface RAGMetrics {
  faithfulnessScore: number;
  answerRelevanceScore: number;
  contextPrecisionScore: number;
  groundingBreakdown: GroundingClaim[];
  overallVerdict: 'High Quality Grounded' | 'Partially Grounded' | 'Hallucination Risk';
  feedback: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  retrievedChunks?: RetrievalResult[];
  citedIndices?: number[];
  latencyMs?: number;
  retrievalLatencyMs?: number;
  generationLatencyMs?: number;
  modelUsed?: string;
  rawPrompt?: string;
  systemInstruction?: string;
  ragMetrics?: RAGMetrics;
}

export interface ChunkingConfig {
  strategy: 'recursive' | 'fixed' | 'sentence' | 'paragraph';
  chunkSize: number;
  chunkOverlap: number;
  minChunkSize: number;
}

export interface RetrievalConfig {
  topK: number;
  similarityThreshold: number;
  hybridAlpha: number; // 1.0 = 100% Dense, 0.0 = 100% Sparse (BM25), 0.7 = Hybrid
  rerankEnabled: boolean;
  strictGrounding: boolean;
  temperature: number;
}

export interface AdmissionsTopic {
  id: string;
  university: 'Computer Science' | 'AI & Data Science' | 'Information Systems' | 'Systems & Design' | 'General';
  category: 'System Architecture' | 'Vector Math & Retrieval' | 'Hallucination & Guardrails' | 'Engineering & Scalability' | 'Project Pitch';
  question: string;
  difficulty: 'Fundamental' | 'Intermediate' | 'Advanced' | 'System Design';
  answer: string;
  keyTakeaways: string[];
  formula?: string;
  codeSnippet?: string;
  interviewerPerspective: string;
}
