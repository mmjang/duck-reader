export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message?: string;
  data?: T;
}
/**
 *
 * @param success
 * @param data
 * @param message
 * @param code 400 token失效
 * @returns
 */

export function resp<T>(
  success: boolean,
  data?: T,
  message?: string,
  code: number = 200
): ApiResponse<T> {
  return {
    success,
    code,
    message,
    data,
  };
}
