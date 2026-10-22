# 🏭 SOVIGAZ - End-to-End Enterprise Business Intelligence & Predictive Analytics Platform

[![Power BI](https://img.shields.io/badge/Power_BI-F2C811?style=for-the-badge&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Oracle SQL](https://img.shields.io/badge/Oracle_SQL-F80000?style=for-the-badge&logo=oracle&logoColor=white)](https://www.oracle.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![CatBoost](https://img.shields.io/badge/CatBoost-FFCC00?style=for-the-badge&logo=yandex&logoColor=black)](https://catboost.ai/)

> **Dự án Tốt nghiệp / Chuyên môn Phân tích Dữ liệu Doanh nghiệp (INDA)**  
> **Tác giả:** Nguyễn Duy Mạnh  
> **Email:** nguyenduymanh311005@gmail.com  
> **GitHub:** [@nguyenduymanh311005-ship-it](https://github.com/nguyenduymanh311005-ship-it)

---

## 📌 1. Tổng quan Dự án (Project Overview)

**SOVIGAZ (Công ty Cổ phần Khí Công Nghiệp Hóa Chất)** là một trong những doanh nghiệp hàng đầu tại Việt Nam trong lĩnh vực sản xuất và phân phối khí công nghiệp (Oxy y tế, Oxy lỏng, Ni tơ, Argon, CO2, Acetylene...), que hàn và hóa chất kỹ thuật.

Dự án này là giải pháp **Chuyển đổi số & Phân tích Dữ liệu Doanh nghiệp Toàn diện (End-to-End Enterprise Data Analytics Platform)**, bao gồm:
1. **Kho dữ liệu & Báo cáo Quản trị BI (Power BI & Data Warehouse):** Xử lý và trực quan hóa toàn bộ dòng chảy doanh thu, công nợ và chỉ tiêu KPI theo thời gian thực.
2. **Khoa học Dữ liệu & Học máy (Machine Learning):** Mô hình hóa rủi ro tín dụng/công nợ khách hàng (Credit Risk Modeling) và phân tích hành vi khách hàng.
3. **Cổng thông tin Web (Web Portal):** Nền tảng trực quan giới thiệu dự án, demo dashboard tương tác trực tiếp.
4. **Hệ thống Kiểm thử & Tài liệu Nghiệp vụ:** Bộ hồ sơ BRD chuẩn mực kế toán và kịch bản kiểm thử chấp nhận người dùng (UAT) đối soát 100% khớp dữ liệu gốc.

---

## 🗂️ 2. Cấu trúc Đồ án (Project Structure)

Dự án được tổ chức chặt chẽ theo 5 trụ cột:

```text
├── Project Sovigaz/                  # Phân hệ Power BI, DWH, BRD & UAT Testing
│   ├── 1. Giới thiệu và khảo sát/   # Tài liệu nghiệp vụ & khảo sát hệ thống MISA AMIS
│   ├── 2. Tài liệu phân tích/       # Business Requirement Document (BRD) & Data Mapping
│   ├── 3. Phát triển ETL dữ liệu/   # Luồng ETL, Staging, Datamart & DDL SQL
│   ├── 4. Phát triển báo cáo/       # Đặc tả hệ thống KPI, DAX Formulas & Mockup UI
│   ├── 5. Kiểm thử/                 # Kịch bản kiểm thử SIT, UAT (100% test cases)
│   ├── 6. Viết báo cáo và slide/    # Slide thuyết trình & Báo cáo đề án
│   ├── Website/                     # React + Vite Web Portal giới thiệu dự án
│   └── Dash.pbix                    # File báo cáo Power BI chính thức của dự án
│
├── SOVIGAZ_ML/                      # Phân hệ Machine Learning & Khoa học Dữ liệu
│   ├── config/                      # Cấu hình pipeline dữ liệu & tham số mô hình
│   ├── data/                        # Data dictionary, feature lineage, sample data
│   ├── models/                      # Mô hình học máy đã huấn luyện (CatBoost, LightGBM)
│   ├── notebooks/                   # Jupyter Notebooks: EDA, Feature Engineering, Training
│   ├── src/                         # Mã nguồn Python: pipeline, evaluation, metrics
│   └── webapp/                      # Ứng dụng web dự đoán rủi ro tín dụng
│
├── Thực tập tốt nghiệp/             # Hồ sơ & Báo cáo chuyên đề Tốt nghiệp
│   ├── Báo cáo final/               # Báo cáo chuyên sâu bản hoàn chỉnh
│   └── Huong_dan_TTTN/              # Đề cương & tiêu chí chấm điểm
│
├── SQL/                             # Kịch bản truy vấn SQL & Tối ưu hóa Database
│   └── OracleSQL.sql                # Các truy vấn Oracle SQL DWH chuẩn
│
├── .gitignore                       # Cấu hình loại bỏ dữ liệu lớn (>50MB) & bảo mật API
└── README.md                        # Tài liệu tổng quan toàn bộ dự án
```

---

## 📊 3. Phân hệ Power BI & Kho Dữ liệu (Business Intelligence)

### 3.1. Mô hình Dữ liệu (Star Schema)
Dữ liệu được trích xuất từ phần mềm kế toán doanh nghiệp **MISA AMIS** qua cổng Staging và chuẩn hóa thành mô hình **Star Schema**:
* **Bảng Fact:**
  * `DM_RevenueBySaleLedger`: Hơn 73.000+ giao dịch bán hàng chi tiết từ 2022 - 2026.
  * `DM_AccountObjectDebt`: Sổ chi tiết công nợ theo từng đối tượng khách hàng.
  * `FACT_KPI_MONTH` & `FACT_KPI_YEAR`: Kế hoạch sản xuất & doanh thu phân bổ.
  * `FACT_ACTUALPRODUCTION`: Sản lượng và giá trị sản xuất thực tế tại các xí nghiệp.
* **Bảng Dimension:**
  * `Dim_Date`, `Dim_Customer`, `Dim_Products`, `Dim_Stock` (Xí nghiệp/Kho), `Dim_Account`.

### 3.2. Năm Trang Báo cáo Quản trị Cốt lõi
1. **Báo cáo Doanh thu Tổng quan:** Theo dõi doanh thu thực tế (323,89 tỷ năm 2025), thuế VAT, doanh thu trước thuế, tổng đơn hàng và giá trị trung bình đơn (AOV).
2. **Báo cáo Doanh thu Chi tiết:** Phân tích doanh số đa chiều theo nhóm khách hàng (Bệnh viện/Y tế, Đại lý, Công nghiệp), nhóm sản phẩm khí, xí nghiệp chi nhánh.
3. **Báo cáo Quản lý Công nợ:** Cân đối số dư kế toán:
   $$\text{Số nợ còn lại (668,61 tỷ)} = \text{Đầu kỳ (668,52 tỷ)} + \text{Phát sinh (70,57 tỷ)} - \text{Đã thanh toán (70,21 tỷ)}$$
   Phân tích tuổi nợ và nhận diện nợ xấu, nợ quá hạn lâu năm.
4. **Báo cáo Điều hành KPI:** Đánh giá mức độ hoàn thành chỉ tiêu Doanh thu (109,29%) và Giá trị sản xuất (108,96%), so sánh lũy kế (YTD) và cùng kỳ năm trước (YoY).
5. **Báo cáo KPI Chi tiết & Sức khỏe Tài chính:** Đánh giá sức khỏe tài chính và năng lực sản xuất của từng xí nghiệp (Bình Dương, Biên Hòa, Cần Thơ, Hải Phòng, Nha Trang...).

---

## 🤖 4. Phân hệ Machine Learning (Predictive Analytics)

* **Bài toán:** Dự báo rủi ro thanh toán công nợ khách hàng (Credit Risk Classification) & Dự báo doanh thu tiêu thụ khí.
* **Thuật toán triển khai:** CatBoost Classifier, LightGBM, XGBoost, Random Forest.
* **Đặc tính kỹ thuật:**
  * Xử lý mất cân bằng dữ liệu (Imbalanced Data) và chống rò rỉ dữ liệu (Target Leakage Audit).
  * Feature Lineage: Tự động trích xuất các thuộc tính chu kỳ mua hàng, lịch sử trả nợ, hạn mức nợ và tần suất đơn hàng.
  * Đánh giá hiệu năng: ROC-AUC, Precision-Recall, F1-Score và ma trận chi phí sai sót tín dụng.

---

## 🌐 5. Phân hệ Website Portal

* **Công nghệ:** React 18, Vite, Tailwind CSS, Lucide Icons.
* **Chức năng:** Giới thiệu tổng quan dự án, xem trước giao diện các Dashboard Power BI, tra cứu số liệu báo cáo và tài liệu UAT trực tiếp.

---

## 🔒 6. Chính sách Bảo mật & Dữ liệu Mẫu (Data Privacy & Compliance)

Để tuân thủ chính sách bảo mật thông tin doanh nghiệp:
* **Khóa API & Credentials:** Toàn bộ API Key (Firebase, Database connection strings) đã được chuyển thành biến môi trường (`.env`), không được lưu trên Git.
* **Dữ liệu lớn & Khách hàng:** Các file CSV gốc dung lượng lớn (>50MB) chứa danh tính khách hàng đã được lược bỏ trong `.gitignore`. Dự án cung cấp **file mẫu demo thu nhỏ (`sample.csv`)** kèm **Data Dictionary** để người xem dễ dàng kiểm chứng cấu trúc bảng mà không làm lộ dữ liệu nội bộ.

---

## 🛠️ 7. Hướng dẫn Chạy Thử (Quick Start)

### Mở Báo cáo Power BI
1. Cài đặt [Power BI Desktop](https://powerbi.microsoft.com/desktop/).
2. Mở file `Project Sovigaz/Dash.pbix`.

### Khởi chạy Phân hệ Machine Learning
```bash
cd SOVIGAZ_ML
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python src/train.py
```

### Khởi chạy Website Portal
```bash
cd "Project Sovigaz/Website"
npm install
npm run dev
```

---

## 📬 Liên hệ (Contact)

Nếu bạn có bất kỳ câu hỏi hoặc muốn trao đổi thêm về dự án:
* **Họ tên:** Nguyễn Duy Mạnh
* **Email:** [nguyenduymanh311005@gmail.com](mailto:nguyenduymanh311005@gmail.com)
* **GitHub:** [nguyenduymanh311005-ship-it](https://github.com/nguyenduymanh311005-ship-it)
