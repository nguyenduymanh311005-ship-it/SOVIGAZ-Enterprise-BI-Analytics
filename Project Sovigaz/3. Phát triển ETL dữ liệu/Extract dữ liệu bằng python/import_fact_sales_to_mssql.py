import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.dialects.mssql import NVARCHAR, DATE
import urllib
import sys
# ==============================
# 1. CẤU HÌNH FILE EXCEL
# ==============================
EXCEL_FILE = r"D:\Phase 2\Sales\So_chi_tiet_ban_hang.xlsx"
SHEET_NAME = "SỔ CHI TIẾT BÁN HÀNG"

# ==============================
# 2. CẤU HÌNH SQL SERVER
# ==============================
SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Fact_sales_upload"

# ==============================
# 3. ĐỌC DỮ LIỆU TỪ EXCEL
# ==============================
df = pd.read_excel(
    EXCEL_FILE,
    sheet_name=SHEET_NAME,
    engine="openpyxl",
    header=3
)

# Làm sạch tên cột
df.columns = (
    df.columns
    .astype(str)
    .str.strip()
)

# Xóa các dòng hoàn toàn trống
df = df.dropna(how="all")

# ==============================
# 3.1. LỌC BỎ DÒNG "TỔNG CỘNG" VÀ CHUẨN HÓA CỘT NGÀY HẠCH TOÁN
# ==============================
DATE_COLUMN = "Ngày hạch toán"

if DATE_COLUMN in df.columns:
    # Loại bỏ dòng tổng cộng / dòng chú thích cuối bảng
    # (so sánh dạng string, strip khoảng trắng để chắc chắn khớp)
    mask_tong_cong = (
        df[DATE_COLUMN]
        .astype(str)
        .str.strip()
        .str.upper()
        .eq("TỔNG CỘNG")
    )
    so_dong_bi_loai = mask_tong_cong.sum()
    df = df[~mask_tong_cong].copy()

    print(f"\nĐã loại {so_dong_bi_loai} dòng có '{DATE_COLUMN}' = 'Tổng cộng'.")

    # Chuyển cột ngày hạch toán sang kiểu datetime thật sự
    # errors='coerce' -> giá trị không parse được sẽ thành NaT (thay vì lỗi crash)
    # dayfirst=True -> dùng khi ngày trong Excel dạng chuỗi dd/mm/yyyy
    df[DATE_COLUMN] = pd.to_datetime(df[DATE_COLUMN], errors="coerce", dayfirst=True)

    # Kiểm tra xem còn dòng nào bị lỗi convert không (NaT) để soát lại
    so_dong_loi_ngay = df[DATE_COLUMN].isna().sum()
    if so_dong_loi_ngay > 0:
        print(f"CẢNH BÁO: {so_dong_loi_ngay} dòng có '{DATE_COLUMN}' không convert được sang ngày (đang là NaT).")
else:
    print(f"CẢNH BÁO: Không tìm thấy cột '{DATE_COLUMN}' trong file Excel.")

# ==============================
# 4. CÁC CỘT CHỨA TIẾNG VIỆT
# ==============================
# Thay tên bên dưới bằng đúng tên cột trong file Excel của bạn
VIETNAMESE_COLUMNS = [
    "Tên khách hàng (thông tin chung)",
    "Tên hàng",
    "Mã hàng",
    "Diễn giải chung",
    "Loại chứng từ",
    "Đơn vị chính (ĐVC)"
]

# Chỉ xử lý những cột thực sự tồn tại trong file
existing_vietnamese_columns = [
    column for column in VIETNAMESE_COLUMNS
    if column in df.columns
]

# Chuyển các cột tiếng Việt sang kiểu chuỗi của Pandas
# Vẫn giữ giá trị trống là NULL, không thay thành ""
for column in existing_vietnamese_columns:
    df[column] = df[column].astype("string")

# Kiểm tra cột nào được định dạng NVARCHAR
print("\nCác cột được định dạng NVARCHAR:")
for column in existing_vietnamese_columns:
    print(f"- {column}")

# Cảnh báo các cột đã khai báo nhưng không có trong Excel
missing_columns = [
    column for column in VIETNAMESE_COLUMNS
    if column not in df.columns
]
if missing_columns:
    print("\nCác cột không tìm thấy trong file Excel:")
    for column in missing_columns:
        print(f"- {column}")

# ==============================
# 5. KIỂM TRA DỮ LIỆU
# ==============================
print("\n5 dòng dữ liệu đầu tiên:")
print(df.head())

print("\nKiểu dữ liệu Pandas:")
print(df.dtypes)

print("\nKích thước dữ liệu:")
print(f"Số dòng: {df.shape[0]:,}")
print(f"Số cột: {df.shape[1]:,}")

# ==============================
# 6. TẠO KẾT NỐI SQL SERVER
# ==============================
connection_string = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)
params = urllib.parse.quote_plus(connection_string)

engine = create_engine(
    f"mssql+pyodbc:///?odbc_connect={params}",
    fast_executemany=True
)

# ==============================
# 7. CHỈ ĐỊNH KIỂU DỮ LIỆU SQL
# ==============================
# Chỉ định riêng các cột tiếng Việt là NVARCHAR
# Cột ngày hạch toán được chỉ định là DATE
# Các cột còn lại để SQLAlchemy tự nhận kiểu dữ liệu
dtype_mapping = {
    column: NVARCHAR(length=1000) for column in existing_vietnamese_columns
}

if DATE_COLUMN in df.columns:
    dtype_mapping[DATE_COLUMN] = DATE  # dùng DATETIME2 nếu cột có cả giờ:phút:giây

# ==============================
# 8. IMPORT VÀO SQL SERVER
# ==============================
try:
    df.to_sql(
        name=TABLE_NAME,
        con=engine,
        schema=SCHEMA,
        if_exists="replace",
        index=False,
        chunksize=10000,
        dtype=dtype_mapping
    )
    print(
        f"\nImport thành công {len(df):,} dòng vào bảng "
        f"[{DATABASE}].[{SCHEMA}].[{TABLE_NAME}]"
    )
except Exception as error:
    print("\nImport dữ liệu thất bại.")
    print(f"Chi tiết lỗi: {error}")
    sys.exit(1)
finally:
    engine.dispose()
    print("\nĐã đóng kết nối SQL Server.")