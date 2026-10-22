// Machine Learning Project Data - SOVIGAZ DWH & BI Platform
// Extracted and audited from SOVIGAZ_ML research artifacts & unit tests (71/71 PASS)

export const mlExecutiveSummary = {
  title: "Phân hệ Machine Learning & Trí tuệ Dự báo",
  subtitle: "Triển khai thực nghiệm 3 Bài toán Trọng tâm: Dự báo Khí, Dự báo Rời bỏ & Rủi ro Tín dụng",
  dataScope: "228,581 dòng giao dịch bán hàng (01/2023 – 06/2026), 1,359 khách hàng, 19 bảng DWH",
  auditStatus: "Toàn bộ Unit Tests PASS",
  keyMetrics: [
    {
      label: "Sai số Doanh thu Tháng (WAPE)",
      value: "6.05%",
      sub: "Mô hình XGBoost (Test 5 tháng 2026)",
      highlight: true,
      color: "emerald"
    },
    {
      label: "Năng lực Phân loại Rời bỏ (ROC-AUC)",
      value: "0.821",
      sub: "CatBoostClassifier (PR-AUC: 0.780)",
      highlight: true,
      color: "blue"
    },
    {
      label: "Tỷ trọng Doanh thu Nhóm VIP",
      value: "92.09%",
      sub: "334 khách hàng Key Industrial Accounts (~322.2 tỷ)",
      highlight: false,
      color: "purple"
    },
    {
      label: "Độ chính xác Cảnh báo Churn VIP",
      value: "100%",
      sub: "15/15 khách hàng VIP báo động Critical Risk đã ngưng GD",
      highlight: true,
      color: "amber"
    }
  ]
};

export const forecastingData = {
  problemTitle: "Bài toán 1: Dự báo Doanh thu & Nhu cầu Sản lượng Khí",
  objective: "Dự báo doanh thu toàn công ty theo chu kỳ Tuần/Tháng và nhu cầu sản lượng của 3 dòng sản phẩm khí công nghiệp huyết mạch nhằm tối ưu hóa chuỗi cung ứng, điều độ bồn xe và kế hoạch sản xuất hóa lỏng.",
  targetScope: [
    {
      name: "Doanh thu Toàn Công ty (Tháng)",
      model: "XGBoost Regressor",
      testWape: "6.05%",
      testSmape: "6.67%",
      testMae: "1.59 tỷ VNĐ",
      eval: "Vượt trội, bám sát doanh thu thực tế 5 tháng đầu năm 2026."
    },
    {
      name: "Doanh thu Toàn Công ty (Tuần)",
      model: "CatBoost / LightGBM",
      testWape: "31.80%",
      testSmape: "32.77%",
      testMae: "1.88 tỷ VNĐ",
      eval: "Bắt kịp dao động ngắn hạn và thời điểm lễ Tết."
    },
    {
      name: "Nitơ lỏng (NTL-SX)",
      model: "LightGBM",
      testWape: "53.55%",
      testSmape: "65.03%",
      testMae: "134,422 m³",
      eval: "Cải thiện rõ nét so với Seasonal Naive (82.26%)."
    },
    {
      name: "Oxy khí chai (OXK6)",
      model: "Moving Average / CatBoost",
      testWape: "26.86%",
      testSmape: "30.27%",
      testMae: "15,588 chai",
      eval: "Dự báo ổn định nhờ nhu cầu tiêu thụ khí chai đều đặn."
    },
    {
      name: "Oxy lỏng (OXL-SX)",
      model: "Seasonal Naive / CatBoost",
      testWape: "44.36%",
      testSmape: "42.16%",
      testMae: "362,223 m³",
      eval: "Dự báo nhu cầu bồn phân phối cho các xí nghiệp lớn."
    }
  ],
  monthlyTestComparison: [
    {
      month: "01/2026",
      actualVnd: 27713426161,
      forecastVnd: 28628535000,
      diffVnd: -915108839,
      errorPct: "+3.30%",
      notes: "Doanh thu đầu năm duy trì cao trước kỳ nghỉ Tết"
    },
    {
      month: "02/2026 (Tết)",
      actualVnd: 18884051133,
      forecastVnd: 23233384000,
      diffVnd: -4349332867,
      errorPct: "+23.03%",
      notes: "Tháng trũng sâu do toàn bộ nhà máy nghỉ Tết Nguyên Đán"
    },
    {
      month: "03/2026",
      actualVnd: 29231817039,
      forecastVnd: 28054972000,
      diffVnd: 1176845039,
      errorPct: "-4.03%",
      notes: "Sản xuất phục hồi mạnh mẽ sau kỳ nghỉ lễ"
    },
    {
      month: "04/2026",
      actualVnd: 28038686459,
      forecastVnd: 28346075000,
      diffVnd: -307388541,
      errorPct: "+1.10%",
      notes: "Độ chính xác xuất sắc, sai lệch thực tế chỉ 1.1%"
    },
    {
      month: "05/2026",
      actualVnd: 27447018428,
      forecastVnd: 28640094000,
      diffVnd: -1193075572,
      errorPct: "+4.35%",
      notes: "Mô hình duy trì độ tin cậy cao trên chuỗi thời gian"
    }
  ],
  modelBenchmarkTable: [
    {
      model: "XGBoost Regressor",
      type: "Machine Learning (Tháng)",
      valWape: "8.63%",
      testWape: "6.05%",
      testSmape: "6.67%",
      testMae: "1.59 tỷ VNĐ",
      status: "CHỌN (Tối ưu Cấp Tháng)"
    },
    {
      model: "CatBoost Regressor",
      type: "Machine Learning (Tuần)",
      valWape: "27.10%",
      testWape: "31.80%",
      testSmape: "32.77%",
      testMae: "1.88 tỷ VNĐ",
      status: "CHỌN (Tối ưu Cấp Tuần)"
    },
    {
      model: "LightGBM Regressor",
      type: "Machine Learning (Tuần/Nitơ)",
      valWape: "24.63%",
      testWape: "37.21%",
      testSmape: "37.03%",
      testMae: "2.20 tỷ VNĐ",
      status: "ỨNG VIÊN XUẤT SẮC"
    },
    {
      model: "Seasonal Naive (lag 52)",
      type: "Baseline Mùa vụ Tuần",
      valWape: "41.10%",
      testWape: "46.20%",
      testSmape: "44.15%",
      testMae: "2.73 tỷ VNĐ",
      status: "BASELINE ĐỐI CHỨNG"
    },
    {
      model: "Naive (lag 1)",
      type: "Baseline Bước trước",
      valWape: "47.41%",
      testWape: "52.30%",
      testSmape: "49.80%",
      testMae: "3.10 tỷ VNĐ",
      status: "BASELINE ĐỐI CHỨNG"
    }
  ],
  figures: [
    {
      id: "monthly_revenue",
      title: "Đối chiếu Thực tế vs Dự báo Doanh thu Tháng (XGBoost)",
      src: "/assets/ml/02_actual_vs_forecast_revenue_monthly.png",
      caption: "Mô hình XGBoost dự báo chính xác xu hướng doanh thu hàng tháng năm 2026 với WAPE chỉ 6.05%."
    },
    {
      id: "weekly_revenue",
      title: "Đối chiếu Doanh thu Tuần & Khoảng tin cậy (CatBoost)",
      src: "/assets/ml/01_actual_vs_forecast_revenue_weekly.png",
      caption: "Dự báo tuần qua 23 tuần năm 2026 phản ánh độ biến thiên sản lượng và sụt giảm sâu dịp Tết."
    },
    {
      id: "weekly_comparison",
      title: "So sánh Hiệu năng WAPE các Mô hình Tuần",
      src: "/assets/ml/07_weekly_model_comparison_wape.png",
      caption: "Cả 3 mô hình học máy (CatBoost, LightGBM, XGBoost) đều vượt trội hoàn toàn so với Baseline cổ điển."
    },
    {
      id: "demand_ntl",
      title: "Dự báo Nhu cầu Sản lượng Nitơ lỏng (NTL-SX)",
      src: "/assets/ml/04_actual_vs_forecast_ntl_sx.png",
      caption: "Mô hình LightGBM nắm bắt biến động tiêu thụ Nitơ lỏng tại các khu công nghiệp."
    },
    {
      id: "demand_oxk6",
      title: "Dự báo Nhu cầu Sản lượng Oxy chai (OXK6)",
      src: "/assets/ml/05_actual_vs_forecast_oxk6.png",
      caption: "Dự báo sản lượng bình khí Oxy chai tiêu chuẩn phục vụ các xưởng cơ khí và bệnh viện (WAPE 26.86%)."
    },
    {
      id: "demand_oxl",
      title: "Dự báo Nhu cầu Sản lượng Oxy lỏng (OXL-SX)",
      src: "/assets/ml/03_actual_vs_forecast_oxl_sx.png",
      caption: "Dự báo sản lượng Oxy lỏng bơm nạp bồn công nghiệp (WAPE 44.36%)."
    }
  ]
};

export const churnSegmentationData = {
  problemTitle: "Bài toán 2: Phân khúc Khách hàng & Cảnh báo Sớm Rủi ro Rời bỏ",
  objective: "Xác định chân dung 4 phân khúc khách hàng B2B theo hành vi mua hàng RFM, dự báo xác suất khách hàng rời bỏ trong 90 ngày tới và xây dựng danh sách ưu tiên can thiệp khẩn cấp bảo vệ doanh thu.",
  clusters: [
    {
      id: "cluster_2",
      clusterNumber: 2,
      name: "Key Industrial Accounts",
      vnName: "Khách hàng Trọng yếu (VIP & Hợp đồng Lớn)",
      customers: 334,
      customerPct: "24.58%",
      revenueVnd: "322.17 tỷ VNĐ",
      revenuePct: "92.09%",
      recencyMedian: "1 ngày",
      frequencyMedian: "78 đơn/năm",
      monetaryAvg: "964.6 triệu VNĐ/khách",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Nhóm khách hàng huyết mạch nắm giữ 92% doanh số công ty. Mua hàng gần như mỗi ngày, đơn hàng giá trị rất lớn.",
      actionPlan: "Chăm sóc cấp C-Level / Ban Giám đốc, ký hợp đồng cung ứng dài hạn, cam kết SLA cấp bồn xe riêng."
    },
    {
      id: "cluster_0",
      clusterNumber: 0,
      name: "Slipping / Periodic Buyers",
      vnName: "Khách hàng Suy giảm / Mua Định kỳ",
      customers: 320,
      customerPct: "23.55%",
      revenueVnd: "18.72 tỷ VNĐ",
      revenuePct: "5.35%",
      recencyMedian: "90.5 ngày",
      frequencyMedian: "9 đơn/năm",
      monetaryAvg: "58.5 triệu VNĐ/khách",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Nhóm từng có doanh thu khá nhưng đã lâu (khoảng 3 tháng) chưa phát sinh đơn mới. Tiềm ẩn nguy cơ rời bỏ cao.",
      actionPlan: "Trưởng phòng Kinh doanh kiểm tra nguyên nhân giảm mua, gửi chính sách chiết khấu kích hoạt lại."
    },
    {
      id: "cluster_1",
      clusterNumber: 1,
      name: "Active Regular Buyers",
      vnName: "Khách hàng Mua Thường xuyên Vừa & Nhỏ",
      customers: 370,
      customerPct: "27.23%",
      revenueVnd: "13.85 tỷ VNĐ",
      revenuePct: "3.96%",
      recencyMedian: "5 ngày",
      frequencyMedian: "21 đơn/năm",
      monetaryAvg: "37.4 triệu VNĐ/khách",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Nhóm đối tác mua hàng đều đặn mỗi tuần/tháng, luồng tiền ổn định, độ gắn kết thương hiệu cao.",
      actionPlan: "Duy trì quy trình giao nhận chuẩn mực, bán chéo thêm các chủng loại khí kỹ thuật khác (Argon, CO2)."
    },
    {
      id: "cluster_3",
      clusterNumber: 3,
      name: "Dormant / Low-Engagement Accounts",
      vnName: "Khách hàng Ngủ đông / Ít Tương tác",
      customers: 335,
      customerPct: "24.65%",
      revenueVnd: "-4.89 tỷ VNĐ (Điều chỉnh)",
      revenuePct: "-1.40%",
      recencyMedian: "102 ngày",
      frequencyMedian: "2 đơn/năm",
      monetaryAvg: "-14.6 triệu VNĐ/khách",
      badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
      description: "Khách hàng ngừng mua > 3 tháng hoặc chỉ phát sinh các bút toán bù trừ công nợ / vỏ chai.",
      actionPlan: "Đội thu hồi công nợ đối chiếu dứt điểm số dư nợ cũ, không tập trung chi phí bán hàng mới."
    }
  ],
  churnModelBenchmarks: [
    {
      model: "CatBoostClassifier",
      type: "Gradient Boosting",
      valRocAuc: 0.8831,
      testRocAuc: 0.8210,
      testPrAuc: 0.7796,
      testF1: 0.7151,
      testPrecision: "75.24%",
      testRecall: "68.13%",
      status: "CHỌN CHÍNH THỨC"
    },
    {
      model: "LightGBM",
      type: "Gradient Boosting",
      valRocAuc: 0.8813,
      testRocAuc: 0.8211,
      testPrAuc: 0.7821,
      testF1: 0.7168,
      testPrecision: "75.61%",
      testRecall: "68.13%",
      status: "BENCHMARK TIÊU CHUẨN"
    },
    {
      model: "Random Forest",
      type: "Ensemble Trees",
      valRocAuc: 0.8810,
      testRocAuc: 0.8194,
      testPrAuc: 0.7841,
      testF1: 0.7171,
      testPrecision: "76.24%",
      testRecall: "67.69%",
      status: "BENCHMARK TIÊU CHUẨN"
    },
    {
      model: "Logistic Regression",
      type: "Tuyến tính L2",
      valRocAuc: 0.8705,
      testRocAuc: 0.8092,
      testPrAuc: 0.7481,
      testF1: 0.6924,
      testPrecision: "71.60%",
      testRecall: "67.03%",
      status: "BENCHMARK TIÊU CHUẨN"
    },
    {
      model: "Majority Class Baseline",
      type: "Baseline Ngẫu nhiên",
      valRocAuc: 0.5000,
      testRocAuc: 0.5000,
      testPrAuc: 0.3876,
      testF1: 0.0000,
      testPrecision: "0.00%",
      testRecall: "0.00%",
      status: "BASELINE ĐỐI CHỨNG"
    }
  ],
  riskStratification: [
    {
      band: "Critical Risk (Nguy cơ tới hạn)",
      probRange: "P ≥ 80%",
      testCount: 233,
      pctShare: "19.85%",
      actualChurnRate: "87.55%",
      monetary365d: "16.20 tỷ VNĐ",
      riskBadge: "bg-red-50 text-red-700 border-red-200",
      urgency: "Khẩn cấp (SLA 24-48 giờ)"
    },
    {
      band: "High Risk (Rủi ro cao)",
      probRange: "50% ≤ P < 80%",
      testCount: 179,
      pctShare: "15.25%",
      actualChurnRate: "59.22%",
      monetary365d: "16.78 tỷ VNĐ",
      riskBadge: "bg-amber-50 text-amber-700 border-amber-200",
      urgency: "Ưu tiên cao (SLA 3-5 ngày)"
    },
    {
      band: "Medium Risk (Rủi ro trung bình)",
      probRange: "25% ≤ P < 50%",
      testCount: 151,
      pctShare: "12.86%",
      actualChurnRate: "30.46%",
      monetary365d: "11.34 tỷ VNĐ",
      riskBadge: "bg-blue-50 text-blue-700 border-blue-200",
      urgency: "Theo dõi (SLA 7-14 ngày)"
    },
    {
      band: "Low Risk (Rủi ro thấp / An toàn)",
      probRange: "P < 25%",
      testCount: 611,
      pctShare: "52.04%",
      actualChurnRate: "16.20%",
      monetary365d: "298.70 tỷ VNĐ",
      riskBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      urgency: "Chăm sóc định kỳ chuẩn"
    }
  ],
  topPriorityAccounts: [
    {
      rank: 1,
      code: "VPBV32",
      name: "Bệnh viện Đa khoa tỉnh Bình Dương",
      branch: "Văn phòng (VP)",
      priorityScore: 90.92,
      churnProb: "90.51%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "1,804,208,364",
      topDrivers: "recency_days (+0.55), quantity_90d (+0.36), active_days_90d (+0.27)",
      recencyDays: 158,
      action: "Khách hàng hợp đồng y tế lớn có dấu hiệu ngưng cấp khí; cần Ban Giám đốc gặp trực tiếp ngay.",
      sla: "24 Giờ"
    },
    {
      rank: 2,
      code: "BDNL336",
      name: "CÔNG TY TNHH AIR WATER VIỆT NAM",
      branch: "Bình Dương (BD)",
      priorityScore: 90.86,
      churnProb: "92.50%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "1,070,096,400",
      topDrivers: "recency_days (+0.60), quantity_90d (+0.39), active_days_90d (+0.26)",
      recencyDays: 118,
      action: "Đối tác mua sỉ khí hóa lỏng lớn sụt giảm 100% lượng mua trong 90 ngày; rà soát đối thủ cạnh tranh.",
      sla: "24 Giờ"
    },
    {
      rank: 3,
      code: "BHBVNHI",
      name: "Bệnh Viện Nhi Đồng Đồng Nai",
      branch: "Biên Hòa (BH)",
      priorityScore: 90.20,
      churnProb: "93.08%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "616,893,768",
      topDrivers: "recency_days (+0.65), quantity_90d (+0.39), active_days_90d (+0.27)",
      recencyDays: 135,
      action: "Tài khoản bệnh viện công ngưng lấy bình oxy 135 ngày; kiểm tra hợp đồng đấu thầu y tế mới.",
      sla: "48 Giờ"
    },
    {
      rank: 4,
      code: "PRTKPHUMOI",
      name: "CÔNG TY TNHH TM-DV THUẬN KHANG PHÚ",
      branch: "Phan Rang (PR)",
      priorityScore: 89.53,
      churnProb: "92.89%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "428,555,880",
      topDrivers: "recency_days (+0.57), quantity_90d (+0.37), active_days_90d (+0.27)",
      recencyDays: 96,
      action: "Đại lý phân phối khí khu vực Ninh Thuận ngừng nhập; Trưởng vùng cần thăm hỏi đại lý.",
      sla: "48 Giờ"
    },
    {
      rank: 5,
      code: "HPVIETUC",
      name: "CÔNG TY CỔ PHẦN VINAUSTEEL",
      branch: "Hải Phòng (HP)",
      priorityScore: 89.24,
      churnProb: "93.14%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "338,877,000",
      topDrivers: "recency_days (+0.65), quantity_90d (+0.36), active_days_90d (+0.27)",
      recencyDays: 96,
      action: "Nhà máy sản xuất thép cắt giảm tiêu thụ oxy đốt lò; phòng kinh doanh liên hệ kỹ thuật nhà máy.",
      sla: "48 Giờ"
    },
    {
      rank: 6,
      code: "BHCK68",
      name: "XÍ NGHIỆP SỬA CHỮA TÀU BIỂN",
      branch: "Biên Hòa (BH)",
      priorityScore: 89.22,
      churnProb: "92.81%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "361,682,280",
      topDrivers: "recency_days (+0.60), quantity_90d (+0.37), active_days_90d (+0.28)",
      recencyDays: 97,
      action: "Xí nghiệp đóng tàu ngưng lấy khí cắt hàn; kiểm tra tiến độ dự án đóng tàu của khách.",
      sla: "48 Giờ"
    },
    {
      rank: 7,
      code: "BDXD5A",
      name: "CÔNG TY CP TƯ VẤN XÂY DỰNG ĐIỆN 2 - CN CƠ ĐIỆN",
      branch: "Bình Dương (BD)",
      priorityScore: 88.68,
      churnProb: "90.91%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "413,567,600",
      topDrivers: "recency_days (+0.54), quantity_90d (+0.39), active_days_90d (+0.26)",
      recencyDays: 95,
      action: "Nhà thầu cơ điện công trình ngưng cấp khí; phòng bán lẻ tiếp cận chào gói thầu mới.",
      sla: "48 Giờ"
    },
    {
      rank: 8,
      code: "BHCK157",
      name: "CÔNG TY TNHH SẮT THÉP CHÂU NGỌC QUYÊN",
      branch: "Biên Hòa (BH)",
      priorityScore: 88.50,
      churnProb: "93.33%",
      riskBand: "Critical Risk (P ≥ 80%)",
      valueTier: "High Value",
      revenueVnd: "205,029,360",
      topDrivers: "recency_days (+0.69), quantity_90d (+0.32), active_days_90d (+0.27)",
      recencyDays: 105,
      action: "Khách hàng gia công cơ khí sắt thép ngừng lấy oxy chai; gửi chính sách giá khuyến mãi vỏ chai.",
      sla: "3 Ngày"
    }
  ],
  figures: [
    {
      id: "revenue_cluster",
      title: "Tỷ trọng Doanh thu theo 4 Phân khúc Khách hàng B2B",
      src: "/assets/ml/08_revenue_by_cluster.png",
      caption: "Cụm 2 (Key Accounts) chiếm tới 92.09% toàn bộ doanh thu SOVIGAZ (~322.2 tỷ VNĐ)."
    },
    {
      id: "cluster_profiles",
      title: "Hồ sơ Đặc trưng RFM & Phân bố 4 Cụm",
      src: "/assets/ml/09_cluster_profiles.png",
      caption: "Biểu diễn trực quan 3 chiều Recency, Frequency và Monetary của từng phân khúc khách hàng."
    },
    {
      id: "pca_clusters",
      title: "Không gian Biểu diễn PCA 2 Chiều Phân cụm Khách hàng",
      src: "/assets/ml/10_pca_clusters.png",
      caption: "Phân tách rõ ràng giữa nhóm khách hàng trọng yếu (màu cam), khách hàng thường xuyên (xanh lục) và suy giảm."
    },
    {
      id: "roc_curve",
      title: "Đường cong ROC & Năng lực Phân loại Churn (AUC = 0.821)",
      src: "/assets/ml/11_roc_curve.png",
      caption: "Mô hình CatBoostClassifier thể hiện độ tin cậy vượt bậc trên tập kiểm định độc lập Hold-out 2025."
    },
    {
      id: "precision_recall",
      title: "Đường cong Precision-Recall (PR-AUC = 0.780)",
      src: "/assets/ml/12_precision_recall_curve.png",
      caption: "Độ chính xác cao trên bài toán mất cân bằng mẫu (tỷ lệ rời bỏ ~38.7% trong B2B)."
    },
    {
      id: "confusion_matrix",
      title: "Ma trận Nhầm lẫn (Confusion Matrix) trên 1,174 Khách hàng",
      src: "/assets/ml/13_confusion_matrix.png",
      caption: "Mô hình nhận diện chính xác 310 khách hàng rời bỏ thực tế, hạn chế tối đa rủi ro báo động giả."
    },
    {
      id: "shap_summary",
      title: "Tầm quan trọng Đặc trưng & Giải thích Quyết định (SHAP Summary)",
      src: "/assets/ml/15_shap_summary.png",
      caption: "Recency (số ngày chưa mua), sản lượng 90 ngày và độ biến động doanh thu là 3 động lực chính dự báo rời bỏ."
    },
    {
      id: "segment_churn_matrix",
      title: "Ma trận Rủi ro Rời bỏ theo từng Phân khúc Khách hàng",
      src: "/assets/ml/18_segment_churn_matrix.png",
      caption: "Phân bổ rủi ro Churn trên từng nhóm khách hàng giúp phòng kinh doanh tập trung nguồn lực hiệu quả nhất."
    }
  ]
};

export const creditRiskData = {
  problemTitle: "Bài toán 3: Rủi ro Tín dụng & Phân tích Công nợ",
  objective: "Xây dựng Bộ chấm điểm Phơi nhiễm Công nợ và ma trận phối hợp liên phòng ban nhằm tối ưu dòng tiền, nhận diện rủi ro nợ xấu sớm từ báo cáo kế toán.",
  keyStats: [
    { label: "Tổng Dư nợ", value: "56.58 tỷ đ", sub: "Khớp 100% Sổ cái kế toán" },
    { label: "Nợ trong hạn", value: "32.90 tỷ đ", sub: "Tương đương 58.1% tổng nợ" },
    { label: "Nợ quá hạn", value: "23.69 tỷ đ", sub: "Tương đương 41.9% tổng nợ" },
    { label: "Mức độ Tập trung", value: "29.39%", sub: "Top 10 khách hàng lớn nhất" }
  ],
  methodology: "Hệ thống không tạo dữ liệu giả để ép mô hình. Thay vào đó, áp dụng Thang điểm Rủi ro minh bạch (0-100 điểm) kết hợp thuật toán phát hiện dị thường giao dịch.",
  priorityTiers: [
    {
      tier: "Báo động Đỏ",
      description: "Nợ cao & Nguy cơ bỏ đi cao",
      count: 4,
      totalDebt: "1.02 tỷ đ",
      overdueDebt: "206 triệu đ",
      action: "Giám đốc & Kế toán trưởng can thiệp trực tiếp, ngừng cấp hàng nợ."
    },
    {
      tier: "Siết Hạn mức",
      description: "Nợ lớn & Mua hàng đều đặn",
      count: 79,
      totalDebt: "22.45 tỷ đ",
      overdueDebt: "16.43 tỷ đ",
      action: "Đàm phán lịch trả góp nợ cũ tích hợp vào các đơn hàng mới."
    },
    {
      tier: "Giữ chân Khách",
      description: "Nợ ít & Nguy cơ bỏ đi cao",
      count: 31,
      totalDebt: "1.37 tỷ đ",
      overdueDebt: "343 triệu đ",
      action: "Nhân viên kinh doanh chủ trì thăm hỏi, tìm hiểu nguyên nhân giảm đơn."
    },
    {
      tier: "Giám sát Chuẩn",
      description: "Nợ thấp & Ổn định",
      count: 470,
      totalDebt: "31.74 tỷ đ",
      overdueDebt: "6.71 tỷ đ",
      action: "Theo dõi và thu hồi công nợ theo chu kỳ bình thường."
    }
  ]
};
