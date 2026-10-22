# BÁO CÁO NGHIỆM THU CUỐI CÙNG — BÀI TOÁN 3.1
# FINAL HARDENING, TEMPORAL ALIGNMENT AUDIT & FINAL LOCK

---

**Dự án:** Hệ thống Phân tích Dữ liệu & Machine Learning B2B — SOVIGAZ  
**Hạng mục:** BÀI TOÁN 3.1 — FINAL HARDENING, TEMPORAL ALIGNMENT AUDIT & FINAL LOCK  
**Vai trò:** Senior Machine Learning Engineer & Data Scientist  
**Mã kiểm định:** `SOVIGAZ-ML-AUDIT-3.1-FINAL`  
**Ngày thực hiện:** 2026-10-06  
**Quyết định cuối cùng:** **OPTION B — FINAL LOCKED**  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Sub-Phase 3.1 được thực hiện như một đợt nghiệm thu độc lập và gia cố kỹ thuật cuối cùng cho **Bài toán 3 — Đánh giá Rủi ro Phơi nhiễm Công nợ B2B & Xếp hạng Tín dụng Khách hàng**.

### Kết quả kiểm định cốt lõi:
1. **Tuân thủ Tuyệt đối Ranh giới Phương pháp luận (Branch B):**
   - **ZERO RETRAINING:** Toàn bộ các mô hình từ Phase 3 (Dự báo doanh số CatBoost/SARIMAX), Sub-Phase 4B (Phân cụm K-Means $K=4$) và Sub-Phase 4C/4C.1 (Mô hình Churn CatBoost) được giữ nguyên vẹn 100%, không bị retrain hay thay đổi tham số.
   - **ZERO PSEUDO-LABELING:** Không tạo nhãn vỡ nợ giả mạo, không tạo hạn nợ giả mạo, không nội suy lịch sử thanh toán. Hệ thống kiên định vận hành theo **Thang điểm Rủi ro Phơi nhiễm Công nợ (Credit Exposure Risk Score 0–100)** minh bạch và khách quan.
2. **Khắc phục Triệt để Lệch pha Thời gian (Temporal Alignment Audit PASS):**
   - Phân định rõ ràng: Snapshot Công nợ chốt sổ ngày **31/07/2026** (FAST ERP) và Tham chiếu Nguy cơ Rời bỏ Lịch sử chốt ngày **31/12/2025** (Sub-Phase 4D).
   - Loại bỏ toàn bộ các phát biểu gây ngộ nhận về "nguy cơ rời bỏ trong 90 ngày tới tại 31/07/2026" hoặc "Current Joint Risk".
3. **Đối chiếu Khớp số Tuyệt đối (Numerical Reconciliation PASS):**
   - Tổng công nợ: Đúng từng đồng **56,582,422,635 VND** trên toàn bộ 8 artifact và bảng biểu đối chéo.
   - Hạt nhân dữ liệu (Grain): Chuẩn xác **584 khách hàng**, không trùng lặp (`duplicate = 0`), không null key (`null = 0`).
4. **Kiểm định Hồi quy Toàn diện (Regression Tests PASS):**
   - Credit Unit Tests: **18/18 PASS**.
   - Toàn bộ Test Suite dự án: **89/89 PASS** (100%).

---

## 2. KIỂM ĐỊNH LỆCH PHA THỜI GIAN (TEMPORAL ALIGNMENT AUDIT)

Bảng đối soát mốc thời gian giữa các thành phần dữ liệu của Bài toán 3:

| Thành phần Dữ liệu | Mốc Snapshot | Cửa sổ Dữ liệu | Ý nghĩa Nghiệp vụ | Nguồn Dữ liệu Gốc | Trạng thái |
| :--- | :---: | :---: | :--- | :--- | :---: |
| **Credit Exposure Baseline** | `2026-07-31` | Tích lũy đến 31/07/2026 | Số dư công nợ Tài khoản 131 thực tế tại thời điểm chốt sổ | `Fact_AnalyticsDebit.csv`, `DM_AccountObjectDebt.csv` | **PASS** |
| **Sales Exposure Trailing** | Cutoff `2026-06-30` | 30d, 90d, 180d, 365d | Doanh số mua hàng lịch sử trước thời điểm công nợ (Zero Leakage) | `processed_sales.parquet` | **PASS** |
| **Customer Segmentation** | `2025-12-31` | 365 ngày (năm 2025) | Phân khúc khách hàng chiến lược theo hành vi RFM năm 2025 | `cluster_assignments.csv` (K-Means $K=4$) | **PASS** |
| **Historical Churn Risk Reference** | `2025-12-31` | 365 ngày (năm 2025) | Tham chiếu xác suất rời bỏ 90 ngày trong Q1/2026 đã khóa | `churn_priority_customers.csv` (CatBoost) | **PASS** |
| **Credit × Churn Matrix** | **Dual Snapshot** | Độ lệch: 7 tháng | Đối chiếu phơi nhiễm công nợ 31/07/2026 với tham chiếu rời bỏ 31/12/2025 | `credit_churn_crosstab.csv` | **PASS (CONDITIONAL)** |

> **Quy tắc Diễn giải Bắt buộc:**
> Ma trận đối chiếu Công nợ × Rời bỏ phải luôn được gọi là:
> **"Credit Exposure (Snapshot 31/07/2026) × Historical Churn Risk Reference (Snapshot 31/12/2025)"**.
> Tuyệt đối KHÔNG gọi là "Current Joint Risk" hay "Nguy cơ rời bỏ hiện tại".

---

## 3. KIỂM ĐỊNH CHUẨN HÓA THUẬT NGỮ (TERMINOLOGY AUDIT)

Đã rà soát và chuẩn hóa toàn bộ các thuật ngữ trong báo cáo, mã nguồn và giao diện người dùng:

| Thuật ngữ Cũ | Thuật ngữ Chuẩn hóa Mới | Căn cứ Khoa học & Lý do Điều chỉnh |
| :--- | :--- | :--- |
| `Credit Risk Score` | **Credit Exposure Risk Score** *(Điểm Rủi ro Phơi nhiễm Công nợ)* | Tránh gây hiểu nhầm thành Xác suất Vỡ nợ (Probability of Default - PD). Thang điểm là chỉ số phơi nhiễm luật định (Rule-based exposure index) từ 0 đến 100. |
| `"3.38 tỷ VND nợ xấu"` / `"cần lập dự phòng nợ xấu"` | **"Khoản phải thu thuộc nhóm trên 3 năm cần được Finance ưu tiên rà soát khả năng thu hồi và đánh giá nhu cầu trích lập dự phòng theo chính sách kế toán áp dụng."** | Tuổi nợ trên 1095 ngày (> 3 năm) là một nhóm phân loại tuổi nợ theo kế toán (Aging bucket), không đồng nghĩa với biến cố pháp lý vỡ nợ (Default) hay xóa sổ nợ. |
| `"Danh mục phụ thuộc vào khách hàng lớn"` | **"Danh mục có mức tập trung tổng thể thấp theo HHI (149.34 điểm), nhưng exposure vẫn tập trung đáng kể ở nhóm 50 khách hàng lớn nhất (65.78%)."** | Chỉ số $HHI = 149.34 < 1,500$ thuộc ngưỡng "Unconcentrated" theo chuẩn DOJ/FTC. Không dùng từ "phụ thuộc" khi chưa có stress test kiểm chứng. |
| `"Current Joint Risk"` / `"Nguy cơ rời bỏ 90 ngày tới tại 31/07/2026"` | **"Credit Exposure (31/07/2026) × Historical Churn Risk Reference (31/12/2025)"** | Hai mốc snapshot cách nhau 7 tháng. Churn phản ánh hành vi năm 2025, công nợ phản ánh số dư tháng 7/2026. |
| `Anomaly = Vỡ nợ / Gian lận` | **"Anomaly = Khách hàng có exposure pattern bất thường so với phân phối của danh mục"** | Tuân thủ tiên đề: $Anomaly \neq Default, Anomaly \neq Bad Debt, Anomaly \neq Fraud$. Isolation Forest chỉ phát hiện dị biệt thống kê. |

---

## 4. ĐỐI CHIẾU KHỚP SỐ LIỆU ĐỊNH LƯỢNG (NUMERICAL RECONCILIATION)

Toàn bộ các chỉ số đã được tính toán độc lập từ sổ cái kế toán và đối chiếu với các artifact đầu ra:

| Chỉ số Định lượng | Giá trị Sổ cái Gốc | Giá trị Tính toán lại | Sai lệch | Trạng thái |
| :--- | ---:| ---:| :---: | :---: |
| **Tổng số khách hàng có nợ** | 584 | 584 | 0 | **PASS** |
| **Tổng dư nợ phải thu (TK 131)** | 56,582,422,635 VND | 56,582,422,635 VND | 0.00 VND | **PASS** |
| **Tổng nợ trong hạn / trước hạn** | 32,895,513,228 VND | 32,895,513,228 VND | 0.00 VND | **PASS** |
| **Tổng nợ quá hạn** | 23,686,909,407 VND | 23,686,909,407 VND | 0.00 VND | **PASS** |
| **Nợ quá hạn trên 3 năm (> 1095d)** | 3,376,608,384 VND (42 KH) | 3,376,608,384 VND (42 KH) | 0.00 VND | **PASS** |
| **Tổng số KH theo Risk Band** | 19 + 64 + 143 + 358 = 584 | 584 | 0 | **PASS** |
| **Tổng nợ theo Risk Band** | 11.84B + 11.64B + 25.26B + 7.85B | 56,582,422,635 VND | 0.00 VND | **PASS** |
| **Tổng số KH theo Priority Tier** | 4 (P1) + 79 (P2) + 31 (P3) + 470 (P4) | 584 | 0 | **PASS** |
| **Tổng nợ theo Priority Tier** | 1.02B + 22.45B + 1.37B + 31.74B | 56,582,422,635 VND | 0.00 VND | **PASS** |
| **Tỷ trọng Dư nợ Top 10** | 16,631,864,556 VND | 29.39% | 0.00% | **PASS** |
| **Tỷ trọng Dư nợ Top 20** | 24,221,015,450 VND | 42.81% | 0.00% | **PASS** |
| **Tỷ trọng Dư nợ Top 50** | 37,220,367,134 VND | 65.78% | 0.00% | **PASS** |
| **Chỉ số Tập trung HHI Points** | 149.34 điểm | 149.34 điểm | 0.00 pts | **PASS** |
| **Số lượng Dị thường Thống kê** | 30 khách hàng (5.14%) | 30 khách hàng | 0 | **PASS** |

---

## 5. KIỂM ĐỊNH HẠT NHÂN DỮ LIỆU & GHÉP NỐI (GRAIN & JOIN AUDIT)

Kiểm tra tính toàn vẹn của các tập tin đầu ra chính:
1. `customer_credit_master.csv`:
   - Grain: 1 dòng = 1 `AccountObjectCode` duy nhất.
   - Row count: **584 dòng** (khớp chính xác 584 khách hàng từ sổ cái).
   - Duplicate key count: **0**.
   - Null key count: **0**.
2. `top_credit_exposure_customers.csv`:
   - Grain: 1 dòng = 1 `AccountObjectCode`, xếp hạng theo dư nợ giảm dần từ 1 đến 584.
3. **Kiểm tra Join Explosion:**
   - Các phép ghép nối với `customer_master`, `processed_sales`, `cluster_assignments` và `churn_priority_customers` sử dụng đúng khóa ngoại `AccountObjectCode`.
   - Hoàn toàn **không xảy ra nhân bản dòng (zero join multiplication)**.

---

## 6. KIỂM ĐỊNH TẬP DỮ LIỆU POWER BI (POWER BI AUDIT)

Kiểm tra tập tin `outputs/powerbi/credit_risk_customer.csv`:
- **Số dòng:** Đúng 584 dòng.
- **Số cột:** 21 cột phân tích đầy đủ.
- **Trường siêu dữ liệu thời gian bổ sung:**
  - `credit_snapshot_date`: Có giá trị `'2026-07-31'` cho 100% dòng.
  - `churn_snapshot_date`: Có giá trị `'2025-12-31'` cho 412 khách hàng có tham chiếu rời bỏ, và `'Not Evaluated in 2025'` cho 172 khách hàng còn lại.
- **Tính toàn vẹn điểm số:**
  - `credit_exposure_risk_score`: Dao động từ 4.0 đến 88.0 điểm, không có giá trị null, khớp 100% với `credit_risk_score`.
  - Phân tầng `credit_risk_band` nhất quán 100% với ngưỡng điểm.

---

## 7. KIỂM ĐỊNH ỨNG DỤNG WEB (WEB APPLICATION AUDIT)

Đã kiểm tra giao diện Dashboard tại `http://127.0.0.1:8000`:
- **Tab 3 ("Bài toán 3: Rủi ro Tín dụng & Phân tích Công nợ B2B"):**
  - Đã gắn huy hiệu thể hiện mốc thời gian độc lập:
    - *Snapshot Công nợ: 31/07/2026 (TK 131 FAST ERP)*
    - *Tham chiếu Rời bỏ Lịch sử: 31/12/2025 (CatBoost Locked)*
    - *Rule-based Exposure Scoring (Không phải PD)*
  - Khung Quyết định Phương pháp luận đã làm rõ: không ép học có giám sát, không có nhãn vỡ nợ, điểm số là thang đo phơi nhiễm.
  - Tiêu đề bảng danh sách khách hàng hiển thị chuẩn: `Điểm Phơi nhiễm (Credit Exposure Score)`.
- **API Endpoints:**
  - `/api/credit/stats`: Trả về đầy đủ các KPI tổng hợp cùng `credit_snapshot_date = "2026-07-31"` và `churn_snapshot_date = "2025-12-31"`.
  - `/api/credit/customers`: Phân trang, tìm kiếm và lọc dữ liệu chính xác trên 584 khách hàng.

---

## 8. CÔNG BỐ HẠN CHẾ DỮ LIỆU (DATA LIMITATIONS STATEMENT)

Báo cáo chính thức công bố 11 hạn chế dữ liệu thực tế tại SOVIGAZ để đảm bảo tính minh bạch khoa học:
1. **Chỉ có 01 snapshot công nợ kế toán** chốt tại ngày 31/07/2026 từ hệ thống FAST ERP.
2. **Không có chuỗi lịch sử số dư công nợ theo thời gian** (historical debt balance snapshots) để quan sát diễn biến nợ qua các tháng.
3. **Không có ngày đến hạn thanh toán hóa đơn (`DueDate`)** trong sổ chi tiết bán hàng.
4. **Không có ngày thanh toán thực tế của khách hàng (`PaymentDate`)** gắn với từng hóa đơn.
5. **Không có lịch sử dòng tiền thanh toán chi tiết theo từng hóa đơn** (invoice-level payment history).
6. **Không có dữ liệu ghi nhận biến cố vỡ nợ lịch sử** (historical default / loss outcomes).
7. **Không thể xây dựng mô hình học có giám sát dự báo Xác suất Vỡ nợ (Supervised Probability of Default - PD)** một cách trung thực và khách quan.
8. **Thang điểm Credit Exposure Risk Score là chỉ số phơi nhiễm dựa trên luật kế toán (Rule-based exposure scoring index)**, không phải là xác suất toán học.
9. **Tuổi nợ trên 3 năm không đồng nghĩa với Vỡ nợ** ($\text{Aging} > 3\text{ years} \neq \text{Default}$).
10. **Dị thường thống kê không đồng nghĩa với Vỡ nợ, Nợ xấu hay Gian lận** ($\text{Anomaly} \neq \text{Default / Bad Debt / Fraud}$).
11. **Ma trận Credit × Churn phải được diễn giải theo đúng 2 mốc thời gian độc lập** với độ lệch 7 tháng, không suy diễn thành nguy cơ rời bỏ đồng thời tại thời điểm hiện tại.

---

## 9. KẾT QUẢ KIỂM ĐỊNH HỒI QUY (REGRESSION TEST RESULTS)

Toàn bộ test suite được thực thi bằng `python -m unittest discover`:

```text
Ran 89 tests in 10.087s

OK
```

- **Số test trước Sub-Phase 3.1:** 86 tests.
- **Số test mới bổ sung:** 3 tests (kiểm định `credit_snapshot_date`, `churn_snapshot_date`, `credit_exposure_risk_score`, và tồn tại artifact audit CSV).
- **Tổng số test hiện tại:** **89 tests**.
- **Kết quả:** **89/89 PASS (100%)**, 0 Failures, 0 Errors.
- **Tỷ lệ vượt qua:** **100.0%**.

---

## 10. QUYẾT ĐỊNH NGHIỆM THU CUỐI CÙNG (FINAL DECISION)

Dựa trên toàn bộ kết quả kiểm toán, đối soát số liệu, chuẩn hóa thuật ngữ và kiểm tra hồi quy:

$$\mathbf{FINAL\ STATUS:\ OPTION\ B\ —\ FINAL\ LOCKED}$$

- Hệ thống B2B Credit Exposure Profiling & Outstanding Debt Risk Scoring đạt chuẩn kiểm định cao nhất về độ trung thực khoa học, tính nhất quán số liệu và giá trị ứng dụng thực tiễn.
- Nghiệm thu hoàn tất toàn bộ Bài toán 3.
- Dự án dừng lại tại đây theo đúng chỉ thị, không triển khai bất kỳ mô hình dự báo vỡ nợ giả mạo hay Phase nào tiếp theo.
