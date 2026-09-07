import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Users,
  Clock,
  Sparkles,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Eye,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { SocialSensorOverview, SocialMediaPost, SocialIntelCluster, SpatialZone } from '../types';
import { safeFetchJson } from '../utils/apiClient';

interface SocialSensorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: SpatialZone[];
}

export const SocialSensorsModal: React.FC<SocialSensorsModalProps> = ({
  isOpen,
  onClose,
  zones
}) => {
  const [data, setData] = useState<SocialSensorOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CLUSTERS' | 'FEED' | 'SUBMIT'>('CLUSTERS');
  const [selectedCluster, setSelectedCluster] = useState<SocialIntelCluster | null>(null);

  // New report form state
  const [newReport, setNewReport] = useState({
    platform: 'FACEBOOK' as const,
    author_handle: '',
    author_badge: 'LOCAL_RESIDENT' as const,
    original_text: '',
    village_or_poi: '',
    commune_district: '',
    province: 'Lào Cai',
    event_category: 'TURBID_WATER_SURGE' as const,
    event_category_label: 'Dòng nước đục ngầu cuồn cuộn',
    media_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    cv_features: 'Dòng chảy đục ngầu kèm rác hữu cơ trôi nổi'
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const json = await safeFetchJson<SocialSensorOverview>('/api/v1/social-sensors/overview');
      if (json) {
        setData(json);
        if (json.clusters && json.clusters.length > 0) {
          setSelectedCluster(json.clusters[0]);
        }
      }
    } catch (err) {
      console.warn('Notice loading social sensor overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOverview();
    }
  }, [isOpen]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.original_text || !newReport.author_handle) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await safeFetchJson<{ success?: boolean }>('/api/v1/social-sensors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: newReport.platform,
          author_handle: newReport.author_handle,
          author_badge: newReport.author_badge,
          original_text: newReport.original_text,
          extracted_location: {
            village_or_poi: newReport.village_or_poi || 'Khu vực dân cư',
            commune_district: newReport.commune_district || 'Huyện vùng cao',
            province: newReport.province,
            coords_estimated: [22.42, 104.28]
          },
          event_category: newReport.event_category,
          event_category_label: newReport.event_category_label,
          evidence_media: {
            type: 'IMAGE',
            media_url: newReport.media_url,
            cv_detected_features: [newReport.cv_features],
            turbidity_index: 0.85
          },
          likes_shares_count: 1
        })
      });

      if (res?.success) {
        setNewReport({
          platform: 'FACEBOOK',
          author_handle: '',
          author_badge: 'LOCAL_RESIDENT',
          original_text: '',
          village_or_poi: '',
          commune_district: '',
          province: 'Lào Cai',
          event_category: 'TURBID_WATER_SURGE',
          event_category_label: 'Dòng nước đục ngầu cuồn cuộn',
          media_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
          cv_features: 'Dòng chảy đục ngầu kèm rác hữu cơ trôi nổi'
        });
        setActiveTab('FEED');
        await fetchOverview();
      }
    } catch (err) {
      console.warn('Notice submitting report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'FACEBOOK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-600/30">Facebook Group</span>;
      case 'TIKTOK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">TikTok Clip</span>;
      case 'ZALO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-600/20 text-cyan-400 border border-cyan-600/30">Zalo Xã/Bản</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-600/30">YouTube</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Share2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">
                  Cảm Biến Mạng Xã Hội AI (Crowdsourced Social Sensors & VGI)
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Khai Phá Dữ Liệu Cộng Đồng Vùng Xa
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thu thập video, hình ảnh và cảnh báo sớm từ người dân trên Facebook, TikTok, Zalo; trích xuất thực thể địa danh (NLP) và nhận dạng độ đục nước suối (Computer Vision)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metric Highlights */}
          {data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Bài Đăng Quét 24h</span>
                  <Search className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {data.total_scanned_posts_24h.toLocaleString('vi-VN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Facebook, TikTok, Zalo</div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Cảnh Báo Hành Động</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-amber-400">
                  {data.actionable_alerts_count} Tin tức
                </div>
                <div className="text-[11px] text-slate-400 mt-1">AI lọc nhiễu & xác thực</div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Thời Gian Cảnh Báo Sớm Hơn</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  +{data.average_lead_time_gain_minutes} Phút
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">Trước khi trạm đo ghi nhận</div>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Cụm Nguy Cơ Khẩn</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-purple-400">
                  {data.active_clusters_count} Điểm nóng
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Trùng khớp trạm viễn thám</div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('CLUSTERS')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'CLUSTERS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Điểm Nóng Cộng Đồng Tích Hợp (Spatial Clusters)
            </button>
            <button
              onClick={() => setActiveTab('FEED')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'FEED'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Luồng Báo Cáo Thời Gian Thực (Live Stream)
            </button>
            <button
              onClick={() => setActiveTab('SUBMIT')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'SUBMIT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              + Gửi Báo Cáo Thực Địa (Tình nguyện viên / Cán bộ xã)
            </button>
          </div>

          {/* TAB 1: CLUSTERS */}
          {activeTab === 'CLUSTERS' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data?.clusters.map((cluster) => {
                  const isSelected = selectedCluster?.id === cluster.id;
                  return (
                    <div
                      key={cluster.id}
                      onClick={() => setSelectedCluster(cluster)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-white">{cluster.zone_name}</h4>
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          {cluster.urgency_score}% Khẩn cấp
                        </span>
                      </div>
                      <div className="text-xs text-amber-300 font-medium mb-2">{cluster.dominant_hazard}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                        {cluster.key_evidence_summary}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>{cluster.total_reports} bài đăng ghi nhận</span>
                        <span className="text-emerald-400 font-semibold">Khớp viễn thám</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedCluster && (
                <div className="bg-slate-950/80 p-5 rounded-xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Chi tiết Cụm Cảnh báo Mạng Xã hội: {selectedCluster.zone_name} ({selectedCluster.province_name})
                    </h3>
                    <span className="text-xs text-slate-400">
                      Báo cáo đầu tiên: {new Date(selectedCluster.first_report_time).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                      <div className="text-slate-400 font-semibold flex items-center gap-1.5 text-amber-300">
                        <Users className="w-4 h-4" /> Tổng Hợp Thông Tin Người Dân:
                      </div>
                      <p className="text-slate-300 leading-relaxed">{selectedCluster.key_evidence_summary}</p>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                      <div className="text-slate-400 font-semibold flex items-center gap-1.5 text-emerald-300">
                        <ShieldCheck className="w-4 h-4" /> Đối Soát Tự Động Với Trạm Đo Mưa & InSAR:
                      </div>
                      <p className="text-slate-300 leading-relaxed">{selectedCluster.cross_validation_with_telemetry}</p>
                    </div>
                  </div>

                  <div className="bg-red-950/30 p-3.5 rounded-lg border border-red-500/30 text-xs">
                    <span className="font-bold text-red-300">Đề xuất Hành động Ban Chỉ huy: </span>
                    <span className="text-slate-200">{selectedCluster.suggested_commander_action}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE FEED */}
          {activeTab === 'FEED' && (
            <div className="space-y-3">
              {data?.recent_live_feed.map((post) => (
                <div key={post.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700">
                        {post.author_handle.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{post.author_handle}</span>
                          {getPlatformBadge(post.platform)}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{post.extracted_location.village_or_poi}, {post.extracted_location.province}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(post.posted_at).toLocaleTimeString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Sớm +{post.lead_time_gain_minutes} Phút
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        Độ tin cậy AI {post.ai_confidence_score}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    "{post.original_text}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                    <div className="col-span-2">
                      <span className="text-slate-500 text-[10px] block">Thị giác máy tính (CV Evidence Tagging):</span>
                      <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5 mt-0.5">
                        {post.evidence_media.cv_detected_features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Chỉ số Độ đục Dòng chảy:</span>
                      <strong className="text-amber-400 font-mono text-sm">
                        {(post.evidence_media.turbidity_index * 100).toFixed(0)}% (Cực kỳ đục)
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SUBMIT REPORT */}
          {activeTab === 'SUBMIT' && (
            <form onSubmit={handleSubmitReport} className="bg-slate-950/80 p-5 rounded-xl border border-amber-500/30 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Camera className="w-5 h-5" />
                Cổng Tiếp Nhận Báo Cáo Thực Địa (Volunteered Geographic Information)
              </div>
              <p className="text-slate-400">
                Dành cho lực lượng xung kích xã, cán bộ khuyến nông, phượt thủ hoặc người dân địa phương thông báo hiện tượng bất thường (nước suối đổi màu, nứt đất, đá lăn).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Họ tên / Đơn vị báo cáo:</label>
                  <input
                    type="text"
                    value={newReport.author_handle}
                    onChange={(e) => setNewReport({ ...newReport, author_handle: e.target.value })}
                    placeholder="VD: Trưởng bản Lý A Sáng / Anh Tuấn (Lái xe)"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nguồn kênh thông tin:</label>
                  <select
                    value={newReport.platform}
                    onChange={(e) => setNewReport({ ...newReport, platform: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="FACEBOOK">Facebook (Nhóm địa phương)</option>
                    <option value="TIKTOK">TikTok (Video ngắn)</option>
                    <option value="ZALO">Zalo (Nhóm xóm / bản)</option>
                    <option value="YOUTUBE">YouTube Livestream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tỉnh / Thành phố:</label>
                  <select
                    value={newReport.province}
                    onChange={(e) => setNewReport({ ...newReport, province: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lào Cai">Lào Cai</option>
                    <option value="Yên Bái">Yên Bái</option>
                    <option value="Hà Giang">Hà Giang</option>
                    <option value="Cao Bằng">Cao Bằng</option>
                    <option value="Nghệ An">Nghệ An</option>
                    <option value="Quảng Nam">Quảng Nam</option>
                    <option value="Lâm Đồng">Lâm Đồng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tên Bản / Đèo / Cầu / Suối cụ thể:</label>
                  <input
                    type="text"
                    value={newReport.village_or_poi}
                    onChange={(e) => setNewReport({ ...newReport, village_or_poi: e.target.value })}
                    placeholder="VD: Bản Nủ, Đèo Khau Phạ, Cầu tràn Thác Giềng"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nội dung chi tiết quan sát được:</label>
                <textarea
                  rows={3}
                  value={newReport.original_text}
                  onChange={(e) => setNewReport({ ...newReport, original_text: e.target.value })}
                  placeholder="Mô tả màu nước suối, tiếng nổ sườn đồi, vết nứt mặt đường, hoặc tình trạng ách tắc giao thông..."
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/30"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Đang phân tích...' : 'Gửi Báo Cáo Vào AI Sensor ➔'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Công nghệ: Vietnamese NLP Disaster Entity Extractor & Media Turbidity Computer Vision</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
