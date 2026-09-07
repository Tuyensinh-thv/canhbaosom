import { BroadcastTransmissionLog, BroadcastChannelOverview, EmergencyDispatch } from '../../src/types';

export class BroadcastDispatcherEngine {
  private transmissionLogs: BroadcastTransmissionLog[] = [
    {
      id: 'TRANS-LOG-001',
      dispatch_id: 'DISP-2026-08-001',
      channel: 'CELL_BROADCAST',
      channel_label: 'Cell Broadcast Trạm BTS (Cảnh báo Ưu tiên Cấp Quốc gia)',
      target_zone_name: 'Làng Nủ (Bảo Yên)',
      target_province: 'Lào Cai',
      target_recipients_est: 8500,
      successful_deliveries: 8460,
      failed_deliveries: 40,
      status: 'COMPLETED',
      transmitted_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      latency_ms: 1850,
      sample_message: '🚨 [KHẨN CẤP] CẢNH BÁO LŨ QUÉT - LÀNG NỦ, BẢO YÊN. RỦI RO CẤP 5. Yêu cầu bà con khẩn trương sơ tán lên sườn núi cao an toàn!'
    },
    {
      id: 'TRANS-LOG-002',
      dispatch_id: 'DISP-2026-08-001',
      channel: 'ZALO_OA',
      channel_label: 'Zalo Official Account (Ban Chỉ đạo PCTT Tỉnh)',
      target_zone_name: 'Làng Nủ (Bảo Yên)',
      target_province: 'Lào Cai',
      target_recipients_est: 12400,
      successful_deliveries: 12380,
      failed_deliveries: 20,
      status: 'COMPLETED',
      transmitted_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      latency_ms: 2200,
      sample_message: '📢 Công điện hỏa tốc số 08/CĐ-PCTT: Kích hoạt lộ trình sơ tán khẩn cấp và danh sách số điện thoại cứu hộ tại chỗ.'
    },
    {
      id: 'TRANS-LOG-003',
      dispatch_id: 'DISP-2026-08-002',
      channel: 'EMERGENCY_SIREN',
      channel_label: 'Còi Hú Báo Động Đầu Nguồn & Hồ Chứa Thủy Điện',
      target_zone_name: 'Kỳ Sơn',
      target_province: 'Nghệ An',
      target_recipients_est: 3200,
      successful_deliveries: 3200,
      failed_deliveries: 0,
      status: 'COMPLETED',
      transmitted_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      latency_ms: 850,
      sample_message: '🔊 Kích hoạt còi hú 3 hồi dài 180s - Báo động khẩn cấp vỡ đập phụ / lũ bùn đá tràn ngầm.'
    },
    {
      id: 'TRANS-LOG-004',
      dispatch_id: 'DISP-2026-08-002',
      channel: 'COMMUNE_RADIO',
      channel_label: 'Hệ Thống Truyền Thanh Thông Minh Cấp Xã / Bản',
      target_zone_name: 'Mù Cang Chải',
      target_province: 'Yên Bái',
      target_recipients_est: 6400,
      successful_deliveries: 6350,
      failed_deliveries: 50,
      status: 'COMPLETED',
      transmitted_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      latency_ms: 3100,
      sample_message: '📻 Phát sóng liên tục bản tin cảnh báo lũ bùn đá bằng tiếng Việt và tiếng Mông/Thái.'
    }
  ];

  public getChannelOverview(): BroadcastChannelOverview {
    return {
      cell_broadcast_bts_count: 1420,
      total_sms_subscribers: 3850000,
      zalo_oa_followers_active: 890000,
      emergency_sirens_online: 215,
      radio_speakers_online: 3450,
      system_ready: true
    };
  }

  public getTransmissionLogs(): BroadcastTransmissionLog[] {
    return this.transmissionLogs;
  }

  public transmitDispatch(
    dispatch: EmergencyDispatch,
    channels: ('CELL_BROADCAST' | 'SMS' | 'ZALO_OA' | 'EMERGENCY_SIREN' | 'COMMUNE_RADIO')[]
  ): BroadcastTransmissionLog[] {
    const newLogs: BroadcastTransmissionLog[] = [];

    channels.forEach((channel) => {
      const channelLabels = {
        CELL_BROADCAST: 'Cell Broadcast Trạm BTS (Cảnh báo Ưu tiên Cấp Quốc gia)',
        SMS: 'SMS Brandname Bộ Nông nghiệp & PTNT',
        ZALO_OA: 'Zalo Official Account (Ban Chỉ đạo PCTT Tỉnh)',
        EMERGENCY_SIREN: 'Còi Hú Báo Động Đầu Nguồn & Hồ Chứa Thủy Điện',
        COMMUNE_RADIO: 'Hệ Thống Truyền Thanh Thông Minh Cấp Xã / Bản'
      };

      const estRecipients = (dispatch.affected_zones.length || 1) * 3500;
      const success = Math.floor(estRecipients * 0.992);
      const failed = estRecipients - success;

      const log: BroadcastTransmissionLog = {
        id: `TRANS-LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        dispatch_id: dispatch.id,
        channel,
        channel_label: channelLabels[channel] || channel,
        target_zone_name: dispatch.affected_zones.join(', ') || 'Toàn vùng rủi ro',
        target_province: dispatch.affected_provinces.join(', ') || 'Khu vực trọng điểm',
        target_recipients_est: estRecipients,
        successful_deliveries: success,
        failed_deliveries: failed,
        status: 'COMPLETED',
        transmitted_at: new Date().toISOString(),
        latency_ms: Math.floor(800 + Math.random() * 1800),
        sample_message: dispatch.sms_broadcast_text || `🚨 [KHẨN CẤP] ${dispatch.title}: Sơ tán ngay lập tức!`
      };

      newLogs.push(log);
      this.transmissionLogs.unshift(log);
    });

    return newLogs;
  }
}

export const broadcastDispatcherEngine = new BroadcastDispatcherEngine();
