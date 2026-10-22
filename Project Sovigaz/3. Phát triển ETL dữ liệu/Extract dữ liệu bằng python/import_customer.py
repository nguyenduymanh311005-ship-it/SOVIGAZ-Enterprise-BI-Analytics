# -*- coding: utf-8 -*-

from pathlib import Path
import os
import sys
import urllib.parse

import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.dialects.mssql import NVARCHAR


# ============================================================
# 0. THIẾT LẬP UTF-8
# ============================================================

os.environ["PYTHONUTF8"] = "1"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(
        encoding="utf-8",
        errors="replace"
    )

if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(
        encoding="utf-8",
        errors="replace"
    )


# ============================================================
# 1. CẤU HÌNH THƯ MỤC FILE EXCEL
# ============================================================

INPUT_FOLDER = Path(
    r"D:\Phase 2\Dim_customer\New folder"
)

SHEET_NAME = "Danh sách khách hàng"

# Dòng tiêu đề nằm ở dòng thứ 3 trong Excel.
# pandas đếm từ 0 nên sử dụng header=2.
HEADER_ROW = 2


# ============================================================
# 2. CẤU HÌNH SQL SERVER
# ============================================================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Dim_customer_upload"

ODBC_DRIVER = "ODBC Driver 17 for SQL Server"

CHUNK_SIZE = 1000


# ============================================================
# 3. LẤY STOCKCODE TỪ TÊN FILE
# ============================================================

def get_stockcode(file_path: Path) -> str:
    """
    Ví dụ:
        BD.xlsx  -> BD
        BH.xlsx  -> BH
        CT.xlsx  -> CT
        VP.xlsx  -> VP
        VP2.xlsx -> VP
    """

    file_code = file_path.stem.strip().upper()

    if file_code in {"VP", "VP2"}:
        return "VP"

    return file_code


# ============================================================
# 4. LÀM SẠCH CHUỖI UNICODE
# ============================================================

def clean_unicode_value(value):
    """
    Làm sạch các ký tự Unicode thừa nhưng vẫn giữ nguyên
    tiếng Việt có dấu.
    """

    if not isinstance(value, str):
        return value

    return (
        value
        .replace("\ufeff", "")
        .replace("\u00a0", " ")
        .replace("\r\n", "\n")
        .replace("\r", "\n")
        .strip()
    )


def clean_dataframe_unicode(
    df: pd.DataFrame
) -> pd.DataFrame:
    """
    Làm sạch tên cột và dữ liệu dạng chuỗi.
    """

    df.columns = [
        clean_unicode_value(str(column))
        for column in df.columns
    ]

    for column in df.columns:
        df[column] = df[column].map(
            clean_unicode_value
        )

    return df


# ============================================================
# 5. XỬ LÝ TÊN CỘT BỊ TRÙNG
# ============================================================

def make_unique_columns(columns):
    """
    Đổi tên các cột trùng nhau.

    Ví dụ:
        Điện thoại
        Điện thoại_2
        Điện thoại_3
    """

    result = []
    column_count = {}

    for column in columns:
        column_name = str(column).strip()

        if column_name not in column_count:
            column_count[column_name] = 1
            result.append(column_name)

        else:
            column_count[column_name] += 1

            new_name = (
                f"{column_name}_"
                f"{column_count[column_name]}"
            )

            result.append(new_name)

    return result


# ============================================================
# 6. ĐỌC MỘT FILE EXCEL
# ============================================================

def read_customer_file(
    file_path: Path
) -> pd.DataFrame:
    """
    Đọc dữ liệu từ một file Excel, loại dòng tổng
    và thêm stockcode.
    """

    stockcode = get_stockcode(file_path)

    print(
        f"Đang đọc: {file_path.name} "
        f"-> stockcode = {stockcode}"
    )

    try:
        df = pd.read_excel(
            file_path,
            sheet_name=SHEET_NAME,
            header=HEADER_ROW,
            engine="openpyxl",
            dtype=object
        )

    except ValueError as error:
        raise ValueError(
            f"Không tìm thấy sheet '{SHEET_NAME}' "
            f"trong file '{file_path.name}'."
        ) from error

    # Làm sạch Unicode
    df = clean_dataframe_unicode(df)

    # Xử lý tên cột bị trùng
    df.columns = make_unique_columns(
        df.columns
    )

    # Xóa cột hoàn toàn trống
    df = df.dropna(
        axis=1,
        how="all"
    )

    # Xóa dòng hoàn toàn trống
    df = df.dropna(
        axis=0,
        how="all"
    )

    # ========================================================
    # LOẠI DÒNG TRỐNG VÀ DÒNG TỔNG
    # ========================================================

    if "Mã khách hàng" in df.columns:
        customer_code = (
            df["Mã khách hàng"]
            .fillna("")
            .astype(str)
            .str.strip()
        )

        customer_code_check = (
            customer_code
            .str.lower()
            .str.replace(r"\s+", " ", regex=True)
            .str.strip()
        )

        rows_before_filter = len(df)

        df = df[
            customer_code.ne("")
            & customer_code_check.ne("nan")
            & customer_code_check.ne("none")
            & customer_code_check.ne("tổng")
            & customer_code_check.ne("tổng cộng")
            & ~customer_code_check.str.startswith("tổng ")
        ].copy()

        removed_rows = (
            rows_before_filter - len(df)
        )

        if removed_rows > 0:
            print(
                f"  Đã loại {removed_rows:,} dòng "
                f"trống/dòng tổng."
            )

    else:
        raise ValueError(
            f"File '{file_path.name}' không có cột "
            f"'Mã khách hàng'."
        )

    # Xóa cột stockcode cũ nếu có
    old_stockcode_columns = [
        column
        for column in df.columns
        if str(column).strip().lower()
        == "stockcode"
    ]

    if old_stockcode_columns:
        df = df.drop(
            columns=old_stockcode_columns
        )

    # Chèn stockcode ngay sau STT
    if "STT" in df.columns:
        insert_position = (
            df.columns.get_loc("STT") + 1
        )
    else:
        insert_position = 0

    df.insert(
        loc=insert_position,
        column="stockcode",
        value=stockcode
    )

    print(
        f"  Đã đọc: {len(df):,} dòng, "
        f"{len(df.columns):,} cột"
    )

    return df


# ============================================================
# 7. TÌM VÀ GHÉP TOÀN BỘ FILE
# ============================================================

def combine_customer_files() -> pd.DataFrame:
    """
    Đọc và ghép toàn bộ file Excel trong thư mục.
    """

    if not INPUT_FOLDER.exists():
        raise FileNotFoundError(
            f"Không tìm thấy thư mục:\n"
            f"{INPUT_FOLDER}"
        )

    excel_files = []

    for file_path in INPUT_FOLDER.glob(
        "*.xlsx"
    ):
        # Bỏ qua file Excel tạm
        if file_path.name.startswith("~$"):
            continue

        excel_files.append(file_path)

    excel_files = sorted(
        excel_files,
        key=lambda path: path.name.upper()
    )

    if not excel_files:
        raise FileNotFoundError(
            f"Không tìm thấy file .xlsx trong:\n"
            f"{INPUT_FOLDER}"
        )

    print("=" * 75)
    print("BẮT ĐẦU GHÉP DANH SÁCH KHÁCH HÀNG")
    print("=" * 75)

    print(
        f"Tìm thấy {len(excel_files)} file:"
    )

    for index, file_path in enumerate(
        excel_files,
        start=1
    ):
        print(
            f"{index:02d}. "
            f"{file_path.name:<25} "
            f"-> {get_stockcode(file_path)}"
        )

    print("-" * 75)

    dataframes = []
    failed_files = []

    for file_path in excel_files:
        try:
            df_file = read_customer_file(
                file_path
            )

            if not df_file.empty:
                dataframes.append(df_file)
            else:
                print(
                    f"  File {file_path.name} "
                    f"không có dữ liệu hợp lệ."
                )

        except Exception as error:
            failed_files.append(
                {
                    "file": file_path.name,
                    "error": str(error)
                }
            )

            print(
                f"  LỖI file {file_path.name}: "
                f"{error}"
            )

    if failed_files:
        print("\nCÁC FILE ĐỌC BỊ LỖI:")

        for item in failed_files:
            print(
                f"  - {item['file']}: "
                f"{item['error']}"
            )

        raise RuntimeError(
            "Có file bị lỗi nên dừng import để tránh "
            "dữ liệu trên SQL Server bị thiếu."
        )

    if not dataframes:
        raise RuntimeError(
            "Không đọc thành công file Excel nào."
        )

    # Ghép các file theo chiều dọc
    df_combined = pd.concat(
        dataframes,
        ignore_index=True,
        sort=False
    )

    # Làm sạch Unicode thêm một lần
    df_combined = clean_dataframe_unicode(
        df_combined
    )

    # Đánh lại STT liên tục
    if "STT" in df_combined.columns:
        df_combined["STT"] = range(
            1,
            len(df_combined) + 1
        )

    # Chuyển NaN/NaT thành None để insert NULL
    df_combined = df_combined.astype(
        object
    )

    df_combined = df_combined.where(
        pd.notna(df_combined),
        None
    )

    print("-" * 75)

    print(
        f"Tổng số dòng sau khi ghép: "
        f"{len(df_combined):,}"
    )

    print(
        f"Tổng số cột: "
        f"{len(df_combined.columns):,}"
    )

    print("\nSố dòng theo stockcode:")

    stockcode_summary = (
        df_combined["stockcode"]
        .value_counts(dropna=False)
        .sort_index()
    )

    for stockcode, row_count in (
        stockcode_summary.items()
    ):
        print(
            f"  {stockcode}: "
            f"{row_count:,} dòng"
        )

    return df_combined


# ============================================================
# 8. TẠO KẾT NỐI SQL SERVER
# ============================================================

def create_sql_engine():
    """
    Tạo kết nối SQL Server bằng Windows Authentication.
    """

    connection_string = (
        f"DRIVER={{{ODBC_DRIVER}}};"
        f"SERVER={SERVER};"
        f"DATABASE={DATABASE};"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )

    connection_url = (
        "mssql+pyodbc:///?odbc_connect="
        + urllib.parse.quote_plus(
            connection_string
        )
    )

    engine = create_engine(
        connection_url,
        fast_executemany=True,
        pool_pre_ping=True
    )

    return engine


# ============================================================
# 9. KHAI BÁO KIỂU DỮ LIỆU SQL SERVER
# ============================================================

def build_sql_dtype(
    df: pd.DataFrame
) -> dict:
    """
    Đưa các cột lên SQL Server dạng NVARCHAR để:
    - Lưu đúng tiếng Việt.
    - Giữ số 0 đầu mã khách hàng.
    - Tránh lỗi khác kiểu dữ liệu giữa các file.
    """

    sql_dtype = {}

    long_text_columns = {
        "Tên khách hàng",
        "Địa chỉ",
        "Địa điểm giao hàng",
        "Diễn giải"
    }

    for column in df.columns:
        if column in long_text_columns:
            # NVARCHAR(MAX)
            sql_dtype[column] = NVARCHAR(
                length=None
            )

        else:
            sql_dtype[column] = NVARCHAR(
                length=1000
            )

    return sql_dtype


# ============================================================
# 10. IMPORT LÊN SQL SERVER
# ============================================================

def import_to_sql(
    df: pd.DataFrame
) -> None:
    """
    Import DataFrame lên SQL Server theo cơ chế replace.

    replace sẽ:
    1. DROP bảng cũ nếu đã tồn tại.
    2. Tạo lại bảng.
    3. Insert toàn bộ dữ liệu mới.
    """

    print("-" * 75)
    print("BẮT ĐẦU IMPORT LÊN SQL SERVER")

    print(
        f"Server   : {SERVER}"
    )

    print(
        f"Database : {DATABASE}"
    )

    print(
        f"Table    : "
        f"[{SCHEMA}].[{TABLE_NAME}]"
    )

    print(
        "Cơ chế   : REPLACE"
    )

    engine = create_sql_engine()

    sql_dtype = build_sql_dtype(df)

    try:
        # Kiểm tra kết nối
        with engine.connect() as connection:
            connection.exec_driver_sql(
                "SELECT 1"
            )

        print(
            "Kết nối SQL Server thành công."
        )

        df.to_sql(
            name=TABLE_NAME,
            con=engine,
            schema=SCHEMA,
            if_exists="replace",
            index=False,
            dtype=sql_dtype,
            chunksize=CHUNK_SIZE,
            method=None
        )

        print(
            f"Đã import thành công "
            f"{len(df):,} dòng."
        )

        # Kiểm tra số dòng sau khi import
        with engine.connect() as connection:
            count_query = (
                f"SELECT COUNT(*) "
                f"FROM [{SCHEMA}].[{TABLE_NAME}]"
            )

            sql_row_count = (
                connection
                .exec_driver_sql(
                    count_query
                )
                .scalar()
            )

        print(
            f"Số dòng trên SQL Server: "
            f"{sql_row_count:,}"
        )

        if sql_row_count != len(df):
            raise RuntimeError(
                "Số dòng nguồn và số dòng trên "
                "SQL Server không khớp."
            )

    finally:
        engine.dispose()


# ============================================================
# 11. CHƯƠNG TRÌNH CHÍNH
# ============================================================

def main() -> None:
    try:
        df_result = combine_customer_files()

        import_to_sql(
            df_result
        )

        print("=" * 75)
        print("ETL HOÀN THÀNH THÀNH CÔNG")

        print(
            f"Đã replace bảng "
            f"[{DATABASE}].[{SCHEMA}]."
            f"[{TABLE_NAME}]"
        )

        print("=" * 75)

    except Exception as error:
        print("=" * 75)
        print("ETL THẤT BẠI")

        print(
            f"Chi tiết lỗi: {error}"
        )

        print("=" * 75)

        sys.exit(1)


if __name__ == "__main__":
    main()