import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_presentation_script_document():
    doc = Document()

    # 1. Page Margins (Standard Normal: 1 inch = 1440 dxa)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # 2. Base Styles & Colors
    # Primary Theme Color: Deep Navy Blue #1868DB
    COLOR_PRIMARY = RGBColor(24, 104, 219)     # #1868DB
    COLOR_SECONDARY = RGBColor(15, 23, 42)    # #0F172A (Slate 900)
    COLOR_TEXT = RGBColor(41, 42, 46)         # #292A2E (Charcoal Text)
    COLOR_MUTED = RGBColor(100, 116, 139)     # #64748B (Slate 500)
    COLOR_EMERALD = RGBColor(16, 149, 93)     # Emerald Green
    COLOR_ROSE = RGBColor(225, 29, 72)        # Rose Red

    # Helper: Set cell shading
    def set_cell_background(cell, hex_color):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        tcPr.append(shd)

    # Helper: Set cell padding
    def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tcPr.append(tcMar)

    # Helper: Add Heading 1
    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(15)
        run.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    # Helper: Add Heading 2
    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(13)
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(12.5)
        run.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        return p

    # Helper: Add Heading 3
    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(11.5)
        run.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    # Helper: Standard Paragraph
    def add_p(text, bold_prefix=None, italic=False, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Arial'
            r_pre.font.size = Pt(10.5)
            r_pre.bold = True
            r_pre.font.color.rgb = COLOR_SECONDARY
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(10.5)
        run.italic = italic
        run.font.color.rgb = COLOR_TEXT
        return p

    # Helper: Bullet item
    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Arial'
            r_pre.font.size = Pt(10.5)
            r_pre.bold = True
            r_pre.font.color.rgb = COLOR_SECONDARY
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(10.5)
        run.font.color.rgb = COLOR_TEXT
        return p

    # Helper: Callout Box for [HÀNH ĐỘNG / THAO TÁC TRÊN SLIDE]
    def add_action_box(action_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "F1F5F9") # light slate
        set_cell_margins(cell, top=100, bottom=100, left=160, right=160)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:left w:val="single" w:sz="20" w:space="0" w:color="1868DB"/>'
            f'<w:top w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'<w:bottom w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r_tag = p.add_run("🎬 [HÀNH ĐỘNG TRÊN MÀN HÌNH]: ")
        r_tag.bold = True
        r_tag.font.name = 'Arial'
        r_tag.font.size = Pt(9.5)
        r_tag.font.color.rgb = COLOR_PRIMARY

        r_text = p.add_run(action_text)
        r_text.italic = True
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(9.5)
        r_text.font.color.rgb = COLOR_SECONDARY

        doc.add_paragraph().paragraph_format.space_after = Pt(3)

    # Helper: Speech box (Lời thoại người thuyết trình)
    def add_speech_box(speech_text, speaker_name="Nguyễn Duy Mạnh"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "F8FAFC") # soft light
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:left w:val="single" w:sz="20" w:space="0" w:color="10955D"/>'
            f'<w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'<w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        r_tag = p.add_run(f"🎙️ LỜI THOẠI DIỄN THUYẾT ({speaker_name}):\n")
        r_tag.bold = True
        r_tag.font.name = 'Arial'
        r_tag.font.size = Pt(10)
        r_tag.font.color.rgb = COLOR_EMERALD

        r_text = p.add_run(f'"{speech_text}"')
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(10)
        r_text.font.color.rgb = COLOR_TEXT

        doc.add_paragraph().paragraph_format.space_after = Pt(5)

    # Helper: Why Box for Dashboard Purpose (Lý do có Dashboard này)
    def add_why_box(dash_title, reason_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "EFF6FF") # soft blue tint
        set_cell_margins(cell, top=110, bottom=110, left=160, right=160)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="1868DB"/>'
            f'<w:top w:val="single" w:sz="4" w:space="0" w:color="BFDBFE"/>'
            f'<w:right w:val="single" w:sz="4" w:space="0" w:color="BFDBFE"/>'
            f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="BFDBFE"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r_tag = p.add_run(f"📌 LÝ DO SINH RA {dash_title.upper()}:\n")
        r_tag.bold = True
        r_tag.font.name = 'Arial'
        r_tag.font.size = Pt(9.5)
        r_tag.font.color.rgb = COLOR_PRIMARY

        r_text = p.add_run(reason_text)
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(9.5)
        r_text.font.color.rgb = COLOR_SECONDARY

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ==================== DOCUMENT CONTENT ====================

    # COVER TITLE
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(16)
    p_title.paragraph_format.space_after = Pt(4)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("KỊCH BẢN THUYẾT TRÌNH BÁO CÁO TỔNG KẾT DỰ ÁN SOVIGAZ")
    r_title.bold = True
    r_title.font.name = 'Arial'
    r_title.font.size = Pt(18)
    r_title.font.color.rgb = COLOR_PRIMARY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("PHIÊN BẢN TINH GỌN (10 - 15 PHÚT) - TẬP TRUNG KỂ CÂU CHUYỆN DỮ LIỆU DASHBOARD\n(Giải thích tường minh lý do ra đời từng Dashboard & Phân tích chuyên sâu 5 phân hệ BI)")
    r_sub.font.name = 'Arial'
    r_sub.font.size = Pt(11)
    r_sub.bold = True
    r_sub.font.color.rgb = COLOR_SECONDARY

    # Metadata table
    tbl_meta = doc.add_table(rows=5, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Người thực hiện & Thuyết trình:", "Nguyễn Duy Mạnh (BI Developer / Data Analyst)"),
        ("Người hướng dẫn & Đơn vị:", "Công ty Cổ phần INSIGHT DATA (INDA)"),
        ("Doanh nghiệp nghiên cứu:", "Công ty Cổ phần Hơi Kỹ nghệ Que hàn (SOVIGAZ)"),
        ("Nền tảng báo cáo & Trình chiếu:", "Web tương tác trực tiếp: https://sovigaz2026.web.app/presentation"),
        ("Thời lượng chuẩn tối ưu:", "10 - 15 phút (Chuẩn báo cáo Hội đồng INDA)")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row = tbl_meta.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.3)
        c1.width = Inches(4.2)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=50, bottom=50, left=90, right=90)
        set_cell_margins(c1, top=50, bottom=50, left=90, right=90)
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(label)
        r0.font.name = 'Arial'
        r0.font.size = Pt(9.5)
        r0.bold = True
        r0.font.color.rgb = COLOR_MUTED
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.name = 'Arial'
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = COLOR_SECONDARY
        r1.bold = (idx == 0 or idx == 1 or idx == 4)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # PHẦN 1: MA TRẬN THỜI GIAN & KHUNG NỘI DUNG (10 - 15 PHÚT)
    # -------------------------------------------------------------
    add_h1("PHẦN 1: MA TRẬN PHÂN BỔ THỜI GIAN TINH GỌN (10 - 15 PHÚT)")
    add_p("Để tối ưu hóa sự chú ý của Hội đồng đánh giá, bài thuyết trình được nén gọn trong thời lượng 10-15 phút (trung bình 12-14 phút). Các slide kỹ thuật ban đầu được trình bày gãy gọn (mỗi slide ~30-45 giây), dồn toàn bộ 50% thời lượng (6-7 phút) cho Slide 8 (Dashboard). Đặc biệt, mỗi trang Dashboard bắt đầu bằng việc trả lời câu hỏi: 'Tại sao cần Dashboard này?' trước khi đi vào phân tích số liệu.")

    tbl_agenda = doc.add_table(rows=13, cols=4)
    tbl_agenda.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Slide #", "Nội dung trình bày", "Thời lượng", "Trọng tâm cần làm nổi bật"]
    for i, h in enumerate(headers):
        cell = tbl_agenda.cell(0, i)
        set_cell_background(cell, "1868DB")
        set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.name = 'Arial'
        r.font.size = Pt(9.5)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    agenda_rows = [
        ("Slide 1", "Trang bìa & Mở đầu", "0.5 phút (30s)", "Chào hỏi, giới thiệu bản thân, đề tài Sovigaz, đơn vị INDA."),
        ("Slide 2", "Mục lục Báo cáo", "0.5 phút (30s)", "Khái quát 3 trụ cột: Vị trí Data, Các bước thực hiện, Tổng kết."),
        ("Slide 3", "1. Bốn vị trí chính mảng Data", "1.0 phút", "Sự phối hợp khép kín: BA (Nghiệp vụ) - DE (ETL) - DA (BI) - Tester (Kiểm soát)."),
        ("Slide 4", "2.1. Đọc hiểu tài liệu dự án", "0.5 phút (30s)", "Khảo sát hệ thống ERP Oracle nguồn, vượt rào cản thuật ngữ ngành khí."),
        ("Slide 5", "2.2. Xây dựng Data Dictionary", "1.0 phút", "Chuẩn hóa siêu dữ liệu 19 bảng Datamart, ứng dụng AI tăng tốc xử lý."),
        ("Slide 6", "2.3. Xây dựng tài liệu BRD", "0.5 phút (30s)", "Toán học hóa nhu cầu kinh doanh thành công thức của 5 báo cáo quản trị."),
        ("Slide 7", "2.4. Xây dựng Data Model", "1.0 phút", "Mô hình Star Schema Fact/Dim tối ưu hóa hiệu năng VertiPaq trên Power BI."),
        ("Slide 8", "2.5. DASHBOARD & DATA STORYTELLING", "6.5 - 7.5 phút", "TRỌNG TÂM: Nêu lý do tồn tại & Kể câu chuyện 5 Dashboard (Doanh thu, Chi tiết, Công nợ, KPI A3, Sức khỏe tài chính)."),
        ("Slide 9", "2.6. Kiểm thử Báo cáo UAT", "1.0 phút", "Quy trình đối soát 62 test cases, 25 ca trọng yếu, SQL DWH vs Power BI Variance=0."),
        ("Slide 10", "2.7. Phân hệ Machine Learning", "0.5 phút (30s)", "Nâng tầm dữ liệu: Dự báo chuỗi thời gian, phân cụm RFM, cảnh báo Churn."),
        ("Slide 11", "2.8. Trợ lý AI Tra cứu DWH (RAG)", "0.5 phút (30s)", "Tích hợp Google Gemini hỏi đáp siêu dữ liệu bằng tiếng Việt tự nhiên."),
        ("Slide 12", "3. Tổng kết thực tập & Hỏi đáp Q&A", "1.0 phút", "Đúc kết 3 giá trị: Kiến thức BI, Kỹ năng dữ liệu, Tư duy AI; Sẵn sàng Q&A.")
    ]

    col_widths = [Inches(0.9), Inches(2.2), Inches(1.1), Inches(2.3)]
    for r_idx, row_data in enumerate(agenda_rows, start=1):
        for c_idx, val in enumerate(row_data):
            cell = tbl_agenda.cell(r_idx, c_idx)
            cell.width = col_widths[c_idx]
            bg_color = "E9F2FE" if r_idx == 8 else ("F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = 'Arial'
            r.font.size = Pt(9)
            r.font.color.rgb = COLOR_PRIMARY if r_idx == 8 else COLOR_TEXT
            r.bold = (r_idx == 8 or c_idx == 0)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # -------------------------------------------------------------
    # PHẦN 2: NGUYÊN TẮC KỂ CHUYỆN DỮ LIỆU
    # -------------------------------------------------------------
    add_h1("PHẦN 2: NGUYÊN TẮC KỂ CHUYỆN DỮ LIỆU (DATA STORYTELLING)")
    add_p("Để bài nói vừa ngắn gọn vừa chạm đến tâm lý Ban Giám khảo, người thuyết trình áp dụng công thức 2 bước 'WHY THEN WHAT' cho mỗi Dashboard:")
    add_bullet(" Nêu rõ 'nỗi đau' (pain point) của ban lãnh đạo nếu không có báo cáo này (Ví dụ: Chờ số liệu cuối tháng quá trễ, nguy cơ đứt gãy dòng tiền do nợ khó đòi, hay sự mơ hồ về tiến độ hoàn thành chỉ tiêu năm).", bold_prefix="Bước 1 - Nêu lý do tồn tại (WHY):")
    add_bullet(" Đọc ngay con số tổng lớn nhất, chỉ ra sự chuyển dịch bất thường trên biểu đồ, phân tích nguyên nhân gốc rễ và chốt hạ bằng đề xuất hành động thực tế.", bold_prefix="Bước 2 - Đọc vị số liệu & Câu chuyện (WHAT & INSIGHT):")

    # -------------------------------------------------------------
    # PHẦN 3: KỊCH BẢN CHI TIẾT TỪNG SLIDE
    # -------------------------------------------------------------
    add_h1("PHẦN 3: KỊCH BẢN THUYẾT TRÌNH CHI TIẾT TỪNG SLIDE (10 - 15 PHÚT)")

    # SLIDE 1
    add_h2("SLIDE 1: TRANG BÌA MỞ ĐẦU (INTRO SLIDE)")
    add_p("Thời lượng: 0.5 phút (30 giây) | Mục tiêu: Giới thiệu bản thân và đề tài trang trọng, gãy gọn.")
    add_action_box("Mở trang web https://sovigaz2026.web.app/presentation ở chế độ Toàn màn hình. Đứng thẳng, tự tin hướng về phía Hội đồng.")
    add_speech_box(
        "Kính thưa quý Thầy Cô trong Hội đồng đánh giá và quý Giảng viên tại Insight Data (INDA).\n\n"
        "Em tên là Nguyễn Duy Mạnh. Hôm nay, em xin phép trình bày Báo cáo Tổng kết Dự án: Xây dựng Nền tảng Dữ liệu Doanh nghiệp DWH & Hệ thống Báo cáo Quản trị BI cho Công ty Cổ phần Hơi Kỹ nghệ Que hàn (SOVIGAZ) - dự án thực tập tốt nghiệp của em dưới sự hướng dẫn trực tiếp từ INDA.\n\n"
        "Em xin phép được bắt đầu ngay vào nội dung báo cáo!"
    )

    # SLIDE 2
    add_h2("SLIDE 2: MỤC LỤC TRÌNH BÀY (AGENDA)")
    add_p("Thời lượng: 0.5 phút (30 giây) | Mục tiêu: Điểm nhanh lộ trình 3 trụ cột.")
    add_action_box("Chuyển sang Slide 2. Lướt nhanh qua 3 mục trên màn hình.")
    add_speech_box(
        "Bài báo cáo của em gồm 3 phần chính:\n"
        "- Thứ nhất: Khái quát 4 vị trí nòng cốt trong mảng Dữ liệu doanh nghiệp.\n"
        "- Thứ hai (Trọng tâm nhất): Quy trình thực tế triển khai dự án Sovigaz, đặc biệt là phần kể câu chuyện dữ liệu qua 5 phân hệ Dashboard BI và kiểm thử UAT.\n"
        "- Thứ ba: Tổng kết các giá trị thực tiễn và bài học đúc kết sau quá trình thực tập."
    )

    # SLIDE 3
    add_h2("SLIDE 3: BỐN VỊ TRÍ CHÍNH TRONG MẢNG DATA")
    add_p("Thời lượng: 1.0 phút | Mục tiêu: Nêu bật tính kết nối của dây chuyền dữ liệu khép kín.")
    add_action_box("Chuyển sang Slide 3. Chỉ nhanh qua 4 khối: BA, DE, DA, Tester.")
    add_speech_box(
        "Để biến dữ liệu thô thành quyết định kinh doanh, một Data Team chuyên nghiệp cần 4 mắt xích phối hợp chặt chẽ:\n\n"
        "1. BA (Business Analyst): Là cầu nối nghiệp vụ, phỏng vấn các phòng ban để chuyển hóa nhu cầu quản trị thành tài liệu đặc tả BRD.\n"
        "2. DE (Data Engineer): Xây dựng hạ tầng đường ống ETL, làm sạch dữ liệu từ ERP Oracle đổ về kho Data Mart.\n"
        "3. DA (Data Analyst): Thiết kế mô hình Star Schema, viết hàm DAX và xây dựng các Dashboard trực quan trên Power BI.\n"
        "4. Tester: Người gác cổng chất lượng, viết kịch bản kiểm thử SIT/UAT, dùng truy vấn SQL đối chiếu trực tiếp giữa DWH và báo cáo để đảm bảo số liệu chính xác 100% trước khi bàn giao."
    )

    # SLIDE 4
    add_h2("SLIDE 4: ĐỌC HIỂU TÀI LIỆU DỰ ÁN")
    add_p("Thời lượng: 0.5 phút (30 giây) | Mục tiêu: Nêu ngắn gọn bối cảnh và thách thức khảo sát ban đầu.")
    add_action_box("Chuyển sang Slide 4. Nhấn mạnh vào việc tháo gỡ rào cản thuật ngữ ngành khí.")
    add_speech_box(
        "Bước đầu tiên là Khảo sát hệ thống và đọc hiểu tài liệu. Sovigaz là doanh nghiệp sản xuất và phân phối khí công nghiệp, khí y tế quy mô lớn.\n\n"
        "Thách thức ban đầu của em là rào cản thuật ngữ chuyên ngành (như khí Oxy lỏng, Argon, CO2, đơn vị vỏ chai, bồn chứa) và cấu trúc dữ liệu ERP Oracle nguồn khá phân mảnh. Qua việc phân tích kỹ lưỡng, em đã nhanh chóng làm chủ luồng đi của dữ liệu từ bán hàng, kho vận đến kế toán."
    )

    # SLIDE 5
    add_h2("SLIDE 5: XÂY DỰNG DATA DICTIONARY")
    add_p("Thời lượng: 1.0 phút | Mục tiêu: Chứng minh năng lực chuẩn hóa siêu dữ liệu và ứng dụng AI.")
    add_action_box("Chuyển sang Slide 5. Cuộn nhanh bảng Data Dictionary 19 bảng bên phải.")
    add_speech_box(
        "Bước thứ hai là Xây dựng Data Dictionary - cuốn 'từ điển chung' định nghĩa siêu dữ liệu cho toàn bộ dự án.\n\n"
        "Em đã rà soát và chuẩn hóa chi tiết 19 bảng Datamart (gồm các bảng Fact doanh thu, công nợ, KPI và các bảng Dim khách hàng, xí nghiệp, lịch ngày).\n\n"
        "Trước số lượng trường dữ liệu đồ sộ và các tên viết tắt phức tạp, em đã ứng dụng mạnh mẽ trợ lý AI để bóc tách, chuẩn hóa kiểu dữ liệu và giải nghĩa kinh doanh tự động, rút ngắn thời gian chuẩn hóa từ nhiều ngày xuống chỉ còn vài giờ."
    )

    # SLIDE 6
    add_h2("SLIDE 6: XÂY DỰNG TÀI LIỆU BRD")
    add_p("Thời lượng: 0.5 phút (30 giây) | Mục tiêu: Bản thiết kế logic của 5 báo cáo.")
    add_action_box("Chuyển sang Slide 6. Lướt qua tài liệu BRD nhúng bên phải.")
    add_speech_box(
        "Bước thứ ba là lập tài liệu BRD (Business Requirements Document) - bản thiết kế logic của toàn bộ hệ thống báo cáo.\n\n"
        "Tài liệu này quy chuẩn 5 báo cáo trọng điểm: Doanh thu tổng quan, Doanh thu chi tiết, Quản lý công nợ, Tổng quan KPI A3 và Sức khỏe tài chính xí nghiệp. Em đã chuyển dịch thành công các bài toán kinh doanh trừu tượng của lãnh đạo thành các công thức toán học và điều kiện lọc có thể đo lường chính xác."
    )

    # SLIDE 7
    add_h2("SLIDE 7: XÂY DỰNG DATA MODEL")
    add_p("Thời lượng: 1.0 phút | Mục tiêu: Mô hình Star Schema tối ưu cho engine VertiPaq.")
    add_action_box("Chuyển sang Slide 7. Chỉ vào các bảng Fact ở giữa và Dim xung quanh.")
    add_speech_box(
        "Bước thứ tư là Xây dựng Data Model trên Power BI theo mô hình Star Schema chuẩn quốc tế:\n\n"
        "Các bảng Fact giao dịch đặt ở trung tâm; xung quanh là các bảng Dimension chuẩn như Dim_Date, Dim_Customer, Dim_Product và Dim_Branch.\n\n"
        "Việc thiết lập chuẩn xác các mối quan hệ 1-N và bộ lọc một chiều (Single Direction) giúp triệt tiêu hoàn toàn rủi ro quan hệ đa trị (N-N), ngăn chặn hiện tượng nhân bản dữ liệu và giúp các hàm tính toán DAX chạy mượt mà trên tập dữ liệu hàng trăm nghìn dòng."
    )

    # =============================================================
    # SLIDE 8: TRỌNG TÂM DATA STORYTELLING - 5 TRANG DASHBOARD
    # =============================================================
    add_h1("SLIDE 8: XÂY DỰNG BÁO CÁO BI & KỂ CÂU CHUYỆN DỮ LIỆU (TRỌNG TÂM)")
    add_p("Thời lượng: 6.5 - 7.5 phút (Chiếm 50% thời lượng bài nói) | Mục tiêu: Trả lời rõ 'Tại sao cần Dashboard này?' và phân tích chuyên sâu câu chuyện kinh doanh qua từng con số.")
    add_action_box("Chuyển sang Slide 8. Bấm nút Toàn màn hình hoặc tương tác trực tiếp trên khung Dashboard Power BI nhúng ở bên phải.")

    # TRANG 1: DOANH THU
    add_h3("8.1. Trang 1: Báo cáo Tổng quan Doanh thu (Overview Sales Performance)")
    add_why_box(
        "Trang 1 - Tổng quan Doanh thu",
        "Trước đây, Ban Giám đốc Sovigaz phải chờ đến ngày 10 của tháng sau mới nhận được báo cáo tổng hợp rời rạc từ các xí nghiệp gửi về, hoàn toàn bị động trước biến động kinh doanh. Dashboard này sinh ra để cung cấp cái nhìn toàn cảnh 360 độ theo thời gian thực về dòng tiền doanh thu, cơ cấu mặt hàng, phân khúc khách hàng và đóng góp của từng xí nghiệp, giúp Tổng Giám đốc nắm bắt nhịp đập kinh doanh và ra quyết định điều hành ngay trong ngày."
    )
    add_action_box("Chỉ tay vào 5 thẻ KPI trên cùng, sau đó trỏ vào biểu đồ Cột-Đường 'Doanh thu và số đơn hàng theo tháng', cuối cùng là 2 biểu đồ tròn cơ cấu khách hàng và xí nghiệp.")
    add_speech_box(
        "Kính thưa Thầy Cô, phân hệ đầu tiên là Báo cáo Tổng quan Doanh thu.\n\n"
        "Tại sao Tổng Giám đốc cần màn hình này? Trước đây, lãnh đạo phải chờ đến ngày 10 tháng sau mới có báo cáo tổng hợp từ các chi nhánh. Màn hình này sinh ra để cung cấp cái nhìn 360 độ tức thời về sức khỏe kinh doanh toàn công ty.\n\n"
        "Nhìn vào các thẻ KPI:\n"
        "- Doanh thu thuần đạt 1.111 tỷ đồng, đóng góp 102 tỷ tiền thuế VAT, tổng doanh thu gồm thuế là 1.213 tỷ đồng.\n"
        "- Hệ thống phục vụ 22,90 nghìn đơn hàng, với giá trị trung bình mỗi đơn (AOV) là 48,52 triệu đồng.\n\n"
        "💡 Câu chuyện dữ liệu đắt giá nhất nằm ở biểu đồ Cột kết hợp Đường:\n"
        "Cột xanh là Doanh thu, đường hồng là Số đơn hàng. Ở các tháng đầu năm, doanh thu rất cao (đạt đỉnh 113 tỷ vào tháng 3) nhưng số đơn hàng lại rất ít (chỉ 2,3 - 3,8 nghìn đơn). Thế nhưng từ nửa cuối năm, đường số đơn hàng tăng vọt dốc đứng, cán mốc đỉnh 9,4 nghìn đơn vào Tháng 12 – tăng gấp hơn 4 lần so với đầu năm!\n\n"
        "Dữ liệu phản ánh một bước chuyển dịch chiến lược xuất sắc của Sovigaz: Từ chỗ phụ thuộc vào các hợp đồng bán sỉ lớn ở đầu năm, công ty đã mở rộng mạnh mẽ sang thị trường bán lẻ và khách hàng vừa và nhỏ vào cuối năm. Mặc dù giá trị trung bình mỗi đơn giảm đi, nhưng việc tăng vọt số đơn hàng giúp doanh thu duy trì ổn định quanh mức 80 - 90 tỷ/tháng, tạo dòng tiền thanh khoản liên tục và giảm thiểu rủi ro phụ thuộc đối tác lớn.\n\n"
        "Về cơ cấu: Thành phẩm chiếm tới 94% (1,05 nghìn tỷ) - khẳng định năng lực sản xuất khí là giá trị cốt lõi; Khối Bệnh viện chiếm 32,5% (360 tỷ) là bệ đỡ doanh thu thiết yếu quanh năm; và Văn phòng công ty (450 tỷ) cùng Xí nghiệp Bình Dương (302 tỷ) là hai đầu tàu đóng góp tới 68% doanh thu toàn hệ thống."
    )

    # TRANG 2: CHI TIẾT DOANH THU
    add_h3("8.2. Trang 2: Báo cáo Chi tiết Doanh thu (Sales Deep Dive)")
    add_why_box(
        "Trang 2 - Chi tiết Doanh thu",
        "Trang tổng quan chỉ cho thấy con số vĩ mô. Khi doanh thu một chi nhánh bị sụt giảm hoặc cần lên kế hoạch kinh doanh tháng tới, Trưởng phòng Kinh doanh cần câu trả lời chi tiết: 'Mặt hàng nào đang bán chạy nhất? Đối tác chiến lược nào cần chăm sóc đặc biệt? Hóa đơn nào có giá trị cao?'. Dashboard này sinh ra như một chiếc kính hiển vi phân tích sâu, cho phép đào sâu tới 22.895 dòng giao dịch cụ thể để tối ưu hóa chính sách khách hàng VIP và cơ cấu tồn kho."
    )
    add_action_box("Chuyển sang Trang 2. Trỏ vào bảng mặt hàng bên trái, sau đó trỏ sang bảng Top khách hàng bên phải và ma trận xí nghiệp bên dưới.")
    add_speech_box(
        "Tiếp theo là Trang 2: Báo cáo Chi tiết Doanh thu.\n\n"
        "Lý do ra đời: Trang tổng quan là bức tranh toàn cảnh, còn trang này là chiếc kính hiển vi giúp các Trưởng phòng Kinh doanh soi rõ chi tiết từng sản phẩm và khách hàng để tối ưu chính sách bán hàng.\n\n"
        "Nhìn vào cơ cấu sản phẩm:\n"
        "- Oxy lỏng là 'ngôi sao doanh thu' lớn nhất, mang về 455,46 tỷ đồng với hơn 9.000 đơn hàng.\n"
        "- Đáng chú ý nhất là Oxy khí: Dù doanh thu chỉ đạt 96,78 tỷ, nhưng nó chiếm tới 21.038 đơn hàng – tức là chiếm gần như toàn bộ tần suất giao dịch hàng ngày của công ty, giữ vai trò sợi dây liên kết khách hàng trung thành.\n\n"
        "Về tệp khách hàng chiến lược:\n"
        "- Đối tác lớn nhất là Công ty CP Hơi kỹ nghệ Que hàn với 164,76 tỷ đồng (gần 15% tổng doanh thu).\n"
        "- Khối y tế đứng đầu là Bệnh viện Chợ Rẫy với 31,55 tỷ đồng, theo sau là BV 115 (13,11 tỷ), BV Khánh Hòa (12,36 tỷ).\n\n"
        "Báo cáo này cho phép người dùng click vào bất kỳ khách hàng nào để xem toàn bộ lịch sử hóa đơn chi tiết, hỗ trợ chăm sóc khách hàng VIP chính xác tuyệt đối."
    )

    # TRANG 3: CÔNG NỢ
    add_h3("8.3. Trang 3: Báo cáo Quản lý Công nợ & Rủi ro Tín dụng (Credit & Debt Risk)")
    add_why_box(
        "Trang 3 - Quản lý Công nợ",
        "Trong ngành sản xuất khí công nghiệp, 'doanh thu là phù du, tiền mặt mới là thực tế'. Nếu không thu hồi được công nợ, doanh nghiệp sẽ rơi vào bẫy lãi trên giấy nhưng đứt gãy thanh khoản. Dashboard này sinh ra để giám sát sức khỏe dòng tiền và cảnh báo sớm rủi ro tín dụng cho Giám đốc Tài chính, theo dõi tỷ lệ thu nợ, nhận diện các dải tuổi nợ quá hạn và kích hoạt biện pháp thu hồi trước khi chuyển thành nợ xấu."
    )
    add_action_box("Chuyển sang Trang 3. Giọng nghiêm túc, cảnh báo rủi ro. Chỉ vào 4 thẻ KPI công nợ, sau đó trỏ vào biểu đồ nợ khó đòi và dải tuổi nợ quá hạn.")
    add_speech_box(
        "Bước sang Trang 3: Báo cáo Quản lý Công nợ - trang báo cáo sống còn của Giám đốc Tài chính.\n\n"
        "Lý do có Dashboard này: Doanh nghiệp có thể phá sản nếu có doanh thu cao nhưng không thu được tiền mặt. Dashboard này sinh ra để kiểm soát sức khỏe dòng tiền và cảnh báo sớm nguy cơ nợ xấu.\n\n"
        "Nhìn vào 4 thẻ KPI công nợ:\n"
        "- Nợ đầu kỳ: 668,52 tỷ đồng.\n"
        "- Nợ phát sinh mới: 70,57 tỷ đồng.\n"
        "- Số nợ đã thu hồi được: 70,21 tỷ đồng.\n"
        "- Nợ còn lại cuối kỳ: 668,61 tỷ đồng.\n\n"
        "💡 Insight dòng tiền tích cực: Số nợ thu hồi được (70,21 tỷ) gần như cân bằng tuyệt đối với nợ mới phát sinh (70,57 tỷ). Tỷ lệ thu hồi nợ đạt tới 99,49% so với lượng nợ phát sinh! Điều này cho thấy kỷ luật thu hồi nợ trong kỳ của Sovigaz rất tốt, giữ tổng dư nợ ổn định mà không bị phình to.\n\n"
        "⚠️ Tuy nhiên, dữ liệu phát đi tín hiệu cảnh báo đỏ ở phần phân tích tuổi nợ bên dưới:\n"
        "- Có tới 134 tỷ nợ không thể đòi và 71 tỷ nợ khó đòi cần trích lập dự phòng.\n"
        "- 'Điểm nóng' nguy hiểm nhất là 59 tỷ đồng nợ quá hạn từ 181 đến 365 ngày (6 tháng đến 1 năm) và hơn 103 tỷ đồng nợ tồn đọng lịch sử trên 2 năm.\n\n"
        "🎯 Hành động chiến lược đề xuất: Thành lập ngay tổ thu hồi nợ chuyên trách xử lý dứt điểm khoản 59 tỷ nợ quá hạn 6-12 tháng; đồng thời áp dụng chính sách siết hạn mức tín dụng: Khách hàng nợ quá hạn trên 90 ngày bắt buộc chuyển sang hình thức thanh toán COD trước khi xuất hàng."
    )

    # TRANG 4: TỔNG QUAN KPI A3
    add_h3("8.4. Trang 4: Báo cáo Tổng quan KPI A3 & Hiệu suất Doanh nghiệp (Enterprise Performance)")
    add_why_box(
        "Trang 4 - Tổng quan KPI A3",
        "Hội đồng Quản trị không có thời gian đọc hàng chục trang báo cáo chi tiết. Họ cần một bảng điều khiển duy nhất chuẩn hóa theo phương pháp báo cáo A3 tinh gọn của Nhật Bản để trả lời ngay: 'Doanh nghiệp có đạt kế hoạch năm không? Đang vượt hay chậm tiến độ? Tăng trưởng so với cùng kỳ ra sao?'. Dashboard này sinh ra để tích hợp toàn bộ chỉ tiêu sản xuất và kinh doanh lên một màn hình, đối chiếu trực diện Kế hoạch (Target) và Thực tế (Actual)."
    )
    add_action_box("Chuyển sang Trang 4. Chỉ vào 4 thẻ KPI năm trên cùng, sau đó trỏ vào các thẻ lũy kế YoY và đường tỷ lệ hoàn thành 12 tháng.")
    add_speech_box(
        "Tiếp theo là Trang 4: Báo cáo Tổng quan KPI A3 dành cho Hội đồng Quản trị.\n\n"
        "Lý do ra đời: Lãnh đạo cấp cao cần 1 màn hình duy nhất theo chuẩn A3 tinh gọn để biết ngay doanh nghiệp có đang đi đúng lộ trình chiến lược năm hay không.\n\n"
        "Những con số vượt kế hoạch ấn tượng:\n"
        "- Kế hoạch sản xuất năm: Đạt 111,89% (vượt chỉ tiêu sản xuất gần 12%).\n"
        "- Kế hoạch doanh thu năm: Đạt tới 132,27% (vượt chỉ tiêu doanh thu ấn tượng hơn 32%!).\n"
        "- Doanh thu tháng đạt 323,89 tỷ, hoàn thành 109,29% KPI tháng; Giá trị sản xuất đạt 185,69 tỷ, đạt 108,96% kế hoạch.\n"
        "- Tăng trưởng so với cùng kỳ năm trước (YoY): Doanh thu tăng 5,75% và Giá trị sản xuất tăng trưởng bứt phá tới 16,25%.\n\n"
        "Biểu đồ xu hướng 12 tháng cho thấy suốt từ Tháng 1 đến Tháng 10, tỷ lệ hoàn thành KPI luôn nằm cao trên ngưỡng 100%, dao động từ 113% đến 138%. Về đơn vị, Xí nghiệp Bình Dương bứt phá ngoạn mục với tỷ lệ hoàn thành tới 133% KPI tháng."
    )

    # TRANG 5: SỨC KHỎE TÀI CHÍNH
    add_h3("8.5. Trang 5: Báo cáo KPI Chi tiết & Sức khỏe Tài chính Xí nghiệp (Financial Health Scorecard)")
    add_why_box(
        "Trang 5 - Sức khỏe Tài chính Xí nghiệp",
        "Sovigaz có mạng lưới xí nghiệp trải dài toàn quốc với đặc thù sản xuất và thị trường khác nhau, không thể áp dụng chính sách điều hành cào bằng. Dashboard này sinh ra để đo lường và xếp hạng sức khỏe tài chính riêng biệt của từng chi nhánh, giúp Ban Giám đốc biết chính xác xí nghiệp nào đang hoạt động vượt trội để khen thưởng và xí nghiệp nào đang thiếu hụt sản lượng để điều phối nguồn khí kịp thời giữa các vùng miền."
    )
    add_action_box("Chuyển sang Trang 5. Chỉ vào ma trận sức khỏe tài chính xí nghiệp ở giữa màn hình.")
    add_speech_box(
        "Trang cuối cùng trong phân hệ Dashboard là Báo cáo Sức khỏe Tài chính và Chi tiết KPI từng Xí nghiệp.\n\n"
        "Lý do ra đời: Sovigaz có nhiều đơn vị thành viên trải dài từ Bắc chí Nam. Dashboard này giúp chấm điểm sức khỏe tài chính riêng biệt từng xí nghiệp để điều hành sản xuất công bằng và linh hoạt.\n\n"
        "Nhìn vào bảng xếp hạng hiệu quả:\n"
        "- Xí nghiệp Que hàn điện Khánh Hội dẫn đầu toàn hệ thống khi hoàn thành tới 175,69% kế hoạch sản xuất!\n"
        "- Xí nghiệp Hơi kỹ nghệ Nha Trang đạt 160,49% kế hoạch.\n"
        "- Xí nghiệp Bình Dương đạt 112,01% kế hoạch.\n\n"
        "Bảng điều khiển này giúp Ban Giám đốc chủ động điều phối đơn hàng và nguồn nguyên liệu giữa các chi nhánh, đảm bảo không nơi nào bị thiếu khí cục bộ và tối đa hóa biên lợi nhuận toàn công ty."
    )

    # SLIDE 9: KIỂM THỬ UAT
    add_h2("SLIDE 9: KIỂM THỬ BÁO CÁO UAT")
    add_p("Thời lượng: 1.0 phút | Mục tiêu: Khẳng định tính chuẩn xác tuyệt đối qua 62 test cases SQL.")
    add_action_box("Chuyển sang Slide 9. Chỉ vào bảng UAT live bên phải, chỉ vào tỷ lệ 100% Pass và nút Copy SQL.")
    add_speech_box(
        "Thưa Thầy Cô, một chiếc Dashboard chỉ có giá trị khi số liệu chính xác tuyệt đối. Do đó, khâu Kiểm thử UAT là bước em thực hiện vô cùng nghiêm ngặt.\n\n"
        "Em đã xây dựng bộ kịch bản 62 Test Cases bao phủ toàn bộ 5 trang Dashboard, trong đó có 25 ca kiểm thử Trọng yếu (Critical) bắt buộc phải đạt để Go-live.\n\n"
        "Phương pháp: Em viết các câu lệnh truy vấn SQL trực tiếp trên cơ sở dữ liệu Datamart trong DWH để đối chiếu trực tiếp với từng con số trên Power BI.\n\n"
        "Kết quả đạt được: 62/62 Test Cases đều Pass 100%, không phát sinh lỗi (0 Defect), và phương sai sai lệch bằng không (Variance = 0). Từng con số doanh thu 1.110,9 tỷ hay dư nợ 668,6 tỷ trên Power BI khớp chính xác đến từng chữ số lẻ so với dữ liệu gốc!"
    )

    # SLIDE 10: MACHINE LEARNING
    add_h2("SLIDE 10: PHÂN HỆ MACHINE LEARNING")
    add_p("Thời lượng: 0.5 phút (30 giây) | Mục tiêu: Giới thiệu 3 mô hình dự báo tương lai.")
    add_action_box("Chuyển sang Slide 10. Lướt qua 3 mô hình: Time-series, RFM, Churn.")
    add_speech_box(
        "Để nâng tầm dữ liệu từ báo cáo quá khứ sang dự báo tương lai, dự án mở rộng sang phân hệ Machine Learning với 3 bài toán ứng dụng:\n"
        "1. Dự báo chuỗi thời gian (XGBoost, CatBoost) dự báo nhu cầu sản lượng khí trong tương lai để tối ưu lịch vận hành nhà máy.\n"
        "2. Phân cụm khách hàng RFM bằng K-Means để nhận diện nhóm khách hàng VIP và khách hàng tiềm năng.\n"
        "3. Mô hình Cảnh báo rủi ro rời bỏ (Customer Churn Prediction) giúp nhân viên kinh doanh phát hiện sớm khách hàng có dấu hiệu giảm đặt hàng để kịp thời chăm sóc giữ chân."
    )

    # SLIDE 11: CHATBOT AI RAG
    add_h2("SLIDE 11: TRỢ LÝ AI TRA CỨU DWH (CHATBOT RAG)")
    add_p("Thời lượng: 0.5 phút (30 giây) | Mục tiêu: Ứng dụng AI ngôn ngữ tự nhiên tra cứu siêu dữ liệu.")
    add_action_box("Chuyển sang Slide 11. Chỉ vào giao diện Chatbot AI trực tiếp bên phải.")
    add_speech_box(
        "Phân hệ thứ 8 là Trợ lý AI Tra cứu DWH sử dụng kiến trúc RAG tích hợp mô hình ngôn ngữ lớn Google Gemini.\n\n"
        "Toàn bộ tri thức của dự án – từ định nghĩa 19 bảng, công thức tính toán BRD đến số liệu kiểm thử – đều được tích hợp vào AI. Người dùng phi kỹ thuật có thể đặt câu hỏi bằng tiếng Việt tự nhiên như 'Bảng nào lưu nợ quá hạn?' hay 'Mặt hàng nào có doanh thu cao nhất?', AI sẽ ngay lập tức giải đáp chính xác và gợi ý câu lệnh truy vấn tương ứng."
    )

    # SLIDE 12: KẾT LUẬN
    add_h2("SLIDE 12: TỔNG KẾT QUÁ TRÌNH THỰC TẬP & KẾT THÚC")
    add_p("Thời lượng: 1.0 phút | Mục tiêu: Đúc kết 3 giá trị, gửi lời cảm ơn và sẵn sàng bước vào Q&A.")
    add_action_box("Chuyển sang Slide 12. Chỉ vào 3 vòng tròn tổng kết, cúi đầu chào trang trọng.")
    add_speech_box(
        "Kính thưa quý Thầy Cô, qua quá trình thực hiện dự án Sovigaz tại INDA, em xin đúc kết 3 giá trị lớn nhất:\n"
        "1. Kiến thức chuyên môn: Nắm vững trọn vẹn vòng đời một dự án BI chuẩn mực từ phân tích yêu cầu, mô hình hóa dữ liệu đến trực quan hóa và kiểm thử UAT.\n"
        "2. Kỹ năng xử lý dữ liệu: Nâng cao tư duy phân tích dữ liệu lớn và khả năng kể câu chuyện kinh doanh đằng sau các con số.\n"
        "3. Tư duy công nghệ & AI: Làm chủ hệ sinh thái Power BI, SQL, DAX và ứng dụng AI để tối ưu hóa năng suất vượt trội.\n\n"
        "Em xin chân thành cảm ơn quý Giảng viên tại Insight Data (INDA) đã tận tình hướng dẫn em hoàn thành dự án này. Cảm ơn quý Thầy Cô và các bạn đã chú ý lắng nghe. Em xin sẵn sàng tiếp nhận các câu hỏi phản biện từ Hội đồng đánh giá!"
    )

    # -------------------------------------------------------------
    # PHẦN 4: BỘ CÂU HỎI THƯỜNG GẶP (Q&A CHEAT SHEET)
    # -------------------------------------------------------------
    add_h1("PHẦN 4: BỘ CÂU HỎI VÀ TRẢ LỜI THƯỜNG GẶP KHI BẢO VỆ (Q&A CHEAT SHEET)")
    add_p("Dưới đây là 3 câu hỏi trọng tâm nhất mà Hội đồng phản biện thường xuyên đặt ra, kèm câu trả lời mẫu xuất sắc giúp bạn tự tin đạt điểm tối đa:")

    # Q1
    add_h3("Câu hỏi 1: Em đã xử lý như thế nào khi phát hiện số liệu giữa Power BI và SQL Server bị lệch nhau trong quá trình UAT?")
    add_p("Gợi ý trả lời:", bold_prefix="💡 ")
    add_p(
        "\"Thưa Thầy Cô, khi xảy ra hiện tượng chênh lệch số liệu (variance), em áp dụng quy trình dò lỗi 4 bước ngược dòng:\n"
        "Bước 1: Kiểm tra ngữ cảnh lọc (Filter Context) trên Visual Power BI – xem có slicer ngầm, page filter hay tương tác chéo nào đang lọc bớt dữ liệu hay không.\n"
        "Bước 2: Kiểm tra công thức DAX – đặc biệt là các hàm tính toán có can thiệp filter như CALCULATE, ALL, ALLEXCEPT xem đã bao phủ đúng phạm vi chưa.\n"
        "Bước 3: Kiểm tra mối quan hệ (Relationship) trong Data Model – rà soát xem có dòng dữ liệu nào trong Fact bị rơi vào trường hợp không khớp khóa ngoại (orphan keys) với bảng Dim hay không.\n"
        "Bước 4: Đối chiếu lại câu lệnh SQL truy vấn DWH – viết lại query đối soát với cùng điều kiện GROUP BY và WHERE để xác định chính xác sai lệch bắt nguồn từ khâu nào.\n"
        "Nhờ quy trình chặt chẽ này, trong 62 test cases UAT của dự án, toàn bộ số liệu cuối cùng đều đạt Variance = 0 tuyệt đối.\""
    )

    # Q2
    add_h3("Câu hỏi 2: Trong Dashboard Công nợ, làm thế nào để em tính toán được dải tuổi nợ quá hạn (Aging Schedule)?")
    add_p("Gợi ý trả lời:", bold_prefix="💡 ")
    add_p(
        "\"Thưa Thầy Cô, để phân rã 7 dải tuổi nợ quá hạn (từ 1-30 ngày cho đến trên 1095 ngày), em kết hợp cả cấp độ DWH và Power BI:\n"
        "- Ở tầng DWH: Em tạo trường tính toán chênh lệch số ngày: DaysOverdue = DATEDIFF(day, DueDate, GETDATE()). Sau đó dùng lệnh CASE WHEN để gán vào từng dải tuổi nợ chuẩn.\n"
        "- Ở tầng Power BI: Em tạo bảng Dim_DebtAging có cột AgingOrder (thứ tự sắp xếp từ 1 đến 7). Khi đưa lên biểu đồ thanh nằm ngang, các dải tuổi nợ sẽ được sắp xếp chuẩn xác theo trình tự thời gian thay vì bị xếp lộn xộn theo thứ tự bảng chữ cái.\""
    )

    # Q3
    add_h3("Câu hỏi 3: Giá trị thực tiễn lớn nhất mà hệ thống Dashboard này mang lại cho Ban Lãnh đạo Sovigaz là gì?")
    add_p("Gợi ý trả lời:", bold_prefix="💡 ")
    add_p(
        "\"Thưa Thầy Cô, giá trị lớn nhất chính là 'Chuyển đổi từ Quản trị Bị động sang Ra quyết định Chủ động dựa trên Dữ liệu tức thời (Data-Driven Decision Making)':\n"
        "1. Tốc độ thông tin: Thay vì phải chờ đến ngày 10 của tháng sau mới tổng hợp xong báo cáo qua các file Excel rời rạc, Ban Giám đốc có thể nhìn thấy dòng tiền 1.111 tỷ và số nợ 668 tỷ theo thời gian thực mỗi ngày.\n"
        "2. Kiểm soát sớm rủi ro công nợ: Hệ thống phát đi cảnh báo đỏ với 59 tỷ nợ quá hạn 181-365 ngày để kích hoạt thu hồi ngay trước khi chuyển thành nợ xấu không thể đòi.\n"
        "3. Tối ưu hóa điều phối sản xuất: Nhìn thấy xí nghiệp Khánh Hội hay Bình Dương vượt kế hoạch sản xuất 130-175%, công ty có thể chủ động điều phối đơn hàng và nguồn nguyên liệu khí giữa các chi nhánh để tối đa hóa lợi nhuận toàn hệ thống.\""
    )

    # Save document
    out_dir = r"C:\Users\DELL-587K9L3\Documents\Môn học kì này\INDA\Project Sovigaz\6. Viết báo cáo và slide"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "Kich_ban_Thuyet_trinh_Bao_cao_Sovigaz.docx")
    doc.save(out_path)
    print("Successfully generated presentation script docx!")

    # Also copy to Website public folder so users can download it directly from web if needed
    web_public = r"C:\Users\DELL-587K9L3\Documents\Môn học kì này\INDA\Project Sovigaz\Website\public"
    if os.path.exists(web_public):
        copy_path = os.path.join(web_public, "Kich_ban_Thuyet_trinh_Bao_cao_Sovigaz.docx")
        doc.save(copy_path)
        print("Also saved copy to Web public folder successfully!")

if __name__ == "__main__":
    create_presentation_script_document()
