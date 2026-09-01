import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error Handler]:', err.message || err);

  const statusCode = err.statusCode || 500;
  const response: { success: boolean; error: string; stack?: string } = {
    success: false,
    error: err.message || 'Internal Server Error'
  };

  if (ENV.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
