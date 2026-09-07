import {
  SocialMediaPost,
  SocialIntelCluster,
  SocialSensorOverview,
  SpatialZone,
  ZoneRiskAssessment
} from '../../src/types';

export class SocialSensorEngine {
  private livePosts: SocialMediaPost[] = [
    {
      id: 'SOC-FB-11890-LS',
      platform: 'FACEBOOK',
      author_handle: 'Hoàng Văn Toàn (Thôn Hợp Tiến, Chi Lăng)',
      author_badge: 'LOCAL_RESIDENT',
      original_text: '⚠️ KHẨN CẤP ĐÊM NAY! Lúc 22h30 một khối đá tảng to như gian nhà từ trên núi đá lăn thẳng xuống xóm Hợp Tiến (xã Chi Lăng), đâm thủng tường nhà 2 tầng của bà con và đè bẹp ô tô! Chính quyền xã và bộ đội đang vào sơ tán bà con trong đêm. Mưa vẫn xối xả!',
      extracted_location: {
        village_or_poi: 'Thôn Hợp Tiến, Vách núi Chi Lăng',
        commune_district: 'Xã Chi Lăng, Huyện Chi Lăng',
        province: 'Lạng Sơn',
        coords_estimated: [21.658, 106.592],
        zone_id_matched: 'ZONE-LS-01'
      },
      event_category: 'SLOPE_FISSURE_EXPLOSION',
      event_category_label: 'Sạt lở đá tảng sườn núi + Sập thủng nhà dân',
      evidence_media: {
        type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Khối đá vôi kích thước lớn đâm sập góc tường nhà kiên cố',
          'Vết trượt vách đá dốc đứng >60 độ',
          'Hiện trường nguy hiểm cần di dời dân cư tức thì'
        ],
        turbidity_index: 0.95
      },
      posted_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      likes_shares_count: 2840,
      ai_confidence_score: 98.2,
      verification_status: 'CROSS_CORROBORATED',
      lead_time_gain_minutes: 120
    },
    {
      id: 'SOC-ZL-99214-LS',
      platform: 'ZALO',
      author_handle: 'Nhóm Cứu Hộ Giao Thông QL4A Na Sầm',
      author_badge: 'VOLUNTEER',
      original_text: 'Thông báo anh em lái xe: QL4A đoạn qua Na Sầm (thôn An Hùng) sạt lở hàng nghìn khối đất đá ngập tràn mặt đường, xe hoàn toàn không thể qua. Nhiều nhà dân ven taluy phải di tản khẩn cấp!',
      extracted_location: {
        village_or_poi: 'Quốc lộ 4A (Thôn An Hùng)',
        commune_district: 'Thị trấn Na Sầm, Huyện Văn Lãng',
        province: 'Lạng Sơn',
        coords_estimated: [21.921, 106.634],
        zone_id_matched: 'ZONE-LS-02'
      },
      event_category: 'ROAD_BRIDGE_WASHOUT',
      event_category_label: 'Sạt lở taluy dương quy mô lớn + Tắc Quốc lộ 4A',
      evidence_media: {
        type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Đất đá taluy tràn 100% mặt cắt ngang đường Quốc lộ 4A',
          'Khối lượng trượt ước tính >5.000m3',
          'Nguy cơ trượt thứ cấp khi mưa tiếp diễn'
        ],
        turbidity_index: 0.91
      },
      posted_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      likes_shares_count: 1450,
      ai_confidence_score: 95.0,
      verification_status: 'VERIFIED_BY_STATION',
      lead_time_gain_minutes: 90
    },
    {
      id: 'SOC-FB-10492',
      platform: 'FACEBOOK',
      author_handle: 'Giàng A Tủa (Trưởng Bản)',
      author_badge: 'COMMUNE_OFFICER',
      original_text: '⚠️ Báo cáo bà con! Suối đầu nguồn Làng Nủ (Bảo Yên) từ 30 phút trước nước chuyển sang màu đỏ quạch như gạch nung, có tiếng ầm ầm như sấm rền trên đỉnh núi Con Voi. Cầu gỗ tạm đã bị nước cuốn trôi. Đề nghị các hộ ven suối chạy ngay lên nhà văn hóa trên đồi!',
      extracted_location: {
        village_or_poi: 'Làng Nủ, Suối Voi',
        commune_district: 'Phúc Khánh, Bảo Yên',
        province: 'Lào Cai',
        coords_estimated: [22.428, 104.295],
        zone_id_matched: 'ZONE-LC-01'
      },
      event_category: 'TURBID_WATER_SURGE',
      event_category_label: 'Dòng nước đục ngầu đột ngột + Tiếng nổ đỉnh núi',
      evidence_media: {
        type: 'VIDEO',
        media_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Độ đục dòng chảy cực cao (Turbidity Index 0.94)',
          'Gỗ mục và rác hữu cơ trôi nổi mật độ dày',
          'Vận tốc dòng chảy đo qua thị giác máy tính: 7.2 m/s'
        ],
        turbidity_index: 0.94
      },
      posted_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      likes_shares_count: 342,
      ai_confidence_score: 96.5,
      verification_status: 'VERIFIED_BY_STATION',
      lead_time_gain_minutes: 85
    },
    {
      id: 'SOC-TT-89211',
      platform: 'TIKTOK',
      author_handle: '@taybac_explore (Phượt thủ)',
      author_badge: 'TOURIST',
      original_text: 'Đang leo đèo Khau Phạ đoạn km 272 qua Mù Cang Chải thì thấy sườn đồi phía trên nứt toác 1 rãnh dài hơn 50 mét, đất đá nhỏ bắt đầu lăn rào rào xuống mặt đường. Ô tô đang ùn ứ quay đầu gấp mọi người đừng đi qua!',
      extracted_location: {
        village_or_poi: 'Đèo Khau Phạ (Km 272)',
        commune_district: 'Mù Cang Chải',
        province: 'Yên Bái',
        coords_estimated: [21.854, 104.092],
        zone_id_matched: 'ZONE-YB-01'
      },
      event_category: 'SLOPE_FISSURE_EXPLOSION',
      event_category_label: 'Vết nứt sườn taluy dương + Đá lăn',
      evidence_media: {
        type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Phát hiện vết nứt địa chất dạng vòng cung (Tension Crack)',
          'Góc trượt taluy dương 42 độ',
          'Phương tiện ách tắc 2 chiều'
        ],
        turbidity_index: 0.72
      },
      posted_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      likes_shares_count: 1250,
      ai_confidence_score: 92.0,
      verification_status: 'CROSS_CORROBORATED',
      lead_time_gain_minutes: 110
    },
    {
      id: 'SOC-ZL-44012',
      platform: 'ZALO',
      author_handle: 'Nhóm Zalo Xã Tà Cạ (Kỳ Sơn)',
      author_badge: 'LOCAL_RESIDENT',
      original_text: 'Mưa to trắng trời từ 4h sáng đến giờ chưa ngớt. Khe Huổi Giảng nước dâng ngập đến mép sàn nhà dân bản Sơn Hà, đất bùn đỏ quạch tràn vào đường liên thôn.',
      extracted_location: {
        village_or_poi: 'Bản Sơn Hà, Khe Huổi Giảng',
        commune_district: 'Tà Cạ, Kỳ Sơn',
        province: 'Nghệ An',
        coords_estimated: [19.412, 104.145],
        zone_id_matched: 'ZONE-NA-01'
      },
      event_category: 'TORRENTIAL_RAIN',
      event_category_label: 'Mưa cực đoan + Nước dâng khe suối',
      evidence_media: {
        type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1438449805896-28a666819a20?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Mức ngập cục bộ 0.6m',
          'Dòng nước cuốn trôi bùn đất'
        ],
        turbidity_index: 0.88
      },
      posted_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      likes_shares_count: 85,
      ai_confidence_score: 88.5,
      verification_status: 'CROSS_CORROBORATED',
      lead_time_gain_minutes: 65
    },
    {
      id: 'SOC-YT-77192',
      platform: 'YOUTUBE',
      author_handle: 'Tình Nguyện Viên Vùng Cao',
      author_badge: 'VOLUNTEER',
      original_text: 'Trực tiếp cảnh báo: Cầu tràn Thác Giềng qua Pác Nặm Bắc Kạn đã bị ngập sâu hơn 1.2m, dòng chảy xiết cuốn trôi cột mốc cảnh báo. Tuyệt đối không cho xe máy qua lại!',
      extracted_location: {
        village_or_poi: 'Cầu tràn Thác Giềng',
        commune_district: 'Bộc Bố, Pác Nặm',
        province: 'Bắc Kạn',
        coords_estimated: [22.465, 105.712],
        zone_id_matched: 'ZONE-BK-01'
      },
      event_category: 'ROAD_BRIDGE_WASHOUT',
      event_category_label: 'Ngầm tràn ngập sâu + Chia cắt giao thông',
      evidence_media: {
        type: 'VIDEO',
        media_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Mực nước tràn đỉnh ngầm 1.2m',
          'Vận tốc dòng xoáy: 6.8 m/s'
        ],
        turbidity_index: 0.91
      },
      posted_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      likes_shares_count: 560,
      ai_confidence_score: 94.0,
      verification_status: 'VERIFIED_BY_STATION',
      lead_time_gain_minutes: 90
    },
    {
      id: 'SOC-FB-55102-QNAM',
      platform: 'FACEBOOK',
      author_handle: 'Hồ Văn Dũng (Bản Trà Leng)',
      author_badge: 'LOCAL_RESIDENT',
      original_text: '⚠️ Mưa bão dồn dập từ chiều, sườn đồi phía sau bản Trà Leng nứt rãnh lớn, tiếng đất đá chuyển mình. Bà con đang kéo nhau chạy lên Trường Tiểu học tránh trú!',
      extracted_location: {
        village_or_poi: 'Thôn 1 Xã Trà Leng',
        commune_district: 'Nam Trà My',
        province: 'Quảng Nam',
        coords_estimated: [15.195, 108.068],
        zone_id_matched: 'ZONE-QNAM-01'
      },
      event_category: 'SLOPE_FISSURE_EXPLOSION',
      event_category_label: 'Nứt sườn núi + Sơ tán khẩn cấp Trà Leng',
      evidence_media: {
        type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Vết nứt trượt sườn đồi dốc >50 độ',
          'Người dân di tản trật tự'
        ],
        turbidity_index: 0.89
      },
      posted_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likes_shares_count: 890,
      ai_confidence_score: 96.0,
      verification_status: 'CROSS_CORROBORATED',
      lead_time_gain_minutes: 75
    },
    {
      id: 'SOC-ZL-88319-LD',
      platform: 'ZALO',
      author_handle: 'Đội SOS Cứu Hộ Đèo Bảo Lộc',
      author_badge: 'VOLUNTEER',
      original_text: 'Cảnh báo sạt lở đèo Bảo Lộc: Km 103+300 taluy dương đất đỏ bazan sạt tràn 1 làn đường, cây xanh ngã đổ. Lực lượng CSGT đang hướng dẫn xe quay đầu.',
      extracted_location: {
        village_or_poi: 'Km 103 Đèo Bảo Lộc',
        commune_district: 'Đạ Huoai, Bảo Lộc',
        province: 'Lâm Đồng',
        coords_estimated: [11.472, 107.726],
        zone_id_matched: 'ZONE-LD-01'
      },
      event_category: 'ROAD_BRIDGE_WASHOUT',
      event_category_label: 'Sạt lở taluy dương Đèo Bảo Lộc',
      evidence_media: {
        type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
        cv_detected_features: [
          'Khối trượt đất đỏ bazan bão hòa nước',
          'Cây thông ngã đổ chắn đường'
        ],
        turbidity_index: 0.82
      },
      posted_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      likes_shares_count: 670,
      ai_confidence_score: 93.5,
      verification_status: 'CROSS_CORROBORATED',
      lead_time_gain_minutes: 60
    }
  ];

  public getOverview(zones: SpatialZone[], assessments: ZoneRiskAssessment[]): SocialSensorOverview {
    // Generate Clusters
    const clusters: SocialIntelCluster[] = [
      {
        id: 'CLUS-01-LAOCAI',
        zone_id: 'ZONE-LC-01',
        zone_name: 'Làng Nủ (Bảo Yên)',
        province_name: 'Lào Cai',
        total_reports: 18,
        dominant_hazard: 'Dòng bùn đỏ quạch + Tiếng nổ lớn đỉnh núi',
        urgency_score: 96,
        first_report_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        latest_report_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        key_evidence_summary: 'Hơn 18 bài đăng Facebook & Zalo ghi nhận suối đổi màu đục ngầu đột ngột kèm tiếng rung chuyển cơ học sườn núi Con Voi.',
        cross_validation_with_telemetry: 'Trạm đo mưa Bảo Yên ghi nhận mưa 1h = 48mm, InSAR ghi nhận nứt tách sườn dốc cấp CRITICAL. Khớp 100% với báo cáo người dân.',
        suggested_commander_action: 'Lập tức kích hoạt Cell Broadcast sơ tán khẩn cấp toàn bộ các hộ dân trong bán kính 1.2km từ trục suối.',
        posts: this.livePosts.filter((p) => p.extracted_location.zone_id_matched === 'ZONE-LC-01')
      },
      {
        id: 'CLUS-02-YENBAI',
        zone_id: 'ZONE-YB-01',
        zone_name: 'Mù Cang Chải',
        province_name: 'Yên Bái',
        total_reports: 12,
        dominant_hazard: 'Nứt taluy dương Đèo Khau Phạ + Tắc đường',
        urgency_score: 89,
        first_report_time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        latest_report_time: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        key_evidence_summary: 'Video TikTok từ tài xế ghi lại vết nứt 50m trên sườn taluy QL32, đất đá rơi xuống mặt đường.',
        cross_validation_with_telemetry: 'Radar Pha Đin ghi nhận khối mây đối lưu 54 dBZ di chuyển hướng Đèo Khau Phạ.',
        suggested_commander_action: 'Chốt chặn 2 đầu đèo tại ngã ba Kim Nọi và chân đèo phía Văn Chấn.',
        posts: this.livePosts.filter((p) => p.extracted_location.zone_id_matched === 'ZONE-YB-01')
      },
      {
        id: 'CLUS-03-NGHEAN',
        zone_id: 'ZONE-NA-01',
        zone_name: 'Kỳ Sơn',
        province_name: 'Nghệ An',
        total_reports: 9,
        dominant_hazard: 'Mưa cực đoan + Nước dâng khe Huổi Giảng',
        urgency_score: 84,
        first_report_time: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        latest_report_time: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        key_evidence_summary: 'Bản tin Zalo địa phương cảnh báo lũ tràn vào nhà dân bản Sơn Hà.',
        cross_validation_with_telemetry: 'Trạm mưa Kỳ Sơn đạt 145mm/24h, độ bão hòa đất 88%.',
        suggested_commander_action: 'Điều động ca nô và lực lượng xung kích xã hỗ trợ di dời đồ đạc người dân lên nhà văn hóa.',
        posts: this.livePosts.filter((p) => p.extracted_location.zone_id_matched === 'ZONE-NA-01')
      }
    ];

    return {
      total_scanned_posts_24h: 3840,
      actionable_alerts_count: 42,
      active_clusters_count: clusters.length,
      average_lead_time_gain_minutes: 87.5,
      clusters,
      recent_live_feed: this.livePosts
    };
  }

  public addNewReport(post: Omit<SocialMediaPost, 'id' | 'posted_at' | 'ai_confidence_score' | 'verification_status' | 'lead_time_gain_minutes'>): SocialMediaPost {
    const fullPost: SocialMediaPost = {
      ...post,
      id: `SOC-USER-${Date.now()}`,
      posted_at: new Date().toISOString(),
      ai_confidence_score: Math.round((85 + Math.random() * 12) * 10) / 10,
      verification_status: 'PENDING_TRIAGE',
      lead_time_gain_minutes: Math.round(60 + Math.random() * 45)
    };

    this.livePosts.unshift(fullPost);
    return fullPost;
  }
}

export const socialSensorEngine = new SocialSensorEngine();
