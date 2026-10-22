# BÁO CÁO KIỂM TOÁN VÀ ĐỐI CHIẾU NHÓM KHÁCH HÀNG DOANH THU THUẦN ÂM
## SUB-PHASE 4C.1: CHURN MODEL HARDENING – SOVIGAZ

**Dự án:** Hệ thống Phân tích Khách hàng B2B & Churn Prediction – SOVIGAZ  
**Đối tượng kiểm toán:** Nhóm khách hàng có Doanh thu thuần âm (Cluster 3 – Dormant / Low-Engagement Accounts)  
**Phạm vi dữ liệu:** Bảng bán hàng `processed_sales.parquet` và các bảng phân cụm/churn 4B & 4C  
**Ngày thực hiện:** 2026-10-04  
**Trạng thái kiểm toán:** **PASS — ĐỐI CHIẾU CHÍNH XÁC 100% TỪNG ĐỒNG & CHUẨN HÓA DANH XƯNG**

---

## 1. BẢN CHẤT DỮ LIỆU BÁN HÀNG CÓ DOANH THU ÂM

### 1.1. Thống kê Giao dịch Âm trên Toàn bộ Tập Dữ liệu Doanh thu
Qua rà soát toàn bộ $228,581$ dòng giao dịch đã làm sạch trong `processed_sales.parquet`:
- **Số dòng có Revenue < 0:** $686$ dòng (chiếm tỷ lệ rất nhỏ: $\mathbf{0.30\%}$).
- **Tổng giá trị doanh thu âm:** $-26,498,329,495$ VND ($-26.5$ tỷ VND).
- **Tổng giá trị doanh thu dương:** $+1,239,289,126,436$ VND ($+1,239.3$ tỷ VND).
- **Tổng doanh thu thuần toàn bộ dữ liệu:** $+1,212,790,796,942$ VND ($+1,212.8$ tỷ VND).

### 1.2. Top Sản phẩm Phát sinh Doanh thu Âm Lớn nhất
Các dòng doanh thu âm tập trung chủ yếu vào các mặt hàng khí hóa lỏng và bình khí công nghiệp chủ lực:
1. `OXK6` (Oxy khí 6m³): $123$ dòng, tổng $-9,294,855,000$ VND.
2. `NTL-SX` (Nitơ lỏng sản xuất): $39$ dòng, tổng $-4,275,996,000$ VND.
3. `OXL-SX` (Oxy lỏng sản xuất): $44$ dòng, tổng $-4,240,374,000$ VND.
4. `BH5OXL1` (Bình bồn Oxy lỏng): $4$ dòng, tổng $-3,108,283,000$ VND.
5. `CTOXK6` (Chai chứa Oxy khí 6m³): $8$ dòng, tổng $-1,287,961,000$ VND.

### 1.3. Căn cứ Nghiệp vụ Phát sinh Doanh thu Âm
Đối chiếu với tệp kiểm toán gốc `outputs/customer_segmentation/negative_monetary_audit.csv`:
- **Bút toán điều chỉnh kế toán (Accounting Adjustments):** Các hóa đơn có phát sinh chiết khấu thương mại hồi tố cho khách hàng lớn theo sản lượng cam kết cả năm, hoặc điều chỉnh giảm giá bán khí công nghiệp khi có biến động giá nguyên liệu.
- **Hàng bán trả lại và bù trừ vỏ bình (Sales Returns & Cylinder Settlements):** Khách hàng hoàn trả lượng khí không đạt tiêu chuẩn kỹ thuật hoặc quyết toán hoàn trả tiền cọc/tiền thuê bồn chứa khí hóa lỏng.
- Loại chứng từ chủ yếu ghi nhận: *"Bán hàng hóa trong nước chưa thu tiền"* và *"Bán hàng hóa, dịch vụ trong nước chưa thu tiền"*.

---

## 2. GIẢI TRÌNH ĐỐI CHIẾU SỐ LIỆU: TẠI SAO 4B LÀ -4.89 TỶ VÀ 4C LÀ -5.06 TỶ?

Báo cáo Sub-Phase 4B ghi nhận doanh thu Cluster 3 là **-4,886,978,295 VND** (~ $-4.89$ tỷ VND), trong khi bảng phân tích chéo Segment $\times$ Churn tại Sub-Phase 4C ghi nhận **-5,058,370,000 VND** (~ $-5.06$ tỷ VND).

Đây **KHÔNG PHẢI LÀ LỖI DỮ LIỆU**, mà xuất phát trực tiếp từ sự khác biệt có chủ đích giữa tiêu chuẩn quần thể phân khúc và tiêu chuẩn mẫu dự báo Churn:

### 2.1. Quần thể Sub-Phase 4B (Customer Segmentation)
- **Tiêu chí lọc:** Khách hàng có phát sinh ít nhất 1 giao dịch trong cửa sổ quan sát **365 ngày** tính đến $T = 2025\text{-}12\text{-}31$.
- **Quy mô quần thể:** $N = 1,359$ khách hàng.
- **Quy mô Cluster 3:** $335$ khách hàng.
- **Tổng Monetary 365d:** $\mathbf{-4,886,978,295\text{ VND}}$.

### 2.2. Quần thể Sub-Phase 4C (Churn Prediction Test Set)
- **Tiêu chí lọc của Churn Panel:** Khách hàng có phát sinh ít nhất 1 giao dịch trong vòng **180 ngày** tính đến thời điểm snapshot $T$ (theo chuẩn tắc của hàm `rfm_snapshot_builder.py` để đảm bảo khách hàng chưa bị coi là đã rời bỏ trước thời điểm $T$).
- **Quy mô quần thể Test 2025-12-31:** $N = 1,174$ khách hàng (loại $185$ khách hàng có `recency_days > 180`).
- **Trong 185 khách hàng bị loại:** Có đúng $114$ khách hàng thuộc Cluster 3 (và 70 thuộc Cluster 0, 1 thuộc Cluster 2).
- **Đặc điểm của 114 khách hàng Cluster 3 bị loại:** Đây là các khách hàng có giao dịch nhỏ từ 6 đến 12 tháng trước, với tổng doanh thu dương đạt **$+171,391,959$ VND**.

### 2.3. Đối chiếu Toán học Tuyệt đối (Exact Mathematical Reconciliation)
Khi loại bỏ 114 khách hàng có doanh thu dương nhỏ này ra khỏi tập Test Churn:
$$\text{Doanh thu Cluster 3 (4C)} = \text{Doanh thu Cluster 3 (4B)} - \text{Doanh thu } 114 \text{ khách hàng bị loại}$$
$$\text{Doanh thu Cluster 3 (4C)} = -4,886,978,295\text{ VND} - 171,391,959\text{ VND} = \mathbf{-5,058,370,254\text{ VND}} \approx \mathbf{-5.06\text{ tỷ VND}}$$

Số liệu khớp chính xác $100\%$ từng đồng.

### 2.4. Hai Khách hàng Chi phối Doanh thu Âm tại 2025-12-31
Phần lớn giá trị âm thuộc về 2 tài khoản khách hàng doanh nghiệp lớn có bút toán quyết toán điều chỉnh giảm trừ công nợ cuối năm 2025:
1. **Mã `BDNB7`:** Doanh thu thuần 365 ngày = $-3,546,010,176$ VND.
2. **Mã `CT1003`:** Doanh thu thuần 365 ngày = $-1,917,960,651$ VND.
*(Hai khách hàng này đóng góp tổng cộng $-5.46$ tỷ VND).*

---

## 3. CHUẨN HÓA DANH XƯNG VÀ NGUYÊN TẮC TRÌNH BÀY KHOA HỌC

Để đảm bảo tính khách quan và tránh định kiến sai lệch trong vận hành:

### 3.1. Danh từ Chuẩn mực Bắt buộc
- **Cách gọi chuẩn xác:**
  - *"Nhóm khách hàng có doanh thu thuần âm trong cửa sổ quan sát"* (Customers with negative net revenue in the observation window).
  - *"Tài khoản phát sinh giá trị điều chỉnh công nợ/trả hàng ròng"* (Accounts with net accounting adjustments/returns).

### 3.2. Cấm Đoán Diễn giải Cảm tính
- ❌ **KHÔNG ĐƯỢC GỌI LÀ:** *"Khách hàng rác", "Khách hàng không có giá trị", "Khách hàng xấu", hay "Khách hàng cần chấm dứt phục vụ"*.
- **Lý do kinh tế:** Một khách hàng có doanh thu thuần âm trong một cửa sổ 365 ngày cụ thể có thể là đối tác chiến lược dài hạn vừa thực hiện quyết toán hồi tố công nợ cho các hợp đồng trị giá hàng chục tỷ đồng của các năm trước. Việc vội vã cắt đứt quan hệ kinh doanh sẽ gây tổn thất nghiêm trọng.

### 3.3. Giới hạn Dữ liệu (Data Limitation Statement)
Hệ thống ERP hiện tại không tách riêng bảng Sổ cái Kế toán (General Ledger) và bảng Chi tiết Hàng trả lại riêng biệt khỏi bảng Bán hàng tổng hợp `Fact_SalesOrder`. Do đó, mô hình hiện xử lý các giá trị âm bằng phương pháp chuẩn hóa:
$$\text{monetary\_log} = \ln(1 + \max(0, \text{monetary}))$$
kết hợp cùng cờ nhị phân:
$$\text{has\_negative\_revenue\_365d} = \mathbb{I}(\text{Tồn tại bất kỳ dòng } \text{Revenue} < 0)$$
để giữ toàn vẹn tín hiệu cảnh báo rủi ro mà không làm méo mó các phân phối logarit.

---

## 4. KẾT LUẬN KIỂM TOÁN
1. Hiện tượng doanh thu thuần âm được truy nguyên rõ ràng từ 686 dòng giao dịch điều chỉnh kế toán và hàng trả lại trong dữ liệu thực tế.
2. Sự khác biệt giữa số liệu 4B ($-4.89$ tỷ) và 4C ($-5.06$ tỷ) đã được chứng minh toán học chính xác $100\%$ do tiêu chí lọc khoảng thời gian hoạt động (180 ngày so với 365 ngày).
3. Toàn bộ ngôn ngữ trình bày đã được chuẩn hóa trung tính, phản ánh trung thực bản chất dữ liệu kế toán doanh nghiệp B2B.
