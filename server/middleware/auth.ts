import { Request, Response, NextFunction } from 'express';

/**
 * Authentication Middleware for HAEWS Admin API
 * SEC-01, SEC-02, SEC-03: Bearer Token authentication
 *
 * Token is loaded from environment variable HAEWS_ADMIN_TOKEN.
 * If no token is configured, all protected endpoints are locked (fail-closed).
 */

const ADMIN_TOKEN = process.env.HAEWS_ADMIN_TOKEN || '';

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  // Fail-closed: if no token is configured, deny all requests
  if (!ADMIN_TOKEN) {
    res.status(503).json({
      error: 'Hệ thống chưa được cấu hình khóa xác thực. Liên hệ quản trị viên.',
      code: 'AUTH_NOT_CONFIGURED'
    });
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Yêu cầu xác thực. Vui lòng cung cấp mã Bearer Token trong header Authorization.',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  const token = authHeader.slice(7);

  if (token !== ADMIN_TOKEN) {
    // Log failed auth attempt for audit trail
    console.warn(
      `[SECURITY] Failed auth attempt from ${req.ip} on ${req.method} ${req.originalUrl}`
    );
    res.status(403).json({
      error: 'Mã xác thực không hợp lệ hoặc đã hết hạn.',
      code: 'AUTH_INVALID'
    });
    return;
  }

  next();
}
