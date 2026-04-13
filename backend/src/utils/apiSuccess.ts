export function apiSuccess(
  statusCode: number,
  message: string,
): {
  success: true;
  statusCode: number;
  message: string;
};

export function apiSuccess<T>(
  statusCode: number,
  message: string,
  data: T,
): {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

export function apiSuccess<T>(statusCode: number, message: string, data?: T) {
  return {
    success: true,
    statusCode,
    message,
    ...(data !== undefined ? { data } : {}),
  };
}
