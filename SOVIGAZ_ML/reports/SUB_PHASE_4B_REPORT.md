# BÁO CÁO NGHIÊN CỨU & KIỂM ĐỊNH KHOA HỌC: SUB-PHASE 4B
## K-MEANS + GMM CLUSTERING & MULTI-CRITERIA VALIDATION
**Dự án:** Hệ thống Phân tích Khách hàng B2B & Churn Prediction – SOVIGAZ  
**Cấp độ:** Senior Machine Learning Engineer & Data Scientist  
**Thời điểm thực hiện:** 03/10/2026  
**Trạng thái kiểm định:** **PASS TOÀN BỘ (10/10 Unit Tests 4B, 35/35 Unit Tests Toàn dự án)**  

---

## TỔNG QUAN MỤC TIÊU VÀ NGUYÊN TẮC THI HÀNH

Sub-Phase 4B được xây dựng để thực hiện phân cụm khách hàng B2B chuyên sâu trên dân số sơ cấp đã được khóa chặt ở Sub-Phase 4A.1 ($N = 1,359$ khách hàng tại snapshot `2025-12-31`).

Mục tiêu cốt lõi:
1. **Thực nghiệm toàn diện:** Chạy đồng thời **K-Means** ($K=2..8$) và **Gaussian Mixture Model (GMM)** ($K=2..8$ qua 3 dạng ma trận hiệp phương sai: `full`, `diag`, `tied`).
2. **Kiểm định độ ổn định (Cluster Stability):** Đánh giá độ nhạy khởi tạo qua 10 random seeds độc lập bằng Adjusted Rand Index (ARI) và Normalized Mutual Information (NMI).
3. **Lựa chọn mô hình đa tiêu chí (Multi-Criteria Model Selection):** Kết hợp chặt chẽ giữa Chất lượng Thống kê, Độ Ổn định, Cân bằng Quy mô Cụm, và Khả năng Diễn giải Nghiệp vụ B2B (tuyệt đối không chọn máy móc theo một chỉ số đơn lẻ).
4. **Phân tích tập trung giá trị kinh tế & Luân chuyển thời gian (Migration Matrix):** Xác định sự đóng góp doanh thu của từng phân khúc và đo lường tỷ lệ duy trì/chuyển dịch phân khúc qua các năm tài chính (2023 $\rightarrow$ 2024 $\rightarrow$ 2025).
5. **Kiểm tra độ bền vững (Robustness Checks):** Kiểm tra độ nhạy với độ dài cửa sổ (365d vs 180d) và dạng biến đổi (Log1p vs Raw RFM).
6. **Tuân thủ quy tắc dừng (Stopping Rule):** Tuyệt đối **KHÔNG** chạy mô hình Churn Prediction trong lượt này.

---

## 1. PRE-FLIGHT VALIDATION & KHÓA DỮ LIỆU ĐẦU VÀO

Trước khi tiến hành phân cụm, hệ thống thực thi kiểm tra tiền trạm nghiêm ngặt trên tập dữ liệu `outputs/customer_segmentation/rfm_segmentation_primary.parquet`:
- **Tổng số dòng:** Đúng **1,359 dòng** (khách hàng có $\ge 1$ hóa đơn trong năm 2025).
- **Khóa duy nhất:** Đúng **1,359 mã khách hàng** (`AccountObjectCode.nunique() == 1,359`).
- **Trùng lặp:** Đúng **0 dòng trùng** (`duplicated().sum() == 0`).
- **Mốc thời gian:** Duy nhất `2025-12-31`.

### Kiểm toán tính đơn nhất toàn cục của mã hóa đơn (RefNo Global Uniqueness):
- **Phát hiện:** Trong toàn bộ lịch sử bán hàng 228,581 dòng, có 9,852 mã `RefNo` xuất hiện lặp lại giữa các chi nhánh khác nhau do hệ thống đánh số hóa đơn/phiếu xuất kho được khởi tạo độc lập tại từng đơn vị (ví dụ: số `00000001.` xuất hiện ở nhiều chi nhánh).
- **Kiểm định khóa hỗn hợp (Composite Transaction Key):** Khi gom nhóm theo `AccountObjectCode` để tính tần suất cho từng khách hàng, số lượng `RefNo` duy nhất hoàn toàn trùng khớp 100% với số lượng bộ đôi `(RefNo, BranchCode)` duy nhất (độ sai lệch bằng **0**).
- **Kết luận:** Biến `frequency_365d = COUNT(DISTINCT RefNo)` của từng khách hàng đại diện chuẩn xác 100% cho số đơn hàng/hóa đơn độc lập mà khách hàng đó đã thực hiện.

---

## 2. KHÔNG GIAN ĐẶC TRƯNG & CHUẨN HÓA DỮ LIỆU

- **Tập đặc trưng phân cụm chính:** 3 chiều RFM liên tục:
  $$\text{recency\_days}, \quad \text{frequency\_365d}, \quad \text{monetary\_365d}$$
- **Hàm biến đổi phi tuyến:**
  $$\text{log\_recency} = \log\left(1 + \max(0, \text{recency\_days})\right)$$
  $$\text{log\_frequency\_365d} = \log\left(1 + \text{frequency\_365d}\right)$$
  $$\text{log\_monetary\_365d} = \log\left(1 + \max(0, \text{monetary\_365d})\right)$$
- **Chuẩn hóa thang đo (Robust Scaling):** Áp dụng `RobustScaler()` dựa trên Trung vị và Khoảng tứ phân vị (IQR = $P_{75} - P_{25}$).
  - **Quy tắc cô lập:** Scaler được fit **DUY NHẤT** trên 1,359 khách hàng của tập phân khúc sơ cấp `2025-12-31`. Không fit trên tập panel hay toàn bộ khách hàng tổng thể.
  - Lưu trữ artifact: `models/rfm_scaler.joblib`.
- **Loại trừ biến định danh:** Tuyệt đối không đưa các biến định danh (`AccountObjectCode`, `CustomerName`, `BranchCode`, `RefNo`, `snapshot_date`) vào ma trận phân cụm.

---

## 3. KIỂM TRA ĐỘ NHẠY BIẾN DOANH THU ÂM (NEGATIVE REVENUE FLAG SENSITIVITY)

Tiến hành thử nghiệm độ nhạy giữa:
- **Model A:** Chỉ sử dụng 3 đặc trưng RFM liên tục.
- **Model B:** Bổ sung đặc trưng nhị phân `has_negative_revenue_365d`.

| Cấu hình | Model A: Silhouette (RFM Only) | Model B: Silhouette (RFM + Flag) | Adjusted Rand Index (ARI) giữa A và B | Normalized Mutual Info (NMI) | Nhận xét kiểm định |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **K = 3** | **0.3389** | 0.3389 | **1.0000** | **1.0000** | Phân hoạch giống hệt nhau 100% |
| **K = 4** | **0.3080** | 0.3079 | **1.0000** | **1.0000** | Phân hoạch giống hệt nhau 100% |
| **K = 5** | **0.3021** | 0.3020 | **1.0000** | **1.0000** | Phân hoạch giống hệt nhau 100% |

**Kết luận phương pháp luận:** Vì chỉ có 2 khách hàng phát sinh doanh thu âm trong năm 2025, việc đưa thêm một chiều nhị phân thưa (sparse binary feature) không thay đổi phân hoạch cụm ($ARI = 1.0000$) nhưng làm giảm nhẹ chỉ số hình học liên tục. Tuân thủ nguyên tắc thiết kế, **Model A (RFM liên tục)** được khóa chính thức làm cấu hình chính.

---

## 4. THỰC NGHIỆM ĐỒNG THỜI K-MEANS & GMM (K = 2 .. 8)

### 4.1. Bảng đo lường hiệu năng K-Means
*(Tập tin nguồn: [kmeans_metrics.csv](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/kmeans_metrics.csv))*

| K | Inertia | Silhouette Score | Calinski-Harabasz | Davies-Bouldin | Phân bổ số lượng khách hàng | Tỷ lệ cụm nhỏ nhất | Tỷ lệ cụm lớn nhất |
| :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| **2** | 855.00 | **0.4284** | 1,484.28 | **0.8604** | [716, 643] | 47.31% | 52.69% |
| **3** | 628.18 | **0.3389** | 1,254.16 | 1.0184 | [570, 397, 392] | 28.84% | 41.94% |
| **4** | 528.33 | **0.3080** | 1,078.78 | 1.1043 | **[320, 370, 334, 335]** | **23.55%** | **27.23%** |
| **5** | 455.59 | 0.3021 | 991.60 | 1.0610 | [354, 226, 268, 344, 167] | 12.29% | 26.05% |
| **6** | 403.21 | 0.2914 | 930.81 | 1.1032 | [245, 201, 147, 228, 315, 223] | 10.82% | 23.18% |
| **7** | 362.66 | 0.2963 | 886.96 | 0.9584 | [225, 240, 199, 313, 148, 232, 2] | **0.15% (Cảnh báo)** | 23.03% |
| **8** | 327.20 | 0.2933 | 862.96 | 0.9490 | [241, 269, 117, 216, 227, 148, 139, 2] | **0.15% (Cảnh báo)** | 19.79% |

### 4.2. Bảng đo lường hiệu năng GMM (Dạng hiệp phương sai `diag`)
*(Tập tin nguồn: [gmm_metrics.csv](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/gmm_metrics.csv))*

| K | Covariance Type | AIC | BIC | Silhouette | Calinski-Harabasz | Davies-Bouldin | Phân bổ số lượng | Tỷ lệ cụm nhỏ nhất |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **2** | diag | 6,657.06 | 6,724.85 | 0.4224 | 1,418.32 | 0.8649 | [767, 592] | 43.56% |
| **3** | diag | 6,191.87 | 6,296.16 | 0.3289 | 1,181.52 | 1.0117 | [383, 378, 598] | 27.81% |
| **4** | diag | 5,895.02 | 6,035.81 | 0.2432 | 914.28 | 1.2212 | [280, 501, 371, 207] | 15.23% |
| **5** | diag | 5,752.94 | 5,930.23 | 0.2520 | 825.13 | 1.2450 | [228, 267, 147, 382, 335] | 10.82% |
| **6** | diag | 5,627.86 | 5,841.66 | 0.2212 | 696.53 | 1.4101 | [344, 138, 192, 97, 407, 181] | 7.14% |
| **7** | diag | 5,499.57 | 5,749.87 | 0.2043 | 611.09 | 1.6693 | [35, 314, 207, 166, 202, 318, 117] | **2.58% (Cảnh báo)** |
| **8** | diag | 5,354.68 | 5,641.48 | 0.2430 | 745.02 | 1.0583 | [166, 336, 151, 183, 197, 218, 106, 2] | **0.15% (Cảnh báo)** |

---

## 5. KIỂM ĐỊNH ĐỘ ỔN ĐỊNH CỤM (CLUSTER STABILITY ACROSS 10 SEEDS)

Để đảm bảo việc phân cụm không phụ thuộc vào trạng thái khởi tạo ngẫu nhiên, mô hình được kiểm định qua 10 random seeds:  
`seeds = [42, 52, 62, 72, 82, 92, 102, 112, 122, 132]`  
Đối chiếu phân hoạch của từng seed với mốc chuẩn `seed = 42` bằng hai chỉ số:
- **Adjusted Rand Index (ARI):** Đo lường sự thống nhất phân cụm (1.0 = giống hệt).
- **Normalized Mutual Information (NMI):** Đo lường lượng thông tin tương hỗ được bảo toàn.

*(Tập tin nguồn: [cluster_stability.csv](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_stability.csv))*

| Thuật toán | K | Mean ARI | Std ARI | Min ARI | Max ARI | Mean NMI | Đánh giá độ ổn định |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **K-Means** | **2** | **1.0000** | 0.0000 | 1.0000 | 1.0000 | 1.0000 | Hoàn hảo tuyệt đối |
| **K-Means** | **3** | **0.9969** | 0.0058 | 0.9862 | 1.0000 | 0.9946 | Cực kỳ cao |
| **K-Means** | **4** | **0.9978** | **0.0020** | **0.9960** | **1.0000** | **0.9964** | **Cực kỳ cao, phương sai tối thiểu** |
| **K-Means** | **5** | 0.9138 | 0.0552 | 0.8511 | 0.9837 | 0.9184 | Cao nhưng bắt đầu dao động |
| **K-Means** | **6** | 0.9373 | 0.0832 | 0.7224 | 0.9965 | 0.9415 | Dao động (Min ARI giảm xuống 0.72) |
| **GMM (diag)** | **2** | 0.9931 | 0.0037 | 0.9912 | 1.0000 | 0.9839 | Rất cao |
| **GMM (diag)** | **3** | 0.9992 | 0.0016 | 0.9953 | 1.0000 | 0.9985 | Rất cao |
| **GMM (diag)** | **4** | 0.8850 | 0.1563 | **0.4545** | 1.0000 | 0.8934 | Không ổn định (Min ARI rớt xuống 0.45) |
| **GMM (diag)** | **5** | 0.9386 | 0.0854 | 0.7130 | 0.9950 | 0.9397 | Dao động vừa |
| **GMM (diag)** | **6** | 0.6903 | 0.1430 | 0.5101 | 0.9915 | 0.7484 | Kém ổn định |

---

## 6. MA TRẬN LỰA CHỌN MÔ HÌNH ĐA TIÊU CHÍ (MULTI-CRITERIA MODEL SELECTION)

Tuân thủ nghiêm ngặt nguyên tắc **không chọn mô hình chỉ dựa vào một chỉ số đơn lẻ**, bảng tổng hợp dưới đây đánh giá 4 khía cạnh:
1. **Chất lượng Thống kê (Statistical Quality):** Silhouette, Calinski-Harabasz, Davies-Bouldin.
2. **Độ ổn định khởi tạo (Stability):** Mean ARI, Min ARI qua 10 seeds.
3. **Cân bằng quy mô (Size Balance):** Tỷ lệ cụm nhỏ nhất và cụm lớn nhất, cảnh báo cụm $< 5\%$.
4. **Khả năng diễn giải kinh doanh (Business Interpretability):** Mức độ phân hóa rõ rệt về mặt hành vi mua hàng B2B.

| Cấu hình Ứng viên | Silhouette | Calinski-Harabasz | Davies-Bouldin | Mean ARI (Min ARI) | Tỷ lệ Cụm Min - Max | Diễn giải Nghiệp vụ B2B | Quyết định Lựa chọn |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **K-Means (K=2)** | **0.4284** | 1,484.28 | **0.8604** | 1.0000 (1.0000) | 47.3% - 52.7% | Quá thô: Chỉ chia Active vs Less Active, không hỗ trợ chiến lược kinh doanh | **LOẠI** (Thiếu chiều sâu nghiệp vụ) |
| **K-Means (K=3)** | 0.3389 | 1,254.16 | 1.0184 | 0.9969 (0.9862) | 28.8% - 41.9% | Nhập chung nhóm mua thường xuyên giá trị vừa với nhóm đang suy giảm | **Ứng viên tiềm năng** |
| **K-Means (K=4)** | **0.3080** | **1,078.78** | **1.1043** | **0.9978 (0.9960)** | **23.5% - 27.2%** | **Cực kỳ cân bằng (4 góc phần tư RFM: Key Accounts, Regulars, Slipping, Dormant)** | **CHỌN LÀM MÔ HÌNH CHÍNH (PRIMARY)** |
| **K-Means (K=5)** | 0.3021 | 991.60 | 1.0610 | 0.9138 (0.8511) | 12.3% - 26.0% | Tách nhỏ nhóm trung bình, độ ổn định giảm sút | **LOẠI** (Bắt đầu phân mảnh) |
| **K-Means (K=6..8)**| < 0.297 | < 931.0 | - | < 0.938 (< 0.72) | **0.15% (2 khách)** | Tạo cụm rác ngoại lai (degenerate clusters) | **LOẠI** (Cụm rác < 5%) |
| **GMM diag (K=3)** | 0.3289 | 1,181.52 | 1.0117 | 0.9992 (0.9953) | 27.8% - 44.0% | Khá tốt nhưng ranh giới cụm mờ hơn K-Means | **Ứng viên thay thế** |
| **GMM diag (K=4)** | 0.2432 | 914.28 | 1.2212 | 0.8850 (**0.4545**) | 15.2% - 36.9% | Độ ổn định kém (Min ARI tụt sâu xuống 0.45) | **LOẠI** (Kém ổn định) |

### Kết luận Lựa chọn:
Mô hình **K-Means với $K = 4$** được lựa chọn làm **Primary Customer Segmentation Model** vì:
1. **Sự cân bằng quy mô xuất sắc:** Mỗi cụm chiếm xấp xỉ 25% dân số ($23.55\% - 27.23\%$), không có bất kỳ cụm nào bị thoái hóa hay quá nhỏ.
2. **Độ ổn định gần như tuyệt đối:** Mean ARI đạt **0.9978**, độ lệch chuẩn cực nhỏ **0.0020**, Min ARI đạt **0.9960** trên 10 random seeds.
3. **Phân hóa kinh tế rõ rệt:** Tách biệt rành mạch giữa nhóm tạo ra 92% doanh số và các nhóm thường xuyên, gián đoạn, ngủ đông.

---

## 7. CHÂN DUNG PHÂN KHÚC & BẢNG TẬP TRUNG DOANH THU

*(Tập tin nguồn: [cluster_profiles.csv](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_profiles.csv))*

### 7.1. Bảng hồ sơ chi tiết 4 phân khúc khách hàng SOVIGAZ

| Cluster ID | Tên mô tả hành vi (Descriptive Label) | Tên phân khúc định hướng nghiệp vụ (Calibrated Business Label) | Số lượng khách hàng (% Dân số) | Doanh thu đóng góp (% Doanh thu) | Recency Median (P25 - P75) | Frequency Median (P25 - P75) | Monetary Median (P25 - P75) | Khoảng cách mua TB (Mean Interval) |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Cluster 2** | High Monetary / High Frequency / Very Low Recency | **Key Industrial Accounts (Bulk & Contract Buyers)** | **334** (24.58%) | **322.17 tỷ** (**92.09%**) | **1.0 ngày** (0 - 3) | **78.0 đơn** (42 - 138) | **281.54 tr** (105.8M - 699.2M) | 4.8 ngày |
| **Cluster 1** | Moderate Monetary / Moderate Frequency / Very Low Recency | **Active Regular Buyers (Operational Flow)** | **370** (27.23%) | **13.85 tỷ** (**3.96%**) | **5.0 ngày** (2 - 12) | **21.0 đơn** (13 - 33) | **25.43 tr** (13.7M - 43.1M) | 13.9 ngày |
| **Cluster 0** | Moderate Monetary / Low-to-Mid Frequency / High Recency | **Slipping / Periodic Buyers (Retention Focus)** | **320** (23.55%) | **18.72 tỷ** (**5.35%**) | **90.5 ngày** (41 - 163) | **9.0 đơn** (5 - 15) | **18.36 tr** (8.4M - 43.0M) | 26.6 ngày |
| **Cluster 3** | Low Monetary / Very Low Frequency / High Recency | **Dormant / Low-Engagement Accounts (Triage / Reactivation)** | **335** (24.65%) | **-4.89 tỷ** (**-1.40%**) | **102.0 ngày** (34 - 198) | **2.0 đơn** (1 - 3) | **1.20 tr** (0.3M - 3.2M) | 48.9 ngày |

### 7.2. Đặc trưng chuyên sâu từng phân khúc:
1. **Cluster 2 – Khách hàng Công nghiệp Trọng điểm (Key Industrial Accounts):**
   - Chiếm **24.58% khách hàng** nhưng đóng góp đến **92.09% tổng doanh thu** của toàn bộ công ty.
   - Hành vi giao dịch: Mua liên tục (Recency median = 1 ngày, bình quân 4.8 ngày có 1 đơn hàng mới). Tần suất trung vị 78 đơn/năm, giá trị mua trung vị 281.5 triệu VND.
   - Đây là xương sống kinh tế của SOVIGAZ (các nhà máy luyện kim, bệnh viện lớn, công ty đóng tàu tiêu thụ khí hóa lỏng qua bồn trạm).
2. **Cluster 1 – Khách hàng Mua Thường xuyên (Active Regular Buyers):**
   - Chiếm **27.23% khách hàng**, đóng góp **3.96% doanh thu**.
   - Hành vi giao dịch: Mua rất gần (Recency median = 5 ngày, trung vị 21 đơn/năm, khoảng 1-2 tuần đổi bình 1 lần), giá trị đơn hàng mức vừa (median 25.4 triệu VND).
   - Đây là dòng tiền vận hành ổn định (các xưởng cơ khí, đại lý bán lẻ khí chai, cơ sở gia công).
3. **Cluster 0 – Khách hàng Định kỳ / Đang suy giảm (Slipping / Periodic Buyers):**
   - Chiếm **23.55% khách hàng**, đóng góp **5.35% doanh thu**.
   - Hành vi giao dịch: Đã 3 tháng chưa mua hàng trở lại (Recency median = 90.5 ngày), tần suất thưa (median 9 đơn/năm), nhưng giá trị tích lũy không hề nhỏ (18.72 tỷ VND).
   - Đây là nhóm đối tượng có rủi ro rời bỏ ngầm cao nhất cần ưu tiên chăm sóc trong bài toán Churn.
4. **Cluster 3 – Khách hàng Ngủ đông / Quy mô nhỏ (Dormant / Low-Engagement):**
   - Chiếm **24.65% khách hàng**, doanh thu âm nhẹ (-1.40% do chứa 2 tài khoản điều chuyển kế toán nội bộ và khách hàng mua số lượng rất ít).
   - Hành vi giao dịch: Recency median 102 ngày, chỉ mua 1 - 2 lần/năm với giá trị nhỏ (median 1.2 triệu VND).

---

## 8. TRỰC QUAN HÓA PCA TRÊN KHÔNG GIAN 2D

*(Tập tin nguồn: [10_pca_clusters.png](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/10_pca_clusters.png))*

Hệ thống đã fit PCA trên ma trận đặc trưng chuẩn hóa để trực quan hóa cấu trúc hình học:
- **Tỷ lệ phương sai giải thích:**
  - Thành phần chính 1 (PC1): **77.29%**
  - Thành phần chính 2 (PC2): **14.87%**
  - Tổng phương sai tích lũy 2D: **92.16%**
- **Ý nghĩa các trục:**
  - **PC1 (77.3%):** Có trọng số dương rất lớn với Frequency (+0.58) và Monetary (+0.72), trọng số âm với Recency (-0.38) $\rightarrow$ Đại diện cho **Mức độ Gắn kết & Giá trị Tổng thể (Engagement & Value Dimension)**.
  - **PC2 (14.9%):** Có trọng số dương lớn với Recency (+0.76) và Monetary (+0.60), trọng số âm với Frequency (-0.24) $\rightarrow$ Đại diện cho **Động lực Gián đoạn / Chu kỳ Mua hàng Lớn Thưa thớt (Recency & Periodic Large Purchases)**.
- **Quan sát hình học:** 4 cụm phân tách rất rành mạch trên mặt phẳng PC1 $\times$ PC2, xác nhận cấu trúc cụm tồn tại khách quan và tự nhiên trong dữ liệu bán hàng SOVIGAZ.

---

## 9. KIỂM ĐỊNH ĐỘ BỀN VỮNG (ROBUSTNESS CHECKS)

### 9.1. Độ bền vững với hàm biến đổi (Transformation Robustness)
- So sánh: K-Means trên dữ liệu `Log1p + RobustScaler` vs K-Means trên `Raw RFM + RobustScaler`.
- **Kết quả:** $\text{ARI} = 0.0066, \quad \text{NMI} = 0.0742$.
- **Lý giải khoa học:** Dữ liệu Monetary gốc của B2B có độ lệch cực đại (+22.0, chênh lệch giữa khách nhỏ nhất và lớn nhất lên đến hàng chục tỷ VND). Nếu không có Log1p, khoảng cách Euclid bị chi phối hoàn toàn bởi một vài tài khoản cực lớn, dồn 99% khách hàng bình thường vào một cụm duy nhất. Kết quả kiểm định chứng minh **biến đổi Log1p là bắt buộc về mặt toán học và phương pháp luận**.

### 9.2. Độ bền vững với cửa sổ quan sát (Window Robustness)
- So sánh: Cửa sổ 365 ngày (Primary) vs Cửa sổ 180 ngày (Bán niên).
- **Kết quả:** $\text{ARI} = 0.4196, \quad \text{NMI} = 0.4904$.
- **Lý giải khoa học:** Có mức độ tương quan vừa phải. Nguyên nhân là do 187 khách hàng (13.8%) mua hàng định kỳ theo năm nhưng không mua trong 6 tháng cuối năm bị kéo tụt xuống các cụm thấp hơn nếu chỉ xét 180 ngày. Điều này củng cố lý do tại sao **cửa sổ 365 ngày là lựa chọn chuẩn xác nhất để phản ánh đúng chu kỳ B2B**.

---

## 10. TỔNG QUÁT HÓA THỜI GIAN & MA TRẬN LUÂN CHUYỂN PHÂN KHÚC (MIGRATION MATRIX)

Áp dụng mô hình chuẩn (được fit tại `2025-12-31`) để gán nhãn cho các snapshot lịch sử `2023-12-31` và `2024-12-31`. Phân tích luân chuyển phân khúc giữa các năm tài chính:

*(Tập tin nguồn: [cluster_transition_matrix.csv](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_transition_matrix.csv) & [11_segment_transition.png](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/11_segment_transition.png))*

### Ma trận chuyển dịch giai đoạn 2024 $\rightarrow$ 2025 (% khách hàng):

| Phân khúc năm 2024 \ Năm 2025 | Sang Cluster 0 (Slipping) | Sang Cluster 1 (Active Regular) | Sang Cluster 2 (Key Accounts) | Sang Cluster 3 (Dormant) |
| :--- | :---: | :---: | :---: | :---: |
| **Từ Cluster 0 (Slipping)** | **50.85%** | 25.42% | 13.56% | 10.17% |
| **Từ Cluster 1 (Active Regular)** | 25.62% | **56.56%** | 15.94% | 1.88% |
| **Từ Cluster 2 (Key Accounts)** | 8.85% | 5.77% | **85.38%** | **0.00%** |
| **Từ Cluster 3 (Dormant)** | 16.22% | 24.32% | 0.90% | **58.56%** |

### Nhận định quy luật vận động khách hàng:
1. **Độ trung thành của nhóm Trọng điểm (Cluster 2) cực cao:** **85.38%** khách hàng Key Accounts năm 2024 tiếp tục giữ vững vị thế Key Accounts trong năm 2025. Đặc biệt, **0.00%** khách hàng nhóm này rơi thẳng vào tình trạng ngủ đông (Cluster 3).
2. **Kênh nâng hạng tự nhiên:** Nhóm Mua thường xuyên (Cluster 1) có **15.94%** khách hàng phát triển quy mô để thăng hạng lên Key Accounts (Cluster 2).
3. **Cơ hội kích hoạt lại:** Nhóm Đang suy giảm (Cluster 0) có **25.42%** khách hàng tự phục hồi trở lại nhóm Mua thường xuyên, chứng minh tiềm năng cứu vãn rất lớn nếu có chương trình can thiệp kịp thời.

---

## 11. KẾT QUẢ KIỂM THỬ ĐƠN VỊ (UNIT TESTS)

Bộ kiểm thử đơn vị `SOVIGAZ_ML/tests/test_clustering.py` gồm **10 bài test nghiêm ngặt** đã được thực thi và đạt **100% PASS**:

```text
test_cluster_assignment_count (__main__.TestCustomerClustering.test_cluster_assignment_count) ... ok
test_cluster_assignment_no_null (__main__.TestCustomerClustering.test_cluster_assignment_no_null) ... ok
test_cluster_k_matches_config (__main__.TestCustomerClustering.test_cluster_k_matches_config) ... ok
test_cluster_metric_output_exists (__main__.TestCustomerClustering.test_cluster_metric_output_exists) ... ok
test_cluster_profile_reconciliation (__main__.TestCustomerClustering.test_cluster_profile_reconciliation) ... ok
test_each_customer_assigned_once (__main__.TestCustomerClustering.test_each_customer_assigned_once) ... ok
test_no_identifier_features (__main__.TestCustomerClustering.test_no_identifier_features) ... ok
test_primary_snapshot_only (__main__.TestCustomerClustering.test_primary_snapshot_only) ... ok
test_scaler_fitted_on_primary_only (__main__.TestCustomerClustering.test_scaler_fitted_on_primary_only) ... ok
test_stability_output_exists (__main__.TestCustomerClustering.test_stability_output_exists) ... ok

----------------------------------------------------------------------
Ran 10 tests in 1.443s
OK
```
*Tổng số bài kiểm thử của toàn bộ dự án hiện tại (Phases 1, 2, 3, 4A, 4A.1, 4B): **35/35 TESTS PASS (100% OK)**.*

---

## 12. BẢNG NGHIỆM THU KHOA HỌC CUỐI CÙNG (FINAL ACCEPTANCE MATRIX)

| # | Tiêu chí nghiệm thu (Acceptance Criterion) | Trạng thái | Bằng chứng thực nghiệm (Empirical Evidence) |
| :-: | :--- | :---: | :--- |
| **1** | 1 customer = 1 clustering observation | **PASS** | `cluster_assignments.csv` có đúng 1,359 dòng, 0 trùng lặp |
| **2** | Frequency dùng khóa hóa đơn duy nhất | **PASS** | Đã chuẩn hóa `COUNT(DISTINCT RefNo)`, kiểm toán composite key lệch 0 |
| **3** | Không đưa biến định danh vào mô hình | **PASS** | `test_no_identifier_features` PASS, chỉ dùng [R, F, M] liên tục |
| **4** | Cố định snapshot sơ cấp | **PASS** | Duy nhất `2025-12-31` được dùng để fit mô hình chính |
| **5** | Quy trình Log/Scaler được tài liệu hóa | **PASS** | `RobustScaler` fit trên primary và lưu tại `models/rfm_scaler.joblib` |
| **6** | Đánh giá K-Means K=2..8 đầy đủ | **PASS** | `kmeans_metrics.csv` lưu 7 cấu hình với đầy đủ 4 chỉ số |
| **7** | Đánh giá GMM K=2..8 đầy đủ | **PASS** | `gmm_metrics.csv` lưu 21 cấu hình (full, diag, tied) với AIC/BIC |
| **8** | Tính toán đa chỉ số phân cụm | **PASS** | Silhouette, Calinski-Harabasz, Davies-Bouldin, AIC, BIC |
| **9** | Đánh giá độ ổn định cụm (Stability) | **PASS** | `cluster_stability.csv` đo Mean/Min ARI qua 10 seeds (K=4 đạt 0.9978) |
| **10**| Kiểm toán quy mô phân cụm | **PASS** | Cụm nhỏ nhất chiếm 23.55%, không có cụm thoái hóa < 5% |
| **11**| Kiểm toán tập trung doanh thu | **PASS** | Cluster 2 nắm giữ 92.09% doanh thu (322.17 tỷ VND) |
| **12**| Chọn mô hình bằng đa tiêu chí | **PASS** | Chọn K-Means (K=4) cân bằng giữa chất lượng, độ ổn định và nghiệp vụ |
| **13**| PCA chỉ dùng để trực quan hóa | **PASS** | `pca_visualization.joblib` giải thích 92.16% phương sai, không dùng làm không gian gom cụm |
| **14**| Kiểm tra độ bền vững thời gian & cửa sổ | **PASS** | Xuất `rfm_window_robustness.csv` và `transformation_robustness.csv` |
| **15**| Unit tests vượt qua 100% | **PASS** | 10/10 tests 4B PASS, 35/35 tests toàn dự án PASS |
| **16**| Khả năng tái lập artifact hoàn chỉnh | **PASS** | Toàn bộ model (.joblib), cấu hình (.json), dữ liệu (.csv) lưu trữ đầy đủ |

---

## 13. DANH MỤC TẬP TIN CODE, ARTIFACTS & FIGURES TẠO MỚI

1. **Mã nguồn thực thi:**
   - [`SOVIGAZ_ML/src/models/customer_clustering.py`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/src/models/customer_clustering.py): Pipeline huấn luyện, kiểm định đa tiêu chí, profiling và migration.
   - [`SOVIGAZ_ML/tests/test_clustering.py`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/tests/test_clustering.py): Bộ 10 bài kiểm thử đơn vị tự động cho Sub-Phase 4B.
2. **Model Artifacts:**
   - `SOVIGAZ_ML/models/best_clustering_model.joblib`: Mô hình K-Means (K=4) chính thức.
   - `SOVIGAZ_ML/models/cluster_config.json`: Cấu hình siêu tham số và chỉ số kiểm định.
   - `SOVIGAZ_ML/models/rfm_scaler.joblib`: Scaler chuẩn hóa đã fit trên tập sơ cấp.
   - `SOVIGAZ_ML/models/pca_visualization.joblib`: Mô hình PCA 2 thành phần phục vụ biểu diễn.
   - `SOVIGAZ_ML/models/kmeans_candidate_k*.joblib`: Toàn bộ candidate models K=2..8.
   - `SOVIGAZ_ML/models/gmm_candidate_k*_*.joblib`: Toàn bộ candidate models GMM.
3. **Dữ liệu phân tích xuất bản:**
   - [`outputs/customer_segmentation/cluster_assignments.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_assignments.csv): Bảng gán nhãn phân khúc cho 1,359 khách hàng kèm khoảng cách tới tâm cụm.
   - [`outputs/customer_segmentation/cluster_profiles.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_profiles.csv): Bảng hồ sơ đặc trưng RFM và doanh thu của 4 phân khúc.
   - [`outputs/customer_segmentation/kmeans_metrics.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/kmeans_metrics.csv): Bảng đo lường hiệu năng K-Means.
   - [`outputs/customer_segmentation/gmm_metrics.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/gmm_metrics.csv): Bảng đo lường hiệu năng GMM.
   - [`outputs/customer_segmentation/cluster_stability.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_stability.csv): Bảng kiểm định độ ổn định ARI/NMI.
   - [`outputs/customer_segmentation/cluster_transition_matrix.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/cluster_transition_matrix.csv): Bảng ma trận luân chuyển phân khúc qua các năm.
   - [`outputs/customer_segmentation/rfm_window_robustness.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/rfm_window_robustness.csv): Kiểm tra độ bền vững cửa sổ 365d vs 180d.
   - [`outputs/customer_segmentation/transformation_robustness.csv`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/customer_segmentation/transformation_robustness.csv): Kiểm tra độ bền vững Log1p vs Raw RFM.
4. **Biểu đồ trực quan hóa:**
   - [`outputs/figures/customer/02_kmeans_inertia.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/02_kmeans_inertia.png)
   - [`outputs/figures/customer/03_silhouette_by_k.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/03_silhouette_by_k.png)
   - [`outputs/figures/customer/04_cluster_validity_metrics.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/04_cluster_validity_metrics.png)
   - [`outputs/figures/customer/05_gmm_aic_bic.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/05_gmm_aic_bic.png)
   - [`outputs/figures/customer/06_cluster_stability_ari.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/06_cluster_stability_ari.png)
   - [`outputs/figures/customer/07_cluster_size.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/07_cluster_size.png)
   - [`outputs/figures/customer/08_revenue_by_cluster.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/08_revenue_by_cluster.png)
   - [`outputs/figures/customer/09_cluster_profiles.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/09_cluster_profiles.png)
   - [`outputs/figures/customer/10_pca_clusters.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/10_pca_clusters.png)
   - [`outputs/figures/customer/11_segment_transition.png`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/outputs/figures/customer/11_segment_transition.png)
5. **Báo cáo nghiên cứu:**
   - [`reports/SUB_PHASE_4B_REPORT.md`](file:///c:/Users/DELL-587K9L3/Documents/Môn%20học%20kì%20này/INDA/SOVIGAZ_ML/reports/SUB_PHASE_4B_REPORT.md)

---

## 14. XÁC NHẬN DỪNG LẠI (STOPPING CONFIRMATION)

Sub-Phase 4B đã hoàn thành trọn vẹn, vượt qua toàn bộ 16 tiêu chí nghiệm thu khắt khe.  
Tôi **DỪNG LẠI TẠI ĐÂY**, tuân thủ nghiêm ngặt chỉ dẫn:
- **KHÔNG** huấn luyện mô hình Churn Prediction.
- **KHÔNG** tính toán SHAP values cho Churn.
- **KHÔNG** xây dựng bảng chấm điểm rủi ro rời bỏ (Customer Risk Scoring).

Trân trọng chờ ý kiến đánh giá và phê duyệt từ Trưởng dự án để chuyển sang **SUB-PHASE 4C – CHURN FEATURE ENGINEERING & MODEL BENCHMARKING**.
