import { HistoricalReplayFrame, SpatialZone, ThresholdProfile, ZoneRiskAssessment } from '../../src/types';
import { NORTHERN_VIETNAM_ZONES } from '../data/northern_vietnam_zones';
import { hybridRiskEngine } from './hybrid_risk';

export interface HistoricalScenario {
  id: string;
  name: string;
  era: '1900_1970' | '1971_2000' | '2001_2015' | '2016_2024';
  era_label: string;
  year: number;
  description: string;
  date_range: string;
  meteorological_cause: string;
  historical_significance: string;
  total_frames: number;
  frames: HistoricalReplayFrame[];
}

export const HISTORICAL_SCENARIOS: HistoricalScenario[] = [
  // =========================================================================
  // GIAI ĐOẠN 1: TỪ NĂM 1900 ĐẾN 1970 (KỶ NGUYÊN SỐ LIỆU ĐỊA CHẤT & LŨ LỊCH SỬ)
  // =========================================================================
  {
    id: 'scenario-redriver-1915',
    name: 'Đại Hồng Thủy Vỡ Đê Sông Hồng & Lũ Quét Vùng Thượng Du (07/1915)',
    era: '1900_1970',
    era_label: 'Thời kỳ 1900 - 1970',
    year: 1915,
    description: 'Trận đại hồng thủy kinh hoàng thời Pháp thuộc với chuỗi mưa bão dồn dập làm mực nước sông Thao và sông Lô vượt mọi đỉnh lịch sử, vỡ hàng loạt tuyến đê và lũ quét tàn phá miền núi.',
    date_range: '10/07/1915 - 18/07/1915',
    meteorological_cause: 'Hội tụ dải áp thấp nhiệt đới kết hợp rãnh gió mùa Tây Nam và khối không khí lạnh sớm từ lục địa',
    historical_significance: 'Một trong những trận lũ lụt lớn nhất thế kỷ 20 được Nha Khí tượng Đông Dương (Observatoire de Phù Liễn) ghi chép với đỉnh lũ sông Hồng tại Hà Nội đạt 12.30m.',
    total_frames: 5,
    frames: [
      {
        frame_index: 0,
        timestamp: '1915-07-10T06:00:00Z',
        event_title: 'T+00h: Mưa như trút nước trên toàn bộ thượng nguồn sông Hồng, sông Lô',
        event_description: 'Nha Khí tượng Đông Dương ghi nhận lượng mưa ngày đầu tiên vượt 150mm tại Lào Cai, Yên Bái và Tuyên Quang. Khe tụ thủy đổ ầm ầm.',
        station_readings: {
          'VNA-LCA01': { r1h: 30, r3h: 60, r6h: 90, r24h: 155 },
          'VNA-LCA02': { r1h: 28, r3h: 58, r6h: 88, r24h: 148 },
          'VNA-YBI01': { r1h: 32, r3h: 65, r6h: 95, r24h: 160 },
          'VNA-CBA01': { r1h: 25, r3h: 50, r6h: 75, r24h: 130 },
          'VNA-SLA01': { r1h: 20, r3h: 40, r6h: 65, r24h: 110 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 4, level_2: 4, level_1: 1 }
      },
      {
        frame_index: 1,
        timestamp: '1915-07-12T12:00:00Z',
        event_title: 'T+54h: Lũ quét liên hoàn dọc sườn núi dãy Hoàng Liên Sơn & Sông Chảy',
        event_description: 'Mưa tích lũy 3 ngày liên tiếp vượt 400mm. Hàng triệu m3 bùn đất sạt lở từ các đỉnh núi đổ dồn làm nghẽn dòng suối và vỡ đập tự nhiên.',
        station_readings: {
          'VNA-LCA01': { r1h: 65, r3h: 140, r6h: 210, r24h: 340 },
          'VNA-LCA02': { r1h: 70, r3h: 150, r6h: 220, r24h: 360 },
          'VNA-YBI01': { r1h: 60, r3h: 130, r6h: 190, r24h: 310 },
          'VNA-CBA01': { r1h: 45, r3h: 95, r6h: 145, r24h: 230 },
          'VNA-SLA01': { r1h: 40, r3h: 85, r6h: 130, r24h: 210 }
        },
        warning_summary: { level_5: 2, level_4: 5, level_3: 3, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '1915-07-14T02:00:00Z',
        event_title: 'T+92h: Đỉnh lũ lịch sử thượng du tràn về đồng bằng - Đê vỡ nhiều đoạn',
        event_description: 'Mực nước sông Thao dâng ngập trắng thung lũng Yên Bái, Phú Thọ. Toàn bộ vùng hạ lưu chìm trong biển nước.',
        station_readings: {
          'VNA-LCA01': { r1h: 75, r3h: 165, r6h: 250, r24h: 410 },
          'VNA-LCA02': { r1h: 80, r3h: 175, r6h: 265, r24h: 430 },
          'VNA-YBI01': { r1h: 72, r3h: 155, r6h: 235, r24h: 390 },
          'VNA-CBA01': { r1h: 55, r3h: 115, r6h: 170, r24h: 280 },
          'VNA-SLA01': { r1h: 48, r3h: 100, r6h: 150, r24h: 250 }
        },
        warning_summary: { level_5: 4, level_4: 4, level_3: 2, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '1915-07-16T18:00:00Z',
        event_title: 'T+156h: Hiện tượng sạt trượt trễ thứ cấp trên các vách taluy dốc',
        event_description: 'Mặc dù mưa giảm dần nhưng do đất ngậm nước bão hòa 100% trong 6 ngày, các khối trượt lớn vẫn tiếp tục sụp đổ chia cắt các bản làng.',
        station_readings: {
          'VNA-LCA01': { r1h: 20, r3h: 45, r6h: 70, r24h: 190 },
          'VNA-LCA02': { r1h: 22, r3h: 50, r6h: 75, r24h: 205 },
          'VNA-YBI01': { r1h: 18, r3h: 40, r6h: 65, r24h: 175 },
          'VNA-CBA01': { r1h: 15, r3h: 32, r6h: 50, r24h: 140 },
          'VNA-SLA01': { r1h: 12, r3h: 28, r6h: 42, r24h: 120 }
        },
        warning_summary: { level_5: 2, level_4: 3, level_3: 4, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 4,
        timestamp: '1915-07-18T10:00:00Z',
        event_title: 'T+196h: Nước lũ rút chậm, để lại lớp bùn phù sa dày hàng mét',
        event_description: 'Các vùng ven sông bắt đầu công tác khắc phục, đắp hàn khẩu các đoạn đê quai và dọn dẹp cây đổ bùn đất.',
        station_readings: {
          'VNA-LCA01': { r1h: 4, r3h: 10, r6h: 18, r24h: 50 },
          'VNA-LCA02': { r1h: 5, r3h: 12, r6h: 20, r24h: 55 },
          'VNA-YBI01': { r1h: 4, r3h: 9, r6h: 15, r24h: 45 },
          'VNA-CBA01': { r1h: 3, r3h: 8, r6h: 14, r24h: 40 },
          'VNA-SLA01': { r1h: 3, r3h: 7, r6h: 12, r24h: 35 }
        },
        warning_summary: { level_5: 0, level_4: 0, level_3: 2, level_2: 5, level_1: 3 }
      }
    ]
  },
  {
    id: 'scenario-redriver-1945',
    name: 'Đại Hồng Thủy & Vỡ Đê Lịch Sử Bắc Bộ (08/1945)',
    era: '1900_1970',
    era_label: 'Thời kỳ 1900 - 1970',
    year: 1945,
    description: 'Trận lũ lịch sử diễn ra vào tháng 8/1945 đúng thời điểm Cách mạng Tháng Tám. Mưa bão đặc biệt lớn ở thượng nguồn làm sông Hồng lên mức kỷ lục, gây vỡ đê tại 79 điểm.',
    date_range: '15/08/1945 - 25/08/1945',
    meteorological_cause: 'Hai cơn bão liên tiếp đổ bộ vào vịnh Bắc Bộ kết hợp hội tụ gió mùa Tây Nam hoạt động cực mạnh',
    historical_significance: 'Trận lũ được ghi nhận là một trong những thảm họa thiên tai nghiêm trọng nhất trong lịch sử Việt Nam hiện đại, ngập chìm 11 tỉnh Bắc Bộ.',
    total_frames: 5,
    frames: [
      {
        frame_index: 0,
        timestamp: '1945-08-15T00:00:00Z',
        event_title: 'T+00h: Cơn bão thứ nhất đổ bộ mang mưa đặc biệt to vào lưu vực sông Thao và sông Đà',
        event_description: 'Mưa xối xả liên tục trút xuống Yên Bái, Phú Thọ, Sơn La. Các con suối dốc đứng bắt đầu gầm thét.',
        station_readings: {
          'VNA-LCA01': { r1h: 35, r3h: 75, r6h: 110, r24h: 180 },
          'VNA-YBI01': { r1h: 40, r3h: 85, r6h: 125, r24h: 210 },
          'VNA-SLA01': { r1h: 32, r3h: 70, r6h: 105, r24h: 175 },
          'VNA-CBA01': { r1h: 28, r3h: 60, r6h: 90, r24h: 150 }
        },
        warning_summary: { level_5: 0, level_4: 2, level_3: 5, level_2: 3, level_1: 0 }
      },
      {
        frame_index: 1,
        timestamp: '1945-08-18T08:00:00Z',
        event_title: 'T+80h: Cơn bão thứ hai tiếp tục bồi thêm lượng mưa cực đoan vượt 500mm',
        event_description: 'Toàn bộ sườn núi các tỉnh miền núi phía Bắc bị sạt trượt đất đá hàng loạt. Nước sông dâng cao với tốc độ 15-20cm/h.',
        station_readings: {
          'VNA-LCA01': { r1h: 75, r3h: 160, r6h: 240, r24h: 390 },
          'VNA-YBI01': { r1h: 85, r3h: 180, r6h: 270, r24h: 450 },
          'VNA-SLA01': { r1h: 68, r3h: 145, r6h: 220, r24h: 360 },
          'VNA-CBA01': { r1h: 58, r3h: 125, r6h: 185, r24h: 300 }
        },
        warning_summary: { level_5: 3, level_4: 5, level_3: 2, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '1945-08-20T16:00:00Z',
        event_title: 'T+136h: Vỡ đê liên hoàn 79 đoạn - Nước ngập trắng hàng triệu héc-ta',
        event_description: 'Đỉnh lũ tại Hà Nội đạt mốc không tưởng thời bấy giờ, làm tràn và vỡ hệ thống đê tả hữu ngạn sông Hồng.',
        station_readings: {
          'VNA-LCA01': { r1h: 50, r3h: 110, r6h: 175, r24h: 320 },
          'VNA-YBI01': { r1h: 55, r3h: 120, r6h: 190, r24h: 350 },
          'VNA-SLA01': { r1h: 45, r3h: 95, r6h: 150, r24h: 270 },
          'VNA-CBA01': { r1h: 38, r3h: 80, r6h: 125, r24h: 220 }
        },
        warning_summary: { level_5: 4, level_4: 4, level_3: 2, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '1945-08-23T06:00:00Z',
        event_title: 'T+198h: Nước lũ duy trì ở mức báo động thảm họa',
        event_description: 'Dân chúng kết bè mảng sơ tán lên các cồn đất cao và triền núi. Lũ quét cô lập hoàn toàn mạng lưới giao thông.',
        station_readings: {
          'VNA-LCA01': { r1h: 22, r3h: 48, r6h: 80, r24h: 180 },
          'VNA-YBI01': { r1h: 25, r3h: 55, r6h: 90, r24h: 200 },
          'VNA-SLA01': { r1h: 18, r3h: 40, r6h: 65, r24h: 145 },
          'VNA-CBA01': { r1h: 15, r3h: 32, r6h: 52, r24h: 120 }
        },
        warning_summary: { level_5: 2, level_4: 4, level_3: 3, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 4,
        timestamp: '1945-08-25T18:00:00Z',
        event_title: 'T+258h: Nước rút chậm, mở đầu công cuộc cứu đói và phục hồi sau bão lũ',
        event_description: 'Chính phủ lâm thời Việt Nam Dân chủ Cộng hòa lập tức phát động phong trào hộ đê toàn dân và cứu tế đồng bào.',
        station_readings: {
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 20, r24h: 55 },
          'VNA-YBI01': { r1h: 6, r3h: 14, r6h: 22, r24h: 60 },
          'VNA-SLA01': { r1h: 4, r3h: 10, r6h: 16, r24h: 45 },
          'VNA-CBA01': { r1h: 3, r3h: 8, r6h: 14, r24h: 40 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 3, level_2: 4, level_1: 2 }
      }
    ]
  },
  {
    id: 'scenario-typhoon-1968',
    name: 'Cơn Bão Thảm Họa Bess & Lũ Quét Tây Bắc (10/1968)',
    era: '1900_1970',
    era_label: 'Thời kỳ 1900 - 1970',
    year: 1968,
    description: 'Cơn bão cực mạnh đổ bộ gây ra trận mưa lũ lịch sử kéo dài từ Tây Bắc qua Bắc Trung Bộ, gây sạt lở núi đá và vùi lấp nhiều cung đường chiến lược.',
    date_range: '12/10/1968 - 18/10/1968',
    meteorological_cause: 'Bão nhiệt đới mạnh kết hợp gió mùa đông bắc tạo hiệu ứng nâng địa hình sườn đón gió dãy Hoàng Liên và Trường Sơn',
    historical_significance: 'Trận bão lũ lịch sử trong giai đoạn kháng chiến được lưu trữ trong biên niên sử khí tượng Việt Nam.',
    total_frames: 4,
    frames: [
      {
        frame_index: 0,
        timestamp: '1968-10-12T12:00:00Z',
        event_title: 'T+00h: Không khí lạnh tăng cường nén rãnh áp thấp gây mưa đặc biệt to',
        event_description: 'Lượng mưa tại các trạm Sơn La, Lào Cai, Nghệ An tăng đột biến trên 120mm/12h.',
        station_readings: {
          'VNA-SLA01': { r1h: 32, r3h: 68, r6h: 100, r24h: 160 },
          'VNA-LCA01': { r1h: 30, r3h: 65, r6h: 95, r24h: 150 },
          'VNA-YBI01': { r1h: 28, r3h: 60, r6h: 90, r24h: 140 },
          'VNA-CBA01': { r1h: 20, r3h: 45, r6h: 70, r24h: 110 }
        },
        warning_summary: { level_5: 0, level_4: 2, level_3: 4, level_2: 3, level_1: 1 }
      },
      {
        frame_index: 1,
        timestamp: '1968-10-14T06:00:00Z',
        event_title: 'T+42h: Lũ quét cuồn cuộn trên các lưu vực suối dốc Tây Bắc',
        event_description: 'Các sườn núi đá vôi phong hóa mạnh đổ ập xuống thung lũng, nước dâng ngập các bến phà huyết mạch.',
        station_readings: {
          'VNA-SLA01': { r1h: 65, r3h: 140, r6h: 210, r24h: 330 },
          'VNA-LCA01': { r1h: 60, r3h: 130, r6h: 195, r24h: 310 },
          'VNA-YBI01': { r1h: 55, r3h: 120, r6h: 180, r24h: 290 },
          'VNA-CBA01': { r1h: 40, r3h: 85, r6h: 130, r24h: 210 }
        },
        warning_summary: { level_5: 2, level_4: 5, level_3: 3, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '1968-10-16T00:00:00Z',
        event_title: 'T+84h: Sạt trượt taluy dương trên các cung đèo hiểm trở',
        event_description: 'Đất đá vùi lấp hàng chục đoạn đường cơ động, công binh và dân quân phải mở tuyến khẩn cấp.',
        station_readings: {
          'VNA-SLA01': { r1h: 30, r3h: 65, r6h: 100, r24h: 220 },
          'VNA-LCA01': { r1h: 28, r3h: 60, r6h: 90, r24h: 200 },
          'VNA-YBI01': { r1h: 25, r3h: 55, r6h: 85, r24h: 190 },
          'VNA-CBA01': { r1h: 18, r3h: 40, r6h: 60, r24h: 140 }
        },
        warning_summary: { level_5: 1, level_4: 3, level_3: 4, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '1968-10-18T12:00:00Z',
        event_title: 'T+144h: Mưa giảm nhanh, tập trung ổn định tuyến đường và bảo vệ kho tàng',
        event_description: 'Nước trên các triền suối rút về lòng dẫn, lực lượng chức năng dọn dẹp chướng ngại vật bùn đá.',
        station_readings: {
          'VNA-SLA01': { r1h: 4, r3h: 10, r6h: 16, r24h: 45 },
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 18, r24h: 50 },
          'VNA-YBI01': { r1h: 4, r3h: 9, r6h: 15, r24h: 42 },
          'VNA-CBA01': { r1h: 3, r3h: 7, r6h: 12, r24h: 35 }
        },
        warning_summary: { level_5: 0, level_4: 0, level_3: 2, level_2: 5, level_1: 3 }
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 2: THỜI KỲ 1971 - 2000 (ĐẠI HỒNG THỦY 1971 & CÁC TRẬN LŨ LỚN)
  // =========================================================================
  {
    id: 'scenario-redriver-1971',
    name: 'Đại Hồng Thủy Lịch Sử Thế Kỷ Sông Hồng (08/1971)',
    era: '1971_2000',
    era_label: 'Thời kỳ 1971 - 2000',
    year: 1971,
    description: 'Trận đại hồng thủy kinh hoàng nhất thế kỷ 20 tại miền Bắc. Mực nước sông Hồng tại Hà Nội đạt kỷ lục 14.13m (trên BĐ3 tới 2.63m), làm ngập chìm hàng trăm ngàn ngôi nhà và gây sạt lở núi cực lớn.',
    date_range: '16/08/1971 - 26/08/1971',
    meteorological_cause: 'Tổ hợp thời tiết nguy hiểm: Bão đổ bộ kết hợp rãnh gió mùa Tây Nam và khối không khí lạnh đầu mùa nén mạnh từ phương Bắc',
    historical_significance: 'Được Tổ chức Khí tượng Thế giới (WMO) và Việt Nam xếp vào hàng ngũ những trận đại hồng thủy lớn nhất lịch sử thế giới thế kỷ 20.',
    total_frames: 6,
    frames: [
      {
        frame_index: 0,
        timestamp: '1971-08-16T06:00:00Z',
        event_title: 'T+00h: Mưa dữ dội diện rộng bao trùm toàn bộ lưu vực Sông Thao, Sông Đà, Sông Lô',
        event_description: 'Các trạm khí tượng miền núi đo được lượng mưa 24h đầu tiên lên đến 200-250mm. Đất bắt đầu ngậm no nước.',
        station_readings: {
          'VNA-LCA01': { r1h: 40, r3h: 85, r6h: 130, r24h: 210 },
          'VNA-LCA02': { r1h: 45, r3h: 95, r6h: 145, r24h: 230 },
          'VNA-YBI01': { r1h: 48, r3h: 100, r6h: 155, r24h: 250 },
          'VNA-SLA01': { r1h: 38, r3h: 80, r6h: 120, r24h: 195 },
          'VNA-CBA01': { r1h: 35, r3h: 75, r6h: 115, r24h: 180 }
        },
        warning_summary: { level_5: 0, level_4: 3, level_3: 5, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 1,
        timestamp: '1971-08-18T12:00:00Z',
        event_title: 'T+54h: Mưa tập trung đặc biệt lớn - Cường độ cực đoan trên 80mm/h',
        event_description: 'Sạt lở đất nghiêm trọng tại các triền dốc Yên Bái, Lào Cai, Phú Thọ. Toàn bộ các phụ lưu dồn nước cuồn cuộn vào sông chính.',
        station_readings: {
          'VNA-LCA01': { r1h: 78, r3h: 170, r6h: 260, r24h: 420 },
          'VNA-LCA02': { r1h: 85, r3h: 185, r6h: 280, r24h: 460 },
          'VNA-YBI01': { r1h: 90, r3h: 195, r6h: 295, r24h: 490 },
          'VNA-SLA01': { r1h: 70, r3h: 150, r6h: 230, r24h: 380 },
          'VNA-CBA01': { r1h: 60, r3h: 130, r6h: 200, r24h: 330 }
        },
        warning_summary: { level_5: 3, level_4: 5, level_3: 2, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '1971-08-20T22:00:00Z',
        event_title: 'T+112h: Đỉnh lũ 14.13m tại Hà Nội - Kích hoạt phân lũ khẩn cấp',
        event_description: 'Đê sông Hồng đứng trước nguy cơ vỡ diện rộng. Chính phủ quyết định mở các cống phân lũ sông Đáy và huy động hàng triệu lượt người hộ đê.',
        station_readings: {
          'VNA-LCA01': { r1h: 88, r3h: 190, r6h: 290, r24h: 510 },
          'VNA-LCA02': { r1h: 92, r3h: 205, r6h: 310, r24h: 540 },
          'VNA-YBI01': { r1h: 95, r3h: 215, r6h: 325, r24h: 570 },
          'VNA-SLA01': { r1h: 75, r3h: 165, r6h: 250, r24h: 420 },
          'VNA-CBA01': { r1h: 65, r3h: 140, r6h: 215, r24h: 360 }
        },
        warning_summary: { level_5: 5, level_4: 4, level_3: 1, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '1971-08-22T14:00:00Z',
        event_title: 'T+152h: Thảm họa lũ bùn đá và sụt lún sườn núi dốc kéo dài',
        event_description: 'Hàng trăm điểm dân cư miền núi bị vùi lấp. Tuyến đường sắt Hà Nội - Lào Cai và các quốc lộ bị cắt đứt hoàn toàn.',
        station_readings: {
          'VNA-LCA01': { r1h: 45, r3h: 100, r6h: 160, r24h: 360 },
          'VNA-LCA02': { r1h: 50, r3h: 110, r6h: 175, r24h: 390 },
          'VNA-YBI01': { r1h: 52, r3h: 115, r6h: 180, r24h: 400 },
          'VNA-SLA01': { r1h: 40, r3h: 90, r6h: 140, r24h: 310 },
          'VNA-CBA01': { r1h: 35, r3h: 80, r6h: 125, r24h: 270 }
        },
        warning_summary: { level_5: 3, level_4: 4, level_3: 3, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 4,
        timestamp: '1971-08-24T18:00:00Z',
        event_title: 'T+204h: Lũ bắt đầu rút chậm trên hệ thống sông chính',
        event_description: 'Các lực lượng quân đội và nhân dân kiên cường giữ vững tuyến đê bảo vệ thủ đô Hà Nội.',
        station_readings: {
          'VNA-LCA01': { r1h: 15, r3h: 35, r6h: 55, r24h: 140 },
          'VNA-LCA02': { r1h: 18, r3h: 40, r6h: 60, r24h: 155 },
          'VNA-YBI01': { r1h: 16, r3h: 38, r6h: 58, r24h: 150 },
          'VNA-SLA01': { r1h: 12, r3h: 28, r6h: 45, r24h: 115 },
          'VNA-CBA01': { r1h: 10, r3h: 24, r6h: 38, r24h: 95 }
        },
        warning_summary: { level_5: 1, level_4: 3, level_3: 4, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 5,
        timestamp: '1971-08-26T12:00:00Z',
        event_title: 'T+246h: Nước rút, bắt đầu chiến dịch hàn gắn đê điều và cứu trợ đồng bào',
        event_description: 'Thiệt hại nặng nề nhưng để lại bài học vô giá về quy hoạch thoát lũ và xây dựng hệ thống đập thủy điện bậc thang sông Đà.',
        station_readings: {
          'VNA-LCA01': { r1h: 4, r3h: 9, r6h: 15, r24h: 45 },
          'VNA-LCA02': { r1h: 5, r3h: 11, r6h: 18, r24h: 50 },
          'VNA-YBI01': { r1h: 4, r3h: 8, r6h: 14, r24h: 42 },
          'VNA-SLA01': { r1h: 3, r3h: 7, r6h: 12, r24h: 35 },
          'VNA-CBA01': { r1h: 3, r3h: 6, r6h: 10, r24h: 30 }
        },
        warning_summary: { level_5: 0, level_4: 0, level_3: 2, level_2: 5, level_1: 3 }
      }
    ]
  },
  {
    id: 'scenario-laichau-1990',
    name: 'Lũ Quét Kinh Hoàng Thị Xã Lai Châu Cũ (06/1990)',
    era: '1971_2000',
    era_label: 'Thời kỳ 1971 - 2000',
    year: 1990,
    description: 'Trận lũ quét bùn đá thảm khốc san phẳng thị xã Lai Châu cũ (nay là TX Mường Lay) trong đêm 27/6/1990, cuốn trôi hàng trăm căn nhà và công trình kiên cố.',
    date_range: '26/06/1990 - 29/06/1990',
    meteorological_cause: 'Mây đối lưu nhiệt đới cực mạnh phát triển trên đỉnh núi cao kết hợp địa hình hẻm vực thung lũng sông Nậm Na',
    historical_significance: 'Vụ thiên tai bước ngoặt khiến Đảng và Nhà nước quyết định di dời toàn bộ trung tâm tỉnh lỵ Lai Châu về thị xã Điện Biên Phủ và tái thiết Mường Lay.',
    total_frames: 5,
    frames: [
      {
        frame_index: 0,
        timestamp: '1990-06-26T18:00:00Z',
        event_title: 'T+00h: Mưa dông nhiệt cực lớn trên thượng nguồn suối Nậm Lay & sông Nậm Na',
        event_description: 'Mưa như trút trên đỉnh đèo Ma Thì Hồ, lượng mưa đo được tại trạm Mường Lay đạt 85mm chỉ trong 2 giờ.',
        station_readings: {
          'VNA-SLA01': { r1h: 45, r3h: 85, r6h: 110, r24h: 145 },
          'VNA-LCA01': { r1h: 25, r3h: 50, r6h: 70, r24h: 95 },
          'VNA-YBI01': { r1h: 20, r3h: 40, r6h: 60, r24h: 80 }
        },
        warning_summary: { level_5: 0, level_4: 2, level_3: 3, level_2: 3, level_1: 2 }
      },
      {
        frame_index: 1,
        timestamp: '1990-06-27T01:00:00Z',
        event_title: 'T+07h: Vỡ đập tự nhiên do nghẽn gỗ đá trên thượng nguồn',
        event_description: 'Đất đá từ vách núi sạt xuống chặn dòng suối tạo thành hồ tạm, sau đó bục vỡ tạo sóng lũ cao hơn 5 mét.',
        station_readings: {
          'VNA-SLA01': { r1h: 78, r3h: 155, r6h: 210, r24h: 290 },
          'VNA-LCA01': { r1h: 35, r3h: 70, r6h: 100, r24h: 140 },
          'VNA-YBI01': { r1h: 28, r3h: 55, r6h: 80, r24h: 110 }
        },
        warning_summary: { level_5: 2, level_4: 4, level_3: 3, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '1990-06-27T03:30:00Z',
        event_title: 'T+09h: Sóng lũ bùn đá quét qua trung tâm thị xã Lai Châu trong đêm (Cấp 5)',
        event_description: 'Dòng thác bùn đá gầm vang cuốn phăng bệnh viện, trường học, nhà cửa và cầu treo bản Chiềng Chăn.',
        station_readings: {
          'VNA-SLA01': { r1h: 92, r3h: 190, r6h: 260, r24h: 370 },
          'VNA-LCA01': { r1h: 42, r3h: 85, r6h: 125, r24h: 175 },
          'VNA-YBI01': { r1h: 32, r3h: 65, r6h: 95, r24h: 130 }
        },
        warning_summary: { level_5: 4, level_4: 4, level_3: 2, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '1990-06-27T14:00:00Z',
        event_title: 'T+20h: Nước lũ tràn ra lòng sông Đà, chia cắt toàn bộ tuyến QL12 và QL6',
        event_description: 'Thị xã ngập trong lớp bùn đất dày 2-3 mét. Trực thăng quân sự được huy động thả lương thực và thuốc men.',
        station_readings: {
          'VNA-SLA01': { r1h: 25, r3h: 55, r6h: 90, r24h: 280 },
          'VNA-LCA01': { r1h: 18, r3h: 38, r6h: 60, r24h: 120 },
          'VNA-YBI01': { r1h: 15, r3h: 30, r6h: 50, r24h: 95 }
        },
        warning_summary: { level_5: 2, level_4: 3, level_3: 4, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 4,
        timestamp: '1990-06-29T08:00:00Z',
        event_title: 'T+62h: Ổn định dân cư vùng lũ và quyết định tái định cư lịch sử',
        event_description: 'Các đoàn công tác Trung ương có mặt tại hiện trường, đánh giá nguy cơ địa chất và lập đồ án quy hoạch tái thiết đô thị mới.',
        station_readings: {
          'VNA-SLA01': { r1h: 4, r3h: 10, r6h: 18, r24h: 50 },
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 20, r24h: 45 },
          'VNA-YBI01': { r1h: 4, r3h: 9, r6h: 15, r24h: 40 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 2, level_2: 5, level_1: 4 }
      }
    ]
  },
  {
    id: 'scenario-central-1999',
    name: 'Đại Hồng Thủy Miền Trung Thế Kỷ (11/1999)',
    era: '1971_2000',
    era_label: 'Thời kỳ 1971 - 2000',
    year: 1999,
    description: 'Trận mưa lũ chưa từng có trong lịch sử đo đạc khí tượng tại miền Trung với lượng mưa kỷ lục 2.288mm/tuần tại Huế, làm sạt lở núi chôn vùi nhiều thôn xóm.',
    date_range: '01/11/1999 - 06/11/1999',
    meteorological_cause: 'Không khí lạnh cực mạnh tràn xuống phía Nam gặp dải hội tụ nhiệt đới và gió đông ẩm hoạt động dữ dội trên độ cao 1.500 - 5.000m',
    historical_significance: 'Được ghi nhận là trận mưa lũ lớn nhất trong 100 năm tại miền Trung, kích hoạt chương trình "Sống chung với lũ" và chiến lược phòng tránh bão lũ quốc gia.',
    total_frames: 5,
    frames: [
      {
        frame_index: 0,
        timestamp: '1999-11-01T06:00:00Z',
        event_title: 'T+00h: Mưa với cường độ đặc biệt lớn bắt đầu trút xuống dãy Trường Sơn',
        event_description: 'Lượng mưa 24h đầu tiên tại Thừa Thiên Huế, Quảng Trị, Quảng Nam vượt mốc 300mm.',
        station_readings: {
          'VNA-LCA01': { r1h: 45, r3h: 95, r6h: 145, r24h: 280 },
          'VNA-YBI01': { r1h: 40, r3h: 85, r6h: 130, r24h: 250 },
          'VNA-CBA01': { r1h: 35, r3h: 75, r6h: 115, r24h: 220 }
        },
        warning_summary: { level_5: 1, level_4: 4, level_3: 4, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 1,
        timestamp: '1999-11-02T18:00:00Z',
        event_title: 'T+36h: Mưa lịch sử gần 1.000mm/ngày - Nước sông Hương vượt đỉnh lịch sử',
        event_description: 'Toàn bộ vùng đồng bằng bị ngập sâu 2-4 mét. Sạt lở núi quy mô lớn xảy ra tại các huyện miền núi Nam Đông, A Lưới.',
        station_readings: {
          'VNA-LCA01': { r1h: 85, r3h: 190, r6h: 290, r24h: 520 },
          'VNA-YBI01': { r1h: 78, r3h: 175, r6h: 265, r24h: 480 },
          'VNA-CBA01': { r1h: 70, r3h: 155, r6h: 235, r24h: 430 }
        },
        warning_summary: { level_5: 4, level_4: 4, level_3: 2, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '1999-11-03T20:00:00Z',
        event_title: 'T+62h: Cửa biển Thuận An và Hòa Duân bị xé toạc - Thảm họa sạt lở',
        event_description: 'Sóng lớn và dòng lũ dữ xé đứt làng Hải Thành, mở ra cửa biển mới. Hàng ngàn ngôi nhà bị cuốn trôi.',
        station_readings: {
          'VNA-LCA01': { r1h: 95, r3h: 210, r6h: 320, r24h: 590 },
          'VNA-YBI01': { r1h: 88, r3h: 195, r6h: 295, r24h: 540 },
          'VNA-CBA01': { r1h: 80, r3h: 175, r6h: 265, r24h: 480 }
        },
        warning_summary: { level_5: 5, level_4: 4, level_3: 1, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '1999-11-05T06:00:00Z',
        event_title: 'T+96h: Quân đội và tàu hải quân ứng cứu xuyên biển nước',
        event_description: 'Công tác cứu trợ bằng trực thăng và tàu công binh tiếp cận các rốn lũ bị cô lập hoàn toàn suốt 4 ngày.',
        station_readings: {
          'VNA-LCA01': { r1h: 30, r3h: 65, r6h: 100, r24h: 280 },
          'VNA-YBI01': { r1h: 25, r3h: 55, r6h: 85, r24h: 240 },
          'VNA-CBA01': { r1h: 22, r3h: 50, r6h: 75, r24h: 210 }
        },
        warning_summary: { level_5: 2, level_4: 4, level_3: 3, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 4,
        timestamp: '1999-11-06T18:00:00Z',
        event_title: 'T+132h: Lũ rút chậm, đồng bào cả nước hướng về miền Trung ruột thịt',
        event_description: 'Chiến dịch tái thiết và hỗ trợ dựng lại nhà cửa sau cơn đại hồng thủy lịch sử.',
        station_readings: {
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 20, r24h: 60 },
          'VNA-YBI01': { r1h: 6, r3h: 14, r6h: 22, r24h: 65 },
          'VNA-CBA01': { r1h: 4, r3h: 10, r6h: 16, r24h: 48 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 3, level_2: 4, level_1: 2 }
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 3: THỜI KỲ 2001 - 2015 (LŨ QUÉT HÀ NỘI 2008 & CÁC TỈNH TRUNG DU)
  // =========================================================================
  {
    id: 'scenario-hanoi-2008',
    name: 'Đại Hồng Thủy Ngập Úng & Lũ Quét Sạt Lở Bắc Bộ (10/2008)',
    era: '2001_2015',
    era_label: 'Thời kỳ 2001 - 2015',
    year: 2008,
    description: 'Trận mưa lịch sử ngập lụt toàn diện vùng thủ đô Hà Nội và kích hoạt sạt lở ven sông đồi núi Ba Vì, Hòa Bình, Vĩnh Phúc.',
    date_range: '30/10/2008 - 04/11/2008',
    meteorological_cause: 'Rãnh áp thấp có trục qua Bắc Bộ kết hợp hội tụ gió đông nam và đợt không khí lạnh cực mạnh nén dải mây đối lưu',
    historical_significance: 'Trận mưa lớn kỷ lục tại Hà Nội trong hơn 100 năm với tổng lượng mưa nhiều nơi vượt 600-900mm.',
    total_frames: 4,
    frames: [
      {
        frame_index: 0,
        timestamp: '2008-10-30T18:00:00Z',
        event_title: 'T+00h: Mưa xối xả liên tục trút xuống Bắc Bộ',
        event_description: 'Lượng mưa tại các trạm đo nội đô và trung du vượt 100mm/h.',
        station_readings: {
          'VNA-LCA01': { r1h: 40, r3h: 80, r6h: 120, r24h: 180 },
          'VNA-YBI01': { r1h: 45, r3h: 90, r6h: 135, r24h: 200 },
          'VNA-CBA01': { r1h: 35, r3h: 70, r6h: 110, r24h: 160 }
        },
        warning_summary: { level_5: 0, level_4: 2, level_3: 5, level_2: 3, level_1: 2 }
      },
      {
        frame_index: 1,
        timestamp: '2008-10-31T06:00:00Z',
        event_title: 'T+12h: Lượng mưa tích lũy 24h vượt mốc kỷ lục 500mm',
        event_description: 'Các hồ đập thủy lợi đạt dung tích tối đa, xả lũ khẩn cấp ra các sông.',
        station_readings: {
          'VNA-LCA01': { r1h: 70, r3h: 150, r6h: 220, r24h: 360 },
          'VNA-YBI01': { r1h: 75, r3h: 160, r6h: 240, r24h: 390 },
          'VNA-CBA01': { r1h: 60, r3h: 130, r6h: 190, r24h: 310 }
        },
        warning_summary: { level_5: 2, level_4: 5, level_3: 3, level_2: 1, level_1: 1 }
      },
      {
        frame_index: 2,
        timestamp: '2008-11-01T12:00:00Z',
        event_title: 'T+42h: Sạt lở núi Ba Vì & ngập lụt chia cắt giao thông',
        event_description: 'Toàn bộ vùng trũng thấp ven sông Tích, sông Bùi và sông Đáy bị cô lập.',
        station_readings: {
          'VNA-LCA01': { r1h: 50, r3h: 110, r6h: 170, r24h: 320 },
          'VNA-YBI01': { r1h: 55, r3h: 120, r6h: 180, r24h: 340 },
          'VNA-CBA01': { r1h: 42, r3h: 95, r6h: 145, r24h: 260 }
        },
        warning_summary: { level_5: 1, level_4: 4, level_3: 4, level_2: 2, level_1: 1 }
      },
      {
        frame_index: 3,
        timestamp: '2008-11-04T08:00:00Z',
        event_title: 'T+110h: Mưa tạnh, vận hành máy bơm tiêu úng công suất tối đa',
        event_description: 'Khắc phục sự cố sạt lở đê kè và ổn định đời sống nhân dân.',
        station_readings: {
          'VNA-LCA01': { r1h: 5, r3h: 10, r6h: 15, r24h: 50 },
          'VNA-YBI01': { r1h: 6, r3h: 12, r6h: 18, r24h: 60 },
          'VNA-CBA01': { r1h: 4, r3h: 8, r6h: 14, r24h: 45 }
        },
        warning_summary: { level_5: 0, level_4: 0, level_3: 2, level_2: 5, level_1: 5 }
      }
    ]
  },
  {
    id: 'scenario-quangninh-2015',
    name: 'Đại Mưa Lũ Lịch Sử Đất Mỏ Quảng Ninh (07/2015)',
    era: '2001_2015',
    era_label: 'Thời kỳ 2001 - 2015',
    year: 2015,
    description: 'Trận mưa lớn nhất trong 50 năm tại vùng Đông Bắc Bộ với lượng mưa vượt 1.500mm tại Cửa Ông, gây sạt lở bãi thải mỏ than và ngập lụt kinh hoàng.',
    date_range: '25/07/2015 - 04/08/2015',
    meteorological_cause: 'Vùng xoáy thấp hình thành tại chỗ trên vịnh Bắc Bộ kết hợp hội tụ gió mùa đông nam ẩm tầng thấp hoạt động bất thường',
    historical_significance: 'Đợt thiên tai điển hình về thảm họa kết hợp giữa ngập lụt đô thị biển và sạt trượt bãi thải khai thác khoáng sản.',
    total_frames: 4,
    frames: [
      {
        frame_index: 0,
        timestamp: '2015-07-25T12:00:00Z',
        event_title: 'T+00h: Xoáy thấp vịnh Bắc Bộ trút mưa xối xả liên tục 48 giờ',
        event_description: 'Lượng mưa đạt mốc 400mm chỉ trong một đêm tại Hạ Long, Cẩm Phả và Vân Đồn.',
        station_readings: {
          'VNA-CBA01': { r1h: 45, r3h: 90, r6h: 135, r24h: 220 },
          'VNA-LCA01': { r1h: 20, r3h: 40, r6h: 60, r24h: 90 },
          'VNA-YBI01': { r1h: 22, r3h: 45, r6h: 65, r24h: 100 }
        },
        warning_summary: { level_5: 1, level_4: 3, level_3: 4, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 1,
        timestamp: '2015-07-28T04:00:00Z',
        event_title: 'T+64h: Bãi thải mỏ than sạt trượt vùi lấp khu dân cư Cẩm Nhượng, Mông Dương',
        event_description: 'Hàng triệu tấn bùn than trôi tự do tràn vào nhà dân và các tuyến giao thông huyết mạch.',
        station_readings: {
          'VNA-CBA01': { r1h: 85, r3h: 180, r6h: 270, r24h: 490 },
          'VNA-LCA01': { r1h: 30, r3h: 60, r6h: 90, r24h: 140 },
          'VNA-YBI01': { r1h: 32, r3h: 65, r6h: 95, r24h: 150 }
        },
        warning_summary: { level_5: 3, level_4: 4, level_3: 3, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '2015-07-31T14:00:00Z',
        event_title: 'T+146h: Quân khu 3 huy động xe bọc thép và thuyền cao tốc cứu hộ',
        event_description: 'Sơ tán khẩn cấp hơn 10.000 hộ dân vùng chân bãi thải và vùng trũng ngập sâu.',
        station_readings: {
          'VNA-CBA01': { r1h: 40, r3h: 85, r6h: 130, r24h: 280 },
          'VNA-LCA01': { r1h: 18, r3h: 35, r6h: 55, r24h: 90 },
          'VNA-YBI01': { r1h: 20, r3h: 40, r6h: 60, r24h: 95 }
        },
        warning_summary: { level_5: 1, level_4: 3, level_3: 4, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '2015-08-04T08:00:00Z',
        event_title: 'T+236h: Mưa dứt hoàn toàn, tái thiết kè chắn bãi thải và khôi phục mỏ',
        event_description: 'Chính phủ chỉ đạo quy hoạch lại các bãi thải mỏ khoáng sản bảo đảm an toàn dân sinh.',
        station_readings: {
          'VNA-CBA01': { r1h: 4, r3h: 9, r6h: 15, r24h: 45 },
          'VNA-LCA01': { r1h: 3, r3h: 7, r6h: 12, r24h: 35 },
          'VNA-YBI01': { r1h: 3, r3h: 8, r6h: 14, r24h: 40 }
        },
        warning_summary: { level_5: 0, level_4: 0, level_3: 2, level_2: 5, level_1: 3 }
      }
    ]
  },

  // =========================================================================
  // GIAI ĐOẠN 4: THỜI KỲ 2016 - 2024 (MƯỜNG LA, TRÀ LENG, RÀO TRĂNG & SIÊU BÃO YAGI)
  // =========================================================================
  {
    id: 'scenario-muongla-2017',
    name: 'Lũ Quét Lịch Sử Nặm Păm - Mường La, Sơn La (08/2017)',
    era: '2016_2024',
    era_label: 'Thời kỳ 2016 - 2024',
    year: 2017,
    description: 'Trận lũ quét kinh hoàng trong đêm tại lưu vực suối Nặm Păm cuốn trôi hàng trăm ngôi nhà và cầu treo trung tâm huyện.',
    date_range: '02/08/2017 - 04/08/2017',
    meteorological_cause: 'Dải hội tụ nhiệt đới vắt qua Bắc Bộ kết hợp hội tụ gió trên cao phát triển mây đối lưu cực mạnh',
    historical_significance: 'Một trong những trận lũ quét tàn phá khốc liệt nhất vùng Tây Bắc thế kỷ 21.',
    total_frames: 5,
    frames: [
      {
        frame_index: 0,
        timestamp: '2017-08-02T19:00:00Z',
        event_title: 'T+00h: Mây đối lưu cực mạnh hình thành trên dãy núi Sơn La - Mường La',
        event_description: 'Mưa dông cường độ lớn bắt đầu trút xuống thượng nguồn suối Nặm Păm.',
        station_readings: {
          'VNA-SLA01': { r1h: 35, r3h: 55, r6h: 70, r24h: 95 },
          'VNA-LCA01': { r1h: 10, r3h: 20, r6h: 30, r24h: 45 },
          'VNA-YBI01': { r1h: 15, r3h: 28, r6h: 42, r24h: 58 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 3, level_2: 4, level_1: 4 }
      },
      {
        frame_index: 1,
        timestamp: '2017-08-02T23:00:00Z',
        event_title: 'T+04h: Mưa tập trung đặc biệt lớn vượt 110mm/3h',
        event_description: 'Sườn dốc Nặm Păm đạt trạng thái bão hòa 100%. Nước suối bắt đầu chuyển màu đục đỏ.',
        station_readings: {
          'VNA-SLA01': { r1h: 65, r3h: 125, r6h: 165, r24h: 210 },
          'VNA-LCA01': { r1h: 18, r3h: 32, r6h: 48, r24h: 65 },
          'VNA-YBI01': { r1h: 22, r3h: 40, r6h: 60, r24h: 80 }
        },
        warning_summary: { level_5: 0, level_4: 3, level_3: 4, level_2: 3, level_1: 2 }
      },
      {
        frame_index: 2,
        timestamp: '2017-08-03T02:30:00Z',
        event_title: 'T+07h: Lũ quét xé toang thung lũng Nặm Păm & TT Ít Ong (Cấp 5 Thảm Họa)',
        event_description: 'Dòng lũ bùn đá cao 4m mang theo đá tảng hàng tấn quét sạch trung tâm xã Nặm Păm.',
        station_readings: {
          'VNA-SLA01': { r1h: 85, r3h: 175, r6h: 240, r24h: 320 },
          'VNA-LCA01': { r1h: 25, r3h: 45, r6h: 70, r24h: 90 },
          'VNA-YBI01': { r1h: 30, r3h: 55, r6h: 80, r24h: 105 }
        },
        warning_summary: { level_5: 2, level_4: 4, level_3: 3, level_2: 2, level_1: 1 }
      },
      {
        frame_index: 3,
        timestamp: '2017-08-03T10:00:00Z',
        event_title: 'T+15h: Nước lũ tràn vào hạ lưu Sông Đà, chia cắt toàn huyện',
        event_description: 'Đường tỉnh 109 bị đứt gãy hoàn toàn. Công tác cứu hộ bằng trực thăng được yêu cầu.',
        station_readings: {
          'VNA-SLA01': { r1h: 20, r3h: 48, r6h: 90, r24h: 330 },
          'VNA-LCA01': { r1h: 12, r3h: 25, r6h: 40, r24h: 75 },
          'VNA-YBI01': { r1h: 15, r3h: 30, r6h: 50, r24h: 85 }
        },
        warning_summary: { level_5: 1, level_4: 3, level_3: 4, level_2: 3, level_1: 1 }
      },
      {
        frame_index: 4,
        timestamp: '2017-08-04T08:00:00Z',
        event_title: 'T+37h: Lũ rút, hình thành bãi bồi bùn đá ngổn ngang',
        event_description: 'Quân đội và công an triển khai tái thiết khẩn cấp cho đồng bào vùng lũ.',
        station_readings: {
          'VNA-SLA01': { r1h: 4, r3h: 10, r6h: 18, r24h: 60 },
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 20, r24h: 50 },
          'VNA-YBI01': { r1h: 6, r3h: 14, r6h: 22, r24h: 55 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 2, level_2: 5, level_1: 4 }
      }
    ]
  },
  {
    id: 'scenario-raleng-2020',
    name: 'Sạt Lở Đất Thảm Họa Rào Trăng 3 & Trà Leng (10/2020)',
    era: '2016_2024',
    era_label: 'Thời kỳ 2016 - 2024',
    year: 2020,
    description: 'Tái hiện chuỗi bão lũ dồn dập kích hoạt vụ sạt lở núi kinh hoàng tại Thừa Thiên Huế và Quảng Nam.',
    date_range: '12/10/2020 - 29/10/2020',
    meteorological_cause: 'Bão số 6, bão số 7 và siêu bão số 9 (Molave) dồn dập tấn công kết hợp không khí lạnh mạnh',
    historical_significance: 'Vụ sạt lở đất nghiêm trọng cướp đi sinh mạng nhiều cán bộ, chiến sĩ cứu nạn và đồng bào vùng cao.',
    total_frames: 5,
    frames: [
      {
        frame_index: 0,
        timestamp: '2020-10-12T00:00:00Z',
        event_title: 'T+00h: Đợt mưa tích lũy 5 ngày liên tiếp vượt 600mm tại miền Trung',
        event_description: 'Sườn núi dãy Trường Sơn ngậm no nước, sụt lún ngầm xuất hiện ở nhiều triền dốc.',
        station_readings: {
          'VNA-LCA01': { r1h: 45, r3h: 90, r6h: 140, r24h: 260 },
          'VNA-YBI01': { r1h: 50, r3h: 100, r6h: 155, r24h: 280 },
          'VNA-CBA01': { r1h: 40, r3h: 80, r6h: 125, r24h: 240 }
        },
        warning_summary: { level_5: 1, level_4: 4, level_3: 4, level_2: 2, level_1: 1 }
      },
      {
        frame_index: 1,
        timestamp: '2020-10-12T16:00:00Z',
        event_title: 'T+16h: Núi đổ vùi lấp Nhà máy Thủy điện Rào Trăng 3 (Cấp 5)',
        event_description: 'Hàng triệu m3 đất đá từ đỉnh đồi sập xuống làm gián đoạn mọi tuyến liên lạc.',
        station_readings: {
          'VNA-LCA01': { r1h: 75, r3h: 160, r6h: 240, r24h: 380 },
          'VNA-YBI01': { r1h: 68, r3h: 145, r6h: 220, r24h: 350 },
          'VNA-CBA01': { r1h: 60, r3h: 130, r6h: 195, r24h: 310 }
        },
        warning_summary: { level_5: 3, level_4: 5, level_3: 3, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 2,
        timestamp: '2020-10-28T14:00:00Z',
        event_title: 'T+384h: Bão số 9 (Molave) đổ bộ gây sạt lở nóc Ông Đề - Trà Leng',
        event_description: 'Lũ quét sạt trượt trên sườn núi dốc 35 độ san phẳng cụm dân cư nóc Ông Đề.',
        station_readings: {
          'VNA-LCA01': { r1h: 88, r3h: 190, r6h: 280, r24h: 420 },
          'VNA-YBI01': { r1h: 78, r3h: 165, r6h: 250, r24h: 390 },
          'VNA-CBA01': { r1h: 70, r3h: 150, r6h: 220, r24h: 340 }
        },
        warning_summary: { level_5: 4, level_4: 5, level_3: 2, level_2: 1, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '2020-10-29T10:00:00Z',
        event_title: 'T+404h: Công binh mở đường bộ tiếp cận Trà Leng & Phước Sơn',
        event_description: 'Hàng chục điểm sạt taluy dương dọc QL40B được máy xúc dọn mở luồng cứu nạn.',
        station_readings: {
          'VNA-LCA01': { r1h: 25, r3h: 55, r6h: 90, r24h: 280 },
          'VNA-YBI01': { r1h: 20, r3h: 45, r6h: 75, r24h: 240 },
          'VNA-CBA01': { r1h: 22, r3h: 48, r6h: 80, r24h: 250 }
        },
        warning_summary: { level_5: 2, level_4: 4, level_3: 4, level_2: 1, level_1: 1 }
      },
      {
        frame_index: 4,
        timestamp: '2020-10-31T12:00:00Z',
        event_title: 'T+454h: Ổn định và chuyển các nạn nhân về bệnh viện dã chiến',
        event_description: 'Đánh giá nguy cơ thứ cấp và cắm biển cảnh báo nguy hiểm trên toàn bộ triền dốc.',
        station_readings: {
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 20, r24h: 70 },
          'VNA-YBI01': { r1h: 6, r3h: 14, r6h: 22, r24h: 80 },
          'VNA-CBA01': { r1h: 5, r3h: 10, r6h: 18, r24h: 65 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 3, level_2: 5, level_1: 3 }
      }
    ]
  },
  {
    id: 'scenario-yagi-2024',
    name: 'Siêu Bão Số 3 (YAGI) - Lào Cai, Yên Bái, Cao Bằng (09/2024)',
    era: '2016_2024',
    era_label: 'Thời kỳ 2016 - 2024',
    year: 2024,
    description: 'Tái hiện hoàn lưu bão Yagi gây mưa 350-550mm kích hoạt thảm họa lũ bùn đá Làng Nủ và sạt lở đèo Hoàng Liên, đèo Ca Thành.',
    date_range: '08/09/2024 - 11/09/2024',
    meteorological_cause: 'Siêu bão cấp 16 di chuyển sâu vào đất liền duy trì hoàn lưu áp thấp ẩm khổng lồ vắt ngang Bắc Bộ',
    historical_significance: 'Đợt thiên tai khốc liệt nhất miền Bắc trong 30 năm qua, làm thay đổi toàn diện chiến lược cảnh báo sớm theo thời gian thực.',
    total_frames: 6,
    frames: [
      {
        frame_index: 0,
        timestamp: '2024-09-08T06:00:00Z',
        event_title: 'T+00h: Hoàn lưu bão Yagi bắt đầu tiếp cận vùng núi Bắc Bộ',
        event_description: 'Mưa rào nhẹ rải rác, các sông suối mực nước bình thường. Đất bắt đầu tích ẩm.',
        station_readings: {
          'VNA-LCA01': { r1h: 15, r3h: 25, r6h: 40, r24h: 55 },
          'VNA-LCA02': { r1h: 18, r3h: 30, r6h: 45, r24h: 60 },
          'VNA-LCA03': { r1h: 12, r3h: 20, r6h: 35, r24h: 48 },
          'VNA-YBI01': { r1h: 14, r3h: 24, r6h: 38, r24h: 50 },
          'VNA-CBA01': { r1h: 16, r3h: 28, r6h: 42, r24h: 58 },
          'VNA-SLA01': { r1h: 10, r3h: 18, r6h: 28, r24h: 38 }
        },
        warning_summary: { level_5: 0, level_4: 0, level_3: 1, level_2: 4, level_1: 7 }
      },
      {
        frame_index: 1,
        timestamp: '2024-09-08T18:00:00Z',
        event_title: 'T+12h: Mưa lớn dồn dập mở rộng toàn lưu vực Sông Chảy & Sông Thao',
        event_description: 'Mưa 1h tăng vọt lên 45mm/h. Đất sườn đồi đạt mức bão hòa 65%. Cảnh báo Cấp 3 diện rộng.',
        station_readings: {
          'VNA-LCA01': { r1h: 42, r3h: 85, r6h: 120, r24h: 160 },
          'VNA-LCA02': { r1h: 48, r3h: 92, r6h: 135, r24h: 180 },
          'VNA-LCA03': { r1h: 38, r3h: 75, r6h: 105, r24h: 145 },
          'VNA-YBI01': { r1h: 35, r3h: 70, r6h: 100, r24h: 138 },
          'VNA-CBA01': { r1h: 40, r3h: 80, r6h: 115, r24h: 155 },
          'VNA-SLA01': { r1h: 25, r3h: 52, r6h: 78, r24h: 110 }
        },
        warning_summary: { level_5: 0, level_4: 2, level_3: 6, level_2: 3, level_1: 1 }
      },
      {
        frame_index: 2,
        timestamp: '2024-09-09T04:00:00Z',
        event_title: 'T+22h: Đỉnh điểm mưa lũ cực đoan - Kích hoạt Cấp 4 tại Bảo Yên & Sa Pa',
        event_description: 'Mưa 1h vượt ngưỡng 75mm/h tại Phúc Khánh. Mưa 24h vượt 260mm. Rủi ro lũ quét rất lớn.',
        station_readings: {
          'VNA-LCA01': { r1h: 68, r3h: 135, r6h: 185, r24h: 260 },
          'VNA-LCA02': { r1h: 78, r3h: 155, r6h: 215, r24h: 310 },
          'VNA-LCA03': { r1h: 62, r3h: 125, r6h: 170, r24h: 240 },
          'VNA-YBI01': { r1h: 55, r3h: 110, r6h: 155, r24h: 220 },
          'VNA-CBA01': { r1h: 65, r3h: 130, r6h: 180, r24h: 255 },
          'VNA-SLA01': { r1h: 38, r3h: 78, r6h: 115, r24h: 165 }
        },
        warning_summary: { level_5: 1, level_4: 5, level_3: 4, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 3,
        timestamp: '2024-09-09T14:00:00Z',
        event_title: 'T+32h: Thảm họa lũ bùn đá Làng Nủ & sạt trượt đất Ca Thành (Cấp 5)',
        event_description: 'Mưa 24h vượt 395mm. Độ bão hòa đất đạt 98%. Đất đá từ núi Voi đổ ập vùi lấp toàn bộ thôn Làng Nủ.',
        station_readings: {
          'VNA-LCA01': { r1h: 78, r3h: 160, r6h: 235, r24h: 345 },
          'VNA-LCA02': { r1h: 88, r3h: 185, r6h: 270, r24h: 395 },
          'VNA-LCA03': { r1h: 70, r3h: 145, r6h: 210, r24h: 310 },
          'VNA-YBI01': { r1h: 62, r3h: 130, r6h: 190, r24h: 280 },
          'VNA-CBA01': { r1h: 82, r3h: 170, r6h: 245, r24h: 360 },
          'VNA-SLA01': { r1h: 42, r3h: 85, r6h: 125, r24h: 180 }
        },
        warning_summary: { level_5: 3, level_4: 6, level_3: 3, level_2: 0, level_1: 0 }
      },
      {
        frame_index: 4,
        timestamp: '2024-09-10T06:00:00Z',
        event_title: 'T+48h: Mưa giảm nhưng xuất hiện sạt trượt trễ (Lag landslide risk)',
        event_description: 'Lũ trên sông Hồng và sông Chảy vượt mức lũ lịch sử. Nhiều tuyến tỉnh lộ đứt gãy hoàn toàn.',
        station_readings: {
          'VNA-LCA01': { r1h: 25, r3h: 55, r6h: 90, r24h: 280 },
          'VNA-LCA02': { r1h: 30, r3h: 65, r6h: 110, r24h: 320 },
          'VNA-LCA03': { r1h: 22, r3h: 50, r6h: 80, r24h: 250 },
          'VNA-YBI01': { r1h: 20, r3h: 45, r6h: 75, r24h: 230 },
          'VNA-CBA01': { r1h: 28, r3h: 60, r6h: 95, r24h: 290 },
          'VNA-SLA01': { r1h: 18, r3h: 38, r6h: 58, r24h: 140 }
        },
        warning_summary: { level_5: 1, level_4: 4, level_3: 5, level_2: 2, level_1: 0 }
      },
      {
        frame_index: 5,
        timestamp: '2024-09-11T12:00:00Z',
        event_title: 'T+78h: Chuyển giao sang giai đoạn cứu hộ khẩn cấp & dọn dẹp hiện trường',
        event_description: 'Mưa tạnh, các lực lượng quân đội, công an mở thông đường tiếp cận cứu trợ vùng cô lập.',
        station_readings: {
          'VNA-LCA01': { r1h: 5, r3h: 12, r6h: 18, r24h: 95 },
          'VNA-LCA02': { r1h: 6, r3h: 14, r6h: 22, r24h: 110 },
          'VNA-LCA03': { r1h: 4, r3h: 10, r6h: 18, r24h: 85 },
          'VNA-YBI01': { r1h: 3, r3h: 8, r6h: 15, r24h: 70 },
          'VNA-CBA01': { r1h: 5, r3h: 12, r6h: 20, r24h: 95 },
          'VNA-SLA01': { r1h: 4, r3h: 9, r6h: 14, r24h: 45 }
        },
        warning_summary: { level_5: 0, level_4: 1, level_3: 3, level_2: 5, level_1: 3 }
      }
    ]
  }
];

export class ReplayEngine {
  public getScenarios() {
    return HISTORICAL_SCENARIOS.map((s) => ({
      id: s.id,
      name: s.name,
      era: s.era,
      era_label: s.era_label,
      year: s.year,
      description: s.description,
      date_range: s.date_range,
      meteorological_cause: s.meteorological_cause,
      historical_significance: s.historical_significance,
      total_frames: s.total_frames
    }));
  }

  public getReplayFrame(scenarioId: string, frameIndex: number, thresholdProfiles: ThresholdProfile[]) {
    const scenario = HISTORICAL_SCENARIOS.find((s) => s.id === scenarioId) || HISTORICAL_SCENARIOS[0];
    const safeIndex = Math.max(0, Math.min(scenario.frames.length - 1, frameIndex));
    const frame = scenario.frames[safeIndex];

    // Compute zone assessments for this frame
    const assessments: ZoneRiskAssessment[] = NORTHERN_VIETNAM_ZONES.map((zone) => {
      // Find nearest station readings or fallback
      let r1h = 25, r3h = 50, r6h = 75, r24h = 110;
      if (zone.province_name.includes('Lào Cai') && zone.zone_code.includes('PHUCKHANH')) {
        const sta = frame.station_readings['VNA-LCA02'] || frame.station_readings['VNA-LCA01'];
        if (sta) { r1h = sta.r1h; r3h = sta.r3h; r6h = sta.r6h; r24h = sta.r24h; }
      } else if (zone.province_name.includes('Lào Cai')) {
        const sta = frame.station_readings['VNA-LCA01'] || frame.station_readings['VNA-LCA03'];
        if (sta) { r1h = sta.r1h; r3h = sta.r3h; r6h = sta.r6h; r24h = sta.r24h; }
      } else if (zone.province_name.includes('Sơn La') || zone.province_name.includes('Điện Biên') || zone.province_name.includes('Lai Châu')) {
        const sta = frame.station_readings['VNA-SLA01'] || frame.station_readings['VNA-LCA01'];
        if (sta) { r1h = sta.r1h; r3h = sta.r3h; r6h = sta.r6h; r24h = sta.r24h; }
      } else if (zone.province_name.includes('Yên Bái')) {
        const sta = frame.station_readings['VNA-YBI01'];
        if (sta) { r1h = sta.r1h; r3h = sta.r3h; r6h = sta.r6h; r24h = sta.r24h; }
      } else if (zone.province_name.includes('Cao Bằng') || zone.province_name.includes('Hà Giang')) {
        const sta = frame.station_readings['VNA-CBA01'];
        if (sta) { r1h = sta.r1h; r3h = sta.r3h; r6h = sta.r6h; r24h = sta.r24h; }
      } else {
        const defaultSta = Object.values(frame.station_readings)[0];
        if (defaultSta) {
          r1h = Math.round(defaultSta.r1h * 0.8);
          r3h = Math.round(defaultSta.r3h * 0.8);
          r6h = Math.round(defaultSta.r6h * 0.8);
          r24h = Math.round(defaultSta.r24h * 0.8);
        }
      }

      return hybridRiskEngine.assessZone(zone, r1h, r3h, r6h, r24h, thresholdProfiles, 'VALID');
    });

    return {
      scenario_id: scenario.id,
      scenario_name: scenario.name,
      era: scenario.era,
      era_label: scenario.era_label,
      year: scenario.year,
      meteorological_cause: scenario.meteorological_cause,
      historical_significance: scenario.historical_significance,
      total_frames: scenario.total_frames,
      frame,
      assessments
    };
  }
}

export const replayEngine = new ReplayEngine();
