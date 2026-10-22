import re
import sys
from pathlib import Path
from datetime import datetime

import pyodbc
import pythoncom
import win32com.client


# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN
# ============================================================

SOURCE_FOLDER = Path(
    r"D:\Phase 2\KPI\KPI_Month"
)

# File này chỉ được mở để xử lý trong bộ nhớ.
# Script không lưu thay đổi vào file.
TEMPLATE_FILE = Path(
    r"D:\Phase 2\KPI\File trích xuất A3_Before_2026.xlsx"
)


# ============================================================
# 2. CẤU HÌNH SHEET VÀ VÙNG DỮ LIỆU
# ============================================================

TARGET_A3_SHEET = "A3"
KPI_MONTH_SHEET = "KPI Tháng"

# Vùng nguồn B7:D200
SOURCE_START_ROW = 7
SOURCE_END_ROW = 200
SOURCE_START_COL = 2       # B
SOURCE_END_COL = 4         # D

# Vùng đích L7:N200
TARGET_START_ROW = 7
TARGET_END_ROW = 200
TARGET_START_COL = 12      # L
TARGET_END_COL = 14        # N


# ============================================================
# 3. CẤU HÌNH SQL SERVER
# ============================================================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Fact_KPI_By_Product"

ODBC_DRIVER = "{ODBC Driver 17 for SQL Server}"


# ============================================================
# 4. MAPPING CỘT EXCEL -> SQL SERVER
# ============================================================

COLUMN_MAPPING = {
    "Mã chỉ tiêu": "RevenueCode",
    "Mã chi nhánh": "StockCode",
    "Mã sản phẩm": "CategoryName",
    "Tên sản phẩm": "ProductName",
    "Nhóm sản phẩm": "ProductCategoryName",
    "Sản xuất (Theo DVT)": "ProductQuantityDVT",
    "Sản xuất (Theo DVC)": "ProductQuantityDVC",
    "Tiêu thụ (Theo DVT)": "ProductQuantityDVT1",
    "Tiêu thụ (Theo DVC)": "SaleQuantityDVC",
    "Doanh thu": "Amount",
    "Year": "Year",
    "ETL_DATE": "ETL_DATE",
}

TEXT_COLUMNS = {
    "Mã chỉ tiêu",
    "Mã chi nhánh",
    "Mã sản phẩm",
    "Tên sản phẩm",
    "Nhóm sản phẩm",
}

NUMBER_COLUMNS = {
    "Sản xuất (Theo DVT)",
    "Sản xuất (Theo DVC)",
    "Tiêu thụ (Theo DVT)",
    "Tiêu thụ (Theo DVC)",
    "Doanh thu",
}


# ============================================================
# 5. HÀM GHI LOG
# ============================================================

def log(message):
    """
    In log an toàn khi chạy bằng PowerShell hoặc SQL Server Agent.
    """

    text = str(message)

    try:
        print(text, flush=True)
    except UnicodeEncodeError:
        safe_text = text.encode(
            "ascii",
            errors="replace",
        ).decode("ascii")

        print(safe_text, flush=True)


# ============================================================
# 6. ĐỌC THÁNG VÀ NĂM TỪ TÊN FILE
# ============================================================

def parse_month_year_from_filename(file_path):
    """
    Hỗ trợ các tên file:

    A3 T01.2026 -CHINHTHUC_24022026.xlsx
    A3 T05.2026_CHINHTHUC_08062026.xlsx
    A3 T06.2025 -CHINHTHUC_12072025.xlsx

    Trả về:
        month, year
    """

    pattern = re.compile(
        r"^A3\s*T\s*(\d{1,2})\s*\.\s*(\d{4})",
        flags=re.IGNORECASE,
    )

    match = pattern.search(file_path.stem)

    if match is None:
        return None

    month = int(match.group(1))
    year = int(match.group(2))

    if month < 1 or month > 12:
        return None

    return month, year


# ============================================================
# 7. TÌM MỘT FILE CHO MỖI NĂM
# ============================================================

def find_one_file_per_year():
    """
    Mỗi năm chỉ chọn một file.

    Quy tắc:
    1. Chọn file có tháng lớn nhất trong năm.
    2. Nếu có nhiều file cùng tháng thì chọn file có thời gian
       chỉnh sửa mới nhất.
    """

    if not SOURCE_FOLDER.exists():
        raise FileNotFoundError(
            f"Không tìm thấy folder nguồn: {SOURCE_FOLDER}"
        )

    valid_extensions = {
        ".xlsx",
        ".xlsm",
        ".xls",
    }

    files_by_year = {}

    for file_path in SOURCE_FOLDER.iterdir():
        if not file_path.is_file():
            continue

        # Bỏ qua file tạm của Excel.
        if file_path.name.startswith("~$"):
            continue

        if file_path.suffix.lower() not in valid_extensions:
            continue

        parsed_result = parse_month_year_from_filename(
            file_path
        )

        if parsed_result is None:
            log(
                f"Bỏ qua file không đúng định dạng: "
                f"{file_path.name}"
            )
            continue

        month, year = parsed_result

        file_info = {
            "path": file_path,
            "month": month,
            "year": year,
            "modified_time": file_path.stat().st_mtime,
        }

        files_by_year.setdefault(
            year,
            [],
        ).append(file_info)

    if not files_by_year:
        raise FileNotFoundError(
            f"Không tìm thấy file A3 hợp lệ trong: "
            f"{SOURCE_FOLDER}"
        )

    selected_files = []

    for year, file_list in files_by_year.items():
        selected_file = max(
            file_list,
            key=lambda item: (
                item["month"],
                item["modified_time"],
            ),
        )

        selected_files.append(selected_file)

    selected_files.sort(
        key=lambda item: item["year"]
    )

    return selected_files


# ============================================================
# 8. KIỂM TRA FILE MẪU
# ============================================================

def validate_template_file():
    if not TEMPLATE_FILE.exists():
        raise FileNotFoundError(
            f"Không tìm thấy file trích xuất: "
            f"{TEMPLATE_FILE}"
        )


# ============================================================
# 9. TÍNH LẠI CÔNG THỨC EXCEL
# ============================================================

def recalculate_excel(excel_app, workbook=None):
    """
    Tính lại công thức Excel theo nhiều phương án dự phòng.

    Không thay đổi thuộc tính Application.Calculation vì một số
    phiên bản Excel có thể báo lỗi.
    """

    errors = []

    try:
        excel_app.CalculateFullRebuild()
        return
    except Exception as error:
        errors.append(str(error))

    try:
        excel_app.CalculateFull()
        return
    except Exception as error:
        errors.append(str(error))

    try:
        excel_app.Calculate()
        return
    except Exception as error:
        errors.append(str(error))

    try:
        if workbook is not None:
            for worksheet in workbook.Worksheets:
                worksheet.Calculate()

            return
    except Exception as error:
        errors.append(str(error))

    raise RuntimeError(
        "Không thể tính lại công thức Excel. "
        + " | ".join(errors)
    )


# ============================================================
# 10. CHUẨN HÓA TÊN CỘT
# ============================================================

def normalize_header_name(value):
    """
    Chuẩn hóa tiêu đề để hạn chế lỗi do:
    - Dư dấu cách
    - Xuống dòng
    - Nhiều dấu cách liên tiếp
    """

    if value is None:
        return ""

    text = str(value)

    text = text.replace("\r", " ")
    text = text.replace("\n", " ")

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


# ============================================================
# 11. CHUẨN HÓA GIÁ TRỊ EXCEL
# ============================================================

def normalize_excel_value(value):
    if value is None:
        return None

    if isinstance(value, str):
        value = value.strip()

        if value == "":
            return None

    return value


def normalize_text(value):
    value = normalize_excel_value(value)

    if value is None:
        return None

    return str(value).strip()


def normalize_number(value):
    """
    Chuyển dữ liệu Excel về số.

    Hỗ trợ:
    - int
    - float
    - chuỗi có dấu phân cách hàng nghìn
    - chuỗi phần trăm
    """

    value = normalize_excel_value(value)

    if value is None:
        return None

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()

    if text == "":
        return None

    is_percentage = "%" in text

    text = text.replace("%", "")
    text = text.replace(" ", "")
    text = text.replace(",", "")

    try:
        number = float(text)

        if is_percentage:
            number = number / 100

        return number

    except (TypeError, ValueError):
        raise ValueError(
            f"Không thể chuyển giá trị '{value}' thành số."
        )


# ============================================================
# 12. ĐỌC TIÊU ĐỀ SHEET KPI THÁNG
# ============================================================

def get_header_positions(worksheet):
    """
    Đọc tiêu đề tại dòng số 1.

    Trả về:
    {
        "Mã chỉ tiêu": 1,
        "Mã chi nhánh": 2,
        ...
    }
    """

    used_range = worksheet.UsedRange

    first_used_col = used_range.Column

    last_used_col = (
        first_used_col
        + used_range.Columns.Count
        - 1
    )

    header_positions = {}

    for col_number in range(
        first_used_col,
        last_used_col + 1,
    ):
        header_value = worksheet.Cells(
            1,
            col_number,
        ).Value

        header_name = normalize_header_name(
            header_value
        )

        if header_name:
            header_positions[header_name] = col_number

    return header_positions


# ============================================================
# 13. KIỂM TRA CÁC CỘT BẮT BUỘC
# ============================================================

def validate_required_columns(header_positions):
    """
    Year và ETL_DATE không bắt buộc có sẵn trong file vì hai cột
    này được tạo trong dữ liệu Python, không cần ghi vào Excel.
    """

    required_columns = [
        column_name
        for column_name in COLUMN_MAPPING
        if column_name not in {
            "Year",
            "ETL_DATE",
        }
    ]

    missing_columns = [
        column_name
        for column_name in required_columns
        if column_name not in header_positions
    ]

    if missing_columns:
        available_columns = ", ".join(
            header_positions.keys()
        )

        raise ValueError(
            "Sheet KPI Tháng thiếu các cột: "
            + ", ".join(missing_columns)
            + ". Các cột hiện có: "
            + available_columns
        )


# ============================================================
# 14. XÁC ĐỊNH DÒNG DỮ LIỆU CUỐI
# ============================================================

def get_last_data_row(
    worksheet,
    key_column_number,
):
    """
    Xác định dòng cuối dựa trên cột Mã chỉ tiêu.
    """

    excel_up = -4162

    last_row = worksheet.Cells(
        worksheet.Rows.Count,
        key_column_number,
    ).End(excel_up).Row

    return max(last_row, 1)


# ============================================================
# 15. ĐỌC DỮ LIỆU KPI THÁNG VÀO BỘ NHỚ
# ============================================================

def extract_kpi_month_data(
    worksheet,
    header_positions,
    selected_year,
    etl_datetime,
):
    """
    Đọc dữ liệu từ sheet KPI Tháng.

    Year và ETL_DATE chỉ được thêm vào dictionary trong Python.
    Không thêm hai cột này vào file Excel.
    """

    key_column_number = header_positions[
        "Mã chỉ tiêu"
    ]

    last_row = get_last_data_row(
        worksheet=worksheet,
        key_column_number=key_column_number,
    )

    if last_row < 2:
        return []

    excel_source_columns = [
        column_name
        for column_name in COLUMN_MAPPING
        if column_name not in {
            "Year",
            "ETL_DATE",
        }
    ]

    result = []

    for row_number in range(
        2,
        last_row + 1,
    ):
        row_dict = {}

        for excel_column in excel_source_columns:
            column_number = header_positions[
                excel_column
            ]

            value = worksheet.Cells(
                row_number,
                column_number,
            ).Value

            if excel_column in TEXT_COLUMNS:
                value = normalize_text(value)

            elif excel_column in NUMBER_COLUMNS:
                value = normalize_number(value)

            else:
                value = normalize_excel_value(value)

            row_dict[excel_column] = value

        # Year và ETL_DATE chỉ tồn tại trong dữ liệu bộ nhớ.
        row_dict["Year"] = int(selected_year)
        row_dict["ETL_DATE"] = etl_datetime

        # Bỏ qua các dòng trống.
        if (
            row_dict["Mã chỉ tiêu"] is None
            and row_dict["Mã chi nhánh"] is None
            and row_dict["Mã sản phẩm"] is None
            and row_dict["Tên sản phẩm"] is None
        ):
            continue

        result.append(row_dict)

    return result


# ============================================================
# 16. XỬ LÝ MỘT FILE TRONG BỘ NHỚ
# ============================================================

def process_excel_file_in_memory(
    excel_app,
    source_file,
    month,
    year,
    etl_datetime,
):
    """
    Quy trình xử lý:

    1. Mở file nguồn ReadOnly.
    2. Mở file trích xuất ReadOnly.
    3. Ghi B7:D200 vào L7:N200 trong workbook đang mở.
    4. Tính lại công thức trong bộ nhớ.
    5. Đọc dữ liệu sheet KPI Tháng.
    6. Đóng cả hai file với SaveChanges=False.

    Không thay đổi file gốc.
    Không tạo file mới.
    """

    source_sheet_name = (
        f"A3-{month:02d}.{year}"
    )

    source_workbook = None
    template_workbook = None

    try:
        log(
            f"Đang xử lý trong bộ nhớ: "
            f"{source_file.name} "
            f"-> sheet {source_sheet_name}"
        )

        # ----------------------------------------------------
        # MỞ FILE NGUỒN CHỈ ĐỌC
        # ----------------------------------------------------

        source_workbook = excel_app.Workbooks.Open(
            Filename=str(source_file.resolve()),
            UpdateLinks=0,
            ReadOnly=True,
            IgnoreReadOnlyRecommended=True,
            AddToMru=False,
        )

        source_sheet_names = [
            worksheet.Name
            for worksheet in source_workbook.Worksheets
        ]

        if source_sheet_name not in source_sheet_names:
            raise ValueError(
                f"Không tìm thấy sheet "
                f"'{source_sheet_name}' trong file "
                f"'{source_file.name}'."
            )

        # ----------------------------------------------------
        # MỞ FILE TRÍCH XUẤT CHỈ ĐỌC
        # ----------------------------------------------------

        template_workbook = excel_app.Workbooks.Open(
            Filename=str(TEMPLATE_FILE.resolve()),
            UpdateLinks=0,
            ReadOnly=True,
            IgnoreReadOnlyRecommended=True,
            AddToMru=False,
        )

        template_sheet_names = [
            worksheet.Name
            for worksheet in template_workbook.Worksheets
        ]

        if TARGET_A3_SHEET not in template_sheet_names:
            raise ValueError(
                f"Không tìm thấy sheet "
                f"'{TARGET_A3_SHEET}' trong file "
                f"'{TEMPLATE_FILE.name}'."
            )

        if KPI_MONTH_SHEET not in template_sheet_names:
            raise ValueError(
                f"Không tìm thấy sheet "
                f"'{KPI_MONTH_SHEET}' trong file "
                f"'{TEMPLATE_FILE.name}'."
            )

        source_ws = source_workbook.Worksheets(
            source_sheet_name
        )

        target_a3_ws = template_workbook.Worksheets(
            TARGET_A3_SHEET
        )

        kpi_ws = template_workbook.Worksheets(
            KPI_MONTH_SHEET
        )

        # ----------------------------------------------------
        # ĐỌC DỮ LIỆU NGUỒN VÀO BIẾN TRONG BỘ NHỚ
        # ----------------------------------------------------

        source_range = source_ws.Range(
            source_ws.Cells(
                SOURCE_START_ROW,
                SOURCE_START_COL,
            ),
            source_ws.Cells(
                SOURCE_END_ROW,
                SOURCE_END_COL,
            ),
        )

        source_values = source_range.Value

        # ----------------------------------------------------
        # ĐƯA DỮ LIỆU VÀO WORKBOOK ĐANG MỞ TRONG BỘ NHỚ
        # ----------------------------------------------------

        target_range = target_a3_ws.Range(
            target_a3_ws.Cells(
                TARGET_START_ROW,
                TARGET_START_COL,
            ),
            target_a3_ws.Cells(
                TARGET_END_ROW,
                TARGET_END_COL,
            ),
        )

        # Xóa dữ liệu cũ trong bộ nhớ, không lưu vào file.
        target_range.ClearContents()

        # Ghi dữ liệu nguồn vào workbook đang mở.
        target_range.Value = source_values

        # ----------------------------------------------------
        # TÍNH LẠI CÔNG THỨC
        # ----------------------------------------------------

        recalculate_excel(
            excel_app=excel_app,
            workbook=template_workbook,
        )

        # ----------------------------------------------------
        # ĐỌC KẾT QUẢ KPI THÁNG
        # ----------------------------------------------------

        header_positions = get_header_positions(
            kpi_ws
        )

        validate_required_columns(
            header_positions
        )

        data = extract_kpi_month_data(
            worksheet=kpi_ws,
            header_positions=header_positions,
            selected_year=year,
            etl_datetime=etl_datetime,
        )

        log(
            f"Đã đọc {len(data):,} dòng "
            f"từ sheet '{KPI_MONTH_SHEET}' "
            f"cho năm {year}."
        )

        return data

    finally:
        # Tuyệt đối không lưu thay đổi.
        if template_workbook is not None:
            try:
                template_workbook.Close(
                    SaveChanges=False
                )
            except Exception:
                pass

        if source_workbook is not None:
            try:
                source_workbook.Close(
                    SaveChanges=False
                )
            except Exception:
                pass


# ============================================================
# 17. KẾT NỐI SQL SERVER
# ============================================================

def create_sql_connection():
    """
    Kết nối SQL Server bằng Windows Authentication.
    """

    connection_string = (
        f"DRIVER={ODBC_DRIVER};"
        f"SERVER={SERVER};"
        f"DATABASE={DATABASE};"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )

    connection = pyodbc.connect(
        connection_string,
        autocommit=False,
    )

    return connection


# ============================================================
# 18. DELETE INSERT DỮ LIỆU THEO YEAR
# ============================================================

def delete_insert_sql(
    connection,
    year,
    data,
):
    """
    Cơ chế delete-insert theo Year:

    1. Xóa dữ liệu cũ theo Year.
    2. Insert dữ liệu mới.
    3. Nếu insert lỗi thì rollback, dữ liệu cũ không bị mất.
    """

    full_table_name = (
        f"[{DATABASE}].[{SCHEMA}].[{TABLE_NAME}]"
    )

    cursor = connection.cursor()

    try:
        delete_sql = f"""
            DELETE FROM {full_table_name}
            WHERE [Year] = ?;
        """

        cursor.execute(
            delete_sql,
            int(year),
        )

        deleted_rows = cursor.rowcount

        if not data:
            connection.commit()

            log(
                f"Năm {year}: không có dữ liệu mới. "
                f"Đã xóa {deleted_rows:,} dòng dữ liệu cũ."
            )

            return

        excel_columns = list(
            COLUMN_MAPPING.keys()
        )

        sql_columns = [
            COLUMN_MAPPING[excel_column]
            for excel_column in excel_columns
        ]

        sql_column_text = ", ".join(
            f"[{column_name}]"
            for column_name in sql_columns
        )

        placeholders = ", ".join(
            "?"
            for _ in sql_columns
        )

        insert_sql = f"""
            INSERT INTO {full_table_name}
            (
                {sql_column_text}
            )
            VALUES
            (
                {placeholders}
            );
        """

        insert_values = [
            tuple(
                row[excel_column]
                for excel_column in excel_columns
            )
            for row in data
        ]

        # Có thể bật fast_executemany nếu bảng không có kiểu dữ liệu
        # gây lỗi với ODBC Driver 17.
        cursor.fast_executemany = True

        cursor.executemany(
            insert_sql,
            insert_values,
        )

        connection.commit()

        log(
            f"Năm {year}: "
            f"delete {deleted_rows:,} dòng, "
            f"insert {len(insert_values):,} dòng."
        )

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()


# ============================================================
# 19. CHƯƠNG TRÌNH CHÍNH
# ============================================================

def main():
    excel_app = None
    sql_connection = None
    com_initialized = False

    try:
        log("=" * 70)
        log("BẮT ĐẦU ETL FACT KPI BY PRODUCT")
        log("=" * 70)

        validate_template_file()

        selected_files = find_one_file_per_year()

        log(
            f"Tìm thấy {len(selected_files)} "
            f"năm cần xử lý:"
        )

        for index, file_info in enumerate(
            selected_files,
            start=1,
        ):
            log(
                f"{index:02d}. "
                f"{file_info['path'].name} "
                f"-> tháng "
                f"{file_info['month']:02d}/"
                f"{file_info['year']}"
            )

        etl_datetime = datetime.now()

        # ----------------------------------------------------
        # KHỞI TẠO EXCEL COM
        # ----------------------------------------------------

        pythoncom.CoInitialize()
        com_initialized = True

        excel_app = win32com.client.DispatchEx(
            "Excel.Application"
        )

        excel_app.Visible = False
        excel_app.DisplayAlerts = False
        excel_app.ScreenUpdating = False
        excel_app.EnableEvents = False

        # Không đặt excel_app.Calculation vì có thể gây lỗi:
        # Unable to set the Calculation property.

        # ----------------------------------------------------
        # KẾT NỐI SQL SERVER
        # ----------------------------------------------------

        sql_connection = create_sql_connection()

        total_inserted = 0

        # ----------------------------------------------------
        # XỬ LÝ TỪNG NĂM
        # ----------------------------------------------------

        for file_info in selected_files:
            source_file = file_info["path"]
            month = file_info["month"]
            year = file_info["year"]

            data = process_excel_file_in_memory(
                excel_app=excel_app,
                source_file=source_file,
                month=month,
                year=year,
                etl_datetime=etl_datetime,
            )

            delete_insert_sql(
                connection=sql_connection,
                year=year,
                data=data,
            )

            total_inserted += len(data)

        log("=" * 70)
        log("ETL HOÀN THÀNH THÀNH CÔNG")
        log(
            f"Tổng số dòng đã insert: "
            f"{total_inserted:,}"
        )
        log(
            "Không có file Excel nào bị thay đổi."
        )
        log(
            "Không tạo thêm file Excel mới."
        )
        log(
            f"ETL_DATE: "
            f"{etl_datetime:%d/%m/%Y %H:%M:%S}"
        )
        log("=" * 70)

    except Exception as error:
        log("=" * 70)
        log("ETL THẤT BẠI")
        log(
            f"Chi tiết lỗi: {error}"
        )
        log("=" * 70)

        if sql_connection is not None:
            try:
                sql_connection.rollback()
            except Exception:
                pass

        raise

    finally:
        # ----------------------------------------------------
        # ĐÓNG SQL CONNECTION
        # ----------------------------------------------------

        if sql_connection is not None:
            try:
                sql_connection.close()
            except Exception:
                pass

        # ----------------------------------------------------
        # ĐÓNG EXCEL
        # ----------------------------------------------------

        if excel_app is not None:
            try:
                excel_app.CutCopyMode = False
            except Exception:
                pass

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

        if com_initialized:
            try:
                pythoncom.CoUninitialize()
            except Exception:
                pass


# ============================================================
# 20. ĐIỂM BẮT ĐẦU CHẠY
# ============================================================

if __name__ == "__main__":
    try:
        main()
    except Exception:
        sys.exit(1)

