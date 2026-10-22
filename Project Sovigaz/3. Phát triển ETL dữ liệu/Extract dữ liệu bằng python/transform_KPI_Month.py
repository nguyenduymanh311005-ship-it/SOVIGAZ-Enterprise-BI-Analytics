import re
import sys
import urllib
from datetime import datetime
from pathlib import Path

import pandas as pd
import pythoncom
import win32com.client as win32
from sqlalchemy import create_engine, text
from sqlalchemy.dialects.mssql import DATETIME, FLOAT, NVARCHAR


# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN
# ============================================================

BASE_FOLDER = Path(r"D:\Phase 2\KPI")

# Thư mục chứa các file KPI theo tháng
KPI_MONTH_FOLDER = BASE_FOLDER / "KPI_Month"

# File trung gian chứa sheet A3 và KPI Tháng
EXTRACT_FILE = BASE_FOLDER / "File trích xuất A3.xlsx"

# File chứa sheet Fact KPI Month
FACT_FILE = BASE_FOLDER / "Fact KPI Month.xlsx"


# ============================================================
# 2. CẤU HÌNH SHEET VÀ VÙNG DỮ LIỆU
# ============================================================

# Vùng copy từ từng file KPI tháng
SOURCE_COPY_RANGE = "G7:I200"

# Vùng paste vào sheet A3 của file File trích xuất A3.xlsx
TARGET_PASTE_RANGE = "L7:N200"

# Sheet trong file File trích xuất A3
EXTRACT_A3_SHEET = "A3"
EXTRACT_KPI_SHEET = "KPI Tháng"

# Vùng lấy kết quả sau khi công thức được tính
KPI_OUTPUT_RANGE = "F2:J226"

# Sheet trong file Fact KPI Month
FACT_SHEET = "Fact KPI Month"

# Vùng ghi dữ liệu vào Fact KPI Month
FACT_OUTPUT_RANGE = "F2:J226"

# Vùng ghi cột Date
FACT_DATE_RANGE = "K2:K226"

# Vùng dữ liệu đọc để upload SQL
FACT_SQL_RANGE = "A1:K226"


# ============================================================
# 3. CẤU HÌNH SQL SERVER
# ============================================================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Fact_KPI_Month"

ODBC_DRIVER = "ODBC Driver 17 for SQL Server"

CHUNK_SIZE = 10000


# ============================================================
# 4. KHAI BÁO KIỂU DỮ LIỆU SQL
# ============================================================

SQL_DTYPES = {
    "StockCode": NVARCHAR(100),
    "InventoryCodePlan": NVARCHAR(255),
    "InventoryItemName": NVARCHAR(510),
    "InventoryItemGroup": NVARCHAR(255),

    # Các cột số được upload lên SQL Server dưới dạng FLOAT
    "ProductionValue": FLOAT(),
    "ProductUnit": FLOAT(),
    "ProductUnitDVC": FLOAT(),
    "QuantityDVT": FLOAT(),
    "QuantityDVC": FLOAT(),
    "Amount": FLOAT(),

    # Ngày đầu tháng, ví dụ: 2023-12-01 00:00:00.000
    "Date": DATETIME(),
}


# ============================================================
# 5. TẠO KẾT NỐI SQL SERVER
# ============================================================

def create_sql_engine():
    """
    Tạo SQLAlchemy Engine kết nối SQL Server
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
# 6. LẤY THÁNG VÀ NĂM TỪ TÊN FILE
# ============================================================

def extract_month_year(file_path: Path):
    """
    Lấy tháng, năm từ tên file.

    Chỉ cần tên file chứa định dạng:
        A3 T05.2026

    Các ký tự phía sau không quan trọng.

    Ví dụ hợp lệ:
        A3 T05.2026.xlsx
        A3 T05.2026_CHINHTHUC.xlsx
        A3 T05.2026 -CHINHTHUC_08062026.xlsx
        A3 T05.2026 abc.xlsx

    Kết quả:
        Sheet     : A3-05.2026
        Month date: 2026-05-01 00:00:00
    """

    file_name = file_path.stem

    match = re.search(
        r"\bA3\s*T(\d{1,2})[.\-_](\d{4})(?!\d)",
        file_name,
        flags=re.IGNORECASE,
    )

    if not match:
        raise ValueError(
            f"Không xác định được tháng và năm từ tên file: "
            f"{file_path.name}"
        )

    month_number = int(match.group(1))
    year_number = int(match.group(2))

    if month_number < 1 or month_number > 12:
        raise ValueError(
            f"Tháng không hợp lệ trong file "
            f"{file_path.name}: {month_number}"
        )

    month_text = f"{month_number:02d}"

    # Tên sheet nguồn
    source_sheet = f"A3-{month_text}.{year_number}"

    # Ngày đầu tiên của tháng
    month_date = datetime(
        year=year_number,
        month=month_number,
        day=1,
        hour=0,
        minute=0,
        second=0,
    )

    return (
        month_number,
        year_number,
        source_sheet,
        month_date,
    )


# ============================================================
# 7. LẤY DANH SÁCH FILE THÁNG
# ============================================================

def get_monthly_files():
    """
    Lấy tất cả file Excel trong folder KPI_Month
    và sắp xếp tăng dần theo năm, tháng.
    """

    if not KPI_MONTH_FOLDER.exists():
        raise FileNotFoundError(
            f"Không tồn tại thư mục: {KPI_MONTH_FOLDER}"
        )

    allowed_extensions = {
        ".xls",
        ".xlsx",
        ".xlsm",
        ".xlsb",
    }

    files = [
        file_path
        for file_path in KPI_MONTH_FOLDER.iterdir()
        if (
            file_path.is_file()
            and file_path.suffix.lower() in allowed_extensions
            and not file_path.name.startswith("~$")
        )
    ]

    valid_files = []

    for file_path in files:
        try:
            month_number, year_number, _, _ = extract_month_year(
                file_path
            )

            valid_files.append(
                (
                    year_number,
                    month_number,
                    file_path,
                )
            )

        except ValueError:
            print(
                f"Bỏ qua file không đúng định dạng tên: "
                f"{file_path.name}"
            )

    valid_files.sort(
        key=lambda item: (
            item[0],
            item[1],
            item[2].name,
        )
    )

    return [
        item[2]
        for item in valid_files
    ]


# ============================================================
# 8. KIỂM TRA FILE ĐẦU VÀO
# ============================================================

def validate_paths():
    """
    Kiểm tra folder và các file cần thiết trước khi chạy.
    """

    if not KPI_MONTH_FOLDER.exists():
        raise FileNotFoundError(
            f"Không tìm thấy thư mục: {KPI_MONTH_FOLDER}"
        )

    if not EXTRACT_FILE.exists():
        raise FileNotFoundError(
            f"Không tìm thấy file: {EXTRACT_FILE}"
        )

    if not FACT_FILE.exists():
        raise FileNotFoundError(
            f"Không tìm thấy file: {FACT_FILE}"
        )

    monthly_files = get_monthly_files()

    if not monthly_files:
        raise FileNotFoundError(
            f"Không tìm thấy file tháng hợp lệ trong folder: "
            f"{KPI_MONTH_FOLDER}"
        )

    return monthly_files


# ============================================================
# 9. TÍNH LẠI CÔNG THỨC EXCEL
# ============================================================

def calculate_excel(excel, workbook=None):
    """
    Tính lại công thức Excel.

    Không gán excel.Calculation vì một số phiên bản Excel
    sẽ báo lỗi:
        Unable to set the Calculation property.
    """

    try:
        excel.CalculateFullRebuild()

    except Exception:
        try:
            excel.CalculateFull()

        except Exception:
            try:
                if workbook is not None:
                    workbook.Calculate()
                else:
                    excel.Calculate()

            except Exception:
                pass

    # Đợi Excel tính toán hoàn thành
    while True:
        try:
            calculation_state = excel.CalculationState

            # 0 = xlDone
            if calculation_state == 0:
                break

        except Exception:
            break

        pythoncom.PumpWaitingMessages()


# ============================================================
# 10. LẤY WORKSHEET
# ============================================================

def get_worksheet(workbook, sheet_name: str):
    """
    Lấy worksheet theo tên.

    Nếu không tồn tại, hiển thị danh sách các sheet hiện có.
    """

    try:
        return workbook.Worksheets(sheet_name)

    except Exception as exc:
        available_sheets = [
            workbook.Worksheets(index).Name
            for index in range(
                1,
                workbook.Worksheets.Count + 1,
            )
        ]

        raise ValueError(
            f"Không tìm thấy sheet '{sheet_name}' "
            f"trong file '{workbook.Name}'. "
            f"Các sheet hiện có: {available_sheets}"
        ) from exc


# ============================================================
# 11. KIỂM TRA KÍCH THƯỚC RANGE
# ============================================================

def validate_range_size(
    source_range,
    target_range,
    source_range_name: str,
    target_range_name: str,
):
    """
    Kiểm tra vùng nguồn và vùng đích có cùng số dòng,
    số cột hay không.
    """

    source_rows = source_range.Rows.Count
    source_columns = source_range.Columns.Count

    target_rows = target_range.Rows.Count
    target_columns = target_range.Columns.Count

    if (
        source_rows != target_rows
        or source_columns != target_columns
    ):
        raise ValueError(
            f"Kích thước range không khớp. "
            f"Nguồn {source_range_name}: "
            f"{source_rows} dòng x {source_columns} cột; "
            f"Đích {target_range_name}: "
            f"{target_rows} dòng x {target_columns} cột."
        )


# ============================================================
# 12. CHUYỂN RANGE EXCEL THÀNH DATAFRAME
# ============================================================

def range_to_dataframe(excel_range):
    """
    Chuyển dữ liệu Excel COM Range thành pandas DataFrame.

    Dòng đầu tiên được sử dụng làm tên cột.
    """

    values = excel_range.Value

    if values is None:
        raise ValueError(
            "Vùng dữ liệu Excel không có dữ liệu."
        )

    # Trường hợp range có nhiều ô
    if isinstance(values, tuple):
        rows = [
            list(row)
            for row in values
        ]
    else:
        rows = [[values]]

    if len(rows) < 2:
        raise ValueError(
            "Vùng dữ liệu không có dòng chi tiết."
        )

    headers = []

    for index, value in enumerate(
        rows[0],
        start=1,
    ):
        if value is None or str(value).strip() == "":
            headers.append(
                f"Column_{index}"
            )
        else:
            headers.append(
                str(value).strip()
            )

    df = pd.DataFrame(
        rows[1:],
        columns=headers,
    )

    return df


# ============================================================
# 13. LÀM SẠCH DATAFRAME
# ============================================================

def clean_fact_dataframe(
    df: pd.DataFrame,
    month_date: datetime,
):
    """
    Làm sạch và chuẩn hóa dữ liệu trước khi upload SQL.
    """

    expected_columns = [
        "StockCode",
        "InventoryCodePlan",
        "InventoryItemName",
        "InventoryItemGroup",
        "ProductionValue",
        "ProductUnit",
        "ProductUnitDVC",
        "QuantityDVT",
        "QuantityDVC",
        "Amount",
        "Date",
    ]

    missing_columns = [
        column
        for column in expected_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            "File Fact KPI Month thiếu các cột: "
            + ", ".join(missing_columns)
        )

    df = df[expected_columns].copy()

    business_columns = [
        column
        for column in expected_columns
        if column != "Date"
    ]

    # Xóa dòng hoàn toàn trống
    df = df.dropna(
        how="all",
        subset=business_columns,
    ).copy()

    # Làm sạch các cột text
    text_columns = [
        "StockCode",
        "InventoryCodePlan",
        "InventoryItemName",
        "InventoryItemGroup",
    ]

    for column in text_columns:
        df[column] = df[column].apply(
            lambda value: (
                None
                if (
                    value is None
                    or pd.isna(value)
                    or str(value).strip() == ""
                )
                else str(value).strip()
            )
        )

    # Chuyển các cột số sang float
    numeric_columns = [
        "ProductionValue",
        "ProductUnit",
        "ProductUnitDVC",
        "QuantityDVT",
        "QuantityDVC",
        "Amount",
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce",
        ).astype(float)

    # Gán ngày đầu tháng cho tất cả bản ghi
    df["Date"] = pd.Timestamp(month_date)

    # Xóa dòng không có mã và không có tên sản phẩm
    df = df[
        ~(
            df["InventoryCodePlan"].isna()
            & df["InventoryItemName"].isna()
        )
    ].copy()

    df.reset_index(
        drop=True,
        inplace=True,
    )

    return df


# ============================================================
# 14. DELETE INSERT DỮ LIỆU SQL
# ============================================================

def delete_insert_to_sql(
    engine,
    df: pd.DataFrame,
    month_date: datetime,
):
    """
    Xóa dữ liệu cũ theo tháng và insert dữ liệu mới.

    DELETE và INSERT nằm trong cùng transaction.
    Nếu INSERT lỗi thì DELETE cũng rollback.

    Điều kiện:
        Date >= ngày đầu tháng
        Date < ngày đầu tháng tiếp theo
    """

    full_table_name = (
        f"[{SCHEMA}].[{TABLE_NAME}]"
    )

    next_month_date = (
        pd.Timestamp(month_date)
        + pd.DateOffset(months=1)
    ).to_pydatetime()

    delete_sql = text(
        f"""
        DELETE FROM {full_table_name}
        WHERE [Date] >= :month_start
          AND [Date] <  :next_month_start;
        """
    )

    with engine.begin() as connection:
        result = connection.execute(
            delete_sql,
            {
                "month_start": month_date,
                "next_month_start": next_month_date,
            },
        )

        deleted_rows = result.rowcount

        df.to_sql(
            name=TABLE_NAME,
            con=connection,
            schema=SCHEMA,
            if_exists="append",
            index=False,
            chunksize=CHUNK_SIZE,
            dtype=SQL_DTYPES,
        )

    print(
        f"  SQL: đã xóa {deleted_rows} dòng cũ, "
        f"insert {len(df)} dòng mới "
        f"cho tháng {month_date:%Y-%m}."
    )


# ============================================================
# 15. XỬ LÝ MỘT FILE THÁNG
# ============================================================

def process_one_month(
    excel,
    engine,
    source_file: Path,
):
    """
    Xử lý tuần tự một file tháng.
    """

    (
        _,
        _,
        source_sheet_name,
        month_date,
    ) = extract_month_year(source_file)

    print("=" * 80)
    print(
        f"Đang xử lý file : {source_file.name}"
    )
    print(
        f"Sheet nguồn     : {source_sheet_name}"
    )
    print(
        f"Ngày dữ liệu    : "
        f"{month_date:%Y-%m-%d %H:%M:%S}.000"
    )
    print(
        f"Vùng copy nguồn : {SOURCE_COPY_RANGE}"
    )
    print(
        f"Vùng paste đích : {TARGET_PASTE_RANGE}"
    )

    source_wb = None
    extract_wb = None
    fact_wb = None

    try:
        # ====================================================
        # 1. MỞ FILE A3 THÁNG
        # ====================================================

        source_wb = excel.Workbooks.Open(
            str(source_file.resolve()),
            UpdateLinks=0,
            ReadOnly=True,
            IgnoreReadOnlyRecommended=True,
        )

        source_ws = get_worksheet(
            source_wb,
            source_sheet_name,
        )

        source_range = source_ws.Range(
            SOURCE_COPY_RANGE
        )

        # Chỉ lấy giá trị từ G7:I200
        source_values = source_range.Value

        if source_values is None:
            raise ValueError(
                f"Không đọc được vùng "
                f"{SOURCE_COPY_RANGE} "
                f"của sheet "
                f"{source_sheet_name}."
            )

        # ====================================================
        # 2. GHI VÀO FILE TRÍCH XUẤT A3
        # ====================================================

        extract_wb = excel.Workbooks.Open(
            str(EXTRACT_FILE.resolve()),
            UpdateLinks=0,
            ReadOnly=False,
            IgnoreReadOnlyRecommended=True,
        )

        extract_a3_ws = get_worksheet(
            extract_wb,
            EXTRACT_A3_SHEET,
        )

        extract_kpi_ws = get_worksheet(
            extract_wb,
            EXTRACT_KPI_SHEET,
        )

        target_range = extract_a3_ws.Range(
            TARGET_PASTE_RANGE
        )

        # Kiểm tra kích thước G7:I200 và L7:N200
        validate_range_size(
            source_range=source_range,
            target_range=target_range,
            source_range_name=SOURCE_COPY_RANGE,
            target_range_name=TARGET_PASTE_RANGE,
        )

        # Paste giá trị vào L7:N200
        target_range.Value = source_values

        # Tính lại công thức sau khi paste dữ liệu
        calculate_excel(
            excel=excel,
            workbook=extract_wb,
        )

        extract_wb.Save()

        # ====================================================
        # 3. LẤY KẾT QUẢ KPI THÁNG
        # ====================================================

        kpi_output_range = extract_kpi_ws.Range(
            KPI_OUTPUT_RANGE
        )

        # Lấy giá trị kết quả, không lấy công thức
        kpi_values = kpi_output_range.Value

        if kpi_values is None:
            raise ValueError(
                f"Không đọc được vùng "
                f"{KPI_OUTPUT_RANGE} "
                f"của sheet "
                f"{EXTRACT_KPI_SHEET}."
            )

        # ====================================================
        # 4. GHI VÀO FILE FACT KPI MONTH
        # ====================================================

        fact_wb = excel.Workbooks.Open(
            str(FACT_FILE.resolve()),
            UpdateLinks=0,
            ReadOnly=False,
            IgnoreReadOnlyRecommended=True,
        )

        fact_ws = get_worksheet(
            fact_wb,
            FACT_SHEET,
        )

        fact_output_range = fact_ws.Range(
            FACT_OUTPUT_RANGE
        )

        # Kiểm tra kích thước vùng kết quả và vùng ghi Fact
        validate_range_size(
            source_range=kpi_output_range,
            target_range=fact_output_range,
            source_range_name=KPI_OUTPUT_RANGE,
            target_range_name=FACT_OUTPUT_RANGE,
        )

        # Ghi kết quả vào F2:J226
        fact_output_range.Value = kpi_values

        # Tự động tính số dòng của vùng F2:J226
        date_row_count = fact_output_range.Rows.Count

        date_values = tuple(
            (month_date,)
            for _ in range(date_row_count)
        )

        fact_date_range = fact_ws.Range(
            FACT_DATE_RANGE
        )

        if fact_date_range.Rows.Count != date_row_count:
            raise ValueError(
                f"Số dòng vùng Date {FACT_DATE_RANGE} "
                f"không bằng số dòng vùng dữ liệu "
                f"{FACT_OUTPUT_RANGE}."
            )

        # Ghi ngày đầu tháng vào K2:K226
        fact_date_range.Value = date_values

        # Định dạng hiển thị trong Excel
        fact_date_range.NumberFormat = (
            "yyyy-mm-dd hh:mm:ss.000"
        )

        # Tính lại công thức trong file Fact
        calculate_excel(
            excel=excel,
            workbook=fact_wb,
        )

        fact_wb.Save()

        # ====================================================
        # 5. ĐỌC DATAFRAME ĐỂ UPLOAD SQL
        # ====================================================

        fact_range = fact_ws.Range(
            FACT_SQL_RANGE
        )

        df_fact = range_to_dataframe(
            fact_range
        )

        df_fact = clean_fact_dataframe(
            df=df_fact,
            month_date=month_date,
        )

        print(
            f"  Số dòng chuẩn bị upload: "
            f"{len(df_fact)}"
        )

        if df_fact.empty:
            raise ValueError(
                f"Không có dữ liệu để upload "
                f"cho tháng {month_date:%Y-%m}."
            )

        # ====================================================
        # 6. DELETE INSERT SQL
        # ====================================================

        delete_insert_to_sql(
            engine=engine,
            df=df_fact,
            month_date=month_date,
        )

        print(
            f"Hoàn thành file "
            f"{source_file.name} "
            f"cho tháng {month_date:%Y-%m}."
        )

    finally:
        # Đóng file Fact
        if fact_wb is not None:
            try:
                fact_wb.Close(
                    SaveChanges=True
                )
            except Exception:
                pass

        # Đóng file trích xuất
        if extract_wb is not None:
            try:
                extract_wb.Close(
                    SaveChanges=True
                )
            except Exception:
                pass

        # Đóng file nguồn và không lưu thay đổi
        if source_wb is not None:
            try:
                source_wb.Close(
                    SaveChanges=False
                )
            except Exception:
                pass


# ============================================================
# 16. HÀM MAIN
# ============================================================

def main():
    monthly_files = validate_paths()

    print(
        f"Tìm thấy {len(monthly_files)} file tháng:"
    )

    for index, file_path in enumerate(
        monthly_files,
        start=1,
    ):
        (
            _,
            _,
            sheet_name,
            month_date,
        ) = extract_month_year(file_path)

        print(
            f"  {index:02d}. "
            f"{file_path.name} "
            f"-> {sheet_name} "
            f"-> {month_date:%Y-%m-%d}"
        )

    # Tạo kết nối SQL Server
    engine = create_sql_engine()

    try:
        # Kiểm tra kết nối SQL Server
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        print(
            "Kết nối SQL Server thành công."
        )

        excel = None

        pythoncom.CoInitialize()

        try:
            # Tạo một Excel Application riêng
            excel = win32.DispatchEx(
                "Excel.Application"
            )

            excel.Visible = False
            excel.DisplayAlerts = False
            excel.AskToUpdateLinks = False

            # Không sử dụng:
            #
            # excel.Calculation = -4105
            #
            # Vì một số phiên bản Excel có thể báo:
            # Unable to set the Calculation property

            success_count = 0
            failed_files = []

            # Xử lý lần lượt từng file
            for index, source_file in enumerate(
                monthly_files,
                start=1,
            ):
                print(
                    f"\nTiến độ: "
                    f"{index}/{len(monthly_files)}"
                )

                try:
                    process_one_month(
                        excel=excel,
                        engine=engine,
                        source_file=source_file,
                    )

                    success_count += 1

                except Exception as exc:
                    failed_files.append(
                        (
                            source_file.name,
                            str(exc),
                        )
                    )

                    print(
                        f"LỖI khi xử lý file "
                        f"{source_file.name}: "
                        f"{exc}"
                    )

                    # Tiếp tục xử lý file tiếp theo
                    continue

            # =================================================
            # KẾT QUẢ
            # =================================================

            print("\n" + "=" * 80)
            print("KẾT QUẢ XỬ LÝ")
            print(
                f"Thành công: "
                f"{success_count}/"
                f"{len(monthly_files)}"
            )
            print(
                f"Thất bại : "
                f"{len(failed_files)}"
            )

            if failed_files:
                print(
                    "\nDanh sách file lỗi:"
                )

                for (
                    file_name,
                    error_message,
                ) in failed_files:
                    print(
                        f"- {file_name}: "
                        f"{error_message}"
                    )

                sys.exit(1)

        finally:
            # Đóng Excel
            if excel is not None:
                try:
                    excel.DisplayAlerts = False
                    excel.Quit()
                except Exception:
                    pass

            pythoncom.CoUninitialize()

    finally:
        # Đóng SQLAlchemy Engine
        engine.dispose()


# ============================================================
# 17. CHẠY CHƯƠNG TRÌNH
# ============================================================

if __name__ == "__main__":
    try:
        main()

    except Exception as exc:
        print(
            "\nCHƯƠNG TRÌNH DỪNG DO LỖI:"
        )
        print(exc)

        sys.exit(1)