# BÁO CÁO KIỂM ĐỊNH SUB-PHASE 4A: DATA AUDIT + RFM SNAPSHOT ENGINEERING
*(Dự án: Hệ thống Machine Learning B2B – SOVIGAZ)*

**Ngày thực hiện**: 2026-10-03  
**Người thực hiện**: Senior Machine Learning Engineer & Data Scientist  
**Trạng thái Sub-Phase 4A**: **HOÀN THÀNH 100% – ĐẠT TOÀN BỘ TIÊU CHÍ PRE-FLIGHT (8/8 UNIT TESTS PASS)**  
**Quy tắc kiểm soát**: **DỪNG LẠI TẠI ĐÂY – KHÔNG TỰ Ý THỰC HIỆN SUB-PHASE 4B**.

---

## 1. PRE-FLIGHT AUDIT & ĐỐI SOÁT BASELINE SO VỚI PHASE 2

Toàn bộ dữ liệu đầu vào đã được đối soát thực nghiệm, khớp chính xác 100% với các cam kết từ Phase 2:

| Chỉ số / Thực thể | Giá trị Yêu cầu (Baseline Phase 2) | Giá trị Thực tế Kiểm định | Trạng thái | Ghi chú kỹ thuật |
|---|:---:|:---:|:---:|---|
| **Dữ liệu bán hàng sạch** (`processed_sales.parquet`) | **228,581 dòng** | **228,581 dòng** | **PASS** | Đúng 229,012 thô - 431 trùng lặp |
| **Khách hàng trong Master** (`customer_master.parquet`) | **6,040 khách hàng** | **6,040 khách hàng** | **PASS** | Duy nhất 1 dòng / `CustomerCode` |
| **Khách hàng phát sinh giao dịch trong Sales** | **2,204 khách hàng** | **2,204 khách hàng** | **PASS** | `AccountObjectCode` nunique trong sales |
| **Khách hàng sales khớp `Dim_Customer`** | **2,183 khách hàng** | **2,183 khách hàng** | **PASS** | 21 mã (1,311 dòng) xử lý left join an toàn |
| **Số lượng Churn Snapshots** | **5 snapshots** | **5 snapshots** | **PASS** | 2023-12-31, 2024-06-30, 2024-12-31, 2025-06-30, 2025-12-31 |
| **Snapshot 2026-03-31 Exclusion** | **Bị loại bỏ bắt buộc** | **Đã loại bỏ** | **PASS** | Do sales chỉ đến 16/06/2026 (<90 ngày tương lai) |
| **Tổng số mẫu Multi-Snapshot Churn Cohort** | **5,502 mẫu** | **5,502 mẫu** | **PASS** | Bảng `rfm_snapshot.parquet` bảo toàn 1:1 |

---

## 2. KIỂM ĐỊNH KHÓA CHÍNH KHÁCH HÀNG (CUSTOMER KEY INTEGRITY)

- **Khóa chính định danh khách hàng**: Khẳng định dùng duy nhất **`AccountObjectCode`** (Mã đối tượng kế toán khách hàng).
- **Tỷ lệ Null**: **0.00%** (Không có bất kỳ dòng giao dịch nào bị thiếu mã khách hàng).
- **Tính duy nhất trong Customer Master**: `customer_master.parquet` có 6,040 dòng tương ứng đúng 6,040 mã `CustomerCode` (tỷ lệ trùng 0%).
- **Cam kết phương pháp luận**: Tuyệt đối **không phân cụm hoặc dự báo trên `AccountObjectID`** vì đây là surrogate key nội bộ, không có ý nghĩa định danh nghiệp vụ thực tế.

---

## 3. KIẾN TRÚC RFM THEO SNAPSHOT (CHỐNG TOÀN DIỆN DATA LEAKAGE)

### 3.1. Phê phán và bãi bỏ Static Whole-History RFM
- **Lỗi phương pháp luận nghiêm trọng**: Nếu gộp chung toàn bộ 3.5 năm dữ liệu (2023–2026) để tính RFM cho mỗi khách hàng rồi lấy RFM đó đi huấn luyện mô hình dự báo Churn tại các thời điểm quá khứ (ví dụ 31/12/2023), mô hình sẽ bị **Look-ahead Leakage** nghiêm trọng (sử dụng doanh thu và đơn hàng của các năm 2024, 2025 để đoán churn của năm 2023).
- **Kiến trúc Point-in-Time Snapshot chuẩn mực**:
  Tạo cấu trúc bảng đa thời điểm (Panel Data): `CustomerCode` $\times$ `snapshot_date`.
  Tại mỗi thời điểm chốt sổ $T$, mô hình chỉ được phép "nhìn về quá khứ" (tức $t \le T$). Tuyệt đối 0 giao dịch sau $T$ được lọt vào tập đặc trưng.

### 3.2. Quy cách tính toán 3 thành tố RFM tại thời điểm $T$
- **Recency(T)**:
  $$\text{Recency}(T) = T - \max(\{ \text{RefDate} \le T \}) \quad (\text{đơn vị: ngày})$$
- **Frequency(T)**: Số giao dịch hợp lệ phát sinh trong cửa sổ quan sát trước $T$.
- **Monetary(T)**: Tổng doanh thu thuần (`Revenue`) phát sinh trong cửa sổ quan sát trước $T$.

---

## 4. AUDIT & SO SÁNH CÁC CỬA SỔ QUAN SÁT (90d vs 180d vs 365d)

Bảng so sánh thực nghiệm tác động của độ dài cửa sổ quan sát (Lookback Window) trên 5,502 mẫu khách hàng:

| Cửa sổ quan sát | Median Frequency | Mean Frequency | Tỷ lệ Freq = 0 (%) | Median Monetary (VND) | Mean Monetary (VND) | Skewness Monetary | Đánh giá & Khuyến nghị sử dụng |
|---|---:|---:|---:|---:|---:|---:|---|
| **90 Ngày** *(Quý)* | 6.0 | 15.36 | **12.36% (680 KH)** | 7,256,520 | 81,484,493 | 20.02 | **Quá ngắn**: 12.36% khách hàng có Freq = 0 dù vẫn đang hoạt động; gây nhiễu điểm 0 giả tạo. |
| **180 Ngày** *(Bán niên)* | 11.0 | 29.60 | **0.00% (0 KH)** | 16,938,660 | 160,311,036 | 19.22 | **Rất tốt cho Churn Monitoring**: Cân bằng sát với chu kỳ đánh giá rủi ro rời bỏ khách hàng định kỳ bán niên. |
| **365 Ngày** *(Cả năm)* | **23.0** | **56.95** | **0.00% (0 KH)** | **33,627,128** | **312,360,306** | 19.77 | **TỐI ƯU NHẤT CHO SEGMENTATION**: Phản ánh trọn vẹn chu kỳ ngân sách và hạn mức tiêu thụ khí B2B cả năm của doanh nghiệp. |

> **Khuyến nghị chuẩn mực**: Sử dụng cửa sổ **365 ngày** làm bộ đặc trưng nòng cốt cho bài toán **Phân khúc khách hàng (Clustering)**, đồng thời giữ cả 3 cấp độ (90d, 180d, 365d) trong bảng `rfm_snapshot.parquet` để phục vụ trích xuất đặc trưng xu hướng (Momentum) cho bài toán Churn.

---

## 5. PHÂN TÍCH PHÂN PHỐI & TIỀN XỬ LÝ (SKEWNESS REDUCTION)

Dữ liệu doanh nghiệp B2B có độ lệch phải (Right-skewed) cực kỳ lớn do một số ít nhà máy thép và bệnh viện tiêu thụ hàng chục tỷ VND, trong khi phần lớn cơ sở nhỏ chỉ tiêu thụ vài chục triệu VND.

### 5.1. Bảng đo lường Skewness trước và sau biến đổi Log1p & Robust Scaling

| Đặc trưng | Skewness gốc | Min | P25 | Median | P75 | P95 | P99 | Max | Skewness sau Log1p |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **`recency_days`** | **+1.74** | 0.0 | 2.0 | 8.0 | 41.0 | 135.0 | 170.0 | 180.0 | **+0.15** *(Chuẩn mực hình chuông)* |
| **`frequency_365d`** | **+5.74** | 1.0 | 8.0 | 23.0 | 59.0 | 235.0 | 508.0 | 1,667.0 | **+0.13** *(Gần đối xứng hoàn hảo)* |
| **`monetary_365d`** | **+19.77** | -3.55 tỷ | 7.37 tr | 33.63 tr | 140.78 tr | 1.21 tỷ | 4.39 tỷ | 52.38 tỷ | **-1.09** *(Triệt tiêu triệt để đuôi phải)* |

### 5.2. Xử lý các giá trị Doanh thu âm (Negative Monetary Handling)
- **Kiểm toán dữ liệu**: Có đúng **12 trường hợp (chiếm 0.22% tổng số 5,502 mẫu)** có doanh thu ròng âm trong cửa sổ quan sát do các chứng từ giảm giá kế toán hoặc hàng bán bị trả lại.
- **Phương pháp tiền xử lý minh bạch (Không xóa dữ liệu tùy tiện)**:
  - Công thức: `log_monetary = np.log1p(np.maximum(0.0, monetary))`
  - Tạo kèm cờ chỉ báo: `has_negative_revenue_365d = (monetary < 0).astype(int)`
  - Sử dụng **`RobustScaler`** (dựa trên Median và IQR) để chuẩn hóa cho thuật toán phân cụm, ngăn chặn hoàn toàn việc các giá trị cực trị làm sai lệch trọng tâm cụm.
- **Biểu đồ phân phối**: Đã vẽ và lưu biểu đồ trực quan đối chiếu 6 đồ thị con tại [`outputs/figures/customer/01_rfm_distribution.png`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/figures/customer/01_rfm_distribution.png).

---

## 6. PHÂN TÍCH ĐỘ NHẠY NGƯỠNG CHURN (CHURN SENSITIVITY AUDIT)

Định nghĩa Churn 90 ngày được coi là **Operational Working Definition** (Định nghĩa vận hành). Bảng kiểm toán dưới đây đo lường mức độ nhạy cảm của nhãn khi thay đổi ngưỡng sang 60 ngày và 120 ngày:

| Snapshot Date | Ngưỡng 60 Ngày (Tỷ lệ Churn %) | Ngưỡng 90 Ngày (Tỷ lệ Churn % - Chuẩn) | Ngưỡng 120 Ngày (Tỷ lệ Churn %) | Số lượng Khách Churned (90d) | Số lượng Khách Retained (90d) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **2023-12-31** | 31.51% | **28.01%** | 26.30% | 312 | 802 |
| **2024-06-30** | 26.82% | **22.99%** | 20.09% | 246 | 824 |
| **2024-12-31** | 25.38% | **20.25%** | 17.78% | 213 | 839 |
| **2025-06-30** | 25.37% | **21.79%** | 19.69% | 238 | 854 |
| **2025-12-31** | 41.23% | **38.76%** | 37.22% | 455 | 719 |
| **Trung bình** | **30.06%** | **26.61%** | **24.22%** | **Tổng: 1,464** | **Tổng: 4,038** |

> **Nhận xét thực nghiệm**:
> - Tỷ lệ Churn giảm đơn điệu theo thời gian mở rộng cửa sổ (từ 30.06% tại 60d xuống 24.22% tại 120d).
> - Ngưỡng 90 ngày (26.61%) là điểm gãy cân bằng hoàn hảo, phù hợp với P90 của khoảng cách giữa hai lần mua hàng trong ngành khí (P90 = 21 ngày, 90 ngày tương đương gấp hơn 4 lần chu kỳ mua P90).

---

## 7. KIỂM ĐỊNH BIÊN NHÃN CHURN THỰC NGHIỆM (CHURN BOUNDARY AUDIT)

Bảng đối soát mẫu thực tế xác nhận tính nhất quán của quy ước ranh giới tại ngày $T+90$:

| Nhóm trường hợp | Khách hàng mẫu | Snapshot $T$ | Giao dịch cuối trước $T$ | Giao dịch đầu sau $T$ | Số ngày sau $T$ | Nhãn Churn 90d | Phán quyết ranh giới (Boundary Verdict) |
|---|---|:---:|:---:|:---:|:---:|:---:|---|
| **Đúng ngày ranh giới T+90** | `CTTHTHANH` | 2024-12-31 | 2024-09-30 | **2025-03-31** | **90.0** | **0 (Retained)** | **BẢO LƯU (0)**: Giao dịch phát sinh đúng ngày thứ 90 tính là nằm trong cửa sổ dự đoán $(T, T+90]$. |
| **Đúng ngày ranh giới T+91** | `CTBV001` | 2024-12-31 | 2024-12-20 | **2025-04-01** | **91.0** | **1 (Churned)** | **RỜI BỎ (1)**: Giao dịch phát sinh ngày thứ 91 (vượt ngoài cửa sổ 90 ngày); trong 90 ngày có 0 đơn hàng. |
| **Mua hàng ngay sau T** | `BDBV78` | 2024-12-31 | 2024-12-24 | **2025-01-02** | **2.0** | **0 (Retained)** | **BẢO LƯU (0)**: Mua hàng chỉ sau 2 ngày chốt sổ. |
| **Không bao giờ mua lại** | `BDNL17` | 2024-12-31 | 2024-10-23 | *Không có* | $\infty$ | **1 (Churned)** | **RỜI BỎ (1)**: Ngừng mua hoàn toàn trong toàn bộ lịch sử tương lai. |

---

## 8. MA TRẬN NGUỒN GỐC ĐẶC TRƯNG & RỦI RO RÒ RỈ DỮ LIỆU (LEAKAGE MATRIX)

File chi tiết đã được lưu tại [`reports/feature_leakage_matrix_4a.csv`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/feature_leakage_matrix_4a.csv):

| Tên Đặc trưng | Bảng nguồn | Cửa sổ dữ liệu | Thời điểm khả dụng | Quy tắc tính toán | Sử dụng dữ liệu tương lai? | Đánh giá Rò rỉ |
|---|---|:---:|:---:|---|:---:|:---:|
| `recency_days` | `processed_sales` | $(-\infty, T]$ | $T$ | $T - \max(\text{RefDate})$ | **KHÔNG** | **PASS** |
| `frequency_90d` | `processed_sales` | $[T-90d, T]$ | $T$ | $\text{count}(\text{RefNo})$ | **KHÔNG** | **PASS** |
| `monetary_90d` | `processed_sales` | $[T-90d, T]$ | $T$ | $\sum \text{Revenue}$ | **KHÔNG** | **PASS** |
| `frequency_180d` | `processed_sales` | $[T-180d, T]$ | $T$ | $\text{count}(\text{RefNo})$ | **KHÔNG** | **PASS** |
| `monetary_180d` | `processed_sales` | $[T-180d, T]$ | $T$ | $\sum \text{Revenue}$ | **KHÔNG** | **PASS** |
| `frequency_365d` | `processed_sales` | $[T-365d, T]$ | $T$ | $\text{count}(\text{RefNo})$ | **KHÔNG** | **PASS** |
| `monetary_365d` | `processed_sales` | $[T-365d, T]$ | $T$ | $\sum \text{Revenue}$ | **KHÔNG** | **PASS** |
| `order_count_365d`| `processed_sales` | $[T-365d, T]$ | $T$ | $\text{nunique}(\text{RefNo})$ | **KHÔNG** | **PASS** |
| `interpurchase_mean_days` | `processed_sales` | $[T-365d, T]$ | $T$ | Khoảng cách ngày trung bình | **KHÔNG** | **PASS** |
| `revenue_momentum_ratio` | `processed_sales` | $[T-180d, T]$ | $T$ | $\text{Rev}_{90d} / \text{Rev}_{180d}$ | **KHÔNG** | **PASS** |
| `churn_target_90d` | `processed_sales` | $(T, T+90d]$ | $T+90d$ | Nhãn mục tiêu độc lập | **DÙNG LÀM TARGET ONLY** | **PASS** |

---

## 9. KẾT QUẢ UNIT TESTS SUB-PHASE 4A

Đã tạo và thực thi tệp kiểm thử tự động [`tests/test_rfm_snapshot.py`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/tests/test_rfm_snapshot.py):
- `test_customer_key_not_null`: **PASS**
- `test_no_duplicate_customer_snapshot_key`: **PASS**
- `test_expected_row_count` (5,502 rows): **PASS**
- `test_snapshots_preserved` (đủ 5 mốc, không có mốc 2026-03-31): **PASS**
- `test_recency_non_negative`: **PASS**
- `test_no_future_leakage_in_features` (kiểm tra ngẫu nhiên 50 khách hàng): **PASS**
- `test_churn_labels_binary` (chỉ nhận giá trị {0, 1}): **PASS**
- `test_artifacts_exist` (đủ 7 file artifacts trên ổ đĩa): **PASS**

*(Toàn bộ hệ thống kiểm thử dự án hiện đạt **20/20 unit tests PASS 100%**).*

---

## 10. DANH MỤC ARTIFACTS ĐÃ TẠO

1. [`outputs/customer_segmentation/rfm_snapshot.parquet`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/customer_segmentation/rfm_snapshot.parquet): 5,502 dòng $\times$ 37 cột đặc trưng đa thời điểm.
2. [`outputs/customer_segmentation/rfm_summary_stats.csv`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/customer_segmentation/rfm_summary_stats.csv): Thống kê mô tả và skewness trước/sau biến đổi.
3. [`outputs/customer_segmentation/rfm_window_comparison.csv`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/customer_segmentation/rfm_window_comparison.csv): So sánh định lượng 3 cửa sổ 90d, 180d, 365d.
4. [`outputs/churn/churn_sensitivity_analysis.csv`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/churn/churn_sensitivity_analysis.csv): Phân tích độ nhạy ngưỡng rời bỏ 60d, 90d, 120d.
5. [`outputs/churn/churn_label_boundary_audit.csv`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/churn/churn_label_boundary_audit.csv): Bằng chứng thực nghiệm ranh giới ngày thứ 90 và 91.
6. [`reports/feature_leakage_matrix_4a.csv`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/feature_leakage_matrix_4a.csv): Bảng truy xuất nguồn gốc và kiểm định rò rỉ đặc trưng.
7. [`outputs/figures/customer/01_rfm_distribution.png`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/outputs/figures/customer/01_rfm_distribution.png): Đồ thị trực quan phân phối trước và sau chuẩn hóa.
8. Mã nguồn: [`src/features/rfm_snapshot_builder.py`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/src/features/rfm_snapshot_builder.py).
9. Kiểm thử: [`tests/test_rfm_snapshot.py`](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/tests/test_rfm_snapshot.py).

---

## 11. XIN Ý KIẾN CHUYỂN SANG SUB-PHASE 4B

Theo quy tắc bắt buộc của Phần XLVIII: **Tôi DỪNG LẠI tại đây sau khi hoàn thành Sub-Phase 4A.**

Xin bạn vui lòng xem xét toàn bộ kết quả kiểm toán dữ liệu và kỹ thuật đặc trưng RFM Snapshot trên. Khi bạn đã hoàn toàn hài lòng và xác nhận, tôi sẽ tiếp tục thực hiện **SUB-PHASE 4B: K-MEANS + GMM + CLUSTER VALIDATION (Thử nghiệm $K=2 \rightarrow 8$, đo lường Silhouette, CH, DB, AIC/BIC, kiểm tra Cluster Stability qua Adjusted Rand Index Bootstrap, và xây dựng Customer Segment Profiles)**.
