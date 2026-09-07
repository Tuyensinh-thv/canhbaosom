import { DataQualityAuditRecord, QualityFlag, RainfallLog } from '../../src/types';

export class DataQualityEngine {
  private auditLogs: DataQualityAuditRecord[] = [];
  private readonly MAX_REASONABLE_HOURLY_RAIN = 250.0; // mm/h
  private readonly MAX_REASONABLE_24H_RAIN = 900.0; // mm/24h
  private readonly MAX_RATE_OF_CHANGE = 150.0; // mm/h spike

  constructor() {
    // Seed initial audit log entries
    this.seedInitialAudit();
  }

  private seedInitialAudit() {
    this.auditLogs.push(
      {
        id: 'audit-001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        station_code: 'VNA-HGI02',
        check_type: 'SENSOR_OFFLINE',
        status: 'WARNING',
        raw_value: 38.0,
        details: 'Điện áp ắc-quy trạm Vị Xuyên thấp (42%), telemetry gửi gói tin chậm 18 phút',
        action_taken: 'Đánh dấu WARNING, sử dụng phép nội suy Kriging từ trạm VNA-HGI01 hỗ trợ'
      },
      {
        id: 'audit-002',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        station_code: 'VNA-YBI01',
        check_type: 'RANGE_OUTLIER',
        status: 'VALID',
        raw_value: 46.2,
        details: 'Cường độ mưa tăng đột ngột 32mm/h tại đèo Khau Phạ, đã cross-validate với ảnh Radar Việt Trì',
        action_taken: 'Xác nhận hiện tượng dông núi cực đoan hợp lệ, giữ cờ VALID'
      }
    );
  }

  public validateRainfallRecord(
    stationCode: string,
    r1h: number,
    r3h: number,
    r6h: number,
    r24h: number,
    prevR1h?: number
  ): { flag: QualityFlag; cleanedR1h: number; cleanedR24h: number; note: string } {
    const now = new Date().toISOString();

    // 1. Missing Check
    if (r1h === null || r1h === undefined || isNaN(r1h)) {
      this.recordAudit({
        station_code: stationCode,
        check_type: 'MISSING',
        status: 'MISSING',
        raw_value: -1,
        details: 'Mất tín hiệu cảm biến gầu đo (Null / NaN)',
        action_taken: 'Gán cờ MISSING, không cấp phát trực tiếp vào AI'
      });
      return { flag: 'MISSING', cleanedR1h: 0, cleanedR24h: r24h || 0, note: 'Mất tín hiệu đo mưa' };
    }

    // 2. Negative Value Check
    if (r1h < 0 || r3h < 0 || r6h < 0 || r24h < 0) {
      this.recordAudit({
        station_code: stationCode,
        check_type: 'NEGATIVE_VALUE',
        status: 'INVALID',
        raw_value: r1h,
        details: `Phát hiện giá trị âm bất thường (r1h: ${r1h}, r24h: ${r24h})`,
        action_taken: 'Gán cờ INVALID, chặn đẩy vào AI Engine, hiệu chỉnh về 0'
      });
      return { flag: 'INVALID', cleanedR1h: 0, cleanedR24h: Math.max(0, r24h), note: 'Giá trị âm phi vật lý' };
    }

    // 3. Physical Upper Bound Outlier Check
    if (r1h > this.MAX_REASONABLE_HOURLY_RAIN || r24h > this.MAX_REASONABLE_24H_RAIN) {
      this.recordAudit({
        station_code: stationCode,
        check_type: 'RANGE_OUTLIER',
        status: 'INVALID',
        raw_value: r1h,
        details: `Cường độ mưa vượt ngưỡng vật lý kỷ lục (${r1h}mm/h > ${this.MAX_REASONABLE_HOURLY_RAIN}mm/h)`,
        action_taken: 'Gán cờ INVALID, kích hoạt bộ lọc kẹp trần an toàn'
      });
      return {
        flag: 'INVALID',
        cleanedR1h: Math.min(r1h, this.MAX_REASONABLE_HOURLY_RAIN),
        cleanedR24h: Math.min(r24h, this.MAX_REASONABLE_24H_RAIN),
        note: 'Dữ liệu dị thường vượt trần vật lý'
      };
    }

    // 4. Temporal Jump Anomaly Check
    if (prevR1h !== undefined && Math.abs(r1h - prevR1h) > this.MAX_RATE_OF_CHANGE) {
      this.recordAudit({
        station_code: stationCode,
        check_type: 'TEMPORAL_JUMP',
        status: 'WARNING',
        raw_value: r1h,
        details: `Nhảy vọt bất thường ${r1h}mm/h từ ${prevR1h}mm/h trong 1 chu kỳ`,
        action_taken: 'Gán cờ WARNING, áp dụng hàm làm mượt exponential smoothing'
      });
      const smoothed = prevR1h * 0.4 + r1h * 0.6;
      return { flag: 'WARNING', cleanedR1h: smoothed, cleanedR24h: r24h, note: 'Nhảy vọt tốc độ mưa, đã hiệu chuẩn' };
    }

    // 5. Logical Consistency (r1h <= r3h <= r6h <= r24h)
    if (r1h > r3h + 0.1 || r3h > r6h + 0.1 || r6h > r24h + 0.1) {
      this.recordAudit({
        station_code: stationCode,
        check_type: 'RANGE_OUTLIER',
        status: 'WARNING',
        raw_value: r1h,
        details: `Dữ liệu tích lũy nghịch lý (1h: ${r1h}, 3h: ${r3h}, 24h: ${r24h})`,
        action_taken: 'Tự động hiệu chỉnh tích lũy đơn điệu'
      });
      const fixedR3h = Math.max(r3h, r1h);
      const fixedR6h = Math.max(r6h, fixedR3h);
      const fixedR24h = Math.max(r24h, fixedR6h);
      return { flag: 'WARNING', cleanedR1h: r1h, cleanedR24h: fixedR24h, note: 'Hiệu chỉnh tích lũy đơn điệu' };
    }

    return { flag: 'VALID', cleanedR1h: r1h, cleanedR24h: r24h, note: 'Dữ liệu đạt chuẩn kiểm định' };
  }

  public recordAudit(record: Omit<DataQualityAuditRecord, 'id' | 'timestamp'>) {
    const newRecord: DataQualityAuditRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...record
    };
    this.auditLogs.unshift(newRecord);
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  public getAuditLogs(): DataQualityAuditRecord[] {
    return this.auditLogs;
  }

  public getQualityStats() {
    const total = this.auditLogs.length;
    const validCount = this.auditLogs.filter((l) => l.status === 'VALID').length;
    const warningCount = this.auditLogs.filter((l) => l.status === 'WARNING').length;
    const invalidCount = this.auditLogs.filter((l) => l.status === 'INVALID').length;
    const missingCount = this.auditLogs.filter((l) => l.status === 'MISSING').length;

    const validPercentage = total > 0 ? Math.round(((total - invalidCount - missingCount) / total) * 100) : 98;

    return {
      totalChecks: total,
      validPercentage,
      warningCount,
      invalidCount,
      missingCount
    };
  }
}

export const dataQualityEngine = new DataQualityEngine();
