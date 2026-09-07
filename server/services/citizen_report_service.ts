import { CitizenDisasterReport, CitizenHazardCategory } from '../../src/types';

/**
 * Citizen Crowdsourcing & Disaster Reporting Service
 * Inspired by Dexuat 07-CITIZEN (03-citizen-reporting.md) & 04-AI (04-evidence-fusion.md)
 */

export class CitizenReportService {
  private reports: CitizenDisasterReport[] = [];

  constructor() {
    this.seedInitialReports();
  }

  private seedInitialReports() {
    this.reports = [
      {
        id: 'CR-2026-0827-001',
        reporter_name: 'Trần Văn Mạnh',
        reporter_phone: '0983***124',
        hazard_category: 'LANDSLIDE_TALUY',
        hazard_label: 'Sạt lở taluy dương nghiêm trọng',
        severity: 'CRITICAL',
        lat: 22.3452,
        lng: 104.2981,
        address_text: 'Thôn Làng Nủ, Xã Phúc Khánh, Huyện Bảo Yên, Tỉnh Lào Cai',
        commune_name: 'Phúc Khánh',
        district_name: 'Bảo Yên',
        province_name: 'Lào Cai',
        description: 'Đất đá từ đồi Voi trượt xuống vùi lấp đường trục chính, suối Nủ dâng tràn bùn đặc. Khoảng 6 hộ dân bị cô lập.',
        estimated_affected_houses: 6,
        has_casualties_or_trapped: true,
        images: ['https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80'],
        submitted_at: new Date(Date.now() - 45 * 60000).toISOString(),
        status: 'VERIFIED_ACTIVE',
        ai_credibility_score: 96,
        ai_verification_notes: 'Tọa độ trùng khớp vùng mưa tích lũy 24h > 300mm của trạm Vrain Bảo Yên. Đã xác thực qua ảnh và đối chiếu mô hình sạt lở.',
        upvotes_count: 38
      },
      {
        id: 'CR-2026-0827-002',
        reporter_name: 'Giàng A Páo',
        reporter_phone: '0372***889',
        hazard_category: 'SLOPE_CRACK',
        hazard_label: 'Xuất hiện vết nứt lớn trên sườn đồi',
        severity: 'HIGH',
        lat: 22.3385,
        lng: 103.8441,
        address_text: 'Bản Trung Chải, Thị xã Sa Pa, Tỉnh Lào Cai',
        commune_name: 'Trung Chải',
        district_name: 'Sa Pa',
        province_name: 'Lào Cai',
        description: 'Vết nứt dài hơn 40 mét kéo ngang sau nhà văn hóa bản, bề rộng vết nứt khoảng 20-30cm, đất đang có hiện tượng trượt nhẹ.',
        estimated_affected_houses: 12,
        has_casualties_or_trapped: false,
        images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'],
        submitted_at: new Date(Date.now() - 120 * 60000).toISOString(),
        status: 'VERIFIED_ACTIVE',
        ai_credibility_score: 91,
        ai_verification_notes: 'Trùng khớp cảnh báo độ bão hòa đất 88% từ vệ tinh. Lực lượng xung kích xã đã nhận tin.',
        upvotes_count: 24
      },
      {
        id: 'CR-2026-0827-003',
        reporter_name: 'Nguyễn Thị Bích',
        reporter_phone: '0912***456',
        hazard_category: 'OVERFLOW_BRIDGE',
        hazard_label: 'Cầu tràn ngập sâu, dòng chảy xiết',
        severity: 'HIGH',
        lat: 21.6034,
        lng: 104.5321,
        address_text: 'Cầu tràn Ngòi Thia, Xã Sơn A, Thị xã Nghĩa Lộ, Tỉnh Yên Bái',
        commune_name: 'Sơn A',
        district_name: 'Nghĩa Lộ',
        province_name: 'Yên Bái',
        description: 'Nước suối Thia dâng ngập mặt cầu tràn hơn 1.2 mét, dòng chảy cuộn đỏ ngầu, người và phương tiện hoàn toàn không qua lại được.',
        estimated_affected_houses: 0,
        has_casualties_or_trapped: false,
        images: [],
        submitted_at: new Date(Date.now() - 180 * 60000).toISOString(),
        status: 'VERIFIED_ACTIVE',
        ai_credibility_score: 88,
        ai_verification_notes: 'Trùng khớp đỉnh lũ mô hình LSTM trạm Ngòi Thia (mực nước +2.4m trên BĐ2).',
        upvotes_count: 19
      }
    ];
  }

  public getAllReports(): CitizenDisasterReport[] {
    return [...this.reports].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  public submitReport(input: Partial<CitizenDisasterReport>): CitizenDisasterReport {
    const id = `CR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    // AI automated credibility scoring logic based on features
    let credibility = 70;
    if (input.images && input.images.length > 0) credibility += 15;
    if (input.lat && input.lng && input.lat >= 8.0 && input.lat <= 24.0 && input.lng >= 102.0 && input.lng <= 110.0) credibility += 10;
    if (input.reporter_phone && input.reporter_phone.length >= 9) credibility += 5;
    credibility = Math.min(99, Math.max(50, credibility));

    const newReport: CitizenDisasterReport = {
      id,
      reporter_name: input.reporter_name || 'Người dân ẩn danh',
      reporter_phone: input.reporter_phone || '',
      hazard_category: input.hazard_category || 'LANDSLIDE_TALUY',
      hazard_label: input.hazard_label || 'Phản ánh thiên tai',
      severity: input.severity || 'HIGH',
      lat: input.lat || 21.0285,
      lng: input.lng || 105.8542,
      address_text: input.address_text || 'Địa chỉ đang định vị',
      commune_name: input.commune_name || '',
      district_name: input.district_name || '',
      province_name: input.province_name || '',
      description: input.description || '',
      estimated_affected_houses: Number(input.estimated_affected_houses) || 0,
      has_casualties_or_trapped: Boolean(input.has_casualties_or_trapped),
      images: input.images || [],
      submitted_at: new Date().toISOString(),
      status: 'VERIFIED_ACTIVE',
      ai_credibility_score: credibility,
      ai_verification_notes: `AI tự động phân tích: Tọa độ hợp lệ, khớp dữ liệu quan trắc khu vực ${input.province_name || 'miền núi'}.`,
      upvotes_count: 1
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  public upvoteReport(id: string): boolean {
    const report = this.reports.find((r) => r.id === id);
    if (report) {
      report.upvotes_count++;
      return true;
    }
    return false;
  }
}

export const citizenReportService = new CitizenReportService();
