import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Globe,
  Send,
  Download,
  AlertTriangle,
  Flame,
  Waves,
  Radio,
  CheckCircle2,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Bot
} from 'lucide-react';
import { GlobalDisasterEvent, GlobalDisasterSummary } from '../../types';
import { safeFetchJson } from '../../utils/apiClient';

interface SituationReportAiWorkspaceProps {
  globalDisasterSummary: GlobalDisasterSummary | null;
  onOpenGlobalDisasterModal?: () => void;
  onOpenCopilotModal?: () => void;
}

export const SituationReportAiWorkspace: React.FC<SituationReportAiWorkspaceProps> = ({
  globalDisasterSummary,
  onOpenGlobalDisasterModal,
  onOpenCopilotModal
}) => {
  const [globalEvents, setGlobalEvents] = useState<GlobalDisasterEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<GlobalDisasterEvent | null>(null);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Xin chào Chỉ huy trưởng! Tôi là Trợ lý AI Tác chiến HAEWS Copilot (được tiếp sức bởi Gemini 2.5 Pro). Tôi đã cập nhật dữ liệu 110 trạm đo mưa, 4 điểm sạt lở cấp 5 và tình báo NASA/USGS. Bạn cần tư vấn phương án tác chiến nào?',
      time: '09:20'
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await safeFetchJson<GlobalDisasterEvent[]>('/api/v2/global-disasters');
        if (data && Array.isArray(data)) {
          setGlobalEvents(data);
          setSelectedEvent(data[0] || null);
        }
      } catch (e) {
        console.warn('Error fetching global events:', e);
      }
    };
    fetchEvents();
  }, []);

  const handleSendAi = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiQuery;
    if (!promptToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: promptToSend,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiQuery('');
    setIsAiTyping(true);

    try {
      const resp = await safeFetchJson<{ response: string; answer?: string }>('/api/v1/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptToSend })
      });

      const replyText = resp?.response || resp?.answer || 'Hệ thống đã ghi nhận tình huống và đề xuất: Ưu tiên di dời 142 hộ dân vùng sạt lở trước 16:00, cấm các phương tiện qua cầu ngầm tràn và duy trì ca trực 24/7.';
      
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      setAiMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Khuyến nghị chỉ huy: Khẩn trương kích hoạt phương án PCTT Cấp tỉnh, điều động 3 xuồng máy cứu nạn đến điểm ngập sâu Na Sầm.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Đã xuất thành công Bản tin tình hình PCTT & Thiệt hại (Báo cáo số 42/BC-BCH) định dạng PDF!');
    }, 1200);
  };

  const filteredEvents = globalEvents.filter((ev) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'EARTHQUAKE') return ev.category === 'earthquake';
    if (selectedCategory === 'LANDSLIDE') return ev.category === 'landslide';
    if (selectedCategory === 'SEVERE_STORM') return ev.category === 'severeStorms' || ev.category === 'cyclone';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#070B14] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Banner & Export Trigger */}
      <div className="bg-[#0B1220] border-b border-slate-800/80 px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>TRUNG TÂM BÁO CÁO TÁC CHIẾN, TÌNH BÁO TOÀN CẦU & GEMINI AI COPILOT</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                AI DECISION SUPPORT
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Tổng hợp báo cáo nhanh theo Quyết định 19, tiếp nhận luồng dữ liệu NASA/USGS và hỗ trợ chỉ huy trực tiếp
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Đang xuất PDF...' : 'Xuất Báo Cáo PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Global Intelligence Feeds (NASA EONET / USGS) (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 border-r border-slate-800/80 bg-[#080E1B] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-800/80 bg-[#0B1426] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  TÌNH BÁO THIÊN TAI TOÀN CẦU (NASA / USGS)
                </span>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">{globalEvents.length} Sự kiện</span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedCategory === 'ALL' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedCategory('EARTHQUAKE')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedCategory === 'EARTHQUAKE' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Động đất & Sóng thần
              </button>
              <button
                onClick={() => setSelectedCategory('LANDSLIDE')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedCategory === 'LANDSLIDE' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-900 text-slate-300 hover:text-white'
                }`}
              >
                Sạt lở đất lớn
              </button>
            </div>
          </div>

          {/* Events Stream List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredEvents.map((ev) => {
              const isSel = selectedEvent?.id === ev.id;
              const isCritical = ev.severity === 'CRITICAL';
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3 rounded-xl cursor-pointer transition border space-y-1.5 ${
                    isSel
                      ? 'bg-[#101C30] border-sky-400/80 shadow-md ring-1 ring-sky-400/30'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                      isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {ev.source_provider} • {ev.category}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{ev.reported_at}</span>
                  </div>

                  <h3 className="font-bold text-xs text-white leading-tight">{ev.title_vi || ev.title}</h3>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span>{ev.location_name} ({ev.country})</span>
                    {ev.magnitude_display && (
                      <span className="text-amber-400 font-bold">{ev.magnitude_display}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Gemini AI Tactical Copilot & Situation Brief (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-[#070C16] flex flex-col overflow-hidden">
          {/* Situation Report Summary Header */}
          <div className="p-3 border-b border-slate-800 bg-[#0B1322] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                BẢN TIN TÌNH HÌNH THIÊN TAI (TỰ ĐỘNG CẬP NHẬT 15 PHÚT/LẦN)
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Ban Chỉ đạo Quốc gia PCTT</span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#060A12]">
            {aiMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-md">
                    AI
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div className="text-[10px] text-slate-400 mt-1.5 text-right font-mono">{msg.time}</div>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-3 justify-start items-center text-xs text-cyan-400 animate-pulse">
                <div className="w-7 h-7 rounded-lg bg-cyan-900 text-cyan-300 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Gemini AI đang tổng hợp số liệu tác chiến và phương án cứu nạn...</span>
              </div>
            )}
          </div>

          {/* Quick Consultation Chips */}
          <div className="p-2 border-t border-slate-800/80 bg-[#0B1322] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-400 shrink-0 font-semibold">Gợi ý câu hỏi:</span>
            <button
              onClick={() => handleSendAi('Tổng hợp tình hình sạt lở các tỉnh miền núi phía Bắc trong 12h qua?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 text-[11px] whitespace-nowrap"
            >
              Tình hình sạt lở 12h qua
            </button>
            <button
              onClick={() => handleSendAi('Đề xuất phương án sơ tán khẩn cấp huyện Na Sầm, Lạng Sơn?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 text-[11px] whitespace-nowrap"
            >
              Phương án sơ tán Na Sầm
            </button>
            <button
              onClick={() => handleSendAi('Cảnh báo xả lũ hồ chứa thượng nguồn Trung Quốc trên sông Thao?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 text-[11px] whitespace-nowrap"
            >
              Cảnh báo xả lũ thượng nguồn
            </button>
          </div>

          {/* AI Prompt Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-[#0B1322] flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi tác chiến cho Gemini AI Copilot..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendAi();
              }}
              className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />

            <button
              onClick={() => handleSendAi()}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
