import { NextResponse } from "next/server";

// ============================================
// Standard Error Codes
// ============================================

export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  NOT_FOUND: "NOT_FOUND",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================
// ApiError Class
// ============================================

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = ERROR_STATUS_MAP[code];
    this.details = details;
  }

  toResponse(): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: this.code,
          message: this.message,
          ...(this.details ? { details: this.details } : {}),
        },
      },
      { status: this.status }
    );
  }
}

// ============================================
// Error Handler
// ============================================

/**
 * Convert an unknown caught error into a consistent NextResponse.
 *
 * - ApiError instances preserve their code/status.
 * - All other errors become INTERNAL_ERROR (500) with a safe message.
 * - Stack traces and sensitive details are never leaked.
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return error.toResponse();
  }

  // Log the real error server-side for debugging
  console.error("Unhandled API error:", error);

  const message =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred";

  return new ApiError(ErrorCode.INTERNAL_ERROR, message).toResponse();
}
