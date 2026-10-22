import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Layers, 
  X, 
  ChevronRight, 
  Search, 
  ShieldAlert,
  Sparkles,
  BarChart3,
  ZoomIn,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Building2,
  DollarSign
} from 'lucide-react';
import { 
  mlExecutiveSummary, 
  forecastingData, 
  churnSegmentationData,
  creditRiskData
} from '../data/machineLearningData';
import { 
  futureRevenueForecast, 
  creditRiskAccountsLookup, 
  churnCustomersLookup 
} from '../data/mlFutureAndLookupData';

export default function MachineLearningPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);

  // --- State cho Bài toán 1: Dự báo ---
  const [forecastView, setForecastView] = useState('future'); // 'future' | 'historical_test'
  const [forecastYearFilter, setForecastYearFilter] = useState('ALL'); // 'ALL' | '2026' | '2027'

  // --- State cho Bài toán 2: Rời bỏ ---
  const [searchChurn, setSearchChurn] = useState('');
  const [filterChurnBand, setFilterChurnBand] = useState('ALL'); // 'ALL' | 'Nguy cấp' | 'Cao' | 'Trung bình' | 'Thấp'

  // --- State cho Bài toán 3: Tín dụng & Công nợ ---
  const [searchCredit, setSearchCredit] = useState('');
  const [filterCreditPriority, setFilterCreditPriority] = useState('ALL'); // 'ALL' | 'Báo động Đỏ' | 'Siết Hạn mức' | 'Giữ chân Khách' | 'Giám sát Chuẩn'
  const [filterCreditRisk, setFilterCreditRisk] = useState('ALL'); // 'ALL' | 'Nguy cấp' | 'Cao' | 'Trung bình' | 'Thấp'

  const formatVnd = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
  };

  // Lọc dự báo tương lai
  const filteredFutureForecast = useMemo(() => {
    return futureRevenueForecast.filter(item => {
      if (forecastYearFilter === 'ALL') return true;
      return item.year.toString() === forecastYearFilter;
    });
  }, [forecastYearFilter]);

  // Lọc danh sách khách hàng rời bỏ
  const filteredChurnCustomers = useMemo(() => {
    return churnCustomersLookup.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchChurn.toLowerCase()) ||
        item.code.toLowerCase().includes(searchChurn.toLowerCase()) ||
        item.branch.toLowerCase().includes(searchChurn.toLowerCase());
      
      const matchBand = filterChurnBand === 'ALL' || item.riskBand === filterChurnBand;
      return matchSearch && matchBand;
    });
  }, [searchChurn, filterChurnBand]);

  // Lọc danh sách khách hàng rủi ro công nợ
  const filteredCreditAccounts = useMemo(() => {
    return creditRiskAccountsLookup.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(searchCredit.toLowerCase()) ||
        item.code.toLowerCase().includes(searchCredit.toLowerCase()) ||
        item.branch.toLowerCase().includes(searchCredit.toLowerCase());

      const matchPriority = filterCreditPriority === 'ALL' || item.priority === filterCreditPriority;
      const matchRisk = filterCreditRisk === 'ALL' || item.riskLevel === filterCreditRisk;
      return matchSearch && matchPriority && matchRisk;
    });
  }, [searchCredit, filterCreditPriority, filterCreditRisk]);

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. HEADER - Viền border-slate-300 rõ nét */}
      <div className="pb-6 border-b border-slate-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E9F2FE] text-[#1868DB] text-xs font-bold uppercase tracking-wider mb-3 border border-[#8FB8F6]">
          <Sparkles className="w-3.5 h-3.5" />
          Machine Learning & Trí tuệ Dự báo
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
          {mlExecutiveSummary.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl font-normal">
          {mlExecutiveSummary.subtitle}
        </p>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-3xl bg-slate-100 border border-slate-300">
        {[
          { id: 'overview', icon: Layers, label: 'Tổng quan' },
          { id: 'forecasting', icon: TrendingUp, label: 'Dự báo Sản lượng & Doanh thu' },
          { id: 'churn', icon: Users, label: 'Phân khúc & Cảnh báo Rời bỏ' },
          { id: 'credit', icon: ShieldAlert, label: 'Rủi ro Tín dụng & Công nợ' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2
                ${isActive
                  ? 'bg-white text-[#1868DB] shadow-loom-sm border border-[#1868DB]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TỔNG QUAN */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Key Metrics Grid */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                Chỉ số Hiệu năng & Quy mô Dữ liệu Huấn luyện
              </h2>
              <p className="text-xs text-slate-500 mt-1">Đánh giá trên 228,581 giao dịch bán hàng và 1,359 đối tác khách hàng</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {mlExecutiveSummary.keyMetrics.map((kpi, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] transition-colors group"
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                    {kpi.label}
                  </span>
                  <p className="mt-2 text-3xl sm:text-4xl font-bold font-mono text-[#1868DB] tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-1 group-hover:text-slate-900">
                    {kpi.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Problem Cards Grid */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                3 Bài toán Trọng tâm Đã Triển khai
              </h2>
              <p className="text-xs text-slate-500 mt-1">Chọn bài toán để xem mô hình dự báo tương lai và tra cứu kết quả chi tiết</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Problem 1 */}
              <div 
                onClick={() => setActiveTab('forecasting')}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-300 hover:border-[#1868DB] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E9F2FE] text-[#1868DB] flex items-center justify-center font-bold font-mono text-sm border border-[#8FB8F6]">
                    01
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading group-hover:text-[#1868DB] transition-colors">
                    Dự báo Doanh thu & Nhu cầu Khí
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dự báo chuỗi thời gian doanh thu và nhu cầu sản lượng các tháng trong tương lai (2026 – 2027) nhằm tối ưu hóa chuỗi cung ứng.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-[#1868DB] group-hover:translate-x-0.5 transition-transform">
                  <span>Tra cứu dự báo 2026 - 2027</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Problem 2 */}
              <div 
                onClick={() => setActiveTab('churn')}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-300 hover:border-[#1868DB] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E9F2FE] text-[#1868DB] flex items-center justify-center font-bold font-mono text-sm border border-[#8FB8F6]">
                    02
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading group-hover:text-[#1868DB] transition-colors">
                    Phân khúc & Cảnh báo Rời bỏ Khách hàng
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Phân nhóm giá trị khách hàng và tra cứu danh sách đối tác có nguy cơ rời bỏ cao để kịp thời can thiệp giữ chân.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-[#1868DB] group-hover:translate-x-0.5 transition-transform">
                  <span>Tra cứu danh sách khách hàng</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Problem 3 */}
              <div 
                onClick={() => setActiveTab('credit')}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-300 hover:border-[#1868DB] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E9F2FE] text-[#1868DB] flex items-center justify-center font-bold font-mono text-sm border border-[#8FB8F6]">
                    03
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading group-hover:text-[#1868DB] transition-colors">
                    Rủi ro Tín dụng & Phân tích Công nợ
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Đánh giá mức độ phơi nhiễm nợ quá hạn, tra cứu danh sách 584 khách hàng nợ và phân tầng mức độ cấp bách thu hồi dòng tiền.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center text-xs font-semibold text-[#1868DB] group-hover:translate-x-0.5 transition-transform">
                  <span>Tra cứu danh sách khách nợ</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DỰ BÁO DOANH THU & NHU CẦU */}
      {activeTab === 'forecasting' && (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Section Summary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-3">
            <span className="text-xs font-bold text-[#1868DB] uppercase tracking-wider">
              Mục tiêu Thực nghiệm
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {forecastingData.problemTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
              {forecastingData.objective}
            </p>
          </div>

          {/* Scope Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
              Hiệu năng Mô hình theo Từng Dòng Sản phẩm
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecastingData.targetScope.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-600 block truncate">
                    {item.name}
                  </span>
                  <div className="mt-2 text-2xl font-bold font-mono text-[#1868DB] tracking-tight">
                    {item.testWape}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Thuật toán: {item.model}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SUB-SECTION: SWITCH GIỮA DỰ BÁO TƯƠNG LAI VÀ ĐỐI CHIẾU THỰC TẾ */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-300">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                  {forecastView === 'future' 
                    ? 'Bảng Tra cứu Dự báo Doanh thu Tương lai (2026 – 2027)' 
                    : 'Đối chiếu Dữ liệu Thực tế và Dự báo Năm 2026 (Đã thẩm định)'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {forecastView === 'future'
                    ? 'Mô hình học máy tổng hợp dự báo từng tháng tương lai kèm khoảng tin cậy 80%'
                    : 'Số liệu kiểm thử 6 tháng đầu năm 2026 đối chiếu với thực tế phát sinh'}
                </p>
              </div>

              {/* View Switcher Button Group */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-300">
                <button
                  onClick={() => setForecastView('future')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    forecastView === 'future'
                      ? 'bg-white text-[#1868DB] shadow-sm border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Dự báo Tương lai (2026 - 2027)</span>
                </button>
                <button
                  onClick={() => setForecastView('historical_test')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    forecastView === 'historical_test'
                      ? 'bg-white text-[#1868DB] shadow-sm border border-slate-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đối chiếu Thực tế 2026</span>
                </button>
              </div>
            </div>

            {/* NỘI DUNG 1: BẢNG DỰ BÁO TƯƠNG LAI 2026 - 2027 */}
            {forecastView === 'future' && (
              <div className="space-y-4">
                
                {/* Bộ lọc Năm */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Lọc theo Năm:</span>
                  {['ALL', '2026', '2027'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setForecastYearFilter(yr)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        forecastYearFilter === yr
                          ? 'bg-[#1868DB] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {yr === 'ALL' ? 'Tất cả (2026 – 2027)' : `Năm ${yr}`}
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 font-mono ml-auto">
                    Hiển thị {filteredFutureForecast.length} kỳ dự báo
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                          <th className="py-3.5 px-4">Kỳ Dự báo</th>
                          <th className="py-3.5 px-4 text-right">Dự báo Trung tâm</th>
                          <th className="py-3.5 px-4 text-right">Cận dưới (80%)</th>
                          <th className="py-3.5 px-4 text-right">Cận trên (80%)</th>
                          <th className="py-3.5 px-4 text-right">Tăng trưởng</th>
                          <th className="py-3.5 px-4">Xu hướng Dự báo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredFutureForecast.map((row, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">{row.period}</td>
                            <td className="py-3.5 px-4 text-right font-mono text-[#1868DB] font-bold">
                              {formatVnd(row.forecast)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                              {formatVnd(row.lower)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                              {formatVnd(row.upper)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold font-mono text-xs border border-emerald-200">
                                {row.growth}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">{row.trend}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* NỘI DUNG 2: BẢNG ĐỐI CHIẾU 6 THÁNG ĐẦU 2026 */}
            {forecastView === 'historical_test' && (
              <div className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Kỳ Đánh giá</th>
                        <th className="py-3.5 px-4 text-right">Doanh thu Thực tế</th>
                        <th className="py-3.5 px-4 text-right">Doanh thu Dự báo</th>
                        <th className="py-3.5 px-4 text-right">Độ lệch</th>
                        <th className="py-3.5 px-4 text-right">Sai số</th>
                        <th className="py-3.5 px-4">Đánh giá Thực tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {forecastingData.monthlyTestComparison.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{row.month}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600">{formatVnd(row.actualVnd)}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-[#1868DB] font-semibold">{formatVnd(row.forecastVnd)}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600">{formatVnd(row.diffVnd)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                              {row.errorPct}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Figures Showcase */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
              Biểu đồ Trực quan hóa Dữ liệu Thực nghiệm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {forecastingData.figures.map((fig) => (
                <div 
                  key={fig.id}
                  onClick={() => setSelectedImage(fig)}
                  className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] hover:shadow-md transition-all group cursor-pointer space-y-3"
                >
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200">
                    <img 
                      src={fig.src} 
                      alt={fig.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/90 text-[#1868DB] shadow-sm">
                        <ZoomIn className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading group-hover:text-[#1868DB] transition-colors">{fig.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{fig.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PHÂN KHÚC & CẢNH BÁO RỜI BỎ */}
      {activeTab === 'churn' && (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Section Summary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-3">
            <span className="text-xs font-bold text-[#1868DB] uppercase tracking-wider">
              Mục tiêu Thực nghiệm
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {churnSegmentationData.problemTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
              {churnSegmentationData.objective}
            </p>
          </div>

          {/* Cluster Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
              4 Phân khúc Khách hàng Trọng tâm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {churnSegmentationData.clusters.map((c) => (
                <div 
                  key={c.id} 
                  className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E9F2FE] text-[#1868DB] text-xs font-bold font-mono border border-[#8FB8F6]">
                      {c.revenuePct} Doanh thu
                    </span>
                    <h4 className="font-bold text-slate-900 text-base font-heading">
                      {c.vnName}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Chiến lược Hành động
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {c.actionPlan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TÍNH NĂNG TRA CỨU TOÀN DIỆN DANH SÁCH KHÁCH HÀNG & RỦI RO RỜI BỎ */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                  Tra cứu Danh sách Khách hàng & Xác suất Rời bỏ (Machine Learning)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dữ liệu dự đoán từ mô hình phân loại CatBoost trên 1,359 khách hàng
                </p>
              </div>

              {/* Bộ lọc và Tìm kiếm */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Lọc theo mức độ rủi ro */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs">
                  <span className="text-slate-400 text-[11px] px-1 font-medium">Mức rủi ro:</span>
                  {['ALL', 'Nguy cấp', 'Cao', 'Trung bình', 'Thấp'].map(band => (
                    <button
                      key={band}
                      onClick={() => setFilterChurnBand(band)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        filterChurnBand === band
                          ? 'bg-[#1868DB] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {band === 'ALL' ? 'Tất cả' : band}
                    </button>
                  ))}
                </div>

                {/* Input Search */}
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm tên, mã KH, chi nhánh..."
                    value={searchChurn}
                    onChange={(e) => setSearchChurn(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1868DB] focus:ring-2 focus:ring-[#E9F2FE] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Mã & Tên Khách hàng</th>
                      <th className="py-3.5 px-4">Chi nhánh</th>
                      <th className="py-3.5 px-4 text-right">Ngày Vắng (Recency)</th>
                      <th className="py-3.5 px-4 text-right">Tần suất Mua</th>
                      <th className="py-3.5 px-4 text-right">Doanh thu 365 Ngày</th>
                      <th className="py-3.5 px-4 text-right">Xác suất Rời bỏ</th>
                      <th className="py-3.5 px-4 text-center">Phân loại Rủi ro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredChurnCustomers.length > 0 ? (
                      filteredChurnCustomers.map((acc, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{acc.name}</div>
                            <div className="text-slate-400 text-xs font-mono">{acc.code}</div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                            {acc.branch}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700">
                            {acc.recencyDays} ngày
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700">
                            {acc.frequency} lần
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-900">
                            {formatVnd(acc.monetary)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            {acc.churnProb}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                              acc.riskBand === 'Nguy cấp' 
                                ? 'bg-rose-50 text-rose-600 border-rose-300'
                                : acc.riskBand === 'Cao'
                                ? 'bg-amber-50 text-amber-600 border-amber-300'
                                : acc.riskBand === 'Trung bình'
                                ? 'bg-blue-50 text-blue-600 border-blue-300'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-300'
                            }`}>
                              {acc.riskBand}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                          Không tìm thấy khách hàng nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-300 text-xs text-slate-500 font-mono flex justify-between items-center">
                <span>Hiển thị <strong>{filteredChurnCustomers.length}</strong> khách hàng trong cơ sở dữ liệu</span>
                <span>Thuật toán: CatBoost Gradient Boosting (AUC = 0.86)</span>
              </div>
            </div>
          </div>

          {/* Figures Showcase */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
              Biểu đồ Phân tích Phân khúc & Tầm quan trọng Đặc trưng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {churnSegmentationData.figures.map((fig) => (
                <div 
                  key={fig.id}
                  onClick={() => setSelectedImage(fig)}
                  className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] hover:shadow-md transition-all group cursor-pointer space-y-3"
                >
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200">
                    <img 
                      src={fig.src} 
                      alt={fig.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/90 text-[#1868DB] shadow-sm">
                        <ZoomIn className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-heading group-hover:text-[#1868DB] transition-colors">{fig.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: RỦI RO TÍN DỤNG & CÔNG NỢ */}
      {activeTab === 'credit' && (
        <div className="space-y-10 animate-fadeIn">
          
          {/* Section Summary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-3">
            <span className="text-xs font-bold text-[#1868DB] uppercase tracking-wider">
              Mục tiêu Thực nghiệm
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              {creditRiskData.problemTitle}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
              {creditRiskData.objective}
            </p>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {creditRiskData.keyStats.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] transition-colors"
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                  {item.label}
                </span>
                <div className="mt-2 text-3xl font-bold font-mono text-[#1868DB] tracking-tight">
                  {item.value}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* [LƯU Ý: ĐÃ XÓA KHỐI BANNER QUYẾT ĐỊNH PHƯƠNG PHÁP LUẬN THEO YÊU CẦU CỦA USER] */}

          {/* Intervention Matrix */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                Ma trận Can thiệp Phối hợp Liên phòng ban
              </h3>
              <p className="text-xs text-slate-500 mt-1">Phân tầng hành động giữa Ban Tài chính & Đội ngũ Kinh doanh</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {creditRiskData.priorityTiers.map((tier, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-[#1868DB] transition-colors space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 font-heading">
                          {tier.tier}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-300">
                        {tier.count} KH
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-200 bg-slate-50 rounded-xl px-4">
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Tổng dư nợ</span>
                        <span className="text-sm font-bold font-mono text-slate-900">{tier.totalDebt}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">Nợ quá hạn</span>
                        <span className="text-sm font-bold font-mono text-rose-600">{tier.overdueDebt}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Hành động Đề xuất
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {tier.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TÍNH NĂNG TRA CỨU TOÀN DIỆN KHÁCH HÀNG NỢ & PHÂN LOẠI TÍN DỤNG */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
                  Tra cứu Danh sách Khách hàng Nợ & Phân loại Rủi ro Tín dụng (TK 131)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trích xuất từ kết quả mô hình Credit Risk Engine trên 584 tài khoản công nợ
                </p>
              </div>

              {/* Bộ lọc Tầng Ưu tiên và Tìm kiếm */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Lọc Tầng ưu tiên */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs">
                  <span className="text-slate-400 text-[11px] px-1 font-medium">Tầng ưu tiên:</span>
                  {['ALL', 'Báo động Đỏ', 'Siết Hạn mức', 'Giữ chân Khách', 'Giám sát Chuẩn'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterCreditPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        filterCreditPriority === p
                          ? 'bg-[#1868DB] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {p === 'ALL' ? 'Tất cả' : p}
                    </button>
                  ))}
                </div>

                {/* Input Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm tên, mã khách nợ..."
                    value={searchCredit}
                    onChange={(e) => setSearchCredit(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#1868DB] focus:ring-2 focus:ring-[#E9F2FE] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Khách hàng & Chi nhánh</th>
                      <th className="py-3.5 px-4 text-right">Tổng Dư nợ</th>
                      <th className="py-3.5 px-4 text-right">Nợ Trong hạn</th>
                      <th className="py-3.5 px-4 text-right">Nợ Quá hạn</th>
                      <th className="py-3.5 px-4 text-right">Tỷ lệ Quá hạn</th>
                      <th className="py-3.5 px-4 text-center">Điểm Rủi ro</th>
                      <th className="py-3.5 px-4 text-center">Tầng Can thiệp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCreditAccounts.length > 0 ? (
                      filteredCreditAccounts.map((acc, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{acc.name}</div>
                            <div className="text-slate-400 text-xs font-mono">
                              {acc.code} • {acc.branch}
                              {acc.isAnomaly && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 text-[10px] font-sans font-bold">
                                  Dị thường
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            {formatVnd(acc.totalDebt)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-xs">
                            {formatVnd(acc.currentDebt)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-rose-600 font-semibold">
                            {formatVnd(acc.overdueDebt)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700">
                            {Math.round(acc.overdueRatio * 100)}%
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800">
                              {acc.riskScore} / 100
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                              acc.priority === 'Báo động Đỏ'
                                ? 'bg-rose-50 text-rose-600 border-rose-300'
                                : acc.priority === 'Siết Hạn mức'
                                ? 'bg-amber-50 text-amber-600 border-amber-300'
                                : acc.priority === 'Giữ chân Khách'
                                ? 'bg-blue-50 text-blue-600 border-blue-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                              {acc.priority}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                          Không tìm thấy khách hàng nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-300 text-xs text-slate-500 font-mono flex justify-between items-center">
                <span>Hiển thị <strong>{filteredCreditAccounts.length}</strong> khách hàng trong danh mục phơi nhiễm công nợ</span>
                <span>Phương pháp: Thang điểm 0–100 & Thuật toán Isolation Forest</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-slate-300 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base sm:text-lg font-heading">
                {selectedImage.title}
              </h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full h-auto max-h-[65vh] object-contain rounded-xl"
              />
            </div>

            {selectedImage.caption && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
