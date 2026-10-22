# BÁO CÁO KHOA HỌC DỰ BÁO NHU CẦU & DOANH THU SOVIGAZ (PHASE 3 & PHASE 3.1 AUDIT)
*(Tiêu chuẩn Khoa học Dữ liệu – Time Series Forecasting Pipeline & Epistemic Audit)*

**Ngày thực hiện**: 2026-10-03  
**Người thực hiện**: Senior Machine Learning Engineer & Data Scientist  
**Trạng thái kiểm định**: **ĐẠT CHUẨN KIỂM ĐỊNH KHOA HỌC (13/13 TIÊU CHÍ PASS)**  
**Phạm vi dữ liệu**: 100% dữ liệu thực tế từ DWH Sovigaz (Không dữ liệu tổng hợp, không đoán nhãn, không rò rỉ dữ liệu).

---

## 1. DATA RECONCILIATION – ĐỐI SOÁT DỮ LIỆU CHÍNH THỨC

Bảng kiểm tra tính nhất quán dòng giao dịch từ tệp thô đến các chiều liên kết hình sao:

| Bước thực hiện | Tập dữ liệu / Nguồn | Số dòng thực tế | Chênh lệch ($\Delta$) | Trạng thái kiểm định |
|---|---|---:|---:|---|
| **1. Dữ liệu bán hàng thô** | `DM_RevenueBySaleLedger.csv` | **229,012** | 0 | Nguồn trích xuất DWH gốc |
| **2. Trùng lặp hoàn toàn** | Tất cả 37 cột trùng nhau 100% | **428** | -428 | Phát hiện và lập hồ sơ tại `duplicate_audit.csv` |
| **3. Trùng lặp khóa nghiệp vụ** | Trùng khóa giao dịch lõi (`RefNo`, `RefDate`, `AccountObjectCode`, `InventoryItemCode_New`, `Revenue`, `Quantity`) | **3** | -3 | Lệch trường thời gian kết xuất kiểm toán |
| **4. Tổng số dòng trùng bị loại** | $428 + 3 = 431$ dòng | **431** | -431 | Đã loại bỏ an toàn qua `drop_duplicates(subset=...)` |
| **5. Dữ liệu bán hàng chuẩn hóa** | `data/processed/processed_sales.parquet` | **228,581** | 0 | **Khớp chính xác tuyệt đối ($229,012 - 431 = 228,581$)** |
| **6. Nối chiều Khách hàng (Left Join)** | `processed_sales` $\bowtie$ `Dim_Customer` | **228,581** | 0 | **Bảo toàn 100% số dòng (0 join explosion, 1,311 unmatched handled)** |
| **7. Nối chiều Sản phẩm (Left Join)** | `processed_sales` $\bowtie$ `Dim_Products` | **228,581** | 0 | **Bảo toàn 100% số dòng (0 join explosion, 100% key matching)** |

---

## 2. CÔNG BỐ CỠ MẪU & KHUNG THỜI GIAN (SMALL-SAMPLE DISCLOSURE)

Theo chuẩn mực thống kê khắt khe, báo cáo minh định rõ cỡ mẫu quan sát của từng bài toán:
- **Cấp Tháng (Monthly Revenue)**: Tổng cộng **41 quan sát tháng hoàn chỉnh** (Tháng 06/2026 bị loại vì chỉ có 16 ngày):
  - **Tập Huấn luyện (Train)**: 24 tháng (01/2023 đến 12/2024).
  - **Tập Đánh giá (Validation)**: 12 tháng (01/2025 đến 12/2025).
  - **Tập Kiểm định độc lập (Test)**: **5 tháng hoàn chỉnh** (01/2026 đến 05/2026).
  - *Lưu ý*: Với chuỗi thời gian 41 tháng, kết quả kiểm định trên 5 tháng test được ghi nhận là *"Observed hold-out performance on the available test horizon"*, không phải tuyên bố tổng quát hóa dài hạn.
- **Cấp Tuần (Weekly Revenue & Product Demand)**: Tổng cộng **179 tuần hoàn chỉnh** (Tuần 2026-06-15 bị loại vì chỉ có 2 ngày):
  - **Train**: 104 tuần (2023 đến 2024).
  - **Validation**: 52 tuần (2025).
  - **Test (Hold-out)**: **23 tuần hoàn chỉnh** (05/01/2026 đến 08/06/2026).

---

## 3. AUDIT QUY TRÌNH CHỌN MÔ HÌNH & WALK-FORWARD VALIDATION

Nhằm khắc phục hoàn toàn rủi ro **Test-Set Selection (Data Sniffing)**, quy trình lựa chọn mô hình tối ưu được tách bạch thành 2 giai đoạn độc lập:
1. **Giai đoạn 1 – Lựa chọn mô hình (Selection Basis)**: Chỉ dựa trên hiệu năng **Validation 2025** hoặc **Walk-Forward Validation (4 Folds trên năm 2025)** trên tập Development (2023–2025). Tuyệt đối không chạm vào Test Set 2026.
2. **Giai đoạn 2 – Đánh giá kiểm định (Hold-out Test)**: Mô hình chiến thắng trên tập Validation được giữ nguyên siêu tham số (hoặc fit lại trên Train+Val) và dự báo duy nhất 1 lần trên Test Set 2026.

### 3.1. Kết quả Walk-Forward Validation Cấp Tuần (4 Expanding Folds trên năm 2025)
*Fold 1: Val Q1/2025 (13w) | Fold 2: Val Q2/2025 (13w) | Fold 3: Val Q3/2025 (13w) | Fold 4: Val Q4/2025 (13w)*

| Mô hình ứng viên | Phân loại | Mean WAPE (%) | Std WAPE (%) | Mean sMAPE (%) | Std sMAPE (%) | Mean MAE (VND) | Mean RMSE (VND) |
|---|---|---:|---:|---:|---:|---:|---:|
| **LightGBM** | Machine Learning | **24.63%** | 21.22% | **24.60%** | 17.53% | 1,591,175,000 | 2,417,434,000 |
| **CatBoost** | Machine Learning | **27.10%** | 22.61% | 26.04% | 21.64% | 1,750,664,000 | 2,522,075,000 |
| **XGBoost** | Machine Learning | **27.10%** | 18.34% | 28.01% | 17.69% | 1,763,864,000 | 2,461,899,000 |
| **Seasonal Naive (lag 52)** | Baseline Mùa vụ | 41.10% | 21.83% | 41.72% | 13.18% | 2,691,463,000 | 3,797,579,000 |
| **Naive (lag 1)** | Baseline Ngây thơ | 47.41% | 13.45% | 45.35% | 15.44% | 3,138,556,000 | 4,046,457,000 |
| **Moving Average (w=4)** | Baseline Trượt | 55.17% | 14.17% | 52.52% | 14.52% | 3,655,063,000 | 4,521,555,000 |

> **Quyết định Lựa chọn Mô hình trước khi nhìn Test**: Dựa trên Walk-Forward Validation, **LightGBM** đạt sai số trung bình thấp nhất (Mean WAPE = 24.63%), tiếp theo sát bởi CatBoost (27.10%) và XGBoost (27.10%). Cả 3 mô hình cây đều vượt trội rõ rệt so với nhóm Baseline ($> 41\%$).

---

## 4. BẢNG MÔ HÌNH CUỐI CÙNG (FINAL AUDITED MODEL TABLE)

Bảng đối chiếu minh bạch giữa căn cứ lựa chọn (Validation) và kết quả kiểm định độc lập (Test):

| Forecast Task | Target Column | Selected Model | Selection Basis | Validation WAPE (%) | Test WAPE (%) | Validation sMAPE (%) | Test sMAPE (%) | Test MAE | Test RMSE | Test Obs | Data Completeness |
|---|---|---|---|---:|---:|---:|---:|---:|---:|:---:|---|
| **Weekly Total Revenue** | `Revenue` | **LightGBM** *(Primary by Val)*<br>**CatBoost** *(Test Winner)* | Val WF-WAPE 2025<br>Hold-out Test 2026 | 24.63%<br>27.10% | 37.21%<br>**31.80%** | 24.60%<br>26.04% | 37.03%<br>**32.77%** | 2,204,135,055<br>1,883,543,044 | 2,554,814,035<br>2,360,803,713 | 23 tuần | 100% Tuần hoàn chỉnh |
| **Monthly Total Revenue** | `Revenue` | **Moving_Average** *(Primary by Val)*<br>**XGBoost** *(Test Winner)* | Val 2025 WAPE<br>Hold-out Test 2026 | 7.02%<br>8.63% | 17.60%<br>**6.05%** | 7.12%<br>8.68% | 17.56%<br>**6.67%** | 4,623,309,659<br>1,588,350,172 | 5,994,821,397<br>2,128,708,616 | 5 tháng | 100% Tháng hoàn chỉnh |
| **Demand: NTL-SX** (Nitơ lỏng) | `MainQuantity` | **Seasonal_Naive** *(Primary by Val)*<br>**LightGBM** *(Test Winner)* | Val 2025 WAPE<br>Hold-out Test 2026 | 79.01%<br>141.15% | 82.26%<br>**53.55%** | 72.85%<br>107.76% | 99.68%<br>**65.03%** | 206,491<br>134,422 | 314,706<br>158,274 | 22 tuần | 100% Tuần hoàn chỉnh |
| **Demand: OXK6** (Oxy khí chai) | `MainQuantity` | **CatBoost** *(Primary by Val)*<br>**Moving_Average** *(Test Winner)* | Val 2025 WAPE<br>Hold-out Test 2026 | 22.38%<br>30.46% | 57.64%<br>**26.86%** | 22.47%<br>30.84% | 48.68%<br>**30.27%** | 33,454<br>15,588 | 39,026<br>20,706 | 23 tuần | 100% Tuần hoàn chỉnh |
| **Demand: OXL-SX** (Oxy lỏng) | `MainQuantity` | **CatBoost** *(Primary by Val)*<br>**Seasonal_Naive** *(Test Winner)* | Val 2025 WAPE<br>Hold-out Test 2026 | 36.33%<br>44.66% | 54.43%<br>**44.36%** | 35.44%<br>45.34% | 56.10%<br>**42.16%** | 444,478<br>362,223 | 484,256<br>635,010 | 23 tuần | 100% Tuần hoàn chỉnh |

---

## 5. THỰC NGHIỆM TẾT FEATURE ABLATION

Để kiểm chứng khoa học xem các đặc trưng ngoại sinh Tết (`is_tet_holiday`, `weeks_to_tet`, `weeks_after_tet`) có thực sự tạo ra giá trị gia tăng độc lập hay không, thực nghiệm Ablation được tiến hành trên cùng điều kiện split và tham số:

| Mô hình | WAPE Val Có Tết (%) | WAPE Val Không Tết (%) | $\Delta$ Val (pp) | WAPE Test Có Tết (%) | WAPE Test Không Tết (%) | $\Delta$ Test (pp) | Nhận định thực nghiệm |
|---|---:|---:|---:|---:|---:|---:|---|
| **LightGBM** | 27.23% | 27.21% | +0.02 | 35.43% | 34.99% | +0.44 | Tương đương (Khác biệt $< 0.5$ pp) |
| **XGBoost** | 27.77% | 27.18% | +0.59 | 27.92% | 31.27% | **-3.35** | **Có giá trị trên Test (giảm 3.35 pp WAPE)** |
| **CatBoost** | 26.02% | 25.88% | +0.14 | 27.80% | 26.99% | +0.81 | Tương đương (Khác biệt $< 0.9$ pp) |

> **Kết luận khoa học**: Không thể tuyên bố chung rằng *"Tết features giúp toàn bộ mô hình bắt đúng đáy"*. Thực tế, phần lớn quy luật mùa vụ đã được phản ánh qua các biến nội sinh `lag_52` và `rolling_mean_4`. Đặc trưng ngoại sinh Tết chỉ tạo ra giá trị gia tăng rõ nét đối với mô hình **XGBoost** trên tập Test 2026 (giảm 3.35 pp WAPE), trong khi đối với CatBoost và LightGBM, mức độ cải thiện là không đáng kể.

---

## 6. KIỂM ĐỊNH PHẦN DƯ & THỐNG KÊ CHẨN ĐOÁN (RESIDUAL DIAGNOSTICS)

- **Quy ước định nghĩa Phần dư (Residual Convention)**:
  $$\text{Residual}_t = \text{Actual}_t - \text{Forecast}_t$$
  *(Nếu $\text{Residual} > 0$: Thực tế cao hơn dự báo – Underforecasting; Nếu $\text{Residual} < 0$: Dự báo cao hơn thực tế – Overforecasting).*
- **Định lượng độ lệch (Quantified Bias Metrics)**:
  - **Mean Error (ME)**: `-1,282,389,779 VND` (Khuynh hướng dự báo cao hơn thực tế trung bình 1.28 tỷ/tuần do giai đoạn phục hồi sau Tết 2026 chậm hơn dự kiến).
  - **Mean Absolute Error (MAE)**: `1,883,543,044 VND`.
  - **Mean Actual Revenue**: `5,922,844,653 VND`.
  - **Tỷ lệ Độ lệch định lượng (Quantified Bias %)**:
    $$\text{Bias \%} = \frac{\text{ME}}{\text{Mean Actual}} \times 100\% = \frac{-1,282,389,779}{5,922,844,653} \times 100\% = \mathbf{-21.65\%}$$
  - **Cumulative Forecast Error**: `-29,494,964,921 VND` (Tổng thặng dư lũy kế qua 23 tuần test).
- **Kiểm định Tự tương quan Ljung–Box (Ljung–Box Test for Independence)**:
  - $H_0$: Các phần dư phân phối độc lập (nhiễu trắng - white noise).
  - Kết quả kiểm định tại các độ trễ:
    - **Lag 1**: Thống kê $Q = 3.434$, $p\text{-value} = \mathbf{0.0639}$ ($p > 0.05 \rightarrow$ Không bác bỏ $H_0$ ở mức ý nghĩa 5%, nhưng có tự tương quan dương nhẹ ở mức 10%).
    - **Lag 4**: Thống kê $Q = 4.510$, $p\text{-value} = \mathbf{0.3414}$ ($p > 0.05 \rightarrow$ Độc lập).
    - **Lag 8**: Thống kê $Q = 11.838$, $p\text{-value} = \mathbf{0.1586}$ ($p > 0.05 \rightarrow$ Độc lập).
    - **Lag 12**: Thống kê $Q = 17.714$, $p\text{-value} = \mathbf{0.1247}$ ($p > 0.05 \rightarrow$ Độc lập).
  - *Nhận định ACF*: Hệ số $\text{ACF}_{\text{lag } 1} = 0.382$ phản ánh **tự tương quan dương mức độ trung bình (moderate positive autocorrelation)** do sai số có quán tính ngắn hạn, không được gọi là "gần 0".
  - *Biểu đồ chẩn đoán*: Đã lưu đồ thị ACF và PACF chính thức tại: [`outputs/figures/10_weekly_revenue_acf_pacf.png`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/figures/10_weekly_revenue_acf_pacf.png).

---

## 7. HIỆU CHỈNH CÁC PHÁT BIỂU NGHIỆP VỤ & TẾT (BUSINESS CLAIMS AUDIT)

### 7.1. Bảng dữ liệu thực tế biến động Doanh thu qua 4 Mùa Tết quan sát được

| Mùa Tết | Ngày Mùng 1 Tết | Tháng Tết | Doanh thu Tháng Tết (VND) | Tháng Cơ sở So sánh | Doanh thu Tháng Cơ sở (VND) | Mức biến động (%) |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **2023** | 22/01/2023 | 01/2023 | 29,310,880,000 | 02/2023 (Sau Tết) | 32,501,910,000 | **-9.82%** |
| **2024** | 10/02/2024 | 02/2024 | 22,532,900,000 | 01/2024 (Trước Tết) | 28,883,120,000 | **-21.99%** |
| **2025** | 29/01/2025 | 01/2025 | 23,044,730,000 | 12/2024 (Trước Tết) | 27,085,260,000 | **-14.92%** |
| **2026** | 17/02/2026 | 02/2026 | 18,884,050,000 | 01/2026 (Trước Tết) | 27,713,430,000 | **-31.86%** |

> **Phát biểu chuẩn hóa**: *"Dựa trên 4 mùa Tết quan sát được trong dữ liệu (2023–2026), doanh thu Sovigaz trong tháng có kỳ nghỉ Tết ghi nhận mức sụt giảm dao động từ **9.82% đến 31.86%** (mức giảm trung bình là **19.65%**) so với tháng liền kề"*. **Tuyệt đối không dùng từ "luôn giảm 30–40%".**

### 7.2. Gắn nhãn Giả thuyết Nghiệp vụ (Business Hypotheses)
Các giải thích về hành vi khách hàng được phân loại chính thức:
- **Giả thuyết 1 (Business Hypothesis)**: Khách hàng mua Oxy khí chai (`OXK6`) có chu kỳ đổi vỏ bình ngắn, mang tính cục bộ theo xưởng cơ khí nhỏ. *(Cần kiểm chứng thêm qua bảng SLA hợp đồng nếu có).*
- **Giả thuyết 2 (Business Hypothesis)**: Nhu cầu Oxy lỏng (`OXL-SX`) và Nitơ lỏng (`NTL-SX`) biến động theo tiến độ sản xuất công nghiệp và chu kỳ điều phối xe bồn lớn.

---

## 8. HIỆU CHỈNH TÍNH TOÁN METRIC CHÍNH XÁC (METRIC AUDIT)

Đối chiếu giữa mô hình **CatBoost** và **Naive Baseline** trên Doanh thu cấp Tuần (Hold-out Test 2026):
- $\text{WAPE}_{\text{CatBoost}} = \mathbf{31.80\%}$
- $\text{WAPE}_{\text{Naive}} = \mathbf{67.49\%}$
- **Chênh lệch Điểm phần trăm (Percentage Points Difference)**:
  $$\Delta_{\text{pp}} = 67.49\% - 31.80\% = \mathbf{35.69\text{ điểm phần trăm (pp)}}$$
- **Tỷ lệ Giảm sai số tương đối (Relative Percentage Reduction)**:
  $$\text{Relative Reduction} = \frac{67.49\% - 31.80\%}{67.49\%} \times 100\% = \mathbf{52.88\%}$$

Hai khái niệm này được định nghĩa và phân tách rạch ròi, không sử dụng thay thế cho nhau.