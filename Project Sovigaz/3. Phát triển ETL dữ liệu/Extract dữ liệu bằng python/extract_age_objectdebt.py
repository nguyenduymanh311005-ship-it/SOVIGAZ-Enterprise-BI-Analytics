import sys
import urllib
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.dialects.mssql import NVARCHAR, DECIMAL


# ============================================================
# 1. CẤU HÌNH FOLDER EXCEL
# ============================================================

INPUT_FOLDER = Path(
    r"D:\Phase 2\Debt\Analytics_Debit"
)

SHEET_NAME = "Phân tích công nợ phải thu the"


# ============================================================
# 2. CẤU HÌNH SQL SERVER
# ============================================================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Fact_AnalyticsDebit_upload"

CHUNK_SIZE = 1000


# ============================================================
# 3. TẠO KẾT NỐI SQL SERVER
# ============================================================

connection_string = urllib.parse.quote_plus(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

engine = create_engine(
    f"mssql+pyodbc:///?odbc_connect={connection_string}",
    fast_executemany=True
)


# ============================================================
# 4. DANH SÁCH CÁC CỘT TUỔI NỢ
# ============================================================

debt_columns = [
    "Không có hạn nợ",
    "Nợ trước hạn 0-30 ngày",
    "Nợ trước hạn 31-90 ngày",
    "Nợ trước hạn trên 90 ngày",
    "Nợ quá hạn 1-30 ngày",
    "Nợ quá hạn 31-90 ngày",
    "Nợ quá hạn 91-180 ngày",
    "Nợ quá hạn 181-365 ngày",
    "Nợ quá hạn 366-730 ngày",
    "Nợ quá hạn 731-1095 ngày",
    "Nợ quá hạn trên 1095 ngày"
]

required_columns = [
    "Mã khách hàng",
    "Tên khách hàng",
    "Địa chỉ"
] + debt_columns


# ============================================================
# 5. HÀM BIẾN ĐỔI MỘT FILE EXCEL
# ============================================================

def transform_excel_file(excel_file: Path) -> pd.DataFrame:
    """
    Đọc và biến đổi một file Excel công nợ.

    Tài khoản được lấy từ tên file:
    131.xlsx -> 131
    1361.xlsx -> 1361
    """

    account = excel_file.stem.strip()

    print(f"Đang xử lý file: {excel_file.name}")
    print(f"Tài khoản       : {account}")

    # Đọc file Excel
    df_raw = pd.read_excel(
        excel_file,
        sheet_name=SHEET_NAME,
        header=None,
        engine="openpyxl",
        dtype=object
    )

    # Dữ liệu bắt đầu từ dòng Excel thứ 14
    df = df_raw.iloc[13:].copy()

    # Đổi tên cột theo vị trí
    df = df.rename(
        columns={
            0: "Mã khách hàng",
            1: "Tên khách hàng",
            3: "Địa chỉ",

            7: "Không có hạn nợ",
            8: "Nợ trước hạn 0-30 ngày",
            9: "Nợ trước hạn 31-90 ngày",
            10: "Nợ trước hạn trên 90 ngày",

            12: "Nợ quá hạn 1-30 ngày",
            13: "Nợ quá hạn 31-90 ngày",
            15: "Nợ quá hạn 91-180 ngày",
            16: "Nợ quá hạn 181-365 ngày",
            17: "Nợ quá hạn 366-730 ngày",
            18: "Nợ quá hạn 731-1095 ngày",
            19: "Nợ quá hạn trên 1095 ngày"
        }
    )

    # Kiểm tra file có đủ cột hay không
    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"File {excel_file.name} thiếu các cột: "
            f"{missing_columns}"
        )

    df = df[required_columns].copy()

    # Làm sạch mã khách hàng
    df["Mã khách hàng"] = (
        df["Mã khách hàng"]
        .astype("string")
        .str.strip()
    )

    # Chỉ giữ dòng có mã khách hàng
    df = df[
        df["Mã khách hàng"].notna()
        & (df["Mã khách hàng"] != "")
    ].copy()

    # Loại bỏ dòng tổng cộng và dòng tiêu đề
    df = df[
        ~df["Mã khách hàng"].str.contains(
            r"Tổng cộng|Cộng|Mã nhóm khách hàng",
            case=False,
            na=False
        )
    ].copy()

    # Chuẩn hóa các cột giá trị
    for column in debt_columns:
        df[column] = (
            df[column]
            .astype("string")
            .str.strip()
            .str.replace(",", "", regex=False)
            .str.replace(" ", "", regex=False)
        )

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        ).fillna(0)

    # Chuyển dữ liệu từ ngang sang dọc
    df_output = df.melt(
        id_vars=[
            "Mã khách hàng",
            "Tên khách hàng",
            "Địa chỉ"
        ],
        value_vars=debt_columns,
        var_name="Mô tả nợ",
        value_name="Giá trị"
    )

    # Chỉ giữ dòng có giá trị khác 0
    df_output = (
        df_output[df_output["Giá trị"] != 0]
        .reset_index(drop=True)
    )

    # Thêm cột tài khoản từ tên file
    df_output["Tài khoản"] = account

    return df_output


# ============================================================
# 6. LẤY DANH SÁCH FILE EXCEL TRONG FOLDER
# ============================================================

excel_files = sorted(
    [
        file
        for file in INPUT_FOLDER.glob("*.xlsx")
        if not file.name.startswith("~$")
    ]
)

if not excel_files:
    print(f"Không tìm thấy file Excel trong folder: {INPUT_FOLDER}")
    sys.exit(1)

print("=" * 70)
print(f"Folder đầu vào : {INPUT_FOLDER}")
print(f"Số file tìm thấy: {len(excel_files)}")
print("=" * 70)


# ============================================================
# 7. BIẾN ĐỔI TỪNG FILE VÀ UNION DỮ LIỆU
# ============================================================

list_dataframe = []
failed_files = []

for excel_file in excel_files:
    try:
        df_file = transform_excel_file(excel_file)

        if df_file.empty:
            print(
                f"File {excel_file.name} không có dữ liệu khác 0."
            )
        else:
            list_dataframe.append(df_file)

            print(
                f"Hoàn thành file {excel_file.name}: "
                f"{len(df_file):,} dòng"
            )

        print("-" * 70)

    except Exception as error:
        failed_files.append(
            {
                "File": excel_file.name,
                "Lỗi": str(error)
            }
        )

        print(f"Lỗi xử lý file {excel_file.name}")
        print(f"Chi tiết: {error}")
        print("-" * 70)


if not list_dataframe:
    print("Không có dữ liệu hợp lệ để upload lên SQL Server.")

    if failed_files:
        print("Danh sách file lỗi:")

        for item in failed_files:
            print(f"- {item['File']}: {item['Lỗi']}")

    sys.exit(1)


# Union toàn bộ dữ liệu các file
df_output = pd.concat(
    list_dataframe,
    ignore_index=True
)


# ============================================================
# 8. LÀM SẠCH CÁC CỘT TEXT
# ============================================================

text_columns = [
    "Tài khoản",
    "Mã khách hàng",
    "Tên khách hàng",
    "Địa chỉ",
    "Mô tả nợ"
]

for column in text_columns:
    df_output[column] = (
        df_output[column]
        .astype("string")
        .str.strip()
    )


# ============================================================
# 9. SẮP XẾP DỮ LIỆU
# ============================================================

debt_order = {
    debt_name: order
    for order, debt_name in enumerate(debt_columns, start=1)
}

df_output["_DebtOrder"] = (
    df_output["Mô tả nợ"]
    .map(debt_order)
)

df_output = (
    df_output
    .sort_values(
        by=[
            "Tài khoản",
            "Mã khách hàng",
            "_DebtOrder"
        ],
        kind="stable"
    )
    .drop(columns="_DebtOrder")
    .reset_index(drop=True)
)


# ============================================================
# 10. SẮP XẾP THỨ TỰ CỘT OUTPUT
# ============================================================

df_output = df_output[
    [
        "Tài khoản",
        "Mã khách hàng",
        "Tên khách hàng",
        "Địa chỉ",
        "Mô tả nợ",
        "Giá trị"
    ]
]


# ============================================================
# 11. CHUYỂN GIÁ TRỊ RỖNG THÀNH NULL
# ============================================================

for column in text_columns:
    df_output[column] = df_output[column].replace(
        {
            pd.NA: None,
            "": None,
            "nan": None,
            "None": None
        }
    )

df_output["Giá trị"] = pd.to_numeric(
    df_output["Giá trị"],
    errors="coerce"
)


# ============================================================
# 12. KHAI BÁO KIỂU DỮ LIỆU MSSQL
# ============================================================

sql_data_types = {
    "Tài khoản": NVARCHAR(length=50),
    "Mã khách hàng": NVARCHAR(length=100),
    "Tên khách hàng": NVARCHAR(length=510),
    "Địa chỉ": NVARCHAR(length=1000),
    "Mô tả nợ": NVARCHAR(length=255),
    "Giá trị": DECIMAL(precision=38, scale=4)
}


# ============================================================
# 13. IMPORT DỮ LIỆU LÊN SQL SERVER
# ============================================================

try:
    print("=" * 70)
    print("Bắt đầu import dữ liệu lên SQL Server...")
    print(f"Server        : {SERVER}")
    print(f"Database      : {DATABASE}")
    print(f"Table         : [{SCHEMA}].[{TABLE_NAME}]")
    print(f"Số file thành công: {len(list_dataframe):,}")
    print(f"Số file lỗi      : {len(failed_files):,}")
    print(f"Tổng số dòng     : {len(df_output):,}")

    df_output.to_sql(
        name=TABLE_NAME,
        con=engine,
        schema=SCHEMA,
        if_exists="replace",
        index=False,
        chunksize=CHUNK_SIZE,
        dtype=sql_data_types
    )

    print("Import dữ liệu lên SQL Server thành công.")
    print(
        f"Đã import {len(df_output):,} dòng vào "
        f"[{DATABASE}].[{SCHEMA}].[{TABLE_NAME}]"
    )

    if failed_files:
        print("\nCác file không xử lý được:")

        for item in failed_files:
            print(f"- {item['File']}: {item['Lỗi']}")

except Exception as error:
    print("Import dữ liệu lên SQL Server thất bại.")
    print(f"Chi tiết lỗi: {error}")
    sys.exit(1)

finally:
    engine.dispose()