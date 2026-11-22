import type { Response } from "express";

export interface ApiResponseOptions<T = unknown> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
}

/**
 * Standardized API success response helper
 */
export function sendSuccess<T = unknown>({
  res,
  statusCode = 200,
  message,
  data,
}: ApiResponseOptions<T>): Response {
  const response: { success: boolean; message: string; data?: T } = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

export default sendSuccess;
