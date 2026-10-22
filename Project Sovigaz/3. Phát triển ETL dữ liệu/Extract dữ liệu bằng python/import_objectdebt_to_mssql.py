import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.dialects.mssql import NVARCHAR, DECIMAL
import urllib
import sys

# ==============================
# 1. FILE EXCEL
# ==============================

EXCEL_FILE = (
    r"D:\Phase 2\Debt"
    r"\Tong_hop_cong_no_phai_thu_chi_tiet_theo_cac_khoan_giam_tru.xlsx"
)

SHEET_NAME = "TỔNG HỢP CÔNG NỢ PHẢI THU (CHI"

# ==============================
# 2. SQL SERVER
# ==============================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "DM_AccountObjectDebt_upload"

# ==============================
# 3. ĐỌC EXCEL
# ==============================

df = pd.read_excel(
    EXCEL_FILE,
    sheet_name=SHEET_NAME,
    engine="openpyxl",
    dtype=str,
    header=3
)

# Làm sạch tên cột
df.columns = (
    df.columns
    .astype(str)
    .str.strip()
)

# Xóa các dòng trống hoàn toàn
df = df.dropna(how="all")

# ==============================
# 4. CHUYỂN KIỂU DỮ LIỆU
# ==============================

text_columns = [
    "Mã khách hàng",
    "Tên khách hàng",
    "TK công nợ"
]

numeric_columns = [
    "Số dư đầu kỳ",
    "Số phải thu",
    "Chiết khấu",
    "Trả lại/Giảm giá",
    "CK thanh toán/Giảm trừ khác",
    "Số đã thu",
    "Số dư cuối kỳ"
]

# Kiểm tra các cột cần thiết có trong Excel hay không
required_columns = text_columns + numeric_columns

missing_columns = [
    col for col in required_columns
    if col not in df.columns
]

if missing_columns:
    raise ValueError(
        "Không tìm thấy các cột sau trong file Excel: "
        + ", ".join(missing_columns)
    )

# Làm sạch các cột chuỗi
for col in text_columns:
    df[col] = (
        df[col]
        .fillna("")
        .astype(str)
        .str.strip()
    )

# Làm sạch các cột tiền
for col in numeric_columns:
    df[col] = (
        df[col]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.replace(",", "", regex=False)
        .str.replace(" ", "", regex=False)
        .replace("", None)
    )

    df[col] = pd.to_numeric(
        df[col],
        errors="coerce"
    )

print("Danh sách cột:")
for col in df.columns:
    print(col)

print("\nKiểu dữ liệu pandas:")
print(df.dtypes)

print("\nDữ liệu mẫu:")
print(df.head())

# ==============================
# 5. KẾT NỐI SQL SERVER
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
# 6. KHAI BÁO KIỂU DỮ LIỆU SQL
# ==============================

dtype_mapping = {
    "Mã khách hàng": NVARCHAR(length=100),
    "Tên khách hàng": NVARCHAR(length=500),
    "TK công nợ": NVARCHAR(length=100),

    "Số dư đầu kỳ": DECIMAL(precision=38, scale=4),
    "Số phải thu": DECIMAL(precision=38, scale=4),
    "Chiết khấu": DECIMAL(precision=38, scale=4),
    "Trả lại/Giảm giá": DECIMAL(precision=38, scale=4),
    "CK thanh toán/Giảm trừ khác": DECIMAL(
        precision=38,
        scale=4
    ),
    "Số đã thu": DECIMAL(precision=38, scale=4),
    "Số dư cuối kỳ": DECIMAL(precision=38, scale=4)
}

# ==============================
# 7. IMPORT VÀO SQL SERVER
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
        f"Import dữ liệu vào "
        f"{DATABASE}.{SCHEMA}.{TABLE_NAME} thành công!"
    )

except Exception as error:
    print(f"Import thất bại: {error}")
    sys.exit(1)

finally:
    engine.dispose()