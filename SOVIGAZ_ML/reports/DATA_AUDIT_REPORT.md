# BÁO CÁO KIỂM TOÁN DỮ LIỆU DỰ ÁN SOVIGAZ (DATA AUDIT REPORT)
*(Tiêu chuẩn Phase 1 – Kiểm tra toàn diện, chống Data Leakage, chuẩn bị Pipeline Machine Learning)*

**Ngày thực hiện**: 2026-10-03  
**Người thực hiện**: Senior Machine Learning Engineer & Data Scientist  
**Trạng thái**: Hoàn thành Phase 1 – Dữ liệu đủ điều kiện và sẵn sàng cho Phase 2  

---

## 1. TỔNG QUAN TÀI NGUYÊN VÀ DANH MỤC CÁC BẢNG (TABLE CATALOG)
Hệ thống kho dữ liệu DWH Sovigaz bao gồm **19 bảng dữ liệu** dạng CSV, tổng dung lượng xấp xỉ **105.43 MB**.

| Bảng vật lý (Table) | File nguồn | Dung lượng (MB) | Số dòng | Số cột | Dòng trùng lặp (Exact Dup) | Phân loại kiến trúc |
|---|---|---:|---:|---:|---:|---|
| `DM_AccountObjectDebt` | `DM_AccountObjectDebt.csv` | 0.16 | 1,494 | 8 | 0 | Fact / Data Mart |
| `DM_RevenueBySaleLedger` | `DM_RevenueBySaleLedger.csv` | 91.42 | 229,012 | 29 | 428 | Fact / Data Mart |
| `Dim_Account` | `Dim_Account.csv` | 0.00 | 21 | 2 | 0 | Dimension |
| `Dim_Customer` | `Dim_Customer.csv` | 1.50 | 6,044 | 19 | 0 | Dimension |
| `Dim_Date` | `Dim_Date.csv` | 5.30 | 73,413 | 11 | 0 | Dimension |
| `Dim_Indicator` | `Dim_Indicator.csv` | 0.00 | 4 | 3 | 0 | Dimension |
| `Dim_InventoryItemType` | `Dim_InventoryItemType.csv` | 0.00 | 4 | 7 | 0 | Dimension |
| `Dim_Month` | `Dim_Month.csv` | 0.02 | 204 | 10 | 0 | Dimension |
| `Dim_ParentStock` | `Dim_ParentStock.csv` | 0.00 | 8 | 2 | 0 | Dimension |
| `Dim_ProductCategories` | `Dim_ProductCategories.csv` | 0.00 | 20 | 5 | 0 | Dimension |
| `Dim_Products` | `Dim_Products.csv` | 5.00 | 8,376 | 63 | 0 | Dimension |
| `Dim_Stock` | `Dim_Stock.csv` | 0.00 | 10 | 8 | 0 | Dimension |
| `Dim_Unit` | `Dim_Unit.csv` | 0.02 | 122 | 13 | 0 | Dimension |
| `Dim_Year` | `Dim_Year.csv` | 0.00 | 31 | 2 | 0 | Dimension |
| `Fact_ActualProduction` | `Fact_ActualProduction.csv` | 0.40 | 4,554 | 9 | 0 | Fact / Data Mart |
| `Fact_AnalyticsDebit` | `Fact_AnalyticsDebit.csv` | 0.14 | 1,788 | 6 | 0 | Fact / Data Mart |
| `Fact_KPI_By_Product` | `Fact_KPI_By_Product.csv` | 0.11 | 1,123 | 12 | 0 | Fact / Data Mart |
| `Fact_KPI_Month` | `Fact_KPI_Month.csv` | 1.36 | 12,150 | 13 | 0 | Fact / Data Mart |
| `Fact_KPI_Year` | `Fact_KPI_Year.csv` | 0.00 | 40 | 5 | 0 | Fact / Data Mart |

> [!NOTE]
> **Xử lý dòng trùng lặp trong `DM_RevenueBySaleLedger`**: Phát hiện 428 dòng trùng lặp hoàn toàn (771 dòng liên quan) do quá trình kết xuất từ phần mềm kế toán MISA có các chứng từ nhiều trang hoặc trùng khóa import. Các dòng này sẽ được loại bỏ sạch (`drop_duplicates()`) trong pipeline làm sạch để đảm bảo không bị double-count doanh thu.

## 2. KIỂM TRA TOÀN VẸN MÔ HÌNH HÌNH SAO & KHÓA NỐI (STAR SCHEMA & JOIN AUDIT)
Đã thực hiện kiểm tra tính toàn vẹn khóa nối (Foreign Key Integrity) từ Fact chính `DM_RevenueBySaleLedger` sang các bảng Dimension:
- **Số dòng Fact ban đầu**: 229,012 dòng.
- **Nối với `Dim_Customer`** qua khóa `AccountObjectCode`:
  - Khách hàng khớp hoàn toàn: **99.09%** (227,702 / 229,012 dòng).
  - Số dòng không tìm thấy mã khách hàng: 1310 dòng (0.57%) – chủ yếu là các bút toán điều chỉnh kế toán nội bộ.
- **Nối với `Dim_Products`** qua khóa `InventoryItemCode_New`:
  - Mặt hàng khớp hoàn toàn: **100.00%** (0 dòng bị missing danh mục sản phẩm).
- **Kiểm tra Join Explosion**: Sau khi nối toàn bộ Dimension, số dòng là **229,012 dòng** (tỷ lệ 1:1, **TUYỆT ĐỐI KHÔNG BỊ BÙNG NỔ DÒNG / NO JOIN EXPLOSION**).

## 3. PHÂN TÍCH KHẢ THI CHO 3 BÀI TOÁN MACHINE LEARNING

### 3.1. Bài toán 1: Demand & Revenue Forecasting (Chuỗi thời gian)
- **Phạm vi thời gian**: Từ `2023-01-02` đến `2026-06-16` (**42 tháng liên tục**, 1.262 ngày lịch).
- **Số ngày có phát sinh giao dịch**: 1,132 ngày. Có 130 ngày không có giao dịch (chủ yếu là Chủ nhật và các kỳ nghỉ Lễ/Tết).
- **Quyết định mức độ chi tiết (Granularity)**:
  - Dữ liệu ở cấp **Tuần (Weekly)** và **Tháng (Monthly)** là lý tưởng nhất: bảo đảm tính liên tục, không bị ngắt quãng bởi ngày Chủ nhật/nghỉ lễ, bắt trọn tính mùa vụ (Seasonality) tháng Tết và chu kỳ quý.
  - Đối với cấp **Ngày (Daily)**: Có thể áp dụng dự báo cho Tổng Doanh thu toàn công ty bằng cách điền giá trị 0 cho ngày nghỉ lễ/Chủ nhật.
- **Top 5 sản phẩm chủ lực (Chiếm 57.01% tổng doanh thu toàn công ty)**:
  | Mã sản phẩm mới | Tên mặt hàng | Doanh thu tích lũy (VND) | Tỷ trọng DT | Số giao dịch |
  |---|---|---:|---:|---:|
  | `OXL-SX` | Oxy lỏng | 354,607,134,065 | 29.23% | 9,981 |
  | `NTL-SX` | Nitơ lỏng | 119,789,133,605 | 9.87% | 4,004 |
  | `OXL1` | Oxy lỏng | 92,899,626,781 | 7.66% | 3,569 |
  | `OXK6` | Oxy khí | 78,204,366,600 | 6.45% | 55,961 |
  | `OXLBON` | Oxygene lỏng | 46,095,391,325 | 3.8% | 876 |
- **Mục tiêu dự báo (Target)**:
  - Target Doanh thu: `Revenue` (VND).
  - Target Sản lượng/Nhu cầu: `MainQuantity` (Khối lượng quy chuẩn: m³ đối với khí nén, kg đối với khí lỏng). `MainQuantity` chuẩn hóa hơn `SaleAmount` (vốn là số chai/vỏ bình).

### 3.2. Bài toán 2: Customer Segmentation & B2B Churn Prediction
- **Khảo sát chu kỳ mua hàng B2B (Interpurchase Time Distribution)**:
  - Tổng số chu kỳ mua lặp lại được ghi nhận: **130,921 lượt**.
  - **Trung vị (Median)**: `3 ngày`.
  - **Phân vị 75 (75th Percentile)**: `8 ngày`.
  - **Phân vị 90 (90th Percentile)**: `21 ngày`.
  - **Phân vị 95 (95th Percentile)**: `31 ngày`.
  - **Phân vị 99 (99th Percentile)**: `89 ngày`.
  - **Tỷ lệ khách mua lại trong vòng 30 ngày**: `94.5%`.
  - **Tỷ lệ khách mua lại trong vòng 60 ngày**: `98.23%`.
  - **Tỷ lệ khách mua lại trong vòng 90 ngày**: `99.03%`.
- **Định nghĩa Churn có căn cứ khoa học (Empirical Justification)**:
  - Tại ngưỡng **60 ngày**: Đã có 98.23% khách hàng lặp lại đơn. Một khách hàng không có đơn sau 60 ngày nằm trong top 1.77% bất thường, được định nghĩa là **High Churn Risk (Nguy cơ rời bỏ cao)**.
  - Tại ngưỡng **90 ngày**: Đã có 99.03% khách hàng lặp lại đơn. Do đó, ngưỡng **90 ngày không phát sinh đơn hàng** là mốc xác định **Definitive Churn (Khách hàng thực sự rời bỏ)** chuẩn xác nhất về mặt thống kê.
- **Thiết kế cửa sổ quan sát tránh Leakage**:
  - Observation Window: Dữ liệu lịch sử đến thời điểm $T$.
  - Prediction Window: Khoảng thời gian $[T, T+90\text{ ngày}]$. Target $Y=1$ nếu khách hàng không có bất kỳ giao dịch nào trong khoảng $[T, T+90]$, ngược lại $Y=0$.

### 3.3. Bài toán 3: Credit Risk / Overdue Debt Prediction
- **Đặc điểm dữ liệu công nợ Sovigaz**:
  - Có tới **93.9%** tổng giao dịch là bán chịu ("chưa thu tiền").
  - Bảng `Fact_AnalyticsDebit` lưu trữ lát cắt công nợ tuổi nợ tại thời điểm **31/07/2026**.
  - Tổng số khách hàng có công nợ thương mại (TK 131): **584 khách hàng**.
  - Khách hàng có nợ quá hạn bất kỳ: **294 khách (50.34%)**.
  - Khách hàng có nợ quá hạn > 30 ngày: **188 khách (32.19%)**.
  - Khách hàng có nợ quá hạn > 90 ngày: **121 khách (20.72%)**.
- **Lựa chọn Đơn vị Dự đoán (Prediction Unit) & Chống Data Leakage**:
  - **Không khả thi ở Invoice-level**: Bảng `DM_RevenueBySaleLedger` không có cột ngày đến hạn thanh toán (`DueDate`) và không có ngày thanh toán thực tế của từng hóa đơn (`PaymentDate`). Nếu gán nhãn nợ của khách hàng tại 31/07/2026 cho từng hóa đơn năm 2023-2025 thì sẽ phạm lỗi **DATA LEAKAGE NẶNG NỀ**.
  - **Chọn Customer-level Credit Risk**: Dự đoán xác suất khách hàng rơi vào nợ xấu/quá hạn (> 30 ngày) dựa trên hành vi mua hàng và lịch sử giao dịch tính đến thời điểm chốt sổ sách $T$ (trước ngày lập báo cáo công nợ).

## 4. GIỚI HẠN DỮ LIỆU ĐƯỢC XÁC NHẬN (DATA LIMITATIONS)
1. **Thiếu trường Invoice Due Date & Payment Date**: Không thể xác định ngày thanh toán cho từng dòng hóa đơn riêng lẻ; bài toán Credit Risk bắt buộc phải triển khai ở cấp độ Khách hàng (Customer-level).
2. **Dữ liệu tháng 06/2026 chỉ có nửa đầu tháng**: Giao dịch bán hàng kết thúc vào ngày 2026-06-16. Khi tổng hợp theo tháng, tháng 06/2026 sẽ không đại diện cho nguyên tháng.
3. **Cột `BranchID` và `AccountObjectID` bị rỗng > 70% trong Fact**: Đã giải quyết triệt để bằng cách sử dụng `AccountObjectCode` (khớp 99.09% với `Dim_Customer`) và trích xuất chi nhánh từ `StockCode` của khách hàng.
4. **Snapshot công nợ tuổi nợ**: Dữ liệu tuổi nợ chi tiết `Fact_AnalyticsDebit` hiện chỉ có 1 kỳ chốt sổ (31/07/2026), do đó bài toán Credit Risk sẽ được xây dựng trên lát cắt này kết hợp hành vi giao dịch tích lũy trước đó.

## 5. KẾT LUẬN & KIẾN NGHỊ CHUYỂN SANG PHASE 2
Toàn bộ dữ liệu của Sovigaz đã được kiểm toán toàn diện, xác định rõ khóa chính/khóa ngoại, vai trò của từng cột và các giới hạn dữ liệu. Không phát hiện data leakage trong phương án thiết kế đề xuất.
Hệ thống đã sẵn sàng để chuyển sang **PHASE 2: XÂY DỰNG DATA PIPELINE & TIỀN XỬ LÝ DỮ LIỆU DÙNG CHUNG**.