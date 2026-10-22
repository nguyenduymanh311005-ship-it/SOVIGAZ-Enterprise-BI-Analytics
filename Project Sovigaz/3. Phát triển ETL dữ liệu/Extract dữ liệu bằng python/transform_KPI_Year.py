import re
import sys
import shutil
import urllib
from datetime import datetime
from pathlib import Path

import pandas as pd
from openpyxl import load_workbook
from sqlalchemy import create_engine, text
from sqlalchemy.dialects.mssql import NVARCHAR, DECIMAL, INTEGER, DATETIME


# ============================================================
# 1. CẤU HÌNH ĐƯỜNG DẪN
# ============================================================

KPI_MONTH_FOLDER = Path(r"D:\Phase 2\KPI\KPI_Month")

TEMPLATE_FILE = Path(r"D:\Phase 2\KPI\File trích xuất A3.xlsx")

# File kết quả được tạo riêng để không làm hỏng file mẫu
OUTPUT_FOLDER = Path(r"D:\Phase 2\KPI\Output_KPI_Year")


# ============================================================
# 2. CẤU HÌNH SHEET VÀ VÙNG DỮ LIỆU
# ============================================================

SOURCE_RANGE = "B9:D17"
DESTINATION_RANGE = "L9:N17"

TEMPLATE_A3_SHEET = "A3"
KPI_YEAR_SHEET = "KPI Year"

# Mapping giữa đơn vị và dòng trong sheet A3
# Theo cấu trúc file mẫu:
# VP = dòng 9
# BD = dòng 10
# BH = dòng 11
# CT = dòng 12
# NT = dòng 13
# HP = dòng 14
# KH = dòng 15
# TK = dòng 17
ROW_MAPPING = [
    ("VP", 9),
    ("BD", 10),
    ("BH", 11),
    ("CT", 12),
    ("NT", 13),
    ("HP", 14),
    ("KH", 15),
    ("TK", 17),
]


# ============================================================
# 3. CẤU HÌNH SQL SERVER
# ============================================================

SERVER = r"MISASERVER\SQLENT2014"
DATABASE = "SOVIGAZ_2026_Dev"
SCHEMA = "dbo"
TABLE_NAME = "Fact_KPI_Year"

ODBC_DRIVER = "ODBC Driver 17 for SQL Server"

CHUNK_SIZE = 1000


# ============================================================
# 4. CÁC HÀM HỖ TRỢ
# ============================================================

def create_sql_engine():
    """
    Tạo kết nối tới SQL Server bằng Windows Authentication.
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
        fast_executemany=True
    )

    return engine


def extract_month_year(file_path: Path):
    """
    Lấy tháng và năm từ tên file.

    Ví dụ:
    A3 T06.2025 -CHINHTHUC_12072025.xlsx
    -> month = 6
    -> year = 2025
    """

    pattern = re.compile(
        r"A3\s*T(?P<month>0[1-9]|1[0-2])\.(?P<year>\d{4})",
        flags=re.IGNORECASE
    )

    match = pattern.search(file_path.stem)

    if not match:
        return None

    month = int(match.group("month"))
    year = int(match.group("year"))

    return month, year


def find_latest_file_each_year(folder_path: Path):
    """
    Quét toàn bộ file Excel trong folder.

    Mỗi năm chỉ giữ lại file có tháng lớn nhất.
    Nếu cùng năm, cùng tháng có nhiều file thì lấy file sửa đổi gần nhất.
    """

    if not folder_path.exists():
        raise FileNotFoundError(
            f"Không tìm thấy folder KPI tháng: {folder_path}"
        )

    selected_files = {}

    excel_files = list(folder_path.glob("*.xlsx")) + list(
        folder_path.glob("*.xlsm")
    )

    if not excel_files:
        raise FileNotFoundError(
            f"Không tìm thấy file Excel trong folder: {folder_path}"
        )

    for file_path in excel_files:

        # Bỏ qua file tạm do Excel tạo ra
        if file_path.name.startswith("~$"):
            continue

        result = extract_month_year(file_path)

        if result is None:
            print(
                f"Bỏ qua file không đúng định dạng tên: "
                f"{file_path.name}"
            )
            continue

        month, year = result
        modified_time = file_path.stat().st_mtime

        if year not in selected_files:
            selected_files[year] = {
                "file": file_path,
                "month": month,
                "modified_time": modified_time
            }
            continue

        current_selected = selected_files[year]

        # Ưu tiên file có tháng lớn hơn
        if month > current_selected["month"]:
            selected_files[year] = {
                "file": file_path,
                "month": month,
                "modified_time": modified_time
            }

        # Nếu cùng tháng thì lấy file được sửa gần nhất
        elif (
            month == current_selected["month"]
            and modified_time > current_selected["modified_time"]
        ):
            selected_files[year] = {
                "file": file_path,
                "month": month,
                "modified_time": modified_time
            }

    if not selected_files:
        raise ValueError(
            "Không tìm thấy file nào có tên đúng định dạng "
            "'A3 TMM.YYYY'."
        )

    # Sắp xếp theo năm tăng dần
    result = []

    for year in sorted(selected_files.keys()):
        item = selected_files[year]

        result.append(
            {
                "year": year,
                "month": item["month"],
                "file": item["file"]
            }
        )

    return result


def get_source_sheet_name(month: int, year: int):
    """
    Tạo tên sheet từ tháng và năm.

    Ví dụ:
    tháng 6 năm 2025 -> A3-06.2025
    """

    return f"A3-{month:02d}.{year}"


def read_source_values(source_file: Path, source_sheet_name: str):
    """
    Đọc dữ liệu từ B9:D17 của file tháng.

    data_only=True để lấy giá trị đã được Excel tính gần nhất,
    thay vì lấy chuỗi công thức.
    """

    workbook = load_workbook(
        filename=source_file,
        data_only=True,
        read_only=True
    )

    try:
        if source_sheet_name not in workbook.sheetnames:
            raise ValueError(
                f"Không tìm thấy sheet '{source_sheet_name}' "
                f"trong file '{source_file.name}'.\n"
                f"Danh sách sheet hiện có: {workbook.sheetnames}"
            )

        worksheet = workbook[source_sheet_name]

        values = []

        for row_number in range(9, 18):
            row_values = [
                worksheet.cell(row=row_number, column=column_number).value
                for column_number in range(2, 5)
            ]

            values.append(row_values)

        return values

    finally:
        workbook.close()


def convert_to_number(value):
    """
    Chuẩn hóa giá trị sang số.

    Xử lý các trường hợp:
    - None
    - chuỗi rỗng
    - số có dấu phẩy
    - dữ liệu đã là int hoặc float
    """

    if value is None:
        return 0.0

    if isinstance(value, bool):
        return float(value)

    if isinstance(value, (int, float)):
        return float(value)

    text_value = str(value).strip()

    if text_value == "":
        return 0.0

    # Loại bỏ khoảng trắng không ngắt dòng
    text_value = text_value.replace("\xa0", "")
    text_value = text_value.replace(" ", "")

    try:
        return float(text_value)
    except ValueError:
        pass

    # Trường hợp số dạng 1,234.56
    try:
        return float(text_value.replace(",", ""))
    except ValueError:
        pass

    # Trường hợp số dạng Việt Nam 1.234,56
    try:
        vietnamese_number = (
            text_value
            .replace(".", "")
            .replace(",", ".")
        )

        return float(vietnamese_number)

    except ValueError:
        raise ValueError(
            f"Không thể chuyển giá trị '{value}' sang kiểu số."
        )


def copy_values_to_template(
    template_file: Path,
    output_file: Path,
    source_values: list,
    year: int
):
    """
    Copy B9:D17 của file nguồn sang L9:N17 sheet A3.

    Đồng thời điền Year và ETL_DATE trong sheet KPI Year.
    Không ghi đè các công thức Production và Amount.
    """

    if not template_file.exists():
        raise FileNotFoundError(
            f"Không tìm thấy file trích xuất A3: {template_file}"
        )

    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Copy file mẫu thành file kết quả
    shutil.copy2(template_file, output_file)

    keep_vba = template_file.suffix.lower() == ".xlsm"

    workbook = load_workbook(
        filename=output_file,
        data_only=False,
        keep_vba=keep_vba
    )

    try:
        if TEMPLATE_A3_SHEET not in workbook.sheetnames:
            raise ValueError(
                f"Không tìm thấy sheet '{TEMPLATE_A3_SHEET}' "
                f"trong file mẫu."
            )

        if KPI_YEAR_SHEET not in workbook.sheetnames:
            raise ValueError(
                f"Không tìm thấy sheet '{KPI_YEAR_SHEET}' "
                f"trong file mẫu."
            )

        ws_a3 = workbook[TEMPLATE_A3_SHEET]
        ws_kpi_year = workbook[KPI_YEAR_SHEET]

        # ----------------------------------------------------
        # Copy B9:D17 nguồn sang L9:N17 đích
        # ----------------------------------------------------

        for row_offset, row_values in enumerate(source_values):
            destination_row = 9 + row_offset

            for column_offset, value in enumerate(row_values):
                destination_column = 12 + column_offset

                ws_a3.cell(
                    row=destination_row,
                    column=destination_column
                ).value = value

        # ----------------------------------------------------
        # Bảo đảm header sheet KPI Year
        # ----------------------------------------------------

        expected_headers = [
            "Parent_Stock",
            "Production",
            "Amount",
            "Year",
            "ETL_DATE"
        ]

        for column_number, header in enumerate(
            expected_headers,
            start=1
        ):
            ws_kpi_year.cell(
                row=1,
                column=column_number
            ).value = header

        run_time = datetime.now()

        # ----------------------------------------------------
        # Điền Year và ETL_DATE
        # Không sửa công thức tại cột Production và Amount
        # ----------------------------------------------------

        for row_number in range(2, 10):
            ws_kpi_year.cell(
                row=row_number,
                column=4
            ).value = year

            ws_kpi_year.cell(
                row=row_number,
                column=5
            ).value = run_time

            ws_kpi_year.cell(
                row=row_number,
                column=5
            ).number_format = "dd/mm/yyyy hh:mm:ss"

        # Yêu cầu Excel tính lại toàn bộ công thức khi mở file
        try:
            workbook.calculation.fullCalcOnLoad = True
            workbook.calculation.forceFullCalc = True
            workbook.calculation.calcMode = "auto"
        except AttributeError:
            pass

        workbook.save(output_file)

    finally:
        workbook.close()


def create_kpi_year_dataframe(
    source_values: list,
    year: int,
    etl_date: datetime
):
    """
    Tạo dữ liệu upload SQL trực tiếp từ vùng đã copy sang A3!L9:N17.

    Do openpyxl không tự tính công thức Excel nên dữ liệu upload
    được tính trực tiếp theo quy tắc của sheet KPI Year:

    Production = giá trị cột B nguồn * 1000
    Amount     = giá trị cột D nguồn * 1000

    Dòng Tràng Kênh lấy từ dòng 17.
    """

    dataframe_rows = []

    for parent_stock, source_row_number in ROW_MAPPING:

        source_index = source_row_number - 9
        source_row = source_values[source_index]

        production_source = source_row[0]  # Cột B
        amount_source = source_row[2]      # Cột D

        production = convert_to_number(production_source) * 1000
        amount = convert_to_number(amount_source) * 1000

        dataframe_rows.append(
            {
                "Parent_Stock": parent_stock,
                "Production": production,
                "Amount": amount,
                "Year": year,
                "ETL_DATE": etl_date
            }
        )

    dataframe = pd.DataFrame(dataframe_rows)

    return dataframe


def delete_insert_sql(engine, dataframe: pd.DataFrame, year: int):
    """
    Delete dữ liệu theo Year, sau đó insert dữ liệu mới.
    """

    full_table_name = f"[{SCHEMA}].[{TABLE_NAME}]"

    delete_query = text(
        f"""
        DELETE FROM {full_table_name}
        WHERE [Year] = :year_value;
        """
    )

    with engine.begin() as connection:

        delete_result = connection.execute(
            delete_query,
            {"year_value": int(year)}
        )

        print(
            f"Đã xóa dữ liệu năm {year}: "
            f"{delete_result.rowcount} dòng."
        )

        dataframe.to_sql(
            name=TABLE_NAME,
            con=connection,
            schema=SCHEMA,
            if_exists="append",
            index=False,
            chunksize=CHUNK_SIZE,
            dtype={
                "Parent_Stock": NVARCHAR(length=50),
                "Production": DECIMAL(38, 4),
                "Amount": DECIMAL(38, 4),
                "Year": INTEGER(),
                "ETL_DATE": DATETIME()
            }
        )

        print(
            f"Đã insert dữ liệu năm {year}: "
            f"{len(dataframe):,} dòng."
        )


def process_one_year(
    engine,
    source_file: Path,
    month: int,
    year: int
):
    """
    Xử lý toàn bộ một file của một năm.
    """

    source_sheet_name = get_source_sheet_name(month, year)

    print()
    print("=" * 70)
    print(f"Bắt đầu xử lý năm {year}")
    print(f"File nguồn : {source_file.name}")
    print(f"Sheet nguồn: {source_sheet_name}")
    print("=" * 70)

    # Đọc B9:D17 từ file tháng
    source_values = read_source_values(
        source_file=source_file,
        source_sheet_name=source_sheet_name
    )

    run_time = datetime.now()

    output_extension = TEMPLATE_FILE.suffix

    output_file = OUTPUT_FOLDER / (
        f"File trích xuất A3_{month:02d}.{year}"
        f"{output_extension}"
    )

    # Copy dữ liệu vào file trích xuất
    copy_values_to_template(
        template_file=TEMPLATE_FILE,
        output_file=output_file,
        source_values=source_values,
        year=year
    )

    print(f"Đã tạo file kết quả: {output_file}")

    # Tạo dataframe để upload SQL
    dataframe = create_kpi_year_dataframe(
        source_values=source_values,
        year=year,
        etl_date=run_time
    )

    print()
    print("Dữ liệu chuẩn bị upload:")
    print(dataframe.to_string(index=False))

    # Delete insert SQL Server
    delete_insert_sql(
        engine=engine,
        dataframe=dataframe,
        year=year
    )

    print(f"Hoàn thành xử lý năm {year}.")


# ============================================================
# 5. CHƯƠNG TRÌNH CHÍNH
# ============================================================

def main():
    print("=" * 70)
    print("BẮT ĐẦU CHƯƠNG TRÌNH IMPORT KPI YEAR")
    print("=" * 70)

    # Tìm một file mới nhất cho từng năm
    selected_files = find_latest_file_each_year(
        KPI_MONTH_FOLDER
    )

    print()
    print(
        f"Tìm thấy {len(selected_files)} năm cần xử lý:"
    )

    for index, item in enumerate(selected_files, start=1):
        print(
            f"  {index:02d}. Năm {item['year']} "
            f"- tháng {item['month']:02d} "
            f"- file: {item['file'].name}"
        )

    # Tạo kết nối SQL Server
    engine = create_sql_engine()

    try:
        # Kiểm tra kết nối SQL Server
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        print()
        print("Kết nối SQL Server thành công.")

        # Xử lý lần lượt từng năm
        for item in selected_files:
            process_one_year(
                engine=engine,
                source_file=item["file"],
                month=item["month"],
                year=item["year"]
            )

    finally:
        engine.dispose()

    print()
    print("=" * 70)
    print("HOÀN THÀNH TOÀN BỘ CHƯƠNG TRÌNH")
    print("=" * 70)


if __name__ == "__main__":
    try:
        main()

    except Exception as error:
        print()
        print("=" * 70)
        print("CHƯƠNG TRÌNH GẶP LỖI")
        print("=" * 70)
        print(str(error))

        sys.exit(1)