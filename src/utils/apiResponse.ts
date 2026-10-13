/**
 * Standardized API response for successful HTTP requests.
 *
 * This class defines the common structure that successful API
 * responses should follow throughout the application.
 *
 * Example response:
 *
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "data": {
 *     "id": "123",
 *     "name": "John"
 *   },
 *   "message": "User fetched successfully"
 * }
 *
 * Why this class exists:
 * - Keeps successful API responses consistent.
 * - Prevents individual controllers from creating different
 *   response structures.
 * - Provides strong TypeScript typing for response data.
 *
 * Error responses are intentionally NOT handled by this class.
 * Errors are represented by ApiError and processed centrally
 * by the global error-handling middleware.
 *
 * Therefore:
 *
 * ApiResponse → successful responses
 * ApiError    → application errors
 */
export class ApiResponse<T> {
  /**
   * Indicates that the API operation was successful.
   *
   * This is always true because ApiResponse represents only
   * successful API responses.
   *
   * Error responses are handled separately by the global
   * error-handling middleware.
   */
  public readonly success = true;

  /**
   * HTTP status code associated with the response.
   *
   * Examples:
   * - 200 → OK
   * - 201 → Resource created
   * - 204 → No content
   */
  public readonly statusCode: number;

  /**
   * The actual data returned by the API.
   *
   * The generic type <T> allows this class to remain strongly
   * typed regardless of what kind of data the endpoint returns.
   *
   * Examples:
   * ApiResponse<User>
   * ApiResponse<Resume>
   * ApiResponse<Resume[]>
   */
  public readonly data: T;

  /**
   * Human-readable message describing the result.
   */
  public readonly message: string;

  /**
   * Creates a standardized successful API response.
   *
   * @param statusCode - HTTP status code for the response.
   * @param data - Data returned to the client.
   * @param message - Optional human-readable success message.
   */
  constructor(statusCode: number, data: T, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
