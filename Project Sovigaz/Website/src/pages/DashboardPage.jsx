import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Database,
  Maximize2
} from 'lucide-react';
import { powerBiMetadata } from '../data/powerBiDashboardData';

export default function DashboardPage() {
  const toggleFullscreen = () => {
    const iframe = document.getElementById('pbi-iframe');
    if (!document.fullscreenElement) {
      if (iframe?.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe?.webkitRequestFullscreen) { /* Safari */
        iframe.webkitRequestFullscreen();
      } else if (iframe?.msRequestFullscreen) { /* IE11 */
        iframe.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. HEADER */}
      <div className="pb-6 border-b border-[#E9F2FE]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F2FE] text-[#1868DB] text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            Hệ thống Báo cáo Quản trị BI
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Database className="w-3.5 h-3.5 text-[#1868DB]" />
              {powerBiMetadata.fileName} ({powerBiMetadata.fileSize})
            </span>
            <a
              href="/Dash.pbix"
              download="Dash.pbix"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1868DB] hover:bg-[#0f4db2] text-white text-xs font-semibold transition-all shadow-loom-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file PBIX</span>
            </a>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
          Bảng Điều khiển Quản trị Doanh nghiệp Sovigaz
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 max-w-3xl font-normal">
          Báo cáo Power BI trực tuyến được nhúng trực tiếp. Bạn có thể tương tác với biểu đồ hoặc mở toàn màn hình để xem chi tiết.
        </p>
      </div>

      {/* 2. POWER BI EMBED IFRAME */}
      <div className="rounded-3xl bg-white border border-[#E9F2FE] shadow-loom-md overflow-hidden relative">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-700">Power BI Report Viewer</span>
          <button 
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-xs font-semibold shadow-2xs"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Toàn màn hình
          </button>
        </div>
        <div className="w-full bg-slate-100 flex flex-col items-center justify-center min-h-[600px]">
          <iframe 
            id="pbi-iframe"
            title="Dash" 
            className="w-full h-[600px] md:h-[700px] lg:h-[800px] border-0 bg-white" 
            src="https://app.powerbi.com/reportEmbed?reportId=e60f5be2-84ed-4a2a-a7cd-7206a76d37c6&autoAuth=true&ctid=52b151d9-e587-4cab-b8e7-44a0d2d4f811&actionBarEnabled=true" 
            frameBorder="0" 
            allowFullScreen={true}
          ></iframe>
        </div>
      </div>
      
      {/* 3. SPECIFICATION SUMMARY FOOTER */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Thông tin Tệp Báo cáo Gốc
          </span>
          <p className="text-xs text-slate-600">
            {powerBiMetadata.sourceModel} • Tích hợp 19 bảng DWH • Báo cáo quản trị đa chiều.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/Dash.pbix"
            download="Dash.pbix"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#8FB8F6] text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#1868DB]" />
            <span>Tải về Dash.pbix (14.1 MB)</span>
          </a>
        </div>
      </div>

    </div>
  );
}
