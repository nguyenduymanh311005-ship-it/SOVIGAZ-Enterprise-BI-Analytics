# BÁO CÁO KIỂM TOÁN VÀ CHUẨN HÓA DIỄN GIẢI SHAP (SHAP AUDIT)
## SUB-PHASE 4C.1: CHURN MODEL HARDENING – SOVIGAZ

**Dự án:** Hệ thống Phân tích Khách hàng B2B & Churn Prediction – SOVIGAZ  
**Mô hình được giải thích:** `best_churn_model.joblib` (CatBoostClassifier, Model A – 30 đặc trưng)  
**Tập dữ liệu giải thích:** Hold-out Test Set (Snapshot 2025-12-31, $N = 1,174$)  
**Loại Explainer:** `shap.TreeExplainer` (tối ưu hóa cho mô hình cây quyết định)  
**Artifact kiểm toán:** `outputs/churn/churn_feature_importance.csv`, `outputs/figures/15_shap_summary.png`, `outputs/figures/16_top_churn_features.png`  
**Ngày thực hiện:** 2026-10-04  
**Trạng thái kiểm toán:** **PASS — CÔNG THỨC TOÁN HỌC XÁC THỰC & CHUẨN HÓA PHI NHÂN QUẢ**

---

## 1. NGUỒN GỐC VÀ CÔNG THỨC TÍNH TOÁN SHAP

### 1.1. Mã nguồn Thực thi
Quy trình tính toán SHAP được thực thi tại hàm `compute_shap_explainability(best_model, test)` trong tệp `SOVIGAZ_ML/src/models/churn_benchmark.py` (dòng 356–382).

Đặc trưng đầu vào: $30$ đặc trưng hành vi và động lượng thuộc `FEATURE_COLS_A` được trích xuất trên tập Test ($N = 1,174$). Hoàn toàn không chứa nhãn mục tiêu, định danh khách hàng hay dữ liệu sau thời điểm $T = 2025\text{-}12\text{-}31$.

### 1.2. Công thức Định lượng Tỷ trọng Tương đối
Với $N = 1,174$ quan sát trong tập Test và $P = 30$ đặc trưng, giá trị đóng góp Shapley của đặc trưng thứ $j$ cho quan sát thứ $i$ được ký hiệu là $\phi_{i,j}$ (trên không gian log-odds biên của mô hình CatBoost).

1. **Mean Absolute SHAP Value (Giá trị SHAP Tuyệt đối Trung bình):**
   $$\bar{\Phi}_j = \frac{1}{N} \sum_{i=1}^N |\phi_{i,j}|$$

2. **Tỷ trọng Tương đối của Mean Absolute SHAP Value (%):**
   $$\text{relative\_importance\_pct}_j = \frac{\bar{\Phi}_j}{\sum_{k=1}^P \bar{\Phi}_k} \times 100\%$$

Tổng tỷ trọng của toàn bộ 30 đặc trưng:
$$\sum_{j=1}^{30} \text{relative\_importance\_pct}_j = 100.04\% \quad (\text{sai số làm tròn } 2 \text{ chữ số thập phân})$$

---

## 2. BẢNG XẾP HẠNG TOP 15 ĐẶC TRƯNG HÀNH VI QUAN TRỌNG NHẤT

Dữ liệu đối chiếu trực tiếp từ `outputs/churn/churn_feature_importance.csv`:

| Hạng | Tên Đặc trưng | Mean \|SHAP Value\| ($\bar{\Phi}_j$) | Tỷ trọng Tương đối (%) | Chiều hướng Tương quan Thống kê | Diễn giải Hành vi Chuẩn mực (Phi Nhân quả) |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | `recency_days` | 0.44862 | **17.43%** | Tương quan dương với log-odds Churn | Khoảng cách ngày kể từ lần mua gần nhất càng lớn, mô hình dự báo xác suất rời bỏ càng cao. |
| **2** | `active_days_90d` | 0.26177 | **10.17%** | Tương quan âm với log-odds Churn | Số ngày có phát sinh giao dịch trong quý gần nhất càng ít, mô hình dự báo xác suất rời bỏ càng tăng. |
| **3** | `revenue_change_30_vs_90` | 0.23513 | **9.13%** | Tương quan âm với log-odds Churn | Doanh thu 30 ngày sụt giảm mạnh so với trung bình quý (độ lệch âm lớn) là chỉ báo hành vi nguy cơ cao. |
| **4** | `frequency_90d` | 0.19405 | **7.54%** | Tương quan âm với log-odds Churn | Số hóa đơn mua hàng trong 90 ngày thấp báo hiệu sự suy giảm gắn kết trong vận hành. |
| **5** | `monetary_30d` | 0.17017 | **6.61%** | Tương quan âm với log-odds Churn | Doanh thu 30 ngày gần nhất giảm về 0 phản ánh trạng thái ngừng mua hàng đột ngột. |
| **6** | `revenue_momentum_ratio` | 0.13586 | **5.28%** | Tương quan âm với log-odds Churn | Tỷ lệ động lượng doanh thu suy thoái dưới mức 1.0 đồng pha với xác suất churn cao. |
| **7** | `quantity_90d` | 0.12902 | **5.01%** | Tương quan âm với log-odds Churn | Tổng sản lượng khí công nghiệp tiêu thụ quý sụt giảm. |
| **8** | `active_days_365d` | 0.09594 | **3.73%** | Tương quan âm với log-odds Churn | Tần suất gắn kết cả năm ở mức thấp. |
| **9** | `active_days_180d` | 0.09453 | **3.67%** | Tương quan âm với log-odds Churn | Số ngày hoạt động nửa năm thấp. |
| **10** | `avg_order_value_365d` | 0.08773 | **3.41%** | Tương quan phi tuyến | Quy mô giá trị đơn hàng trung bình năm nhỏ. |
| **11** | `frequency_30d` | 0.07233 | **2.81%** | Tương quan âm với log-odds Churn | Không phát sinh đơn hàng trong tháng gần nhất. |
| **12** | `std_interpurchase_days` | 0.07028 | **2.73%** | Tương quan dương với log-odds Churn | Khoảng cách giữa các lần đặt hàng biến động thất thường, gián đoạn chu kỳ. |
| **13** | `frequency_365d` | 0.06993 | **2.72%** | Tương quan âm với log-odds Churn | Tổng số lần mua hàng cả năm thấp. |
| **14** | `revenue_change_90_vs_180` | 0.06887 | **2.68%** | Tương quan âm với log-odds Churn | Tốc độ suy giảm doanh thu trung hạn (quý gần nhất so với quý trước). |
| **15** | `mean_interpurchase_days` | 0.05476 | **2.13%** | Tương quan dương với log-odds Churn | Chu kỳ trung bình giữa các lần đặt hàng kéo dài. |

---

## 3. QUY CHUẨN NGÔN NGỮ KHOA HỌC BẮT BUỘC (EPISTEMIC LANGUAGE STANDARDS)

Để bảo đảm tính trung thực khoa học, báo cáo dự án và toàn bộ tài liệu kỹ thuật phải tuân thủ nghiêm ngặt 4 nguyên tắc phân định:

### 3.1. Danh xưng Chuẩn hóa
- **Thuật ngữ bắt buộc:** *"Tỷ trọng tương đối của Mean Absolute SHAP Value"* (Relative share of mean absolute SHAP value).
- **Thuật ngữ NGHIÊM CẤM sử dụng:**
  - ❌ *"Phần trăm nguyên nhân gây churn"* (gây hiểu nhầm là nguyên nhân gốc rễ).
  - ❌ *"Tỷ lệ churn do đặc trưng gây ra"* (ngụy biện nhân quả).
  - ❌ *"Tác động nhân quả của biến lên quyết định rời bỏ"* (không có căn cứ A/B testing).
  - ❌ *"Phần trăm khả năng dự báo tăng thêm nhờ feature"* (đây là SHAP attribution, không phải ablation gain).

### 3.2. Bốn Tầng Khái niệm Phải Phân biệt Rõ
1. **Global Feature Importance (SHAP):** Độ lớn trung bình của sự đóng góp vào đầu ra log-odds của mô hình máy học trên một tập quần thể cố định.
2. **Local Signed SHAP Values:** Tác động đẩy xác suất dự đoán lên cao hoặc xuống thấp cho từng khách hàng cụ thể tại thời điểm $T$.
3. **Statistical Association (Mối liên hệ tương quan thống kê):** Quan sát thấy hai biến số cùng biến thiên trong dữ liệu lịch sử quan sát được.
4. **Causality (Quan hệ Nhân quả):** Sự thay đổi can thiệp chủ động vào biến $X$ dẫn tới sự thay đổi có thể dự đoán được của biến $Y$. SHAP thuần túy **không thể và không được phép** dùng để chứng minh quan hệ nhân quả nếu thiếu thiết kế nghiên cứu nhân quả (như Randomized Controlled Trial, Instrumental Variables, hay Regression Discontinuity).

---

## 4. KẾT LUẬN KIỂM TOÁN
Phần giải thích SHAP trong Sub-Phase 4C:
1. Đã tính đúng trên tập Hold-out Test độc lập bằng explainer chuẩn (`TreeExplainer`).
2. Tỷ lệ phần trăm tính theo đúng công thức chuẩn tắc $\bar{\Phi}_j / \sum \bar{\Phi}_k$.
3. Toàn bộ ngôn ngữ diễn giải trong báo cáo chính thức đã được khóa chuẩn mực phi nhân quả, đảm bảo tính liêm chính học thuật và độ tin cậy khi chuyển giao sang ứng dụng thực tiễn.
