import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#101214] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
                <img 
                  src="/assets/sovigaz_logo.png" 
                  alt="Sovigaz Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-heading">
                SOVIGAZ
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Hệ thống Kho Dữ liệu Doanh nghiệp và Nền tảng Báo cáo Quản trị BI tập trung phục vụ Ban Lãnh đạo và các xí nghiệp thành viên của Công ty Cổ phần Hơi Kỹ nghệ Que Hàn.
            </p>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tài liệu kỹ thuật
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/" className="hover:text-white transition-colors">
                  Tổng quan dự án
                </NavLink>
              </li>
              <li>
                <NavLink to="/data-dictionary" className="hover:text-white transition-colors">
                  Từ điển dữ liệu (19 bảng)
                </NavLink>
              </li>
              <li>
                <NavLink to="/brd" className="hover:text-white transition-colors">
                  Đặc tả nghiệp vụ BRD
                </NavLink>
              </li>
              <li>
                <NavLink to="/data-model" className="hover:text-white transition-colors">
                  Mô hình dữ liệu quan hệ
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Upcoming Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phân hệ mở rộng
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/dashboard" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Dashboard BI</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">Đang làm</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/machine-learning" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Machine Learning</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300">Nghiệm thu</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/chatbot-rag" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Chatbot RAG</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300">Trực tuyến</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Project Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Đơn vị triển khai
            </h4>
            <div className="text-xs space-y-2 text-slate-400 leading-relaxed">
              <p className="text-white font-medium">Công ty TNHH Giải pháp Phân tích Dữ liệu Insight Data (INDA)</p>
              <p>Chủ đầu tư: Công ty Cổ phần Hơi Kỹ nghệ Que Hàn (SOVIGAZ - Thành lập 1974)</p>
              <p className="text-slate-500 pt-2 font-mono text-[11px]">
                Công nghệ: SQL Server, SSIS, Python, Power BI, ReactJS, Firebase Hosting.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2025 - 2026 SOVIGAZ & INDA Data Engineering. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6">
            <span>Phiên bản DWH 1.0</span>
            <span>Trạng thái: Hoạt động ổn định</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
