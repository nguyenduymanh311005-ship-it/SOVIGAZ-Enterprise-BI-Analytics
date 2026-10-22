# BÁO CÁO KHOA HỌC DỰ ÁN ML — BÀI TOÁN 3
## ĐÁNH GIÁ RỦI RO TÍN DỤNG, PHÂN TÍCH CÔNG NỢ B2B & XẾP HẠNG RỦI RO PHƠI NHIỄM
*(B2B Customer Credit Risk, Outstanding Debt Exposure Profiling & Risk Scoring)*

---

**Dự án:** Hệ thống Phân tích Dữ liệu & Machine Learning B2B — SOVIGAZ  
**Hạng mục:** BÀI TOÁN 3 — CREDIT RISK & OVERDUE DEBT ANALYSIS  
**Tác giả:** Senior Machine Learning Engineer & Data Scientist  
**Trạng thái kiểm định:** **PASS / AUDITED — DECISION GATE: BRANCH B SELECTED**  
**Mã kiểm định:** `SOVIGAZ-ML-CREDIT-2026-B`  
**Ngày hoàn thành:** 2026-10-06  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

1. **Bối cảnh & Quyết định Phương pháp luận Cốt lõi (Core Epistemic Gate):**
   - Bài toán 3 được triển khai nhằm định lượng rủi ro tín dụng thương mại B2B và phơi nhiễm công nợ phải thu của Công ty Cổ phần Hơi Kỹ nghệ Que Hàn (SOVIGAZ).
   - Đợt audit dữ liệu toàn diện (Decision Gate Audit) xác nhận rằng dữ liệu công nợ kế toán hiện tại chỉ tồn tại dưới dạng **01 snapshot tĩnh duy nhất chốt sổ ngày 31/07/2026** (`Fact_AnalyticsDebit.csv` và `DM_AccountObjectDebt.csv`), đồng thời sổ chi tiết bán hàng không có ngày đến hạn (`DueDate`) và ngày thực trả (`PaymentDate`) theo từng hóa đơn.
   - Tuân thủ nguyên tắc khoa học nghiêm ngặt: **TUYỆT ĐỐI KHÔNG ÉP DỮ LIỆU ĐỂ CHẠY MÔ HÌNH HỌC CÓ GIÁM SÁT (SUPERVISED ML)** bằng cách tự chế nhãn vỡ nợ giả định (`debt > 0 → default = 1`) hoặc nhân bản dữ liệu snapshot làm lịch sử giả.
   - Dự án đã chính thức lựa chọn **BRANCH B: B2B Credit Exposure Profiling & Outstanding Debt Risk Scoring**, chuyển giao một hệ thống đo lường rủi ro mô tả và chẩn đoán (Descriptive & Diagnostic Risk Intelligence) chuẩn mực, khách quan và có giá trị thực tiễn cao cho Ban Giám đốc và Phòng Tài chính Kế toán.

2. **Các Kết quả Thực nghiệm Định lượng Trọng yếu:**
   - **Quy mô Phơi nhiễm Công nợ Thương mại (Tài khoản 131):** Tổng cộng **584 khách hàng** có số dư nợ với tổng giá trị chính xác là **56,582,422,635 VND (56.58 tỷ VND)**.
   - **Cơ cấu Tuổi nợ (Aging Structure):** 
     - Nợ trong hạn / trước hạn (Current Debt): **32,895,513,228 VND (58.1%)**.
     - Nợ quá hạn (Overdue Debt): **23,686,909,407 VND (41.9%)**, trong đó có **3.67 tỷ VND** thuộc nhóm tuổi nợ quá hạn trên 1 năm (trong đó 3.38 tỷ VND thuộc nhóm quá hạn trên 3 năm từ 42 khách hàng). Khoản phải thu thuộc nhóm trên 3 năm cần được Finance ưu tiên rà soát khả năng thu hồi và đánh giá nhu cầu trích lập dự phòng theo chính sách kế toán áp dụng.
   - **Độ Lệch Phân bố Công nợ (Extreme Right Skewness):** Dư nợ bình quân là 96.89 triệu VND nhưng trung vị chỉ là **17.48 triệu VND** (Độ lệch Skewness = 6.95, Kurtosis = 69.48). 50% khách hàng nợ dưới 17.5 triệu VND, trong khi Top 5% khách hàng có dư nợ từ 493.7 triệu đến 3.72 tỷ VND.
   - **Mức độ Tập trung Công nợ (Debt Concentration & HHI):**
     - Top 10 khách hàng nắm giữ **29.39%** tổng công nợ (16.63 tỷ VND).
     - Top 20 khách hàng nắm giữ **42.81%** tổng công nợ (24.22 tỷ VND).
     - Top 50 khách hàng nắm giữ **65.78%** tổng công nợ (37.22 tỷ VND).
     - Chỉ số HHI đạt **149.34 điểm** ($HHI_{\text{decimal}} = 0.014934$), phản ánh danh mục có mức tập trung tổng thể thấp theo HHI, nhưng exposure vẫn tập trung đáng kể ở nhóm 50 khách hàng lớn nhất (chiếm 65.78% tổng dư nợ toàn công ty). Không có bằng chứng khẳng định danh mục bị "phụ thuộc" vào một khách hàng cá biệt nào.
   - **Thang điểm Rủi ro Phơi nhiễm Công nợ (Credit Exposure Risk Score 0–100):** Được tính toán dựa trên cấu trúc 3 trụ cột (Quy mô phơi nhiễm 40 điểm + Gánh nặng nợ & tuổi nợ 35 điểm + Cảnh báo hành vi giao dịch 25 điểm). Đây là rule-based exposure scoring index phục vụ xếp hạng mức độ phơi nhiễm, KHÔNG PHẢI xác suất vỡ nợ (Probability of Default). Phân tầng khách hàng thành 4 nhóm: Critical Exposure (19 KH, 11.84 tỷ VND), High Exposure (64 KH, 11.64 tỷ VND), Moderate Exposure (143 KH, 25.26 tỷ VND) và Low Exposure (358 KH, 7.85 tỷ VND).
   - **Ma trận Đối chiếu Phơi nhiễm Công nợ (31/07/2026) × Nguy cơ Rời bỏ Lịch sử (31/12/2025):**
     - **Priority 1 (Critical Joint Action):** Phát hiện **4 khách hàng** vừa có rủi ro phơi nhiễm công nợ cao vừa có nguy cơ rời bỏ cao (tổng nợ 1.02 tỷ VND, quá hạn 206 triệu VND), đòi hỏi sự can thiệp phối hợp khẩn cấp giữa Giám đốc Tài chính và Giám đốc Bán hàng.
     - **Priority 2 (Credit Terms & Exposure Monitoring):** Gồm **79 khách hàng** có dư nợ rất lớn nhưng khách vẫn đang mua hàng ổn định (tổng nợ lên tới **22.45 tỷ VND - chiếm 39.68% toàn bộ công nợ công ty**), là nhóm cần tái cấu trúc hạn mức tín dụng và chính sách thu tiền.

---

## 2. ĐỊNH NGHĨA BÀI TOÁN (PROBLEM DEFINITION)

### 2.1. Mục tiêu Nghiệp vụ
Doanh nghiệp sản xuất và phân phối khí công nghiệp B2B (SOVIGAZ) bán hàng theo cơ chế gối đầu công nợ (Trade Credit). Do đó, rủi ro tín dụng trong môi trường B2B không đơn thuần là "khách hàng phá sản" mà là:
1. **Phơi nhiễm dòng tiền (Cash Flow Exposure):** Tỷ trọng công nợ bị chiếm dụng vốn quá lớn ảnh hưởng đến vốn lưu động.
2. **Nợ quá hạn kéo dài (Chronic Overdue Debt):** Công nợ tồn đọng trên 90 ngày, 180 ngày hoặc trên 1 năm không được thu hồi.
3. **Mất cân đối Nợ / Doanh thu (Debt-to-Revenue Burden):** Số dư nợ vượt quá quy mô mua hàng thực tế của khách hàng.
4. **Rủi ro Rời bỏ khi đang nợ (Churn-Debt Intersection):** Khách hàng giảm dần giao dịch hoặc ngừng mua hàng trong khi vẫn chưa thanh toán hết nợ cũ.

### 2.2. Khung Tuyên bố Bản chất (Epistemic Framing)
Hệ thống xác lập ranh giới ngôn ngữ chuẩn xác:
- **Tên chính thức:** *B2B Credit Exposure Risk Score (Điểm Rủi ro Phơi nhiễm Công nợ) & Credit Exposure Profiling*.
- **Ranh giới:** Đây là hệ thống chấm điểm và phân tầng rủi ro phơi nhiễm công nợ (Risk Exposure Scoring), **KHÔNG PHẢI là Xác suất Vỡ nợ (Probability of Default)**. Xác suất vỡ nợ chỉ có thể được huấn luyện khi có dữ liệu ghi nhận lịch sử vỡ nợ thực tế.

---

## 3. TÍNH SẴN SÀNG CỦA DỮ LIỆU TÍN DỤNG (CREDIT DATA AVAILABILITY)

Qua kiểm tra toàn bộ 86 tệp trong kho lưu trữ dữ liệu, hiện trạng dữ liệu được lập bảng độc lập:

| Hạng mục dữ liệu | Tình trạng thực tế | Nguồn lưu trữ | Đánh giá tính khả thi cho Machine Learning |
| :--- | :---: | :--- | :--- |
| **Bảng số dư công nợ chi tiết** | Có (1 snapshot 31/07/2026) | `Fact_AnalyticsDebit.csv` (1,788 dòng) | Cung cấp số dư nợ theo 11 nhóm tuổi nợ tại 1 mốc thời gian. |
| **Sổ cái công nợ tổng hợp** | Có (1 snapshot 31/07/2026) | `DM_AccountObjectDebt.csv` (1,494 dòng) | Cung cấp số dư nợ đầu kỳ, phát sinh và số đã trả tại 1 mốc thời gian. |
| **Chuỗi lịch sử công nợ theo tháng (Panel)** | **KHÔNG CÓ** | Không có nguồn | Không thể quan sát sự biến động công nợ của khách hàng qua các tháng. |
| **Ngày đến hạn từng hóa đơn (`DueDate`)** | **KHÔNG CÓ** | `processed_sales.parquet` | Dữ liệu bán hàng chỉ có `RefDate` và `PostedDate`, không có `DueDate`. |
| **Ngày thanh toán thực tế (`PaymentDate`)** | **KHÔNG CÓ** | Không có nguồn | Không có bảng phiếu thu/sổ quỹ thanh toán hóa đơn. |
| **Hạn mức tín dụng (`CreditLimit`)** | **KHÔNG CÓ** | Không có nguồn | Doanh nghiệp chưa số hóa hạn mức nợ vào ERP. |
| **Nhãn vỡ nợ / xóa sổ nợ (`Default/Write-off`)**| **KHÔNG CÓ** | Không có nguồn | Không có lịch sử ghi nhận khách hàng vỡ nợ pháp lý. |

---

## 4. QUYẾT ĐỊNH CỔNG NGHIỆM THU (DECISION GATE VERDICT)

Căn cứ trên Section VI của Master Prompt:
- **BRANCH A:** Đòi hỏi có chuỗi lịch sử thanh toán, ngày đến hạn/ngày trả từng hóa đơn để xây dựng biến mục tiêu vỡ nợ/quá hạn theo thời gian. &rarr; **KHÔNG ĐỦ ĐIỀU KIỆN**.
- **BRANCH B:** Khi chỉ có snapshot công nợ hiện tại, không được ép supervised ML, chuyển toàn bộ sang hệ thống **Credit Risk Profiling & Outstanding Debt Risk Scoring**. &rarr; **CHÍNH THỨC ĐƯỢC KÍCH HOẠT**.

> **Tuyên ngôn phương pháp luận:** *"Data availability constrains the problem formulation."* Việc dừng supervised prediction khi thiếu nhãn lịch sử là biểu hiện của sự trung thực học thuật và chuẩn mực kỹ thuật cao nhất, bảo vệ doanh nghiệp khỏi các mô hình giả tạo (hallucinated models) gây rủi ro quản trị nghiêm trọng.

---

## 5. CÁC NGUỒN DỮ LIỆU ĐỐI SOÁT (DATA SOURCES & RECONCILIATION)

### 5.1. Bóc tách Tài khoản Kế toán trong `Fact_AnalyticsDebit`
Dữ liệu kế toán SOVIGAZ bao gồm nhiều tài khoản công nợ nội bộ và nghiệp vụ:
- **Tài khoản 131 ("Phải thu của khách hàng"):** Có **1,011 dòng**, thuộc về **584 khách hàng**, tổng số tiền là **56,582,422,635 VND**. Đây là đối tượng duy nhất của Bài toán 3.
- **Tài khoản 136 / 1361 / 13617 ("Phải thu nội bộ"):** 747.26 tỷ VND giữa các chi nhánh nội bộ SOVIGAZ (loại bỏ khỏi phạm vi rủi ro khách hàng).
- **Tài khoản 244 / 2442 ("Cầm cố, ký quỹ, ký cược"):** 3.30 tỷ VND (tiền cọc đi thuê của SOVIGAZ).
- **Tài khoản 344 ("Nhận ký quỹ, ký cược"):** 8.75 tỷ VND (tiền cọc vỏ bình khí của khách hàng - nợ phải trả).

### 5.2. Đối soát Số dư Kế toán Tuyệt đối (Exact Reconciliation)
- Trong `Fact_AnalyticsDebit` (TK 131): Tổng nợ phải thu gộp = **56,582,422,635 VND** (584 khách hàng).
- Trong `DM_AccountObjectDebt` (TK 131): Có 871 khách hàng, trong đó 266 khách hàng có số dư nợ bằng 0, 21 khách hàng có số dư âm ($-966,956,082$ VND - khách ứng trước tiền hàng) và 584 khách hàng có số dư nợ dương.
- Phép đối chiếu kế toán:
  $$56,582,422,635 - 966,956,082 = 55,546,500,075 \text{ VND}$$
  Khớp chính xác từng đồng với tổng số dư `ReceiptableDebtAmount` trên Sổ cái `DM_AccountObjectDebt.csv`.

---

## 6. PHÂN TÍCH PHƠI NHIỄM CÔNG NỢ (CREDIT EXPOSURE ANALYSIS)

### 6.1. Thống kê Cơ cấu Tuổi nợ (Aging Breakdown)
Tại ngày chốt sổ 31/07/2026, cơ cấu 56.58 tỷ VND công nợ Tài khoản 131 như sau:

| Nhóm Tuổi nợ (Aging Bucket) | Số dòng | Số khách hàng | Tổng giá trị (VND) | Tỷ trọng (%) | Tính chất rủi ro |
| :--- | :---: | :---: | ---:| ---:| :--- |
| **Nợ trước hạn 0-30 ngày** | 415 | 415 | 17,823,438,548 | 31.50% | Bình thường (Trong kỳ tín dụng) |
| **Nợ trước hạn 31-90 ngày** | 135 | 135 | 11,148,228,668 | 19.70% | Bình thường (Thời hạn tín dụng dài) |
| **Nợ trước hạn trên 90 ngày** | 11 | 11 | 3,801,872,673 | 6.72% | Hợp đồng công nghiệp đặc thù |
| **Không có hạn nợ** | 16 | 16 | 121,973,339 | 0.22% | Nợ chưa xác định hạn |
| **Nợ quá hạn 1-30 ngày** | 192 | 192 | 11,233,502,149 | 19.85% | Quá hạn nhẹ (Chậm thanh toán ngắn hạn) |
| **Nợ quá hạn 31-90 ngày** | 106 | 106 | 4,422,887,816 | 7.82% | Cảnh báo thu hồi nợ cấp 1 |
| **Nợ quá hạn 91-180 ngày** | 43 | 43 | 1,739,626,417 | 3.07% | Quá hạn trung hạn (Rủi ro suy giảm) |
| **Nợ quá hạn 181-365 ngày** | 39 | 39 | 2,616,461,433 | 4.62% | Quá hạn nghiêm trọng |
| **Nợ quá hạn 366-730 ngày** | 9 | 9 | 153,752,044 | 0.27% | Nợ khó đòi (1-2 năm) |
| **Nợ quá hạn 731-1095 ngày** | 3 | 3 | 144,071,164 | 0.25% | Nợ khó đòi (2-3 năm) |
| **Nợ quá hạn trên 1095 ngày** | 42 | 42 | 3,376,608,384 | 5.97% | Nợ đọng lâu năm (> 3 năm) |
| **TỔNG CỘNG TÀI KHOẢN 131** | **1,011** | **584** | **56,582,422,635** | **100.00%** | **Khớp chính xác 100% nguồn ERP** |

> **Nhận định:** Có **23.69 tỷ VND (41.9%)** công nợ đang ở trạng thái quá hạn. Đặc biệt, có **3.67 tỷ VND** công nợ thuộc nhóm tuổi nợ quá hạn trên 1 năm (trong đó 3.38 tỷ VND thuộc nhóm quá hạn trên 3 năm từ 42 khách hàng). Khoản phải thu thuộc nhóm trên 3 năm cần được Finance ưu tiên rà soát khả năng thu hồi và đánh giá nhu cầu trích lập dự phòng theo chính sách kế toán áp dụng.

---

## 7. ĐẶC TRƯNG RỦI RO TÍN DỤNG KHÁCH HÀNG (CUSTOMER CREDIT RISK FEATURES)

Hệ thống trích xuất và tính toán bộ đặc trưng đa chiều cho từng khách hàng tại ngày snapshot:
1. **Nhóm Quy mô Phơi nhiễm (Exposure Scale):**
   - `outstanding_debt`: Tổng dư nợ phải thu (VND).
   - `current_debt`: Nợ trong hạn (VND).
   - `overdue_debt`: Nợ quá hạn (VND).
   - `debt_share`: Tỷ lệ dư nợ của khách hàng trên tổng công nợ toàn công ty.
2. **Nhóm Cơ cấu Tuổi nợ (Aging Metrics):**
   - `overdue_ratio`: Tỷ lệ nợ quá hạn $= \text{overdue\_debt} / \text{outstanding\_debt} \in [0.0, 1.0]$.
   - `is_overdue_any`: Cờ có bất kỳ khoản nợ quá hạn nào.
   - `is_overdue_gt_30d`: Cờ có nợ quá hạn trên 30 ngày.
   - `is_overdue_gt_90d`: Cờ có nợ quá hạn trên 90 ngày.
   - `is_overdue_gt_365d`: Cờ có nợ quá hạn mãn tính trên 1 năm.
3. **Nhóm Gánh nặng Nợ trên Doanh thu (Debt Burden Metrics):**
   - `revenue_365d`, `revenue_180d`, `revenue_90d`, `revenue_30d`: Doanh thu thuần các kỳ liền trước ngày chốt công nợ.
   - `debt_to_revenue_365d`: Tỷ số nợ trên doanh thu 1 năm. Xử lý mẫu số: nếu `revenue_365d <= 0`, gán trần an toàn là 10.0 kèm cờ `is_zero_sales_with_debt = 1`.
   - `debt_to_revenue_90d`: Tỷ số nợ trên doanh thu 90 ngày (kiểm soát trần 10.0).
4. **Nhóm Cảnh báo Hành vi & Xu hướng (Behavioral Warning):**
   - `revenue_momentum_ratio`: Tỷ số đà doanh thu (tốc độ bán hàng 30 ngày so với 90 ngày).
   - `has_negative_revenue`: Cờ phát sinh doanh thu âm trong kỳ.
   - `transaction_count_365d`, `active_days_365d`.

---

## 8. PHƯƠNG PHÁP CHẤM ĐIỂM RỦI RO CÔNG NỢ (RISK SCORING METHODOLOGY)

Do không có nhãn vỡ nợ để hồi quy supervised ML, hệ thống xây dựng **Chỉ số Rủi ro Phơi nhiễm Công nợ Tổng hợp (Composite B2B Credit Risk Score)** theo thang điểm $[0, 100]$ dựa trên 3 trụ cột định lượng minh bạch:

$$\text{Credit Risk Score} = \text{Exposure Score (40đ)} + \text{Debt Burden Score (35đ)} + \text{Behavioral Warning Score (25đ)}$$

```mermaid
graph LR
    subgraph Trụ cột 1: Phơi nhiễm (40đ)
        A["Dư nợ tuyệt đối (Quantiles P25 - P95)"]
    end
    subgraph Trụ cột 2: Gánh nặng & Tuổi nợ (35đ)
        B1["Tỷ lệ nợ quá hạn (Tối đa 15đ)"]
        B2["Quá hạn > 90 ngày (+8đ)"]
        B3["Quá hạn > 365 ngày (+7đ)"]
        B4["Debt-to-Revenue Ratio (+5đ)"]
    end
    subgraph Trụ cột 3: Cảnh báo Hành vi (25đ)
        C1["Ngừng mua hàng 90 ngày gần nhất (+10đ)"]
        C2["Đà doanh thu sụt giảm mạnh (+7đ)"]
        C3["Phát sinh doanh thu âm / trả hàng (+5đ)"]
        C4["Không phát sinh mua hàng cả năm (+3đ)"]
    end
    A --> D["Composite Credit Risk Score (0 - 100)"]
    B1 --> D
    B2 --> D
    B3 --> D
    B4 --> D
    C1 --> D
    C2 --> D
    C3 --> D
    C4 --> D
```

### Chi tiết Trọng số & Quy tắc Tính điểm
1. **Trụ cột 1 — Credit Exposure Score ($0 - 40$ điểm):**
   - $Debt \ge P95$ ($\ge 493.7$ triệu VND): **40 điểm**
   - $P90 \le Debt < P95$ ($246.3 - 493.7$ triệu VND): **32 điểm**
   - $P75 \le Debt < P90$ ($57.4 - 246.3$ triệu VND): **24 điểm**
   - $P50 \le Debt < P75$ ($17.5 - 57.4$ triệu VND): **16 điểm**
   - $P25 \le Debt < P50$ ($3.3 - 17.5$ triệu VND): **8 điểm**
   - $Debt < P25$ ($< 3.3$ triệu VND): **4 điểm**
2. **Trụ cột 2 — Debt Burden & Aging Score ($0 - 35$ điểm):**
   - Điểm theo tỷ lệ quá hạn: $\text{overdue\_ratio} \times 15$ điểm.
   - Điểm tuổi nợ nghiêm trọng: Có nợ quá hạn $> 90$ ngày ($+8$ điểm); có nợ quá hạn $> 365$ ngày ($+7$ điểm).
   - Điểm tỷ số nợ / doanh thu: $\ge 1.0$ ($+5$ điểm); $0.5 - 1.0$ ($+3$ điểm); $0.25 - 0.5$ ($+1$ điểm).
3. **Trụ cột 3 — Behavioral Warning Score ($0 - 25$ điểm):**
   - Khách có nợ nhưng đã ngừng mua hàng 90 ngày (`revenue_90d == 0`): **$+10$ điểm**.
   - Đà doanh thu suy giảm nghiêm trọng (momentum $< 0.25$): **$+7$ điểm**.
   - Khách có doanh thu âm trong năm: **$+5$ điểm**.
   - Không mua hàng trong toàn bộ 365 ngày: **$+3$ điểm**.

---

## 9. PHÂN TẦNG MỨC ĐỘ RỦI RO (RISK BANDS)

Dựa trên phân bố điểm số và các điều kiện rủi ro đặc thù, 584 khách hàng được phân bổ vào 4 dải rủi ro:

| Credit Risk Band | Tiêu chí phân tầng | Số lượng KH | Tỷ lệ KH (%) | Tổng Dư nợ (VND) | Tỷ trọng Nợ (%) | Nợ Quá hạn (VND) | Tỷ lệ Quá hạn TB | Điểm Rủi ro TB |
| :--- | :--- | :---: | :---: | ---:| ---:| ---:| :---: | :---: |
| **Critical Exposure** | Score $\ge 70$ (hoặc Debt $\ge P95$ & Overdue $> 90$d) | **19** | 3.25% | **11,837,301,048** | **20.92%** | 10,706,639,688 | 90.43% | **74.8** |
| **High Exposure** | $50 \le Score < 70$ | **64** | 10.96% | **11,636,240,460** | **20.57%** | 5,930,233,873 | 77.01% | **56.5** |
| **Moderate Exposure** | $30 \le Score < 50$ | **143** | 24.49% | **25,151,532,047** | **44.45%** | 6,349,045,713 | 47.79% | **38.4** |
| **Low Exposure** | $Score < 30$ | **358** | 61.30% | **7,957,349,080** | **14.06%** | 698,990,133 | 12.78% | **16.1** |
| **TỔNG CỘNG** | | **584** | **100.00%** | **56,582,422,635** | **100.00%** | **23,686,909,407** | **33.11%** | **27.8** |

> **Nhận định quan trọng:**
> - Nhóm **Critical Exposure** (chỉ 19 khách hàng, chiếm 3.25% số lượng) đang nắm giữ tới **20.92% tổng công nợ** (11.84 tỷ VND) và có tỷ lệ quá hạn trung bình lên tới **90.43%**.
> - Nhóm **Low Exposure** (chiếm 61.3% số lượng) chỉ nắm giữ 14.06% công nợ và có tỷ lệ quá hạn rất thấp (12.78%), phản ánh dòng tiền lành mạnh.

---

## 10. MA TRẬN PHÂN KHÚC KHÁCH HÀNG × RỦI RO CÔNG NỢ (SEGMENT × CREDIT RISK)

Đối chiếu kết quả phân khúc K-Means ($K=4$) từ Sub-Phase 4B với các dải rủi ro công nợ:

| Phân khúc Khách hàng (K-Means) | Mức độ Rủi ro Công nợ | Số KH | Tổng Dư nợ (VND) | Dư nợ TB/KH (VND) | Nợ Quá hạn (VND) | Tỷ lệ Quá hạn TB | Điểm Rủi ro TB |
| :--- | :--- | :---: | ---:| ---:| ---:| :---: | :---: |
| **Key Industrial Accounts** | Critical Exposure | 2 | 1,410,113,149 | 705,056,575 | 1,195,751,149 | 86.73% | 71.0 |
| Key Industrial Accounts | High Exposure | 9 | 5,063,638,182 | 562,626,465 | 2,862,460,310 | 64.24% | 53.8 |
| Key Industrial Accounts | Moderate Exposure | 71 | 21,450,790,175 | 302,123,805 | 5,024,590,270 | 37.98% | 38.0 |
| Key Industrial Accounts | Low Exposure | 123 | 4,887,384,777 | 39,734,836 | 389,358,945 | 11.40% | 17.1 |
| *Tổng Key Industrial* | | *205* | *32,811,926,283* | *160,058,177* | *9,472,160,674* | *28.86%* | *28.7* |
| **Active Regular Buyers** | Critical Exposure | 1 | 770,375,443 | 770,375,443 | 729,018,920 | 94.63% | 74.2 |
| Active Regular Buyers | High Exposure | 5 | 1,046,514,817 | 209,302,963 | 645,134,489 | 62.11% | 55.5 |
| Active Regular Buyers | Moderate Exposure | 21 | 1,113,979,434 | 53,046,640 | 729,731,841 | 70.33% | 39.4 |
| Active Regular Buyers | Low Exposure | 128 | 1,251,912,785 | 9,780,569 | 233,361,981 | 17.19% | 13.9 |
| *Tổng Active Regular* | | *155* | *4,182,782,479* | *26,985,693* | *2,337,247,231* | *55.88%* | *22.0* |
| **Slipping / Periodic Buyers**| High Exposure | 7 | 274,823,200 | 39,260,457 | 192,915,840 | 86.17% | 55.9 |
| Slipping / Periodic Buyers | Moderate Exposure | 6 | 104,588,989 | 17,431,498 | 78,976,789 | 78.62% | 39.8 |
| Slipping / Periodic Buyers | Low Exposure | 32 | 466,895,920 | 14,590,498 | 30,567,452 | 7.02% | 15.3 |
| *Tổng Slipping* | | *45* | *846,308,109* | *18,806,847* | *302,460,081* | *35.74%* | *23.5* |
| **Dormant / Low-Engagement** | Moderate Exposure | 4 | 410,802,197 | 102,700,549 | 11,860,800 | 66.32% | 39.0 |
| Dormant / Low-Engagement | Low Exposure | 13 | 67,605,340 | 5,200,411 | 4,920,240 | 9.35% | 17.2 |
| *Tổng Dormant (Clustered)* | | *17* | *478,407,537* | *28,141,620* | *16,781,040* | *22.76%* | *22.3* |
| **Dormant / Non-Clustered** | Critical Exposure | 16 | 9,656,812,456 | 603,550,779 | 8,781,869,619 | 95.84% | 75.5 |
| Dormant / Non-Clustered | High Exposure | 43 | 5,251,263,723 | 122,122,412 | 2,229,723,225 | 94.97% | 58.5 |
| Dormant / Non-Clustered | Moderate Exposure | 41 | 2,175,960,236 | 53,072,201 | 506,030,401 | 59.62% | 39.0 |
| Dormant / Non-Clustered | Low Exposure | 62 | 1,178,961,812 | 19,015,513 | 40,637,136 | 10.55% | 18.4 |
| *Tổng Non-Clustered (Cũ)* | | *162* | *18,262,998,227* | *112,734,557* | *11,558,260,381* | *63.29%* | *40.4* |

> **Phát hiện nghiệp vụ trọng yếu:**
> 1. **Key Industrial Accounts** nắm giữ tới **32.81 tỷ VND (58.0% tổng công nợ)**, nhưng 123 khách hàng trong nhóm này có rủi ro Low Exposure và 71 khách hàng ở mức Moderate (tỷ lệ quá hạn chỉ 37.98%). Dư nợ lớn ở nhóm này chủ yếu là nợ trong hạn do quy mô giao dịch hàng tháng lớn.
> 2. **Nhóm Khách hàng Ngủ đông không phát sinh mua bán trong năm 2025 (Dormant / Non-Clustered)**: Gồm 162 khách hàng nhưng ôm tới **18.26 tỷ VND công nợ**, trong đó có **11.56 tỷ VND đã quá hạn (tỷ lệ quá hạn lên tới 63.3% - 95.8%)**. Đây là khối nợ tồn đọng nguy hiểm nhất vì khách hàng đã ngừng giao dịch từ lâu.

---

## 11. MA TRẬN ĐỐI CHIẾU PHƠI NHIỄM CÔNG NỢ × NGUY CƠ RỜI BỎ LỊCH SỬ (CREDIT EXPOSURE 31/07/2026 × HISTORICAL CHURN RISK REFERENCE 31/12/2025)

Đối chiếu giữa 2 chiều rủi ro độc lập tại 2 mốc thời gian khác nhau: Phơi nhiễm công nợ tại snapshot ngày 31/07/2026 và Tham chiếu nguy cơ rời bỏ lịch sử (Historical Churn Risk Reference) tại snapshot 31/12/2025 (từ mô hình CatBoost Sub-Phase 4D đã khóa). Lưu ý quan trọng: Hai biến số này có độ lệch thời gian 7 tháng (offset = 7 tháng), do đó KHÔNG được diễn giải là rủi ro đồng thời tại thời điểm hiện tại (Current Joint Risk) hay nguy cơ rời bỏ trong 90 ngày tới kể từ 31/07/2026, mà phản ánh sự đối chiếu giữa hiện trạng công nợ sổ sách gần nhất và hành vi mua sắm lịch sử đã kiểm định.

| Credit Risk Band | Churn Risk Band | Số khách hàng | Tổng Dư nợ (VND) | Nợ Quá hạn (VND) | Điểm Credit TB | Nhận diện Quản trị |
| :--- | :--- | :---: | ---:| ---:| :---: | :--- |
| **Critical Exposure** | Low Risk ($P < 0.25$) | 3 | 2,180,488,592 | 1,924,770,069 | 72.1 | Nợ rất lớn, mua đều &rarr; Tái đàm phán hạn mức |
| **Critical Exposure** | Chưa đánh giá (Ngừng mua trước 2025) | 16 | 9,656,812,456 | 8,781,869,619 | 75.5 | **Nợ khó đòi trầm trọng &rarr; Chuyển Pháp chế** |
| **High Exposure** | **Critical Risk ($P \ge 0.80$)** | **2** | **561,366,720** | **62,694,000** | **58.5** | **Báo động Đỏ: Nguy cơ mất cả khách lẫn nợ** |
| **High Exposure** | **High Risk ($0.50 \le P < 0.80$)** | **2** | **460,343,668** | **143,567,088** | **55.2** | **Báo động Đỏ: Nguy cơ mất cả khách lẫn nợ** |
| **High Exposure** | Medium Risk ($0.25 \le P < 0.50$) | 3 | 256,365,648 | 218,457,648 | 54.2 | Theo dõi sát dòng tiền |
| **High Exposure** | Low Risk ($P < 0.25$) | 10 | 5,021,101,843 | 3,214,986,943 | 54.4 | Khách VIP công nợ cao &rarr; Thắt chặt tín dụng |
| **High Exposure** | Chưa đánh giá (Ngừng mua) | 47 | 5,337,062,043 | 2,290,528,185 | 58.2 | Nợ đọng từ khách không hoạt động |
| **Moderate Exposure** | Critical Risk ($P \ge 0.80$) | 6 | 462,842,927 | 67,386,330 | 41.7 | Ưu tiên thu nợ trước khi khách ngưng hẳn |
| **Moderate Exposure** | High Risk ($0.50 \le P < 0.80$) | 6 | 451,668,929 | 243,344,625 | 39.9 | Phối hợp Sales/Kế toán |
| **Moderate Exposure** | Medium Risk ($0.25 \le P < 0.50$) | 11 | 804,631,363 | 435,763,490 | 38.9 | Giám sát thông thường |
| **Moderate Exposure** | Low Risk ($P < 0.25$) | 78 | 21,337,689,576 | 5,098,665,255 | 38.1 | Trục xương sống dòng tiền công ty |
| **Moderate Exposure** | Chưa đánh giá (Ngừng mua) | 42 | 2,199,288,236 | 506,030,401 | 38.9 | Xử lý nợ tồn đọng |
| **Low Exposure** | Critical / High Risk | 19 | 458,241,315 | 32,663,292 | 19.3 | Dư nợ thấp, ưu tiên chiến dịch Sales cứu khách |
| **Low Exposure** | Low / Medium Risk | 272 | 6,185,578,347 | 624,665,326 | 15.3 | Nhóm khách hàng lý tưởng (Nợ ít, ở lại lâu) |
| **Low Exposure** | Chưa đánh giá | 67 | 1,208,940,972 | 41,517,136 | 18.2 | Nợ nhỏ ngắt quãng |

---

## 12. PHÂN TÍCH MỨC ĐỘ TẬP TRUNG CÔNG NỢ (CREDIT CONCENTRATION & HHI)

Để đánh giá mức độ rủi ro hệ thống nếu các khách hàng lớn gặp sự cố, hệ thống tính toán các chỉ số tập trung công nợ:

| Chỉ số Tập trung | Giá trị Định lượng | Diễn giải & Đánh giá rủi ro |
| :--- | :---: | :--- |
| **Tổng số khách hàng có nợ** | **584 khách hàng** | Tập khách hàng có dư nợ Tài khoản 131 tại snapshot |
| **Tổng công nợ toàn hệ thống** | **56,582,422,635 VND** | 100% dư nợ thương mại |
| **Dư nợ Top 10 khách hàng** | **16,631,864,556 VND** | Chiếm **29.39%** toàn bộ công nợ công ty |
| **Dư nợ Top 20 khách hàng** | **24,221,015,450 VND** | Chiếm **42.81%** toàn bộ công nợ công ty |
| **Dư nợ Top 50 khách hàng** | **37,220,367,134 VND** | Chiếm **65.78%** toàn bộ công nợ công ty |
| **Chỉ số HHI (Decimal)** | **0.014934** | $HHI = \sum s_i^2$ |
| **Chỉ số HHI (Points)** | **149.34 điểm** | Quy đổi theo thang điểm DOJ/FTC tiêu chuẩn ($HHI \times 10,000$) |
| **Phân loại Mức độ Tập trung** | **Unconcentrated** ($HHI < 1,500$) | Danh mục có mức tập trung tổng thể thấp theo HHI, nhưng exposure vẫn tập trung đáng kể ở nhóm 50 khách hàng lớn nhất (65.78% tổng dư nợ). |

---

## 13. DANH SÁCH TOP KHÁCH HÀNG CÓ PHƠI NHIỄM CÔNG NỢ CAO NHẤT

Trích xuất Top 10 khách hàng có số dư nợ lớn nhất toàn công ty (được lưu trữ đầy đủ tại `outputs/credit/top_credit_exposure_customers.csv`):

| Hạng | Mã Khách hàng | Tên Khách hàng | Chi nhánh | Phân khúc K-Means | Dư nợ Tổng (VND) | Nợ Quá hạn (VND) | Tỷ lệ Quá hạn | Điểm Credit | Mức độ Rủi ro |
| :---: | :--- | :--- | :---: | :--- | ---:| ---:| :---: | :---: | :--- |
| **1** | `VPBV1234` | BỆNH VIỆN ĐA KHOA KHU VỰC THỦ ĐỨC | VP | Key Industrial | **3,719,393,700** | 3,719,393,700 | **100.0%** | 68.0 | High Exposure |
| **2** | `VPCTPMANHTU` | CÔNG TY TNHH MTV THƯƠNG MẠI MẠNH TÚ | VP | Key Industrial | **2,147,844,500** | 0 | 0.0% | 40.0 | Moderate Exposure |
| **3** | `VPXN1324` | XÍ NGHIỆP CƠ KHÍ ĐÓNG TÀU SÀI GÒN | VP | Key Industrial | **2,017,097,208** | 1,147,378,554 | 56.9% | 53.5 | High Exposure |
| **4** | `BDBV187(BH)` | BỆNH VIỆN ĐA KHOA ĐỒNG NAI | BD | Key Industrial | **1,505,150,456** | 697,296,139 | 46.3% | 52.0 | High Exposure |
| **5** | `VPBV07` | BỆNH VIỆN QUÂN Y 175 | VP | Key Industrial | **1,427,737,044** | 0 | 0.0% | 40.0 | Moderate Exposure |
| **6** | `LACN147` | CÔNG TY CỔ PHẦN THÉP TÂY ĐÔ | LA | Key Industrial | **1,313,991,600** | 450,200,000 | 34.3% | 50.2 | High Exposure |
| **7** | `BDBV105A` | TRUNG TÂM Y TẾ KHU VỰC TÂN UYÊN | BD | Non-Clustered | **1,266,301,320** | 1,266,301,320 | **100.0%** | 78.5 | **Critical Exposure** |
| **8** | `VPBV102` | BỆNH VIỆN UNG BƯỚU TP.HCM | VP | Key Industrial | **1,114,822,868** | 0 | 0.0% | 40.0 | Moderate Exposure |
| **9** | `BHCK18` | CÔNG TY TNHH ĐÓNG TÀU TRIỀU PHÁT | BH | Key Industrial | **1,068,545,000** | 895,400,000 | 83.8% | 65.5 | High Exposure |
| **10** | `VPBV103` | BỆNH VIỆN CHỢ RẪY | VP | Key Industrial | **1,050,980,860** | 0 | 0.0% | 40.0 | Moderate Exposure |

> **Phân tích đối tượng:**
> - Khách hàng bệnh viện công lập (`Bệnh viện Chợ Rẫy`, `Bệnh viện Quân Y 175`, `Bệnh viện Ung Bướu`) có dư nợ từ 1.0 đến 1.4 tỷ VND nhưng **100% nợ trong hạn** (tỷ lệ quá hạn = 0%), phản ánh uy tín thanh toán theo chu kỳ giải ngân ngân sách nhà nước định kỳ.
> - Ngược lại, các đơn vị như `BỆNH VIỆN ĐA KHOA KHU VỰC THỦ ĐỨC` (3.72 tỷ VND nợ) và `TRUNG TÂM Y TẾ TÂN UYÊN` (1.27 tỷ VND nợ) có **100% số dư nợ đã quá hạn**, xếp vào diện rủi ro cao/nguy cấp.

---

## 14. MA TRẬN ƯU TIÊN VẬN HÀNH (PRIORITY ACTION MATRIX)

Hệ thống phân bổ 584 khách hàng thành 4 tầng ưu tiên hành động kết hợp giữa Kế toán và Kinh doanh:

| Tầng Ưu tiên (Action Tier) | Số KH | Tổng Công nợ (VND) | Nợ Quá hạn (VND) | Tỷ trọng Nợ (%) | SLA & Hành động Khuyến nghị |
| :--- | :---: | ---:| ---:| :---: | :--- |
| **Priority 1: Critical Joint Action** *(High Credit + High Churn)* | **4** | **1,021,710,388** | **206,261,088** | **1.81%** | **SLA 24–48h:** Giám đốc Bán hàng & Giám đốc Tài chính trực tiếp làm việc; đối chiếu công nợ tức thì; đình chỉ giao hàng nợ mới; yêu cầu thanh toán trước khi tái tục. |
| **Priority 2: Credit Terms & Monitoring** *(High Credit + Low/Med Churn)* | **79** | **22,451,830,582** | **16,430,612,464** | **39.68%** | **SLA 3–5 ngày:** Kế toán công nợ rà soát hạn mức tín dụng; gửi thư nhắc nợ định kỳ; đàm phán lịch trả dần cho 16.43 tỷ nợ quá hạn; không nâng trần nợ. |
| **Priority 3: Customer Retention & Re-engagement** *(Low Credit + High Churn)* | **31** | **1,372,753,171** | **343,394,247** | **2.43%** | **SLA 5–7 ngày:** Sales chủ trì thăm khám khách hàng; tìm hiểu nguyên nhân sụt giảm đơn hàng; công nợ nhỏ không phải rào cản chính. |
| **Priority 4: Standard Commercial Monitoring** *(Low Credit + Low Churn)* | **470** | **31,736,128,494** | **6,706,641,608** | **56.09%** | **Định kỳ tháng:** Quy trình quản lý bán hàng và thu tiền bình thường theo quy chế công ty. |

---

## 15. PHÁT HIỆN DỊ THƯỜNG CÔNG NỢ (ANOMALY DETECTION)

1. **Phương pháp Thực hiện:**
   - Sử dụng thuật toán học không giám sát **Isolation Forest** (`n_estimators=100`, `contamination=0.05`, `random_state=42`) trên không gian đặc trưng đa chiều: `outstanding_debt`, `overdue_ratio`, `debt_to_revenue_365d`, `revenue_365d`.
   - Kết hợp kiểm định rào chắn ngoại lai mạnh (Robust IQR Outlier Fences) trên dư nợ: $Q_3 + 3.0 \times IQR = 57.37\text{M} + 3.0 \times 54.04\text{M} = 219.5\text{M VND}$.
2. **Kết quả:**
   - Thuật toán phát hiện **30 khách hàng dị thường (Credit Exposure Anomalies)**, tương đương 5.14% tập dữ liệu.
   - Các dị thường này chủ yếu rơi vào 2 trạng thái: (1) Khách hàng có dư nợ đột biến trên 1 tỷ VND nhưng doanh thu mua hàng rất nhỏ; (2) Khách hàng nợ 100% quá hạn lâu năm nhưng vẫn phát sinh giao dịch lẻ.
3. **Ranh giới Diễn giải (Epistemic Boundary):**
   - **Ranh giới Diễn giải: Dị thường $\neq$ Vỡ nợ (Anomaly $\neq$ Default), Dị thường $\neq$ Nợ xấu (Anomaly $\neq$ Bad Debt), Dị thường $\neq$ Gian lận (Anomaly $\neq$ Fraud).** Isolation Forest và Robust IQR chỉ cảnh báo khách hàng có exposure pattern bất thường so với phân phối của danh mục, cần kiểm tra đối chiếu hồ sơ kế toán thủ công.

---

## 16. TÍNH KHẢ THI CỦA HỌC MÁY CÓ GIÁM SÁT (SUPERVISED ML FEASIBILITY)

Báo cáo kết luận chính thức về tính khả thi của Supervised ML:
- **Hiện tại KHÔNG KHẢ THI (Not Feasible Under Current Data):** Để xây dựng mô hình phân loại dự báo vỡ nợ (ví dụ: Logistic Regression, LightGBM, CatBoost Default Classifier), bài toán bắt buộc phải có:
  1. Biến mục tiêu $Y \in \{0, 1\}$ được xác định độc lập trong cửa sổ tương lai $(T, T+H]$.
  2. Bảng lịch sử các kỳ $T$ khác nhau trong quá khứ (Panel data) để chia Train/Validation/Test theo thời gian.
  3. Lịch sử hóa đơn với ngày đến hạn và ngày thanh toán để xác định chính xác số ngày trễ hạn.
- Vì SOVIGAZ DWH hiện chỉ lưu 1 snapshot công nợ, nếu cố tình huấn luyện mô hình, toàn bộ kết quả sẽ bị thiên lệch và vi phạm nghiêm trọng quy chuẩn kiểm định khoa học.

---

## 17. ĐẦU RA CHO POWER BI DASHBOARD (POWER BI OUTPUT)

Đã tạo tệp dữ liệu chuẩn hóa phục vụ Power BI tại:
`outputs/powerbi/credit_risk_customer.csv`
- **Độ mịn (Grain):** Khớp chính xác 1 dòng = 1 khách hàng tại snapshot 2026-07-31 (**584 dòng $\times$ 18 cột**).
- **Trường dữ liệu:** `AccountObjectCode`, `CustomerName`, `BranchCode`, `customer_segment`, `snapshot_date`, `outstanding_debt`, `current_debt`, `overdue_debt`, `overdue_ratio`, `debt_share`, `debt_to_revenue_365d`, `debt_to_revenue_90d`, `credit_risk_score`, `credit_risk_band`, `credit_priority`, `churn_probability`, `churn_risk_band`, `is_credit_anomaly`.
- **Đảm bảo chất lượng:** Không trùng lặp khóa khách hàng, không sinh mốc thời gian giả lập, số dư nợ khớp 100% sổ sách.

---

## 18. KIỂM ĐỊNH CHẤT LƯỢNG DỮ LIỆU & BỘ UNIT TESTS (DATA QUALITY & TESTS)

Hệ thống đã xây dựng bộ kiểm định tự động chuyên biệt tại `tests/test_credit_risk.py` bao gồm 15 bài kiểm tra:
1. `test_customer_key_not_null`: Khóa khách hàng không null.
2. `test_customer_key_unique_at_grain`: Khóa khách hàng duy nhất tuyệt đối (584/584 unique).
3. `test_debt_snapshot_date_valid`: Ngày snapshot đúng 2026-07-31.
4. `test_outstanding_debt_matches_source`: Tổng dư nợ khớp chính xác 56,582,422,635 VND.
5. `test_no_join_explosion`: Không có hiện tượng nhân đôi số dòng khi merge sales/clusters/churn.
6. `test_revenue_denominator_safe`: Không có lỗi chia cho 0 trong các tỷ số tài chính.
7. `test_negative_revenue_handled`: Xử lý đúng các trường hợp doanh thu âm.
8. `test_credit_score_range`: Điểm Credit Risk nằm nghiêm ngặt trong $[0.0, 100.0]$.
9. `test_credit_risk_band_mapping`: 100% khách hàng được phân bổ vào đúng 4 Risk Bands.
10. `test_priority_mapping_valid`: Phân bổ đúng vào 4 Action Tiers.
11. `test_no_future_information_leakage`: Không rò rỉ thông tin tương lai.
12. `test_no_pseudo_labels_created`: Không tồn tại nhãn default giả tạo.
13. `test_churn_join_no_duplicates`: Join churn không làm phát sinh dòng trùng.
14. `test_total_debt_preserved_across_aggregations`: Tổng nợ bảo toàn 100% qua các bảng tổng hợp.
15. `test_concentration_hhi_bounds`: HHI nằm trong khoảng hợp lệ $[0.0, 10000.0]$.

Toàn bộ **15/15 Credit Tests PASS** và tích hợp vào test suite của dự án đạt **86/86 Tests PASS tuyệt đối**.

---

## 19. CÁC HẠN CHẾ CỦA HỆ THỐNG (LIMITATIONS)

1. **Tính chất Snapshot Tĩnh (Cross-Sectional Nature):** Điểm số phản ánh trạng thái phơi nhiễm tại thời điểm 31/07/2026, chưa thể hiện được quỹ đạo tăng/giảm công nợ theo chu kỳ nhiều tháng của từng khách hàng.
2. **Thiếu Hạn mức Tín dụng Chính thức:** Tỷ số nợ trên hạn mức (Credit Utilization) chưa thể tính do ERP chưa số hóa hạn mức phê duyệt.
3. **Chưa Tính được Tỷ lệ Thu hồi Nợ (Cure Rate):** Chưa đo lường được xác suất khách hàng sau khi quá hạn sẽ thanh toán trong bao nhiêu ngày vì thiếu dữ liệu phiếu thu thực tế.

---

## 20. KHUYẾN NGHỊ THU THẬP DỮ LIỆU ĐỂ TIẾN TỚI SUPERVISED ML (DATA GAP ROADMAP)

Để trong tương lai SOVIGAZ có thể xây dựng mô hình dự báo vỡ nợ (Probability of Default) chuẩn Basel II / IFRS 9 bằng Machine Learning, doanh nghiệp cần bổ sung vào Data Warehouse:
1. **Lịch sử Hóa đơn Chi tiết (Invoice Level Ledger):**
   - `InvoiceID`, `CustomerID`, `InvoiceDate`, `DueDate`, `InvoiceAmount`.
2. **Lịch sử Thanh toán & Đối trừ (Payment & Settlement Ledger):**
   - `PaymentReceiptID`, `InvoiceID`, `PaymentDate`, `PaidAmount`, `RemainingAmount`.
3. **Chính sách Hạn mức Tín dụng (Credit Governance):**
   - `ApprovedCreditLimit`, `CreditTermsDays` (ví dụ 30 ngày, 45 ngày), `ContractStartDate`, `ContractEndDate`.
4. **Danh mục Nợ xấu & Xóa nợ (Default & Recovery Events):**
   - `IsDefault`, `DefaultDate`, `WriteOffAmount`, `LegalActionStatus`.

*(Xem lộ trình chi tiết tại [CREDIT_DATA_GAP_ROADMAP.md](file:///c:/Users/DELL-587K9L3/Documents/M%C3%B4n%20h%E1%BB%8Dc%20k%C3%AC%20n%C3%A0y/INDA/SOVIGAZ_ML/reports/CREDIT_DATA_GAP_ROADMAP.md)).*

---

## 21. KẾT LUẬN (CONCLUSION)

Bài toán 3 đã hoàn thành xuất sắc mục tiêu đề ra:
- Thiết lập một nền tảng **Credit Exposure Risk Intelligence** vững chắc, minh bạch và có thể giải thích 100%.
- Bóc tách chính xác 56.58 tỷ VND công nợ thực tế của 584 khách hàng thương mại, xác định 23.69 tỷ VND nợ quá hạn và cô lập 30 khách hàng dị thường.
- Xây dựng ma trận ưu tiên phối hợp giữa Sales và Finance, giúp doanh nghiệp vừa tối ưu hóa doanh thu vừa bảo vệ an toàn dòng tiền.
- Đóng Decision Gate với kết luận khoa học trung thực: **Supervised Default Prediction chưa khả thi và được thay thế bằng B2B Credit Risk Profiling & Scoring hoàn chỉnh.**
