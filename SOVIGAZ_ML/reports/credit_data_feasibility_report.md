# BÁO CÁO ĐÁNH GIÁ TÍNH KHẢ THI DỮ LIỆU CÔNG NỢ (CREDIT RISK FEASIBILITY REPORT)
*(Tiêu chuẩn Phase 2 – Kiểm toán định danh nhãn thời gian & Chống Data Leakage)*

**Ngày thực hiện**: 2026-10-03  
**Người thực hiện**: Senior Machine Learning Engineer & Data Scientist  

---

## 1. KẾT QUẢ KIỂM TOÁN TÍNH ĐỊNH DANH (IDENTIFIABILITY AUDIT)
- **Số lượng Snapshot tuổi nợ ghi nhận (`snapshot_count`)**: **1** (Duy nhất ngày 31/07/2026).
- **Thời điểm Snapshot sớm nhất**: `2026-07-31`.
- **Thời điểm Snapshot muộn nhất**: `2026-07-31`.
- **Số lượng khách hàng có nợ thương mại (TK 131)**: **584 khách hàng**.
- **Khả năng truy xuất ngày thanh toán thực tế của từng hóa đơn (`PaymentDate`)**: **KHÔNG CÓ**.
- **Khả năng truy xuất hạn nợ của từng hóa đơn (`DueDate`)**: **KHÔNG CÓ**.

## 2. KẾT LUẬN PHƯƠNG PHÁP LUẬN BẮT BUỘC
> [!CAUTION]
> **KẾT LUẬN: SUPERVISED TEMPORAL CREDIT RISK IS NOT IDENTIFIABLE FROM CURRENT DATA ALONE.**

### Lý do khoa học:
1. **Chỉ có 1 lát cắt thời gian duy nhất**: Dữ liệu tuổi nợ chỉ được chốt sổ một lần vào ngày 31/07/2026. Để xây dựng mô hình Supervised Learning (Học có giám sát) dự đoán tương lai mà không bị rò rỉ dữ liệu, bắt buộc phải có ít nhất 2 thời điểm chốt nợ độc lập: thời điểm $T_1$ (để tạo feature lịch sử) và thời điểm $T_2$ (để đo lường nợ quá hạn phát sinh trong tương lai).
2. **Nguy cơ Data Leakage nếu gán nhãn hồi cứu**: Nếu lấy nhãn quá hạn tại 31/07/2026 gán ngược lại cho các đơn hàng bán chịu phát sinh từ 2023-2025, mô hình sẽ vi phạm nguyên tắc nhân quả cơ bản: một khoản nợ quá hạn vào tháng 07/2026 không có nghĩa là khách hàng đó đã quá hạn từ năm 2023.
3. **Nguyên tắc đạo đức nghiên cứu & Kỹ thuật**: Tuyệt đối không tự suy đoán DueDate/PaymentDate hoặc tự bịa dữ liệu target để 'ép' chạy mô hình supervised.

## 3. PHẠM VI TRIỂN KHAI HỢP LỆ CHO CREDIT RISK
Thay vì xây dựng mô hình dự đoán supervised sai phương pháp luận, dự án sẽ triển khai:
1. **Bảng dữ liệu Snapshot hoàn chỉnh**: Xuất file `customer_credit_snapshot_20260731.parquet` lưu trữ đầy đủ cơ cấu nợ, tuổi nợ theo từng phân đoạn.
2. **Descriptive Risk Profiling**: Phân tích chân dung khách hàng có nợ quá hạn, tỷ lệ nợ quá hạn trên tổng nợ, phân khúc tuổi nợ theo chi nhánh và nhóm sản phẩm.
3. **Risk Score Exploratory Framework**: Xây dựng ma trận chấm điểm rủi ro kinh doanh (Credit Scorecard / Heuristic Rating) dựa trên thâm niên giao dịch, tỷ lệ mua chịu, và lịch sử công nợ chốt kỳ.
