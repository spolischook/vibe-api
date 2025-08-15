import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  code?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.code || 500;
  res.status(statusCode).json({
    code: statusCode,
    message: err.message || "Internal Server Error",
  });
};
