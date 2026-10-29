import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'An unexpected internal server error occurred.',
      code: err.name || 'INTERNAL_SERVER_ERROR',
    },
  });
};

