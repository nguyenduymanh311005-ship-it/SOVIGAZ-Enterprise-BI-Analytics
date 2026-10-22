# AUDIT DATA LEAKAGE TOÀN DIỆN CHO 3 BÀI TOÁN MACHINE LEARNING SOVIGAZ
*(Tài liệu kiểm soát rủi ro rò rỉ dữ liệu - Senior ML Engineer)*

## 1. NGUYÊN TẮC BẤT DI BẤT DỊCH
Mọi đặc trưng (features) tại thời điểm dự đoán $T$ CHỈ ĐƯỢC PHÉP tính toán từ các sự kiện xảy ra TRƯỚC HOẶC TẠI $T$. Mọi thông tin phát sinh sau $T$ đều bị cấm tuyệt đối.

## 2. BÀI TOÁN 1: DEMAND & REVENUE FORECASTING
| Đặc trưng / Bước | Được phép? | Thời điểm tính toán | Lý do & Kiểm soát |
|---|:---:|---|---|
| Lags doanh thu/sản lượng (lag 1, 7, 14, 30...) | CÓ | $\le T$ | Chỉ dùng giá trị lịch sử quá khứ |
| Rolling mean / std (7, 14, 30 ngày) | CÓ | $\le T$ (Closed on left) | Đảm bảo rolling window không bao gồm ngày $T+k$ |
| Lịch dương, ngày trong tuần, tháng, quý | CÓ | Mọi thời điểm | Thông tin lịch biểu là biến ngoại sinh biết trước |
| Doanh thu/sản lượng sau ngày $T$ | KHÔNG | $> T$ | Tuyệt đối không dùng cho feature |
| Random Train/Test Split | KHÔNG | - | BẮT BUỘC dùng Chronological Split (Train: 2023-2025, Val: Q1/2026, Test: Q2/2026) |

## 3. BÀI TOÁN 2: B2B CHURN PREDICTION
| Đặc trưng / Bước | Được phép? | Thời điểm tính toán | Lý do & Kiểm soát |
|---|:---:|---|---|
| Recency, Frequency, Monetary (RFM) | CÓ | $\le T$ | Chỉ tổng hợp giao dịch trong cửa sổ quan sát $\le T$ |
| Tần suất mua, khoảng cách đơn hàng lịch sử | CÓ | $\le T$ | Phản ánh thói quen mua hàng quá khứ |
| Doanh số / đơn hàng trong Prediction Window $[T, T+90]$ | KHÔNG | $[T, T+90]$ | Chỉ dùng để TẠO NHÃN TARGET (1=churn, 0=active), CẤM làm feature |
| SMOTE trước khi chia tập dữ liệu | KHÔNG | - | CẤM TUYỆT ĐỐI. SMOTE chỉ được áp dụng trên tập Train sau khi đã split |
| Toàn bộ lịch sử sau $T$ để tạo feature | KHÔNG | $> T$ | Gây Data Leakage nghiêm trọng |

## 4. BÀI TOÁN 3: CREDIT RISK / OVERDUE DEBT PREDICTION
| Đặc trưng / Bước | Được phép? | Thời điểm tính toán | Lý do & Kiểm soát |
|---|:---:|---|---|
| Doanh thu mua hàng lũy kế của khách | CÓ | $\le T$ | Đo lường quy mô và độ gắn bó của khách |
| Tỷ lệ mua chịu ("chưa thu tiền") lịch sử | CÓ | $\le T$ | Thể hiện mức độ phụ thuộc vào tín dụng bán chịu |
| Biến động sản lượng mua (Volatility, Trend) | CÓ | $\le T$ | Phát hiện khách hàng đang có dấu hiệu sa sút tài chính |
| Số ngày quá hạn thực tế từ báo cáo nợ | KHÔNG | Sau $T$ | CẤM DÙNG LÀM FEATURE. Đây là thông tin sau sự kiện |
| Số tiền thu hồi nợ thực tế sau $T$ | KHÔNG | Sau $T$ | Rò rỉ thông tin tương lai |
| Gán nhãn nợ cho từng hóa đơn đơn lẻ | KHÔNG | - | Bị cấm vì bảng hóa đơn không có ngày thanh toán thực tế |