import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Search, 
  Filter, 
  Code2, 
  Copy, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  CheckCircle,
  Layers,
  Database,
  Eye,
  FileCheck2
} from 'lucide-react';
import { uatTestingData } from '../data/uatTestingData';

export default function TestingPage() {
  const [selectedScenario, setSelectedScenario] = useState('ALL');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('CASES'); // 'CASES' | 'EVIDENCE' | 'SUMMARY'
  const [copiedId, setCopiedId] = useState(null);

  const { summary, evidences, allCases } = uatTestingData;

  const handleCopySql = (id, sqlText) => {
    navigator.clipboard.writeText(sqlText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCases = useMemo(() => {
    return allCases.filter(c => {
      const matchScenario = selectedScenario === 'ALL' || c.scenarioId === selectedScenario;
      const matchCritical = !onlyCritical || c.isCritical;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || (
        c.id.toLowerCase().includes(query) ||
        c.purpose.toLowerCase().includes(query) ||
        c.function.toLowerCase().includes(query) ||
        c.steps.toLowerCase().includes(query) ||
        c.expected.toLowerCase().includes(query) ||
        c.actualData.toLowerCase().includes(query)
      );
      return matchScenario && matchCritical && matchQuery;
    });
  }, [allCases, selectedScenario, onlyCritical, searchQuery]);

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Kiểm thử chất lượng UAT & SIT
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Báo cáo Kiểm thử UAT Hệ thống BI Sovigaz
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Quy trình đối soát độc lập giữa câu lệnh SQL truy vấn trực tiếp từ Kho dữ liệu (DWH) và các Thẻ chỉ số, Biểu đồ trên Báo cáo Power BI. Đảm bảo số liệu kinh doanh khớp 100%.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-mono">
              Phiên bản: <strong className="text-slate-800">{summary.version}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
              Người kiểm thử: <strong className="text-slate-800">{summary.tester}</strong> ({summary.role})
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
              Ngày hoàn thành: <strong className="text-slate-800">{summary.date}</strong>
            </span>
          </div>
        </div>

        {/* Action utility buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/${summary.excelFileName}`}
            download={summary.excelFileName}
            className="px-4 py-2.5 rounded-xl bg-[#1868DB] hover:bg-[#1456b8] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
            title="Tải file kịch bản kiểm thử Excel gốc"
          >
            <Download className="w-4 h-4" />
            <span>Tải Excel UAT ({summary.excelFileSize})</span>
          </a>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('CASES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CASES' 
                  ? 'bg-white text-[#1868DB] shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Test Cases ({summary.totalCases})
            </button>
            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'EVIDENCE' 
                  ? 'bg-white text-[#1868DB] shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bằng chứng ({evidences.length})
            </button>
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'SUMMARY' 
                  ? 'bg-white text-[#1868DB] shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5 Kịch bản
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1868DB] flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.totalCases}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Tổng số Test Cases</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{summary.passedCases} ({summary.passRate})</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Thành công (Pass)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{summary.criticalCases} Cases</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Trọng yếu Go-Live</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600">0 Lỗi (0 Defect)</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">Phương sai (Variance = 0)</div>
          </div>
        </div>
      </div>

      {/* TAB CONTENT 1: TEST CASES VIEW */}
      {activeTab === 'CASES' && (
        <div className="space-y-6">
          {/* Controls: Scenario Selectors & Search & Critical Toggle */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Scenario Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedScenario('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedScenario === 'ALL'
                    ? 'bg-[#1868DB] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Tất cả ({allCases.length})
              </button>
              {summary.scenarios.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedScenario === sc.id
                      ? 'bg-[#1868DB] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                  title={sc.name}
                >
                  {sc.id} ({sc.total})
                </button>
              ))}
            </div>

            {/* Search & Critical Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={onlyCritical}
                  onChange={(e) => setOnlyCritical(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-rose-600">★ Chỉ xem Trọng yếu</span>
              </label>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm Case ID, SQL, mục đích..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1868DB] shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Table of Test Cases */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#1868DB]" />
                <span>Danh sách Test Cases</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#1868DB] font-semibold">
                  Hiển thị {filteredCases.length} / {allCases.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                * Click nút Copy SQL để lấy nhanh câu lệnh truy vấn kiểm tra
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="py-3 px-4 w-32">Mã Case ID</th>
                    <th className="py-3 px-4 w-52">Mục đích kiểm tra</th>
                    <th className="py-3 px-4 w-44">Chức năng / Visual</th>
                    <th className="py-3 px-4 min-w-[340px]">Các bước thực hiện & SQL Đối soát</th>
                    <th className="py-3 px-4 min-w-[200px]">Kết quả mong muốn (DWH)</th>
                    <th className="py-3 px-4 min-w-[180px]">Dữ liệu thực tế (Power BI)</th>
                    <th className="py-3 px-4 w-28 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Case ID */}
                      <td className="py-3.5 px-4 font-mono font-bold align-top">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-[#1868DB] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {c.id}
                          </span>
                          {c.isCritical && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200">
                              ★ Trọng yếu
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Purpose */}
                      <td className="py-3.5 px-4 font-medium align-top leading-relaxed">
                        <div className="font-semibold text-slate-900">{c.purpose}</div>
                        {c.section && (
                          <div className="text-[10px] text-slate-400 mt-1 italic">{c.section}</div>
                        )}
                      </td>

                      {/* Function / Visual */}
                      <td className="py-3.5 px-4 align-top">
                        <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
                          {c.function}
                        </span>
                      </td>

                      {/* Steps & SQL Query */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="relative group bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
                          <pre className="whitespace-pre-wrap">{c.steps}</pre>
                          {c.steps.includes('SELECT') && (
                            <button
                              onClick={() => handleCopySql(c.id, c.steps)}
                              className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer border border-slate-600"
                              title="Sao chép câu lệnh SQL"
                            >
                              {copiedId === c.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy SQL</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Expected Result */}
                      <td className="py-3.5 px-4 align-top text-slate-800 leading-relaxed font-medium">
                        <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                          {c.expected}
                        </div>
                      </td>

                      {/* Actual Data */}
                      <td className="py-3.5 px-4 align-top text-slate-800 leading-relaxed font-mono text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          {c.actualData}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center align-top">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pass</span>
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{c.finishDate}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EVIDENCE VIEW */}
      {activeTab === 'EVIDENCE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Bảng Tổng hợp Bằng chứng Đối soát UAT (Evidence Sheet)
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Toàn bộ 8 hạng mục kiểm tra đều có phương sai Variance = 0, đối chiếu trực tiếp giữa báo cáo Dash.pbix và cơ sở dữ liệu SQL Datamart.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidences.map((ev) => (
                <div key={ev.stt} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-[#1868DB] font-mono font-bold text-xs">
                      #{ev.stt} {ev.scenarioId} ({ev.caseRange})
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {ev.result}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{ev.description}</h3>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200 font-mono">
                    <div>
                      <strong className="text-slate-500 font-sans">Nguồn & Đích:</strong> {ev.sourceTarget}
                    </div>
                    <div>
                      <strong className="text-slate-500 font-sans">Tài liệu tham chiếu:</strong> {ev.docRef}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SCENARIO OVERVIEW */}
      {activeTab === 'SUMMARY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.scenarios.map((sc, index) => (
            <div key={sc.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#1868DB] border border-blue-100">
                  {sc.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  100% Pass
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{sc.name}</h3>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-center">
                <div className="p-2 rounded-xl bg-slate-50">
                  <div className="text-xl font-bold text-slate-900">{sc.total}</div>
                  <div className="text-[11px] text-slate-400 font-medium">Tổng Cases</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <div className="text-xl font-bold">{sc.passed}</div>
                  <div className="text-[11px] font-medium">Thành công</div>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Tiền điều kiện:</span>
                <span className="font-mono font-medium text-slate-700">{sc.prerequisite}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedScenario(sc.id);
                  setActiveTab('CASES');
                }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#1868DB] text-slate-700 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
              >
                Xem chi tiết {sc.total} test cases →
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
