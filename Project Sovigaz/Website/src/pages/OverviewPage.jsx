import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ArrowRight, 
  ExternalLink, 
  X, 
  Maximize2
} from 'lucide-react';
import { companyInfo, projectOverview } from '../data/projectData';

export default function OverviewPage() {
  const [activeModal, setActiveModal] = useState(null); // 'company' | 'challenges' | 'pipeline' | 'roadmap' | 'diagram' | null

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* 1. HERO SECTION: Clean, Shortened, 1 Sentence, 1 Primary CTA */}
      <section className="pt-6 pb-10 border-b border-slate-200">
        <div className="max-w-3xl space-y-4">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#1868DB] bg-[#E9F2FE] px-3 py-1 rounded-full border border-[#8FB8F6]/60">
            Nền tảng Quản trị Doanh nghiệp
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight font-heading leading-tight">
            Cổng Dữ liệu & Báo cáo Sovigaz
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Tập trung hóa dữ liệu bán hàng, công nợ và sản xuất phục vụ điều hành kinh doanh.
          </p>

          <div className="pt-2">
            <NavLink
              to="/data-dictionary"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1868DB] hover:bg-[#0f4db2] text-white text-sm font-semibold transition-all shadow-loom-sm active:scale-98"
            >
              <span>Khám phá Từ điển Dữ liệu</span>
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 2. METRICS GRID: 3 Columns, Large Numbers, High Visual Contrast */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-heading">
            Chỉ số Quy mô Kho Dữ liệu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#8FB8F6] transition-colors group">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Giao dịch bán hàng</span>
            <p className="mt-2 text-4xl lg:text-5xl font-bold font-mono text-[#1868DB] tracking-tight">
              229K+
            </p>
            <p className="mt-2 text-xs text-slate-600 line-clamp-1 group-hover:text-slate-900">
              Dòng chứng từ chi tiết từ MISA AMIS
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#8FB8F6] transition-colors group">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Chỉ tiêu kế hoạch</span>
            <p className="mt-2 text-4xl lg:text-5xl font-bold font-mono text-[#1868DB] tracking-tight">
              12.1K+
            </p>
            <p className="mt-2 text-xs text-slate-600 line-clamp-1 group-hover:text-slate-900">
              Kế hoạch sản xuất & KPI theo biểu mẫu A3
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#8FB8F6] transition-colors group">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Bảng dữ liệu DWH</span>
            <p className="mt-2 text-4xl lg:text-5xl font-bold font-mono text-[#1868DB] tracking-tight">
              19
            </p>
            <p className="mt-2 text-xs text-slate-600 line-clamp-1 group-hover:text-slate-900">
              Gồm 7 bảng Fact và 12 bảng Dimension
            </p>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS CONTEXT & SCOPE (Cards with Bullet Points < 12 words, NO ICONS) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
            Tổng quan Nghiệp vụ & Phạm vi Dự án
          </h2>
          <p className="text-xs text-slate-500 mt-1">Thông tin cô đọng về chủ đầu tư và mục tiêu triển khai</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Doanh nghiệp */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-[#1868DB] uppercase tracking-wider">Chủ đầu tư</span>
                <span className="text-[11px] text-slate-400 font-mono">SOVIGAZ</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">
                Công ty Cổ phần Hơi Kỹ nghệ Que Hàn
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                  <span>Thành lập năm 1974, hơn 50 năm kinh nghiệm ngành khí.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                  <span>Doanh nghiệp dẫn đầu sản xuất khí công nghiệp và y tế.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                  <span>Sản xuất que hàn điện, hóa chất và thiết bị bồn áp lực.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                  <span>Mạng lưới 11 xí nghiệp thành viên trên toàn quốc.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('company')}
              className="text-xs font-semibold text-[#1868DB] hover:text-[#0f4db2] pt-2 border-t border-slate-100 flex items-center justify-between cursor-pointer w-full text-left"
            >
              <span>Xem chi tiết hồ sơ</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2: Hiện trạng & Thách thức */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hiện trạng trước dự án</span>
                <span className="text-[11px] text-slate-400 font-mono">Thách thức</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">
                Phân mảnh Dữ liệu & Báo cáo Thủ công
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                  <span>Dữ liệu bán hàng phân tán trên phần mềm MISA AMIS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                  <span>Kế hoạch KPI và sản xuất lưu tại nhiều file Excel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                  <span>Chưa có cơ sở dữ liệu kho tập trung đồng nhất.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                  <span>Tốn nhiều thời gian đối soát số liệu biểu mẫu A3.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('challenges')}
              className="text-xs font-semibold text-[#1868DB] hover:text-[#0f4db2] pt-2 border-t border-slate-100 flex items-center justify-between cursor-pointer w-full text-left"
            >
              <span>Xem chi tiết thách thức</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 3: Giải pháp DWH */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Giải pháp triển khai</span>
                <span className="text-[11px] text-slate-400 font-mono">DWH & BI</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 font-heading">
                Kho Dữ liệu Tập trung & Báo cáo BI
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>Xây dựng kho dữ liệu DWH trên Microsoft SQL Server.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>Tự động hóa luồng trích xuất ETL bằng SSIS và Python.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>Chuẩn hóa 21 nhóm sản phẩm quy đổi theo đơn vị chuẩn.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>Phát triển 5 báo cáo Power BI và tự động trích xuất A3.</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('pipeline')}
              className="text-xs font-semibold text-[#1868DB] hover:text-[#0f4db2] pt-2 border-t border-slate-100 flex items-center justify-between cursor-pointer w-full text-left"
            >
              <span>Xem chi tiết giải pháp</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. DATA PIPELINE ARCHITECTURE (Horizontal Cards, Bullet < 12 words, NO ICONS) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              Quy trình Xử lý Dữ liệu 4 Bước
            </h2>
            <p className="text-xs text-slate-500 mt-1">Luồng chuyển dịch dữ liệu từ nguồn phát sinh đến lớp phân tích báo cáo</p>
          </div>

          <button
            onClick={() => setActiveModal('diagram')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#1868DB]" />
            <span>Xem sơ đồ luồng tổng thể</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Bước 01</span>
            <h3 className="font-bold text-sm text-slate-900">Dữ liệu Nguồn</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                <span>MISA AMIS: 229,000+ dòng chứng từ bán hàng.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                <span>Tệp Excel xí nghiệp: chỉ tiêu sản xuất A3.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Bước 02</span>
            <h3 className="font-bold text-sm text-slate-900">Xử lý ETL</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                <span>Làm sạch dữ liệu bằng SSIS và script Python.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                <span>Ánh xạ vật tư sang 21 nhóm sản phẩm chuẩn.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Bước 03</span>
            <h3 className="font-bold text-sm text-slate-900">Kho DWH SQL Server</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                <span>Mô hình Star Schema và Snowflake Schema.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                <span>Phân tách rõ ràng Fact bán hàng và Fact KPI.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#E9F2FE]/50 border border-[#8FB8F6]/80 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1868DB] font-mono">Bước 04</span>
            <h3 className="font-bold text-sm text-[#1868DB]">Power BI & Trích xuất A3</h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                <span>5 hệ thống báo cáo phân tích quản trị BI.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1868DB] mt-1.5 shrink-0"></span>
                <span>Tự động xuất ngược 4 tệp dữ liệu biểu mẫu A3.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* MODAL FOR DEEP DIVE TECHNICAL DETAILS */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-loom-lg border border-slate-200 space-y-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 font-heading">
                {activeModal === 'company' && 'Hồ sơ Chi tiết Doanh nghiệp Sovigaz'}
                {activeModal === 'challenges' && 'Hiện trạng & Thách thức Dữ liệu trước Dự án'}
                {activeModal === 'pipeline' && 'Đặc tả Kỹ thuật Giải pháp Kho DWH Sovigaz'}
                {activeModal === 'diagram' && 'Sơ đồ Luồng Dữ liệu Tổng thể Hệ thống'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeModal === 'company' && (
                <>
                  <p>{companyInfo.legacyText}</p>
                  <h4 className="font-bold text-slate-900 pt-2">Lĩnh vực sản xuất & kinh doanh nòng cốt:</h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                    {companyInfo.coreBusiness.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-4">
                    Trụ sở chính: {companyInfo.headquarters} • Thành lập: 1974.
                  </div>
                </>
              )}

              {activeModal === 'challenges' && (
                <>
                  <div className="space-y-3">
                    {projectOverview.challenges.map((c, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-1">{c.title}</h4>
                        <p className="text-xs text-slate-600">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeModal === 'pipeline' && (
                <>
                  <p>Hệ thống kho dữ liệu doanh nghiệp giải quyết triệt để sự rời rạc giữa hệ thống kế toán MISA AMIS và các tệp bảng tính biểu mẫu A3.</p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">Công nghệ CSDL</span>
                      <span>Microsoft SQL Server Enterprise</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">Công cụ chuyển đổi</span>
                      <span>SSIS Packages & Python Pipeline</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">Mô hình hóa</span>
                      <span>Star & Snowflake Schema (Kimball)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block mb-1">Lớp báo cáo</span>
                      <span>Power BI với 40+ DAX Measures</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'diagram' && (
                <div className="flex flex-col items-center justify-center p-2 bg-slate-950 rounded-2xl overflow-hidden">
                  <img 
                    src="/assets/tong_quan_luong.png" 
                    alt="Sơ đồ luồng Sovigaz" 
                    className="max-h-[65vh] object-contain rounded-lg" 
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
