/**
 * ============================================================================
 * API Response Utility
 * ============================================================================
 *
 * Centralized helper for returning consistent JSON responses from API routes.
 *
 * Example:
 *
 * return apiResponse(
 *   true,
 *   "User created successfully.",
 *   201,
 *   user
 * );
 *
 * Response:
 * {
 *   success: true,
 *   message: "User created successfully.",
 *   data: { ... }
 * }
 *
 * ============================================================================
 */

type ApiResponse<T = undefined> = {
  /**
   * Indicates whether the request completed successfully.
   */
  success: boolean;

  /**
   * Human-readable response message.
   */
  message: string;

  /**
   * Optional response payload.
   */
  data?: T;
};

/**
 * Creates a standardized JSON response for API routes.
 *
 * @template T Type of response payload.
 *
 * @param success Indicates whether the request succeeded.
 * @param message Human-readable response message.
 * @param status HTTP status code.
 * @param data Optional response payload.
 *
 * @returns JSON Response
 */
export function apiResponse<T = undefined>(
  success: boolean,
  message: string,
  status: number,
  data?: T
): Response {
  const responseBody: ApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
  };
  
  return Response.json(responseBody, {status});
}
