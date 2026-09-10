/**
 * Transport-agnostic error types. Every layer above (route handler, server
 * action, future REST/RPC endpoint) maps `status` and `code` to its own format.
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** Input failed validation. Message is safe to show to the end user. */
export class ValidationError extends AppError {
  constructor(code: string, message: string) {
    super(400, code, message);
  }
}

/** Caller is not signed in, or lacks the required role. */
export class AuthorizationError extends AppError {
  constructor(
    code: "unauthenticated" | "forbidden",
    message: string,
  ) {
    super(code === "unauthenticated" ? 401 : 403, code, message);
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

/** Request was valid but conflicts with current state (closed store, sold out). */
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

/** A dependency (database, storage) is unavailable. */
export class UnavailableError extends AppError {
  constructor(code: string, message: string) {
    super(503, code, message);
  }
}

/**
 * Kept so the existing checkout route keeps its public interface. New code
 * should throw the specific subclasses above.
 */
export class OrderError extends AppError {}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
