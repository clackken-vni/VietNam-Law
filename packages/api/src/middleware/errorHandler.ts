import type { Request, Response, NextFunction } from "express"
import type { ApiError } from "@vietlex/shared"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message)
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    })
  }

  console.error("[unhandled]", err)
  res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Internal server error",
  })
}
