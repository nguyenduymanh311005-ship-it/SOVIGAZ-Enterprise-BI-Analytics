import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, 
  Layers, 
  CheckCircle2, 
  Filter, 
  Calculator, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Database, 
  Copy, 
  Check, 
  Code,
  ArrowRight,
  TrendingUp,
  Search
} from 'lucide-react';
import { brdReports, dataMappings, projectOverview } from '../data/projectData';

export default function BrdPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialReport = searchParams.get('report') || brdReports[0].id;

  const [activeTab, setActiveTab] = useState(initialReport); // report id or 'mapping'
  const [mappingSearch, setMappingSearch] = useState('');
  const [copiedDax, setCopiedDax] = useState(null);

  const selectedReport = brdReports.find(r => r.id === activeTab) || brdReports[0];

  const handleCopyDax = (rule, id) => {
    navigator.clipboard.writeText(rule);
    setCopiedDax(id);
    setTimeout(() => setCopiedDax(null), 2000);
  };

  const filteredMappings = dataMappings.filter(m => {
    if (!mappingSearch.trim()) return true;
    const term = mappingSearch.toLowerCase();
    return (
      m.reportName.toLowerCase().includes(term) ||
      m.fieldName.toLowerCase().includes(term) ||
      m.description.toLowerCase().includes(term) ||
      (m.sourceTable && m.sourceTable.toLowerCase().includes(term)) ||
      (m.mappingRule && m.mappingRule.toLowerCase().includes(term)) ||
      m.daxRule.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#E9F2FE]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F2FE] text-[#1868DB] text-xs font-bold uppercase tracking-wider mb-3">
          <FileText className="w-3.5 h-3.5" />
          Tài liệu Đặc tả Nghiệp vụ (BRD)
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Đặc tả Nghiệp vụ Báo cáo Quản trị BI
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl font-normal">
          Đặc tả 5 hệ thống báo cáo quản trị trên Power BI và bảng ánh xạ CSDL sang các chỉ tiêu đo lường DAX.
        </p>
      </div>

      {/* Navigation Pills / Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-3xl bg-slate-100/80 border border-slate-200/80">
        {brdReports.map((r) => {
          const isActive = activeTab === r.id;
          return (
            <button
              key={r.id}
              onClick={() => {
                setActiveTab(r.id);
                setSearchParams({ report: r.id });
              }}
              className={`
                px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2
                ${isActive 
                  ? 'bg-white text-[#1868DB] shadow-loom-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }
              `}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{r.title}</span>
            </button>
          );
        })}

        <button
          onClick={() => {
            setActiveTab('mapping');
            setSearchParams({ report: 'mapping' });
          }}
          className={`
            px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ml-auto
            ${activeTab === 'mapping' 
              ? 'bg-[#1868DB] text-white shadow-loom-sm' 
              : 'text-[#1868DB] hover:bg-blue-50'
            }
          `}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Ánh xạ Kỹ thuật & DAX ({dataMappings.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: REPORT SPECIFICATION */}
      {activeTab !== 'mapping' ? (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Info Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-slate-400">
                  {selectedReport.sheet}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading mt-1">
                  {selectedReport.title}
                </h2>
                <p className="text-xs font-semibold text-[#1868DB] mt-0.5">
                  {selectedReport.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã đối soát & sẵn sàng
                </span>
              </div>
            </div>

            {/* Purpose & Objective as clean bullets without icons */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mục đích nghiệp vụ chính
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedReport.objective
                    .split('\n')
                    .map(item => item.replace(/^-\s*/, '').trim())
                    .filter(Boolean)
                    .map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Governance & Frequency Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-[#1868DB]" />
                  Người yêu cầu & Nghiệp vụ
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedReport.requester}
                </p>
                <p className="text-xs text-slate-500">
                  Đối tượng sử dụng: {selectedReport.targetAudience}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#1868DB]" />
                  Tần suất & Chu kỳ báo cáo
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedReport.frequency}
                </p>
                <p className="text-xs text-slate-500">
                  Thời hạn bàn giao: Trước ngày {projectOverview.completionDate}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Database className="w-4 h-4 text-[#1868DB]" />
                  Nguồn dữ liệu trong DWH
                </div>
                <p className="text-sm font-semibold text-slate-800 font-mono">
                  {selectedReport.source}
                </p>
                <p className="text-xs text-slate-500">
                  Hợp nhất từ MISA AMIS và biểu mẫu xí nghiệp
                </p>
              </div>
            </div>
          </div>

          {/* Slicers & Filters Section */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#1868DB]" />
              Bộ lọc tương tác trên báo cáo (Slicers)
            </h3>
            <p className="text-xs text-slate-500">
              Người dùng có thể lọc động đa chiều trên bảng điều khiển Power BI theo các trường:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {selectedReport.slicers.map((s, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-2 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1868DB]"></span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics & DAX Calculation Rules */}
          <div className="p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#1868DB]" />
                  Các chỉ tiêu đo lường chính & Quy tắc tính toán
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đặc tả công thức đo lường DAX và logic loại trừ doanh thu luân chuyển nội bộ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedReport.keyKpis.map((kpi, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1868DB] uppercase tracking-wider">
                      Chỉ tiêu 0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {kpi.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {kpi.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Criteria Banner */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-4 shadow-2xs">
            <div className="p-2 rounded-xl bg-white text-emerald-600 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-heading">
                Tiêu chuẩn Nghiệm thu Báo cáo
              </h4>
              <p className="text-xs leading-relaxed text-emerald-800 mt-1">
                {selectedReport.acceptanceCriteria}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* TAB CONTENT: TECHNICAL DATA MAPPING & DAX SPECIFICATION */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Bảng Ánh xạ Kỹ thuật & Công thức DAX (Data Mapping Specification)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Quy chuẩn ánh xạ từ CSDL Data Warehouse lên từng trường báo cáo theo mẫu BRD hoàn chỉnh
                </p>
              </div>

              {/* Search in mappings */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={mappingSearch}
                  onChange={(e) => setMappingSearch(e.target.value)}
                  placeholder="Lọc chỉ tiêu hoặc công thức..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#1868DB]"
                />
              </div>
            </div>

            {/* Mappings Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4">Báo cáo</th>
                    <th className="py-3 px-4">Nhóm chỉ tiêu</th>
                    <th className="py-3 px-4">Trường dữ liệu</th>
                    <th className="py-3 px-4">Diễn giải nghiệp vụ</th>
                    <th className="py-3 px-4">Công thức tính / Quy tắc DAX</th>
                    <th className="py-3 px-4 w-12 text-center">Sao chép</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredMappings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy chỉ tiêu nào phù hợp với từ khóa "{mappingSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredMappings.map((m) => {
                      const isCopied = copiedDax === m.stt;
                      return (
                        <tr key={m.stt} className="hover:bg-blue-50/30 transition-colors">
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                            {m.stt}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                            {m.reportName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                              {m.group}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold font-mono text-[#1868DB]">
                            <div>{m.fieldName}</div>
                            {m.sourceTable && (
                              <span className="block text-[10px] text-slate-400 font-normal font-mono mt-0.5">
                                {m.sourceTable}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-relaxed">
                            <p>{m.description}</p>
                            {m.mappingRule && (
                              <p className="text-[10px] text-slate-400 mt-1 italic">
                                {m.mappingRule}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 bg-slate-50/50 max-w-sm overflow-hidden text-ellipsis">
                            {m.daxRule ? (
                              <span className="text-purple-700">{m.daxRule}</span>
                            ) : (
                              <span className="text-slate-400 italic">Trường dữ liệu trực tiếp từ bảng</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {m.daxRule && (
                              <button
                                onClick={() => handleCopyDax(m.daxRule, m.stt)}
                                className="p-1 rounded-md text-slate-400 hover:text-[#1868DB] hover:bg-white transition-all cursor-pointer"
                                title="Sao chép công thức DAX"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
