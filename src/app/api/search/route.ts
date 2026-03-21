/**
 * Search API Endpoint
 *
 * Unified search with automatic escalation between layers:
 * - basic: Pagefind full-text search
 * - semantic: RAG with AI synthesis
 * - agentic: Interactive AI with tools
 */

import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";
import { UnifiedSearchQuerySchema } from "@/lib/schemas";
import { ApiError, ErrorCode, handleApiError } from "@/lib/api-error";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const parseResult = UnifiedSearchQuerySchema.safeParse(body);

    if (!parseResult.success) {
      return new ApiError(
        ErrorCode.VALIDATION_ERROR,
        "Invalid request body",
        { issues: parseResult.error.issues }
      ).toResponse();
    }

    const query = parseResult.data;

    // Perform search
    const response = await search({
      query: query.query,
      mode: query.mode,
      locale: query.locale,
      limit: query.limit,
      autoEscalate: query.autoEscalate,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return new ApiError(ErrorCode.VALIDATION_ERROR, "Query parameter 'q' is required").toResponse();
    }

    const mode = searchParams.get("mode") as "auto" | "basic" | "semantic" | "agentic" | null;
    const locale = searchParams.get("locale") as "en" | "zh" | null;
    const limit = searchParams.get("limit");

    // Perform search
    const response = await search({
      query,
      mode: mode || "auto",
      locale: locale || undefined,
      limit: limit ? parseInt(limit, 10) : 10,
      autoEscalate: true,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return handleApiError(error);
  }
}
