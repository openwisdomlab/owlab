/**
 * RAG Search Service - Layer 2: Semantic Search with AI
 *
 * Features:
 * - Vector similarity search
 * - Multi-document synthesis
 * - Intent understanding
 * - Context-aware answers
 */

import { generateText } from "ai";
import { getTextModel } from "@/lib/ai/providers";
import type { RAGChunk, RAGResponse } from "@/lib/schemas";

// Local query options type with optional fields
interface RAGQueryOptions {
  query: string;
  topK?: number;
  filter?: Record<string, unknown>;
  includeMetadata?: boolean;
  minScore?: number;
}

// ============================================
// Vector Store Interface (pluggable)
// ============================================

export interface VectorStore {
  upsert(chunks: RAGChunk[]): Promise<void>;
  query(embedding: number[], topK: number, filter?: Record<string, unknown>): Promise<RAGChunk[]>;
  delete(ids: string[]): Promise<void>;
}

// ============================================
// In-Memory Vector Store (for development)
// ============================================

class InMemoryVectorStore implements VectorStore {
  private chunks: Map<string, RAGChunk> = new Map();

  async upsert(chunks: RAGChunk[]): Promise<void> {
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk);
    }
  }

  async query(
    embedding: number[],
    topK: number,
    filter?: Record<string, unknown>
  ): Promise<RAGChunk[]> {
    const results: Array<{ chunk: RAGChunk; score: number }> = [];

    for (const chunk of this.chunks.values()) {
      // Apply filter if provided
      if (filter && chunk.metadata) {
        const matches = Object.entries(filter).every(
          ([key, value]) => chunk.metadata[key as keyof typeof chunk.metadata] === value
        );
        if (!matches) continue;
      }

      // Calculate cosine similarity
      if (chunk.embedding) {
        const score = cosineSimilarity(embedding, chunk.embedding);
        results.push({ chunk: { ...chunk, score }, score });
      }
    }

    // Sort by score and return top K
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((r) => r.chunk);
  }

  async delete(ids: string[]): Promise<void> {
    for (const id of ids) {
      this.chunks.delete(id);
    }
  }
}

// Cosine similarity calculation
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================
// Embedding Service
// ============================================

export interface EmbeddingService {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

class MockEmbeddingService implements EmbeddingService {
  // Mock embedding for development (returns random vectors)
  async embed(text: string): Promise<number[]> {
    // In production, use OpenAI or other embedding API
    const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const vector = Array.from({ length: 384 }, (_, i) =>
      Math.sin(hash + i) * 0.5 + Math.random() * 0.5
    );
    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}

// ============================================
// RAG Pipeline
// ============================================

export interface RAGConfig {
  vectorStore?: VectorStore;
  embeddingService?: EmbeddingService;
  model?: string;
  topK?: number;
  minScore?: number;
}

export class RAGPipeline {
  private vectorStore: VectorStore;
  private embeddingService: EmbeddingService;
  private model: string;
  private topK: number;
  private minScore: number;

  constructor(config: RAGConfig = {}) {
    this.vectorStore = config.vectorStore || new InMemoryVectorStore();
    this.embeddingService = config.embeddingService || new MockEmbeddingService();
    this.model = config.model || "claude-sonnet";
    this.topK = config.topK || 5;
    this.minScore = config.minScore || 0.7;
  }

  /**
   * Index documents into the vector store
   */
  async indexDocuments(documents: Array<{ id: string; content: string; metadata?: Record<string, string> }>): Promise<void> {
    const chunks: RAGChunk[] = [];

    for (const doc of documents) {
      // Split document into chunks (simple implementation)
      const docChunks = this.splitIntoChunks(doc.content, 500);

      for (let i = 0; i < docChunks.length; i++) {
        const embedding = await this.embeddingService.embed(docChunks[i]);
        chunks.push({
          id: `${doc.id}-chunk-${i}`,
          documentId: doc.id,
          content: docChunks[i],
          embedding,
          metadata: {
            ...doc.metadata,
            position: i,
          },
        });
      }
    }

    await this.vectorStore.upsert(chunks);
  }

  /**
   * Split text into chunks with overlap
   */
  private splitIntoChunks(text: string, chunkSize: number, overlap: number = 50): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    let currentChunk = "";

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        // Start new chunk with overlap from previous
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = overlapText + sentence;
      } else {
        currentChunk += " " + sentence;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Perform RAG query
   */
  async query(queryOptions: RAGQueryOptions): Promise<RAGResponse> {
    const startTime = performance.now();

    // 1. Embed the query
    const queryEmbedding = await this.embeddingService.embed(queryOptions.query);

    // 2. Retrieve relevant chunks
    const relevantChunks = await this.vectorStore.query(
      queryEmbedding,
      queryOptions.topK || this.topK,
      queryOptions.filter
    );

    // 3. Filter by minimum score
    const filteredChunks = relevantChunks.filter(
      (chunk) => (chunk.score || 0) >= (queryOptions.minScore || this.minScore)
    );

    // 4. Generate answer using retrieved context
    const context = filteredChunks.map((chunk) => chunk.content).join("\n\n---\n\n");

    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context.
Always cite your sources when possible. If the context doesn't contain enough information to answer the question,
say so clearly. Be concise but thorough.`;

    const userPrompt = `Context:
${context}

Question: ${queryOptions.query}

Please answer the question based on the context provided. If the context doesn't contain relevant information, indicate that clearly.`;

    let answer = "Unable to generate answer.";
    let confidence = 0.5;

    try {
      const model = getTextModel(this.model);
      const result = await generateText({
        model,
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.3,
      });

      answer = result.text;
      confidence = filteredChunks.length > 0
        ? Math.min(1, filteredChunks.reduce((sum, c) => sum + (c.score || 0), 0) / filteredChunks.length)
        : 0.3;
    } catch (error) {
      console.error("RAG generation error:", error);
      answer = "I apologize, but I encountered an error generating a response. Please try again.";
    }

    const endTime = performance.now();

    return {
      answer,
      sources: filteredChunks,
      confidence,
      query: queryOptions.query,
      processingTime: endTime - startTime,
    };
  }

  /**
   * Hybrid search: combine Pagefind results with semantic search
   */
  async hybridSearch(
    query: string,
    pagefindResults: Array<{ url: string; content: string; title: string }>,
    options: { topK?: number; minScore?: number } = {}
  ): Promise<RAGResponse> {
    // Use Pagefind results as the document context
    const context = pagefindResults
      .map((r) => `## ${r.title}\n${r.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are a helpful AI assistant for AI Space documentation.
Based on the search results provided, synthesize a comprehensive answer to the user's question.
Cite specific sections when relevant. Be concise but thorough.`;

    const userPrompt = `Search Results:
${context}

User Question: ${query}

Please provide a helpful answer based on the search results above.`;

    const startTime = performance.now();

    let answer = "Unable to generate answer from search results.";
    let confidence = 0.5;

    try {
      const model = getTextModel(this.model);
      const result = await generateText({
        model,
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.3,
      });

      answer = result.text;
      confidence = pagefindResults.length > 0 ? 0.8 : 0.3;
    } catch (error) {
      console.error("Hybrid search error:", error);
    }

    const endTime = performance.now();

    return {
      answer,
      sources: pagefindResults.map((r, i) => ({
        id: `result-${i}`,
        documentId: r.url,
        content: r.content,
        metadata: {
          title: r.title,
          url: r.url,
        },
      })),
      confidence,
      query,
      processingTime: endTime - startTime,
    };
  }
}

// Singleton instance
let ragPipelineInstance: RAGPipeline | null = null;

export function getRAGPipeline(config?: RAGConfig): RAGPipeline {
  if (!ragPipelineInstance) {
    ragPipelineInstance = new RAGPipeline(config);
  }
  return ragPipelineInstance;
}

/**
 * Perform RAG search
 */
export async function searchWithRAG(query: RAGQueryOptions): Promise<RAGResponse> {
  const pipeline = getRAGPipeline();
  return pipeline.query(query);
}

// Re-export the query options type for external use
export type { RAGQueryOptions };
