import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Database, Table, ArrowRight, FileText, CornerDownLeft } from 'lucide-react';
import { dataDictionaryTables, brdReports } from '../data/projectData';
import { uatTestingData } from '../data/uatTestingData';

export default function KeyboardSearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard listener for '/' and 'Escape'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Default: show popular tables
      const initial = dataDictionaryTables.slice(0, 6).map(t => ({
        type: 'table',
        id: t.tableName,
        title: t.tableName,
        subtitle: t.businessName,
        badge: t.tableType,
        domain: t.domain,
        target: `/data-dictionary?table=${t.tableName}`
      }));
      setResults(initial);
      setSelectedIndex(0);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const matches = [];

    // Search tables
    dataDictionaryTables.forEach(t => {
      if (
        t.tableName.toLowerCase().includes(term) ||
        t.businessName.toLowerCase().includes(term) ||
        t.domain.toLowerCase().includes(term)
      ) {
        matches.push({
          type: 'table',
          id: t.tableName,
          title: t.tableName,
          subtitle: `${t.businessName} (${t.columnCount} trường, ${t.rowCount.toLocaleString()} bản ghi)`,
          badge: t.tableType,
          domain: t.domain,
          target: `/data-dictionary?table=${t.tableName}`
        });
      }

      // Search fields inside table
      t.columns.forEach(col => {
        if (
          col.fieldName.toLowerCase().includes(term) ||
          col.description.toLowerCase().includes(term) ||
          col.dataType.toLowerCase().includes(term)
        ) {
          matches.push({
            type: 'field',
            id: `${t.tableName}.${col.fieldName}`,
            title: col.fieldName,
            subtitle: `Thuộc bảng ${t.tableName}: ${col.description}`,
            badge: col.dataType,
            domain: t.domain,
            target: `/data-dictionary?table=${t.tableName}&field=${col.fieldName}`
          });
        }
      });
    });

    // Search BRD Reports
    brdReports.forEach(r => {
      if (
        r.title.toLowerCase().includes(term) ||
        r.objective.toLowerCase().includes(term) ||
        r.keyKpis.some(k => k.name.toLowerCase().includes(term))
      ) {
        matches.push({
          type: 'report',
          id: r.id,
          title: r.title,
          subtitle: `Báo cáo quản trị: ${r.subtitle}`,
          badge: 'Báo cáo BRD',
          domain: 'Quản trị BI',
          target: `/brd?report=${r.id}`
        });
      }
    });

    // Search UAT Test Scenarios
    if ('kiểm thử'.includes(term) || 'uat'.includes(term) || 'test'.includes(term)) {
      matches.push({
        type: 'testing',
        id: 'uat-general',
        title: 'Báo cáo Kiểm thử UAT Hệ thống BI',
        subtitle: '62/62 Test cases Pass 100%, tích hợp SQL đối soát',
        badge: 'Kiểm thử UAT',
        domain: 'Kiểm thử',
        target: '/testing'
      });
    }

    uatTestingData.summary.scenarios.forEach(sc => {
      if (
        sc.id.toLowerCase().includes(term) ||
        sc.name.toLowerCase().includes(term)
      ) {
        matches.push({
          type: 'testing',
          id: sc.id,
          title: `${sc.id}: ${sc.name}`,
          subtitle: `Kịch bản kiểm thử: ${sc.total} cases (${sc.passRate} Pass)`,
          badge: 'UAT Scenario',
          domain: 'Kiểm thử',
          target: '/testing'
        });
      }
    });

    setResults(matches.slice(0, 15));
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleSelect = (item) => {
    navigate(item.target);
    onClose();
  };

  const handleKeyDownInInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-loom-lg border border-[#E9F2FE] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-[#1868DB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            placeholder="Tìm bảng dữ liệu, tên trường, kiểu dữ liệu hoặc chỉ tiêu BRD..."
            className="w-full text-base text-[#292A2E] placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-md font-mono">
            ESC để đóng
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Không tìm thấy trường dữ liệu hoặc bảng phù hợp với "{searchTerm}"
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id + index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3
                    ${isSelected 
                      ? 'bg-[#E9F2FE] text-[#1868DB] shadow-xs' 
                      : 'hover:bg-slate-50 text-[#292A2E]'
                    }
                  `}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`
                      p-2 rounded-xl shrink-0 mt-0.5
                      ${item.type === 'table' ? 'bg-blue-100 text-[#1868DB]' : 
                        item.type === 'report' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}
                    `}>
                      {item.type === 'table' ? <Table className="w-4 h-4" /> : 
                       item.type === 'report' ? <FileText className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate font-mono">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/80 border border-slate-200 shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {item.domain}
                    </span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-[#1868DB]' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
              để điều hướng
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
              để chọn
            </span>
          </div>
          <span className="text-slate-400">Từ điển CSDL Sovigaz</span>
        </div>
      </div>
    </div>
  );
}
