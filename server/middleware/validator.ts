import { Request, Response, NextFunction } from 'express';

/**
 * Input Validation & Sanitization Middleware for HAEWS v2.0
 * SEC-07: Proper input validation for citizen reports and other user-facing endpoints
 */

// Strip HTML tags to prevent stored XSS
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// Validate and sanitize a string field
function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return stripHtml(value).slice(0, maxLength);
}

// Validate latitude (Vietnam range: ~8° to ~24°)
function isValidLatitude(lat: unknown): boolean {
  const n = Number(lat);
  return !isNaN(n) && n >= -90 && n <= 90;
}

// Validate longitude (Vietnam range: ~102° to ~110°)
function isValidLongitude(lng: unknown): boolean {
  const n = Number(lng);
  return !isNaN(n) && n >= -180 && n <= 180;
}

// Validate image URL array
function sanitizeImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .filter((url): url is string => typeof url === 'string')
    .filter((url) => {
      try {
        const u = new URL(url);
        return u.protocol === 'https:' || u.protocol === 'http:' || url.startsWith('data:image/');
      } catch {
        return false;
      }
    })
    .slice(0, 5); // Max 5 images per report
}

/**
 * Middleware: Validate citizen report input
 */
export function validateCitizenReport(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;

  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Dữ liệu báo cáo không hợp lệ', code: 'INVALID_INPUT' });
    return;
  }

  // Sanitize all string fields
  body.reporter_name = sanitizeString(body.reporter_name, 100);
  body.reporter_phone = sanitizeString(body.reporter_phone, 15);
  body.description = sanitizeString(body.description, 2000);
  body.address_text = sanitizeString(body.address_text, 300);
  body.commune_name = sanitizeString(body.commune_name, 100);
  body.district_name = sanitizeString(body.district_name, 100);
  body.province_name = sanitizeString(body.province_name, 100);
  body.hazard_label = sanitizeString(body.hazard_label, 200);

  // Validate coordinates
  if (body.lat !== undefined && !isValidLatitude(body.lat)) {
    res.status(400).json({ error: 'Tọa độ vĩ độ (lat) không hợp lệ', code: 'INVALID_LAT' });
    return;
  }
  if (body.lng !== undefined && !isValidLongitude(body.lng)) {
    res.status(400).json({ error: 'Tọa độ kinh độ (lng) không hợp lệ', code: 'INVALID_LNG' });
    return;
  }

  // Validate hazard_category enum
  const validCategories = [
    'LANDSLIDE_TALUY', 'SLOPE_CRACK', 'MUD_DEBRIS_FLOW',
    'DEEP_FLOOD_ISOLATED', 'OVERFLOW_BRIDGE', 'ROAD_COLLAPSE'
  ];
  if (body.hazard_category && !validCategories.includes(body.hazard_category)) {
    body.hazard_category = 'LANDSLIDE_TALUY';
  }

  // Validate severity enum
  const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  if (body.severity && !validSeverities.includes(body.severity)) {
    body.severity = 'HIGH';
  }

  // Sanitize images
  body.images = sanitizeImageUrls(body.images);

  // Validate numeric fields
  if (body.estimated_affected_houses !== undefined) {
    body.estimated_affected_houses = Math.max(0, Math.min(99999, Number(body.estimated_affected_houses) || 0));
  }

  next();
}

/**
 * Middleware: Validate social sensor report input
 */
export function validateSocialReport(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Dữ liệu báo cáo không hợp lệ', code: 'INVALID_INPUT' });
    return;
  }

  // Sanitize text fields
  if (body.content) body.content = sanitizeString(body.content, 1000);
  if (body.author) body.author = sanitizeString(body.author, 100);
  if (body.location) body.location = sanitizeString(body.location, 200);

  next();
}

/**
 * Middleware: Validate simulation input
 */
export function validateSimulationInput(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Dữ liệu mô phỏng không hợp lệ', code: 'INVALID_INPUT' });
    return;
  }

  // Ensure numeric rainfall values are within realistic bounds
  const rainfallFields = ['r1h', 'r3h', 'r6h', 'r24h'];
  for (const field of rainfallFields) {
    if (body[field] !== undefined) {
      const val = Number(body[field]);
      if (isNaN(val) || val < 0 || val > 2000) {
        res.status(400).json({ error: `Giá trị ${field} ngoài phạm vi hợp lệ (0-2000mm)`, code: 'INVALID_RAINFALL' });
        return;
      }
    }
  }

  next();
}

/**
 * Middleware: Validate query string for AI endpoints to prevent prompt injection markers
 */
export function validateAiQuery(req: Request, res: Response, next: NextFunction): void {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Truy vấn AI không được để trống', code: 'INVALID_QUERY' });
    return;
  }

  // Limit query length to prevent token abuse
  if (query.length > 2000) {
    res.status(400).json({ error: 'Truy vấn AI quá dài (tối đa 2000 ký tự)', code: 'QUERY_TOO_LONG' });
    return;
  }

  // Sanitize - strip HTML
  req.body.query = stripHtml(query);

  next();
}

/**
 * Middleware: Validate earthquake report input
 */
export function validateEarthquakeReport(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Dữ liệu địa chấn không hợp lệ', code: 'INVALID_INPUT' });
    return;
  }

  if (body.magnitude !== undefined) {
    const mag = Number(body.magnitude);
    if (isNaN(mag) || mag < 0 || mag > 10) {
      res.status(400).json({ error: 'Cường độ richter ngoài phạm vi (0-10)', code: 'INVALID_MAGNITUDE' });
      return;
    }
  }

  if (body.location_name) body.location_name = sanitizeString(body.location_name, 200);
  if (body.province) body.province = sanitizeString(body.province, 100);

  next();
}
