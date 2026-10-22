import sys
import urllib

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.dialects.mssql import NVARCHAR


# ==============================
# 1. FILE EXCEL
# ==============================

EXCEL_FILE = r"D:\Phase 2\Dim_product\Product.xlsx"
SHEET_NAME = "DANH SÁCH HÀNG HÓA, DỊCH VỤ"


# ==============================
# 2. SQL SERVER
# ==============================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Dim_product_new"


# ==============================
# 3. ĐỌC EXCEL
# ==============================

df = pd.read_excel(
    EXCEL_FILE,
    sheet_name=SHEET_NAME,
    engine="openpyxl",
    dtype=str,
    header=2
)


# ==============================
# 4. LÀM SẠCH DỮ LIỆU
# ==============================

# Chỉ xóa khoảng trắng ở đầu và cuối tên cột
df.columns = df.columns.astype(str).str.strip()

# Xóa các dòng trống hoàn toàn
df = df.dropna(how="all")

# Thay giá trị NaN bằng chuỗi rỗng
df = df.fillna("")

# Không chỉnh sửa khoảng trắng trong cột Mã
# Dữ liệu cột Mã được giữ nguyên như trong file Excel

print("5 dòng dữ liệu đầu tiên:")
print(df.head())

print("\nKiểu dữ liệu:")
print(df.dtypes)


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
# 6. ÉP TẤT CẢ CÁC CỘT THÀNH NVARCHAR(500)
# ==============================

dtype_mapping = {
    col: NVARCHAR(length=500)
    for col in df.columns
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
        f"\nImport thành công {len(df):,} dòng vào "
        f"{DATABASE}.{SCHEMA}.{TABLE_NAME}"
    )

except Exception as error:
    print("\nImport dữ liệu thất bại!")
    print(f"Chi tiết lỗi: {error}")
    sys.exit(1)

finally:
    engine.dispose()