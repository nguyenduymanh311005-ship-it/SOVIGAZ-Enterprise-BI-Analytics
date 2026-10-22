// Dữ liệu 5 Dashboard trích xuất trực tiếp từ Dash.pbix (Sovigaz Power BI Enterprise Model)

export const powerBiMetadata = {
  fileName: "Dash.pbix",
  fileSize: "14.1 MB",
  lastModified: "10/2026",
  canvasSize: "1280 x 1800 px",
  totalSections: 5,
  totalVisuals: 84,
  totalMeasures: 56,
  sourceModel: "Sovigaz Enterprise Data Warehouse (SQL Server)",
  description: "Bộ 5 báo cáo quản trị BI chính thức được đóng gói trong tệp Dash.pbix, thiết kế theo chuẩn nhận diện thương hiệu Sovigaz, tích hợp hệ thống 56 DAX measures và phân quyền bảo mật RLS."
};

export const powerBiDashboards = [
  {
    id: "doanh-thu",
    sectionId: "420c5a705987ed3dd79d",
    index: 0,
    name: "Doanh thu",
    title: "Dashboard 1: Tổng quan Doanh thu Toàn công ty",
    badge: "Báo cáo Điều hành",
    targetUsers: "Ban Tổng Giám đốc, Giám đốc Kinh doanh",
    description: "Cung cấp bức tranh toàn diện về doanh số bán hàng thực tế qua các năm, phân tích xu hướng tăng trưởng theo chuỗi thời gian, cơ cấu sản phẩm và nhóm khách hàng trọng điểm.",
    slicers: ["Năm tài chính (2023 - 2026)", "Tháng / Quý", "Nhóm khách hàng", "Chi nhánh / Xí nghiệp"],
    kpis: [
      { label: "Doanh thu Thực tế", value: "430.7 Tỷ đ", sub: "Lũy kế năm gần nhất", change: "+8.4% YoY" },
      { label: "Tổng Đơn hàng", value: "228,581", sub: "Giao dịch bán hàng thành công", change: "+12.1%" },
      { label: "Doanh thu Bình quân Đơn", value: "1.88 Tr đ", sub: "Bình quân trên mỗi phiếu xuất", change: "+3.2%" },
      { label: "Khách hàng Hoạt động", value: "1,359", sub: "Đối tác giao dịch thường xuyên", change: "Ổn định" }
    ],
    visuals: [
      {
        id: "vis_1",
        title: "DOANH THU VÀ SỐ ĐƠN HÀNG THEO TỪNG THÁNG",
        type: "lineStackedColumnComboChart",
        desc: "Biểu đồ kết hợp cột thể hiện doanh thu và đường thể hiện số lượng đơn hàng qua 12 tháng.",
        measure: "[Doanh thu thực tế], [Số đơn hàng]"
      },
      {
        id: "vis_2",
        title: "DOANH THU THEO NHÓM VẬT TƯ / HÀNG HÓA",
        type: "columnChart",
        desc: "Phân bổ doanh số giữa 21 nhóm sản phẩm chủ lực: Oxy khí, Oxy lỏng, Nitơ, Argon, CO2, Que hàn.",
        measure: "SUM(ReceiptAmount - VATAmount) ALLEXCEPT(Dim_ProductGroup)"
      },
      {
        id: "vis_3",
        title: "DOANH THU THEO TỪNG THÁNG CỦA NHÓM KHÁCH HÀNG",
        type: "clusteredColumnChart",
        desc: "So sánh biến động doanh thu giữa nhóm Bệnh viện, Đại lý phân phối, Nhà máy thép và Cơ khí.",
        measure: "[Doanh thu thực tế] by Dim_CustomerGroup"
      },
      {
        id: "vis_4",
        title: "DOANH THU THEO NHÓM KHÁCH HÀNG",
        type: "donutChart",
        desc: "Tỷ trọng đóng góp doanh thu của từng khối khách hàng trên tổng doanh số toàn công ty.",
        measure: "DIVIDE([Doanh thu nhóm KH], [Doanh thu thực tế], 0)"
      },
      {
        id: "vis_5",
        title: "DOANH THU THEO XÍ NGHIỆP",
        type: "donutChart",
        desc: "Tỷ trọng doanh số giữa Xí nghiệp Oxy Bình Dương, Biên Hòa, Cần Thơ, Đà Nẵng và Trụ sở chính.",
        measure: "[Doanh thu thực tế] by Dim_Branch"
      },
      {
        id: "vis_6",
        title: "DOANH THU THEO THÁNG CỦA TỪNG XÍ NGHIỆP",
        type: "clusteredColumnChart",
        desc: "Ma trận so sánh hiệu quả kinh doanh hàng tháng giữa các chi nhánh sản xuất thành viên.",
        measure: "[Doanh thu thực tế] by Dim_Date[Month], Dim_Branch"
      }
    ],
    daxFormulas: [
      {
        name: "Doanh thu thực tế",
        code: "SUM('DM_RevenueBySaleLedger'[ReceiptAmount]) - SUM('DM_RevenueBySaleLedger'[VATAmount])"
      },
      {
        name: "Lũy kế doanh thu (YTD)",
        code: "TOTALYTD([Doanh thu thực tế], 'Dim_Date'[Date])"
      },
      {
        name: "% Doanh thu so với cùng kỳ",
        code: "DIVIDE([Lũy kế doanh thu], CALCULATE([Lũy kế doanh thu], SAMEPERIODLASTYEAR('Dim_Date'[Date])), 0)"
      }
    ]
  },
  {
    id: "doanh-thu-chi-tiet",
    sectionId: "ae902aeba005b4600d21",
    index: 1,
    name: "Doanh thu chi tiết",
    title: "Dashboard 2: Phân tích Chi tiết Doanh thu & Hóa đơn",
    badge: "Báo cáo Tác nghiệp",
    targetUsers: "Phòng Kế toán Bán hàng, Trưởng phòng Kinh doanh",
    description: "Cho phép rà soát chi tiết đến từng hóa đơn chứng từ, mặt hàng và khách hàng cụ thể; hỗ trợ đối soát số liệu kế toán và phân tích đa chiều sản phẩm.",
    slicers: ["Năm", "Kỳ kế toán (Tháng)", "Mã sản phẩm / Nhóm hàng", "Mã khách hàng"],
    kpis: [
      { label: "Tổng Hóa đơn Xuất", value: "28,450", sub: "Chứng từ hóa đơn điện tử", change: "+5.6%" },
      { label: "Sản phẩm Giao dịch", value: "21 Nhóm", sub: "Quy chuẩn theo đơn vị DVC", change: "100% chuẩn hóa" },
      { label: "Thuế GTGT Phát sinh", value: "38.7 Tỷ đ", sub: "Thuế VAT đầu ra nộp NSNN", change: "Khớp sổ cái" },
      { label: "Hóa đơn Hủy / Điều chỉnh", value: "< 0.12%", sub: "Tỷ lệ sai sót hóa đơn", change: "Đạt chuẩn ISO" }
    ],
    visuals: [
      {
        id: "vis_dtct_1",
        title: "CHI TIẾT DOANH THU THEO MẶT HÀNG",
        type: "tableEx",
        desc: "Bảng phân tích chi tiết sản lượng xuất bán, đơn giá bình quân, thành tiền và chiết khấu theo từng mã hàng.",
        measure: "[Sản lượng], [Đơn giá TB], [Doanh thu thuần]"
      },
      {
        id: "vis_dtct_2",
        title: "CHI TIẾT DOANH THU THEO KHÁCH HÀNG",
        type: "tableEx",
        desc: "Xếp hạng doanh thu tích lũy của từng khách hàng, số lượng đơn mua và tần suất giao dịch.",
        measure: "[Doanh thu thực tế], [Số đơn hàng] by Dim_Customer"
      },
      {
        id: "vis_dtct_3",
        title: "CHI TIẾT HÓA ĐƠN BÁN HÀNG",
        type: "tableEx",
        desc: "Bảng kê chi tiết từng số hóa đơn: Ngày lập, Khách hàng, Diễn giải, Tiền hàng, Thuế GTGT và Tổng thanh toán.",
        measure: "Fact_SaleLedger detail rows"
      },
      {
        id: "vis_dtct_4",
        title: "CHI TIẾT DOANH THU THEO TỪNG NHÓM VÀ SẢN PHẨM",
        type: "pivotTable",
        desc: "Ma trận phân cấp đa tầng (Drill-down) từ Nhóm sản phẩm -> Dòng sản phẩm -> Quy cách đóng chai/bồn.",
        measure: "Matrix hierarchy: Group -> SubGroup -> SKU"
      }
    ],
    daxFormulas: [
      {
        name: "Doanh thu bình quân mỗi đơn",
        code: "DIVIDE([Doanh thu thực tế], DISTINCTCOUNT('DM_RevenueBySaleLedger'[VoucherNo]), 0)"
      },
      {
        name: "Thuế GTGT phát sinh",
        code: "SUM('DM_RevenueBySaleLedger'[VATAmount])"
      }
    ]
  },
  {
    id: "cong-no",
    sectionId: "79da689b7de518c09147",
    index: 2,
    name: "Công nợ",
    title: "Dashboard 3: Quản trị Tuổi nợ & Thu hồi Công nợ Khách hàng",
    badge: "Báo cáo Tài chính",
    targetUsers: "Kế toán trưởng, Giám đốc Tài chính, Chuyên viên Thu hồi Nợ",
    description: "Giám sát số dư công nợ phải thu (TK 131), cơ cấu tuổi nợ trước hạn vs quá hạn, phân tích mức độ tập trung nợ nhằm ngăn ngừa rủi ro nợ khó đòi.",
    slicers: ["Năm", "Thời điểm chốt sổ", "Nhóm khách hàng", "Chi nhánh ghi nhận nợ"],
    kpis: [
      { label: "Tổng Dư nợ Phải thu", value: "56.58 Tỷ đ", sub: "Tài khoản 131 (584 đối tác nợ)", change: "Khớp 100% FAST" },
      { label: "Nợ Trong hạn / Trước hạn", value: "32.90 Tỷ đ", sub: "Chiếm 58.1% tổng công nợ", change: "Luân chuyển tốt" },
      { label: "Nợ Quá hạn", value: "23.69 Tỷ đ", sub: "Chiếm 41.9% tổng công nợ", change: "Cần siết chặt" },
      { label: "Nợ Quá hạn > 60 Ngày", value: "7.05 Tỷ đ", sub: "Bao gồm 3.67 tỷ nợ > 1 năm", change: "Nguy cơ cao" }
    ],
    visuals: [
      {
        id: "vis_cn_1",
        title: "CÔNG NỢ THEO TỪNG NHÓM KHÁCH HÀNG",
        type: "clusteredColumnChart",
        desc: "So sánh quy mô nợ giữa nhóm Bệnh viện Công lập, Doanh nghiệp cơ khí lớn và Đại lý bán lẻ.",
        measure: "[Tổng dư nợ] by Dim_CustomerGroup"
      },
      {
        id: "vis_cn_2",
        title: "PHÂN TÍCH CÔNG NỢ TỔNG THỂ",
        type: "clusteredColumnChart",
        desc: "Biểu đồ phân rã cơ cấu công nợ theo các nấc tuổi nợ từ 0-30 ngày, 31-60 ngày, 61-90 ngày và > 90 ngày.",
        measure: "[Nợ trước hạn], [Nợ quá hạn]"
      },
      {
        id: "vis_cn_3",
        title: "PHÂN TÍCH NỢ TRƯỚC HẠN",
        type: "clusteredBarChart",
        desc: "Thanh đo lượng tiền hàng gối đầu đang trong thời hạn tín dụng cho phép theo từng đơn vị.",
        measure: "[Nợ không quá hạn]"
      },
      {
        id: "vis_cn_4",
        title: "PHÂN TÍCH NỢ QUÁ HẠN",
        type: "clusteredBarChart",
        desc: "Đo lường mức độ nghiêm trọng của các khoản nợ quá hạn theo từng cấp độ ngày trễ.",
        measure: "[Nợ quá hạn trên 60 ngày]"
      },
      {
        id: "vis_cn_5",
        title: "CHI TIẾT CÔNG NỢ THEO KHÁCH HÀNG",
        type: "tableEx",
        desc: "Bảng dữ liệu chi tiết danh sách khách hàng: Mã KH, Tên đối tác, Tổng nợ, Nợ trong hạn, Nợ quá hạn, Hạn mức tín dụng và Đề xuất thu hồi.",
        measure: "Fact_DebtDetail by Customer"
      }
    ],
    daxFormulas: [
      {
        name: "Tổng dư nợ phải thu",
        code: "SUM('Fact_CustomerDebt'[ClosingDebtAmount])"
      },
      {
        name: "Nợ không quá hạn",
        code: "CALCULATE([Tổng dư nợ], 'Fact_CustomerDebt'[OverdueDays] <= 0)"
      },
      {
        name: "Nợ quá hạn trên 60 ngày",
        code: "CALCULATE([Tổng dư nợ], 'Fact_CustomerDebt'[OverdueDays] > 60)"
      }
    ]
  },
  {
    id: "kpi",
    sectionId: "dd7a8b3705166ed7ee30",
    index: 3,
    name: "KPI",
    title: "Dashboard 4: Đo lường Thực hiện Kế hoạch KPI (A3)",
    badge: "Báo cáo Điều hành Chiến lược",
    targetUsers: "Hội đồng Quản trị, Ban Giám đốc, Trưởng phòng Kế hoạch Sản xuất",
    description: "Hệ thống bảng điều khiển đo lường 3 tầng KPI (Năm, Tháng, Lũy kế) đối soát chính xác chỉ tiêu kế hoạch A3 với số liệu sản xuất và doanh thu thực tế.",
    slicers: ["Năm kế hoạch", "Tháng báo cáo", "Chi nhánh / Xí nghiệp", "Khối sản phẩm"],
    kpis: [
      { label: "Hoàn thành KHDT Năm", value: "92.4%", sub: "430.7 tỷ / 466.1 tỷ Kế hoạch", change: "Đạt mục tiêu" },
      { label: "Hoàn thành KHSX Năm", value: "94.8%", sub: "384.2 tỷ / 405.3 tỷ Kế hoạch", change: "Tích cực" },
      { label: "Hoàn thành KPI Tháng", value: "98.1%", sub: "36.2 tỷ Doanh thu tháng", change: "+2.4% MoM" },
      { label: "Lũy kế YTD so Cùng kỳ", value: "108.4%", sub: "Tăng trưởng so với cùng kỳ năm trước", change: "+8.4%" }
    ],
    visuals: [
      {
        id: "vis_kpi_1",
        title: "DOANH THU VÀ KPI THEO THÁNG",
        type: "lineClusteredColumnComboChart",
        desc: "So sánh đối chiếu Doanh thu thực tế vs Chỉ tiêu KPI Doanh thu tháng qua 12 kỳ kế toán.",
        measure: "[Doanh thu thực tế], [KPI Doanh thu]"
      },
      {
        id: "vis_kpi_2",
        title: "DOANH THU VÀ KPI THEO CHI NHÁNH",
        type: "lineClusteredColumnComboChart",
        desc: "Đo lường tiến độ hoàn thành chỉ tiêu doanh thu của từng xí nghiệp thành viên.",
        measure: "[Doanh thu thực tế], [KPI Doanh thu] by Dim_Branch"
      },
      {
        id: "vis_kpi_3",
        title: "DOANH THU VÀ KPI THEO NHÓM SẢN PHẨM",
        type: "clusteredColumnChart",
        desc: "Tỷ lệ thực hiện chỉ tiêu theo nhóm sản phẩm: Khí hóa lỏng, Khí nén chai, Que hàn và Dịch vụ.",
        measure: "[Doanh thu thực tế], [KPI Doanh thu] by ProductGroup"
      },
      {
        id: "vis_kpi_4",
        title: "TỈ LỆ ĐÓNG GÓP DOANH THU THEO TỪNG CHI NHÁNH",
        type: "pieChart",
        desc: "Cơ cấu tỷ trọng doanh thu thực hiện giữa các xí nghiệp trực thuộc.",
        measure: "DIVIDE([Doanh thu chi nhánh], [Doanh thu tổng], 0)"
      },
      {
        id: "vis_kpi_5",
        title: "TỈ LỆ ĐÓNG GÓP DOANH THU THEO TỪNG NHÓM SẢN PHẨM",
        type: "pieChart",
        desc: "Cơ cấu tỷ trọng đóng góp của từng nhóm mặt hàng trong tổng doanh số toàn công ty.",
        measure: "DIVIDE([Doanh thu nhóm], [Doanh thu tổng], 0)"
      }
    ],
    daxFormulas: [
      {
        name: "Tỷ lệ hoàn thành KPI Doanh thu tháng",
        code: "DIVIDE([Doanh thu thực tế], [KPI Doanh thu], 0)"
      },
      {
        name: "% Hoàn thành KHDT năm",
        code: "DIVIDE([Lũy kế doanh thu], [Kế hoạch doanh thu năm], 0)"
      },
      {
        name: "% Hoàn thành KHSX năm",
        code: "DIVIDE([Lũy kế giá trị sản xuất], [Kế hoạch sản xuất năm], 0)"
      }
    ]
  },
  {
    id: "kpi-chi-tiet",
    sectionId: "dd076e605ad0708360a8",
    index: 4,
    name: "KPI Chi tiết",
    title: "Dashboard 5: Sức khỏe Tài chính & Kế hoạch Chi tiết Xí nghiệp",
    badge: "Báo cáo Quản trị Chuyên sâu",
    targetUsers: "Ban Kế hoạch Sản xuất, Giám đốc Xí nghiệp thành viên",
    description: "Bảng ma trận chỉ tiêu chuyên sâu phân rã kế hoạch theo từng đơn vị thành viên, đánh giá sức khỏe tài chính và theo dõi thực hiện theo nhóm sản phẩm và loại dịch vụ.",
    slicers: ["Năm tài chính", "Tháng báo cáo", "Chi nhánh thành viên", "Loại dịch vụ"],
    kpis: [
      { label: "Tổng Đơn vị Đo lường", value: "5 Xí nghiệp", sub: "Mạng lưới sản xuất toàn quốc", change: "100% kết nối" },
      { label: "Kế hoạch Doanh thu Năm", value: "466.1 Tỷ đ", sub: "Tổng chỉ tiêu giao Hội đồng QT", change: "Chỉ tiêu chính thức" },
      { label: "Kế hoạch Sản xuất Năm", value: "405.3 Tỷ đ", sub: "Giá trị sản lượng quy chuẩn", change: "Biểu mẫu A3" },
      { label: "Chỉ số Sức khỏe Tài chính", value: "Khả quan", sub: "Tỷ suất hoàn thành > 90%", change: "Đạt định mức" }
    ],
    visuals: [
      {
        id: "vis_kpict_1",
        title: "KẾ HOẠCH DOANH THU NĂM CHO TỪNG CHI NHÁNH",
        type: "pivotTable",
        desc: "Ma trận chỉ tiêu doanh thu giao đầu năm và tiến độ thực hiện theo từng tháng của các xí nghiệp.",
        measure: "[Kế hoạch doanh thu năm] by Dim_Branch, Dim_Date"
      },
      {
        id: "vis_kpict_2",
        title: "KẾ HOẠCH DOANH THU NĂM CHO TỪNG SẢN PHẨM",
        type: "pivotTable",
        desc: "Ma trận kế hoạch sản lượng và doanh thu phân rã chi tiết cho từng dòng sản phẩm khí và que hàn.",
        measure: "[Kế hoạch doanh thu năm] by ProductGroup"
      },
      {
        id: "vis_kpict_3",
        title: "SỨC KHỎE TÀI CHÍNH THEO CHI NHÁNH (LỌC THEO THÁNG)",
        type: "pivotTable",
        desc: "Đo lường tổng hợp: Doanh thu thực tế, Chi phí, Công nợ quá hạn và Tỷ suất đóng góp dòng tiền của chi nhánh.",
        measure: "Multi-metric branch financial health score"
      },
      {
        id: "vis_kpict_4",
        title: "BẢNG KPI THEO SẢN PHẨM",
        type: "pivotTable",
        desc: "Bảng kê so sánh Sản lượng kế hoạch vs Sản lượng thực hiện theo đơn vị chuẩn (DVC).",
        measure: "[Giá trị sản xuất thực tế], [Kế hoạch sản xuất]"
      },
      {
        id: "vis_kpict_5",
        title: "BÁO CÁO DOANH THU THEO LOẠI DỊCH VỤ",
        type: "pivotTable",
        desc: "Phân tích doanh số dịch vụ vận tải khí bồn chuyên dụng, cho thuê vỏ bình và kiểm định an toàn áp lực.",
        measure: "[Doanh thu thực tế] by ServiceType"
      }
    ],
    daxFormulas: [
      {
        name: "KPI Doanh thu sản phẩm",
        code: "SUM('FACT_KPI_BY_PRODUCT'[AMOUNT])"
      },
      {
        name: "% Giá trị sản xuất thực tế",
        code: "DIVIDE([Giá trị sản xuất thực tế], [KPI Giá trị sản xuất], 0)"
      }
    ]
  }
];
