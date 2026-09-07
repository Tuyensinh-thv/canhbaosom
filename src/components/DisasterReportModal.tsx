import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  ShieldAlert,
  AlertTriangle,
  Download,
  Calendar,
  Building,
  Users,
  Layers,
  MapPin,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

interface DisasterReportModalProps {
  onClose: () => void;
}

export const DisasterReportModal: React.FC<DisasterReportModalProps> = ({ onClose }) => {
  const [bulletin, setBulletin] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchBulletin = async () => {
    setLoading(true);
    try {
      const data = await safeFetchJson('/api/v1/reports/situation-bulletin');
      if (data) setBulletin(data);
    } catch (e) {
      console.warn('Notice loading situation bulletin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletin();
  }, []);

  const handleCopyText = () => {
    if (!bulletin) return;
    const text = `
${bulletin.issuing_body}
${bulletin.system_name}
Số hiệu: ${bulletin.bulletin_id}
Thời gian ban hành: ${new Date(bulletin.issued_at).toLocaleString('vi-VN')}

${bulletin.title}

1. TỔNG QUAN TÌNH HÌNH:
${bulletin.overview}

2. THỐNG KÊ MỨC ĐỘ THIỆT HẠI & NGUY CƠ:
- Số điểm Báo động đỏ Thảm họa Cấp 5: ${bulletin.severity_summary.level_5_disaster_count} điểm
- Số điểm Nguy cơ rất lớn Cấp 4: ${bulletin.severity_summary.level_4_very_high_count} điểm
- Số điểm Nguy cơ lớn Cấp 3: ${bulletin.severity_summary.level_3_high_count} điểm
- Ước tính dân số trong vùng ảnh hưởng: ${bulletin.severity_summary.estimated_vulnerable_population.toLocaleString()} người

3. CÁC ĐỊA BÀN TRỌNG ĐIỂM XUNG YẾU:
${bulletin.critical_points.map((p: any) => `- ${p.zone_name} (${p.district}, ${p.province}): Cấp ${p.level} - Mưa 24h: ${p.rain_24h}mm - Bão hòa đất: ${p.saturation}% -> ${p.recommendation}`).join('\n')}

4. Ý KIẾN CHỈ ĐẠO & PHƯƠNG ÁN ỨNG PHÓ:
${bulletin.directives.join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                BẢN TIN TÌNH HUỐNG KHẨN CẤP & CÔNG ĐIỆN TÁC CHIẾN PCTT
              </h2>
              <p className="text-xs text-slate-400">
                Xuất bản theo chuẩn thể thức Ban Chỉ đạo Quốc gia về Phòng chống Thiên tai
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBulletin}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Xuất PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 text-slate-100 font-sans">
          {loading || !bulletin ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Đang trích xuất dữ liệu và khởi tạo bản tin tình huống...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-xl space-y-6">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b border-slate-700 pb-4 text-xs">
                <div>
                  <div className="font-extrabold uppercase text-slate-200 tracking-wider">
                    {bulletin.issuing_body}
                  </div>
                  <div className="font-semibold text-blue-400">
                    {bulletin.system_name}
                  </div>
                  <div className="text-slate-400 mt-1 font-mono">
                    Số: <span className="font-bold text-slate-200">{bulletin.bulletin_id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold uppercase text-slate-200">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-slate-400 mt-1 flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(bulletin.issued_at).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2">
                <h1 className="text-lg font-extrabold text-rose-400 uppercase tracking-wide">
                  {bulletin.title}
                </h1>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  CẤP ĐỘ RỦI RO THIÊN TAI: CẤP 4 - CẤP 5 (ĐẶC BIỆT NGUY HIỂM)
                </span>
              </div>

              {/* Section 1: Overview */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-200 border-l-4 border-blue-500 pl-2 uppercase tracking-wide mb-2">
                  I. TỔNG QUAN TÌNH HÌNH DIỄN BIẾN
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {bulletin.overview}
                </p>
              </div>

              {/* Section 2: Severity Stats */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-200 border-l-4 border-amber-500 pl-2 uppercase tracking-wide mb-2">
                  II. THỐNG KÊ MỨC ĐỘ RỦI RO & DÂN CƯ ẢNH HƯỞNG
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800">
                    <div className="text-2xl font-black text-rose-400">
                      {bulletin.severity_summary.level_5_disaster_count}
                    </div>
                    <div className="text-[11px] font-bold text-rose-300 uppercase">Cấp 5 Thảm Họa</div>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-950/60 border border-orange-800">
                    <div className="text-2xl font-black text-orange-400">
                      {bulletin.severity_summary.level_4_very_high_count}
                    </div>
                    <div className="text-[11px] font-bold text-orange-300 uppercase">Cấp 4 Rất Lớn</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800">
                    <div className="text-2xl font-black text-amber-400">
                      {bulletin.severity_summary.level_3_high_count}
                    </div>
                    <div className="text-[11px] font-bold text-amber-300 uppercase">Cấp 3 Lớn</div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/60 border border-blue-800">
                    <div className="text-2xl font-black text-blue-400">
                      {bulletin.severity_summary.estimated_vulnerable_population.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-bold text-blue-300 uppercase">Dân số nguy cơ</div>
                  </div>
                </div>
              </div>

              {/* Section 3: Critical Hotspots Table */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-200 border-l-4 border-rose-500 pl-2 uppercase tracking-wide mb-2">
                  III. DANH SÁCH CÁC ĐỊA BÀN TRỌNG ĐIỂM NGUY CƠ CAO
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Địa bàn</th>
                        <th className="p-2.5">Tỉnh/Huyện</th>
                        <th className="p-2.5">Cấp độ</th>
                        <th className="p-2.5">Mưa 24h</th>
                        <th className="p-2.5">Độ ẩm đất</th>
                        <th className="p-2.5">Khuyến cáo tác chiến</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bulletin.critical_points.map((pt: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-white">{pt.zone_name}</td>
                          <td className="p-2.5 text-slate-300">{pt.district}, {pt.province}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              pt.level === 5 ? 'bg-rose-600 text-white' : pt.level === 4 ? 'bg-orange-600 text-white' : 'bg-amber-600 text-white'
                            }`}>
                              CẤP {pt.level}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-cyan-300">{pt.rain_24h} mm</td>
                          <td className="p-2.5 font-mono text-emerald-300">{pt.saturation}%</td>
                          <td className="p-2.5 text-slate-300 text-[11px]">{pt.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Directives */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-200 border-l-4 border-emerald-500 pl-2 uppercase tracking-wide mb-2">
                  IV. MỆNH LỆNH & BIỆN PHÁP CHỈ HUY TÁC CHIẾN
                </h3>
                <div className="space-y-2 text-xs text-slate-200 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
                  {bulletin.directives.map((dir: string, dIdx: number) => (
                    <div key={dIdx} className="leading-relaxed">
                      {dir}
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-800 text-xs">
                <div className="text-slate-400">
                  <div>* Nơi nhận:</div>
                  <div>- Thủ tướng Chính phủ (để b/c);</div>
                  <div>- Trưởng Ban Chỉ đạo Quốc gia PCTT;</div>
                  <div>- UBND các Tỉnh, Thành phố trọng điểm;</div>
                  <div>- Lưu: Văn phòng Thường trực.</div>
                </div>
                <div className="text-center font-semibold">
                  <div className="text-slate-400 uppercase text-[11px]">KT. TRƯỞNG BAN</div>
                  <div className="font-extrabold text-slate-100 uppercase mt-0.5">PHÓ TRƯỞNG BAN THƯỜNG TRỰC</div>
                  <div className="h-16 flex items-center justify-center text-slate-600 italic">
                    (Đã ký điện tử & truyền tin tự động)
                  </div>
                  <div className="font-bold text-blue-400">HỆ THỐNG AI HAEWS v2.0</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
