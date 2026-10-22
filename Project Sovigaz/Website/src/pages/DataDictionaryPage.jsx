import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Database, 
  Table, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Key, 
  Link2, 
  Filter, 
  Layers,
  Sparkles,
  ArrowRight,
  Code
} from 'lucide-react';
import { dataDictionaryTables, dataModelInfo } from '../data/projectData';

export default function DataDictionaryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTable = searchParams.get('table') || 'DM_RevenueBySaleLedger';
  const initialField = searchParams.get('field') || '';

  const [selectedTableId, setSelectedTableId] = useState(initialTable);
  const [filterDomain, setFilterDomain] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [dataTypeFilter, setDataTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState(initialField);
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showRelationsModal, setShowRelationsModal] = useState(false);

  const searchInputRef = useRef(null);

  // Sync state when URL params change
  useEffect(() => {
    const t = searchParams.get('table');
    const f = searchParams.get('field');
    if (t && dataDictionaryTables.some(tab => tab.tableName === t)) {
      setSelectedTableId(t);
    }
    if (f) {
      setSearchTerm(f);
    }
  }, [searchParams]);

  // Keyboard shortcut listener: press '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Current active table
  const currentTable = useMemo(() => {
    return dataDictionaryTables.find(t => t.tableName === selectedTableId) || dataDictionaryTables[0];
  }, [selectedTableId]);

  // Domains list
  const domains = useMemo(() => {
    const set = new Set(dataDictionaryTables.map(t => t.domain));
    return ['ALL', ...Array.from(set)];
  }, []);

  // Filtered tables for the switcher
  const filteredTables = useMemo(() => {
    return dataDictionaryTables.filter(t => {
      const matchDomain = filterDomain === 'ALL' || t.domain === filterDomain;
      const matchType = filterType === 'ALL' || 
        (filterType === 'FACT' && t.tableType.includes('Fact')) ||
        (filterType === 'DIM' && t.tableType.includes('Dimension'));
      return matchDomain && matchType;
    });
  }, [filterDomain, filterType]);

  // Unique data types in current table
  const availableDataTypes = useMemo(() => {
    const types = new Set(currentTable.columns.map(c => c.dataType.split('(')[0].trim()));
    return ['ALL', ...Array.from(types)];
  }, [currentTable]);

  // Filtered columns of current table (or global search results)
  const displayedColumns = useMemo(() => {
    if (isGlobalSearch && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      const allMatches = [];
      dataDictionaryTables.forEach(t => {
        t.columns.forEach(col => {
          if (
            col.fieldName.toLowerCase().includes(term) ||
            col.description.toLowerCase().includes(term) ||
            col.dataType.toLowerCase().includes(term)
          ) {
            allMatches.push({
              ...col,
              originTable: t.tableName,
              originBusinessName: t.businessName
            });
          }
        });
      });
      return allMatches;
    }

    // Local search inside current table
    return currentTable.columns.filter(col => {
      const matchSearch = !searchTerm.trim() || 
        col.fieldName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        col.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        col.dataType.toLowerCase().includes(searchTerm.toLowerCase().trim());
      
      const matchDataType = dataTypeFilter === 'ALL' || 
        col.dataType.toUpperCase().startsWith(dataTypeFilter.toUpperCase());

      return matchSearch && matchDataType;
    });
  }, [currentTable, searchTerm, dataTypeFilter, isGlobalSearch]);

  // Copy field name
  const handleCopyField = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(text);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // Copy SQL DDL
  const handleCopySqlDdl = () => {
    const colDefs = currentTable.columns.map(c => {
      const nullability = c.constraint.includes('NOT NULL') || c.isPk ? 'NOT NULL' : 'NULL';
      return `  [${c.fieldName}] ${c.dataType} ${nullability}`;
    }).join(',\n');

    const sql = `CREATE TABLE [dbo].[${currentTable.tableName}] (\n${colDefs}\n);`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['STT', 'Tên trường', 'Ràng buộc', 'Kiểu dữ liệu', 'Mô tả chi tiết'];
    const rows = currentTable.columns.map(c => [
      c.stt,
      `"${c.fieldName}"`,
      `"${c.constraint}"`,
      `"${c.dataType}"`,
      `"${c.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentTable.tableName}_DataDictionary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find relationships for this table
  const tableRelations = useMemo(() => {
    return dataModelInfo.relationships.filter(
      r => r.fromTable === currentTable.tableName || r.toTable === currentTable.tableName
    );
  }, [currentTable]);

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E9F2FE]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F2FE] text-[#1868DB] text-xs font-bold uppercase tracking-wider mb-3">
            <Database className="w-3.5 h-3.5" />
            Tài liệu Kỹ thuật CSDL
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
            Từ điển Dữ liệu Doanh nghiệp
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 max-w-3xl font-normal">
            Đặc tả chi tiết 19 bảng DWH gồm cấu trúc trường, kiểu dữ liệu, ràng buộc khóa và diễn giải nghiệp vụ.
          </p>
        </div>

        {/* Action utility buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRelationsModal(true)}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#E9F2FE] text-[#1868DB] border border-[#8FB8F6] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Mối quan hệ ({tableRelations.length})</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-full bg-[#1868DB] hover:bg-[#1456b8] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-loom-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Table Selector + Right Table Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Table switcher sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-[#292A2E] flex items-center gap-2">
                <Table className="w-4 h-4 text-[#1868DB]" />
                Danh mục bảng ({filteredTables.length}/19)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Chọn bảng để xem</span>
            </div>

            {/* Filter by Domain & Type */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'FACT', 'DIM'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      filterType === t 
                        ? 'bg-[#1868DB] text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'ALL' ? 'Tất cả' : t === 'FACT' ? 'Fact / Datamart' : 'Dimension'}
                  </button>
                ))}
              </div>

              {/* Domain Dropdown */}
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-[#1868DB]"
              >
                <option value="ALL">Tất cả phân hệ nghiệp vụ</option>
                {domains.filter(d => d !== 'ALL').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Table List Items */}
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredTables.map(t => {
                const isSelected = t.tableName === selectedTableId;
                const isFact = t.tableType.includes('Fact');
                return (
                  <div
                    key={t.tableName}
                    onClick={() => {
                      setSelectedTableId(t.tableName);
                      setIsGlobalSearch(false);
                      setSearchParams({ table: t.tableName });
                    }}
                    className={`
                      p-3 rounded-2xl cursor-pointer transition-all border text-left
                      ${isSelected 
                        ? 'bg-[#E9F2FE] border-[#8FB8F6] shadow-xs' 
                        : 'bg-white hover:bg-slate-50 border-slate-100'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold font-mono truncate ${isSelected ? 'text-[#1868DB]' : 'text-slate-800'}`}>
                        {t.tableName}
                      </span>
                      <span className={`
                        text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0
                        ${isFact ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}
                      `}>
                        {isFact ? 'Fact' : 'Dim'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {t.businessName}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>{t.columnCount} cột</span>
                      <span>•</span>
                      <span>{t.rowCount.toLocaleString()} dòng</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Table Header Banner + Interactive Search + Columns Table (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Table Meta Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#1868DB]">
                    {currentTable.tableName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E9F2FE] text-[#1868DB] border border-[#8FB8F6]/50">
                    {currentTable.tableType}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {currentTable.businessName}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 font-medium">
                  {currentTable.domain}
                </span>
              </div>
            </div>

            {/* Meta details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Số lượng trường</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block font-heading">
                  {currentTable.columnCount} cột
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Số dòng thực tế</span>
                <span className="text-lg font-bold text-[#1868DB] mt-0.5 block font-heading">
                  {currentTable.rowCount.toLocaleString()} dòng
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 col-span-2">
                <span className="text-[11px] text-slate-500 block">Thông tin khóa chính</span>
                <span className="text-xs font-semibold text-slate-800 mt-1 block font-mono truncate" title={currentTable.metaInfo}>
                  {currentTable.columns.filter(c => c.isPk).map(c => c.fieldName).join(', ') || 'Chưa định nghĩa PK rõ ràng'}
                </span>
              </div>
            </div>

            {currentTable.metaInfo && (
              <p className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100 leading-relaxed font-mono">
                {currentTable.metaInfo}
              </p>
            )}
          </div>

          {/* Interactive Search & Quick Filters Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Keyboard Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Gõ để tìm trường dữ liệu (Nhấn / để tìm từ bàn phím)..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#292A2E] placeholder-slate-400 focus:outline-none focus:border-[#1868DB] focus:bg-white transition-all font-medium"
                />
                <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-mono text-slate-400 shadow-2xs">
                  /
                </kbd>
              </div>

              {/* Search Scope Switcher */}
              <div className="flex items-center gap-3 shrink-0 py-1 px-3 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                <span 
                  onClick={() => setIsGlobalSearch(!isGlobalSearch)}
                  className="text-xs font-semibold text-slate-700 select-none cursor-pointer"
                >
                  {isGlobalSearch ? 'Tìm tất cả các bảng' : 'Chỉ tìm bảng đang chọn'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isGlobalSearch}
                  onClick={() => setIsGlobalSearch(!isGlobalSearch)}
                  title={isGlobalSearch ? 'Bật: Tìm tất cả các bảng (Nhấp để chỉ tìm bảng đang chọn)' : 'Tắt: Chỉ tìm bảng đang chọn (Nhấp để tìm tất cả các bảng)'}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isGlobalSearch ? 'bg-[#1868DB]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isGlobalSearch ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Data Type Filters */}
            {!isGlobalSearch && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Lọc kiểu dữ liệu:
                </span>
                {availableDataTypes.map(dt => (
                  <button
                    key={dt}
                    onClick={() => setDataTypeFilter(dt)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      dataTypeFilter === dt
                        ? 'bg-[#1868DB] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columns Table */}
          <div className="rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#292A2E] font-heading">
                  {isGlobalSearch ? 'Kết quả tìm kiếm toàn hệ thống' : 'Danh sách các trường dữ liệu'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  {displayedColumns.length} trường
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    {isGlobalSearch && <th className="py-3 px-4">Bảng</th>}
                    <th className="py-3 px-4">Tên trường</th>
                    <th className="py-3 px-4">Ràng buộc</th>
                    <th className="py-3 px-4">Kiểu dữ liệu</th>
                    <th className="py-3 px-4">Diễn giải nghiệp vụ chi tiết</th>
                    <th className="py-3 px-4 w-16 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {displayedColumns.length === 0 ? (
                    <tr>
                      <td colSpan={isGlobalSearch ? 7 : 6} className="py-12 text-center text-slate-400">
                        Không tìm thấy trường dữ liệu nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    displayedColumns.map((col, idx) => {
                      const isPk = col.isPk;
                      const isFk = col.isFk;
                      const isCopied = copiedField === col.fieldName;

                      return (
                        <tr 
                          key={col.fieldName + idx}
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                            {col.stt || idx + 1}
                          </td>

                          {isGlobalSearch && (
                            <td className="py-3.5 px-4 font-mono font-bold text-[#1868DB]">
                              <button
                                onClick={() => {
                                  setSelectedTableId(col.originTable);
                                  setIsGlobalSearch(false);
                                  setSearchParams({ table: col.originTable });
                                }}
                                className="hover:underline cursor-pointer text-left"
                              >
                                {col.originTable}
                              </button>
                            </td>
                          )}

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold font-mono text-slate-900 group-hover:text-[#1868DB] transition-colors">
                                {col.fieldName}
                              </span>
                              {isPk && (
                                <span className="inline-flex p-0.5 rounded bg-amber-100 text-amber-800" title="Khóa chính (PK)">
                                  <Key className="w-3 h-3" />
                                </span>
                              )}
                              {isFk && (
                                <span className="inline-flex p-0.5 rounded bg-blue-100 text-blue-800" title={`Khóa ngoại nối ${col.refTable || ''}`}>
                                  <Link2 className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`
                              inline-block px-2 py-0.5 rounded-md text-[11px] font-medium leading-normal
                              ${isPk ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                                isFk ? 'bg-blue-50 text-blue-900 border border-blue-200' :
                                col.constraint.includes('NOT NULL') ? 'bg-slate-100 text-slate-700' : 'bg-slate-50 text-slate-500'}
                            `}>
                              {col.constraint || 'NULL'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                              {col.dataType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-md">
                            {col.description}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleCopyField(col.fieldName)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#1868DB] hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                              title="Sao chép tên trường"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
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
      </div>

      {/* Relations Modal */}
      {showRelationsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowRelationsModal(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-loom-lg border border-slate-200 space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#1868DB]" />
                <h3 className="font-bold text-lg text-slate-900 font-heading">
                  Các mối quan hệ liên kết với {currentTable.tableName}
                </h3>
              </div>
              <button 
                onClick={() => setShowRelationsModal(false)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="space-y-3">
              {tableRelations.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">
                  Bảng này là danh mục phụ hoặc không có liên kết trực tiếp trong lược đồ quan hệ chính.
                </p>
              ) : (
                tableRelations.map(rel => (
                  <div key={rel.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold">
                      <span className="text-[#1868DB]">{rel.fromTable}.{rel.fromField}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-purple-700">{rel.toTable}.{rel.toField}</span>
                      <span className="ml-auto px-2 py-0.5 bg-white rounded border border-slate-200 text-[10px] text-slate-600">
                        {rel.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {rel.desc}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
