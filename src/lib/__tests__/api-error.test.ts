import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, ErrorCode, handleApiError } from '../api-error';

// Mock next/server's NextResponse.json
vi.mock('next/server', () => {
  class MockNextResponse {
    body: unknown;
    status: number;

    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }

    static json(data: unknown, init?: { status?: number }) {
      return new MockNextResponse(data, init);
    }

    // Allow tests to read the JSON payload
    async json() {
      return this.body;
    }
  }

  return { NextResponse: MockNextResponse };
});

describe('ApiError', () => {
  it('constructs with correct code, message, and status', () => {
    const err = new ApiError(ErrorCode.VALIDATION_ERROR, 'Bad input');
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('Bad input');
    expect(err.status).toBe(400);
    expect(err.name).toBe('ApiError');
  });

  it('maps each error code to the correct HTTP status', () => {
    const cases: Array<[ErrorCode, number]> = [
      [ErrorCode.VALIDATION_ERROR, 400],
      [ErrorCode.UNAUTHORIZED, 401],
      [ErrorCode.NOT_FOUND, 404],
      [ErrorCode.RATE_LIMITED, 429],
      [ErrorCode.INTERNAL_ERROR, 500],
      [ErrorCode.SERVICE_UNAVAILABLE, 503],
    ];

    for (const [code, expectedStatus] of cases) {
      const err = new ApiError(code, 'test');
      expect(err.status).toBe(expectedStatus);
    }
  });

  it('toResponse returns correct JSON shape', async () => {
    const err = new ApiError(ErrorCode.NOT_FOUND, 'Resource missing', {
      id: '123',
    });
    const res = err.toResponse();

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource missing',
        details: { id: '123' },
      },
    });
  });

  it('toResponse omits details when not provided', async () => {
    const err = new ApiError(ErrorCode.UNAUTHORIZED, 'No token');
    const res = err.toResponse();
    const body = await res.json();
    expect(body.error).not.toHaveProperty('details');
  });
});

describe('handleApiError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns the ApiError response when given an ApiError', async () => {
    const err = new ApiError(ErrorCode.RATE_LIMITED, 'Slow down');
    const res = handleApiError(err);

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error.code).toBe('RATE_LIMITED');
  });

  it('wraps unknown errors as INTERNAL_ERROR (500)', async () => {
    const res = handleApiError(new TypeError('something broke'));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.code).toBe('INTERNAL_ERROR');
    expect(body.error.message).toBe('something broke');
  });

  it('handles non-Error values gracefully', async () => {
    const res = handleApiError('string error');

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.code).toBe('INTERNAL_ERROR');
    expect(body.error.message).toBe('An unexpected error occurred');
  });
});
