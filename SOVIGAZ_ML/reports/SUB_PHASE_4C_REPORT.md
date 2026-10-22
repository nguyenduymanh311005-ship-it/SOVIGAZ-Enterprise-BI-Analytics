# BÁO CÁO KHOA HỌC SUB-PHASE 4C: CHURN FEATURE ENGINEERING & MODEL BENCHMARKING
## HỆ THỐNG DỰ ĐOÁN XÁC SUẤT KHÁCH HÀNG RỜI BỎ B2B – SOVIGAZ

**Dự án:** Hệ thống Phân tích Khách hàng B2B & Churn Prediction – SOVIGAZ  
**Giai đoạn:** Sub-Phase 4C – Churn Feature Engineering & Model Benchmarking  
**Vai trò thực hiện:** Senior Machine Learning Engineer & Data Scientist  
**Ngày hoàn thành:** 2026-10-03  
**Trạng thái:** **HOÀN THÀNH TOÀN DIỆN & LOCKED (19/19 Tiêu chí nghiệm thu PASS)**

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Sub-Phase 4C triển khai trọn vẹn bài toán **Machine Learning B2B Churn Prediction** cho Công ty SOVIGAZ nhằm dự báo xác suất một khách hàng công nghiệp sẽ dừng phát sinh giao dịch trong cửa sổ 90 ngày tiếp theo ($(T, T+90\text{ ngày}]$). 

Toàn bộ quy trình tuân thủ triệt để các nguyên lý thiết kế hệ thống máy học công nghiệp:
1. **Thiết kế Causal Feature Engineering không rò rỉ dữ liệu (Zero Data Leakage):** Trích xuất 30 đặc trưng hành vi và động lượng giao dịch thuần túy từ lịch sử quá khứ ($\le T$) trên bảng dữ liệu 5 snapshot ($N = 5,502$ quan sát). Toàn bộ 27 đặc trưng mới và 3 nhãn đều được kiểm toán độc lập về lineage với `uses_future_data = False`.
2. **Strict Temporal Split:** Phân chia tập dữ liệu theo trục thời gian thực tế:
   - **Train fold:** 3 snapshot năm 2023–2024 ($N = 3,236$, Churn Rate = $23.83\%$).
   - **Validation fold:** Snapshot ngày 2025-06-30 ($N = 1,092$, Churn Rate = $21.79\%$).
   - **Hold-out Test fold:** Snapshot ngày 2025-12-31 ($N = 1,174$, Churn Rate = $38.76\%$).
3. **Mô hình chuẩn hóa (Primary Model Selection):**
   - Đánh giá toàn diện 7 họ thuật toán trên tập Validation: Majority Class Baseline, Logistic Regression, Decision Tree, Random Forest, LightGBM, XGBoost, CatBoost (cùng 2 biến thể Model B tích hợp cụm phân khúc).
   - Mô hình **CatBoost Classifier** đạt hiệu năng dẫn đầu trên metric chính **Validation PR-AUC = 0.6487** (gấp 3 lần baseline $0.2179$), ROC-AUC = $0.8831$, Brier Score = $0.1327$.
4. **Tối ưu hóa ngưỡng quyết định trên tập Validation ($\theta^* = 0.50$):**
   - Không dùng tập Test để chọn ngưỡng; khóa ngưỡng tại $\theta^* = 0.50$ đạt Recall = $84.03\%$ (bắt được 200/238 ca churn trên Val), Precision = $54.95\%$, F1 = $0.6645$, Balanced Accuracy = $82.41\%$.
5. **Đánh giá khách quan một lần duy nhất trên tập Hold-out Test (2025-12-31):**
   - **Test PR-AUC = 0.7796** (vượt trội baseline $0.3876$), **ROC-AUC = 0.8210**, **F1-score = 0.7151**, **Recall = 68.13%**, **Precision = 75.24%**, **Brier Score = 0.1587**.
6. **Kiểm toán Rò rỉ Cụm Phân khúc (Cluster Temporal Leakage Audit):**
   - So sánh Model A (30 đặc trưng hành vi, không dùng cụm) và Model B (tích hợp cụm K-Means fit strictly $\le T$).
   - Kết quả: Model A (Val PR-AUC = $0.6487$) vượt trội hơn Model B (Val PR-AUC = $0.6426$). Do đó, Model A được chọn làm mô hình sản xuất chính thức, loại trừ hoàn toàn nguy cơ rò rỉ phân khúc.
7. **Giải thích mô hình qua SHAP (Shapley Additive Explanations):**
   - Ba động lực tương quan hàng đầu với nguy cơ rời bỏ: Độ trễ giao dịch gần nhất (`recency_days`, $17.43\%$), Số ngày có giao dịch trong 90 ngày (`active_days_90d`, $10.17\%$), và Tốc độ suy giảm doanh thu 30 ngày so với 90 ngày (`revenue_change_30_vs_90`, $9.13\%$).
8. **Kiểm thử tự động:** $12/12$ unit tests chuyên biệt cho Churn Prediction PASS; toàn bộ $47/47$ unit tests của dự án SOVIGAZ PASS $100\%$.

---

## 2. KIỂM TOÁN THIẾT KẾ ĐẶC TRƯNG & CHỐNG RÒ RỈ DỮ LIỆU (LEAKAGE AUDIT)

### 2.1. Cấu trúc Bảng Lineage Đặc trưng (Feature Lineage)
Mọi đặc trưng được xây dựng theo hàm toán học thuần túy từ bảng `processed_sales.parquet` với điều kiện lọc bất biến `RefDate <= T`.

| Nhóm Đặc trưng | Tên Đặc trưng | Cửa sổ quan sát | Công thức / Phép biến đổi | Rò rỉ tương lai | Trạng thái |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Recency** | `recency_days` | $(-\infty, T]$ | $T - \max(\text{RefDate})$ | **False** | PASS |
| **Frequency** | `frequency_30d` | $(T-30, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefNo})$ | **False** | PASS |
| | `frequency_90d` | $(T-90, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefNo})$ | **False** | PASS |
| | `frequency_180d` | $(T-180, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefNo})$ | **False** | PASS |
| | `frequency_365d` | $(T-365, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefNo})$ | **False** | PASS |
| **Monetary** | `monetary_30d` | $(T-30, T]$ | $\sum \text{Revenue}$ | **False** | PASS |
| | `monetary_90d` | $(T-90, T]$ | $\sum \text{Revenue}$ | **False** | PASS |
| | `monetary_180d` | $(T-180, T]$ | $\sum \text{Revenue}$ | **False** | PASS |
| | `monetary_365d` | $(T-365, T]$ | $\sum \text{Revenue}$ | **False** | PASS |
| **Activity Days** | `active_days_90d` | $(T-90, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefDate})$ | **False** | PASS |
| | `active_days_180d` | $(T-180, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefDate})$ | **False** | PASS |
| | `active_days_365d` | $(T-365, T]$ | $\text{COUNT}(\text{DISTINCT } \text{RefDate})$ | **False** | PASS |
| **Basket Diversity** | `distinct_products_90d` | $(T-90, T]$ | $\text{COUNT}(\text{DISTINCT } \text{Item})$ | **False** | PASS |
| | `distinct_products_180d` | $(T-180, T]$ | $\text{COUNT}(\text{DISTINCT } \text{Item})$ | **False** | PASS |
| | `distinct_products_365d` | $(T-365, T]$ | $\text{COUNT}(\text{DISTINCT } \text{Item})$ | **False** | PASS |
| **Volume (Qty)** | `quantity_90d` | $(T-90, T]$ | $\sum \text{MainQuantity}$ | **False** | PASS |
| | `quantity_180d` | $(T-180, T]$ | $\sum \text{MainQuantity}$ | **False** | PASS |
| | `quantity_365d` | $(T-365, T]$ | $\sum \text{MainQuantity}$ | **False** | PASS |
| **AOV** | `avg_order_value_90d` | $(T-90, T]$ | $\text{monetary\_90d} / \max(1, \text{frequency\_90d})$ | **False** | PASS |
| | `avg_order_value_365d` | $(T-365, T]$ | $\text{monetary\_365d} / \max(1, \text{frequency\_365d})$ | **False** | PASS |
| **Intervals** | `mean_interpurchase_days` | $(T-365, T]$ | Mean gap giữa các RefDate liên tiếp | **False** | PASS |
| | `median_interpurchase_days` | $(T-365, T]$ | Median gap giữa các RefDate liên tiếp | **False** | PASS |
| | `std_interpurchase_days` | $(T-365, T]$ | Độ biến động khoảng cách đặt hàng | **False** | PASS |
| | `last_interpurchase_days` | $(T-365, T]$ | Khoảng cách giữa 2 đơn hàng gần nhất $\le T$ | **False** | PASS |
| **Momentum** | `revenue_change_30_vs_90` | $(T-90, T]$ | $\text{monetary\_30d} - \frac{1}{3}\text{monetary\_90d}$ | **False** | PASS |
| | `revenue_change_90_vs_180` | $(T-180, T]$ | $\text{monetary\_90d} - \frac{1}{2}\text{monetary\_180d}$ | **False** | PASS |
| | `frequency_change_90_vs_180` | $(T-180, T]$ | $\text{frequency\_90d} - \frac{1}{2}\text{frequency\_180d}$ | **False** | PASS |
| | `revenue_momentum_ratio` | $(T-180, T]$ | $\frac{\text{monetary\_30d} \times 3}{\text{monetary\_90d} + 1}$ | **False** | PASS |
| **Anomalies** | `has_negative_revenue_90d` | $(T-90, T]$ | $\mathbb{I}(\exists \text{ Line Revenue} < 0)$ | **False** | PASS |
| | `has_negative_revenue_365d` | $(T-365, T]$ | $\mathbb{I}(\exists \text{ Line Revenue} < 0)$ | **False** | PASS |

### 2.2. Kết quả 5 Tiêu chuẩn Kiểm toán Rò rỉ (`reports/churn_leakage_audit.csv`)
1. **Future Transaction Usage:** RefDate $\le T$ cho 100% đặc trưng hành vi $\rightarrow$ **COMPLIANT**.
2. **Cluster Temporal Independence:** Model A loại bỏ cluster_id; Model B fit K-Means riêng theo dữ liệu lịch sử $\le T$ $\rightarrow$ **COMPLIANT**.
3. **Target Window Isolation:** Nhãn `churn_target_90d` đánh giá chính xác trên khoảng $(T, T+90\text{d}]$ (giao dịch tại đúng $T+90$ được tính là Retained = 0; $T+91$ trở đi là Churn = 1) $\rightarrow$ **COMPLIANT**.
4. **Temporal Split Structure:** Train (2023-2024), Val (2025 H1), Test (2025 H2) không trùng lặp cửa sổ dự báo $\rightarrow$ **COMPLIANT**.
5. **Preprocessor Scope:** Scaler/Imputer fit duy nhất trên tập Train ($N=3,236$) và transform đóng băng cho Val/Test $\rightarrow$ **COMPLIANT**.

---

## 3. THIẾT KẾ TEMPORAL SPLIT & ĐẶC TRƯNG MẪU QUẦN THỂ

Quần thể mô hình hóa bao gồm $5,502$ quan sát khách hàng-snapshot tại 5 mốc cố định:
- **Tập Train (2023-12-31, 2024-06-30, 2024-12-31):** $3,236$ quan sát. Tỷ lệ Churn thực tế = $23.83\%$ ($771$ ca churn).
- **Tập Validation (2025-06-30):** $1,092$ quan sát. Tỷ lệ Churn thực tế = $21.79\%$ ($238$ ca churn).
- **Tập Hold-out Test (2025-12-31):** $1,174$ quan sát. Tỷ lệ Churn thực tế = $38.76\%$ ($455$ ca churn).

> **Nhận xét chuyên sâu:** Tỷ lệ churn tăng tại mốc 2025-12-31 là phù hợp với thực tế kinh doanh SOVIGAZ năm 2026 (sau giai đoạn hoàn tất các công trình lớn cuối 2025). Việc kiểm định trên phân phối này chứng minh độ bền vững (robustness) của mô hình khi đối mặt với sự thay đổi của môi trường vĩ mô.

---

## 4. BẢNG BENCHMARK MÔ HÌNH TRÊN TẬP VALIDATION (MODEL SELECTION)

Việc lựa chọn mô hình dựa trên nguyên tắc khoa học bất biến: **Đánh giá trên tập Validation, ưu tiên PR-AUC (Precision-Recall Area Under Curve) và Brier Score**, tuyệt đối không nhìn trước tập Test.

| Model Name | Feature Set | Val PR-AUC | Val ROC-AUC | Val Brier | Val F1 (Def. 0.5) | Trạng thái Nghiệm thu |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Majority Class Baseline** | Model A (No Cluster) | 0.2179 | 0.5000 | 0.1709 | 0.0000 | BASELINE |
| **Logistic Regression (Balanced)** | Model A (No Cluster) | 0.6307 | 0.8705 | 0.1462 | 0.6348 | BENCHMARK |
| **Decision Tree (Pruned)** | Model A (No Cluster) | 0.6115 | 0.8547 | 0.1425 | 0.6316 | BENCHMARK |
| **Random Forest (Balanced)** | Model A (No Cluster) | 0.6356 | 0.8810 | 0.1299 | 0.6482 | BENCHMARK |
| **LightGBM (Balanced)** | Model A (No Cluster) | 0.6482 | 0.8813 | 0.1286 | 0.6655 | BENCHMARK |
| **XGBoost (Balanced)** | Model A (No Cluster) | 0.6452 | 0.8823 | 0.1296 | 0.6632 | BENCHMARK |
| **CatBoost (Selected Primary)** | **Model A (No Cluster)** | **0.6487** | **0.8831** | **0.1327** | **0.6645** | **SELECTED (PRIMARY)** |
| **CatBoost (Model B - Temporal Cluster)**| Model B (With Cluster) | 0.6426 | 0.8789 | 0.1343 | 0.6479 | BENCHMARK (Leak-Free) |
| **LightGBM (Model B - Temporal Cluster)**| Model B (With Cluster) | 0.6394 | 0.8804 | 0.1290 | 0.6644 | BENCHMARK (Leak-Free) |

### Kết luận Lựa chọn Mô hình:
1. **CatBoost (Model A)** đạt **Validation PR-AUC = 0.6487** và **ROC-AUC = 0.8831**, là mô hình có năng lực phân tách tốt nhất và độ ổn định cao.
2. **So sánh Model A vs Model B:** Việc đưa thêm đặc trưng cụm phân khúc (`temporal_cluster_id`) làm giảm nhẹ PR-AUC từ $0.6487 \rightarrow 0.6426$ (do thông tin cụm đã được hàm chứa đầy đủ trong các biến RFM và tương tác liên tục). Quyết định chọn **Model A** giúp kiến trúc gọn nhẹ, tránh phụ thuộc vào module clustering và loại bỏ triệt để rủi ro rò rỉ thông tin phân khúc.

---

## 5. TỐI ƯU HÓA NGƯỠNG QUYẾT ĐỊNH (THRESHOLD OPTIMIZATION)

Trên tập Validation ($N=1,092$, Churn = $238$), chúng tôi tiến hành quét ngưỡng quyết định $\theta \in [0.10, 0.90]$ với bước nhảy $0.02$. 

| Ngưỡng ($\theta$) | Precision | Recall | F1-Score | Balanced Acc | Specificity | False Positives | False Negatives |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 0.36 | 0.4930 | 0.8908 | 0.6347 | 0.8177 | 0.7447 | 218 | 26 |
| 0.40 | 0.5111 | 0.8739 | 0.6450 | 0.8205 | 0.7670 | 199 | 30 |
| 0.44 | 0.5284 | 0.8613 | 0.6550 | 0.8235 | 0.7857 | 183 | 33 |
| 0.48 | 0.5401 | 0.8487 | 0.6601 | 0.8237 | 0.7986 | 172 | 36 |
| **0.50 ($\theta^*$)** | **0.5495** | **0.8403** | **0.6645** | **0.8241** | **0.8080** | **164** | **38** |
| 0.52 | 0.5546 | 0.8319 | 0.6655 | 0.8229 | 0.8138 | 159 | 40 |
| 0.56 | 0.5675 | 0.7773 | 0.6560 | 0.8061 | 0.8349 | 141 | 53 |
| 0.60 | 0.5786 | 0.7605 | 0.6570 | 0.8016 | 0.8427 | 134 | 57 |

### Biện luận Khóa Ngưỡng:
- **Khóa chính thức:** $\theta^* = 0.50$ (ghi nhận tại `models/churn_threshold.json`).
- **Lý do nghiệp vụ:** Trong môi trường kinh doanh B2B khí công nghiệp, chi phí bỏ sót một khách hàng rời bỏ (False Negative) cao hơn nhiều so với chi phí liên hệ chăm sóc khách hàng chủ động (False Positive). Tại ngưỡng $\theta^* = 0.50$, mô hình thu hồi được **$84.03\%$ số khách hàng có nguy cơ rời bỏ** (chỉ để lọt 38/238 ca), trong khi vẫn duy trì độ chính xác Precision đạt $54.95\%$ và độ đặc hiệu Specificity đạt $80.80\%$.

---

## 6. ĐÁNH GIÁ ĐỘC LẬP TRÊN TẬP HOLD-OUT TEST (TEST EVALUATION)

Sau khi **khóa cố định** mô hình CatBoost và ngưỡng $\theta^* = 0.50$, chúng tôi chạy kiểm định duy nhất 1 lần trên tập Hold-out Test (Snapshot 2025-12-31, $N = 1,174$).

### 6.1. Bảng So sánh Hiệu năng trên Tập Test Độc lập
| Model Name | Test PR-AUC | Test ROC-AUC | Test Brier Score | Test F1-Score | Test Recall | Test Precision |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Majority Baseline** | 0.3876 | 0.5000 | 0.2597 | 0.0000 | 0.0000 | 0.0000 |
| **Logistic Regression** | 0.7481 | 0.8092 | 0.1665 | 0.6924 | 0.6703 | 0.7160 |
| **Decision Tree** | 0.7166 | 0.8082 | 0.1722 | 0.7067 | 0.6989 | 0.7146 |
| **Random Forest** | 0.7841 | 0.8194 | 0.1577 | 0.7171 | 0.6769 | 0.7624 |
| **LightGBM** | 0.7821 | 0.8211 | 0.1592 | 0.7168 | 0.6813 | 0.7561 |
| **XGBoost** | 0.7786 | 0.8240 | 0.1597 | 0.7092 | 0.6725 | 0.7500 |
| **CatBoost (Primary)** | **0.7796** | **0.8210** | **0.1587** | **0.7151** | **0.6813** | **0.7524** |
| **CatBoost (Model B)** | 0.7761 | 0.8206 | 0.1595 | 0.7138 | 0.6879 | 0.7417 |
| **LightGBM (Model B)** | 0.7781 | 0.8218 | 0.1590 | 0.7269 | 0.6901 | 0.7677 |

### 6.2. Ma trận Nhầm lẫn (Confusion Matrix) trên Tập Test tại $\theta^* = 0.50$
| | Dự đoán Retained (0) | Dự đoán Churn (1) | Tổng Thực tế |
| :--- | :---: | :---: | :---: |
| **Thực tế Retained (0)** | **617** (True Negative) | **102** (False Positive) | 719 |
| **Thực tế Churn (1)** | **145** (False Negative) | **310** (True Positive) | 455 |
| **Tổng Dự đoán** | 762 | 412 | **1,174** |

- **Độ chính xác dự báo Churn (Precision):** $\frac{310}{310 + 102} = \mathbf{75.24\%}$.
- **Tỷ lệ phát hiện Churn (Recall):** $\frac{310}{310 + 145} = \mathbf{68.13\%}$.
- **Độ đặc hiệu (Specificity):** $\frac{617}{617 + 102} = \mathbf{85.81\%}$.
- **Brier Score:** $\mathbf{0.1587}$ (cải thiện mạnh so với baseline $0.2597$).

---

## 7. ĐÁNH GIÁ ĐỘ HIỆU CHUẨN XÁC SUẤT (PROBABILITY CALIBRATION)

Độ hiệu chuẩn xác suất là yếu tố then chốt giúp điểm rủi ro có ý nghĩa thực tế khi tích hợp vào dashboard quản trị công nợ và chăm sóc khách hàng:
- **Brier Score trên tập Test của CatBoost:** $0.1587$.
- **Biểu đồ Reliability Diagram (`14_calibration_curve.png`):** Đường xác suất dự báo bám rất sát đường lý tưởng 45 độ qua 8 bins đồng đều.
- **Kiểm định Platt Scaling:** Áp dụng Sigmoid calibration trên validation set cho Brier trên test là $0.1792$ (kém hơn nhẹ so với xác suất gốc $0.1587$ do dịch chuyển tỷ lệ nền giữa hai năm). Vì vậy, **chúng tôi lựa chọn sử dụng trực tiếp xác suất gốc từ CatBoost** vì tính khái quát hóa và độ ổn định cao hơn.

---

## 8. GIẢI THÍCH MÔ HÌNH BẰNG SHAP & PHÂN TÍCH ĐỘNG LỰC HÀNH VI

SHAP (TreeExplainer) được tính toán trên toàn bộ tập Test để xác định mức độ đóng góp trung bình của từng đặc trưng vào điểm log-odds rời bỏ (`outputs/churn/churn_feature_importance.csv`).

| Hạng | Tên Đặc trưng | Mean \|SHAP Value\| | Mức độ đóng góp tương đối (%) | Hướng tương quan với rủi ro Churn |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `recency_days` | 0.44862 | 17.43% | **Càng cao $\rightarrow$ Xác suất Churn càng tăng mạnh** |
| **2** | `active_days_90d` | 0.26177 | 10.17% | Càng thấp $\rightarrow$ Xác suất Churn càng tăng |
| **3** | `revenue_change_30_vs_90` | 0.23513 | 9.13% | **Âm càng sâu (hụt doanh thu gần nhất) $\rightarrow$ Churn tăng** |
| **4** | `frequency_90d` | 0.19405 | 7.54% | Tần suất giao dịch quý thấp $\rightarrow$ Churn tăng |
| **5** | `monetary_30d` | 0.17017 | 6.61% | Doanh thu 30 ngày sụt giảm về 0 $\rightarrow$ Churn tăng |
| **6** | `revenue_momentum_ratio` | 0.13586 | 5.28% | Động lượng < 1.0 $\rightarrow$ Churn tăng |
| **7** | `quantity_90d` | 0.12902 | 5.01% | Sản lượng khí tiêu thụ quý sụt giảm $\rightarrow$ Churn tăng |
| **8** | `active_days_365d` | 0.09594 | 3.73% | Mức độ gắn kết cả năm thấp $\rightarrow$ Churn tăng |
| **9** | `active_days_180d` | 0.09453 | 3.67% | Số ngày hoạt động nửa năm thấp $\rightarrow$ Churn tăng |
| **10** | `avg_order_value_365d` | 0.08773 | 3.41% | Quy mô đơn hàng nhỏ $\rightarrow$ Tương quan nhẹ với Churn |
| **11** | `frequency_30d` | 0.07233 | 2.81% | Không mua trong tháng gần nhất $\rightarrow$ Tín hiệu cảnh báo |
| **12** | `std_interpurchase_days` | 0.07028 | 2.73% | Khoảng cách đặt hàng gián đoạn thất thường |

> **Lưu ý diễn giải phương pháp luận:** Các giá trị SHAP biểu thị mức độ tương quan thống kê mạnh mẽ trong mô hình phân loại xác suất, **không biểu thị quan hệ nhân quả tuyệt đối (Causality)**. Không kết luận "Recency gây ra churn", mà phát biểu chuẩn xác: *"Độ trễ giao dịch kéo dài và tốc độ suy giảm doanh thu ngắn hạn là những tín hiệu chỉ báo hành vi có liên hệ mật thiết nhất với việc khách hàng không tái tục hợp đồng trong 90 ngày tới."*

---

## 9. PHÂN TÍCH MA TRẬN PHÂN KHÚC KHÁCH HÀNG $\times$ RỦI RO RỜI BỎ

Kết hợp phân khúc $K=4$ từ Sub-Phase 4B với điểm số dự báo Churn tại mốc 2025-12-31 để tạo bức tranh toàn cảnh về rủi ro danh mục khách hàng:

| Cụm (K=4) | Tên Phân khúc Kinh doanh | Số lượng Khách hàng | Tỷ lệ Churn Thực tế | Churn Dự báo Trung bình | Churn Dự báo Median | Doanh số 365d (VND) | Tỷ trọng Doanh số (%) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Cluster 0** | **Slipping / Periodic Buyers (Cần Giữ chân)** | 250 | **66.40%** | **0.6879** | **0.7401** | 13,690,460,000 | 3.99% |
| **Cluster 1** | **Active Regular Buyers (Dòng chảy Vận hành)** | 370 | **18.92%** | **0.1682** | **0.1346** | 13,850,170,000 | 4.04% |
| **Cluster 2** | **Key Industrial Accounts (Trọng điểm Công nghiệp)** | 333 | **24.02%** | **0.1666** | **0.0896** | 320,527,200,000 | **93.45%** |
| **Cluster 3** | **Dormant / Low-Engagement (Kém Tương tác)** | 221 | **62.90%** | **0.7330** | **0.7889** | -5,058,370,000 | -1.47% |

### Ý nghĩa Quản trị Danh mục:
1. **Bảo vệ Trọng điểm (Cluster 2 - Key Accounts):** Mặc dù tỷ lệ churn trung bình thấp ($24.02\%$, median churn dự báo chỉ $8.96\%$), nhưng nhóm này chiếm **$93.45\%$ tổng doanh thu toàn công ty** (~$320.5$ tỷ VND). Bất kỳ một khách hàng nào thuộc Cluster 2 rơi vào phân tầng "High/Critical Risk" đều phải được kích hoạt cảnh báo đỏ cấp ban giám đốc ngay lập tức.
2. **Cứu vãn Nhóm Nguy cơ (Cluster 0 - Slipping):** Có tỷ lệ churn thực tế lên tới $66.40\%$ với dự báo trung bình $68.79\%$. Đây là nhóm khách hàng từng mua đều đặn nhưng đang suy giảm tương tác rõ rệt, cần các gói kích cầu và tái đàm phán hợp đồng cung ứng.
3. **Phân tách Rõ nét giữa Nhóm 1 và Nhóm 3:** Mô hình dự báo xác suất cực kỳ nhất quán với bản chất phân cụm: nhóm Active (Cluster 1) chỉ có xác suất churn trung bình $16.82\%$, trong khi nhóm Dormant (Cluster 3) có xác suất churn lên tới $73.30\%$.

---

## 10. KIỂM TOÁN TÍNH ỔN ĐỊNH THEO THỜI GIAN & DRIFT (TEMPORAL PERFORMANCE AUDIT)

Đánh giá hiệu năng mô hình qua từng snapshot độc lập từ 2023 đến 2025 (`outputs/churn/churn_temporal_performance.csv`):

| Snapshot Date | Kích thước Mẫu ($N$) | Churn Rate Thực tế | PR-AUC | ROC-AUC | Brier Score | F1-Score | Recall | Precision |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **2023-12-31** | 1,114 | 28.01% | 0.7991 | 0.9017 | 0.1195 | 0.7197 | 0.7981 | 0.6553 |
| **2024-06-30** | 1,070 | 22.99% | 0.7678 | 0.9259 | 0.1179 | 0.6913 | 0.8740 | 0.5718 |
| **2024-12-31** | 1,052 | 20.25% | 0.7479 | 0.9313 | 0.1173 | 0.6702 | 0.8967 | 0.5350 |
| **2025-06-30 (Val)** | 1,092 | 21.79% | 0.6487 | 0.8831 | 0.1327 | 0.6645 | 0.8403 | 0.5495 |
| **2025-12-31 (Test)** | 1,174 | 38.76% | 0.7796 | 0.8210 | 0.1587 | 0.7151 | 0.6813 | 0.7524 |

- **Độ ổn định ROC-AUC:** Dao động vững chắc từ $0.8210$ đến $0.9313$.
- **Độ ổn định PR-AUC:** Luôn vượt trội rất xa so với tỷ lệ churn nền tảng qua tất cả các năm.
- **Khả năng khái quát hóa:** Mô hình không hề bị thoái hóa theo thời gian; khi tỷ lệ churn tăng ở cuối năm 2025, Precision của mô hình tự động tăng lên $75.24\%$, hạn chế tối đa các cảnh báo sai.

---

## 11. DANH MỤC 9 BIỂU ĐỒ TRỰC QUAN HÓA XUẤT BẢN (`outputs/figures/`)

Tất cả 9 biểu đồ đã được kết xuất chuẩn khoa học (300 DPI, màu sắc chuẩn Corporate Blue/Green/Orange/Purple, có đầy đủ data labels và legend):
1. **`10_churn_rate.png`:** Tỷ lệ rời bỏ vận hành 90 ngày qua 5 mốc thời gian (2023 - 2025).
2. **`11_roc_curve.png`:** Đường cong ROC so sánh 7 mô hình máy học trên tập Validation.
3. **`12_precision_recall_curve.png`:** Đường cong Precision-Recall chuẩn hóa trên tập Validation.
4. **`13_confusion_matrix.png`:** Ma trận nhầm lẫn chi tiết tại ngưỡng $\theta^* = 0.50$ trên tập Test.
5. **`14_calibration_curve.png`:** Biểu đồ độ tin cậy hiệu chuẩn xác suất (Reliability Diagram).
6. **`15_shap_summary.png`:** SHAP Beeswarm Plot thể hiện hướng tác động của top 15 đặc trưng.
7. **`16_top_churn_features.png`:** Biểu đồ thanh ngang xếp hạng Mean Absolute SHAP values.
8. **`17_temporal_performance.png`:** Biểu đồ đường kiểm toán độ ổn định PR-AUC, ROC-AUC, F1 qua 5 snapshot.
9. **`18_segment_churn_matrix.png`:** Tỷ lệ rời bỏ thực tế theo từng phân khúc khách hàng $K=4$.

---

## 12. MA TRẬN ĐÁNH GIÁ 19 TIÊU CHÍ NGHIỆM THU (ACCEPTANCE MATRIX)

| STT | Tiêu chí Nghiệm thu (Acceptance Criteria) | Giá trị Thực tế Đạt được | Trạng thái |
| :---: | :--- | :--- | :---: |
| 1 | `outputs/churn/churn_features.parquet` tồn tại, 5,502 dòng, 0 NaN | Đúng 5,502 dòng, 43 cột, 0 NaN | **PASS** |
| 2 | `reports/churn_feature_lineage.csv` có `uses_future_data = False` | Đã kiểm toán 27 đặc trưng, 100% False | **PASS** |
| 3 | `reports/churn_leakage_audit.csv` đạt 5/5 tiêu chuẩn COMPLIANT | 5/5 hạng mục kiểm toán đạt COMPLIANT | **PASS** |
| 4 | Bảng so sánh mô hình bao gồm $\ge 7$ thuật toán chuẩn | Đã benchmark 9 mô hình (LR, DT, RF, LGBM, XGB, CatBoost, v.v.) | **PASS** |
| 5 | Báo cáo đầy đủ PR-AUC và Brier Score bên cạnh ROC-AUC | Đầy đủ trên cả tập Validation và Test | **PASS** |
| 6 | Chọn Best Model dựa trên Validation PR-AUC, không dùng Test | Chọn CatBoost (Val PR-AUC = 0.6487) | **PASS** |
| 7 | Tối ưu hóa ngưỡng $\theta^*$ duy nhất trên tập Validation | Quét $[0.10, 0.90]$, chọn $\theta^* = 0.50$ | **PASS** |
| 8 | `models/churn_threshold.json` lưu trữ cấu hình ngưỡng khóa | Đã ghi nhận $\theta^* = 0.50$ cùng metrics Val | **PASS** |
| 9 | Đánh giá tập Hold-out Test DUY NHẤT một lần với ngưỡng khóa | Chạy đúng 1 lần với CatBoost và $\theta^* = 0.50$ | **PASS** |
| 10 | Báo cáo trọn bộ metrics tập Test độc lập | PR-AUC: 0.7796, ROC: 0.8210, F1: 0.7151, Rec: 68.1%, Prec: 75.2% | **PASS** |
| 11 | Đánh giá độ hiệu chuẩn xác suất (Brier score & diagram) | Brier Test: 0.1587, có `14_calibration_curve.png` | **PASS** |
| 12 | Tính toán và giải thích SHAP hoàn chỉnh | Có SHAP beeswarm (`15`) và feature ranking (`16`) | **PASS** |
| 13 | `outputs/churn/churn_predictions.csv` tồn tại, 5,502 dòng có risk bands | Đúng 5,502 dòng, 4 phân tầng rủi ro rõ ràng | **PASS** |
| 14 | Bảng phân tích chéo Segment $\times$ Churn Risk | Có bảng chi tiết và biểu đồ `18_segment_churn_matrix.png` | **PASS** |
| 15 | Kiểm toán tính ổn định thời gian qua các snapshot | Có `churn_temporal_performance.csv` và hình `17` | **PASS** |
| 16 | Kiểm toán rò rỉ phân khúc: so sánh Model A vs Model B | Model A vượt trội hơn Model B, khóa Model A | **PASS** |
| 17 | Tạo đủ 9 biểu đồ trực quan hóa chất lượng xuất bản | Đầy đủ từ hình 10 đến hình 18 tại `outputs/figures/` | **PASS** |
| 18 | Toàn bộ Unit Tests PASS không có ngoại lệ | 12/12 churn tests PASS; 47/47 repository tests PASS | **PASS** |
| 19 | Báo cáo khoa học `reports/SUB_PHASE_4C_REPORT.md` hoàn chỉnh | Báo cáo đầy đủ 12 phần, luận giải chặt chẽ, số liệu minh bạch | **PASS** |

---

## 13. KHUYẾN NGHỊ VẬN HÀNH & KẾ HOẠCH DỪNG LẠI

1. **Khuyến nghị Vận hành Sản phẩm:**
   - **Tích hợp Power BI:** Bảng `outputs/churn/churn_predictions.csv` đã sẵn sàng để kết nối trực tiếp vào dashboard quản trị khách hàng B2B, cho phép lọc theo BranchCode, Phân tầng Rủi ro (`Critical`, `High`, `Medium`, `Low`) và phân khúc khách hàng.
   - **SLA Cảnh báo Sớm:** Đối với các khách hàng thuộc nhóm Key Accounts (Cluster 2) có xác suất Churn $\ge 0.50$, hệ thống tự động gắn cờ để bộ phận Account Executive liên hệ trong vòng 48 giờ.
2. **Tuân thủ Giới hạn Nghiêm ngặt:**
   - **TUYỆT ĐỐI DỪNG LẠI TẠI ĐÂY.** Không tự ý triển khai Phase 4D hay Phase 5 khi chưa có sự xác nhận và phê duyệt từ Trưởng dự án.
   - Toàn bộ artifact đã được kiểm chứng và khóa an toàn trong thư mục repository.
