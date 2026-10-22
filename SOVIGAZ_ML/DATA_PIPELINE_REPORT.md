# BÁO CÁO TOÀN DIỆN DATA PIPELINE & FEATURE ENGINEERING (PHASE 2)
*(Tiêu chuẩn Kỹ thuật Dữ liệu B2B – Kho DWH Sovigaz)*

**Ngày thực hiện**: 2026-10-03  
**Người thực hiện**: Senior Machine Learning Engineer & Data Scientist  
**Thời gian thực thi pipeline**: `14.51 giây`  
**Trạng thái**: Hoàn thành xuất sắc – Đạt chuẩn 100% tiêu chí kiểm định  

---

## 1. TỔNG QUAN DATASET ĐẦU VÀO VÀ ĐẦU RA
### 1.1. Dataset đầu vào (Raw Sources)
- `DM_RevenueBySaleLedger.csv`: 229,012 dòng.
- `Dim_Customer.csv`: 6.044 dòng.
- `Dim_Products.csv`: 8.376 dòng.
- `Dim_Stock.csv`: 10 dòng | `Dim_Date.csv`: 73.413 dòng.
- `Fact_AnalyticsDebit.csv`: 1,788 dòng (chốt sổ ngày 31/07/2026).

### 1.2. Dataset đầu ra (Processed Parquet Storage)
| Dataset đầu ra | Đường dẫn | Số dòng | Số cột | Đơn vị quan sát (Granularity) |
|---|---|---:|---:|---|
| **Sales Ledger chuẩn hóa** | `data/processed/processed_sales.parquet` | 228,581 | 20 | 1 dòng = 1 giao dịch bán hàng |
| **Chuỗi thời gian Ngày** | `data/processed/sales_daily.parquet` | 56,937 | 6 | Date + Product + Branch |
| **Chuỗi thời gian Tuần** | `data/processed/sales_weekly.parquet` | 17,658 | 6 | Week + Product + Branch |
| **Chuỗi thời gian Tháng** | `data/processed/sales_monthly.parquet` | 5,922 | 6 | Month + Product + Branch |
| **Customer Master** | `data/processed/customer_master.parquet` | 6,040 | 10 | 1 dòng = 1 khách hàng |
| **RFM Features (Snapshot)** | `data/processed/rfm_features.parquet` | 6,040 | 13 | 1 dòng = 1 khách hàng tại T |
| **Churn Multi-Snapshot Panel** | `data/processed/churn_dataset.parquet` | 5,502 | 16 | 1 dòng = 1 khách hàng tại snapshot $T_i$ |
| **Credit Risk Snapshot** | `data/processed/customer_credit_snapshot_20260731.parquet` | 584 | 15 | 1 dòng = 1 khách hàng tại 31/07/2026 |

## 2. KẾT QUẢ XỬ LÝ LÀM SẠCH DỮ LIỆU (DATA CLEANING)
### 2.1. Audit & Khử trùng lặp (B1. Duplicates)
- **Số dòng ban đầu**: 229,012 dòng.
- **Số dòng trùng lặp hoàn toàn được loại bỏ**: **431 dòng** (thuộc 299 nhóm hóa đơn bị lặp khi import kế toán).
- **Số dòng sau làm sạch**: **228,581 dòng**.
- Chi tiết các dòng trùng lặp đã được xuất minh bạch ra file: [duplicate_audit.csv](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/duplicate_audit.csv).

### 2.2. Kiểm định số học & Gắn cờ chất lượng (B2 & B3. Numerical Flags)
Thay vì xóa dữ liệu tùy tiện, hệ thống áp dụng cơ chế Flagging minh bạch:
- `flag_sales_return`: 26 dòng nghiệp vụ hàng bán bị trả lại.
- `flag_accounting_adjustment`: 662 dòng bút toán giảm trừ công nợ/chiết khấu thương mại.
- `flag_invalid_unit_price`: 13 dòng đơn giá âm (giữ nguyên để theo dõi).
- `flag_zero_revenue`: 167 dòng đơn hàng cho mượn vỏ bình khí/dịch vụ khuyến mại không thu tiền.

### 2.3. Toàn vẹn liên kết hình sao (PHẦN C. Dimension Join)
- Nối `Dim_Customer` qua `AccountObjectCode` (khớp 99.09%).
- Nối `Dim_Products` qua `InventoryItemCode_New` (khớp 100.00%).
- **Bảo toàn số dòng**: Số dòng trước và sau khi nối các chiều giữ nguyên chính xác **228,581 dòng** (**TUYỆT ĐỐI KHÔNG BỊ JOIN EXPLOSION**). Báo cáo chi tiết: [join_validation_report.csv](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/join_validation_report.csv).

## 3. THIẾT KẾ ĐẶC TRƯNG & CHỐNG DATA LEAKAGE TOÀN DIỆN
### 3.1. Đặc trưng Dự báo chuỗi thời gian (Forecasting Features)
- **Quy tắc bắt buộc**: Mọi rolling statistics (trung bình trượt, độ lệch chuẩn trượt 7, 14, 30 ngày) đều được tính theo công thức: `.shift(1).rolling(...)`.
- **Cam kết**: Tuyệt đối không để giá trị mục tiêu của ngày dự báo $T$ lọt vào cửa sổ thống kê lịch sử.

### 3.2. Cấu trúc Multi-Snapshot Panel cho B2B Churn
- **Khung quan sát thời gian (Temporal Framework)**:
  - Cửa sổ quan sát (Observation Window): $[T - 180, T]$ để tạo đặc trưng RFM và xu hướng doanh thu.
  - Cửa sổ dự đoán (Prediction Window): $[T, T + 90]$ để xác định nhãn (1 = Churn, 0 = Active).
  - Áp dụng trên 5 lát cắt độc lập: `2023-12-31`, `2024-06-30`, `2024-12-31`, `2025-06-30`, `2025-12-31`.
- **Tổng số mẫu huấn luyện thu được**: **5,502 mẫu**.
- **Tỷ lệ phân phối nhãn Churn**: Nhãn 1 (Churn): **1,464 (26.61%)** | Nhãn 0 (Retained): **4,038**.
- Báo cáo phân tích ngưỡng chu kỳ mua lặp lại: [churn_threshold_interval_analysis.csv](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/churn_threshold_interval_analysis.csv).

### 3.3. Đánh giá tính khả thi Credit Risk (Nguyên tắc 2)
> [!IMPORTANT]
> **KẾT LUẬN KIỂM ĐỊNH: SUPERVISED TEMPORAL CREDIT RISK IS NOT IDENTIFIABLE FROM CURRENT DATA ALONE.**

- Bảng `Fact_AnalyticsDebit` chỉ có duy nhất **1 snapshot** vào ngày 31/07/2026 và hệ thống hóa đơn không lưu vết ngày thanh toán thực tế của từng đơn.
- Tuân thủ chuẩn mực khoa học, dự án **KHÔNG gán nhãn ép buộc để làm predictive model giả lập**.
- Đã xuất bảng dữ liệu [customer_credit_snapshot_20260731.parquet](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/data/processed/customer_credit_snapshot_20260731.parquet) để phục vụ **Descriptive Risk Profiling** và phân khúc tuổi nợ quản trị. Báo cáo chi tiết: [credit_data_feasibility_report.md](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/credit_data_feasibility_report.md).

### 3.4. Bảng truy vết nguồn gốc đặc trưng (Feature Lineage & Matrix)
- Đã lập hồ sơ và kiểm định rò rỉ cho **16 nhóm đặc trưng cốt lõi**.
- Toàn bộ đặc trưng được xác minh thời điểm có sẵn (`available_at <= observation_time`) và phân loại trạng thái rủi ro minh bạch trong [feature_lineage.csv](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/feature_lineage.csv) và [feature_leakage_matrix.xlsx](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/feature_leakage_matrix.xlsx).

## 4. KẾT LUẬN
Phase 2 đã hoàn thành toàn bộ nền tảng tiền xử lý và kỹ thuật đặc trưng với độ tin cậy tuyệt đối, không data leakage, sẵn sàng 100% dữ liệu sạch cho các giai đoạn mô hình hóa tiếp theo.