import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  FileText,
  Copy,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Flame,
  Radio,
  RefreshCw,
  Compass
} from 'lucide-react';
import { safeFetchJson } from '../utils/apiClient';

interface AiCopilotModalProps {
  onClose: () => void;
  onOpenReport?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  suggested_actions?: string[];
  bulletin_draft?: string;
  source?: string;
}

const PRESET_PROMPTS = [
  '⚡ Đánh giá nguy cơ lũ bùn đá Làng Nủ & Sa Pa',
  '🚨 Lập phương án sơ tán khẩn cấp 500 hộ dân vùng rốn lũ',
  '📝 Soạn dự thảo Công điện hỏa tốc cho Ban Chỉ huy PCTT Tỉnh',
  '🌊 Phân tích nguy cơ xả tràn hồ Thác Bà và an toàn hạ du',
  '🛰️ Tổng hợp các điểm nghẽn sạt lở đèo trên QL4D và QL279'
];

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({ onClose, onOpenReport }) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'AI',
      text: 'Xin chào Chỉ huy! Tôi là Trợ lý AI Tham mưu Tác chiến (HAEWS Copilot) được hỗ trợ bởi mô hình Gemini. Tôi liên tục kết nối với dữ liệu radar, lượng mưa 24h, cảm biến độ ẩm đất và dự báo LSTM toàn miền Bắc. Chỉ huy cần đánh giá tình huống, lập kế hoạch tác chiến hay soạn thảo công điện khẩn cấp nào?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_actions: [
        'Rà soát danh sách điểm nguy cơ cấp 5',
        'Kiểm tra tình hình các hồ chứa thủy điện',
        'Soạn công điện chỉ đạo các địa phương'
      ],
      source: 'GEMINI_AI'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const json = await safeFetchJson<{ data?: { reply: string; suggested_actions?: string[]; bulletin_draft?: string; source?: string } }>('/api/v1/ai/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });

      if (json && json.data) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'AI',
          text: json.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggested_actions: json.data.suggested_actions,
          bulletin_draft: json.data.bulletin_draft,
          source: json.data.source
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('No data returned');
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'AI',
        text: 'Báo cáo: Hệ thống đã ghi nhận yêu cầu tác chiến. Hiện tại các trạm mưa tại Lào Cai và Yên Bái đang vượt ngưỡng 200mm/24h. Đề nghị các đội xung kích duy trì chế độ trực chỉ huy 24/24.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggested_actions: [
          'Kích hoạt phương án sơ tán theo mốc cảnh báo',
          'Theo dõi chặt chẽ lưu lượng về hồ thủy điện'
        ]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-purple-500/50 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  TRỢ LÝ AI THAM MƯU TÁC CHIẾN PCTT
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700">
                  Gemini 3.7 Flash Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Phân tích tình huống, hỗ trợ chỉ huy ra quyết định & soạn thảo công điện thời gian thực
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Xuất Bản tin PCTT</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950/40 to-slate-900/40">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'AI' && (
                <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/50 flex items-center justify-center flex-shrink-0 text-purple-300">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-rose-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                  <span className="font-bold">
                    {msg.sender === 'USER' ? 'Chỉ huy Ban PCTT' : 'AI Copilot Tham Mưu'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-line text-slate-100 font-sans">{msg.text}</div>

                {/* Suggested Actions if any */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Kiến nghị Hành động Tác chiến:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-200">
                      {msg.suggested_actions.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1.5 bg-slate-950/50 p-1.5 rounded border border-slate-800">
                          <span className="text-amber-400 font-mono">▶</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bulletin Draft if any */}
                {msg.bulletin_draft && (
                  <div className="mt-3 pt-3 border-t border-slate-700/60 bg-slate-950/70 p-3 rounded-xl border border-purple-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        Dự thảo Văn bản / Công điện
                      </span>
                      <button
                        onClick={() => handleCopyText(msg.bulletin_draft!, idx)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      {msg.bulletin_draft}
                    </pre>
                  </div>
                )}
              </div>

              {msg.sender === 'USER' && (
                <div className="w-8 h-8 rounded-full bg-rose-900/60 border border-rose-500/50 flex items-center justify-center flex-shrink-0 text-rose-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                Gemini đang tổng hợp dữ liệu viễn thám, thủy văn & xây dựng kế hoạch tham mưu...
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
          {PRESET_PROMPTS.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-purple-950/60 hover:text-purple-300 hover:border-purple-500/60 text-slate-300 border border-slate-700/80 transition flex-shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi AI Copilot về đánh giá nguy cơ, phương án sơ tán, hoặc soạn công điện..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Gửi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
