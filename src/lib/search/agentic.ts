/**
 * Agentic AI Search Service - Layer 3: Interactive AI with Tools
 *
 * Features:
 * - Multi-turn dialogue
 * - Tool calling (search, generate, analyze)
 * - Guided thinking
 * - Context accumulation
 */

import { generateText } from "ai";
import { getTextModel } from "@/lib/ai/providers";
import { v4 as uuidv4 } from "uuid";
import type {
  AgenticQuery,
  AgenticResponse,
  AgenticSessionState,
  AgenticStep,
  AgenticToolCall,
  AgenticThought,
  AgenticToolDefinition,
} from "@/lib/schemas";
import { searchWithPagefind, type ProcessedSearchResult } from "./pagefind";
import { getRAGPipeline } from "./rag";

// ============================================
// Tool Definitions
// ============================================

const AVAILABLE_TOOLS: AgenticToolDefinition[] = [
  {
    name: "search_docs",
    description: "Search the documentation for relevant information",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
        locale: {
          type: "string",
          description: "Language locale (en or zh)",
          enum: ["en", "zh"],
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_document",
    description: "Retrieve the full content of a specific document by URL",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The document URL",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "analyze_layout",
    description: "Analyze a lab layout and provide suggestions",
    parameters: {
      type: "object",
      properties: {
        layout: {
          type: "object",
          description: "The layout object to analyze",
        },
        focus: {
          type: "string",
          description: "What aspect to focus on (efficiency, safety, cost, etc.)",
        },
      },
      required: ["layout"],
    },
  },
  {
    name: "generate_suggestions",
    description: "Generate follow-up questions or suggestions based on context",
    parameters: {
      type: "object",
      properties: {
        context: {
          type: "string",
          description: "The current context",
        },
        type: {
          type: "string",
          description: "Type of suggestions (questions, actions, improvements)",
          enum: ["questions", "actions", "improvements"],
        },
      },
      required: ["context", "type"],
    },
  },
];

// ============================================
// Tool Implementations
// ============================================

type ToolResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

async function executeSearchDocs(input: { query: string; locale?: string }): Promise<ToolResult> {
  try {
    const results = await searchWithPagefind({
      query: input.query,
      locale: input.locale as "en" | "zh" | undefined,
      limit: 5,
    });

    return {
      success: true,
      data: {
        results: results.results.map((r) => ({
          title: r.title,
          url: r.url,
          excerpt: r.excerpt,
          score: r.score,
        })),
        total: results.total,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function executeGetDocument(input: { url: string }): Promise<ToolResult> {
  try {
    // In a real implementation, this would fetch the document
    // For now, we'll use Pagefind to search for the URL
    const results = await searchWithPagefind({
      query: input.url,
      limit: 1,
    });

    if (results.results.length > 0) {
      return {
        success: true,
        data: {
          url: results.results[0].url,
          title: results.results[0].title,
          content: results.results[0].excerpt,
        },
      };
    }

    return {
      success: false,
      error: "Document not found",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get document: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function executeAnalyzeLayout(input: { layout: unknown; focus?: string }): Promise<ToolResult> {
  try {
    const rag = getRAGPipeline();
    const result = await rag.query({
      query: `Analyze this lab layout focusing on ${input.focus || "overall efficiency"}: ${JSON.stringify(input.layout)}`,
      topK: 3,
    });

    return {
      success: true,
      data: {
        analysis: result.answer,
        confidence: result.confidence,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function executeGenerateSuggestions(input: {
  context: string;
  type: string;
}): Promise<ToolResult> {
  try {
    const model = getTextModel("claude-sonnet");
    const result = await generateText({
      model,
      system: `You are a helpful assistant. Generate ${input.type} based on the given context.`,
      prompt: `Context: ${input.context}\n\nGenerate 3-5 ${input.type}. Format as a JSON array of strings.`,
      temperature: 0.7,
    });

    // Try to parse as JSON array
    try {
      const suggestions = JSON.parse(result.text);
      return { success: true, data: { suggestions } };
    } catch {
      // If not JSON, return as single suggestion
      return { success: true, data: { suggestions: [result.text] } };
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate suggestions: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

async function executeTool(name: string, input: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case "search_docs":
      return executeSearchDocs(input as { query: string; locale?: string });
    case "get_document":
      return executeGetDocument(input as { url: string });
    case "analyze_layout":
      return executeAnalyzeLayout(input as { layout: unknown; focus?: string });
    case "generate_suggestions":
      return executeGenerateSuggestions(input as { context: string; type: string });
    default:
      return { success: false, error: `Unknown tool: ${name}` };
  }
}

// ============================================
// Session Management
// ============================================

const sessions: Map<string, AgenticSessionState> = new Map();

function createSession(): AgenticSessionState {
  const now = new Date();
  return {
    sessionId: uuidv4(),
    status: "idle",
    currentStep: 0,
    maxSteps: 10,
    steps: [],
    context: {
      documents: [],
      searchResults: [],
      userPreferences: {},
    },
    memory: {
      shortTerm: [],
      longTerm: {},
    },
    startedAt: now,
    updatedAt: now,
  };
}

function getSession(sessionId: string): AgenticSessionState | undefined {
  return sessions.get(sessionId);
}

function updateSession(session: AgenticSessionState): void {
  session.updatedAt = new Date();
  sessions.set(session.sessionId, session);
}

// ============================================
// Agentic Pipeline
// ============================================

export class AgenticPipeline {
  private model: string;
  private maxSteps: number;
  private tools: AgenticToolDefinition[];

  constructor(config: { model?: string; maxSteps?: number } = {}) {
    this.model = config.model || "claude-sonnet";
    this.maxSteps = config.maxSteps || 10;
    this.tools = AVAILABLE_TOOLS;
  }

  /**
   * Process an agentic query
   */
  async process(query: AgenticQuery): Promise<AgenticResponse> {
    const startTime = performance.now();

    // Get or create session
    let session = query.sessionId ? getSession(query.sessionId) : undefined;
    if (!session) {
      session = createSession();
    }

    session.status = "thinking";
    session.maxSteps = query.maxSteps || this.maxSteps;
    updateSession(session);

    // Add query to memory
    session.memory.shortTerm.push(query.query);

    const steps: AgenticStep[] = [];
    let finalAnswer = "";
    let iteration = 0;

    try {
      while (iteration < session.maxSteps && session.status !== "completed") {
        iteration++;

        // 1. Think about the query
        const thought = await this.think(query.query, session, steps);
        steps.push({
          id: uuidv4(),
          type: "thought",
          thought,
          timestamp: new Date(),
        });

        // 2. Decide on action
        const action = await this.decideAction(query.query, session, steps);

        if (action.type === "respond") {
          // Ready to respond
          finalAnswer = action.response || "";
          session.status = "completed";
          steps.push({
            id: uuidv4(),
            type: "response",
            response: finalAnswer,
            timestamp: new Date(),
          });
        } else if (action.type === "tool_call" && action.toolCall) {
          // Execute tool
          session.status = "executing";
          updateSession(session);

          const toolCall: AgenticToolCall = {
            ...action.toolCall,
            status: "running",
            timestamp: new Date(),
          };

          const result = await executeTool(toolCall.name, toolCall.input);

          toolCall.status = result.success ? "completed" : "failed";
          toolCall.output = result.data;
          toolCall.error = result.error;

          steps.push({
            id: uuidv4(),
            type: "tool_call",
            toolCall,
            timestamp: new Date(),
          });

          // Add result to context
          if (result.success && result.data) {
            session.context.searchResults.push(result.data);
          }
        } else if (action.type === "clarify") {
          // Need more information
          session.status = "waiting_input";
          finalAnswer = action.response || "Could you please clarify your question?";
          steps.push({
            id: uuidv4(),
            type: "response",
            response: finalAnswer,
            timestamp: new Date(),
          });
          break;
        }

        session.currentStep = iteration;
        updateSession(session);
      }

      // Generate follow-up questions
      const followUpQuestions = await this.generateFollowUps(query.query, session, steps);

      // Calculate confidence
      const toolSuccesses = steps.filter(
        (s) => s.type === "tool_call" && s.toolCall?.status === "completed"
      ).length;
      const totalToolCalls = steps.filter((s) => s.type === "tool_call").length;
      const confidence = totalToolCalls > 0 ? toolSuccesses / totalToolCalls : 0.7;

      session.steps = steps;
      updateSession(session);

      const endTime = performance.now();

      return {
        sessionId: session.sessionId,
        answer: finalAnswer,
        steps,
        sources: this.extractSources(steps),
        followUpQuestions,
        actions: this.extractActions(steps),
        confidence,
        processingTime: endTime - startTime,
      };
    } catch (error) {
      session.status = "error";
      session.error = error instanceof Error ? error.message : "Unknown error";
      updateSession(session);

      throw error;
    }
  }

  /**
   * Generate a thought about the query
   */
  private async think(
    query: string,
    session: AgenticSessionState,
    steps: AgenticStep[]
  ): Promise<AgenticThought> {
    const context = this.buildContext(session, steps);

    const prompt = `You are an AI assistant analyzing a user's question.

Previous context:
${context}

User question: ${query}

Think step by step about:
1. What is the user really asking?
2. What information do you need to answer this?
3. What tools might be helpful?

Provide your observation in 1-2 sentences.`;

    const model = getTextModel(this.model);
    const result = await generateText({
      model,
      prompt,
      temperature: 0.5,
    });

    return {
      type: "observation",
      content: result.text,
      timestamp: new Date(),
    };
  }

  /**
   * Decide what action to take next
   */
  private async decideAction(
    query: string,
    session: AgenticSessionState,
    steps: AgenticStep[]
  ): Promise<{
    type: "respond" | "tool_call" | "clarify";
    response?: string;
    toolCall?: Omit<AgenticToolCall, "status" | "timestamp">;
  }> {
    const context = this.buildContext(session, steps);
    const toolDescriptions = this.tools
      .map((t) => `- ${t.name}: ${t.description}`)
      .join("\n");

    const prompt = `You are an AI assistant deciding how to help a user.

Available tools:
${toolDescriptions}

Previous context:
${context}

User question: ${query}

Based on your analysis, decide:
1. If you have enough information to answer, respond with: ACTION: respond
   Then provide your answer.
2. If you need more information, respond with: ACTION: tool_call
   Then specify: TOOL: <tool_name>
   INPUT: <json_input>
3. If the question is unclear, respond with: ACTION: clarify
   Then ask a clarifying question.

Remember: Only use tools if necessary. If you can answer directly, do so.`;

    const model = getTextModel(this.model);
    const result = await generateText({
      model,
      prompt,
      temperature: 0.3,
    });

    const text = result.text;

    // Parse the response
    if (text.includes("ACTION: respond")) {
      const responseMatch = text.match(/ACTION: respond\s*([\s\S]*)/i);
      return {
        type: "respond",
        response: responseMatch ? responseMatch[1].trim() : text,
      };
    }

    if (text.includes("ACTION: tool_call")) {
      const toolMatch = text.match(/TOOL:\s*(\w+)/i);
      const inputMatch = text.match(/INPUT:\s*(\{[\s\S]*?\})/i);

      if (toolMatch) {
        let input = {};
        if (inputMatch) {
          try {
            input = JSON.parse(inputMatch[1]);
          } catch {
            input = { query };
          }
        }

        return {
          type: "tool_call",
          toolCall: {
            id: uuidv4(),
            name: toolMatch[1],
            input,
          },
        };
      }
    }

    if (text.includes("ACTION: clarify")) {
      const clarifyMatch = text.match(/ACTION: clarify\s*([\s\S]*)/i);
      return {
        type: "clarify",
        response: clarifyMatch ? clarifyMatch[1].trim() : "Could you please clarify your question?",
      };
    }

    // Default to respond with the full text
    return {
      type: "respond",
      response: text,
    };
  }

  /**
   * Build context string from session and steps
   */
  private buildContext(session: AgenticSessionState, steps: AgenticStep[]): string {
    const parts: string[] = [];

    // Add memory
    if (session.memory.shortTerm.length > 0) {
      parts.push(`Previous queries: ${session.memory.shortTerm.slice(-3).join(", ")}`);
    }

    // Add recent steps
    const recentSteps = steps.slice(-5);
    for (const step of recentSteps) {
      if (step.type === "thought" && step.thought) {
        parts.push(`Thought: ${step.thought.content}`);
      }
      if (step.type === "tool_call" && step.toolCall) {
        parts.push(
          `Tool ${step.toolCall.name}: ${step.toolCall.status === "completed" ? "Success" : "Failed"}`
        );
        if (step.toolCall.output) {
          parts.push(`Result: ${JSON.stringify(step.toolCall.output).slice(0, 200)}...`);
        }
      }
    }

    return parts.join("\n") || "No previous context.";
  }

  /**
   * Generate follow-up questions
   */
  private async generateFollowUps(
    query: string,
    session: AgenticSessionState,
    steps: AgenticStep[]
  ): Promise<string[]> {
    try {
      const context = this.buildContext(session, steps);

      const model = getTextModel(this.model);
      const result = await generateText({
        model,
        prompt: `Based on this conversation about "${query}" and context: ${context}

Generate 3 brief follow-up questions the user might want to ask. Format as a JSON array of strings.`,
        temperature: 0.7,
      });

      try {
        return JSON.parse(result.text);
      } catch {
        return [];
      }
    } catch {
      return [];
    }
  }

  /**
   * Extract sources from steps
   */
  private extractSources(
    steps: AgenticStep[]
  ): Array<{ title: string; url: string; excerpt: string }> {
    const sources: Array<{ title: string; url: string; excerpt: string }> = [];

    for (const step of steps) {
      if (step.type === "tool_call" && step.toolCall?.output) {
        const output = step.toolCall.output as { results?: ProcessedSearchResult[] };
        if (output.results) {
          for (const result of output.results) {
            sources.push({
              title: result.title,
              url: result.url,
              excerpt: result.excerpt,
            });
          }
        }
      }
    }

    return sources;
  }

  /**
   * Extract actions from steps
   */
  private extractActions(
    steps: AgenticStep[]
  ): Array<{ type: string; description: string; data?: unknown }> {
    return steps
      .filter((s) => s.type === "tool_call" && s.toolCall)
      .map((s) => ({
        type: s.toolCall!.name,
        description: `Called ${s.toolCall!.name}`,
        data: s.toolCall!.output,
      }));
  }
}

// Singleton instance
let agenticPipelineInstance: AgenticPipeline | null = null;

export function getAgenticPipeline(config?: { model?: string; maxSteps?: number }): AgenticPipeline {
  if (!agenticPipelineInstance) {
    agenticPipelineInstance = new AgenticPipeline(config);
  }
  return agenticPipelineInstance;
}

/**
 * Perform agentic search
 */
export async function searchWithAgent(query: AgenticQuery): Promise<AgenticResponse> {
  const pipeline = getAgenticPipeline();
  return pipeline.process(query);
}
