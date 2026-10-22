# SOVIGAZ Machine Learning System

Hệ thống phân tích dự đoán và máy học doanh nghiệp B2B dành cho Công ty Cổ phần Hơi Kỹ nghệ Que Hàn (**SOVIGAZ**).

## 1. Kiến trúc 3 Bài toán Machine Learning
1. **Demand & Revenue Forecasting**: Dự báo sản lượng khí (Oxy lỏng, Nitơ lỏng, CO2) và doanh thu theo tuần/tháng bằng mô hình chuỗi thời gian (SARIMAX, LightGBM, XGBoost, Naive Baselines).
2. **Customer Segmentation & B2B Churn Prediction**: Phân khúc khách hàng B2B bằng RFM + K-Means Clustering và dự đoán nguy cơ rời bỏ (Churn) trong 90 ngày với phân tích giải thích SHAP.
3. **Credit Risk / Overdue Debt Prediction**: Đánh giá điểm tín dụng và dự đoán rủi ro nợ quá hạn (> 30 ngày) cho khách hàng mua chịu (tài khoản công nợ 131) với mô hình đã hiệu chuẩn xác suất (Calibrated Probability).

## 2. Cấu trúc Dự án
```
SOVIGAZ_ML/
├── data/
│   ├── raw/                  # Dữ liệu nguồn liên kết từ Data ETL
│   └── processed/            # Dữ liệu đã làm sạch & ma trận đặc trưng
├── src/
│   ├── data/                 # Data loading, cleaning, validation
│   ├── features/             # Feature engineering & temporal transformers
│   ├── models/               # Huấn luyện mô hình ML & baseline
│   ├── evaluation/           # Metrics, backtesting, probability calibration
│   ├── visualization/        # Biểu đồ chuẩn mực khoa học
│   └── utils/                # Logger, helpers
├── notebooks/                # 5 Jupyter Notebooks tương ứng từng giai đoạn
├── outputs/                  # Kết quả dự báo, metrics, bảng biểu, CSV cho Power BI
├── reports/                  # Data Dictionary, Model Comparison, Audit Reports
├── config/                   # Cấu hình tham số, random seed = 42
├── README.md
└── requirements.txt
```

## 3. Quy trình thực hiện (Workflow)
- **Phase 1: Data Audit & Leakage Prevention** (Hoàn thành)
- **Phase 2: Common Data Pipeline & Cleaning**
- **Phase 3: Demand & Revenue Forecasting**
- **Phase 4: Customer Segmentation (RFM + K-Means)**
- **Phase 5: B2B Churn Prediction**
- **Phase 6: Credit Risk & Overdue Debt Prediction**
- **Phase 7: Power BI Integration & Final Reporting**
