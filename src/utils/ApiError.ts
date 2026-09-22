/**
 * Custom application error used for expected API failures.
 *
 * Extends the native Error class with:
 * - HTTP status code
 * - Operational/non-operational classification
 *
 * This allows the global error-handling middleware to decide
 * how an error should be logged and what response should be
 * returned to the client.
 */
export class ApiError extends Error {
  /**
   * HTTP status code that should be returned to the client.
   *
   * Examples:
   * 400 -> Bad Request
   * 401 -> Unauthorized
   * 404 -> Not Found
   * 500 -> Internal Server Error
   */
  public readonly statusCode: number;

  /**
   * Indicates whether this error is an expected application error.
   *
   * Operational errors are expected conditions such as:
   * - Invalid input
   * - Resource not found
   * - Authentication failure
   * - Permission failure
   *
   * Non-operational errors generally indicate unexpected
   * programming or infrastructure failures.
   */
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true
  ) {
    super(message);

    // Override the default Error name for easier identification
    // in logs and error-handling middleware.
    this.name = "ApiError";

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Preserve the original location where the error was created
    // instead of pointing the stack trace to this constructor.
    Error.captureStackTrace(this, ApiError);
  }

  /**
   * Creates a 400 Bad Request error.
   *
   * Use when the client sends invalid or malformed data.
   */
  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  /**
   * Creates a 401 Unauthorized error.
   *
   * Use when authentication is missing or invalid.
   */
  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  /**
   * Creates a 403 Forbidden error.
   *
   * Use when the user is authenticated but does not
   * have permission to perform the requested operation.
   */
  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(403, message);
  }

  /**
   * Creates a 404 Not Found error.
   *
   * Use when a requested resource does not exist.
   */
  static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  /**
   * Creates a 409 Conflict error.
   *
   * Use when the request conflicts with the current
   * state of the application.
   *
   * Example:
   * - Registering an email that already exists.
   */
  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  /**
   * Creates a 500 Internal Server Error.
   *
   * Internal errors are marked as non-operational because
   * they generally represent unexpected application,
   * database, infrastructure, or programming failures.
   *
   * The actual underlying error should be logged internally
   * rather than exposed to the client.
   */
  static internal(
    message = "Internal server error"
  ): ApiError {
    return new ApiError(500, message, false);
  }
}