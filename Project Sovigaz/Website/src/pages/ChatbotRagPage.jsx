import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw,
  Check,
  Copy,
  Terminal,
  Database,
  ShieldCheck,
  TrendingUp,
  FileCode2,
  Table
} from 'lucide-react';
import { askGeminiRag, SOVIGAZ_ACTUAL_METRICS, SOVIGAZ_SQL_TEMPLATES } from '../services/geminiRagService.js';

export default function ChatbotRagPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Xin chào! Tôi là **Sovigaz AI**, trợ lý AI được kết nối trực tiếp với toàn bộ cơ sở dữ liệu Kho Dữ liệu Doanh nghiệp (DWH), hồ sơ tài liệu Excel & BRD, và phân hệ Machine Learning của dự án Sovigaz do INDA triển khai.

### 🌐 Phạm vi Dữ liệu Tôi Có Thể Truy Cập & Tra Cứu:

1. **Cơ sở Dữ liệu DWH (19 Bảng):** 7 bảng Fact & 12 bảng Dimension (\`DM_RevenueBySaleLedger\`, \`Fact_KPI_Month\`, \`Fact_ActualProduction\`, \`Dim_Customer\`, \`Dim_Products\`...), cấu trúc trường, kiểu dữ liệu, quan hệ khóa ngoại (100% toàn vẹn).

2. **Tài liệu Excel Data & BRD:** 5 báo cáo quản trị từ bản BRD mới nhất (\`Nguyễn Duy Mạnh - BRD_BaoCao_Sovigaz.xlsx\`), 45 quy tắc kỹ thuật data mapping, biểu mẫu A3 sản xuất và tiêu thụ.

3. **Số liệu Thực tế Đã Kiểm toán:** 229,012 chứng từ bán hàng (1,213.13 tỷ VNĐ toàn kỳ 2023–2026, ~385.2 tỷ VNĐ kỳ phân tích), chi tiết doanh thu theo tháng 2026, doanh thu 11 xí nghiệp, top sản phẩm (Oxy lỏng 354.6 tỷ, Nito lỏng 119.8 tỷ...), tuổi nợ (82.4% trong hạn).

4. **Phân hệ Machine Learning:**
   * **Bài toán 1 - Dự báo Chuỗi thời gian:** XGBoost tháng (WAPE 6.05%), CatBoost tuần (WAPE 31.80%), dự báo sản lượng NTL-SX, OXK6, OXL-SX.
   * **Bài toán 2 - Phân khúc & Cảnh báo Churn:** K-Means 4 cụm (Cụm 2 VIP đóng góp 92.09% doanh thu), CatBoost Churn (ROC-AUC 0.8210, 4 phân tầng rủi ro, phát hiện 100% khách VIP nguy cơ cao).

---

### 💡 Bạn có thể hỏi tôi bất kỳ câu hỏi nào:

* **Số liệu thực tế & KPI:** Doanh thu các năm, tháng cao/thấp nhất, xí nghiệp dẫn đầu, sản lượng quy đổi DVC.
* **Cấu trúc CSDL & Bảng DWH:** Ý nghĩa các cột, khóa chính/ngoại, cách tổ chức Fact/Dim.
* **Tài liệu BRD & Quy tắc nghiệp vụ:** Báo cáo A3, quy tắc loại trừ nội bộ KHNB, dung sai đối soát < 10 triệu VNĐ.
* **Mô hình Machine Learning:** Hiệu năng thuật toán, đặc điểm 4 cụm khách hàng, danh sách VIP có nguy cơ rời bỏ.
* **Viết câu lệnh SQL hoặc DAX:** Chỉ cần bạn yêu cầu, tôi sẽ viết câu lệnh T-SQL hoặc DAX Power BI chính xác theo CSDL Sovigaz.`,
      meta: 'Đã nạp toàn bộ DWH, Excel BRD & Machine Learning Sovigaz',
      modelUsed: 'gemini-3.8-flash'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sampleQuestions = [
    'Doanh thu và tỷ lệ hoàn thành KPI của các xí nghiệp ra sao?',
    'Cấu trúc 19 bảng trong Kho DWH Sovigaz gồm những bảng nào?',
    'File Excel BRD quy định những báo cáo và quy tắc chuyển đổi nào?',
    'Kết quả mô hình Machine Learning dự báo và phát hiện khách hàng rời bỏ?',
    'Tháng nào năm nào có doanh thu cao nhất và thấp nhất trong lịch sử?'
  ];

  const handleSend = async (textToSend) => {
    const q = (textToSend || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMessage = { sender: 'user', text: q };
    const currentHistory = [...messages, userMessage];
    setMessages(currentHistory);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askGeminiRag(q, currentHistory);
      setMessages([
        ...currentHistory,
        {
          sender: 'bot',
          text: response.text,
          meta: `Mô hình: ${response.modelUsed} • ${response.ragContextTopics}`,
          modelUsed: response.modelUsed
        }
      ]);
    } catch (err) {
      setMessages([
        ...currentHistory,
        {
          sender: 'bot',
          text: `**Rất tiếc, đã xảy ra lỗi khi kết nối với Gemini AI:**\n\n${err.message || 'Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau giây lát.'}`,
          meta: 'Lỗi phản hồi API'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Cuộc trò chuyện đã được làm mới. Tôi sẵn sàng giải đáp các câu hỏi tiếp theo về Số liệu thực tế, KPI, Doanh thu hoặc viết câu lệnh SQL cho Kho DWH Sovigaz!',
        meta: 'Phiên hỏi đáp mới'
      }
    ]);
  };

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Interactive RAG Chat Window */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-md overflow-hidden flex flex-col h-[700px]">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-2xs overflow-hidden shrink-0">
                <img src="/assets/ai_icon.png" alt="Sovigaz AI" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 font-heading">
                  Sovigaz AI
                </h3>
              </div>
            </div>

            <button
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>

          {/* Chat Body / Messages */}
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] p-4 sm:p-5 rounded-2xl text-xs sm:text-[13px] leading-relaxed relative group ${
                    m.sender === 'user'
                      ? 'bg-[#1868DB] text-white rounded-br-xs shadow-loom-sm'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none text-slate-800 prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-4 prose-headings:mb-2 prose-p:my-3 prose-ul:my-3 prose-li:my-1.5 prose-table:my-2 prose-th:bg-slate-50 prose-th:p-2 prose-td:p-2 prose-code:text-[#1868DB] prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-3.5">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  )}

                  {/* Copy Button for Bot Messages */}
                  {m.sender === 'bot' && (
                    <div className="mt-2.5 pt-2 flex items-center justify-end border-t border-slate-100">
                      <button
                        onClick={() => handleCopyText(m.text, idx)}
                        className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#1868DB] px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Sao chép câu trả lời"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  <img src="/assets/ai_icon.png" alt="Sovigaz AI" className="w-full h-full object-contain" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-2.5 text-xs text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-[#1868DB] animate-spin" />
                  <span className="font-medium text-slate-600">Thinking...</span>
                </div>
              </div>
            )}

          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 pl-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#1868DB]" /> Gợi ý câu hỏi:
            </span>
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSend(sq)}
                disabled={isLoading}
                className="text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#E9F2FE] hover:text-[#1868DB] text-slate-600 transition-colors whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              disabled={isLoading}
              placeholder="Hỏi về doanh thu, KPI xí nghiệp, sản lượng DVC hoặc yêu cầu viết câu lệnh SQL..."
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1868DB] disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputQuestion.trim()}
              className="p-3 rounded-xl bg-[#1868DB] hover:bg-[#1456b8] disabled:bg-slate-300 text-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-loom-sm"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
