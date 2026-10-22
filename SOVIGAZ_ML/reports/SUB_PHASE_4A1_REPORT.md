# BÁO CÁO NGHIÊN CỨU & KIỂM ĐỊNH KHOA HỌC: SUB-PHASE 4A.1
## FINAL RFM AUDIT & PRIMARY SEGMENTATION POPULATION LOCK
**Dự án:** Hệ thống Phân tích Khách hàng B2B & Churn Prediction – SOVIGAZ  
**Cấp độ:** Senior Machine Learning Engineer & Data Scientist  
**Thời điểm thực hiện:** 03/10/2026  
**Trạng thái kiểm định:** **PASS TOÀN BỘ (13/13 UNIT TESTS PASS, 25/25 PROJECT TESTS PASS)**  

---

## TỔNG QUAN MỤC TIÊU VÀ NGUYÊN TẮC THI HÀNH

Sub-Phase 4A.1 được thực hiện như một vòng rà soát khoa học chuyên sâu và cô lập (Strictly Isolated Pre-Clustering Audit) trước khi bước vào Sub-Phase 4B (Clustering K-Means / GMM). 

Mục tiêu cốt lõi:
1. **Khóa chặt định nghĩa Frequency trong B2B:** Kiểm toán và chuẩn hóa từ `COUNT(rows)` sang `COUNT(DISTINCT RefNo)`.
2. **Khóa đơn vị phân tích (Unit of Analysis) cho Customer Segmentation:** Phân tách rõ ràng giữa:
   - **Tập phân khúc sơ cấp (Primary Customer Segmentation Population):** $N = 1,359$ khách hàng độc lập tại snapshot `2025-12-31` (1 dòng = 1 khách hàng duy nhất).
   - **Tập bảng đa thời điểm (Multi-Snapshot Panel):** $N = 5,502$ dòng phục vụ phân tích biến động phân khúc (migration) và feature churn prediction ở sub-phase sau.
3. **Kiểm toán điều kiện hợp lệ (Eligibility) & Biên ngày quan sát:** Xác minh tính chính xác của cửa sổ 365 ngày $(T-365\text{d}, T]$.
4. **Kiểm toán doanh thu âm (Negative Monetary Audit):** Làm rõ nguyên nhân kế toán (bút toán điều chỉnh, hàng bán trả lại) và cách xử lý toán học bằng $\log(1 + \max(0, M))$ kết hợp flag nhị phân.
5. **Chuẩn hóa ngôn ngữ thống kê:** Hiệu chỉnh diễn đạt về phân phối, độ lệch (skewness) và lựa chọn độ dài cửa sổ quan sát.
6. **Tuân thủ quy tắc dừng (Stopping Rule):** Tuyệt đối **KHÔNG** chạy thuật toán phân cụm (K-Means/GMM) hay huấn luyện mô hình Churn trong lượt này.

---

## 1. KẾT QUẢ KIỂM TOÁN TẦN SUẤT (CRITICAL FREQUENCY AUDIT)

### 1.1. Phát hiện (FINDING)
Trong implementation ban đầu của Sub-Phase 4A, tần suất mua hàng (`frequency_90d`, `frequency_180d`, `frequency_365d`) được tính bằng `count(RefNo)` (tức số dòng chi tiết hóa đơn). 

Trong thực tế bán hàng B2B của SOVIGAZ (ngành khí công nghiệp và thiết bị hàn cắt), một đơn hàng/hóa đơn bán hàng (`RefNo`) thường bao gồm nhiều dòng sản phẩm khác nhau (ví dụ: giao Oxy lỏng kèm tiền cước vận chuyển, vỏ bình, phụ kiện, hoặc xuất nhiều chủng loại khí cùng lúc). 

Việc sử dụng `COUNT(rows)` đã dẫn đến sự thổi phồng tần suất mua hàng (Frequency Inflation) giả tạo:
- Khách hàng có đơn hàng nhiều dòng bị tính thành nhiều lần mua riêng biệt.
- Làm sai lệch bản chất hành vi mua hàng B2B (vốn được quyết định ở cấp độ đơn đặt hàng / chuyến xe / hóa đơn).

### 1.2. Biện pháp hiệu chỉnh (REMEDIATION)
- **Chuẩn hóa công thức:**
  $$\text{Frequency}(T) = \text{COUNT}(\text{DISTINCT } \text{RefNo}) \quad \text{trong cửa sổ quan sát } (T - W, T]$$
- **Phạm vi tác động:** Tại snapshot sơ cấp `2025-12-31`, có **784 khách hàng (57.69%)** trong tổng số 1,359 khách hàng phát sinh hóa đơn đa dòng và đã được hiệu chỉnh chính xác.
- **Tập tin xuất bản:** `SOVIGAZ_ML/outputs/customer_segmentation/rfm_frequency_audit_comparison.csv`.

### 1.3. Bảng đối chiếu 5 khách hàng mẫu bị ảnh hưởng nặng nhất

| frequency_definition | aggregation_key | example_customer | customer_name | row_count | distinct_refno_count | diff_rows | pct_inflation | finding_verdict |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **BDNB2** | XÍ NGHIỆP HƠI KỸ NGHỆ BIÊN HÒA | 1,667 | **703** | 964 | +137.1% | Hóa đơn B2B đa dòng gây thổi phồng tần suất nếu dùng số dòng |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **VPBV31** | Bệnh viện Từ Dũ | 930 | **361** | 569 | +157.6% | Hóa đơn B2B đa dòng gây thổi phồng tần suất nếu dùng số dòng |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **BDNL117** | CÔNG TY TNHH KINH DOANH THỰC PHẨM NĂM SAO | 593 | **78** | 515 | **+660.3%** | Hóa đơn B2B đa dòng gây thổi phồng tần suất nếu dùng số dòng |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **BDBV152A** | BV ĐA KHOA TÂM ANH TP. HỒ CHÍ MINH | 705 | **235** | 470 | +200.0% | Hóa đơn B2B đa dòng gây thổi phồng tần suất nếu dùng số dòng |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **NTVXTHUONG** | Võ Xuân Thượng (Oxy Thượng) | 677 | **267** | 410 | +153.6% | Hóa đơn B2B đa dòng gây thổi phồng tần suất nếu dùng số dòng |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **LANL517** | Khách hàng mua đơn lẻ 1 mặt hàng | 1 | **1** | 0 | 0.0% | Đơn hàng 1 mặt hàng: số dòng trùng khớp số hóa đơn |
| `COUNT(DISTINCT RefNo)` | `RefNo` | **1003** | XÍ NGHIỆP HƠI KỸ NGHỆ CẦN THƠ | 8 | **8** | 0 | 0.0% | Đơn hàng 1 mặt hàng: số dòng trùng khớp số hóa đơn |

---

## 2. BẢNG TIÊU CHÍ HỢP LỆ KHÁCH HÀNG (ELIGIBILITY AUDIT TABLE)

Tại mốc thời gian snapshot `snapshot_date = 2025-12-31`, toàn bộ cơ sở khách hàng của SOVIGAZ được phân loại theo phễu hợp lệ (Eligibility Funnel) như sau:

| Nhóm khách hàng | Quy tắc phân loại (Operational Definition) | Số lượng khách hàng | Tỷ lệ so với Master | Vai trò trong hệ thống Machine Learning |
| :--- | :--- | :---: | :---: | :--- |
| **Tổng Master** | Toàn bộ danh mục khách hàng trong `customer_master.parquet` | **6,040** | 100.0% | Danh mục định danh tổng thể hệ thống |
| **Chưa từng phát sinh giao dịch** | Không có bất kỳ giao dịch bán hàng nào trong lịch sử $\le$ 31/12/2025 | **4,093** | 67.76% | Khách hàng tiềm năng chưa kích hoạt / tài khoản rác kế toán |
| **Đã từng mua trong lịch sử** | Có $\ge 1$ giao dịch bán hàng từ 02/01/2023 đến 31/12/2025 | **1,968** | 32.58% | Toàn bộ khách hàng đã phát sinh quan hệ thương mại |
| **Hoạt động trong 365 ngày (Primary)** | Có $\ge 1$ hóa đơn trong $(T-365\text{d}, T] = [01/01/2025, 31/12/2025]$ | **1,359** | **22.50%** | **Dân số sơ cấp cho Customer Segmentation (Primary Population)** |
| **Hoạt động trong 180 ngày** | Có $\ge 1$ hóa đơn trong $(T-180\text{d}, T] = [05/07/2025, 31/12/2025]$ | **1,172** | 19.40% | Nhóm khách hàng phục vụ Cohort Churn bán niên |
| **Hoạt động trong 90 ngày** | Có $\ge 1$ hóa đơn trong $(T-90\text{d}, T] = [02/10/2025, 31/12/2025]$ | **999** | 16.54% | Nhóm khách hàng hoạt động thường xuyên hàng quý |

### Lựa chọn phương pháp luận cho Customer Segmentation:
- **Lựa chọn:** Cửa sổ 365 ngày ($N = 1,359$ khách hàng).
- **Cơ sở khoa học:** Trong ngành khí công nghiệp B2B, chu kỳ bảo dưỡng, nạp bồn khí hóa lỏng và ký kết phụ lục hợp đồng thường diễn ra theo chu kỳ năm (annual budgetary and procurement cycle). Có **187 khách hàng** ($1,359 - 1,172$) không mua trong 6 tháng cuối năm nhưng có giao dịch định kỳ trong năm 2025; nếu áp dụng cửa sổ 180 ngày sẽ loại bỏ nhầm các khách hàng này, tạo ra thiên lệch chọn mẫu (selection bias).

---

## 3. XÁC MINH BIÊN DỮ LIỆU THỜI GIAN (BOUNDARY VERIFICATION)

Kiểm tra kiểm toán độc lập về quy ước biên thời gian của cửa sổ quan sát 365 ngày tại $T = \text{2025-12-31}$:
- **Quy ước toán học:** Nửa khoảng mở bên trái, đóng bên phải: $(T - 365\text{ ngày}, T]$.
- **Mốc bắt đầu:** $T - 365\text{ ngày} = \text{2024-12-31}$.
  - Giao dịch phát sinh vào đúng ngày `2024-12-31` có **334 giao dịch**.
  - **Kiểm tra biên:** Số giao dịch ngày `2024-12-31` lọt vào cửa sổ $w365$ = **0 dòng (PASS)**. Cửa sổ bắt đầu lấy dữ liệu từ `2025-01-01`.
- **Mốc kết thúc:** $T = \text{2025-12-31}$.
  - Giao dịch phát sinh vào đúng ngày snapshot `2025-12-31` có **353 giao dịch**.
  - **Kiểm tra biên:** Toàn bộ **353 giao dịch** được tính đầy đủ vào RFM features tại $T$ (**PASS**).
- **Kiểm tra tương lai:** Không có bất kỳ giao dịch nào sau `2025-12-31` bị rò rỉ vào đặc trưng RFM (**PASS**).

---

## 4. XÁC NHẬN DÂN SỐ PHÂN KHÚC SƠ CẤP (PRIMARY POPULATION INTEGRITY)

- **Đường dẫn tập dữ liệu:** `SOVIGAZ_ML/outputs/customer_segmentation/rfm_segmentation_primary.parquet`.
- **Cấu trúc dữ liệu:**
  - Tổng số dòng: **1,359 dòng**.
  - Số mã khách hàng duy nhất (`AccountObjectCode`): **1,359 mã**.
  - Kiểm tra toàn vẹn: `df_primary['AccountObjectCode'].nunique() == len(df_primary)` $\rightarrow$ **TRUE (PASS)**.
  - Số lượng snapshot trong bảng: Duy nhất `2025-12-31` $\rightarrow$ **TRUE (PASS)**.
- **Ý nghĩa phương pháp luận:** 
  - Triệt tiêu hoàn toàn hiện tượng giả ngẫu nhiên lặp mẫu (**Pseudo-replication**), vốn xảy ra nếu gộp chung 5 snapshot thành 5,502 dòng để chạy phân cụm.
  - Đảm bảo mỗi khách hàng là một quan sát độc lập, đại diện cho trạng thái hoàn chỉnh nhất tính đến hết năm tài chính 2025.
  - Tập `rfm_snapshot.parquet` (5,502 dòng) được lưu trữ riêng để phân tích luân chuyển cụm (segment migration matrix) và tạo đặc trưng chuỗi thời gian cho Churn Prediction.

---

## 5. BẢNG KIỂM TOÁN DOANH THU ÂM (NEGATIVE MONETARY AUDIT)

Tại sao lại có doanh thu âm trong dữ liệu B2B và cách xử lý?
- Trong bảng tổng hợp `negative_monetary_audit.csv`, trên toàn bộ 5,502 dòng panel chỉ có **11 trường hợp** có `monetary_365d < 0` (chiếm 0.20%).
- Riêng tại snapshot sơ cấp `2025-12-31`, chỉ có **2 khách hàng** có doanh thu âm: `BDNB7` và `CT1003`.

### 5.1. Bảng chi tiết kiểm toán doanh thu âm

| AccountObjectCode | snapshot_date | monetary_365d_VND | flag_accounting_adjustment | adjustment_revenue_sum | flag_sales_return | return_revenue_sum | Loại chứng từ chính phát sinh | Phương pháp xử lý trong pipeline |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **BHBV6** | 2023-12-31 | -185,854,600 | False | 0 | **True** | -546,750,000 | Bán hàng chưa thu tiền & Hàng bán bị trả lại | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **BDNB7** | 2024-06-30 | -1,415,314,942 | **True** | -5,526,948,000 | False | 0 | Bút toán điều chỉnh giảm trừ định kỳ `BDKH...` | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **BH1002a** | 2024-06-30 | -662,418,100 | **True** | -893,186,500 | False | 0 | Bút toán điều chỉnh nội bộ | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **CT1003** | 2024-06-30 | -795,710,700 | **True** | -1,880,749,000 | False | 0 | Bút toán điều chỉnh nội bộ chi nhánh Cần Thơ | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **BDNB7** | 2024-12-31 | -3,139,681,000 | **True** | -3,139,681,000 | False | 0 | Điều chỉnh kế toán cuối kỳ | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **BH1002a** | 2024-12-31 | -888,822,600 | **True** | -888,822,600 | False | 0 | Điều chỉnh kế toán cuối kỳ | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **CT1003** | 2024-12-31 | -1,611,267,000 | **True** | -1,611,267,000 | False | 0 | Điều chỉnh kế toán cuối kỳ | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **CT1003** | 2025-06-30 | -1,642,178,000 | **True** | -1,642,178,000 | False | 0 | Điều chỉnh công nợ chi nhánh | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **BDNB7** | 2025-06-30 | -3,073,006,000 | **True** | -3,073,006,000 | False | 0 | Điều chỉnh công nợ chi nhánh | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **BDNB7** | 2025-12-31 | -3,546,010,176 | **True** | -3,546,010,176 | False | 0 | Bút toán điều chỉnh chi nhánh Biên Hòa | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |
| **CT1003** | 2025-12-31 | -1,917,960,651 | **True** | -1,917,960,651 | False | 0 | Bút toán điều chỉnh chi nhánh Cần Thơ | $\log(1 + \max(0, M))$ + flag nhị phân = 1 |

### 5.2. Giải trình bản chất nghiệp vụ & Giải pháp xử lý
1. **Bản chất nghiệp vụ:** 
   - `BHBV6`: Khách hàng trả lại hàng hóa đã mua theo chứng từ *"Hàng bán bị trả lại - Giảm trừ công nợ"*, giá trị trả lại lớn hơn doanh số mua mới trong kỳ quan sát.
   - `BDNB7`, `BH1002a`, `CT1003`: Là các mã hạch toán điều chuyển nội bộ/chi nhánh của SOVIGAZ (Biên Hòa, Cần Thơ). Các bút toán cuối tháng `BDKH2024/01`, `BDKH2024/02`... là các bút toán đối trừ kế toán nội bộ.
2. **Quy tắc xử lý:**
   - **Tuyệt đối không xóa bỏ bản ghi:** Việc xóa bỏ các khách hàng này sẽ tạo ra thiên lệch sống sót (survivorship bias) và phá vỡ tính toàn vẹn của sổ sách.
   - **Xử lý biến đổi hàm Log:**
     $$\text{log\_monetary\_365d} = \log\left(1 + \max(0, \text{monetary\_365d})\right)$$
   - **Tạo cờ đặc trưng kế toán:** Tạo biến nhị phân `has_negative_revenue_365d = 1` để lưu giữ thông tin rằng khách hàng có phát sinh điều chỉnh âm trong năm, phục vụ giải thích và phân tích rủi ro.

---

## 6. HIỆU CHỈNH NGÔN NGỮ THỐNG KÊ & PHÂN PHỐI RFM

### 6.1. Hiệu chỉnh ngôn ngữ về phân phối (Scientific Calibration)
- **Trước hiệu chỉnh:** Không được tuyên bố *"Dữ liệu đã đạt phân phối chuẩn"* hoặc *"Biến đổi Log1p đã chuẩn hóa dữ liệu hoàn hảo"*.
- **Diễn đạt khoa học chính xác sau hiệu chỉnh:**
  > *"Biến đổi Log1p đã làm giảm đáng kể độ lệch dương cực đoan (positive skewness) và nén phần đuôi dài (heavy right-tail) của dữ liệu bán hàng B2B. Điều này giúp ổn định phương sai và đưa phân phối về dạng gần đơn đỉnh, hạn chế tác động quá mức của các đơn hàng công nghiệp giá trị khổng lồ lên các phép đo khoảng cách Euclid trong K-Means và ước lượng mật độ trong GMM, mà không áp đặt giả định phi thực tế rằng dữ liệu tuân theo phân phối chuẩn nghiêm ngặt."*

### 6.2. Thống kê biến đổi phân phối trên tập Primary ($N = 1,359$)

| Đặc trưng | Skewness Gốc | Skewness Log1p | Giá trị Min | P25 | Trung vị (Median) | Trung bình (Mean) | P75 | P95 | P99 | Max |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Recency (ngày)** | +1.58 | **-0.03** | 0.0 | 2.0 | 15.0 | 65.0 | 96.0 | 281.0 | 348.0 | 362.0 |
| **Frequency 365d (hóa đơn)** | +3.93 | **+0.22** | 1.0 | 4.0 | 15.0 | 37.0 | 39.0 | 155.3 | 287.1 | 703.0 |
| **Monetary 365d (VND)** | +22.00 | **-0.51** | -3.55 tỷ | 4.45 tr | 23.01 tr | 257.44 tr | 102.47 tr | 947.50 tr | 3.97 tỷ | 46.38 tỷ |

*Nhận xét:*
- **Recency:** Skewness giảm từ **+1.58** về **-0.03** (gần như đối xứng hoàn hảo quanh trung vị 15 ngày).
- **Frequency:** Skewness giảm từ **+3.93** về **+0.22** (triệt tiêu tình trạng tập trung ở các giá trị nhỏ).
- **Monetary:** Skewness giảm từ **+22.00** về **-0.51** (loại bỏ sự thống trị của các hợp đồng hàng chục tỷ VND).

---

## 7. KẾT QUẢ THI HÀNH BỘ KIỂM THỬ ĐƠN VỊ (UNIT TESTS)

Bộ kiểm thử đơn vị `SOVIGAZ_ML/tests/test_rfm_snapshot.py` đã được mở rộng thành **13 kiểm thử chuyên biệt** và thi hành thành công 100%:

```text
Ran 13 tests in 0.847s
OK
```

Bảng phân tích kết quả từng kiểm thử:

1. `test_frequency_uses_distinct_refno`: **PASS** – Xác nhận `BDNB2` có 1,667 dòng nhưng `frequency_365d` được tính chuẩn xác bằng 703 hóa đơn duy nhất.
2. `test_primary_segmentation_has_unique_customer`: **PASS** – Xác nhận tập sơ cấp có đúng 1,359 khách hàng duy nhất trên 1,359 dòng (`unique == len`).
3. `test_primary_segmentation_snapshot_is_2025_12_31`: **PASS** – Xác nhận tập sơ cấp chỉ chứa duy nhất mốc thời gian `2025-12-31`.
4. `test_rfm_observation_window_365d`: **PASS** – Xác nhận ngày $T$ (`2025-12-31`) được bao hàm và ngày $T-365\text{d}$ (`2024-12-31`) bị loại trừ khỏi cửa sổ 365 ngày.
5. `test_rfm_no_future_transaction`: **PASS** – Lấy mẫu 50 khách hàng ngẫu nhiên, xác nhận recency khớp với khoảng cách từ $T$ tới ngày mua cuối cùng $\le T$.
6. `test_customer_eligibility_rule_consistent`: **PASS** – Xác nhận mọi khách hàng trong tập sơ cấp đều có `frequency_365d >= 1`.
7. `test_panel_customer_key_not_null`: **PASS** – Không có mã khách hàng rỗng trong tập panel 5 snapshot.
8. `test_panel_no_duplicate_customer_snapshot_key`: **PASS** – Khóa `(AccountObjectCode, snapshot_date)` là duy nhất trong panel.
9. `test_panel_expected_row_count`: **PASS** – Tập panel đạt đúng 5,502 dòng như Phase 2.
10. `test_panel_snapshots_preserved`: **PASS** – Bảo toàn đúng 5 mốc snapshot bán niên định kỳ.
11. `test_panel_churn_labels_binary`: **PASS** – Nhãn rời bỏ 60d, 90d, 120d chỉ nhận giá trị nhị phân $\{0, 1\}$.
12. `test_negative_monetary_handled_properly`: **PASS** – 11 trường hợp doanh thu âm đều có `has_negative_revenue_365d == 1` và giá trị `log_monetary >= 0`.
13. `test_artifacts_exist`: **PASS** – Toàn bộ 11 tập tin dữ liệu, bảng kiểm toán và hình vẽ đều hiện diện trên đĩa.

Kiểm tra toàn bộ test suite dự án (`python -m unittest discover`): **25/25 TESTS PASS (100% OK)**.

---

## 8. DANH MỤC TẬP TIN ĐÃ THAY ĐỔI & TẠO MỚI

### Các tập tin code đã cập nhật:
1. `SOVIGAZ_ML/src/features/rfm_snapshot_builder.py`:
   - Hiệu chỉnh logic Frequency sang `nunique(RefNo)`.
   - Bổ sung hàm `build_primary_segmentation_rfm()` tách tập phân khúc sơ cấp.
   - Bổ sung các hàm kiểm toán tự động xuất `rfm_frequency_audit_comparison.csv` và `negative_monetary_audit.csv`.
   - Cập nhật ma trận rò rỉ dữ liệu `feature_leakage_matrix_4a.csv`.
2. `SOVIGAZ_ML/tests/test_rfm_snapshot.py`:
   - Bổ sung 6 kiểm thử bắt buộc theo yêu cầu Sub-Phase 4A.1, nâng tổng số test lên 13 kiểm thử.

### Các tập tin artifacts xuất bản:
1. `SOVIGAZ_ML/outputs/customer_segmentation/rfm_segmentation_primary.parquet`: **Tập dữ liệu sơ cấp phân khúc khách hàng** ($N = 1,359$ dòng, 1 dòng = 1 khách hàng).
2. `SOVIGAZ_ML/outputs/customer_segmentation/rfm_snapshot.parquet`: **Tập bảng đa thời điểm** ($N = 5,502$ dòng, phục vụ phân tích biến động và Churn).
3. `SOVIGAZ_ML/outputs/customer_segmentation/rfm_frequency_audit_comparison.csv`: Bảng kiểm toán tần suất so sánh `count(RefNo)` vs `nunique(RefNo)`.
4. `SOVIGAZ_ML/outputs/customer_segmentation/negative_monetary_audit.csv`: Bảng kiểm toán nguồn gốc 11 bản ghi doanh thu âm và phương pháp xử lý.
5. `SOVIGAZ_ML/outputs/customer_segmentation/rfm_primary_summary_stats.csv`: Thống kê mô tả và độ lệch của tập khách hàng sơ cấp.
6. `SOVIGAZ_ML/outputs/customer_segmentation/rfm_summary_stats.csv`: Thống kê mô tả và độ lệch trên tập panel.
7. `SOVIGAZ_ML/outputs/customer_segmentation/rfm_window_comparison.csv`: Đối chiếu định lượng cửa sổ 90d, 180d, 365d.
8. `SOVIGAZ_ML/outputs/churn/churn_sensitivity_analysis.csv`: Phân tích độ nhạy nhãn Churn 60d, 90d, 120d qua 5 snapshot.
9. `SOVIGAZ_ML/outputs/churn/churn_label_boundary_audit.csv`: Bằng chứng kiểm toán ranh giới nhãn ngày T+90 vs T+91.
10. `SOVIGAZ_ML/reports/feature_leakage_matrix_4a.csv`: Ma trận kiểm soát rò rỉ dữ liệu đặc trưng RFM.
11. `SOVIGAZ_ML/outputs/figures/customer/01_rfm_distribution.png`: Biểu đồ trực quan hóa phân phối Raw vs Log1p trên 1,359 khách hàng sơ cấp.
12. `SOVIGAZ_ML/reports/SUB_PHASE_4A1_REPORT.md`: Báo cáo khoa học chính thức Sub-Phase 4A.1.

---

## 9. QUY TẮC DỪNG (STOPPING CONFIRMATION)

Sub-Phase 4A.1 đã hoàn thành đầy đủ, đạt độ chuẩn xác phương pháp luận cao nhất.  
Hệ thống **DỪNG LẠI TẠI ĐÂY**, tuân thủ nghiêm ngặt chỉ dẫn:
- **KHÔNG** chạy thuật toán phân cụm K-Means.
- **KHÔNG** chạy phân cụm Gaussian Mixture Model (GMM).
- **KHÔNG** tính Silhouette, Davies-Bouldin hay Elbow curve.
- **KHÔNG** huấn luyện bất kỳ mô hình Churn Prediction nào.

Trân trọng chờ ý kiến đánh giá và phê duyệt từ Trưởng dự án để chuyển sang **SUB-PHASE 4B – CLUSTERING & VALIDATION**.
