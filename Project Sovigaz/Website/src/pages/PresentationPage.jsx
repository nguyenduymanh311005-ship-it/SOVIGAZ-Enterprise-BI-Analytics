import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel, Keyboard } from 'swiper/modules';
import { NavLink } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

import DataDictionaryPage from './DataDictionaryPage';
import BrdPage from './BrdPage';
import DataModelPage from './DataModelPage';
import DashboardPage from './DashboardPage';
import TestingPage from './TestingPage';
import MachineLearningPage from './MachineLearningPage';
import ChatbotRagPage from './ChatbotRagPage';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const swiperRef = useRef(null);
  const totalSlides = 12;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Custom Scoped CSS for Swiper Navigation Buttons to never overlap text */}
      <style>{`
        .swiper-button-prev,
        .swiper-button-next {
          width: 38px !important;
          height: 38px !important;
          background-color: rgba(15, 23, 42, 0.85) !important;
          backdrop-filter: blur(8px) !important;
          border-radius: 9999px !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
          transition: all 0.2s ease !important;
          z-index: 40 !important;
        }
        .swiper-button-prev {
          left: 14px !important;
        }
        .swiper-button-next {
          right: 14px !important;
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 14px !important;
          font-weight: 800 !important;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: rgba(15, 23, 42, 1) !important;
          transform: scale(1.1);
        }
        .swiper-button-disabled {
          opacity: 0.15 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* Presentation Full Width & Height Canvas */}
      <div className="relative w-full h-full bg-white overflow-hidden flex flex-col">

        {/* Top Controls: Fullscreen & Exit */}
        <div className="absolute top-3.5 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 text-xs font-semibold border border-slate-700/70 cursor-pointer"
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình (F11)"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-sky-400" /> : <Maximize className="w-3.5 h-3.5 text-sky-400" />}
            <span className="hidden sm:inline text-slate-100">{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
          </button>

          <NavLink 
            to="/" 
            className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 text-xs font-semibold border border-slate-700/70 cursor-pointer"
            title="Thoát chế độ trình chiếu (Về trang chủ)"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline text-slate-100">Thoát Slide</span>
          </NavLink>
        </div>

        {/* Page indicator in the center bottom: "current / total" (ví dụ 1 / 11) */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-950 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-slate-700/70 tracking-wider transition-all">
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="hover:text-sky-400 p-0.5 disabled:opacity-30 disabled:hover:text-white cursor-pointer transition-colors"
            disabled={currentSlide === 1}
            title="Slide trước (Mũi tên Trái)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-slate-100 font-extrabold select-none">
            {currentSlide} / {totalSlides}
          </span>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="hover:text-sky-400 p-0.5 disabled:opacity-30 disabled:hover:text-white cursor-pointer transition-colors"
            disabled={currentSlide === totalSlides}
            title="Slide sau (Mũi tên Phải)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.activeIndex + 1);
          }}
          cssMode={true}
          navigation={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Mousewheel, Keyboard]}
          className="w-full h-full"
        >
          
          {/* SLIDE 1: INTRO */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 px-16 py-10 text-center select-none">
              <div className="w-20 h-20 mx-auto rounded-full bg-white border border-slate-200 p-2 flex items-center justify-center shadow-md mb-6">
                <img src="/assets/sovigaz_logo.png" alt="Sovigaz Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1868DB] tracking-tight leading-tight max-w-4xl">
                Báo cáo Tổng kết Dự án Sovigaz
              </h1>
              <div className="mt-6 space-y-2">
                <p className="text-xl sm:text-2xl text-slate-700 font-semibold">
                  Người thực hiện: Nguyễn Duy Mạnh
                </p>
                <p className="text-base sm:text-xl text-slate-600 font-medium">
                  Người hướng dẫn: Công ty INSIGHT DATA
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 2: OUTLINE */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-col justify-center bg-white px-16 md:px-28 lg:px-36">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1868DB] mb-10 border-b-4 border-[#1868DB] pb-3 inline-block self-start">
                Mục lục
              </h2>
              <ul className="text-xl md:text-2xl space-y-6 text-slate-700 font-semibold">
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#E9F2FE] text-[#1868DB] flex items-center justify-center text-lg font-bold">1</span>
                  <span>Các vị trí chính trong mảng Data</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#E9F2FE] text-[#1868DB] flex items-center justify-center text-lg font-bold">2</span>
                  <span>Các bước thực hiện dự án Sovigaz</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#E9F2FE] text-[#1868DB] flex items-center justify-center text-lg font-bold">3</span>
                  <span>Tổng kết quá trình thực tập</span>
                </li>
              </ul>
            </div>
          </SwiperSlide>

          {/* SLIDE 3: ROLES */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-col justify-center bg-slate-50 px-16 md:px-24 lg:px-32 py-8 overflow-y-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-[#1868DB] mb-8 text-center">
                1. Các vị trí chính mảng Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Business Analyst (BA)</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Đi sâu vào việc trao đổi với các bên liên quan để nắm bắt nhu cầu kinh doanh. Chuyển đổi từ ngôn ngữ kinh doanh sang kỹ thuật qua tài liệu BRD.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-purple-500 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Data Engineer (DE)</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Xây dựng luồng dữ liệu (ETL), làm sạch từ hệ thống Oracle đổ vào kho Data Mart nhằm tối ưu hóa truy vấn.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Data Analyst (DA)</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Phân tách dữ liệu Fact/Dimension, thiết kế Data Model, viết hàm DAX và trực quan giao diện báo cáo BI.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-rose-500 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Tester (Kiểm thử viên)</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Xây dựng kịch bản kiểm thử (SIT, UAT), đối chiếu số liệu báo cáo với dữ liệu gốc, đảm bảo logic nghiệp vụ không bị sai lệch.</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 4: ĐỌC HIỂU */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-col justify-center bg-white px-16 md:px-24 lg:px-32 py-8 overflow-y-auto">
              <h2 className="text-2xl md:text-4xl font-bold text-[#1868DB] mb-8">
                2. Các bước thực hiện - Đọc hiểu tài liệu
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <h4 className="text-xl font-bold text-[#1868DB] mb-2">Hiểu & Làm gì?</h4>
                  <p className="text-slate-700 leading-relaxed">Nắm bắt quy mô doanh nghiệp. Đọc tài liệu đặc tả hệ thống, khám phá cấu trúc dữ liệu thô. Tìm hiểu quy trình làm việc chuẩn từ khâu thu thập yêu cầu đến nghiệm thu.</p>
                </div>
                <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <h4 className="text-xl font-bold text-rose-600 mb-2">Khó khăn gặp phải</h4>
                  <p className="text-slate-700 leading-relaxed">Gặp rào cản thuật ngữ chuyên ngành và luồng quy trình phức tạp. Bỡ ngỡ khi tiếp cận tài liệu BRD, chuẩn mực kiểm thử SIT/UAT thực tế.</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 5: DATA DICTIONARY */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-slate-50 overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-slate-50 overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.2. Xây dựng Data Dictionary</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Hiểu & Làm gì?</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Định nghĩa toàn bộ siêu dữ liệu (tên trường, kiểu dữ liệu, ý nghĩa nghiệp vụ, logic) giúp dự án có chung cách hiểu. Quét toàn bộ file trong Data Mart để ghi chép.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-600 text-base">Khó khăn & Giải pháp</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Số lượng trường đồ sộ, tên viết tắt phức tạp.<br/><br/><strong className="text-emerald-600 font-semibold">Giải pháp:</strong> Ứng dụng mạnh mẽ AI tự động trích xuất và giải nghĩa, rút ngắn hàng giờ làm thủ công.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-white relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <DataDictionaryPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 6: BRD */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-white overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-white overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.3. Xây dựng BRD</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Hiểu & Làm gì?</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">BRD là bản thiết kế logic của báo cáo (trang, biểu đồ, chiều phân tích, chỉ số). Đối chiếu Data Dictionary và nhu cầu để xác định công thức toán học.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-600 text-base">Khó khăn</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Dữ liệu lớn đi kèm logic tính toán chỉ tiêu phức tạp. Việc dịch từ yêu cầu kinh doanh trừu tượng sang logic cụ thể đo lường được là một thách thức lớn đòi hỏi tư duy phân tích sâu.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-slate-50 relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <BrdPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 7: DATA MODEL */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-slate-50 overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-slate-50 overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.4. Xây dựng Data Model</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Hiểu & Làm gì?</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Tổ chức lại dữ liệu thành <strong>19 bảng DWH</strong> (7 Fact/Datamart và 12 Dimension) theo mô hình lai Star & Snowflake Schema. Thiết lập chuẩn hóa <strong>27 mối quan hệ</strong> (26 Active, 1 Inactive) với lực lượng 100% Many-to-One (*..1) và hướng lọc Single Direction trong Power BI.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-600 text-base">Khó khăn & Giải pháp</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Tránh lỗi quan hệ đa trị (N-N) và xung đột đa đường dẫn (Ambiguous Relationship). Đặt liên kết DIM_DATE(Year) ➔ DIM_YEAR(Value) ở trạng thái Inactive để bảo vệ luồng phân cấp Date ➔ Month ➔ Year, đảm bảo dữ liệu tính toán chính xác tuyệt đối.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-white relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <DataModelPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 8: DASHBOARD BI */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-white overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-white overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.5. Xây dựng Báo cáo BI</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Hiểu & Làm gì?</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Hiện thực hóa tài liệu BRD thành sản phẩm trực quan sinh động. Kéo thả biểu đồ, định dạng giao diện chuyên nghiệp, viết hàm DAX tạo chỉ số động.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-600 text-base">Khó khăn</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Số lượng biểu đồ quá nhiều dễ gây rối mắt. Kết hợp các hàm DAX phức tạp đôi khi làm giảm tốc độ tải của báo cáo.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-slate-50 relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <DashboardPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 9: KIỂM THỬ UAT */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-slate-50 overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-slate-50 overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.6. Kiểm thử Báo cáo (UAT)</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Hiểu & Làm gì?</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Xây dựng bộ 62 kịch bản kiểm thử UAT/SIT bao phủ 5 phân hệ báo cáo. Viết các câu lệnh SQL truy vấn trực tiếp từ Kho DWH để đối chiếu số liệu với Power BI (Doanh thu, Thuế, Đơn hàng, Tuổi nợ, KPI).</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-600 text-base">Kết quả & Bằng chứng</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Toàn bộ 62/62 Test cases đạt Thành công (Pass 100%), 25 ca trọng yếu đạt chuẩn Go-Live. Phương sai đối soát Variance = 0, đảm bảo độ tin cậy tuyệt đối.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-white relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <TestingPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 10: MACHINE LEARNING */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-white overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-white overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.7. Phân hệ Machine Learning</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Mục tiêu</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Mở rộng khả năng của kho dữ liệu bằng cách ứng dụng AI/ML để phân tích sâu, dự báo tương lai thay vì chỉ nhìn vào dữ liệu lịch sử.</p>
                  </div>
                  <ul className="space-y-3 text-slate-700 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1868DB] mt-0.5">•</span>
                      <span>Dự báo doanh thu & sản lượng chuỗi thời gian (XGBoost, CatBoost).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1868DB] mt-0.5">•</span>
                      <span>Phân cụm khách hàng RFM (K-Means).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1868DB] mt-0.5">•</span>
                      <span>Mô hình cảnh báo sớm khách hàng có nguy cơ rời bỏ.</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-slate-50 relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <MachineLearningPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 11: CHATBOT AI */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-row bg-slate-50 overflow-hidden">
              <div className="w-[340px] lg:w-[380px] xl:w-[420px] shrink-0 h-full pl-16 pr-6 py-8 flex flex-col justify-center border-r border-slate-200 bg-slate-50 overflow-y-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1868DB] mb-6">2.8. Trợ lý AI Tra cứu DWH</h2>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Tri thức DWH & RAG</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Tích hợp toàn bộ tài liệu đặc tả, từ điển dữ liệu 19 bảng và logic chỉ tiêu vào mô hình AI Google Gemini. Cho phép người dùng tra cứu nhanh chóng qua ngôn ngữ tự nhiên.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1868DB] text-base">Khả năng hỗ trợ</h4>
                    <p className="text-slate-600 mt-2 leading-relaxed text-sm">Giải đáp ý nghĩa trường dữ liệu, gợi ý câu lệnh DAX/SQL đối soát và tóm tắt nhanh tình hình doanh thu, công nợ mọi lúc mọi nơi.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full min-w-0 pr-14 pl-2 py-4 overflow-y-auto swiper-no-swiping bg-white relative border-l border-slate-200 shadow-inner pb-20">
                <div className="w-full min-h-full">
                  <ChatbotRagPage />
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* SLIDE 12: KẾT LUẬN */}
          <SwiperSlide className="h-full">
            <div className="w-full h-full flex flex-col justify-center bg-slate-50 px-16 md:px-24 lg:px-32 py-8 overflow-y-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1868DB] mb-8 text-center">
                3. Tổng kết quá trình thực tập
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition-transform">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Kiến thức chuyên môn</h3>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">Nắm vững toàn bộ vòng đời dự án BI: từ phân tích nghiệp vụ, lập tài liệu, mô hình hóa đến trực quan hóa và kiểm thử. Hiểu sâu sắc sự cần thiết của tài liệu lưu trữ.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 text-center hover:-translate-y-1 transition-transform">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Xử lý dữ liệu</h3>
                  <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">Rèn luyện tư duy phân tích dữ liệu quy mô doanh nghiệp. Tăng cường khả năng xử lý, mô hình hóa những tập dữ liệu lớn, phức tạp và đôi khi thiếu đồng nhất.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border-[#1868DB]/30 bg-blue-50/20 text-center hover:-translate-y-1 transition-transform">
                  <div className="w-14 h-14 bg-[#1868DB] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h3 className="text-lg font-bold text-[#1868DB] mb-2">Công nghệ & AI</h3>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">Làm chủ Power BI, DAX. Đặc biệt, tận dụng cực kỳ hiệu quả trợ lý AI để giải quyết dữ liệu, tối ưu hóa năng suất gấp nhiều lần phương pháp thủ công.</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </div>

    </div>
  );
}
