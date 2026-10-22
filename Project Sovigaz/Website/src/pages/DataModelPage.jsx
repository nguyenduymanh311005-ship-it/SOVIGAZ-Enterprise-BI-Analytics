import React, { useState, useMemo } from 'react';
import { 
  GitFork, 
  Layers, 
  ZoomIn, 
  ArrowRight, 
  Database, 
  Table, 
  CheckCircle2, 
  Network, 
  Filter, 
  FileSpreadsheet,
  Cpu,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Info,
  Calendar,
  DollarSign,
  Factory,
  BarChart3,
  X
} from 'lucide-react';
import { dataModelInfo, dataDictionaryTables } from '../data/projectData';

export default function DataModelPage() {
  const [showErdModal, setShowErdModal] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState('/assets/sovigaz_erd.png');
  const [activeDiagramTab, setActiveDiagramTab] = useState('full_diagram');
  const [activeRelPartTab, setActiveRelPartTab] = useState('part1');
  const [selectedTableFilter, setSelectedTableFilter] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Power BI relationship screenshots
  const relScreenshots = [
    {
      id: 'part1',
      title: 'Phần 1: Khách hàng, Thời gian & Danh mục',
      image: '/assets/powerbi_rel_part1.png',
      desc: 'Thiết lập quan hệ cho DIM_CUSTOMER, DIM_DATE, DIM_MONTH, DIM_PRODUCTCATEGORIES, DIM_PRODUCTS, DIM_STOCK, DM_ACCOUNTOBJECTDEBT'
    },
    {
      id: 'part2',
      title: 'Phần 2: Bán hàng, Sản xuất & Công nợ',
      image: '/assets/powerbi_rel_part2.png',
      desc: 'Thiết lập quan hệ cho DM_REVENUEBYSALELEDGER, FACT_ACTUALPRODUCTION, FACT_ANALYTICSDEBIT, FACT_KPI_BY_PRODUCT'
    },
    {
      id: 'part3',
      title: 'Phần 3: Chỉ tiêu Kế hoạch KPI (Tháng, Năm)',
      image: '/assets/powerbi_rel_part3.png',
      desc: 'Thiết lập quan hệ cho FACT_KPI_MONTH, FACT_KPI_YEAR kết nối DIM_DATE, DIM_INDICATOR, DIM_STOCK, DIM_PARENTSTOCK, DIM_YEAR'
    }
  ];

  // Categorize relationships
  const categorizedRelations = useMemo(() => {
    return dataModelInfo.relationships.map(r => {
      let cat = 'OTHER';
      const to = r.toTable.toLowerCase();
      const from = r.fromTable.toLowerCase();

      if (to.includes('revenue') || to.includes('sale') || from.includes('revenue') || from.includes('sale')) {
        cat = 'SALES';
      } else if (to.includes('debt') || to.includes('debit') || from.includes('debt') || from.includes('debit')) {
        cat = 'DEBT';
      } else if (to.includes('actualproduction') || from.includes('actualproduction')) {
        cat = 'PRODUCTION';
      } else if (to.includes('kpi') || from.includes('kpi')) {
        cat = 'KPI';
      } else if (
        (from.startsWith('dim_') || to.startsWith('dim_')) &&
        (from !== 'dim_customer' && to !== 'dim_customer')
      ) {
        cat = 'SNOWFLAKE';
      }

      return {
        ...r,
        category: cat
      };
    });
  }, []);

  // Filtered relationships
  const filteredRelations = useMemo(() => {
    return categorizedRelations.filter(r => {
      // Category filter
      if (filterCategory === 'SALES' && r.category !== 'SALES') return false;
      if (filterCategory === 'DEBT' && r.category !== 'DEBT') return false;
      if (filterCategory === 'PRODUCTION' && r.category !== 'PRODUCTION') return false;
      if (filterCategory === 'KPI' && r.category !== 'KPI') return false;
      if (filterCategory === 'SNOWFLAKE' && r.category !== 'SNOWFLAKE') return false;
      if (filterCategory === 'ACTIVE' && r.status !== 'Active') return false;
      if (filterCategory === 'INACTIVE' && r.status !== 'Inactive') return false;

      // Table selector filter
      if (selectedTableFilter !== 'ALL') {
        const matchesFrom = r.fromTable.toLowerCase() === selectedTableFilter.toLowerCase();
        const matchesTo = r.toTable.toLowerCase() === selectedTableFilter.toLowerCase();
        if (!matchesFrom && !matchesTo) return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchText = `${r.fromTable} ${r.fromField} ${r.toTable} ${r.toField} ${r.desc} ${r.pbiFrom || ''} ${r.pbiTo || ''}`.toLowerCase();
        if (!matchText.includes(q)) return false;
      }

      return true;
    });
  }, [categorizedRelations, filterCategory, selectedTableFilter, searchQuery]);

  const openModal = (imgSrc) => {
    setSelectedImageModal(imgSrc);
    setShowErdModal(true);
  };

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="pb-6 border-b border-[#E9F2FE]">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F2FE] text-[#1868DB] text-xs font-bold uppercase tracking-wider">
            <GitFork className="w-3.5 h-3.5" />
            Mô hình Dữ liệu Quan hệ (Power BI Data Model)
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Khớp 100% với Power BI Desktop Model (19 Bảng, 27 Mối quan hệ)
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Kiến trúc Mô hình Dữ liệu DWH Sovigaz
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-4xl font-normal leading-relaxed">
          Mô hình lai <strong>Star Schema & Snowflake Schema</strong> theo phương pháp luận Ralph Kimball, được thiết kế trên Microsoft SQL Server và triển khai trực quan hóa trên Microsoft Power BI Desktop. Tách biệt chặt chẽ giữa 7 bảng Fact/Datamart và 12 bảng Dimension nhằm tối ưu hóa công cụ VertiPaq và hiệu năng truy vấn DAX.
        </p>
      </div>

      {/* KPI Metric Summary Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng số bảng</span>
            <Database className="w-4 h-4 text-[#1868DB]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">19</span>
            <span className="text-xs text-slate-500 font-medium">Bảng DWH</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>7 Fact / Datamart</span>
            <span>12 Dimension</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mối quan hệ</span>
            <Network className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">27</span>
            <span className="text-xs text-slate-500 font-medium">Quan hệ Power BI</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-emerald-700 font-medium">26 Active (Nét liền)</span>
            <span className="text-amber-700 font-medium">1 Inactive (Nét đứt)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lực lượng quan hệ</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">100%</span>
            <span className="text-xs text-slate-500 font-medium">Many-to-One (*..1)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 truncate">
            Triệt tiêu hoàn toàn quan hệ N-N gây sai số
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Hướng bộ lọc</span>
            <Cpu className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading">Single</span>
            <span className="text-xs text-slate-500 font-medium">Direction (1 ➔ *)</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 truncate">
            Lọc 1 chiều tối ưu tốc độ DAX Engine
          </div>
        </div>
      </div>

      {/* Visual Showcase: Diagram Tabs & Proof Tabs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-6">
        {/* Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1868DB]" />
              Sơ đồ Mô hình Dữ liệu & Bằng chứng Cấu hình Thực tế
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Đối chiếu sơ đồ đồ họa Model View với bảng điều khiển Manage Relationships trong Power BI Desktop
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveDiagramTab('full_diagram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeDiagramTab === 'full_diagram'
                  ? 'bg-white text-[#1868DB] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sơ đồ Model (Diagram View)
            </button>
            <button
              onClick={() => setActiveDiagramTab('manage_rel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeDiagramTab === 'manage_rel'
                  ? 'bg-white text-[#1868DB] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bằng chứng Manage Relationships (3 Phần)
            </button>
            <button
              onClick={() => setActiveDiagramTab('architecture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeDiagramTab === 'architecture'
                  ? 'bg-white text-[#1868DB] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nguyên tắc Thiết kế Kimball
            </button>
          </div>
        </div>

        {/* TAB 1: Sơ đồ Power BI Model */}
        {activeDiagramTab === 'full_diagram' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Sơ đồ đầy đủ 19 bảng và 27 liên kết xuất từ tệp <strong>.pbix</strong> chính thức của dự án Sovigaz
              </span>
              <button
                onClick={() => openModal('/assets/sovigaz_erd.png')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E9F2FE] hover:bg-[#d6e7fd] text-[#1868DB] font-semibold transition-all cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Phóng to toàn màn hình</span>
              </button>
            </div>

            <div 
              onClick={() => openModal('/assets/sovigaz_erd.png')}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 cursor-pointer p-4 flex items-center justify-center min-h-[420px] max-h-[620px]"
            >
              <img 
                src="/assets/sovigaz_erd.png" 
                alt="Sovigaz Power BI Data Model Diagram" 
                className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-300 rounded-xl"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/25 flex items-center justify-center transition-colors">
                <span className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <ZoomIn className="w-3.5 h-3.5 text-[#1868DB]" />
                  Nhấp để xem ảnh phóng to chi tiết từng bảng
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Manage Relationships Screenshots */}
        {activeDiagramTab === 'manage_rel' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Sub-tabs for parts */}
            <div className="flex flex-wrap items-center gap-2">
              {relScreenshots.map(part => (
                <button
                  key={part.id}
                  onClick={() => setActiveRelPartTab(part.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    activeRelPartTab === part.id
                      ? 'bg-[#1868DB] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{part.title}</span>
                </button>
              ))}
            </div>

            {/* Display active screenshot */}
            {relScreenshots
              .filter(p => p.id === activeRelPartTab)
              .map(p => (
                <div key={p.id} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <strong className="text-slate-900">{p.title}:</strong> {p.desc}
                    </div>
                    <button
                      onClick={() => openModal(p.image)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[#1868DB] font-semibold text-xs transition-all cursor-pointer shrink-0 ml-4"
                    >
                      <ZoomIn className="w-3 h-3" />
                      Phóng to
                    </button>
                  </div>

                  <div 
                    onClick={() => openModal(p.image)}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer p-4 flex items-center justify-center max-h-[560px]"
                  >
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="max-w-full max-h-[520px] object-contain group-hover:scale-[1.01] transition-transform duration-300 rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 flex items-center justify-center transition-colors">
                      <span className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md flex items-center gap-2 group-hover:scale-105 transition-transform">
                        <ZoomIn className="w-3.5 h-3.5 text-[#1868DB]" />
                        Nhấp để xem rõ từng cặp cột quan hệ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* TAB 3: Architecture & Design Principles */}
        {activeDiagramTab === 'architecture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {dataModelInfo.designPrinciples.map((dp, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-heading">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-[#1868DB] flex items-center justify-center text-xs font-mono font-bold">
                    {i + 1}
                  </span>
                  {dp.title}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {dp.desc}
                </p>
              </div>
            ))}

            {/* Note on Inactive relationship */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Giải thích kỹ thuật: Vì sao DIM_DATE(Year) đến DIM_YEAR(Value) là Inactive (Nét đứt)?
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Trong mô hình Power BI của Sovigaz, nhánh thời gian đã có chuỗi phân cấp hoạt động (Active): 
                <span className="font-mono font-bold"> DIM_DATE(YearMonth) ➔ DIM_MONTH(YearMonth) ➔ DIM_YEAR(Value)</span>. 
                Nếu tiếp tục kích hoạt thêm mối quan hệ trực tiếp <span className="font-mono font-bold">DIM_DATE(Year) ➔ DIM_YEAR(Value)</span>, 
                Power BI VertiPaq Engine sẽ báo lỗi <strong>Ambiguous Relationship</strong> (xung đột đa luồng bộ lọc chéo). 
                Do đó, mối quan hệ này được cấu hình <strong>Inactive</strong> và chỉ được kích hoạt có chủ đích khi sử dụng hàm DAX <code className="px-1.5 py-0.5 rounded bg-white text-amber-900 font-mono text-[11px] font-bold">USERELATIONSHIP()</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Relationship Explorer Table (27 Relationships) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-[#1868DB]" />
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Ma trận Toàn bộ 27 Mối quan hệ Khóa (Power BI Relationship Matrix)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hiển thị {filteredRelations.length} / 27 mối quan hệ liên kết dữ liệu theo đúng cấu hình Power BI Desktop
            </p>
          </div>

          {/* Quick Search & Select Filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm bảng, khóa ngoại, cột..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1868DB] w-48 sm:w-56"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter by Table */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedTableFilter}
                onChange={(e) => setSelectedTableFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#1868DB]"
              >
                <option value="ALL">Tất cả 19 bảng liên kết</option>
                {dataDictionaryTables.map(t => (
                  <option key={t.tableName} value={t.tableName}>{t.tableName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'Tất cả (27)' },
            { id: 'SALES', label: 'Bán hàng (DM_Revenue) (3)' },
            { id: 'DEBT', label: 'Công nợ & Tuổi nợ (4)' },
            { id: 'PRODUCTION', label: 'Sản xuất thực tế (3)' },
            { id: 'KPI', label: 'Chỉ tiêu KPI (9)' },
            { id: 'SNOWFLAKE', label: 'Phân cấp Dimension (8)' },
            { id: 'ACTIVE', label: 'Active (26)' },
            { id: 'INACTIVE', label: 'Inactive (1)' }
          ].map(pill => (
            <button
              key={pill.id}
              onClick={() => setFilterCategory(pill.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCategory === pill.id
                  ? 'bg-[#1868DB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Relationships Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Bảng nguồn (* - Phía Nhiều)</th>
                <th className="py-3 px-4">Khóa ngoại (FK)</th>
                <th className="py-3 px-4 text-center">Lực lượng & Trạng thái</th>
                <th className="py-3 px-4">Bảng đích (1 - Phía Một)</th>
                <th className="py-3 px-4">Khóa chính (PK)</th>
                <th className="py-3 px-4">Ý nghĩa nghiệp vụ & Quy tắc lọc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRelations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy mối quan hệ nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredRelations.map((rel, idx) => (
                  <tr 
                    key={rel.id} 
                    className={`hover:bg-blue-50/40 transition-colors ${
                      rel.status === 'Inactive' ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                      {idx + 1}
                    </td>
                    
                    {/* From Table (Many *) */}
                    <td className="py-3.5 px-4 font-bold font-mono text-purple-700">
                      {rel.toTable}
                    </td>

                    {/* From Field (Foreign Key) */}
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold">
                        {rel.toField}
                      </span>
                    </td>

                    {/* Cardinality & Status */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                          * ──► 1
                        </span>
                        {rel.status === 'Active' ? (
                          <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-300">
                            Inactive (Nét đứt)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* To Table (One 1) */}
                    <td className="py-3.5 px-4 font-bold font-mono text-[#1868DB]">
                      {rel.fromTable}
                    </td>

                    {/* To Field (Primary Key) */}
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1868DB] border border-blue-200 text-[11px] font-semibold">
                        {rel.fromField}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-xs">
                      {rel.desc}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ERD Diagram Fullscreen Modal */}
      {showErdModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowErdModal(false)}
        >
          <div 
            className="w-full max-w-7xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900 font-heading">
                  Sơ đồ Lược đồ Thực thể Quan hệ & Quản lý Quan hệ Power BI
                </h3>
                <p className="text-xs text-slate-500">Mô hình Star & Snowflake Schema chi tiết 19 bảng và 27 mối quan hệ</p>
              </div>
              <button 
                onClick={() => setShowErdModal(false)}
                className="px-4 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-900/5 min-h-[500px]">
              <img 
                src={selectedImageModal} 
                alt="Power BI Model Diagram Large" 
                className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
