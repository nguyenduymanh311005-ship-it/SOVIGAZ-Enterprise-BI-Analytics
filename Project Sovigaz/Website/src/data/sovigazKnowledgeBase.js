/**
 * SOVIGAZ DWH & ENTERPRISE PROJECT MASTER KNOWLEDGE BASE
 * Aggregated from:
 * 1. Microsoft SQL Server Enterprise DWH (All 19 Tables: 7 Fact, 12 Dim, 229,099 transactions)
 * 2. Excel Data Files (BRD BaoCao Sovigaz, Data Dictionary Sovigaz, SIT/UAT, A3 KPI sheets)
 * 3. Machine Learning System (Forecasting: XGBoost/CatBoost, Customer Segmentation: K-Means K=4 & Churn CatBoost)
 * 4. Project Documents (Sovigaz corporate profile, INDA project lead, architecture, acceptance criteria)
 */

import dwhTablesRaw from './sovigaz_dwh_tables.js';
import { brdReports, dataMappings, companyInfo, projectOverview, dataModelInfo } from './projectData.js';
import { mlExecutiveSummary, forecastingData, churnSegmentationData } from './machineLearningData.js';

export const SOVIGAZ_DWH_TABLES_SCHEMA = dwhTablesRaw;

export const SOVIGAZ_ACTUAL_AUDITED_NUMBERS = {
  general: {
    totalTransactions: 229012,
    dateRange: '02/01/2023 đến 16/06/2026',
    totalHistoricalRevenueVnd: 1213126773799,
    totalHistoricalRevenueText: '1,213.13 tỷ VNĐ',
    periodAnalysisRevenueVnd: 385195000000,
    periodAnalysisRevenueText: '~385.2 tỷ VNĐ',
    periodTargetRevenueVnd: 369800000000,
    periodTargetRevenueText: '369.8 tỷ VNĐ',
    kpiAchievementRate: '104.2% (Vượt 4.2% kế hoạch năm)',
    reconciliationTolerance: '< 10,000,000 VNĐ (Đã nghiệm thu bởi Chị Nghĩa - Kế toán trưởng)',
    orphanRecordsCount: 0,
    referentialIntegrityRate: '100% (Không có bản ghi mồ côi)'
  },
  yearlyRevenue: [
    { year: 2023, transactions: 66545, revenueVnd: 393072039000, revenueText: '393.07 tỷ VNĐ', share: '32.4%' },
    { year: 2024, transactions: 57873, revenueVnd: 331442686000, revenueText: '331.44 tỷ VNĐ', share: '27.3%' },
    { year: 2025, transactions: 73054, revenueVnd: 350345818000, revenueText: '350.35 tỷ VNĐ', share: '28.9%' },
    { year: 2026, transactions: 31540, revenueVnd: 138266231000, revenueText: '138.27 tỷ VNĐ (đến 16/06/2026)', share: '11.4%' }
  ],
  monthlyRevenue2026: [
    { month: '01/2026', actualVnd: 29972701658, actualText: '29.97 tỷ VNĐ', note: 'Duy trì cao trước Tết Nguyên Đán' },
    { month: '02/2026', actualVnd: 20654759588, actualText: '20.65 tỷ VNĐ', note: 'Tháng trũng nhất năm do các nhà máy nghỉ Tết Nguyên Đán' },
    { month: '03/2026', actualVnd: 36019197925, actualText: '36.02 tỷ VNĐ', note: 'Sản xuất công nghiệp phục hồi mạnh mẽ sau Tết' },
    { month: '04/2026', actualVnd: 39835831076, actualText: '39.84 tỷ VNĐ', note: 'Tháng cao điểm nhất năm 2026' },
    { month: '05/2026', actualVnd: 29824051530, actualText: '29.82 tỷ VNĐ', note: 'Duy trì ổn định' },
    { month: '06/2026', actualVnd: 9129994508, actualText: '9.13 tỷ VNĐ (nửa đầu tháng)', note: 'Đến thời điểm chốt dữ liệu nghiệm thu' }
  ],
  seasonalTrends: {
    peakMonths: 'Tháng 12 luôn là đỉnh điểm doanh thu trong lịch sử các năm (Tháng 12/2025: 35.35 tỷ VNĐ, Tháng 12/2024: 38.6 tỷ VNĐ) do các khu công nghiệp, bệnh viện và cơ sở cơ khí tăng tốc chạy hết công suất hoàn thành kế hoạch năm.',
    troughMonths: 'Tháng 2 luôn là tháng thấp nhất trong năm (chỉ từ 18.9 đến 22.5 tỷ VNĐ) do trùng kỳ nghỉ Tết Nguyên Đán kéo dài, phần lớn nhà máy ngừng hoạt động.',
    steadyMonths: 'Quý 2 và Quý 3 (từ Tháng 4 đến Tháng 9) duy trì sản lượng ổn định trung bình 28.0 - 33.0 tỷ VNĐ/tháng.'
  },
  branchRevenue: [
    { code: 'BD', name: 'Xí nghiệp Bình Dương', transactions: 19274, revenueVnd: 152726340000, revenueText: '152.73 tỷ VNĐ', share: '34.2%', role: 'Dẫn đầu toàn diện về sản lượng Oxy và Nitơ lỏng' },
    { code: 'VP', name: 'Văn phòng Công ty (Q.4, TP.HCM)', transactions: 4252, revenueVnd: 115017935000, revenueText: '115.02 tỷ VNĐ', share: '26.1%', role: 'Hợp đồng lớn cấp tập đoàn và bệnh viện tuyến trung ương' },
    { code: 'KH', name: 'Xí nghiệp Khánh Hội', transactions: 2049, revenueVnd: 34603185000, revenueText: '34.60 tỷ VNĐ', share: '8.5%', role: 'Khí y tế và bồn chứa hóa lỏng' },
    { code: 'BH', name: 'Xí nghiệp Biên Hòa (Đồng Nai)', transactions: 11268, revenueVnd: 33362812000, revenueText: '33.36 tỷ VNĐ', share: '8.2%', role: 'Khách hàng khu công nghiệp trọng điểm Đồng Nai' },
    { code: 'NT', name: 'Xí nghiệp Nha Trang (Khánh Hòa)', transactions: 15434, revenueVnd: 22214926000, revenueText: '22.21 tỷ VNĐ', share: '5.5%', role: 'Khu vực Nam Trung Bộ' },
    { code: 'CT', name: 'Xí nghiệp Cần Thơ', transactions: 10327, revenueVnd: 17701243000, revenueText: '17.70 tỷ VNĐ', share: '4.4%', role: 'Thị trường Tây Nam Bộ & hệ thống oxy y tế bệnh viện' },
    { code: 'HP', name: 'Xí nghiệp Hải Phòng', transactions: 1018, revenueVnd: 12942051000, revenueText: '12.94 tỷ VNĐ', share: '3.2%', role: 'Khí hàn cơ khí và cảng biển, đóng tàu miền Bắc' },
    { code: 'PR', name: 'Xí nghiệp Phan Rang (Ninh Thuận)', transactions: 2923, revenueVnd: 4503546000, revenueText: '4.50 tỷ VNĐ', share: '1.1%', role: 'Năng lượng tái tạo và cơ khí nhỏ' },
    { code: 'TK', name: 'Xí nghiệp Tân Kim (Long An)', transactions: 512, revenueVnd: 3120000000, revenueText: '3.12 tỷ VNĐ', share: '0.8%', role: 'Vỏ bình khí và que hàn' },
    { code: 'VP2', name: 'Xí nghiệp Vĩnh Phú', transactions: 340, revenueVnd: 1980000000, revenueText: '1.98 tỷ VNĐ', share: '0.5%', role: 'Cơ sở chiết nạp phụ trợ' }
  ],
  topProducts: [
    { code: 'OXL-SX', name: 'Oxy lỏng', transactions: 9981, revenueVnd: 354607134000, revenueText: '354.61 tỷ VNĐ', dvcUnit: 'Tấn', share: '29.2%', note: 'Sản phẩm chủ lực số 1 toàn công ty' },
    { code: 'NTL-SX', name: 'Nitơ lỏng', transactions: 4004, revenueVnd: 119789134000, revenueText: '119.79 tỷ VNĐ', dvcUnit: 'Tấn', share: '9.9%', note: 'Sản phẩm chủ lực số 2' },
    { code: 'OXL1', name: 'Oxy lỏng thương mại', transactions: 3569, revenueVnd: 92899627000, revenueText: '92.90 tỷ VNĐ', dvcUnit: 'Tấn', share: '7.7%', note: 'Cung cấp khách hàng đại lý' },
    { code: 'OXK6', name: 'Oxy khí chai 6m3 (40L)', transactions: 55961, revenueVnd: 78204367000, revenueText: '78.20 tỷ VNĐ', dvcUnit: 'Chai chuẩn (m3)', share: '6.4%', note: 'Số lượng giao dịch lớn nhất (55,961 đơn)' },
    { code: 'OXLBON', name: 'Oxygene lỏng nạp bồn', transactions: 876, revenueVnd: 46095391000, revenueText: '46.10 tỷ VNĐ', dvcUnit: 'Bồn / Tấn', share: '3.8%', note: 'Cấp bồn bệnh viện và nhà máy lớn' },
    { code: 'CO2K0.5 & CO2K25', name: 'Khí CO2 công nghiệp & thực phẩm', transactions: 10223, revenueVnd: 81490779000, revenueText: '81.49 tỷ VNĐ', dvcUnit: 'Chai / Kg', share: '6.7%', note: 'Hàn kim loại và chế biến nước giải khát' },
    { code: 'AD', name: 'Khí Acetylene (C2H2)', transactions: 4749, revenueVnd: 39739884000, revenueText: '39.74 tỷ VNĐ', dvcUnit: 'Chai', share: '3.3%', note: 'Hàn cắt gió đá nhiệt độ cao' },
    { code: 'QHN48-4', name: 'Que hàn điện N48 - Ø 4 mm', transactions: 1723, revenueVnd: 35166917000, revenueText: '35.17 tỷ VNĐ', dvcUnit: 'Kg / Hộp', share: '2.9%', note: 'Vật liệu hàn cơ khí' },
    { code: 'OXK & OXK0.5', name: 'Oxy khí chai nhỏ', transactions: 32966, revenueVnd: 36607132000, revenueText: '36.61 tỷ VNĐ', dvcUnit: 'Chai', share: '3.0%', note: 'Cơ sở y tế và gia công tư nhân' },
    { code: 'ARK6', name: 'Khí Argon tinh khiết', transactions: 5693, revenueVnd: 12229460000, revenueText: '12.23 tỷ VNĐ', dvcUnit: 'Chai', share: '1.0%', note: 'Hàn TIG inox và công nghiệp điện tử' }
  ],
  debtAndReceivables: {
    totalRecordedReceivables: '668.61 tỷ VNĐ (Tổng phải thu trên bảng DM_AccountObjectDebt)',
    totalPaidAmount: '70.21 tỷ VNĐ (Số tiền đã thu hồi)',
    netOutstandingPeriod: '~54.3 tỷ VNĐ (Dư nợ ròng kỳ phân tích)',
    debtAgingStructure: {
      currentTerm: '82.4% (Nợ trong hạn thanh toán, uy tín tốt)',
      overdue1to30: '9.1% (Quá hạn 1-30 ngày, nhắc nợ thông thường)',
      overdue31to60: '3.7% (Quá hạn 31-60 ngày, theo dõi sát sao)',
      overdueOver60: '4.8% (Quá hạn > 60 ngày, cảnh báo rủi ro cao trên Power BI)'
    },
    topDebtors: [
      { code: '1007', name: 'Khách hàng Luân chuyển Chi nhánh (Đối soát nội bộ)', debtAmount: '705.5 tỷ VNĐ (Số liệu đối soát luân chuyển hàng hóa nội bộ Sovigaz)' },
      { code: '1002', name: 'Công ty Cổ phần Cơ khí Công nghiệp Đồng Nai', debtAmount: '18.55 tỷ VNĐ' },
      { code: '1003', name: 'Công ty TNHH Kết cấu Thép Sài Gòn', debtAmount: '4.84 tỷ VNĐ' },
      { code: '1006', name: 'Công ty Đóng tàu Ba Son', debtAmount: '1.39 tỷ VNĐ' }
    ]
  },
  kpiPlanTargets: {
    planYear2025: {
      totalProductionPlanDVC: '49,380,857 DVC',
      totalSalesPlanDVC: '51,146,151 DVC',
      totalRevenuePlanVnd: '547,881,643,189 VNĐ (~547.88 tỷ VNĐ)'
    },
    planYear2026ByBranch: [
      { branch: 'VP (Văn phòng)', targetRevenue: '97.12 tỷ VNĐ', targetProduction: 'N/A' },
      { branch: 'BD (Bình Dương)', targetRevenue: '85.82 tỷ VNĐ', targetProduction: '161.29 tỷ DVC' },
      { branch: 'NT (Khánh Hòa/Nha Trang)', targetRevenue: '32.25 tỷ VNĐ', targetProduction: '188.4 triệu DVC' },
      { branch: 'CT (Cần Thơ)', targetRevenue: '17.07 tỷ VNĐ', targetProduction: 'N/A' },
      { branch: 'HP (Hải Phòng)', targetRevenue: '12.18 tỷ VNĐ', targetProduction: 'N/A' }
    ]
  },
  actualProductionFact: {
    totalRows: 4554,
    totalProductionValueVnd: 911987505863,
    totalProductionValueText: '911.99 tỷ VNĐ'
  }
};

export const SOVIGAZ_SIT_UAT_TESTING = [
  { id: 'SVG-01', object: 'Doanh thu MISA AMIS vs DB Fact_sales (T1-T6/2026)', target: 'Fact_sales_upload / DM_RevenueBySaleLedger', result: 'Khớp 100% từng tháng (T1: 29.97 tỷ, T2: 20.65 tỷ, T3: 36.02 tỷ, T4: 39.84 tỷ, T5: 29.82 tỷ, T6: 9.13 tỷ)' },
  { id: 'SVG-02', object: 'Số dư đầu kỳ, phải thu, đã thu, cuối kỳ theo TK 131, 136', target: 'DM_AccountObjectDebt_upload', result: 'Khớp 100% sổ chi tiết công nợ MISA' },
  { id: 'SVG-03', object: 'Phân tích tuổi nợ TK 136 tính đến 31/07/2026', target: 'Fact_AnalyticsDebit_upload', result: 'Khớp 100% biểu mẫu phân tích tuổi nợ' },
  { id: 'SVG-04', object: 'Chỉ tiêu KPI tháng so với file Excel KPI A3', target: 'Fact_KPI_Month', result: 'Khớp 100% toàn bộ chỉ tiêu sản xuất và tiêu thụ tháng' },
  { id: 'SVG-05', object: 'Chỉ tiêu KPI năm 2026 so với file Excel KPI A3', target: 'Fact_KPI_Year', result: 'Khớp 100% kế hoạch năm các xí nghiệp' },
  { id: 'SVG-06', object: 'Sản lượng thực tế từ DB so với file Excel sản xuất A3', target: 'Fact_ActualProduction', result: 'Khớp 100% số liệu nghiệm thu' },
  { id: 'SVG-07', object: 'Kế hoạch theo sản phẩm năm 2025 (KHSX, KHTT, KPI DT)', target: 'Fact_KPI_By_Product', result: 'Tổng KHSX: 49.38 triệu DVC, Tổng KHTT: 51.15 triệu DVC, Tổng KPI DT: 547.88 tỷ VNĐ (Khớp 100%)' },
  { id: 'SVG-08', object: 'Kiểm tra tính toàn vẹn dữ liệu quan hệ khóa ngoại (Foreign Keys)', target: 'DM_RevenueBySaleLedger vs Dim Tables', result: '0 bản ghi mồ côi (100% khóa ngoại toàn vẹn)' }
];
