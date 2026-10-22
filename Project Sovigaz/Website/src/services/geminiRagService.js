import { companyInfo, projectOverview, brdReports, dataMappings, dataModelInfo } from '../data/projectData.js';
import { mlExecutiveSummary, forecastingData, churnSegmentationData } from '../data/machineLearningData.js';
import { 
  SOVIGAZ_DWH_TABLES_SCHEMA, 
  SOVIGAZ_ACTUAL_AUDITED_NUMBERS, 
  SOVIGAZ_SIT_UAT_TESTING 
} from '../data/sovigazKnowledgeBase.js';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

/**
 * STANDARD SQL TEMPLATES (T-SQL for SQL Server Enterprise DWH)
 * Only returned when explicitly requested by user.
 */
export const SOVIGAZ_SQL_TEMPLATES = [
  {
    title: '1. Doanh thu thuần theo từng Xí nghiệp & Tỷ lệ đóng góp',
    sql: `SELECT 
    st.StockID,
    st.StockName AS Ten_Xi_Nghiep,
    SUM(s.Revenue) AS Doanh_Thu_Thuan_VND,
    ROUND(SUM(s.Revenue) * 100.0 / SUM(SUM(s.Revenue)) OVER(), 2) AS Ty_Le_Dong_Gop_Pct
FROM dbo.DM_RevenueBySaleLedger s
JOIN dbo.Dim_Stock st ON s.BranchID = st.BranchID
LEFT JOIN dbo.Dim_Customer c ON s.AccountObjectCode = c.AccountObjectCode
WHERE s.AccountObjectCode NOT LIKE 'KHNB%' -- Loại trừ giao dịch luân chuyển nội bộ
GROUP BY st.StockID, st.StockName
ORDER BY Doanh_Thu_Thuan_VND DESC;`
  },
  {
    title: '2. So sánh Doanh thu Thực tế với KPI theo Tháng & % Hoàn thành',
    sql: `WITH ActualRevenue AS (
    SELECT 
        d.YearMonth,
        p.InventoryItemCategoryCode,
        SUM(s.Revenue) AS DoanhThu_ThucTe
    FROM dbo.DM_RevenueBySaleLedger s
    JOIN dbo.Dim_Date d ON CAST(s.RefDate AS DATE) = d.Date
    JOIN dbo.Dim_Products p ON s.InventoryItemCode = p.InventoryItemCode
    WHERE s.AccountObjectCode NOT LIKE 'KHNB%'
    GROUP BY d.YearMonth, p.InventoryItemCategoryCode
),
TargetRevenue AS (
    SELECT 
        FORMAT(CAST(k.Date AS DATE), 'yyyy-MM') AS YearMonth,
        k.InventoryItemGroup AS InventoryItemCategoryCode,
        SUM(k.Amount) AS DoanhThu_KeHoach
    FROM dbo.Fact_KPI_Month k
    GROUP BY FORMAT(CAST(k.Date AS DATE), 'yyyy-MM'), k.InventoryItemGroup
)
SELECT 
    COALESCE(a.YearMonth, t.YearMonth) AS Thang_Nam,
    COALESCE(a.InventoryItemCategoryCode, t.InventoryItemCategoryCode) AS Nhom_San_Pham,
    ISNULL(a.DoanhThu_ThucTe, 0) AS Doanh_Thu_Thuc_Te,
    ISNULL(t.DoanhThu_KeHoach, 0) AS Doanh_Thu_Ke_Hoach,
    CASE 
        WHEN ISNULL(t.DoanhThu_KeHoach, 0) > 0 
        THEN ROUND(ISNULL(a.DoanhThu_ThucTe, 0) * 100.0 / t.DoanhThu_KeHoach, 2)
        ELSE 0 
    END AS Ty_Le_Hoan_Thanh_Pct
FROM ActualRevenue a
FULL OUTER JOIN TargetRevenue t 
    ON a.YearMonth = t.YearMonth AND a.InventoryItemCategoryCode = t.InventoryItemCategoryCode
ORDER BY Thang_Nam DESC, Ty_Le_Hoan_Thanh_Pct DESC;`
  },
  {
    title: '3. Doanh thu theo Nhóm sản phẩm & Sản lượng quy đổi Đơn vị chuẩn (DVC)',
    sql: `SELECT 
    p.InventoryItemCategoryCode AS Ma_Nhom,
    p.InventoryItemCategoryList AS Ten_Nhom_San_Pham,
    COUNT(DISTINCT s.RefNo) AS So_Luong_Hoa_Don,
    SUM(s.MainQuantity) AS San_Luong_Thuc_Te,
    SUM(s.MainQuantity * ISNULL(s.MainConvertRate, 1.0)) AS San_Luong_Quy_Doi_DVC,
    SUM(s.Revenue) AS Tong_Doanh_Thu_VND
FROM dbo.DM_RevenueBySaleLedger s
JOIN dbo.Dim_Products p ON s.InventoryItemCode = p.InventoryItemCode
GROUP BY p.InventoryItemCategoryCode, p.InventoryItemCategoryList
ORDER BY Tong_Doanh_Thu_VND DESC;`
  },
  {
    title: '4. Phân tích Tuổi nợ Khách hàng & Cảnh báo Nợ quá hạn > 60 ngày',
    sql: `SELECT 
    c.AccountObjectCode AS Ma_Khach_Hang,
    c.CustomerName AS Ten_Khach_Hang,
    d.Account AS Tai_Khoan_Cong_No,
    SUM(d.Amount) AS Tong_Du_No,
    SUM(CASE WHEN d.DebtType = 'TRONG_HAN' THEN d.Amount ELSE 0 END) AS No_Trong_Han,
    SUM(CASE WHEN d.DebtType = 'QUA_HAN_1_30' THEN d.Amount ELSE 0 END) AS No_Qua_Han_1_30,
    SUM(CASE WHEN d.DebtType = 'QUA_HAN_31_60' THEN d.Amount ELSE 0 END) AS No_Qua_Han_31_60,
    SUM(CASE WHEN d.DebtType = 'QUA_HAN_60+' THEN d.Amount ELSE 0 END) AS No_Qua_Han_Tren_60_Ngay,
    CASE 
        WHEN SUM(CASE WHEN d.DebtType = 'QUA_HAN_60+' THEN d.Amount ELSE 0 END) > 0 
        THEN N'Cảnh báo: Quá hạn nghiêm trọng'
        ELSE N'Bình thường'
    END AS Muc_Do_Rui_Ro
FROM dbo.Fact_AnalyticsDebit d
JOIN dbo.Dim_Customer c ON d.AccountObjectCode = c.AccountObjectCode
GROUP BY c.AccountObjectCode, c.CustomerName, d.Account
ORDER BY No_Qua_Han_Tren_60_Ngay DESC, Tong_Du_No DESC;`
  },
  {
    title: '5. Truy vấn Đối soát Doanh thu giữa MISA AMIS và Kho DWH (< 10M VNĐ)',
    sql: `SELECT 
    FORMAT(CAST(s.RefDate AS DATE), 'yyyy-MM') AS Thang_Nam,
    SUM(s.Revenue) AS DoanhThu_Kho_DWH,
    m.DoanhThu_MISA,
    ABS(SUM(s.Revenue) - m.DoanhThu_MISA) AS Do_Lech_VND,
    CASE 
        WHEN ABS(SUM(s.Revenue) - m.DoanhThu_MISA) <= 10000000 
        THEN N'ĐẠT CHUẨN NGHIỆM THU (< 10M)'
        ELSE N'LỆCH VƯỢT DUNG SAI'
    END AS Trang_Thai_Doi_Soat
FROM dbo.DM_RevenueBySaleLedger s
CROSS JOIN (
    SELECT 385195000000.0 AS DoanhThu_MISA
) m
WHERE s.AccountObjectCode NOT LIKE 'KHNB%'
GROUP BY FORMAT(CAST(s.RefDate AS DATE), 'yyyy-MM'), m.DoanhThu_MISA;`
  }
];

export const SOVIGAZ_ACTUAL_METRICS = {
  overview: {
    totalTransactions: '229,012 dòng chứng từ bán hàng MISA AMIS',
    totalPlanRecords: '12,150+ dòng chỉ tiêu sản xuất & KPI biểu mẫu A3',
    dwhTablesCount: 19,
    reconciliationTolerance: '< 10,000,000 VND (đạt chuẩn nghiệm thu)',
    totalNetRevenueEst: '1,213.13 tỷ VNĐ (toàn kỳ 2023-2026) / ~385.2 tỷ VNĐ (kỳ báo cáo trọng điểm)',
    totalTargetRevenueEst: '369.8 tỷ VNĐ',
    overallKpiAchievement: '104.2% (vượt 4.2% chỉ tiêu kế hoạch năm)',
    totalReceivableEst: '54.3 tỷ VNĐ (trong hạn: 82.4%, quá hạn 0-30 ngày: 9.1%, quá hạn 31-60 ngày: 3.7%, quá hạn >60 ngày: 4.8%)',
  },
  subsidiaryRevenueShare: SOVIGAZ_ACTUAL_AUDITED_NUMBERS.branchRevenue,
  customerSegments: [
    { code: 'B_CTY/ĐL', name: 'Đại lý & Công ty Sản xuất', share: '68.5%', desc: 'Kênh tiêu thụ chính các loại khí bồn lỏng, khí chai công nghiệp và que hàn' },
    { code: 'A_BV/YTE', name: 'Bệnh viện & Cơ sở Y tế', share: '22.3%', desc: 'Tiêu thụ Oxy y tế lỏng, Oxy chai y tế, khí gây mê với biên lợi nhuận cao và thanh toán ổn định' },
    { code: 'C_NLE', name: 'Khách lẻ & Cơ sở Cơ khí nhỏ', share: '9.2%', desc: 'Khí hàn Acetylen, CO2, Argon và que hàn bán lẻ' },
    { code: 'KHNB', name: 'Khách hàng Luân chuyển Nội bộ', share: '0% (Loại trừ)', desc: 'Giao dịch điều chuyển vỏ và khí giữa 11 xí nghiệp, bị loại trừ khi tính doanh thu thuần' }
  ],
  topProducts: SOVIGAZ_ACTUAL_AUDITED_NUMBERS.topProducts
};

/**
 * COMPREHENSIVE RAG CONTEXT RETRIEVER
 * Aggregates all project artifacts: Database Schema, Excel BRD mappings, Audited Figures, Machine Learning findings.
 */
export function retrieveSovigazRagContext(query = '') {
  const q = (query || '').toLowerCase();
  const contextChunks = [];

  // ==========================================
  // 1. CORE FOUNDATIONAL PROJECT CONTEXT
  // ==========================================
  contextChunks.push(`
[HỒ SƠ DOANH NGHIỆP & TỔNG QUAN DỰ ÁN SOVIGAZ DWH]:
- Chủ đầu tư: ${companyInfo.fullName} (${companyInfo.brandName}), thành lập năm ${companyInfo.foundedYear}, trực thuộc Tập đoàn Hóa chất Việt Nam (Vinachem).
- Trụ sở chính: ${companyInfo.headquarters} (1-3 Nguyễn Trường Tộ, P. 12, Q. 4, TP.HCM).
- Quy mô: 11 Xí nghiệp / Chi nhánh thành viên từ miền Trung đến miền Nam (Bình Dương, Biên Hòa, Cần Thơ, Văn phòng công ty, Khánh Hội, Nha Trang, Hải Phòng, Phan Rang, Tân Kim, Vĩnh Phú...).
- Đơn vị tư vấn & triển khai DWH: ${projectOverview.partner} (${projectOverview.projectName}).
- Nhân sự chủ chốt:
  + Đặng Anh Tùng: Chủ trì Dự án & Kỹ sư Dữ liệu Lead (Lead DE/DA) — INDA. Khảo sát nghiệp vụ, thiết kế mô hình DWH 19 bảng, xây dựng ETL SSIS/Python, thiết kế Power BI và phát triển cổng thông tin.
  + Anh Phước: Quản trị Dự án (PM Sovigaz / DBA) — Chịu trách nhiệm chính về kỹ thuật phía Sovigaz, quản lý hạ tầng CSDL, kiểm soát tiến độ.
  + Chị Nghĩa: Kế toán trưởng & Phụ trách Nghiệp vụ — Sovigaz. Quản lý số liệu nghiệp vụ, phê duyệt quy tắc chuyển đổi dữ liệu, xác định ngưỡng dung sai độ lệch cho phép (< 10 triệu VNĐ) và trực tiếp nghiệm thu đối soát.
- Quy mô CSDL Kho DWH:
  + Giao dịch bán hàng: ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.totalTransactions.toLocaleString()} dòng chứng từ từ phần mềm kế toán MISA AMIS (thời gian: ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.dateRange}).
  + Kế hoạch sản xuất & tiêu thụ: 12,150+ dòng chỉ tiêu từ biểu mẫu Excel A3 của 11 xí nghiệp.
  + Tổng số bảng DWH: 19 bảng (7 bảng Fact/Data Mart, 12 bảng Dimension).
  + Tính toàn vẹn dữ liệu: 0 bản ghi mồ côi (100% khóa ngoại tồn tại trong Dim).
  + Chuẩn đối soát nghiệm thu: Độ lệch doanh thu giữa MISA AMIS và DWH < 10 triệu VNĐ (Đạt chuẩn nghiệm thu).
`);

  // ==========================================
  // 2. AUDITED FINANCIAL & OPERATIONAL NUMBERS
  // ==========================================
  contextChunks.push(`
[SỐ LIỆU DOANH THU, KPI & VẬN HÀNH ĐÃ ĐƯỢC KIỂM TOÁN]:
- Tổng doanh thu lịch sử toàn thời gian (2023 – 06/2026): ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.totalHistoricalRevenueText} (${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.totalTransactions.toLocaleString()} dòng giao dịch).
  + Năm 2023: 393.07 tỷ VNĐ (66,545 giao dịch, chiếm 32.4%).
  + Năm 2024: 331.44 tỷ VNĐ (57,873 giao dịch, chiếm 27.3%).
  + Năm 2025: 350.35 tỷ VNĐ (73,054 giao dịch, chiếm 28.9%).
  + Năm 2026 (đến 16/06/2026): 138.27 tỷ VNĐ (31,540 giao dịch).
- Doanh thu thuần lũy kế kỳ báo cáo phân tích: ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.periodAnalysisRevenueText} (Kế hoạch: ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.periodTargetRevenueText}, tỷ lệ hoàn thành KPI: ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.general.kpiAchievementRate}).
- Doanh thu theo tháng năm 2026 (Số liệu đối soát thực tế):
  + Tháng 1/2026: 29.97 tỷ VNĐ (duy trì mức cao trước Tết).
  + Tháng 2/2026: 20.65 tỷ VNĐ (THẤP NHẤT TRONG NĂM do các nhà máy và công trường nghỉ Tết Nguyên Đán kéo dài).
  + Tháng 3/2026: 36.02 tỷ VNĐ (sản xuất tăng tốc trở lại).
  + Tháng 4/2026: 39.84 tỷ VNĐ (CAO NHẤT NĂM 2026, các KCN hoạt động tối đa công suất).
  + Tháng 5/2026: 29.82 tỷ VNĐ (ổn định).
  + Tháng 6/2026: 9.13 tỷ VNĐ (nửa đầu tháng đến ngày chốt đối soát).
- Quy luật mùa vụ trong lịch sử Sovigaz:
  + ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.seasonalTrends.peakMonths}
  + ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.seasonalTrends.troughMonths}
  + ${SOVIGAZ_ACTUAL_AUDITED_NUMBERS.seasonalTrends.steadyMonths}
- Đóng góp doanh thu của các Xí nghiệp / Chi nhánh:
  1. Xí nghiệp Bình Dương (BD): 152.73 tỷ VNĐ (34.2% tổng doanh số, 19,274 giao dịch) - Đơn vị sản xuất và tiêu thụ lớn nhất, dẫn đầu Oxy lỏng và Nitơ lỏng.
  2. Văn phòng Công ty (VP - TP.HCM): 115.02 tỷ VNĐ (26.1%, 4,252 giao dịch) - Quản lý hợp đồng lớn cấp tập đoàn, bệnh viện lớn.
  3. Xí nghiệp Khánh Hội (KH): 34.60 tỷ VNĐ (8.5%, 2,049 giao dịch).
  4. Xí nghiệp Biên Hòa (BH - Đồng Nai): 33.36 tỷ VNĐ (8.2%, 11,268 giao dịch) - Khách hàng KCN Biên Hòa, Amata, Nhơn Trạch.
  5. Xí nghiệp Nha Trang (NT - Khánh Hòa): 22.21 tỷ VNĐ (5.5%, 15,434 giao dịch).
  6. Xí nghiệp Cần Thơ (CT): 17.70 tỷ VNĐ (4.4%, 10,327 giao dịch) - Thị trường Tây Nam Bộ, cung cấp oxy y tế cho bệnh viện vùng.
  7. Xí nghiệp Hải Phòng (HP): 12.94 tỷ VNĐ (3.2%, 1,018 giao dịch) - Cung ứng khí công nghiệp cơ khí, đóng tàu phía Bắc.
  8. Xí nghiệp Phan Rang (PR - Ninh Thuận): 4.50 tỷ VNĐ (1.1%, 2,923 giao dịch).
  9. Tân Kim (TK) và Vĩnh Phú (VP2): ~5.10 tỷ VNĐ (chiết nạp que hàn, vỏ bình).
- Cơ cấu nhóm khách hàng:
  + Đại lý & Nhà máy sản xuất (B_CTY/ĐL): Chiếm 68.5% doanh thu.
  + Bệnh viện & Cơ sở Y tế (A_BV/YTE): Chiếm 22.3% doanh thu (Oxy y tế lỏng & chai, biên lợi nhuận cao, thanh toán ổn định).
  + Khách hàng nhỏ lẻ & tiêu dùng (C_NLE): Chiếm 9.2% doanh thu.
  + Khách hàng Luân chuyển Nội bộ (KHNB): Chiếm 0% trên báo cáo hợp nhất do đã loại trừ triệt để.
- Top sản phẩm doanh thu cao nhất:
  + Oxy lỏng (OXL-SX): 354.61 tỷ VNĐ (9,981 giao dịch) - Mặt hàng chủ lực số 1.
  + Nitơ lỏng (NTL-SX): 119.79 tỷ VNĐ (4,004 giao dịch) - Mặt hàng chủ lực số 2.
  + Oxy lỏng thương mại (OXL1): 92.90 tỷ VNĐ (3,569 giao dịch).
  + Oxy khí chai (OXK6 - bình 40L): 78.20 tỷ VNĐ (55,961 giao dịch - mặt hàng có tần suất giao dịch lớn nhất).
  + Oxygene lỏng nạp bồn (OXLBON): 46.10 tỷ VNĐ.
  + Khí CO2 công nghiệp & thực phẩm (CO2K0.5 & CO2K25): 81.49 tỷ VNĐ.
  + Khí Acetylen C2H2 (AD): 39.74 tỷ VNĐ (4,749 giao dịch).
  + Que hàn điện N48 Ø 4mm (QHN48-4): 35.17 tỷ VNĐ (1,723 giao dịch).
  + Khí Argon tinh khiết (ARK6): 12.23 tỷ VNĐ (5,693 giao dịch).
- Tình hình công nợ & tuổi nợ (Bảng DM_AccountObjectDebt & Fact_AnalyticsDebit):
  + Tổng nợ phải thu ghi nhận trên sổ: 668.61 tỷ VNĐ; Số tiền đã thu: 70.21 tỷ VNĐ; Dư nợ ròng phân tích: ~54.3 tỷ VNĐ.
  + Tỷ lệ nợ trong hạn: 82.4% (uy tín thanh toán tốt).
  + Tỷ lệ nợ quá hạn 1-30 ngày: 9.1%.
  + Tỷ lệ nợ quá hạn 31-60 ngày: 3.7%.
  + Tỷ lệ nợ quá hạn > 60 ngày: 4.8% (được cảnh báo rủi ro cao trên Power BI).
  + Các tài khoản công nợ theo dõi: 131 (Phải thu khách hàng), 136 (Phải thu nội bộ: 13617, 13618, 13619).
  + Đối tượng công nợ lớn: Mã 1007 (705.5 tỷ đối soát luân chuyển hàng hóa xí nghiệp), 1002 (18.55 tỷ), 1003 (4.84 tỷ), 1006 (1.39 tỷ).
- Kế hoạch KPI (Fact_KPI_Year & Fact_KPI_By_Product):
  + Năm 2025: KHSX 49,380,857 DVC; KHTT 51,146,151 DVC; Doanh thu KPI 547.88 tỷ VNĐ.
  + Năm 2026: Văn phòng (VP) 97.12 tỷ VNĐ; Bình Dương (BD) 85.82 tỷ VNĐ (sản lượng 161.29 tỷ DVC); Nha Trang 32.25 tỷ VNĐ; Cần Thơ 17.07 tỷ VNĐ; Hải Phòng 12.18 tỷ VNĐ.
`);

  // ==========================================
  // 3. COMPLETE DWH TABLES CATALOG & RELATIONS
  // ==========================================
  const isSchemaQuery = q.includes('bảng') || q.includes('table') || q.includes('schema') || q.includes('cột') || q.includes('column') || q.includes('khóa') || q.includes('foreign key') || q.includes('primary key') || q.includes('ddl') || q.includes('mô hình dữ liệu') || q.includes('từ điển dữ liệu');

  if (isSchemaQuery) {
    const tableKeys = Object.keys(SOVIGAZ_DWH_TABLES_SCHEMA || {});
    const matchedTableKeys = tableKeys.filter(tk => {
      const lowerTk = tk.toLowerCase();
      return q.includes(lowerTk) || (SOVIGAZ_DWH_TABLES_SCHEMA[tk].domain || '').toLowerCase().includes(q);
    });

    const tablesToShow = matchedTableKeys.length > 0 ? matchedTableKeys : tableKeys;
    const schemaSummaries = tablesToShow.map(tk => {
      const tbl = SOVIGAZ_DWH_TABLES_SCHEMA[tk];
      const cols = tbl.columns.map(c => `${c.name} (${c.dataType}${c.fk ? ' -> ' + c.fk : ''}: ${c.businessName})`).join(', ');
      return `- Bảng [${tk}] (${tbl.tableType} - Phân hệ: ${tbl.domain}):
  + Các trường (${tbl.columns.length} cột): ${cols}`;
    }).join('\n\n');

    contextChunks.push(`
[CHI TIẾT DANH MỤC 19 BẢNG TRONG KHO DỮ LIỆU DWH SOVIGAZ]:
${schemaSummaries}

- Mối quan hệ khóa chính / khóa ngoại (Star / Snowflake Schema):
  + DM_RevenueBySaleLedger liên kết với Dim_Customer qua AccountObjectCode / AccountObjectID.
  + DM_RevenueBySaleLedger liên kết với Dim_Products qua InventoryItemCode.
  + DM_RevenueBySaleLedger liên kết với Dim_Stock qua BranchID.
  + DM_RevenueBySaleLedger liên kết với Dim_Date qua RefDate (CAST as DATE = DateKey).
  + DM_RevenueBySaleLedger liên kết với Dim_Unit qua UnitID.
  + Fact_KPI_Month liên kết với Dim_Stock qua StockCode, Dim_Month qua Date, Dim_Indicator qua Indicator.
  + DM_AccountObjectDebt liên kết với Dim_Customer qua AccountObjectCode, Dim_Account qua ReceivableAccountCode.
  + Fact_ActualProduction liên kết với Dim_Stock qua FactoryCode, Dim_ProductCategories qua CategoryName.
  + Fact_KPI_Year liên kết với Dim_ParentStock qua Parent_Stock.
`);
  } else {
    // Compact table overview
    contextChunks.push(`
[DANH SÁCH 19 BẢNG DWH SOVIGAZ]:
- 7 Bảng Fact / Data Mart:
  1. DM_RevenueBySaleLedger (229,012 dòng, 29 cột): Doanh thu chi tiết từ sổ bán hàng MISA AMIS.
  2. DM_AccountObjectDebt (1,494 dòng, 8 cột): Sổ chi tiết công nợ phải thu và đã thu theo khách hàng.
  3. Fact_ActualProduction (4,554 dòng, 9 cột, 911.99 tỷ VNĐ): Sản lượng và giá trị sản xuất thực tế tại các nhà máy.
  4. Fact_KPI_Month (12,150 dòng, 13 cột): Chỉ tiêu kế hoạch sản xuất và tiêu thụ hàng tháng từ biểu mẫu A3.
  5. Fact_KPI_Year (40 dòng, 5 cột): Chỉ tiêu kế hoạch năm theo từng xí nghiệp thành viên.
  6. Fact_KPI_By_Product (1,123 dòng, 12 cột): Kế hoạch sản xuất và doanh thu chi tiết theo sản phẩm (năm 2025: 547.88 tỷ).
  7. Fact_AnalyticsDebit (1,788 dòng, 6 cột): Phân tích công nợ phải thu chi tiết theo tuổi nợ.
- 12 Bảng Dimension:
  1. Dim_Customer (6,051 dòng): Khách hàng, mã số thuế, địa chỉ, phân loại.
  2. Dim_Products (8,391 dòng): Danh mục vật tư hàng hóa, nhóm sản phẩm, quy cách.
  3. Dim_Stock (10 dòng): Xí nghiệp / Chi nhánh kho (Bình Dương, Biên Hòa, Cần Thơ, Văn phòng, Hải Phòng...).
  4. Dim_ParentStock (8 dòng): Đơn vị cha cấp quản lý.
  5. Dim_ProductCategories (20 dòng): Nhóm sản phẩm khí và que hàn.
  6. Dim_Date (73,413 dòng): Chi tiết ngày, tuần, tháng, quý, năm.
  7. Dim_Month (204 dòng): Chu kỳ tháng phục vụ kế hoạch.
  8. Dim_Year (31 dòng): Chu kỳ năm.
  9. Dim_Unit (122 dòng): Đơn vị tính (chai, tấn, bình, m3...) và hệ số quy đổi về đơn vị chuẩn (DVC).
  10. Dim_Account (21 dòng): Hệ thống tài khoản kế toán (131, 136, 511...).
  11. Dim_Indicator (4 dòng): Chỉ tiêu kế hoạch sản xuất / tiêu thụ.
  12. Dim_InventoryItemType (4 dòng): Phân loại tính chất vật tư.
`);
  }

  // ==========================================
  // 4. BRD EXCEL REPORTS & DATA MAPPINGS
  // ==========================================
  contextChunks.push(`
[ĐẶC TẢ BÁO CÁO BRD & 45 QUY TẮC CHUYỂN ĐỔI DỮ LIỆU TỪ EXCEL VÀO DWH]:
(Nguồn: Bản BRD mới nhất - file 'Nguyễn Duy Mạnh - BRD_BaoCao_Sovigaz.xlsx')
- 5 Báo cáo Quản trị cốt lõi:
  1. Báo cáo 1 (BC_DoanhThu_TongHop): Tổng hợp Doanh thu theo Thời gian và Đơn vị. So sánh doanh thu thực tế lũy kế với kế hoạch, tăng trưởng cùng kỳ (YoY%), loại trừ luân chuyển nội bộ.
  2. Báo cáo 2 (BC_DoanhThu_ChiTiet): Chi tiết Doanh thu theo Khách hàng, Sản phẩm & Kênh. Phân loại theo 3 nhóm khách hàng (B_CTY/ĐL, A_BV/YTE, C_NLE) và 21 nhóm sản phẩm.
  3. Báo cáo 3 (BC_KPI_TongHop): Tổng hợp KPI Sản xuất & Tiêu thụ (Biểu mẫu A3). Tích hợp số liệu kế hoạch từ 11 xí nghiệp, so sánh tiến độ thực hiện theo tháng và năm.
  4. Báo cáo 4 (BC_KPI_ChiTiet): Chi tiết KPI Sản phẩm & Đơn vị theo tháng. Báo cáo từng dòng sản phẩm khí theo đơn vị chuẩn DVC.
  5. Báo cáo 5 (BC_CongNo_TuoiNo): Phân tích Tuổi nợ & Công nợ phải thu. Phân tầng nợ trong hạn, quá hạn 1-30 ngày, 31-60 ngày, >60 ngày cho tài khoản 131 và 136.
- 3 Quy tắc nghiệp vụ cốt lõi:
  + Quy tắc Đơn vị Chuẩn (DVC): Tất cả sản phẩm khí đa dạng quy cách đóng chai (chai 40L, chai nhỏ, bình bồn, tấn) đều được nhân với hệ số quy đổi trong bảng Dim_Unit để chuyển về đơn vị chuẩn thống nhất (m3 hoặc tấn) nhằm so sánh công bằng giữa các xí nghiệp.
  + Quy tắc Loại trừ Luân chuyển Nội bộ (KHNB): Bắt buộc lọc điều kiện AccountObjectCode NOT LIKE 'KHNB%' (hoặc CustomerType <> 'INTERNAL') khi tính doanh thu thuần hợp nhất toàn công ty để loại bỏ việc tính trùng khi các chi nhánh điều chuyển hàng.
  + Ngưỡng sai số nghiệm thu: Độ lệch giữa sổ chi tiết bán hàng kế toán MISA và kho dữ liệu DWH sau đối soát phải nhỏ hơn 10 triệu VNĐ (< 10,000,000 VNĐ).
`);

  // ==========================================
  // 5. COMPREHENSIVE MACHINE LEARNING KNOWLEDGE
  // ==========================================
  contextChunks.push(`
[PHÂN HỆ MACHINE LEARNING & KẾT QUẢ TRIỂN KHAI]:
(Quy mô dữ liệu huấn luyện: 228,581 dòng giao dịch bán hàng, 1,359 khách hàng B2B, 71/71 Unit Tests PASS)
- BÀI TOÁN 1: DỰ BÁO CHUỖI THỜI GIAN DOANH THU & NHU CẦU SẢN LƯỢNG KHÍ:
  + Cấp Tháng (Doanh thu Toàn Công ty): Mô hình XGBoost Regressor được chọn chính thức, đạt sai số cực thấp WAPE = 6.05%, sMAPE = 6.67%, MAE = 1.59 tỷ VNĐ.
    * Kiểm định thực tế 5 tháng đầu năm 2026:
      - T1/2026: Dự báo 28.63 tỷ vs Thực tế 27.71 tỷ (sai lệch +3.30%).
      - T2/2026 (Tết): Dự báo 23.23 tỷ vs Thực tế 18.88 tỷ (sai lệch +23.03% do kỳ nghỉ Tết Nguyên Đán toàn bộ nhà máy ngừng chạy).
      - T3/2026: Dự báo 28.05 tỷ vs Thực tế 29.23 tỷ (sai lệch -4.03%).
      - T4/2026: Dự báo 28.35 tỷ vs Thực tế 28.04 tỷ (sai lệch chỉ +1.10% - cực kỳ chính xác).
      - T5/2026: Dự báo 28.64 tỷ vs Thực tế 27.45 tỷ (sai lệch +4.35%).
  + Cấp Tuần (Doanh thu Toàn Công ty): Mô hình CatBoost Regressor được chọn, WAPE = 31.80%, sMAPE = 32.77%, MAE = 1.88 tỷ VNĐ (vượt trội hoàn toàn so với Baseline Naive 52.30%).
  + Dự báo nhu cầu 3 sản phẩm khí huyết mạch:
    * Nitơ lỏng (NTL-SX): Mô hình LightGBM, WAPE = 53.55%, MAE = 134,422 m³.
    * Oxy khí chai (OXK6): Mô hình Moving Average / CatBoost, WAPE = 26.86%, MAE = 15,588 chai.
    * Oxy lỏng (OXL-SX): Mô hình CatBoost / Seasonal Naive, WAPE = 44.36%, MAE = 362,223 m³.

- BÀI TOÁN 2: PHÂN KHÚC KHÁCH HÀNG RFM & CẢNH BÁO SỚM RỦI RO RỜI BỎ (CHURN):
  + Phân cụm Khách hàng K-Means (K=4 cụm tối ưu, Silhouette = 0.582):
    * Cụm 2 - Key Industrial Accounts (VIP & Hợp đồng Lớn): 334 khách hàng (24.58%), đóng góp 92.09% doanh thu (~322.17 tỷ VNĐ). Tần suất mua cực cao (78 đơn/năm, recency median 1 ngày, trung bình 964.6 triệu VNĐ/khách). Chiến lược: Chăm sóc C-Level, cam kết SLA cấp bồn xe riêng.
    * Cụm 0 - Slipping / Periodic Buyers (Khách hàng suy giảm / mua định kỳ): 320 khách hàng (23.55%), doanh thu 18.72 tỷ VNĐ (5.35%). Recency median 90.5 ngày (~3 tháng chưa phát sinh đơn mới). Tiềm ẩn nguy cơ rời bỏ cao.
    * Cụm 1 - Active Regular Buyers (Khách hàng mua thường xuyên vừa & nhỏ): 370 khách hàng (27.23%), doanh thu 13.85 tỷ VNĐ (3.96%). Recency median 5 ngày, tần suất 21 đơn/năm. Luồng tiền ổn định.
    * Cụm 3 - Dormant / Low-Engagement (Khách hàng ngủ đông / ít tương tác): 335 khách hàng (24.65%), doanh thu âm -4.89 tỷ VNĐ (do các bút toán hoàn trả / đối trừ công nợ vỏ bình), recency median 102 ngày.
  + Mô hình Dự báo Khách hàng Rời bỏ (Customer Churn Prediction):
    * Mô hình CatBoostClassifier đạt ROC-AUC = 0.8210 (Test set), PR-AUC = 0.7796, F1 = 0.7151, Precision 75.24%, Recall 68.13%.
    * 4 Phân tầng rủi ro Churn:
      1. Critical Risk (P >= 80%): 233 khách hàng, tỷ lệ churn thực tế 87.55%, doanh thu 365 ngày 16.20 tỷ VNĐ. SLA can thiệp khẩn cấp 24-48 giờ.
      2. High Risk (50% <= P < 80%): 179 khách hàng, tỷ lệ churn thực tế 59.22%, doanh thu 16.78 tỷ VNĐ. SLA 3-5 ngày.
      3. Medium Risk (25% <= P < 50%): 151 khách hàng, tỷ lệ churn thực tế 30.46%, doanh thu 11.34 tỷ VNĐ. SLA 7-14 ngày.
      4. Low Risk (P < 25%): 611 khách hàng, tỷ lệ churn chỉ 16.20%, doanh thu 298.70 tỷ VNĐ (An toàn).
    * Hiệu quả cảnh báo: Phát hiện chính xác 100% (15/15) khách hàng VIP có nguy cơ rời bỏ đã ngưng giao dịch.
    * Khung Ưu tiên Can thiệp (Retention Priority Framework):
      Điểm ưu tiên = 0.4 * P(Churn) + 0.4 * Điểm Giá trị Doanh thu + 0.2 * Trọng số Phân khúc.
    * Top khách hàng VIP có nguy cơ cao cần can thiệp khẩn cấp:
      1. VPBV32 (Bệnh viện Đa khoa tỉnh Bình Dương): Xác suất churn 90.51%, Điểm ưu tiên 90.92, Doanh thu 1.80 tỷ VNĐ, Recency 158 ngày, SLA 24h.
      2. BDNL336 (Công ty sản xuất thép Bình Dương): Xác suất churn 84.2%, Điểm ưu tiên 86.4, Doanh thu 1.45 tỷ VNĐ, SLA 24h.
      3. BHBVNHI (Bệnh viện Nhi Đồng Nai): Xác suất churn 79.6%, Điểm ưu tiên 82.1, Doanh thu 920 triệu VNĐ, SLA 48h.
`);

  // ==========================================
  // 6. SQL TEMPLATES (ONLY ON EXPLICIT REQUEST)
  // ==========================================
  const isSqlRequested = q.includes('sql') || q.includes('câu lệnh') || q.includes('truy vấn') || q.includes('query') || q.includes('t-sql');
  if (isSqlRequested) {
    const sqlText = SOVIGAZ_SQL_TEMPLATES.map(t => `-- ${t.title}\n${t.sql}`).join('\n\n');
    contextChunks.push(`
[KHO CÂU LỆNH SQL / T-SQL MẪU CHUẨN CỦA DỰ ÁN SOVIGAZ DWH]:
${sqlText}
`);
  }

  // ==========================================
  // 7. DAX MEASURES (ONLY ON EXPLICIT REQUEST)
  // ==========================================
  const isDaxRequested = q.includes('dax') || q.includes('power bi') || q.includes('measure') || (q.includes('công thức') && q.includes('tính'));
  if (isDaxRequested) {
    contextChunks.push(`
[CÔNG THỨC DAX & ĐO LƯỜNG POWER BI CHÍNH TRONG DỰ ÁN]:
1. Doanh thu bán ngoài = CALCULATE(SUM(DM_RevenueBySaleLedger[Revenue]), LEFT(DM_RevenueBySaleLedger[AccountObjectCode], 4) <> "KHNB")
2. Doanh thu kế hoạch = SUM(Fact_KPI_Month[Amount])
3. % Đạt kế hoạch = DIVIDE([Doanh thu bán ngoài], [Doanh thu kế hoạch], 0)
4. Tăng trưởng cùng kỳ (YoY %) = DIVIDE([Doanh thu bán ngoài] - [Doanh thu cùng kỳ năm trước], [Doanh thu cùng kỳ năm trước], 0)
5. Sản lượng quy đổi DVC = SUMX(DM_RevenueBySaleLedger, DM_RevenueBySaleLedger[MainQuantity] * RELATED(Dim_Unit[ConversionRate]))
6. Nợ quá hạn trên 60 ngày = CALCULATE(SUM(Fact_AnalyticsDebit[Amount]), Fact_AnalyticsDebit[DebtType] = "QUA_HAN_60+")
`);
  }

  return contextChunks.join('\n\n');
}

/**
 * Ask Gemini RAG Service
 * Sends user question with comprehensive project knowledge to Google Gemini API
 */
export async function askGeminiRag(userQuestion, conversationHistory = []) {
  const ragContext = retrieveSovigazRagContext(userQuestion);

  const systemInstruction = `
Bạn là Sovigaz AI - Trợ lý Trí tuệ Nhân tạo Toàn diện phục vụ Dự án Kho Dữ liệu Doanh nghiệp (Enterprise DWH), Hệ thống Báo cáo Quản trị BI và Phân hệ Machine Learning của Công ty Cổ phần Hơi Kỹ nghệ Que Hàn (SOVIGAZ), do Đội ngũ INDA phát triển.

BẠN CÓ TOÀN QUYỀN TRUY CẬP VÀ HIỂU RÕ TOÀN BỘ CƠ SỞ TRI THỨC SAU:
1. CƠ SỞ DỮ LIỆU KHO DWH: 19 bảng (7 Fact, 12 Dim), cấu trúc các trường, kiểu dữ liệu, khóa chính, khóa ngoại, quan hệ Star/Snowflake Schema.
2. FILE DỮ LIỆU EXCEL & ĐẶC TẢ BRD: Bản BRD mới nhất ('Nguyễn Duy Mạnh - BRD_BaoCao_Sovigaz.xlsx'), 5 báo cáo quản trị, 45 quy tắc technical data mapping, biểu mẫu A3 sản xuất & kế hoạch của 11 xí nghiệp, Data Dictionary.
3. SỐ LIỆU DOANH THU & KPI ĐÃ KIỂM TOÁN: 229,012 giao dịch bán hàng, 1,213.13 tỷ VNĐ doanh thu lịch sử, doanh thu theo năm (2023, 2024, 2025, 2026), doanh thu theo từng tháng năm 2026 (T1: 29.97 tỷ, T2: 20.65 tỷ thấp nhất do Tết, T4: 39.84 tỷ cao nhất), tháng đỉnh điểm Tháng 12, tỷ trọng 11 xí nghiệp (Bình Dương 34.2%, Văn phòng 26.1%...), nhóm khách hàng, top sản phẩm (Oxy lỏng 354.6 tỷ, Nito lỏng 119.8 tỷ...), tuổi nợ (82.4% trong hạn), chỉ tiêu kế hoạch năm 2025 và 2026.
4. TOÀN BỘ PHÂN HỆ MACHINE LEARNING:
   - Bài toán 1: Dự báo chuỗi thời gian (XGBoost tháng WAPE 6.05%, CatBoost tuần WAPE 31.80%, đối chiếu 5 tháng 2026, dự báo NTL-SX, OXK6, OXL-SX).
   - Bài toán 2: Phân khúc K-Means 4 cụm (Cụm 2 VIP chiếm 92.09% doanh thu, Cụm 0 Slipping, Cụm 1 Regular, Cụm 3 Dormant) & Dự báo rời bỏ Churn CatBoost ROC-AUC 0.8210, 4 phân tầng rủi ro, phát hiện 100% khách VIP nguy cơ, công thức điểm ưu tiên, top khách hàng VIP (VPBV32, BDNL336, BHBVNHI).
5. THÔNG TIN DỰ ÁN & QUY TẮC NGHIỆP VỤ: Đội ngũ INDA (Đặng Anh Tùng), Sovigaz PM (Anh Phước), Kế toán trưởng (Chị Nghĩa), quy tắc quy đổi DVC, quy tắc loại trừ luân chuyển nội bộ KHNB, dung sai đối soát < 10 triệu VNĐ, 0 bản ghi mồ côi.

QUY TẮC TRẢ LỜI BẮT BUỘC (TUÂN THỦ TUYỆT ĐỐI):
1. NGUYÊN TẮC "HỎI GÌ ĐÁP NẤY":
   - Trả lời trực tiếp, rõ ràng, gãy gọn, đúng trọng tâm câu hỏi của người dùng.
   - TUYỆT ĐỐI KHÔNG TỰ Ý viết thêm mục câu lệnh SQL hay mục công thức DAX ở cuối câu trả lời nếu người dùng KHÔNG YÊU CẦU.
   - Nếu người dùng hỏi số liệu: Đưa ra con số chính xác từ cơ sở dữ liệu trên, phân tích ngắn gọn nguyên nhân/ý nghĩa.
   - Nếu người dùng hỏi cấu trúc bảng: Nêu tên bảng, các trường, kiểu dữ liệu, mục đích nghiệp vụ.
   - Nếu người dùng hỏi về Machine Learning: Nêu rõ kết quả thực nghiệm, chỉ số đo lường, phân khúc, hoặc danh sách khách hàng.
   - CHỈ KHI NÀO người dùng hỏi rõ ràng "viết câu lệnh SQL...", "cho câu truy vấn...", "query...", "công thức DAX..." THÌ MỚI viết code SQL hoặc DAX.
2. VĂN PHONG VÀ ĐỘ CHÍNH XÁC:
   - Sử dụng tiếng Việt chuẩn mực, thông minh, lịch sự, chuyên nghiệp.
   - Số liệu phải chính xác tuyệt đối theo tri thức DWH Sovigaz đã cung cấp, không bịa đặt số liệu.
3. CÁCH TRÌNH BÀY (RẤT QUAN TRỌNG):
   - KHÔNG lạm dụng in đậm (**). CHỈ IN ĐẬM các tiêu đề chính hoặc cụm từ khóa rất quan trọng ở đầu dòng/đầu câu.
   - Các nội dung giải thích, diễn giải chi tiết theo sau phải viết bình thường (không in đậm) để dễ đọc.
   - Hãy tăng khoảng cách giữa các đoạn (sử dụng dòng trắng) để văn bản thoáng và rõ ràng.

DƯỚI ĐÂY LÀ TOÀN BỘ CƠ SỞ TRI THỨC DỰ ÁN SOVIGAZ:
${ragContext}
`;

  const contents = [];
  const recentHistory = conversationHistory.slice(-6);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: userQuestion }]
  });

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.2,
      topP: 0.9,
      maxOutputTokens: 3000
    }
  };

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const msg = errorData?.error?.message || response.statusText;
        
        if (status === 503 || status === 429 || status === 404) {
          lastError = new Error(`Model ${model} (${status}): ${msg}`);
          continue;
        }
        throw new Error(`Gemini API Error (${status}): ${msg}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content?.parts?.[0]?.text) {
        return {
          text: data.candidates[0].content.parts[0].text,
          modelUsed: model,
          ragContextTopics: 'Đã kích hoạt tri thức số liệu DWH & Thư viện SQL'
        };
      } else {
        throw new Error('Không nhận được câu trả lời hợp lệ từ Gemini API.');
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Không thể kết nối đến máy chủ Gemini AI.');
}
