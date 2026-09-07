import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware for HAEWS v2.0
 * SEC-08: Prevents leaking sensitive internal error details to clients
 */

export function globalErrorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  // Log full error details server-side for debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message, err.stack);

  // Return generic error message to client - never expose internal details
  res.status(500).json({
    error: 'Đã xảy ra lỗi xử lý yêu cầu. Vui lòng thử lại.',
    code: 'INTERNAL_ERROR',
    request_id: `req-${Date.now()}`
  });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: `API endpoint ${req.method} ${req.originalUrl} không tồn tại`,
    code: 'NOT_FOUND',
    status: 404
  });
}
