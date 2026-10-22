import re
import sys
import time
import urllib.parse
from datetime import datetime
from pathlib import Path

import pandas as pd
import pythoncom
import win32com.client as win32
from sqlalchemy import create_engine, text
from sqlalchemy.dialects.mssql import NVARCHAR, DECIMAL, DATE, DATETIME


# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN
# ============================================================

KPI_MONTH_FOLDER = Path(
    r"D:\Phase 2\KPI\KPI_Month"
)

EXTRACT_FILE = Path(
    r"D:\Phase 2\KPI\Trích xuất sản xuất.xlsx"
)

# Tiền tố tên sheet nguồn trong từng file tháng
SOURCE_SHEET_PREFIX = "BCSX T"

# Vùng dữ liệu nguồn
SOURCE_RANGE = "D5:R25"

# Sheet nhận dữ liệu trong file Trích xuất sản xuất
DESTINATION_SHEET = "Tổng hợp SX"

# Vùng nhận dữ liệu
DESTINATION_RANGE = "D3:R23"

# Sheet chứa dữ liệu cuối cùng để upload
OUTPUT_SHEET = "Trích xuất"


# ============================================================
# 2. CẤU HÌNH SQL SERVER
# ============================================================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Fact_ActualProduction"

ODBC_DRIVER = "ODBC Driver 17 for SQL Server"

CHUNK_SIZE = 1000


# ============================================================
# 3. MAPPING CỘT EXCEL SANG SQL SERVER
# ============================================================

COLUMN_MAPPING = {
    "MaNhomSanPham": "CategoryName",
    "TenSanPham": "ProductName",
    "SanXuat": "ProductQuantity",
    "MuaNgoai": "PurchaseQuantity",
    "Tổng sản xuất (theo DVT)": "ProductQuantityDVC",
    "Tổng sản xuất (theo giá trị)": "ProductValue",
    "ThoiGian": "Date",
    "Factory_Code": "FactoryCode",
}

# Danh sách cột bắt buộc phải có trong sheet Trích xuất
EXCEL_REQUIRED_COLUMNS = list(COLUMN_MAPPING.keys())

# Thứ tự cột insert vào SQL Server
SQL_COLUMNS = [
    "CategoryName",
    "ProductName",
    "ProductQuantity",
    "PurchaseQuantity",
    "ProductQuantityDVC",
    "ProductValue",
    "Date",
    "FactoryCode",
    "ETL_DATE",
]

# Các cột số
NUMERIC_COLUMNS = [
    "ProductQuantity",
    "PurchaseQuantity",
    "ProductQuantityDVC",
    "ProductValue",
]

# Các cột chuỗi
TEXT_COLUMNS = [
    "CategoryName",
    "ProductName",
    "FactoryCode",
]


# ============================================================
# 4. TẠO KẾT NỐI SQL SERVER
# ============================================================

def create_sql_engine():
    """
    Tạo SQLAlchemy engine kết nối tới SQL Server
    bằng Windows Authentication.
    """

    connection_string = urllib.parse.quote_plus(
        f"DRIVER={{{ODBC_DRIVER}}};"
        f"SERVER={SERVER};"
        f"DATABASE={DATABASE};"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )

    engine = create_engine(
        f"mssql+pyodbc:///?odbc_connect={connection_string}",
        fast_executemany=True,
        pool_pre_ping=True,
    )

    return engine


# ============================================================
# 5. TÌM FILE TRÍCH XUẤT SẢN XUẤT
# ============================================================

def find_extract_file():
    """
    Tìm file Trích xuất sản xuất.

    Ưu tiên đúng đường dẫn EXTRACT_FILE.
    Nếu không tìm thấy thì tìm file có cùng tên nhưng khác phần mở rộng.
    """

    if EXTRACT_FILE.exists():
        return EXTRACT_FILE

    possible_files = list(
        EXTRACT_FILE.parent.glob("Trích xuất sản xuất.*")
    )

    possible_files = [
        file
        for file in possible_files
        if file.suffix.lower() in {
            ".xlsx",
            ".xlsm",
            ".xlsb",
            ".xls",
        }
        and not file.name.startswith("~$")
    ]

    if not possible_files:
        raise FileNotFoundError(
            "Không tìm thấy file Trích xuất sản xuất tại folder: "
            f"{EXTRACT_FILE.parent}"
        )

    if len(possible_files) > 1:
        file_names = "\n".join(
            f"- {file.name}"
            for file in possible_files
        )

        raise RuntimeError(
            "Tìm thấy nhiều file Trích xuất sản xuất:\n"
            f"{file_names}\n"
            "Vui lòng chỉ giữ một file hoặc sửa biến EXTRACT_FILE."
        )

    return possible_files[0]


# ============================================================
# 6. ĐỌC THÁNG VÀ NĂM TỪ TÊN FILE
# ============================================================

def extract_month_year_from_filename(file_path):
    """
    Đọc tháng và năm từ tên file.

    Ví dụ hợp lệ:

    A3 T05.2026_CHINHTHUC_08062026.xlsx
    A3 T05.2026 -CHINHTHUC_08062026.xlsx
    A3 T5.2026_CHINHTHUC.xlsx
    """

    pattern = re.compile(
        r"^A3\s*T\s*(\d{1,2})\s*[.]\s*(\d{4})",
        re.IGNORECASE,
    )

    match = pattern.search(
        file_path.stem.strip()
    )

    if not match:
        return None

    month = int(match.group(1))
    year = int(match.group(2))

    if month < 1 or month > 12:
        return None

    return year, month


def get_month_files():
    """
    Tìm tất cả file tháng trong KPI_MONTH_FOLDER
    và sắp xếp theo năm, tháng.
    """

    if not KPI_MONTH_FOLDER.exists():
        raise FileNotFoundError(
            f"Không tồn tại folder: {KPI_MONTH_FOLDER}"
        )

    supported_extensions = {
        ".xlsx",
        ".xlsm",
        ".xlsb",
        ".xls",
    }

    month_files = []

    for file_path in KPI_MONTH_FOLDER.iterdir():
        if not file_path.is_file():
            continue

        # Bỏ qua file tạm của Excel
        if file_path.name.startswith("~$"):
            continue

        if file_path.suffix.lower() not in supported_extensions:
            continue

        month_year = extract_month_year_from_filename(
            file_path
        )

        if month_year is None:
            print(
                "Bỏ qua file không đúng định dạng tên: "
                f"{file_path.name}"
            )
            continue

        year, month = month_year

        source_sheet = (
            f"{SOURCE_SHEET_PREFIX}{month:02d}.{year}"
        )

        month_files.append(
            {
                "file_path": file_path,
                "year": year,
                "month": month,
                "source_sheet": source_sheet,
                "month_date": datetime(
                    year,
                    month,
                    1,
                ),
            }
        )

    month_files.sort(
        key=lambda item: (
            item["year"],
            item["month"],
            item["file_path"].name.lower(),
        )
    )

    return month_files


# ============================================================
# 7. CÁC HÀM HỖ TRỢ EXCEL COM
# ============================================================

def worksheet_exists(workbook, worksheet_name):
    """
    Kiểm tra sheet có tồn tại trong workbook hay không.
    """

    try:
        workbook.Worksheets(worksheet_name)
        return True

    except Exception:
        return False


def close_workbook_safely(
    workbook,
    save_changes=False,
):
    """
    Đóng workbook an toàn.
    """

    if workbook is None:
        return

    try:
        workbook.Close(
            SaveChanges=save_changes
        )

    except Exception:
        pass


# ============================================================
# 8. XỬ LÝ MỘT FILE EXCEL THÁNG
# ============================================================

def process_excel_month(
    excel_app,
    source_file,
    extract_file,
    source_sheet_name,
    month_date,
):
    """
    Xử lý một file tháng:

    1. Mở file tháng ở chế độ chỉ đọc.
    2. Đọc BCSX TMM.YYYY!D5:R25 vào bộ nhớ.
    3. Đóng file tháng mà không lưu.
    4. Mở file Trích xuất sản xuất.
    5. Ghi dữ liệu vào Tổng hợp SX!D3:R23.
    6. Giữ nguyên công thức của sheet Trích xuất.
    7. Điền ThoiGian bằng ngày đầu tháng.
    8. Tính lại công thức.
    9. Đọc dữ liệu sheet Trích xuất vào DataFrame.
    """

    source_workbook = None
    extract_workbook = None

    try:
        # ----------------------------------------------------
        # 1. MỞ FILE THÁNG Ở CHẾ ĐỘ CHỈ ĐỌC
        # ----------------------------------------------------

        source_workbook = excel_app.Workbooks.Open(
            str(source_file.resolve()),
            UpdateLinks=0,
            ReadOnly=True,
            IgnoreReadOnlyRecommended=True,
            AddToMru=False,
        )

        if not worksheet_exists(
            source_workbook,
            source_sheet_name,
        ):
            available_sheets = [
                source_workbook.Worksheets(i).Name
                for i in range(
                    1,
                    source_workbook.Worksheets.Count + 1,
                )
            ]

            raise ValueError(
                f"Không tìm thấy sheet '{source_sheet_name}' "
                f"trong file '{source_file.name}'.\n"
                f"Các sheet hiện có: {available_sheets}"
            )

        source_sheet = source_workbook.Worksheets(
            source_sheet_name
        )

        # Chỉ lấy giá trị, không copy format hoặc công thức
        source_values = source_sheet.Range(
            SOURCE_RANGE
        ).Value

        if source_values is None:
            raise ValueError(
                f"Vùng {source_sheet_name}!{SOURCE_RANGE} "
                "không có dữ liệu."
            )

        # Đóng file nguồn ngay sau khi đã đọc vào bộ nhớ
        close_workbook_safely(
            source_workbook,
            save_changes=False,
        )

        source_workbook = None

        # ----------------------------------------------------
        # 2. MỞ FILE TRÍCH XUẤT SẢN XUẤT
        # ----------------------------------------------------

        extract_workbook = excel_app.Workbooks.Open(
            str(extract_file.resolve()),
            UpdateLinks=0,
            ReadOnly=False,
            IgnoreReadOnlyRecommended=True,
            AddToMru=False,
        )

        if not worksheet_exists(
            extract_workbook,
            DESTINATION_SHEET,
        ):
            raise ValueError(
                f"Không tìm thấy sheet '{DESTINATION_SHEET}' "
                f"trong file '{extract_file.name}'."
            )

        if not worksheet_exists(
            extract_workbook,
            OUTPUT_SHEET,
        ):
            raise ValueError(
                f"Không tìm thấy sheet '{OUTPUT_SHEET}' "
                f"trong file '{extract_file.name}'."
            )

        destination_sheet = extract_workbook.Worksheets(
            DESTINATION_SHEET
        )

        output_sheet = extract_workbook.Worksheets(
            OUTPUT_SHEET
        )

        # ----------------------------------------------------
        # 3. GHI GIÁ TRỊ VÀO SHEET TỔNG HỢP SX
        # ----------------------------------------------------

        destination_sheet.Range(
            DESTINATION_RANGE
        ).Value = source_values

        # ----------------------------------------------------
        # 4. ĐỌC HEADER SHEET TRÍCH XUẤT
        # ----------------------------------------------------

        last_column = output_sheet.Cells(
            1,
            output_sheet.Columns.Count,
        ).End(-4159).Column
        # -4159 = xlToLeft

        header_values = output_sheet.Range(
            output_sheet.Cells(1, 1),
            output_sheet.Cells(1, last_column),
        ).Value

        headers = []

        if header_values:
            for value in header_values[0]:
                if value is None:
                    headers.append("")
                else:
                    headers.append(
                        str(value).strip()
                    )

        if "ThoiGian" not in headers:
            raise ValueError(
                "Không tìm thấy cột 'ThoiGian' trong "
                f"sheet '{OUTPUT_SHEET}'.\n"
                f"Các cột hiện có: {headers}"
            )

        if "Factory_Code" not in headers:
            raise ValueError(
                "Không tìm thấy cột 'Factory_Code' trong "
                f"sheet '{OUTPUT_SHEET}'.\n"
                f"Các cột hiện có: {headers}"
            )

        time_column_index = (
            headers.index("ThoiGian") + 1
        )

        # ----------------------------------------------------
        # 5. XÁC ĐỊNH DÒNG CUỐI CÙNG
        # ----------------------------------------------------

        last_row = output_sheet.Cells(
            output_sheet.Rows.Count,
            1,
        ).End(-4162).Row
        # -4162 = xlUp

        if last_row < 2:
            raise ValueError(
                f"Sheet '{OUTPUT_SHEET}' không có dữ liệu."
            )

        # ----------------------------------------------------
        # 6. ĐIỀN NGÀY ĐẦU THÁNG VÀO CỘT THOIGIAN
        # ----------------------------------------------------

        time_range = output_sheet.Range(
            output_sheet.Cells(
                2,
                time_column_index,
            ),
            output_sheet.Cells(
                last_row,
                time_column_index,
            ),
        )

        time_range.Value = month_date

        time_range.NumberFormat = (
            "yyyy-mm-dd hh:mm:ss.000"
        )

        # ----------------------------------------------------
        # 7. TÍNH LẠI CÔNG THỨC
        # ----------------------------------------------------

        destination_sheet.Calculate()
        output_sheet.Calculate()

        try:
            excel_app.CalculateFullRebuild()

        except Exception:
            try:
                excel_app.CalculateFull()

            except Exception:
                excel_app.Calculate()

        # Chờ Excel cập nhật kết quả công thức
        time.sleep(1)

        # ----------------------------------------------------
        # 8. ĐỌC SHEET TRÍCH XUẤT VÀO BỘ NHỚ
        # ----------------------------------------------------

        output_values = output_sheet.Range(
            output_sheet.Cells(1, 1),
            output_sheet.Cells(
                last_row,
                last_column,
            ),
        ).Value

        if output_values is None:
            raise ValueError(
                f"Không đọc được dữ liệu từ sheet "
                f"'{OUTPUT_SHEET}'."
            )

        output_matrix = []

        for row in output_values:
            output_matrix.append(
                list(row)
            )

        if len(output_matrix) < 2:
            raise ValueError(
                f"Sheet '{OUTPUT_SHEET}' không có dữ liệu."
            )

        dataframe_headers = [
            str(value).strip()
            if value is not None
            else ""
            for value in output_matrix[0]
        ]

        dataframe_rows = output_matrix[1:]

        df = pd.DataFrame(
            dataframe_rows,
            columns=dataframe_headers,
        )

        # Lưu dữ liệu tháng vừa xử lý vào file trích xuất
        extract_workbook.Save()

        close_workbook_safely(
            extract_workbook,
            save_changes=False,
        )

        extract_workbook = None

        return df

    except Exception:
        close_workbook_safely(
            source_workbook,
            save_changes=False,
        )

        close_workbook_safely(
            extract_workbook,
            save_changes=False,
        )

        raise


# ============================================================
# 9. CHUYỂN ĐỔI CỘT SỐ
# ============================================================

def clean_numeric_value(value):
    """
    Chuyển một giá trị sang kiểu số.

    Hỗ trợ:
    - int
    - float
    - chuỗi có dấu phẩy phân cách hàng nghìn
    - chuỗi có khoảng trắng
    - ô rỗng
    - lỗi công thức Excel
    """

    if value is None:
        return None

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, (int, float)):
        return value

    value_string = str(value).strip()

    invalid_values = {
        "",
        "None",
        "nan",
        "NaN",
        "#N/A",
        "#VALUE!",
        "#REF!",
        "#DIV/0!",
        "#NAME?",
        "#NUM!",
        "#NULL!",
    }

    if value_string in invalid_values:
        return None

    # Xóa khoảng trắng không ngắt
    value_string = value_string.replace(
        "\xa0",
        "",
    )

    # Xóa khoảng trắng
    value_string = value_string.replace(
        " ",
        "",
    )

    # Trường hợp âm được thể hiện bằng ngoặc: (1,000)
    is_negative = (
        value_string.startswith("(")
        and value_string.endswith(")")
    )

    if is_negative:
        value_string = value_string[1:-1]

    # Xóa dấu phân cách hàng nghìn
    value_string = value_string.replace(
        ",",
        "",
    )

    try:
        numeric_value = float(value_string)

        if is_negative:
            numeric_value = -numeric_value

        return numeric_value

    except ValueError:
        return None


def clean_numeric_series(series):
    """
    Chuyển toàn bộ Series thành kiểu số.
    """

    cleaned_series = series.apply(
        clean_numeric_value
    )

    return pd.to_numeric(
        cleaned_series,
        errors="coerce",
    )


# ============================================================
# 10. LÀM SẠCH CỘT CHUỖI
# ============================================================

def clean_text_value(value):
    """
    Làm sạch dữ liệu chuỗi.
    """

    if value is None:
        return None

    text_value = str(value).strip()

    if text_value in {
        "",
        "None",
        "nan",
        "NaN",
    }:
        return None

    return text_value


# ============================================================
# 11. CHUẨN BỊ DATAFRAME TRƯỚC KHI UPLOAD
# ============================================================

def prepare_dataframe_for_sql(
    df,
    month_date,
):
    """
    Kiểm tra cột, mapping tên cột và chuẩn hóa dữ liệu
    trước khi upload SQL Server.
    """

    df = df.copy()

    # Làm sạch tên cột
    df.columns = [
        str(column).strip()
        for column in df.columns
    ]

    # Kiểm tra cột bắt buộc
    missing_columns = [
        column
        for column in EXCEL_REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            "Thiếu các cột bắt buộc trong sheet "
            f"'{OUTPUT_SHEET}': {missing_columns}"
        )

    # Chỉ lấy các cột cần upload
    df = df[
        EXCEL_REQUIRED_COLUMNS
    ].copy()

    # Mapping tên cột Excel sang tên cột SQL Server
    df.rename(
        columns=COLUMN_MAPPING,
        inplace=True,
    )

    # Làm sạch cột chuỗi
    for column in TEXT_COLUMNS:
        df[column] = df[column].apply(
            clean_text_value
        )

    # Chuyển các cột số
    for column in NUMERIC_COLUMNS:
        df[column] = clean_numeric_series(
            df[column]
        )

    # Luôn gán lại ngày đầu tháng theo tên file
    df["Date"] = pd.Timestamp(
        month_date.date()
    )

    # Gán ngày giờ chạy ETL
    etl_datetime = datetime.now()

    df["ETL_DATE"] = etl_datetime

    # Xóa những dòng không có mã nhóm và tên sản phẩm
    df = df[
        ~(
            df["CategoryName"].isna()
            & df["ProductName"].isna()
        )
    ].copy()

    # Xóa những dòng không có nhà máy
    df = df[
        df["FactoryCode"].notna()
    ].copy()

    # Xóa các dòng hoàn toàn không có dữ liệu sản lượng
    df = df[
        ~(
            df["ProductQuantity"].isna()
            & df["PurchaseQuantity"].isna()
            & df["ProductQuantityDVC"].isna()
            & df["ProductValue"].isna()
        )
    ].copy()

    # Các ô số trống chuyển thành 0
    df[NUMERIC_COLUMNS] = (
        df[NUMERIC_COLUMNS]
        .fillna(0)
    )

    # Sắp xếp đúng thứ tự cột SQL Server
    df = df[SQL_COLUMNS]

    df.reset_index(
        drop=True,
        inplace=True,
    )

    return df


# ============================================================
# 12. DELETE - INSERT SQL SERVER
# ============================================================

def delete_insert_sql(
    engine,
    df,
    month_date,
):
    """
    Xóa dữ liệu cũ theo ngày đầu tháng và insert dữ liệu mới.

    DELETE và INSERT được thực hiện trong cùng một transaction.

    Nếu INSERT bị lỗi, thao tác DELETE cũng sẽ được rollback.
    """

    full_table_name = (
        f"[{SCHEMA}].[{TABLE_NAME}]"
    )

    delete_query = text(
        f"""
        DELETE FROM {full_table_name}
        WHERE CAST([Date] AS DATE) = :month_date;
        """
    )

    sql_dtype = {
        "CategoryName": NVARCHAR(length=255),
        "ProductName": NVARCHAR(length=510),

        "ProductQuantity": DECIMAL(
            precision=38,
            scale=8,
        ),

        "PurchaseQuantity": DECIMAL(
            precision=38,
            scale=8,
        ),

        "ProductQuantityDVC": DECIMAL(
            precision=38,
            scale=8,
        ),

        "ProductValue": DECIMAL(
            precision=38,
            scale=4,
        ),

        "Date": DATE(),

        "FactoryCode": NVARCHAR(length=100),

        "ETL_DATE": DATETIME(),
    }

    with engine.begin() as connection:
        delete_result = connection.execute(
            delete_query,
            {
                "month_date": month_date.date(),
            },
        )

        deleted_rows = delete_result.rowcount

        df.to_sql(
            name=TABLE_NAME,
            con=connection,
            schema=SCHEMA,
            if_exists="append",
            index=False,
            chunksize=CHUNK_SIZE,
            dtype=sql_dtype,
        )

    return deleted_rows, len(df)


# ============================================================
# 13. XỬ LÝ TOÀN BỘ FILE THÁNG
# ============================================================

def process_all_files():
    """
    Xử lý tuần tự từng file tháng.

    Mỗi lần chỉ mở và xử lý một file trong folder KPI_Month.
    Xử lý xong file hiện tại mới chuyển sang file tiếp theo.
    """

    print("=" * 80)
    print("BẮT ĐẦU ETL FACT ACTUAL PRODUCTION")
    print("=" * 80)

    extract_file = find_extract_file()

    print(
        f"File trích xuất: {extract_file}"
    )

    month_files = get_month_files()

    if not month_files:
        raise RuntimeError(
            "Không tìm thấy file tháng hợp lệ trong folder: "
            f"{KPI_MONTH_FOLDER}"
        )

    print(
        f"\nTìm thấy {len(month_files)} file tháng:"
    )

    for index, item in enumerate(
        month_files,
        start=1,
    ):
        print(
            f"{index:02d}. "
            f"{item['file_path'].name} "
            f"-> {item['source_sheet']} "
            f"-> {item['month_date']:%Y-%m-%d}"
        )

    print("=" * 80)

    engine = create_sql_engine()

    excel_app = None

    success_count = 0
    failed_files = []

    pythoncom.CoInitialize()

    try:
        excel_app = win32.DispatchEx(
            "Excel.Application"
        )

        excel_app.Visible = False
        excel_app.DisplayAlerts = False
        excel_app.ScreenUpdating = False
        excel_app.EnableEvents = False
        excel_app.AskToUpdateLinks = False

        for index, item in enumerate(
            month_files,
            start=1,
        ):
            source_file = item["file_path"]
            source_sheet = item["source_sheet"]
            month_date = item["month_date"]

            print()
            print("-" * 80)

            print(
                f"ĐANG XỬ LÝ FILE "
                f"{index}/{len(month_files)}"
            )

            print(
                f"File         : {source_file.name}"
            )

            print(
                f"Sheet        : {source_sheet}"
            )

            print(
                "Thời gian    : "
                f"{month_date:%Y-%m-%d 00:00:00.000}"
            )

            print("-" * 80)

            try:
                # Đọc và biến đổi dữ liệu Excel
                raw_df = process_excel_month(
                    excel_app=excel_app,
                    source_file=source_file,
                    extract_file=extract_file,
                    source_sheet_name=source_sheet,
                    month_date=month_date,
                )

                # Mapping và làm sạch dữ liệu
                sql_df = prepare_dataframe_for_sql(
                    df=raw_df,
                    month_date=month_date,
                )

                if sql_df.empty:
                    raise ValueError(
                        "Không có dữ liệu hợp lệ để "
                        "upload SQL Server."
                    )

                print(
                    f"Số dòng chuẩn bị upload: "
                    f"{len(sql_df)}"
                )

                print(
                    "Danh sách nhà máy: "
                    f"{sorted(sql_df['FactoryCode'].dropna().unique())}"
                )

                # Delete dữ liệu cũ và insert dữ liệu mới
                deleted_rows, inserted_rows = (
                    delete_insert_sql(
                        engine=engine,
                        df=sql_df,
                        month_date=month_date,
                    )
                )

                success_count += 1

                print(
                    "Xử lý thành công file: "
                    f"{source_file.name}"
                )

                print(
                    f"Số dòng đã xóa SQL: "
                    f"{deleted_rows}"
                )

                print(
                    f"Số dòng đã insert  : "
                    f"{inserted_rows}"
                )

            except Exception as error:
                failed_files.append(
                    {
                        "file": source_file.name,
                        "error": str(error),
                    }
                )

                print(
                    "LỖI KHI XỬ LÝ FILE: "
                    f"{source_file.name}"
                )

                print(
                    f"Chi tiết lỗi: {error}"
                )

                # Không dừng toàn bộ chương trình.
                # Tiếp tục xử lý file tiếp theo.
                continue

    finally:
        if excel_app is not None:
            try:
                excel_app.EnableEvents = True
            except Exception:
                pass

            try:
                excel_app.ScreenUpdating = True
            except Exception:
                pass

            try:
                excel_app.DisplayAlerts = True
            except Exception:
                pass

            try:
                excel_app.Quit()
            except Exception:
                pass

        try:
            engine.dispose()
        except Exception:
            pass

        pythoncom.CoUninitialize()

    print()
    print("=" * 80)
    print("KẾT QUẢ ETL")
    print("=" * 80)

    print(
        f"Tổng số file     : {len(month_files)}"
    )

    print(
        f"Thành công       : {success_count}"
    )

    print(
        f"Thất bại         : {len(failed_files)}"
    )

    if failed_files:
        print("\nDanh sách file lỗi:")

        for index, failed_item in enumerate(
            failed_files,
            start=1,
        ):
            print(
                f"{index:02d}. "
                f"{failed_item['file']}"
            )

            print(
                f"    {failed_item['error']}"
            )

        raise RuntimeError(
            "ETL hoàn thành nhưng có "
            f"{len(failed_files)} file bị lỗi."
        )

    print()
    print("ETL HOÀN THÀNH THÀNH CÔNG")
    print("=" * 80)


# ============================================================
# 14. MAIN
# ============================================================

def main():
    try:
        process_all_files()

    except KeyboardInterrupt:
        print(
            "\nNgười dùng đã dừng chương trình."
        )

        sys.exit(1)

    except Exception as error:
        print()
        print("=" * 80)
        print("ETL THẤT BẠI")
        print(
            f"Chi tiết lỗi: {error}"
        )
        print("=" * 80)

        sys.exit(1)


if __name__ == "__main__":
    main()