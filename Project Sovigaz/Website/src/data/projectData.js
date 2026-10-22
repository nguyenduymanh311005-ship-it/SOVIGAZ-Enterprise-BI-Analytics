// Du lieu du an Kho Du lieu & Bao cao Quan tri Sovigaz
export const companyInfo = {
  "fullName": "Công ty Cổ phần Hơi Kỹ nghệ Que Hàn (SOVIGAZ)",
  "brandName": "SOVIGAZ",
  "foundedYear": 1974,
  "headquarters": "Thành phố Hồ Chí Minh, Việt Nam",
  "coreBusiness": [
    "Sản xuất và cung ứng khí công nghiệp: Oxy khí, Oxy lỏng, Nitơ, Argon, CO2, Axetylen",
    "Sản xuất và kinh doanh khí y tế tinh khiết phục vụ hệ thống bệnh viện toàn quốc",
    "Sản xuất que hàn điện, dây hàn và hóa chất công nghiệp cơ khí",
    "Dịch vụ vận chuyển chuyên dụng và thi công lắp đặt hệ thống bồn chứa khí công nghiệp áp lực cao",
    "Kiểm định kỹ thuật an toàn thiết bị áp lực và bồn khí công nghiệp"
  ],
  "legacyText": "Được thành lập từ năm 1974 với tiền thân là sự hợp nhất giữa Phân khu Việt Nam S.O.A.E.O và Công ty Việt Nam Hơi Kỹ nghệ, Sovigaz là doanh nghiệp tiên phong và giữ vị thế nòng cốt trong ngành khí công nghiệp và que hàn tại Việt Nam."
};

export const projectOverview = {
  "projectName": "Xây dựng Hệ thống Kho Dữ liệu Doanh nghiệp & Báo cáo Quản trị Sovigaz",
  "partner": "Công ty TNHH Giải pháp Phân tích Dữ liệu Insight Data (INDA)",
  "completionDate": "18/04/2025",
  "currentStatus": "Đã hoàn thiện thiết kế DWH, quy trình ETL và bộ tài liệu đặc tả BRD & Data Dictionary",
  "systemArchitecture": {
    "sourceSystems": [
      "Phần mềm kế toán MISA AMIS (Bán hàng, Công nợ, Hóa đơn chứng từ)",
      "Hệ thống biểu mẫu sản xuất & kế hoạch KPI xí nghiệp (Biểu mẫu A3, Sản xuất theo tháng)"
    ],
    "rdbms": "Microsoft SQL Server (Enterprise Data Warehouse)",
    "etlTool": "SQL Server Integration Services (SSIS) & Python Pipeline Scripts",
    "biTool": "Microsoft Power BI (DAX Measures & Row-Level Security)",
    "webPortal": "ReactJS, Tailwind CSS, Firebase Hosting & Firestore"
  },
  "keyMetrics": {
    "revenueRecords": "229,099+",
    "kpiRecords": "12,150+",
    "totalTables": 19,
    "factTablesCount": 7,
    "dimTablesCount": 12,
    "governedReports": 5,
    "maxVarianceLimit": "< 10 triệu VND"
  },
  "challenges": [
    {
      "title": "Phân mảnh nguồn dữ liệu",
      "desc": "Dữ liệu bán hàng và hóa đơn nằm trên MISA AMIS, trong khi dữ liệu chỉ tiêu kế hoạch và sản xuất thực tế tại các xí nghiệp được lưu trữ rời rạc trên nhiều tệp Excel."
    },
    {
      "title": "Thiếu kho dữ liệu tập trung",
      "desc": "Chưa có mô hình chuẩn hóa để liên kết dòng doanh thu với mã đơn vị sản xuất, kế hoạch KPI và danh mục 21 nhóm sản phẩm quy đổi theo đơn vị chuẩn (DVC)."
    },
    {
      "title": "Yêu cầu kép về báo cáo",
      "desc": "Lãnh đạo yêu cầu bảng điều khiển trực quan tương tác tức thời, trong khi phòng Kế toán và Kế hoạch vẫn cần xuất ngược ra 4 file Excel theo đúng cấu trúc biểu mẫu A3 truyền thống."
    }
  ],
  "teamMembers": [
    {
      "name": "Anh Phước",
      "role": "Quản trị Dự án (PM) — Sovigaz",
      "responsibility": "Chịu trách nhiệm chính về mặt kỹ thuật phía khách hàng, đầu mối phối hợp hạ tầng CSDL Sovigaz, kiểm soát tiến độ và phê duyệt tài liệu."
    },
    {
      "name": "Chị Nghĩa",
      "role": "Kế toán trưởng & Phụ trách Nghiệp vụ — Sovigaz",
      "responsibility": "Quản lý số liệu nghiệp vụ, quy định nguyên tắc chuẩn hóa dữ liệu, xác định ngưỡng dung sai độ lệch cho phép (< 10 triệu VND) và kiểm thử đối soát số liệu."
    },
    {
      "name": "Đặng Anh Tùng",
      "role": "Chủ trì Dự án & Kỹ sư Dữ liệu (Lead DE/DA) — INDA",
      "responsibility": "Khảo sát nghiệp vụ, thiết kế mô hình dữ liệu DWH, xây dựng quy trình ETL SSIS/Python, xây dựng báo cáo Power BI và tài liệu bàn giao."
    }
  ],
  "milestones": [
    {
      "phase": "Khảo sát & Thu thập Yêu cầu",
      "time": "Tháng 11/2024 - 12/2024",
      "status": "Hoàn thành",
      "details": "Khảo sát quy trình hạch toán MISA, phỏng vấn phòng kế toán và ban kế hoạch sản xuất, lập hồ sơ hiện trạng và phân loại biểu mẫu."
    },
    {
      "phase": "Đặc tả Nghiệp vụ & Thiết kế DWH",
      "time": "Tháng 12/2024 - 01/2025",
      "status": "Hoàn thành",
      "details": "Ban hành BRD 5 báo cáo trọng tâm, hoàn thiện Từ điển dữ liệu (Data Dictionary 19 bảng) và thiết kế mô hình ERD Star/Snowflake Schema."
    },
    {
      "phase": "Phát triển ETL & Nạp Kho Dữ liệu",
      "time": "Tháng 01/2025 - 02/2025",
      "status": "Hoàn thành",
      "details": "Xây dựng các gói SSIS và script Python làm sạch, chuẩn hóa danh mục khách hàng, nhóm sản phẩm và nạp 229,000+ bản ghi vào CSDL SQL Server."
    },
    {
      "phase": "Xây dựng Báo cáo Power BI & DAX",
      "time": "Tháng 02/2025 - 03/2025",
      "status": "Hoàn thành",
      "details": "Thiết kế 5 báo cáo quản trị, lập trình hơn 40 công thức DAX tính toán tỷ trọng, YoY, % hoàn thành KPI và luân chuyển nội bộ."
    },
    {
      "phase": "Kiểm thử Hệ thống (SIT & UAT)",
      "time": "Tháng 03/2025 - 04/2025",
      "status": "Hoàn thành",
      "details": "Đối soát số liệu chéo giữa Power BI, MISA AMIS và biểu mẫu Excel gốc. Đảm bảo độ lệch doanh thu đạt chuẩn dưới 10 triệu đồng."
    },
    {
      "phase": "Nghiệm thu & Bàn giao Hệ thống",
      "time": "18/04/2025",
      "status": "Hoàn thành",
      "details": "Bàn giao tài liệu kỹ thuật, quy trình vận hành ETL, 4 template xuất dữ liệu A3 tự động từ Power BI cho đội ngũ Sovigaz."
    }
  ]
};

export const dataDictionaryTables = [
  {
    "id": "DM_RevenueBySaleLedger",
    "tableName": "DM_RevenueBySaleLedger",
    "businessName": "Datamart Doanh thu Bán hàng Chi tiết",
    "tableType": "Fact / Data Mart",
    "domain": "Bán hàng & Doanh thu",
    "columnCount": 29,
    "rowCount": 229099,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Bán hàng & Doanh thu  |  Nguồn: MISA AMIS (Sổ chi tiết bán hàng)  |  Số dòng: 229,099  |  Khóa chính: RefNo, InvNo, AccountObjectCode, InventoryItemCode_New",
    "columns": [
      {
        "stt": 1,
        "fieldName": "AccountObjectID",
        "constraint": "Khóa ngoại (FK -> Dim_Customer(CustomerID)), Cho phép NULL",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "ID Khách hàng (GUID): Mã định danh duy nhất của khách hàng trên hệ thống MISA (dạng GUID).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Customer"
      },
      {
        "stt": 2,
        "fieldName": "AccountObjectNameDI",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên đối tượng khách hàng: Tên đầy đủ của khách hàng hoặc đơn vị mua hàng trên hóa đơn chứng từ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "InventoryItemCode",
        "constraint": "Khóa ngoại (FK -> Dim_Products(InventoryItemCode)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã hàng MISA: Mã vật tư/hàng hóa ban đầu theo danh mục kế toán trên MISA.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Products"
      },
      {
        "stt": 4,
        "fieldName": "InventoryItemName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên mặt hàng bán: Tên mô tả của mặt hàng/vật tư xuất bán trên chứng từ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "Revenue",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Doanh thu thuần (VND): Doanh thu thuần sau chiết khấu và chưa bao gồm thuế GTGT.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "SaleAmount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Tiền hàng trước thuế / Số lượng: Tổng giá trị tiền hàng bán trước thuế GTGT (VND) hoặc lượng giao dịch theo ngữ cảnh chứng từ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "RefDate",
        "constraint": "Khóa ngoại (FK -> Dim_Date(Date)), Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày chứng từ: Ngày lập chứng từ bán hàng trên phần mềm MISA (định dạng YYYY-MM-DD).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Date"
      },
      {
        "stt": 8,
        "fieldName": "UnitPrice",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Đơn giá bán giao dịch: Đơn giá bán của một đơn vị sản phẩm theo đơn vị tính giao dịch (chưa bao gồm VAT).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "ReceiptAmount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Tổng tiền thanh toán: Tổng số tiền thanh toán của hóa đơn, bao gồm tiền hàng và thuế GTGT (VND). Dùng để tính doanh thu: ReceiptAmount - VATAmount.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "VATAmount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Tiền thuế GTGT: Số tiền thuế giá trị gia tăng (VAT) ghi nhận trên hóa đơn (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 11,
        "fieldName": "RefNo",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(50)",
        "description": "Số chứng từ: Số chứng từ bán hàng trên MISA (VD: BD00000277, BH00000409).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 12,
        "fieldName": "InvNo",
        "constraint": "Khóa chính (PK)",
        "dataType": "BIGINT",
        "description": "Số hóa đơn GTGT: Số hóa đơn tài chính phát hành cho khách hàng (VD: 277, 409). Dùng để đếm số lượng hóa đơn/đơn hàng.",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 13,
        "fieldName": "PostedDate",
        "constraint": "Khóa ngoại (FK -> Dim_Date(Date)), Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày hạch toán: Ngày ghi sổ kế toán tài chính. Trọng yếu dùng làm khóa liên kết với bảng thời gian Dim_Date để cắt số liệu báo cáo.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Date"
      },
      {
        "stt": 14,
        "fieldName": "JournalMemo",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(500)",
        "description": "Diễn giải chứng từ: Nội dung ghi chú, giải thích chi tiết nghiệp vụ bán hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 15,
        "fieldName": "RefTypeName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Loại chứng từ: Phân loại chứng từ kế toán (VD: Bán hàng hóa trong nước chưa thu tiền, Bán hàng thu tiền ngay).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 16,
        "fieldName": "IsInvoiceExported",
        "constraint": "Cho phép NULL",
        "dataType": "BIT",
        "description": "Trạng thái xuất HĐ: Cờ xác định hóa đơn đã được xuất/phát hành hay chưa (1: Đã xuất, 0: Chưa xuất).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 17,
        "fieldName": "IsOutwardExported",
        "constraint": "Cho phép NULL",
        "dataType": "BIT",
        "description": "Trạng thái xuất kho: Cờ xác định phiếu xuất kho đã được lập và ghi sổ (1: Đã xuất kho).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 18,
        "fieldName": "RefNoFinance",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Số chứng từ tài chính: Mã định danh chứng từ dùng cho mục đích kế toán tài chính.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 19,
        "fieldName": "RefNoManagement",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Số chứng từ quản trị: Mã định danh chứng từ dùng cho mục đích kế toán quản trị nội bộ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 20,
        "fieldName": "DiscountAmount",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Tiền chiết khấu: Giá trị chiết khấu thương mại hoặc giảm giá bán hàng cho khách hàng (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 21,
        "fieldName": "BranchID",
        "constraint": "Khóa ngoại (FK -> Dim_Stock(BranchID))",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Mã chi nhánh (GUID): Mã GUID xác định chi nhánh phát sinh giao dịch bán hàng.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Stock"
      },
      {
        "stt": 22,
        "fieldName": "AccountObjectCode",
        "constraint": "Khóa ngoại (FK -> Dim_Customer(AccountObjectCode)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã khách hàng: Mã đối tượng khách hàng trên MISA. Dùng để nối với Dim_Customer lấy phân loại khách hàng (nội bộ hay bên ngoài).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Customer"
      },
      {
        "stt": 23,
        "fieldName": "MainUnitPrice",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Đơn giá chuẩn hóa (DVC): Đơn giá đã được quy đổi tương ứng với đơn vị tính chuẩn (Đơn vị chính).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 24,
        "fieldName": "MainConvertRate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(10,4)",
        "description": "Hệ số quy đổi: Tỷ lệ chuyển đổi từ đơn vị giao dịch sang đơn vị tính chuẩn (VD: 1 bình = 6 m3 thì hệ số là 6).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 25,
        "fieldName": "MainQuantity",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Số lượng chuẩn hóa (DVC): Khối lượng/sản lượng xuất bán đã quy đổi theo đơn vị tính chính (DVC) phục vụ tổng hợp đồng nhất.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 26,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Ngày giờ hệ thống thực hiện trích xuất, chuyển đổi và nạp bản ghi này vào DWH.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 27,
        "fieldName": "DB",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "VARCHAR(50)",
        "description": "Cơ sở dữ liệu nguồn: Tên cơ sở dữ liệu nguồn nơi bản ghi được trích xuất (VD: SOVIGAZ_2026_Dev).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 28,
        "fieldName": "UnitID",
        "constraint": "Khóa ngoại (FK -> Dim_Unit(UnitID)), Bắt buộc (NOT NULL)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Mã đơn vị tính: Mã GUID đơn vị tính của mặt hàng giao dịch.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Unit"
      },
      {
        "stt": 29,
        "fieldName": "InventoryItemCode_New",
        "constraint": "Khóa ngoại (FK -> Dim_Products(InventoryItemCode_New)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã sản phẩm chuẩn hóa: Mã vật tư/hàng hóa mới đã được chuẩn hóa bởi INDA/Sovigaz để đồng bộ liên kết giữa MISA và File kế hoạch Excel.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Products"
      }
    ]
  },
  {
    "id": "DM_AccountObjectDebt",
    "tableName": "DM_AccountObjectDebt",
    "businessName": "Datamart Tổng hợp Công nợ Phải thu",
    "tableType": "Fact / Data Mart",
    "domain": "Quản lý Công nợ",
    "columnCount": 8,
    "rowCount": 1494,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Quản lý Công nợ  |  Nguồn: MISA AMIS (Báo cáo tổng hợp công nợ chi tiết)  |  Số dòng: 1,494  |  Khóa chính: AccountObjectCode, ReceivableAccountCode",
    "columns": [
      {
        "stt": 1,
        "fieldName": "AccountObjectCode",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Customer(AccountObjectCode))",
        "dataType": "NVARCHAR(50)",
        "description": "Mã khách hàng / đối tác: Mã định danh đối tượng công nợ trên MISA. Nối với Dim_Customer.",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Customer"
      },
      {
        "stt": 2,
        "fieldName": "AccountObjectName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên khách hàng / đối tác: Tên đầy đủ của khách hàng/đơn vị đang theo dõi công nợ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "ReceiptableDebtAmount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Số nợ còn lại cuối kỳ: Số tiền công nợ còn phải thu tại thời điểm chốt số liệu (VND). Công thức: Dư đầu kỳ + Phát sinh - Đã thanh toán.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "PaidAmount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Số tiền đã thanh toán: Tổng số tiền khách hàng đã thanh toán/trả nợ trong kỳ (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian hệ thống nạp dữ liệu vào bảng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "ReceivableAccountCode",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Account(Account))",
        "dataType": "NVARCHAR(20)",
        "description": "Tài khoản công nợ: Số hiệu tài khoản kế toán theo dõi công nợ (131: Phải thu khách hàng, 136/1361: Phải thu nội bộ, 344: Nhận ký quỹ, ký cược...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Account"
      },
      {
        "stt": 7,
        "fieldName": "OpeningBalance",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Số dư nợ đầu kỳ: Số tiền nợ còn lại chuyển từ kỳ kế toán trước sang kỳ này (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "PeriodAmount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Số nợ phát sinh trong kỳ: Tổng giá trị tiền nợ mới phát sinh thêm trong kỳ kế toán (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Fact_AnalyticsDebit",
    "tableName": "Fact_AnalyticsDebit",
    "businessName": "Fact Phân tích Tuổi nợ",
    "tableType": "Fact / Data Mart",
    "domain": "Quản lý Công nợ",
    "columnCount": 6,
    "rowCount": 1788,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Quản lý Công nợ  |  Nguồn: MISA AMIS (Báo cáo phân tích công nợ theo tuổi nợ)  |  Số dòng: 1,788  |  Khóa chính: AccountObjectCode, Account, DebtType",
    "columns": [
      {
        "stt": 1,
        "fieldName": "DebtType",
        "constraint": "Khóa chính (PK)",
        "dataType": "INT",
        "description": "Mã phân loại tuổi nợ: Mã số định danh nhóm tuổi nợ (1: Nợ trước hạn, 2: Nợ đến hạn, 3: Quá hạn 1-30 ngày, 4: Quá hạn 31-60 ngày, 5: Quá hạn >60 ngày, khó đòi...).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "Amount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Giá trị nợ (VND): Số tiền nợ rơi vào khoảng tuổi nợ tương ứng (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "DebtDescription",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Diễn giải nhóm tuổi nợ: Tên mô tả của nhóm tuổi nợ (VD: 'Nợ trước hạn 0-30 ngày', 'Nợ quá hạn 1-30 ngày', 'Nợ khó đòi'...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Ngày giờ thực hiện xử lý dữ liệu tuổi nợ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "Account",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Account(Account))",
        "dataType": "INT",
        "description": "Tài khoản công nợ: Số hiệu tài khoản công nợ (131, 136, 1361...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Account"
      },
      {
        "stt": 6,
        "fieldName": "AccountObjectCode",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Customer(AccountObjectCode))",
        "dataType": "NVARCHAR(50)",
        "description": "Mã khách hàng: Mã đối tượng khách hàng phát sinh khoản nợ.",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Customer"
      }
    ]
  },
  {
    "id": "Fact_ActualProduction",
    "tableName": "Fact_ActualProduction",
    "businessName": "Fact Sản xuất Thực tế",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columnCount": 9,
    "rowCount": 4554,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Sản xuất & KPI  |  Nguồn: File Excel Báo cáo Sản xuất từ các xí nghiệp  |  Số dòng: 4,554  |  Khóa chính: CategoryName, Date, FactoryCode",
    "columns": [
      {
        "stt": 1,
        "fieldName": "CategoryName",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_ProductCategories(CategoryName))",
        "dataType": "NVARCHAR(50)",
        "description": "Mã nhóm sản phẩm chuẩn: Mã danh mục nhóm sản phẩm sản xuất (VD: 1_OXY KHÍ, 2_OXY LỎNG, 9.0_QH48...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_ProductCategories"
      },
      {
        "stt": 2,
        "fieldName": "ProductName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên sản phẩm: Tên tiếng Việt của sản phẩm sản xuất (Oxy khí, Oxy lỏng, Que hàn...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "ProductQuantity",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Sản lượng sản xuất (DVT): Sản lượng tự sản xuất thực tế tính theo đơn vị tính thông thường tại xí nghiệp.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "PurchaseQuantity",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Sản lượng mua ngoài: Số lượng mua bổ sung từ nhà cung cấp bên ngoài nhập kho.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "ProductQuantityDVC",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Sản lượng sản xuất (DVC): Sản lượng sản xuất quy đổi về đơn vị chuẩn đồng nhất của toàn tổng công ty.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "ProductValue",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Giá trị sản xuất thực tế: Tổng giá trị quy tiền của sản lượng sản xuất thực tế đạt được trong tháng (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "Date",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Date(Date))",
        "dataType": "DATETIME",
        "description": "Tháng ghi nhận: Ngày đầu của tháng ghi nhận số liệu sản xuất (YYYY-MM-01).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Date"
      },
      {
        "stt": 8,
        "fieldName": "FactoryCode",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Stock(StockCode))",
        "dataType": "NVARCHAR(20)",
        "description": "Mã nhà máy / xí nghiệp: Mã viết tắt xí nghiệp thực hiện sản xuất (BD: Bình Dương, BH: Biên Hòa, CT: Cần Thơ, HP: Hải Phòng, KH: Khánh Hội, NT: Nha Trang...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Stock"
      },
      {
        "stt": 9,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian xử lý nạp dữ liệu từ file Excel vào DWH.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Fact_KPI_Month",
    "tableName": "Fact_KPI_Month",
    "businessName": "Fact Kế hoạch KPI Tháng",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columnCount": 13,
    "rowCount": 12150,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Sản xuất & KPI  |  Nguồn: File Excel Kế hoạch A3 Tháng của Sovigaz  |  Số dòng: 12,150  |  Khóa chính: StockCode, InventoryCodePlan, Date",
    "columns": [
      {
        "stt": 1,
        "fieldName": "Indicator",
        "constraint": "Khóa ngoại (FK -> Dim_Indicator(Indicator)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã loại chỉ tiêu: Mã chỉ tiêu (SP: Sản phẩm, VT-HH: Vật tư hàng hóa, DV: Dịch vụ).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Indicator"
      },
      {
        "stt": 2,
        "fieldName": "StockCode",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Stock(StockCode))",
        "dataType": "NVARCHAR(20)",
        "description": "Mã chi nhánh / xí nghiệp: Mã xí nghiệp được giao chỉ tiêu kế hoạch (BD, BH, CT, HP...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Stock"
      },
      {
        "stt": 3,
        "fieldName": "InventoryCodePlan",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_ProductCategories(CategoryName))",
        "dataType": "NVARCHAR(50)",
        "description": "Mã sản phẩm kế hoạch: Mã dòng sản phẩm theo quy định kế hoạch (VD: 1_OXY KHÍ, 8.1_CO2 KHÍ, 9.2_QH7018...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_ProductCategories"
      },
      {
        "stt": 4,
        "fieldName": "InventoryItemName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên sản phẩm kế hoạch: Tên sản phẩm tương ứng trong bảng kế hoạch tháng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "InventoryItemGroup",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Nhóm sản phẩm: Nhóm ngành hàng (Oxy, Ni tơ, Argon, Que hàn...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "ProductionValue",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KPI Giá trị sản xuất: Kế hoạch giá trị sản xuất phải đạt được trong tháng (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "ProductUnit",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KPI Sản lượng SX (DVT): Chỉ tiêu sản lượng sản xuất theo đơn vị tính thường.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "ProductUnitDVC",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KPI Sản lượng SX (DVC): Chỉ tiêu sản lượng sản xuất quy đổi theo đơn vị chuẩn.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "QuantityDVT",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KPI Sản lượng tiêu thụ (DVT): Kế hoạch sản lượng hàng bán ra theo đơn vị tính thường.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "QuantityDVC",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KPI Sản lượng tiêu thụ (DVC): Kế hoạch sản lượng hàng bán ra quy đổi theo đơn vị tính chuẩn.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 11,
        "fieldName": "Amount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KPI Doanh thu tháng: Chỉ tiêu doanh thu kế hoạch bán hàng trong tháng (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 12,
        "fieldName": "Date",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Date(Date))",
        "dataType": "DATETIME",
        "description": "Tháng kế hoạch: Ngày đầu của tháng giao KPI (YYYY-MM-01).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Date"
      },
      {
        "stt": 13,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian chạy pipeline xử lý dữ liệu unpivot từ Excel.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Fact_KPI_Year",
    "tableName": "Fact_KPI_Year",
    "businessName": "Fact Kế hoạch KPI Tổng thể Năm",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columnCount": 5,
    "rowCount": 40,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Sản xuất & KPI  |  Nguồn: File Excel Kế hoạch A3 Năm  |  Số dòng: 40  |  Khóa chính: Parent_Stock, Year",
    "columns": [
      {
        "stt": 1,
        "fieldName": "Parent_Stock",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_ParentStock(ParentStockCode))",
        "dataType": "NVARCHAR(20)",
        "description": "Mã tổng kho / xí nghiệp: Mã đơn vị/xí nghiệp cấp quản lý được giao kế hoạch năm.",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_ParentStock"
      },
      {
        "stt": 2,
        "fieldName": "Production",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Kế hoạch sản xuất năm: Tổng giá trị sản xuất kế hoạch cả năm của đơn vị (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "Amount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Kế hoạch doanh thu năm: Tổng doanh thu kế hoạch cả năm của đơn vị (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "Year",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Year(Value))",
        "dataType": "INT",
        "description": "Năm kế hoạch: Năm giao chỉ tiêu kế hoạch (2022, 2023, 2024, 2025, 2026...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Year"
      },
      {
        "stt": 5,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian xử lý nạp dữ liệu.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Fact_KPI_By_Product",
    "tableName": "Fact_KPI_By_Product",
    "businessName": "Fact Kế hoạch KPI Sản phẩm theo Năm",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columnCount": 12,
    "rowCount": 1123,
    "metaInfo": "Loại bảng: Fact / Data Mart  |  Phân hệ: Sản xuất & KPI  |  Nguồn: File Excel Kế hoạch Sản phẩm A3  |  Số dòng: 1,123  |  Khóa chính: StockCode, CategoryName, Year",
    "columns": [
      {
        "stt": 1,
        "fieldName": "RevenueCode",
        "constraint": "Khóa ngoại (FK -> Dim_Indicator(Indicator)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã chỉ tiêu: Mã nhóm chỉ tiêu (SP, VT, HH, DV).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Indicator"
      },
      {
        "stt": 2,
        "fieldName": "StockCode",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Stock(StockCode))",
        "dataType": "NVARCHAR(20)",
        "description": "Mã xí nghiệp: Mã chi nhánh/xí nghiệp áp dụng KPI.",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Stock"
      },
      {
        "stt": 3,
        "fieldName": "CategoryName",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_ProductCategories(CategoryName))",
        "dataType": "NVARCHAR(50)",
        "description": "Mã nhóm sản phẩm: Mã nhóm sản phẩm (VD: 1_OXY KHÍ, 9.0_QH48...).",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_ProductCategories"
      },
      {
        "stt": 4,
        "fieldName": "ProductName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên sản phẩm: Tên gọi sản phẩm.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "ProductCategoryName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên nhóm sản phẩm: Tên phân nhóm mặt hàng (Que hàn, Khí CO2, Dây thép đai...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "ProductQuantityDVT",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KHSX theo DVT: Kế hoạch sản lượng sản xuất cả năm theo đơn vị tính thường.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "ProductQuantityDVC",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KHSX theo DVC: Kế hoạch sản lượng sản xuất cả năm quy đổi đơn vị chuẩn.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "ProductQuantityDVT1",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KHTT theo DVT: Kế hoạch sản lượng tiêu thụ cả năm theo đơn vị tính thường.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "SaleQuantityDVC",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "KHTT theo DVC: Kế hoạch sản lượng tiêu thụ cả năm quy đổi đơn vị chuẩn.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "Amount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Kế hoạch doanh thu năm: Kế hoạch doanh thu bán hàng cả năm của sản phẩm tại chi nhánh (VND).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 11,
        "fieldName": "Year",
        "constraint": "Khóa chính & Khóa ngoại (PK, FK -> Dim_Year(Value))",
        "dataType": "INT",
        "description": "Năm kế hoạch: Năm áp dụng kế hoạch.",
        "isPk": true,
        "isFk": true,
        "refTable": "Dim_Year"
      },
      {
        "stt": 12,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian xử lý dữ liệu.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Customer",
    "tableName": "Dim_Customer",
    "businessName": "Chiều Khách hàng & Đối tác",
    "tableType": "Dimension",
    "domain": "Khách hàng & Đối tác",
    "columnCount": 19,
    "rowCount": 6051,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Khách hàng & Đối tác  |  Nguồn: MISA AMIS & File Excel phân loại chi nhánh  |  Số dòng: 6,051  |  Khóa chính: AccountObjectCode",
    "columns": [
      {
        "stt": 1,
        "fieldName": "CustomerID",
        "constraint": "Cho phép NULL",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "ID khách hàng (GUID): Mã định danh duy nhất của khách hàng trên hệ thống MISA.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "CustomerName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên đầy đủ khách hàng: Tên công ty, bệnh viện, cơ sở y tế hoặc cá nhân khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "AccountObjectCode",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã đối tượng khách hàng: Mã định danh nghiệp vụ kế toán của khách hàng (VD: BDBV78, TKHIEP).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "Address",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(500)",
        "description": "Địa chỉ trụ sở / giao dịch: Địa chỉ liên hệ hoặc địa chỉ giao hàng của khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "CompanyTaxCode",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Mã số thuế doanh nghiệp: Mã số thuế của doanh nghiệp khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "Tel",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Điện thoại bàn: Số điện thoại cố định của khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "Mobile",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Điện thoại di động: Số điện thoại liên hệ cá nhân.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "Fax",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Số Fax: Số fax doanh nghiệp.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "EmailAddress",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(100)",
        "description": "Địa chỉ Email: Hòm thư điện tử liên hệ nhận hóa đơn điện tử.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "Website",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(200)",
        "description": "Trang web: Trang thông tin điện tử của khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 11,
        "fieldName": "AccountObjectGroupListName",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(100)",
        "description": "Nhóm khách hàng MISA: Phân loại nhóm khách hàng trên phần mềm kế toán (NL, CN, ĐL, BV...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 12,
        "fieldName": "Country",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Quốc gia: Quốc gia của khách hàng (mặc định: Việt Nam).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 13,
        "fieldName": "ProvinceOrCity",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(100)",
        "description": "Tỉnh / Thành phố: Tỉnh thành nơi khách hàng đăng ký hoạt động.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 14,
        "fieldName": "District",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(100)",
        "description": "Quận / Huyện: Quận/huyện của khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 15,
        "fieldName": "WardOrCommune",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(100)",
        "description": "Phường / Xã: Phường/xã địa chỉ khách hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 16,
        "fieldName": "BranchID",
        "constraint": "Khóa ngoại (FK -> Dim_Stock(BranchID))",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Mã chi nhánh quản lý (GUID): Mã GUID chi nhánh phụ trách quản lý khách hàng.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Stock"
      },
      {
        "stt": 17,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian đồng bộ dữ liệu vào DWH.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 18,
        "fieldName": "Excel_Customer_Category",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Phân loại khách hàng chuẩn hóa: Cột nghiệp vụ then chốt: KHNB (Khách hàng nội bộ), NB (Nội bộ), BV (Bệnh viện), ĐL (Đại lý), NL (Người liên quan/ngoài). Dùng trong logic DAX để tách doanh thu bán ngoài vs LCNB.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 19,
        "fieldName": "StockCode",
        "constraint": "Khóa ngoại (FK -> Dim_Stock(StockCode)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã xí nghiệp phụ trách: Mã chi nhánh/xí nghiệp chăm sóc khách hàng (BD, BH, CT, HP, KH, NT, TK, VP).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Stock"
      }
    ]
  },
  {
    "id": "Dim_Products",
    "tableName": "Dim_Products",
    "businessName": "Chiều Vật tư, Hàng hóa, Thành phẩm",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columnCount": 63,
    "rowCount": 8391,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Vật tư & Sản phẩm  |  Nguồn: MISA AMIS & Danh mục chuẩn hóa Sovigaz  |  Số dòng: 8,391  |  Khóa chính: InventoryItemCode_New",
    "columns": [
      {
        "stt": 1,
        "fieldName": "InventoryItemID",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "ID sản phẩm (GUID): Khóa chính GUID của sản phẩm trên phần mềm MISA.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "BranchID",
        "constraint": "Khóa ngoại (FK -> Dim_Stock(BranchID))",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Chi nhánh quản lý (GUID): Mã chi nhánh quản lý sản phẩm.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Stock"
      },
      {
        "stt": 3,
        "fieldName": "BarCode",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Mã vạch sản phẩm: Mã vạch quản lý hàng hóa.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "InventoryItemCode",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã hàng gốc MISA: Mã vật tư/sản phẩm nguyên bản trên CSDL MISA.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "InventoryItemName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(255)",
        "description": "Tên vật tư / sản phẩm: Tên mô tả của mặt hàng/vật tư.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "InventoryItemType",
        "constraint": "Khóa ngoại (FK -> Dim_InventoryItemType(InventoryItemTypeValue)), Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Loại vật tư (Mã số): Mã loại vật tư: 0: Vật tư hàng hóa, 1: Thành phẩm, 2: Dịch vụ...",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_InventoryItemType"
      },
      {
        "stt": 7,
        "fieldName": "InventoryItemCategoryList",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(255)",
        "description": "Danh sách nhóm VT: Danh sách mã GUID nhóm vật tư liên quan.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "InventoryItemCategoryCode",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Mã nhóm ngành MISA: Mã nhóm vật tư trên phần mềm MISA.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "Description",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(500)",
        "description": "Diễn giải chi tiết: Mô tả quy cách, thông số kỹ thuật của sản phẩm.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "UnitID",
        "constraint": "Khóa ngoại (FK -> Dim_Unit(UnitID)), Bắt buộc (NOT NULL)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Mã đơn vị tính: Mã GUID đơn vị tính chuẩn.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Unit"
      },
      {
        "stt": 11,
        "fieldName": "GuarantyPeriod",
        "constraint": "Cho phép NULL",
        "dataType": "INT",
        "description": "Thời gian bảo hành: Thời hạn bảo hành tính theo tháng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 12,
        "fieldName": "MinimumStock",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Định mức tồn kho tối thiểu: Mức tồn kho an toàn quy định.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 13,
        "fieldName": "InventoryItemSource",
        "constraint": "Cho phép NULL",
        "dataType": "INT",
        "description": "Nguồn gốc sản phẩm: Nguồn gốc xuất xứ hàng hóa.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 14,
        "fieldName": "DefaultStockID",
        "constraint": "Cho phép NULL",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Kho ngầm định (GUID): Kho lưu trữ mặc định khi xuất nhập vật tư.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 15,
        "fieldName": "InventoryAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK kho kế toán: Tài khoản theo dõi hàng tồn kho (152, 155, 156...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 16,
        "fieldName": "COGSAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK giá vốn: Tài khoản giá vốn hàng bán (632).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 17,
        "fieldName": "SaleAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK doanh thu: Tài khoản ghi nhận doanh thu bán hàng (511).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 18,
        "fieldName": "PurchaseDiscountRate",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(5,2)",
        "description": "Tỷ lệ chiết khấu mua: Tỷ lệ chiết khấu khi mua hàng (%).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 19,
        "fieldName": "UnitPrice",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Đơn giá chuẩn: Đơn giá niêm yết chuẩn.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 20,
        "fieldName": "SalePrice1",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Giá bán 1: Bảng giá bán cấp 1.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 21,
        "fieldName": "SalePrice2",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Giá bán 2: Bảng giá bán cấp 2.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 22,
        "fieldName": "SalePrice3",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Giá bán 3: Bảng giá bán cấp 3.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 23,
        "fieldName": "FixedSalePrice",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(18,2)",
        "description": "Giá bán cố định: Giá bán cố định theo hợp đồng nguyên tắc.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 24,
        "fieldName": "IsUnitPriceAfterTax",
        "constraint": "Cho phép NULL",
        "dataType": "BIT",
        "description": "Giá đã gồm thuế: Cờ xác định đơn giá đã gồm VAT hay chưa.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 25,
        "fieldName": "TaxRate",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(5,2)",
        "description": "Thuế suất GTGT (%): Mức thuế suất VAT áp dụng cho sản phẩm (0%, 5%, 8%, 10%).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 26,
        "fieldName": "ImportTaxRate",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(5,2)",
        "description": "Thuế nhập khẩu (%): Thuế suất nhập khẩu áp dụng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 27,
        "fieldName": "ExportTaxRate",
        "constraint": "Cho phép NULL",
        "dataType": "DECIMAL(5,2)",
        "description": "Thuế xuất khẩu (%): Thuế suất xuất khẩu áp dụng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 28,
        "fieldName": "InventoryCategorySpecialTaxID",
        "constraint": "Cho phép NULL",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Thuế tiêu thụ đặc biệt ID: Mã thuế tiêu thụ đặc biệt nếu có.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 29,
        "fieldName": "IsSystem",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Là dữ liệu hệ thống: Cờ xác định danh mục mặc định của MISA.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 30,
        "fieldName": "Inactive",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Ngừng sử dụng: Cờ xác định mặt hàng còn kinh doanh hay đã ngừng (False: Còn dùng).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 31,
        "fieldName": "IsSaleDiscount",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Có chiết khấu bán: Cờ xác định mặt hàng có áp dụng chính sách chiết khấu.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 32,
        "fieldName": "DiscountType",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Loại chiết khấu: Loại hình chiết khấu áp dụng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 33,
        "fieldName": "IsFollowSerialNumber",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Theo dõi Serial/Lô: Theo dõi theo số serial/số lô chai khí.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 34,
        "fieldName": "CostMethod",
        "constraint": "Cho phép NULL",
        "dataType": "INT",
        "description": "Phương pháp tính giá vốn: Phương pháp xuất kho (Bình quân gia quyền, FIFO...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 35,
        "fieldName": "CreatedDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày tạo: Ngày tạo bản ghi trên hệ thống.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 36,
        "fieldName": "CreatedBy",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Người tạo: Tài khoản nhân sự tạo bản ghi.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 37,
        "fieldName": "ModifiedDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày chỉnh sửa: Ngày chỉnh sửa gần nhất.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 38,
        "fieldName": "ModifiedBy",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Người chỉnh sửa: Tài khoản thực hiện chỉnh sửa.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 39,
        "fieldName": "InventoryItemCategoryName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên phân nhóm vật tư: Tên nhóm mặt hàng trên MISA (Phụ tùng, Khí hóa lỏng, Que hàn...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 40,
        "fieldName": "Specificity",
        "constraint": "Cho phép NULL",
        "dataType": "INT",
        "description": "Quy cách đặc thù: Thông số kỹ thuật đặc thù.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 41,
        "fieldName": "PurchaseDescription",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(500)",
        "description": "Mô tả mua hàng: Mô tả chi tiết khi lập đơn mua hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 42,
        "fieldName": "SaleDescription",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(500)",
        "description": "Mô tả bán hàng: Mô tả chi tiết khi lập đơn bán hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 43,
        "fieldName": "TACareerGroupID",
        "constraint": "Cho phép NULL",
        "dataType": "BIGINT",
        "description": "Mã nhóm ngành thuế: Mã ngành nghề tính thuế theo quy định nhà nước.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 44,
        "fieldName": "FixedUnitPrice",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DECIMAL(18,2)",
        "description": "Đơn giá cố định: Đơn giá cố định theo biểu giá.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 45,
        "fieldName": "FrontEndFormula",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(200)",
        "description": "Công thức Front-End: Công thức tính toán giao diện.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 46,
        "fieldName": "BackEndFormula",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(200)",
        "description": "Công thức Back-End: Công thức tính toán tầng CSDL.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 47,
        "fieldName": "BaseOnFormula",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(200)",
        "description": "Dựa trên công thức: Căn cứ công thức tính giá.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 48,
        "fieldName": "IsDeleted",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Đã xóa: Cờ đánh dấu xóa mềm.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 49,
        "fieldName": "ServerRowVersion",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIGINT",
        "description": "Phiên bản hàng: Phiên bản dữ liệu đồng bộ server.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 50,
        "fieldName": "UploadState",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Trạng thái tải lên: Trạng thái upload dữ liệu.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 51,
        "fieldName": "IsCRM",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Đồng bộ CRM: Cờ cho phép đồng bộ sang phần mềm CRM.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 52,
        "fieldName": "NotAllowSyncToCRM",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Chặn đồng bộ CRM: Cờ ngăn chặn đồng bộ sang CRM.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 53,
        "fieldName": "InventoryItemCategoryIDList",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(500)",
        "description": "Chuỗi ID danh mục: Chuỗi chứa các ID nhóm vật tư phân cấp.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 54,
        "fieldName": "DiscountAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK chiết khấu: Tài khoản kế toán hạch toán chiết khấu (5211).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 55,
        "fieldName": "SaleOffAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK giảm giá: Tài khoản kế toán giảm giá hàng bán (5213).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 56,
        "fieldName": "ReturnAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK trả lại hàng: Tài khoản hàng bán bị trả lại (5212).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 57,
        "fieldName": "ReplaceInventoryItemID",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "ID mặt hàng thay thế: Mã hàng thay thế khi hết hàng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 58,
        "fieldName": "ReplaceInventoryItemName",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(255)",
        "description": "Tên hàng thay thế: Tên mặt hàng thay thế.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 59,
        "fieldName": "ProcessAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK gia công: Tài khoản chi phí gia công chế biến.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 60,
        "fieldName": "Excel_Product_Name",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(255)",
        "description": "Tên SP theo Excel: Tên sản phẩm tương ứng trong file Excel của Sovigaz.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 61,
        "fieldName": "Excel_Category_Name",
        "constraint": "Khóa ngoại (FK -> Dim_ProductCategories(CategoryName)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Nhóm SP theo Excel: Tên nhóm sản phẩm chuẩn hóa dùng liên kết với Dim_ProductCategories (VD: 1_OXY KHÍ, VT, HH, DV...).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_ProductCategories"
      },
      {
        "stt": 62,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian nạp dữ liệu vào DWH.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 63,
        "fieldName": "InventoryItemCode_New",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã sản phẩm chuẩn hóa mới: Khóa chính nghiệp vụ chuẩn hóa mới do dự án thiết kế, đảm bảo liên kết toàn vẹn với bảng Fact Bán hàng và Kế hoạch KPI.",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_ProductCategories",
    "tableName": "Dim_ProductCategories",
    "businessName": "Chiều Nhóm Sản phẩm Chuẩn hóa",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columnCount": 5,
    "rowCount": 20,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Vật tư & Sản phẩm  |  Nguồn: Quy định phân loại sản phẩm của Sovigaz  |  Số dòng: 20  |  Khóa chính: CategoryName",
    "columns": [
      {
        "stt": 1,
        "fieldName": "Indicator",
        "constraint": "Khóa ngoại (FK -> Dim_Indicator(Indicator)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã chỉ tiêu: Mã phân loại chỉ tiêu lớn (SP: Sản phẩm, VT, HH: Vật tư hàng hóa, DV: Dịch vụ, DTTC + DT KHÁC).",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_Indicator"
      },
      {
        "stt": 2,
        "fieldName": "CategoryName",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(50)",
        "description": "Mã danh mục chuẩn: Mã phân nhóm sản phẩm chuẩn (VD: 1_OXY KHÍ, 2_OXY LỎNG, 3_NITO KHÍ, 8.1_CO2 KHÍ, 9.0_QH48...).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "Name",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên sản phẩm chuẩn: Tên gọi chuẩn tiếng Việt (Oxy khí, Oxy lỏng, Ni tơ khí, Que hàn N48...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "Group",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Nhóm ngành khí / vật tư: Tên phân nhóm cấp cao (Oxy, Ni tơ, Argon, Que hàn, CO2 Khí, VT,HH, Dịch vụ...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian cập nhật danh mục.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Indicator",
    "tableName": "Dim_Indicator",
    "businessName": "Chiều Chỉ tiêu Doanh thu",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columnCount": 3,
    "rowCount": 4,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Vật tư & Sản phẩm  |  Nguồn: Hệ thống quản lý chỉ tiêu Sovigaz  |  Số dòng: 4  |  Khóa chính: Indicator",
    "columns": [
      {
        "stt": 1,
        "fieldName": "Indicator",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã chỉ tiêu: Mã viết tắt chỉ tiêu: SP, VT, HH, DV, DTTC + DT KHÁC.",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "Name",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên chỉ tiêu kinh doanh: Diễn giải đầy đủ: Doanh thu từ sản phẩm, Doanh thu vật tư hàng hóa, Doanh thu dịch vụ, Doanh thu tài chính và khác.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian nạp danh mục.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_InventoryItemType",
    "tableName": "Dim_InventoryItemType",
    "businessName": "Chiều Loại Vật tư Hàng hóa",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columnCount": 7,
    "rowCount": 4,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Vật tư & Sản phẩm  |  Nguồn: Phần mềm kế toán MISA  |  Số dòng: 4  |  Khóa chính: InventoryItemTypeValue",
    "columns": [
      {
        "stt": 1,
        "fieldName": "InventoryItemTypeValue",
        "constraint": "Khóa chính (PK)",
        "dataType": "INT",
        "description": "Mã loại vật tư (Số): Giá trị số phân loại (0, 1, 2...).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "InventoryItemTypeName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Tên loại vật tư: Tên bản chất mặt hàng: Vật tư hàng hóa, Thành phẩm, Dịch vụ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "CreatedBy",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Người tạo: Tài khoản người tạo.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "CreatedDate",
        "constraint": "Cho phép NULL",
        "dataType": "DATETIME",
        "description": "Ngày tạo: Ngày tạo bản ghi.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "ModifiedBy",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Người sửa: Người chỉnh sửa gần nhất.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "ModifiedDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày sửa: Ngày sửa gần nhất.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian nạp dữ liệu.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Unit",
    "tableName": "Dim_Unit",
    "businessName": "Chiều Đơn vị Tính",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columnCount": 13,
    "rowCount": 122,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Vật tư & Sản phẩm  |  Nguồn: Phần mềm MISA AMIS  |  Số dòng: 122  |  Khóa chính: UnitID",
    "columns": [
      {
        "stt": 1,
        "fieldName": "UnitID",
        "constraint": "Khóa chính (PK)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Mã đơn vị tính (GUID): Khóa chính GUID của đơn vị tính trên MISA.",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "UnitName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(50)",
        "description": "Tên đơn vị tính: Tên đơn vị đo lường: chai, m3, kg, cặp, bình, lít...",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "Description",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(255)",
        "description": "Diễn giải chi tiết: Ghi chú quy cách hoặc dịch vụ liên quan.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "Inactive",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Ngừng sử dụng: Cờ xác định đơn vị tính còn hiệu lực hay đã ngừng dùng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "IsDeleted",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Đã xóa: Cờ đánh dấu xóa mềm.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "CreatedBy",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Người tạo: Tài khoản tạo bản ghi.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "CreatedDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày tạo: Thời điểm tạo bản ghi.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "ModifiedBy",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(50)",
        "description": "Người sửa: Tài khoản sửa đổi.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "ModifiedDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày sửa: Thời điểm sửa đổi.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "RowVersion",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIGINT",
        "description": "Phiên bản dòng: Phiên bản dữ liệu nội bộ.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 11,
        "fieldName": "ServerRowVersion",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIGINT",
        "description": "Phiên bản server: Phiên bản server.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 12,
        "fieldName": "UploadState",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Trạng thái tải lên: Trạng thái upload.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 13,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian nạp dữ liệu vào DWH.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Stock",
    "tableName": "Dim_Stock",
    "businessName": "Chiều Kho & Xí nghiệp",
    "tableType": "Dimension",
    "domain": "Tổ chức & Kho bãi",
    "columnCount": 8,
    "rowCount": 10,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Tổ chức & Kho bãi  |  Nguồn: Hệ thống quản trị tổ chức Sovigaz  |  Số dòng: 10  |  Khóa chính: StockCode",
    "columns": [
      {
        "stt": 1,
        "fieldName": "StockID",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "ID kho (GUID): Khóa GUID định danh kho trên hệ thống CSDL.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "BranchID",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "UNIQUEIDENTIFIER",
        "description": "Mã chi nhánh (GUID): Mã GUID chi nhánh phụ trách kho.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "StockCode",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã xí nghiệp / kho: Mã viết tắt chính thức của xí nghiệp (BD, BH, CT, HP, KH, NT, PR, TK, VP, ZC).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "StockName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên xí nghiệp / chi nhánh: Tên đầy đủ của đơn vị (Xí nghiệp Bình Dương, Biên Hòa, Cần Thơ, Hải Phòng, Văn phòng công ty...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "Description",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(500)",
        "description": "Địa chỉ chi nhánh: Địa chỉ địa lý nơi đặt trụ sở nhà máy/chi nhánh.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "InventoryAccount",
        "constraint": "Cho phép NULL",
        "dataType": "NVARCHAR(20)",
        "description": "TK kho phụ trách: Tài khoản kế toán kho tương ứng.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "ETL_DATE",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Thời điểm ETL: Thời gian đồng bộ danh mục kho.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "ParentStockCode",
        "constraint": "Khóa ngoại (FK -> Dim_ParentStock(ParentStockCode)), Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã tổng kho quản lý: Mã đơn vị cấp tổng kho quản lý trực tiếp xí nghiệp này.",
        "isPk": false,
        "isFk": true,
        "refTable": "Dim_ParentStock"
      }
    ]
  },
  {
    "id": "Dim_ParentStock",
    "tableName": "Dim_ParentStock",
    "businessName": "Chiều Tổng kho / Cấp Quản lý",
    "tableType": "Dimension",
    "domain": "Tổ chức & Kho bãi",
    "columnCount": 2,
    "rowCount": 8,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Tổ chức & Kho bãi  |  Nguồn: Cơ cấu tổ chức công ty  |  Số dòng: 8  |  Khóa chính: ParentStockCode",
    "columns": [
      {
        "stt": 1,
        "fieldName": "ParentStockCode",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(20)",
        "description": "Mã tổng kho quản lý: Mã viết tắt của đơn vị cấp trên quản lý (BD, BH, CT, HP, KH, NT, TK, VP).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "ParentStockName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên tổng kho / xí nghiệp quản lý: Tên gọi chính thức của đơn vị cấp trên (2. XN Bình Dương, 3. XN Hơi Biên Hòa, 4. XN Hơi Cần Thơ...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Account",
    "tableName": "Dim_Account",
    "businessName": "Chiều Tài khoản Kế toán Công nợ",
    "tableType": "Dimension",
    "domain": "Quản lý Công nợ",
    "columnCount": 2,
    "rowCount": 21,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Quản lý Công nợ  |  Nguồn: Hệ thống tài khoản kế toán doanh nghiệp  |  Số dòng: 21  |  Khóa chính: Account",
    "columns": [
      {
        "stt": 1,
        "fieldName": "Account",
        "constraint": "Khóa chính (PK)",
        "dataType": "NVARCHAR(20)",
        "description": "Số hiệu tài khoản: Số hiệu tài khoản kế toán theo Thông tư 200 (131, 136, 1361, 344...).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "Description",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(100)",
        "description": "Tên gọi tài khoản: Tên đầy đủ của tài khoản (Phải thu khách hàng, Phải thu nội bộ, Nhận ký quỹ ký cược...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Date",
    "tableName": "Dim_Date",
    "businessName": "Chiều Thời gian Ngày",
    "tableType": "Dimension",
    "domain": "Tổ chức & Thời gian",
    "columnCount": 11,
    "rowCount": 73413,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Tổ chức & Thời gian  |  Nguồn: Bảng sinh tự động lịch chuẩn (Calendar Dimension)  |  Số dòng: 73,413  |  Khóa chính: DateKey, Date",
    "columns": [
      {
        "stt": 1,
        "fieldName": "DateKey",
        "constraint": "Khóa chính (PK)",
        "dataType": "INT",
        "description": "Mã khóa ngày (Số): Khóa ngày dạng số nguyên YYYYMMDD (VD: 20240112).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "Date",
        "constraint": "Khóa chính (PK)",
        "dataType": "DATETIME",
        "description": "Ngày lịch: Giá trị ngày tháng năm đầy đủ (YYYY-MM-DD 00:00:00).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "Day",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Ngày trong tháng: Số thứ tự ngày trong tháng (1 - 31).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "Month",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Tháng: Tháng trong năm (1 - 12).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "Year",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Năm: Năm dương lịch (2022, 2024, 2026...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "Quarter",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Quý: Quý trong năm (1, 2, 3, 4).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "Week",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Tuần trong năm: Tuần thứ mấy trong năm (1 - 53).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "DayOfWeek",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Thứ trong tuần: Thứ trong tuần (1: Chủ nhật, 2: Thứ hai ... 7: Thứ bảy).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "MonthName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "VARCHAR(20)",
        "description": "Tên tháng tiếng Anh: Tên tiếng Anh của tháng (January, February...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "YearMonth",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "VARCHAR(7)",
        "description": "Chuỗi Năm-Tháng: Định dạng YYYY-MM dùng hiển thị trục thời gian (VD: 2024-01).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 11,
        "fieldName": "IsWeekend",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Là cuối tuần: Cờ xác định ngày Thứ bảy hoặc Chủ nhật (True/False).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Month",
    "tableName": "Dim_Month",
    "businessName": "Chiều Thời gian Tháng",
    "tableType": "Dimension",
    "domain": "Tổ chức & Thời gian",
    "columnCount": 10,
    "rowCount": 204,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Tổ chức & Thời gian  |  Nguồn: Lịch tháng chuẩn hóa  |  Số dòng: 204  |  Khóa chính: MonthKey, YearMonth",
    "columns": [
      {
        "stt": 1,
        "fieldName": "MonthKey",
        "constraint": "Khóa chính (PK)",
        "dataType": "INT",
        "description": "Mã khóa tháng (Số): Khóa tháng dạng số nguyên YYYYMM (VD: 202605).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "Year",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Năm: Năm dương lịch.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 3,
        "fieldName": "Month",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Tháng: Chỉ số tháng (1 - 12).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 4,
        "fieldName": "MonthName",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "VARCHAR(20)",
        "description": "Tên tháng tiếng Anh: Tên tiếng Anh của tháng (May, June...).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 5,
        "fieldName": "Quarter",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "INT",
        "description": "Quý: Quý trong năm (1 - 4).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 6,
        "fieldName": "YearMonth",
        "constraint": "Khóa chính (PK)",
        "dataType": "VARCHAR(7)",
        "description": "Chuỗi Năm-Tháng: Định dạng chuỗi YYYY-MM (VD: 2026-05).",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 7,
        "fieldName": "StartDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày đầu tháng: Ngày bắt đầu của tháng (YYYY-MM-01).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 8,
        "fieldName": "EndDate",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "DATETIME",
        "description": "Ngày cuối tháng: Ngày kết thúc của tháng (YYYY-MM-28/29/30/31).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 9,
        "fieldName": "IsCurrent",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "BIT",
        "description": "Là tháng hiện tại: Cờ đánh dấu tháng hiện tại đang xử lý số liệu.",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 10,
        "fieldName": "MonthVietnamese",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "NVARCHAR(20)",
        "description": "Tên tháng tiếng Việt: Tên hiển thị tiếng Việt (Tháng 1, Tháng 2, ..., Tháng 12).",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      }
    ]
  },
  {
    "id": "Dim_Year",
    "tableName": "Dim_Year",
    "businessName": "Chiều Thời gian Năm",
    "tableType": "Dimension",
    "domain": "Tổ chức & Thời gian",
    "columnCount": 2,
    "rowCount": 31,
    "metaInfo": "Loại bảng: Dimension  |  Phân hệ: Tổ chức & Thời gian  |  Nguồn: Lịch năm chuẩn hóa  |  Số dòng: 31  |  Khóa chính: Value",
    "columns": [
      {
        "stt": 1,
        "fieldName": "YearText",
        "constraint": "Bắt buộc (NOT NULL)",
        "dataType": "VARCHAR(10)",
        "description": "Chuỗi năm: Năm dạng chuỗi văn bản (VD: '2026').",
        "isPk": false,
        "isFk": false,
        "refTable": ""
      },
      {
        "stt": 2,
        "fieldName": "Value",
        "constraint": "Khóa chính (PK)",
        "dataType": "INT",
        "description": "Giá trị năm: Giá trị năm dạng số nguyên (VD: 2026). Dùng làm khóa liên kết với Fact_KPI_Year.",
        "isPk": true,
        "isFk": false,
        "refTable": ""
      }
    ]
  }
];

export const brdReports = [
  {
    "id": "revenue-overview",
    "sheet": "1.BRD- DOANH THU",
    "title": "Báo cáo Tổng hợp Doanh thu",
    "subtitle": "Doanh thu thương mại & Luân chuyển nội bộ (LCNB)",
    "objective": "- Báo cáo doanh thu tổng quan của toàn công ty theo thời gian (năm/tháng/ngày).\n- Phân tách rõ ràng Doanh thu bán ngoài (doanh thu thương mại) và Doanh thu Luân chuyển nội bộ (LCNB).\n- Đo lường cơ cấu và tỷ trọng doanh thu theo nhóm khách hàng, nhóm vật tư/hàng hóa và xí nghiệp.",
    "requester": "Chị Nghĩa (Kế toán Sovigaz - Phụ trách nghiệp vụ & số liệu) & Anh Phước (PM Sovigaz)",
    "targetAudience": "Ban Giám đốc, Phòng Ban Điều hành, Kế toán trưởng & Quản lý các Xí nghiệp",
    "frequency": "MTD (Lũy kế tháng) / YTD (Lũy kế năm) / Ngày ghi sổ kế toán (PostedDate)",
    "source": "DM_RevenueBySaleLedger_new, Dim_Customer, Dim_Products, Dim_Stock, Dim_Date",
    "slicers": [
      "Năm (2022 - 2026, hoặc ALL)",
      "Nhóm khách hàng (A_BV/YTE, B_CTY/ĐL, C_NLE, KHNB, NB, XD...)",
      "Tên khách hàng (Dropdown Search & Multi-select)",
      "Tên xí nghiệp (Bình Dương, Biên Hòa, Cần Thơ, Hải Phòng, Khánh Hội, Nha Trang, Phan Rang, Tràng Kênh, Văn phòng)"
    ],
    "keyKpis": [
      {
        "name": "Doanh thu thực tế (Doanh thu thuần)",
        "rule": "SUM(ReceiptAmount) - SUM(VATAmount) — Doanh thu thuần sau giảm trừ và trước VAT (1.111 tỷ)"
      },
      {
        "name": "Doanh thu trước thuế (Gồm thuế)",
        "rule": "SUM(ReceiptAmount) — Tổng giá trị thanh toán bao gồm cả thuế VAT (1.213 tỷ)"
      },
      {
        "name": "Thuế VAT đầu ra",
        "rule": "SUM(VATAmount) — Tổng tiền thuế GTGT trên hóa đơn xuất bán (102 tỷ)"
      },
      {
        "name": "Doanh thu bán ngoài (Thương mại)",
        "rule": "CALCULATE(Doanh thu, Dim_Customer[Excel_Customer_Category] NOT IN {'KHNB', 'NB'})"
      },
      {
        "name": "Doanh thu Luân chuyển nội bộ (LCNB)",
        "rule": "CALCULATE(Doanh thu, Dim_Customer[Excel_Customer_Category] IN {'KHNB', 'NB'})"
      },
      {
        "name": "Tổng đơn hàng & Giá trị TB (AOV)",
        "rule": "DISTINCTCOUNT(InvNo) (22.90K đơn) và [Doanh thu thực tế] / [Tổng đơn hàng] (48.52M/đơn)"
      }
    ],
    "acceptanceCriteria": "Cắt số liệu theo Ngày ghi sổ kế toán (PostedDate) để đồng bộ báo cáo tài chính MISA. Ngưỡng sai số cho phép giữa báo cáo BI và sổ cái MISA: < 10.000.000 VNĐ do làm tròn đơn giá hoặc chiết khấu."
  },
  {
    "id": "revenue-detail",
    "sheet": "2.BRD-DOANH THU CHI TIẾT",
    "title": "Báo cáo Doanh thu Chi tiết",
    "subtitle": "Chi tiết giao dịch đến cấp hóa đơn, mặt hàng, khách hàng & ma trận xí nghiệp",
    "objective": "- Báo cáo chi tiết từng dòng doanh thu của công ty đến cấp độ mặt hàng, khách hàng, số hóa đơn xuất bán.\n- Hỗ trợ đối chiếu, kiểm tra chi tiết các khoản thuế VAT, số lượng bán và đơn giá giao dịch thực tế.\n- Phân tích chi tiết ma trận doanh thu xí nghiệp x nhóm khách hàng.",
    "requester": "Chị Nghĩa (Kế toán Sovigaz - Phụ trách nghiệp vụ & số liệu) & Anh Phước (PM Sovigaz)",
    "targetAudience": "Ban Giám đốc, Phòng Ban Điều hành, Kế toán trưởng & Quản lý các Xí nghiệp",
    "frequency": "Theo ngày chứng từ và theo kỳ đối soát kế toán MISA AMIS",
    "source": "DM_RevenueBySaleLedger_new, Dim_Products, Dim_Customer, Dim_Stock",
    "slicers": [
      "Năm (2022 - 2026, hoặc ALL)",
      "Nhóm khách hàng (A_BV/YTE, B_CTY/ĐL, C_NLE, KHNB...)",
      "Tên khách hàng (Tìm kiếm và chọn đích danh đơn vị)",
      "Tên xí nghiệp (Lọc theo 9 chi nhánh phát sinh doanh thu)"
    ],
    "keyKpis": [
      {
        "name": "Chi tiết doanh thu theo mặt hàng",
        "rule": "Tên mặt hàng, Số đơn hàng (DISTINCTCOUNT(InvNo)), Doanh thu thực tế (22,895 đơn, 1,110.9 tỷ)"
      },
      {
        "name": "Chi tiết doanh thu theo khách hàng",
        "rule": "Tên khách hàng, Doanh thu thực tế — phục vụ quản lý và chăm sóc top khách hàng VIP"
      },
      {
        "name": "Chi tiết từng dòng hóa đơn",
        "rule": "Khớp chính xác từng dòng chứng từ bán hàng: Khách hàng, Sản phẩm, Số lượng (MainQuantity), Doanh thu"
      },
      {
        "name": "Ma trận Doanh thu Xí nghiệp x Nhóm KH",
        "rule": "Phân tích chéo Dòng: Xí nghiệp, Cột: Nhóm KH (BV/YTE, CTY/ĐL, NLE), Giá trị: Doanh thu thực tế"
      }
    ],
    "acceptanceCriteria": "Mỗi dòng trên báo cáo chi tiết phản ánh đúng 1 dòng chứng từ bán hàng trên phần mềm MISA, khớp chính xác 100% dòng chứng từ kế toán và tiền thuế VAT."
  },
  {
    "id": "debt-management",
    "sheet": "3.BRD-CÔNG NỢ",
    "title": "Báo cáo Quản lý Công nợ & Phân tích Tuổi nợ",
    "subtitle": "Kiểm soát dư nợ, dòng tiền & phân loại rủi ro nợ khó đòi",
    "objective": "- Báo cáo toàn diện tình hình công nợ phải thu của toàn công ty theo khách hàng, đối tác và xí nghiệp.\n- Phân tích chi tiết tuổi nợ (nợ trước hạn, nợ trong hạn, nợ quá hạn 0-30, 31-60, nợ khó đòi, nợ không thể đòi).\n- Kiểm soát số dư đầu kỳ, phát sinh tăng nợ, số đã thanh toán và số còn phải thu cuối kỳ theo tài khoản kế toán (131, 136, 344...).",
    "requester": "Chị Nghĩa (Kế toán Sovigaz - Phụ trách nghiệp vụ & số liệu) & Anh Phước (PM Sovigaz)",
    "targetAudience": "Ban Giám đốc, Kế toán trưởng, Kế toán công nợ & Bộ phận thu hồi nợ",
    "frequency": "Hàng tuần và chốt số liệu cuối mỗi tháng",
    "source": "DM_AccountObjectDebt_new, Fact_AnalyticsDebit, Dim_Account, Dim_Customer",
    "slicers": [
      "Loại nợ / Tài khoản công nợ (131, 1361, 344, 2442, All)",
      "Trạng thái hạn nợ (Trước hạn: Không hạn nợ, 0-30, 31-90, >90 ngày)",
      "Trạng thái quá hạn (Quá hạn: 1-30, 31-90, 91-180, 181-365, 366-730, >1094 ngày)",
      "Nhóm khách hàng & Tên khách hàng (A_BV/YTE, B_CTY/ĐL, C_NLE, KHNB...)"
    ],
    "keyKpis": [
      {
        "name": "Số nợ đầu kỳ",
        "rule": "SUM(OpeningBalance) (668.52 tỷ, chiếm 90.48% tổng giá trị thanh toán)"
      },
      {
        "name": "Số nợ phát sinh trong kỳ",
        "rule": "SUM(PeriodAmount) (70.57 tỷ, chiếm 9.55% tổng giá trị thanh toán)"
      },
      {
        "name": "Số nợ đã được thanh toán",
        "rule": "SUM(PaidAmount) (70.21 tỷ, chiếm 9.50% tổng giá trị thanh toán)"
      },
      {
        "name": "Số nợ còn lại cuối kỳ (Tổng nợ)",
        "rule": "SUM(ReceiptableDebtAmount) = Dư đầu kỳ + Phát sinh - Đã thu (668.61 tỷ)"
      },
      {
        "name": "Phân loại rủi ro công nợ",
        "rule": "Nợ bình thường (~2.110bn), Nợ không thể đòi (~134bn), Nợ khó đòi (~71bn)"
      },
      {
        "name": "Chi tiết công nợ từng khách hàng",
        "rule": "Mã KH, Tên KH, Chi nhánh, Dư đầu kỳ, Phát sinh, Đã thu, Số nợ còn lại, Địa chỉ"
      }
    ],
    "acceptanceCriteria": "Tổng số nợ cuối kỳ trên báo cáo BI phải khớp 100% với Báo cáo Tổng hợp Công nợ phải thu trên phần mềm MISA (TK 131 và 1361)."
  },
  {
    "id": "kpi-master",
    "sheet": "4.BRD-KPI",
    "title": "Báo cáo Tổng hợp KPI Doanh thu & Sản xuất",
    "subtitle": "Đo lường tiến độ hoàn thành kế hoạch A3 và tăng trưởng cùng kỳ (YoY)",
    "objective": "- Báo cáo so sánh Kế hoạch (KPI) và Thực tế thực hiện về Sản xuất và Doanh thu theo biểu mẫu A3.\n- Theo dõi tỷ lệ % hoàn thành kế hoạch năm, kế hoạch tháng của toàn công ty và từng xí nghiệp.\n- Đo lường số liệu lũy kế (YTD) và tốc độ tăng trưởng so với cùng kỳ năm trước (YoY).",
    "requester": "Chị Nghĩa (Kế toán Sovigaz - Phụ trách nghiệp vụ & số liệu) & Anh Phước (PM Sovigaz)",
    "targetAudience": "Ban Giám đốc, Phòng Kế hoạch Điều hành, Quản lý các Xí nghiệp",
    "frequency": "Định kỳ hàng tháng và lũy kế các quý trong năm",
    "source": "Fact_KPI_Year, Fact_KPI_Month, Fact_ActualProduction, DM_RevenueBySaleLedger_new, Dim_Date, Dim_Stock",
    "slicers": [
      "Năm đánh giá KPI (2022, 2023, 2024, 2025, 2026)",
      "Sản phẩm (1_OXY KHÍ, 2_OXY LỎNG, 3_NITO KHÍ...)",
      "Tên xí nghiệp (Bình Dương, Biên Hòa, Cần Thơ, Hải Phòng, Khánh Hội, Nha Trang, Phan Rang, Tràng Kênh, Văn phòng)"
    ],
    "keyKpis": [
      {
        "name": "KHSX năm & % Hoàn thành KHSX năm",
        "rule": "KHSX năm: 165.96 tỷ; % Hoàn thành: DIVIDE([Lũy kế GTSX], [KHSX năm], 0) = 111.89%"
      },
      {
        "name": "KHDT năm & % Hoàn thành KHDT năm",
        "rule": "KHDT năm: 244.87 tỷ; % Hoàn thành: DIVIDE([Lũy kế Doanh thu], [KHDT năm], 0) = 132.27%"
      },
      {
        "name": "KPI Doanh thu tháng & Thực tế",
        "rule": "KPI DT tháng: 296.36 tỷ; Thực tế: 323.89 tỷ; Tỷ lệ hoàn thành đạt 109.29%"
      },
      {
        "name": "KPI Giá trị sản xuất tháng & Thực tế",
        "rule": "KPI GTSX: 170.43 tỷ; Thực tế: 185.69 tỷ; Tỷ lệ hoàn thành đạt 108.96%"
      },
      {
        "name": "Lũy kế Doanh thu YTD & Tăng trưởng YoY",
        "rule": "Lũy kế DT: 323.89 tỷ; Cùng kỳ năm trước: 306.29 tỷ; Tăng trưởng YoY đạt 105.75%"
      },
      {
        "name": "Lũy kế GTSX YTD & Tăng trưởng YoY",
        "rule": "Lũy kế GTSX: 186 tỷ; Cùng kỳ năm trước: 160 tỷ; Tăng trưởng YoY đạt 116.25%"
      }
    ],
    "acceptanceCriteria": "Dữ liệu kế hoạch năm cố định từ file Excel kế hoạch A3 của Ban Điều hành Sovigaz. Tỷ lệ hoàn thành và tăng trưởng YoY được tính toán tự động qua DAX Measures."
  },
  {
    "id": "kpi-detail",
    "sheet": "5.BRD-KPI chi tiết",
    "title": "Báo cáo KPI Chi tiết & Sức khỏe Tài chính",
    "subtitle": "Theo dõi 21 nhóm sản phẩm cốt lõi DVC & ma trận sức khỏe tài chính xí nghiệp",
    "objective": "- Báo cáo chi tiết kế hoạch và thực tế theo 21 nhóm sản phẩm cốt lõi (sản xuất, tiêu thụ, doanh thu quy đổi theo đơn vị chuẩn DVC).\n- Bảng theo dõi 'Sức khỏe tài chính' của từng xí nghiệp thành viên: kết hợp toàn diện cả 4 chỉ tiêu KHSX, KHDT, Thực tế SX, Thực tế DT và % hoàn thành lũy kế.\n- Báo cáo phân tích doanh thu theo loại hình dịch vụ kỹ thuật.",
    "requester": "Chị Nghĩa (Kế toán Sovigaz - Phụ trách nghiệp vụ & số liệu) & Anh Phước (PM Sovigaz)",
    "targetAudience": "Ban Giám đốc Xí nghiệp, Ban Lãnh đạo Tổng Công ty, Ban Kiểm soát",
    "frequency": "Hàng tháng theo kỳ nộp báo cáo biểu mẫu A3",
    "source": "Fact_KPI_By_Product, Fact_KPI_Month, Fact_ActualProduction, DM_RevenueBySaleLedger_new, Dim_ProductCategories, Dim_Stock",
    "slicers": [
      "Năm (2022, 2023, 2024, 2025, 2026)",
      "Sản phẩm (1_OXY KHÍ, 2_OXY LỎNG, 3_NITO KHÍ...)",
      "Tên xí nghiệp (Bình Dương, Biên Hòa, Cần Thơ, Hải Phòng, Khánh Hội, Nha Trang, Phan Rang, Tràng Kênh, Văn phòng)"
    ],
    "keyKpis": [
      {
        "name": "Kế hoạch năm từng chi nhánh",
        "rule": "KHDT năm toàn công ty: 244.87 tỷ, KHSX năm: 165.96 tỷ phân bổ theo từng xí nghiệp"
      },
      {
        "name": "Kế hoạch năm 21 nhóm sản phẩm",
        "rule": "Tổng KHSX: 49.38M DVC, KHTT: 51.15M DVC, KHDT: 547.88 tỷ (Fact_KPI_By_Product)"
      },
      {
        "name": "Bảng Sức khỏe Tài chính Chi nhánh",
        "rule": "Tổng hợp đa chiều: KPI SX, KPI DT, GTSX thực tế, DT thực tế, % hoàn thành và % tăng trưởng cùng kỳ"
      },
      {
        "name": "Bảng KPI theo Sản phẩm (DVC)",
        "rule": "Đối chiếu chi tiết KHSX DVC, SX thực tế, KHTT DVC, TT thực tế, KPI DT, DT thực tế và % hoàn thành"
      },
      {
        "name": "Báo cáo Doanh thu Loại Dịch vụ",
        "rule": "Theo dõi doanh thu mảng dịch vụ nạp khí, kiểm định vỏ chai, bồn chứa (Năm 2023 đạt 17.73 tỷ)"
      }
    ],
    "acceptanceCriteria": "Toàn bộ sản lượng sản xuất và tiêu thụ khí được quy đổi đồng nhất về Đơn vị chuẩn (DVC) theo quy định Sovigaz; hỗ trợ trích xuất ngược dữ liệu ra 4 file Excel chuẩn."
  }
];

export const dataMappings = [
  {
    "stt": 1,
    "reportName": "1. Doanh thu",
    "group": "KPI Cards",
    "fieldName": "Doanh thu thực tế",
    "description": "Doanh thu thuần thực tế sau giảm trừ và trước VAT",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "ReceiptAmount, VATAmount",
    "mappingRule": "Tính doanh thu thuần bán hàng (1.111bn)"
  },
  {
    "stt": 2,
    "reportName": "1. Doanh thu",
    "group": "KPI Cards",
    "fieldName": "Thuế VAT",
    "description": "Tổng tiền thuế GTGT đầu ra trên hóa đơn",
    "daxRule": "SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "VATAmount",
    "mappingRule": "Hiển thị tổng thuế GTGT đầu ra (102bn)"
  },
  {
    "stt": 3,
    "reportName": "1. Doanh thu",
    "group": "KPI Cards",
    "fieldName": "Doanh thu trước thuế (gồm thuế)",
    "description": "Tổng giá trị thanh toán đã gồm thuế VAT",
    "daxRule": "SUM(ReceiptAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "ReceiptAmount",
    "mappingRule": "Hiển thị tổng tiền thanh toán (1213bn)"
  },
  {
    "stt": 4,
    "reportName": "1. Doanh thu",
    "group": "KPI Cards",
    "fieldName": "Tổng số đơn hàng",
    "description": "Tổng số lượng hóa đơn/đơn hàng xuất bán",
    "daxRule": "DISTINCTCOUNT(DM_RevenueBySaleLedger[InvNo])",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "InvNo",
    "mappingRule": "Đếm số hóa đơn duy nhất trong kỳ (22,90K)"
  },
  {
    "stt": 5,
    "reportName": "1. Doanh thu",
    "group": "KPI Cards",
    "fieldName": "Giá trị TB đơn hàng (AOV)",
    "description": "Doanh thu bình quân trên một đơn hàng",
    "daxRule": "[Doanh thu thực tế] / [Tổng đơn hàng]",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "Computed Measure",
    "mappingRule": "Lấy Doanh thu chia Số đơn hàng (48,52M)"
  },
  {
    "stt": 6,
    "reportName": "1. Doanh thu",
    "group": "Biểu đồ xu hướng",
    "fieldName": "Doanh thu và đơn hàng theo tháng",
    "description": "Doanh thu thuần và số đơn hàng theo trục tháng",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount), DISTINCTCOUNT(InvNo)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new, Dim_Date",
    "sourceField": "PostedDate, InvNo",
    "mappingRule": "Group theo Dim_Date[Month]"
  },
  {
    "stt": 7,
    "reportName": "1. Doanh thu",
    "group": "Biểu đồ cơ cấu",
    "fieldName": "Doanh thu theo nhóm vật tư/HH",
    "description": "Doanh thu phân bổ theo tính chất sản phẩm",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_InventoryItemType",
    "sourceField": "InventoryItemTypeName",
    "mappingRule": "Nối Dim_Products, Dim_InventoryItemType"
  },
  {
    "stt": 8,
    "reportName": "1. Doanh thu",
    "group": "Biểu đồ cơ cấu",
    "fieldName": "Doanh thu theo tháng của nhóm KH",
    "description": "Doanh thu phân bổ theo nhóm khách hàng",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_Customer_New",
    "sourceField": "Excel_Customer_Category",
    "mappingRule": "Group theo nhóm BV, ĐL, CN, KHNB..."
  },
  {
    "stt": 9,
    "reportName": "1. Doanh thu",
    "group": "Biểu đồ cơ cấu",
    "fieldName": "Doanh thu theo nhóm KH (Donut)",
    "description": "Tỷ trọng doanh thu theo từng nhóm khách hàng",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_Customer_New",
    "sourceField": "Excel_Customer_Category",
    "mappingRule": "Donut chart tỷ lệ đóng góp"
  },
  {
    "stt": 10,
    "reportName": "1. Doanh thu",
    "group": "Biểu đồ cơ cấu",
    "fieldName": "Doanh thu theo tháng của xí nghiệp",
    "description": "Doanh thu phân bổ theo từng xí nghiệp qua các tháng",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_Stock",
    "sourceField": "StockName",
    "mappingRule": "Stacked Column Chart"
  },
  {
    "stt": 11,
    "reportName": "1. Doanh thu",
    "group": "Biểu đồ cơ cấu",
    "fieldName": "Doanh thu theo xí nghiệp (Donut)",
    "description": "Tỷ trọng doanh thu giữa các xí nghiệp",
    "daxRule": "SUM(ReceiptAmount) - SUM(VATAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_Stock",
    "sourceField": "StockName",
    "mappingRule": "Donut chart tỷ lệ xí nghiệp"
  },
  {
    "stt": 12,
    "reportName": "2. Doanh thu chi tiết",
    "group": "Chi tiết mặt hàng",
    "fieldName": "Số đơn hàng và Doanh thu mặt hàng",
    "description": "Tổng số đơn và doanh thu thuần từng mặt hàng",
    "daxRule": "DISTINCTCOUNT(InvNo), SUM(Revenue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new, Dim_Products",
    "sourceField": "InventoryItemName, Revenue",
    "mappingRule": "Group theo Dim_Products[InventoryItemName]"
  },
  {
    "stt": 13,
    "reportName": "2. Doanh thu chi tiết",
    "group": "Chi tiết khách hàng",
    "fieldName": "Doanh thu theo khách hàng",
    "description": "Tổng doanh thu thuần của từng khách hàng",
    "daxRule": "SUM(Revenue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new, Dim_Customer",
    "sourceField": "AccountObjectName, Revenue",
    "mappingRule": "Group theo Dim_Customer[AccountObjectName]"
  },
  {
    "stt": 14,
    "reportName": "2. Doanh thu chi tiết",
    "group": "Chi tiết hóa đơn",
    "fieldName": "Số lượng và doanh thu từng hóa đơn",
    "description": "Chi tiết từng dòng chứng từ bán hàng",
    "daxRule": "SUM(MainQuantity), SUM(Revenue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "MainQuantity, Revenue, PostedDate",
    "mappingRule": "Hiển thị chi tiết từng giao dịch"
  },
  {
    "stt": 15,
    "reportName": "2. Doanh thu chi tiết",
    "group": "Ma trận phân tích",
    "fieldName": "Doanh thu theo XN và nhóm KH",
    "description": "Phân tích chéo xí nghiệp x nhóm khách hàng",
    "daxRule": "SUM(Revenue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_Revenue, Dim_Stock, Dim_Customer",
    "sourceField": "StockName, Excel_Customer_Category",
    "mappingRule": "Ma trận Matrix theo XN và Nhóm KH"
  },
  {
    "stt": 16,
    "reportName": "3. Công nợ",
    "group": "KPI Cards",
    "fieldName": "Số nợ đầu kỳ",
    "description": "Dư nợ phải thu chuyển sang từ kỳ trước",
    "daxRule": "SUM(OpeningBalance)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_AccountObjectDebt_new",
    "sourceField": "OpeningBalance",
    "mappingRule": "Lọc theo tài khoản công nợ được chọn (668,52bn)"
  },
  {
    "stt": 17,
    "reportName": "3. Công nợ",
    "group": "KPI Cards",
    "fieldName": "Số nợ phát sinh trong kỳ",
    "description": "Tổng tiền bán chịu phát sinh thêm trong kỳ",
    "daxRule": "SUM(PeriodAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_AccountObjectDebt_new",
    "sourceField": "PeriodAmount",
    "mappingRule": "Lọc theo tài khoản công nợ được chọn (70,57bn)"
  },
  {
    "stt": 18,
    "reportName": "3. Công nợ",
    "group": "KPI Cards",
    "fieldName": "Số tiền đã thanh toán",
    "description": "Tổng tiền khách hàng đã thanh toán trả nợ",
    "daxRule": "SUM(PaidAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_AccountObjectDebt_new",
    "sourceField": "PaidAmount",
    "mappingRule": "Lọc theo tài khoản công nợ được chọn (70,21bn)"
  },
  {
    "stt": 19,
    "reportName": "3. Công nợ",
    "group": "KPI Cards",
    "fieldName": "Số nợ còn lại cuối kỳ",
    "description": "Dư nợ thực tế còn phải thu tại thời điểm chốt",
    "daxRule": "SUM(ReceiptableDebtAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_AccountObjectDebt_new",
    "sourceField": "ReceiptableDebtAmount",
    "mappingRule": "Dư đầu kỳ + Phát sinh - Đã thu (668,61bn)"
  },
  {
    "stt": 20,
    "reportName": "3. Công nợ",
    "group": "Biểu đồ cơ cấu",
    "fieldName": "Công nợ theo từng nhóm khách hàng",
    "description": "So sánh thanh toán, tổng giá trị và nợ còn lại theo nhóm KH",
    "daxRule": "PaidAmount, TotalDebit, ReceiptableDebt",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_AccountObjectDebt_new, Dim_Customer",
    "sourceField": "Excel_Customer_Category",
    "mappingRule": "Clustered Column Chart"
  },
  {
    "stt": 21,
    "reportName": "3. Công nợ",
    "group": "Biểu đồ rủi ro",
    "fieldName": "Phân tích rủi ro nợ",
    "description": "Phân loại nợ: Bình thường, Khó đòi, Không thể đòi",
    "daxRule": "SUM(DebitAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_AnalyticsDebit",
    "sourceField": "Phân loại rủi ro nợ",
    "mappingRule": "Group theo trường Phân loại rủi ro nợ"
  },
  {
    "stt": 22,
    "reportName": "3. Công nợ",
    "group": "Biểu đồ tuổi nợ",
    "fieldName": "Phân tích nợ trước hạn",
    "description": "Cơ cấu nợ chưa đến hạn thanh toán",
    "daxRule": "SUM(DebitAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_AnalyticsDebit",
    "sourceField": "DueInterval (<= 0 ngày)",
    "mappingRule": "Lọc các khoản nợ DueDays <= 0"
  },
  {
    "stt": 23,
    "reportName": "3. Công nợ",
    "group": "Biểu đồ tuổi nợ",
    "fieldName": "Phân tích nợ quá hạn",
    "description": "Cơ cấu nợ quá hạn theo các dải ngày",
    "daxRule": "SUM(DebitAmount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_AnalyticsDebit",
    "sourceField": "DueInterval (> 0 ngày)",
    "mappingRule": "Lọc các khoản nợ DueDays > 0"
  },
  {
    "stt": 24,
    "reportName": "3. Công nợ",
    "group": "Bảng chi tiết",
    "fieldName": "Chi tiết công nợ theo khách hàng",
    "description": "Chi tiết số dư và thanh toán từng khách hàng",
    "daxRule": "Opening, Period, Paid, ReceiptableDebt",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_AccountObjectDebt_new, Dim_Customer",
    "sourceField": "AccountObjectCode, AccountObjectName",
    "mappingRule": "Group theo đối tượng khách hàng"
  },
  {
    "stt": 25,
    "reportName": "4. KPI",
    "group": "KPI Năm",
    "fieldName": "KHSX năm",
    "description": "Chỉ tiêu tổng giá trị sản xuất cả năm",
    "daxRule": "SUM(Production)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Year",
    "sourceField": "Production",
    "mappingRule": "Kế hoạch năm từ file A3 (165,96bn)"
  },
  {
    "stt": 26,
    "reportName": "4. KPI",
    "group": "KPI Năm",
    "fieldName": "% Hoàn thành KHSX năm",
    "description": "Tỷ lệ hoàn thành mục tiêu sản xuất cả năm",
    "daxRule": "[Lũy kế GTSX thực tế] / [KHSX năm]",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Calculated Measure",
    "sourceField": "Computed",
    "mappingRule": "Chia lũy kế thực tế cho kế hoạch năm (111,89%)"
  },
  {
    "stt": 27,
    "reportName": "4. KPI",
    "group": "KPI Năm",
    "fieldName": "KHDT năm",
    "description": "Chỉ tiêu tổng doanh thu bán hàng cả năm",
    "daxRule": "SUM(Amount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Year",
    "sourceField": "Amount",
    "mappingRule": "Kế hoạch doanh thu năm từ file A3 (244,87bn)"
  },
  {
    "stt": 28,
    "reportName": "4. KPI",
    "group": "KPI Năm",
    "fieldName": "% Hoàn thành KHDT năm",
    "description": "Tỷ lệ hoàn thành mục tiêu doanh thu cả năm",
    "daxRule": "[Lũy kế DT thực tế] / [KHDT năm]",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Calculated Measure",
    "sourceField": "Computed",
    "mappingRule": "Chia lũy kế thực tế cho kế hoạch năm (132,27%)"
  },
  {
    "stt": 29,
    "reportName": "4. KPI",
    "group": "KPI Tháng",
    "fieldName": "KPI doanh thu",
    "description": "Chỉ tiêu doanh thu phân bổ của xí nghiệp",
    "daxRule": "SUM(Amount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Month",
    "sourceField": "Amount",
    "mappingRule": "Kế hoạch tháng phân bổ (296,36bn)"
  },
  {
    "stt": 30,
    "reportName": "4. KPI",
    "group": "KPI Tháng",
    "fieldName": "Doanh thu thực tế",
    "description": "Doanh thu thực tế đạt được trong kỳ chọn",
    "daxRule": "SUM(Revenue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "DM_RevenueBySaleLedger_new",
    "sourceField": "Revenue",
    "mappingRule": "Lọc theo năm/tháng được chọn (323,89bn)"
  },
  {
    "stt": 31,
    "reportName": "4. KPI",
    "group": "KPI Tháng",
    "fieldName": "Tỉ lệ hoàn thành KPI DT",
    "description": "Tỷ lệ đạt mục tiêu doanh thu",
    "daxRule": "[Doanh thu thực tế] / [KPI DT]",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Calculated Measure",
    "sourceField": "Computed",
    "mappingRule": "Chia thực tế cho kế hoạch (109,29%)"
  },
  {
    "stt": 32,
    "reportName": "4. KPI",
    "group": "KPI Tháng",
    "fieldName": "KPI GTSX",
    "description": "Chỉ tiêu giá trị sản xuất phân bổ",
    "daxRule": "SUM(ProductionValue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Month",
    "sourceField": "ProductionValue",
    "mappingRule": "Kế hoạch sản xuất phân bổ (170,43bn)"
  },
  {
    "stt": 33,
    "reportName": "4. KPI",
    "group": "KPI Tháng",
    "fieldName": "GTSX thực tế",
    "description": "Giá trị sản lượng thực tế nhà máy sản xuất",
    "daxRule": "SUM(ProductValue)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_ActualProduction",
    "sourceField": "ProductValue",
    "mappingRule": "Tổng giá trị sản xuất thực tế (185,69bn)"
  },
  {
    "stt": 34,
    "reportName": "4. KPI",
    "group": "KPI Tháng",
    "fieldName": "% Giá trị sản xuất",
    "description": "Tỷ lệ đạt mục tiêu giá trị sản xuất",
    "daxRule": "[GTSX thực tế] / [KPI GTSX]",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Calculated Measure",
    "sourceField": "Computed",
    "mappingRule": "Chia thực tế cho kế hoạch (108,96%)"
  },
  {
    "stt": 35,
    "reportName": "4. KPI",
    "group": "KPI Lũy kế",
    "fieldName": "Lũy kế doanh thu (YTD)",
    "description": "Doanh thu thuần tích lũy từ đầu năm",
    "daxRule": "TOTALYTD([Doanh thu thực tế], Dim_Date[Date])",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_Date, DM_Revenue",
    "sourceField": "Date",
    "mappingRule": "Hàm TOTALYTD (323,89bn)"
  },
  {
    "stt": 36,
    "reportName": "4. KPI",
    "group": "KPI Lũy kế",
    "fieldName": "Doanh thu cùng kỳ năm trước",
    "description": "Doanh thu tích lũy cùng kỳ năm trước",
    "daxRule": "CALCULATE([Lũy kế DT], SAMEPERIODLASTYEAR(Dim_Date[Date]))",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Dim_Date, DM_Revenue",
    "sourceField": "Date",
    "mappingRule": "Hàm SAMEPERIODLASTYEAR (306,29bn)"
  },
  {
    "stt": 37,
    "reportName": "4. KPI",
    "group": "KPI Lũy kế",
    "fieldName": "% Doanh thu so với cùng kỳ",
    "description": "Tốc độ tăng trưởng doanh thu so với cùng kỳ",
    "daxRule": "DIVIDE([Lũy kế DT], [DT cùng kỳ], 0)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Calculated Measure",
    "sourceField": "Computed",
    "mappingRule": "So sánh tỷ lệ tăng trưởng (105,75%)"
  },
  {
    "stt": 38,
    "reportName": "4. KPI",
    "group": "KPI Lũy kế",
    "fieldName": "Lũy kế GTSX (YTD)",
    "description": "Giá trị sản xuất tích lũy từ đầu năm",
    "daxRule": "TOTALYTD([Giá trị sản xuất], Dim_Date[Date])",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_ActualProduction, Dim_Date",
    "sourceField": "ProductValue",
    "mappingRule": "Hàm TOTALYTD (186bn)"
  },
  {
    "stt": 39,
    "reportName": "4. KPI",
    "group": "KPI Lũy kế",
    "fieldName": "GTSX cùng kỳ năm trước",
    "description": "Giá trị sản xuất tích lũy cùng kỳ năm trước",
    "daxRule": "CALCULATE([Lũy kế GTSX], SAMEPERIODLASTYEAR(Dim_Date[Date]))",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_ActualProduction, Dim_Date",
    "sourceField": "ProductValue",
    "mappingRule": "Hàm SAMEPERIODLASTYEAR (160bn)"
  },
  {
    "stt": 40,
    "reportName": "4. KPI",
    "group": "KPI Lũy kế",
    "fieldName": "% GTSX so với cùng kỳ",
    "description": "Tốc độ tăng trưởng GTSX so với cùng kỳ",
    "daxRule": "DIVIDE([Lũy kế GTSX], [GTSX cùng kỳ], 0)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Calculated Measure",
    "sourceField": "Computed",
    "mappingRule": "So sánh tỷ lệ tăng trưởng (116,25%)"
  },
  {
    "stt": 41,
    "reportName": "5. KPI chi tiết",
    "group": "Chi tiết chi nhánh",
    "fieldName": "KHDT và KHSX năm từng chi nhánh",
    "description": "Chỉ tiêu kế hoạch năm theo xí nghiệp",
    "daxRule": "SUM(Amount), SUM(Production)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Year",
    "sourceField": "Amount, Production",
    "mappingRule": "Group theo Parent_Stock"
  },
  {
    "stt": 42,
    "reportName": "5. KPI chi tiết",
    "group": "Chi tiết sản phẩm",
    "fieldName": "Kế hoạch SX, TT và DT theo sản phẩm",
    "description": "Chỉ tiêu kế hoạch năm giao từng nhóm SP",
    "daxRule": "SUM(ProductQuantityDVC), SUM(SaleQuantityDVC), SUM(Amount)",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_By_Product",
    "sourceField": "ProductQuantityDVC, SaleQuantityDVC, Amount",
    "mappingRule": "Group theo CategoryName"
  },
  {
    "stt": 43,
    "reportName": "5. KPI chi tiết",
    "group": "Chi tiết chi nhánh",
    "fieldName": "Sức khỏe tài chính chi nhánh",
    "description": "Đánh giá toàn diện 4 chỉ tiêu KHSX, KHDT, SX, DT",
    "daxRule": "KPI SX, KPI DT, GTSX TT, DT TT, % hoàn thành",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Month, Fact_ActualProduction, DM_Revenue",
    "sourceField": "StockCode, Multi-fields",
    "mappingRule": "Tổng hợp theo chi nhánh"
  },
  {
    "stt": 44,
    "reportName": "5. KPI chi tiết",
    "group": "Chi tiết sản phẩm",
    "fieldName": "Bảng KPI theo sản phẩm",
    "description": "Đối chiếu chi tiết thực tế vs kế hoạch 21 nhóm SP",
    "daxRule": "KHSX DVC, SX TT, KHTT DVC, TT TT, KPI DT, DT TT, % KHTT",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_By_Product, Fact_ActualProduction, DM_Revenue",
    "sourceField": "CategoryName, Multi-fields",
    "mappingRule": "Group theo 21 nhóm sản phẩm chuẩn"
  },
  {
    "stt": 45,
    "reportName": "5. KPI chi tiết",
    "group": "Dịch vụ kỹ thuật",
    "fieldName": "Báo cáo doanh thu loại dịch vụ",
    "description": "Theo dõi doanh thu mảng dịch vụ nạp khí, bồn chứa",
    "daxRule": "KPI Doanh thu DV, Doanh thu thực tế DV, % DT DV so với KH",
    "sourceDatabase": "SOVIGAZ_2026_Dev.Datamart",
    "sourceTable": "Fact_KPI_Month, DM_RevenueBySaleLedger",
    "sourceField": "Indicator = 'DV', StockCode",
    "mappingRule": "Lọc theo chỉ tiêu dịch vụ kỹ thuật"
  }
];

export const dataModelInfo = {
  "architectureType": "Mô hình lai Star Schema & Snowflake Schema (Kimball Methodology)",
  "databaseEngine": "Microsoft SQL Server & Microsoft Power BI Desktop",
  "summary": "Mô hình dữ liệu kho DWH Sovigaz được thiết kế theo phương pháp luận Kimball trên Microsoft SQL Server và triển khai trực quan trên Power BI Desktop, kết nối 19 bảng (7 bảng Fact/Datamart và 12 bảng Dimension) qua 27 mối quan hệ chuẩn hóa (26 Active, 1 Inactive).",
  "stats": {
    "totalTables": 19,
    "factTables": 7,
    "dimTables": 12,
    "totalRelationships": 27,
    "activeRelationships": 26,
    "inactiveRelationships": 1
  },
  "designPrinciples": [
    {
      "title": "Phân tách Fact Bán hàng và Fact Kế hoạch",
      "desc": "Bán hàng (DM_RevenueBySaleLedger) ghi nhận theo từng dòng hóa đơn chứng từ chi tiết phát sinh hàng ngày; trong khi Kế hoạch KPI (Fact_KPI_Month, Fact_KPI_Year, Fact_KPI_By_Product) có độ chi tiết (grain) theo tháng, năm và nhóm sản phẩm."
    },
    {
      "title": "Chuẩn hóa danh mục 21 nhóm sản phẩm",
      "desc": "Hàng nghìn mã vật tư MISA từ Dim_Products (trường EXCEL_CATEGORY) được nối chuẩn sang Dim_ProductCategories (CATEGORYNAME) và phân loại theo Dim_Indicator để phục vụ biểu mẫu A3."
    },
    {
      "title": "Phân cấp Chi nhánh & Xí nghiệp (Snowflake Hierarchy)",
      "desc": "Dim_Stock (kho và chi nhánh) nối lên Dim_ParentStock (đơn vị xí nghiệp mẹ), phản ánh chuẩn xác cơ cấu tổ chức và phân quyền điều hành đa cấp của Sovigaz."
    },
    {
      "title": "Tối ưu hóa hiệu năng & Tránh vòng lặp (Ambiguity)",
      "desc": "Mối quan hệ Dim_Date(Year) đến Dim_Year(Value) được đặt Inactive để tránh xung đột đường truyền bộ lọc song song với chuỗi phân cấp Dim_Date -> Dim_Month -> Dim_Year."
    }
  ],
  "relationships": [
    {
      "id": "r1",
      "fromTable": "Dim_Stock",
      "fromField": "StockCode",
      "toTable": "Dim_Customer",
      "toField": "StockCode",
      "type": "1 : N",
      "pbiFrom": "DIM_CUSTOMER (STOCKCODE)",
      "pbiTo": "DIM_STOCK (STOCKCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Chi nhánh / Kho quản lý địa bàn gắn với khách hàng đối tượng"
    },
    {
      "id": "r2",
      "fromTable": "Dim_Year",
      "fromField": "Value",
      "toTable": "Dim_Date",
      "toField": "Year",
      "type": "1 : N",
      "pbiFrom": "DIM_DATE (YEAR)",
      "pbiTo": "DIM_YEAR (VALUE)",
      "status": "Inactive",
      "cardinality": "* : 1",
      "desc": "Liên kết Năm phụ (Inactive trong Power BI nhằm chống xung đột vòng lặp với phân cấp Date -> Month -> Year)"
    },
    {
      "id": "r3",
      "fromTable": "Dim_Month",
      "fromField": "YearMonth",
      "toTable": "Dim_Date",
      "toField": "YearMonth",
      "type": "1 : N",
      "pbiFrom": "DIM_DATE (YEARMONTH)",
      "pbiTo": "DIM_MONTH (YEARMONTH)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Phân cấp thời gian: Ngày thuộc về Tháng trong năm (Snowflake Date Hierarchy)"
    },
    {
      "id": "r4",
      "fromTable": "Dim_Year",
      "fromField": "Value",
      "toTable": "Dim_Month",
      "toField": "Year",
      "type": "1 : N",
      "pbiFrom": "DIM_MONTH (YEAR)",
      "pbiTo": "DIM_YEAR (VALUE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Phân cấp thời gian: Tháng thuộc về Năm tài chính tương ứng"
    },
    {
      "id": "r5",
      "fromTable": "Dim_Indicator",
      "fromField": "Indicator",
      "toTable": "Dim_ProductCategories",
      "toField": "Indicator",
      "type": "1 : N",
      "pbiFrom": "DIM_PRODUCTCATEGORIES (INDICATOR)",
      "pbiTo": "DIM_INDICATOR (INDICATOR)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Ánh xạ nhóm sản phẩm danh mục vào mã chỉ tiêu phân tích A3 (SX, DT)"
    },
    {
      "id": "r6",
      "fromTable": "Dim_ProductCategories",
      "fromField": "CategoryName",
      "toTable": "Dim_Products",
      "toField": "Excel_Category",
      "type": "1 : N",
      "pbiFrom": "DIM_PRODUCTS (EXCEL_CATEGORY)",
      "pbiTo": "DIM_PRODUCTCATEGORIES (CATEGORYNAME)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Chuẩn hóa hàng nghìn mã hàng hóa MISA vào 21 nhóm sản phẩm cốt lõi DWH"
    },
    {
      "id": "r7",
      "fromTable": "Dim_InventoryItemType",
      "fromField": "InventoryItemTypeID",
      "toTable": "Dim_Products",
      "toField": "InventoryItemTypeID",
      "type": "1 : N",
      "pbiFrom": "DIM_PRODUCTS (INVENTORYITEMTYPEID)",
      "pbiTo": "DIM_INVENTORYITEMTYPE (INVENTORYITEMTYPEID)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Phân loại thuộc tính hàng hóa (Thành phẩm, Hàng hóa, Dịch vụ, Vật tư)"
    },
    {
      "id": "r8",
      "fromTable": "Dim_Unit",
      "fromField": "UnitID",
      "toTable": "Dim_Products",
      "toField": "UnitID",
      "type": "1 : N",
      "pbiFrom": "DIM_PRODUCTS (UNITID)",
      "pbiTo": "DIM_UNIT (UNITID)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Đơn vị tính tiêu chuẩn của từng sản phẩm hàng hóa"
    },
    {
      "id": "r9",
      "fromTable": "Dim_ParentStock",
      "fromField": "ParentStockCode",
      "toTable": "Dim_Stock",
      "toField": "ParentStockCode",
      "type": "1 : N",
      "pbiFrom": "DIM_STOCK (PARENTSTOCKCODE)",
      "pbiTo": "DIM_PARENTSTOCK (PARENTSTOCKCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Cơ cấu phân cấp quản lý: Kho/Chi nhánh trực thuộc Xí nghiệp mẹ"
    },
    {
      "id": "r10",
      "fromTable": "Dim_Customer",
      "fromField": "AccountObjectCode",
      "toTable": "DM_AccountObjectDebt",
      "toField": "AccountObjectCode",
      "type": "1 : N",
      "pbiFrom": "DM_ACCOUNTOBJECTDEBT (ACCOUNTOBJECTCODE)",
      "pbiTo": "DIM_CUSTOMER (ACCOUNTOBJECTCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Theo dõi số dư nợ tổng hợp theo từng đối tác khách hàng"
    },
    {
      "id": "r11",
      "fromTable": "Dim_Account",
      "fromField": "Account",
      "toTable": "DM_AccountObjectDebt",
      "toField": "ReceivableAccountCode",
      "type": "1 : N",
      "pbiFrom": "DM_ACCOUNTOBJECTDEBT (RECEIVABLEACCOUNTCODE)",
      "pbiTo": "DIM_ACCOUNT (ACCOUNT)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Phân loại tài khoản kế toán công nợ (131, 136, 138, 344) của khoản dư nợ"
    },
    {
      "id": "r12",
      "fromTable": "Dim_Customer",
      "fromField": "AccountObjectCode",
      "toTable": "DM_RevenueBySaleLedger",
      "toField": "AccountObjectCode",
      "type": "1 : N",
      "pbiFrom": "DM_REVENUEBYSALELEDGER (ACCOUNTOBJECTCODE)",
      "pbiTo": "DIM_CUSTOMER (ACCOUNTOBJECTCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Khách hàng đối tượng trên từng hóa đơn bán hàng chi tiết"
    },
    {
      "id": "r13",
      "fromTable": "Dim_Products",
      "fromField": "InventoryItemCode",
      "toTable": "DM_RevenueBySaleLedger",
      "toField": "InventoryItemCode",
      "type": "1 : N",
      "pbiFrom": "DM_REVENUEBYSALELEDGER (INVENTORYITEMCODE)",
      "pbiTo": "DIM_PRODUCTS (INVENTORYITEMCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Mã hàng hóa/sản phẩm trên từng dòng hóa đơn doanh thu chi tiết"
    },
    {
      "id": "r14",
      "fromTable": "Dim_Date",
      "fromField": "Date",
      "toTable": "DM_RevenueBySaleLedger",
      "toField": "PostedDate",
      "type": "1 : N",
      "pbiFrom": "DM_REVENUEBYSALELEDGER (POSTEDDATE)",
      "pbiTo": "DIM_DATE (DATE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Trục thời gian ghi sổ ngày xuất bán doanh thu"
    },
    {
      "id": "r15",
      "fromTable": "Dim_ProductCategories",
      "fromField": "CategoryName",
      "toTable": "Fact_ActualProduction",
      "toField": "CategoryName",
      "type": "1 : N",
      "pbiFrom": "FACT_ACTUALPRODUCTION (CATEGORYNAME)",
      "pbiTo": "DIM_PRODUCTCATEGORIES (CATEGORYNAME)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Phân loại nhóm sản phẩm của sản lượng sản xuất thực tế"
    },
    {
      "id": "r16",
      "fromTable": "Dim_Date",
      "fromField": "Date",
      "toTable": "Fact_ActualProduction",
      "toField": "Date",
      "type": "1 : N",
      "pbiFrom": "FACT_ACTUALPRODUCTION (DATE)",
      "pbiTo": "DIM_DATE (DATE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Ngày phát sinh sản lượng sản xuất thực tế tại nhà máy"
    },
    {
      "id": "r17",
      "fromTable": "Dim_Stock",
      "fromField": "StockCode",
      "toTable": "Fact_ActualProduction",
      "toField": "FactoryCode",
      "type": "1 : N",
      "pbiFrom": "FACT_ACTUALPRODUCTION (FACTORYCODE)",
      "pbiTo": "DIM_STOCK (STOCKCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Nhà máy / Xí nghiệp phát sinh sản lượng sản xuất thực tế"
    },
    {
      "id": "r18",
      "fromTable": "Dim_Account",
      "fromField": "Account",
      "toTable": "Fact_AnalyticsDebit",
      "toField": "Account",
      "type": "1 : N",
      "pbiFrom": "FACT_ANALYTICSDEBIT (ACCOUNT)",
      "pbiTo": "DIM_ACCOUNT (ACCOUNT)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Tài khoản kế toán phân tích tuổi nợ chi tiết"
    },
    {
      "id": "r19",
      "fromTable": "Dim_Customer",
      "fromField": "AccountObjectCode",
      "toTable": "Fact_AnalyticsDebit",
      "toField": "AccountObjectCode",
      "type": "1 : N",
      "pbiFrom": "FACT_ANALYTICSDEBIT (ACCOUNTOBJECTCODE)",
      "pbiTo": "DIM_CUSTOMER (ACCOUNTOBJECTCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Khách hàng trong phân tích các khoảng tuổi nợ quá hạn"
    },
    {
      "id": "r20",
      "fromTable": "Dim_ProductCategories",
      "fromField": "CategoryName",
      "toTable": "Fact_KPI_By_Product",
      "toField": "CategoryName",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_BY_PRODUCT (CATEGORYNAME)",
      "pbiTo": "DIM_PRODUCTCATEGORIES (CATEGORYNAME)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Nhóm sản phẩm giao chỉ tiêu kế hoạch sản lượng và doanh thu năm"
    },
    {
      "id": "r21",
      "fromTable": "Dim_Stock",
      "fromField": "StockCode",
      "toTable": "Fact_KPI_By_Product",
      "toField": "StockCode",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_BY_PRODUCT (STOCKCODE)",
      "pbiTo": "DIM_STOCK (STOCKCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Xí nghiệp / Chi nhánh nhận giao chỉ tiêu kế hoạch theo sản phẩm"
    },
    {
      "id": "r22",
      "fromTable": "Dim_Year",
      "fromField": "Value",
      "toTable": "Fact_KPI_By_Product",
      "toField": "Year",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_BY_PRODUCT (YEAR)",
      "pbiTo": "DIM_YEAR (VALUE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Năm tài chính áp dụng chỉ tiêu kế hoạch sản phẩm"
    },
    {
      "id": "r23",
      "fromTable": "Dim_Date",
      "fromField": "Date",
      "toTable": "Fact_KPI_Month",
      "toField": "Date",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_MONTH (DATE)",
      "pbiTo": "DIM_DATE (DATE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Trục thời gian kỳ tháng áp dụng chỉ tiêu KPI kinh doanh và sản xuất"
    },
    {
      "id": "r24",
      "fromTable": "Dim_Indicator",
      "fromField": "Indicator",
      "toTable": "Fact_KPI_Month",
      "toField": "Indicator",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_MONTH (INDICATOR)",
      "pbiTo": "DIM_INDICATOR (INDICATOR)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Chỉ tiêu phân loại KPI biểu mẫu A3 (Doanh thu thuần, Sản lượng sản xuất)"
    },
    {
      "id": "r25",
      "fromTable": "Dim_Stock",
      "fromField": "StockCode",
      "toTable": "Fact_KPI_Month",
      "toField": "StockCode",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_MONTH (STOCKCODE)",
      "pbiTo": "DIM_STOCK (STOCKCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Xí nghiệp / Chi nhánh thành viên nhận chỉ tiêu KPI tháng"
    },
    {
      "id": "r26",
      "fromTable": "Dim_ParentStock",
      "fromField": "ParentStockCode",
      "toTable": "Fact_KPI_Year",
      "toField": "Parent_Stock",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_YEAR (PARENT_STOCK)",
      "pbiTo": "DIM_PARENTSTOCK (PARENTSTOCKCODE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Đơn vị mẹ (Xí nghiệp cấp 1) nhận chỉ tiêu kế hoạch tổng thể năm"
    },
    {
      "id": "r27",
      "fromTable": "Dim_Year",
      "fromField": "Value",
      "toTable": "Fact_KPI_Year",
      "toField": "Year",
      "type": "1 : N",
      "pbiFrom": "FACT_KPI_YEAR (YEAR)",
      "pbiTo": "DIM_YEAR (VALUE)",
      "status": "Active",
      "cardinality": "* : 1",
      "desc": "Năm tài chính áp dụng chỉ tiêu kế hoạch tổng thể công ty"
    }
  ]
};

export const futureModules = {
  "dashboard": {
    "title": "Hệ thống Báo cáo Quản trị Dashboard",
    "subtitle": "Nền tảng trực quan hóa thời gian thực trên Microsoft Power BI",
    "status": "under_development",
    "statusText": "Đang trong quá trình hoàn thiện tích hợp",
    "progress": 75,
    "description": "Phân hệ Dashboard kết nối trực tiếp cơ sở dữ liệu Kho DWH Sovigaz, cung cấp cho Ban Lãnh đạo bức tranh toàn diện về sức khỏe tài chính, dòng tiền và năng lực sản xuất của 11 xí nghiệp thành viên.",
    "plannedPages": [
      {
        "name": "Trang Tổng quan Doanh thu Toàn hệ thống",
        "desc": "Theo dõi tổng doanh thu thuần, tỷ trọng bán ngoài và luân chuyển nội bộ, so sánh tốc độ tăng trưởng so với cùng kỳ.",
        "keyMetrics": [
          "Doanh thu thuần lũy kế",
          "Tỷ trọng LCNB / Tổng DT",
          "Top 10 khách hàng lớn nhất"
        ]
      },
      {
        "name": "Trang Phân tích Chi tiết Giao dịch Bán hàng",
        "desc": "Truy vấn chi tiết từng dòng hóa đơn chứng từ, phân loại sản phẩm, số lượng xuất và đơn giá bình quân.",
        "keyMetrics": [
          "Giá trị trước thuế",
          "Tiền thuế VAT",
          "Sản lượng xuất bán"
        ]
      },
      {
        "name": "Trang Giám sát Công nợ & Rủi ro Tuổi nợ",
        "desc": "Biểu đồ tháp tuổi nợ, theo dõi biến động nợ quá hạn và dự báo dòng tiền thu hồi theo các tài khoản 131, 136.",
        "keyMetrics": [
          "Tổng dư nợ phải thu",
          "Tỷ lệ nợ quá hạn > 60 ngày",
          "Tốc độ thu hồi nợ trung bình"
        ]
      },
      {
        "name": "Trang Đo lường Hoàn thành Kế hoạch KPI (A3)",
        "desc": "Bảng theo dõi tiến độ hoàn thành kế hoạch tháng, năm và ma trận sức khỏe tài chính của từng xí nghiệp.",
        "keyMetrics": [
          "% Hoàn thành KHDT",
          "% Hoàn thành KHSX",
          "Độ lệch kế hoạch"
        ]
      }
    ]
  },
  "machineLearning": {
    "title": "Phân hệ Học máy & Dự báo Thông minh",
    "subtitle": "Ứng dụng AI phân tích chuỗi thời gian & xếp hạng rủi ro tín dụng khách hàng",
    "status": "under_development",
    "statusText": "Đang trong giai đoạn nghiên cứu & huấn luyện mô hình",
    "progress": 30,
    "description": "Áp dụng các thuật toán Học máy hiện đại vào tập dữ liệu hơn 229,000 dòng lịch sử để tối ưu hóa bài toán dự báo nhu cầu khí công nghiệp và chấm điểm tín nhiệm khách hàng.",
    "plannedModels": [
      {
        "name": "Mô hình Dự báo Nhu cầu Tiêu thụ Khí Công nghiệp",
        "algo": "Chuỗi thời gian (Prophet & XGBoost Regressor)",
        "objective": "Dự báo sản lượng tiêu thụ Oxy lỏng, Nitơ và Argon theo tuần/tháng tại từng khu vực công nghiệp nhằm tối ưu hóa kế hoạch hóa lỏng và tồn kho an toàn.",
        "benefits": "Giảm 18% chi phí lưu kho và hao hụt khí bay hơi tự nhiên tại các bồn áp lực cao."
      },
      {
        "name": "Mô hình Phân tầng Rủi ro Khách hàng & Thu hồi Công nợ",
        "algo": "Phân loại (LightGBM & Random Forest)",
        "objective": "Dựa trên lịch sử thanh toán, chu kỳ hóa đơn và dư nợ để dự đoán xác suất khách hàng thanh toán trễ hạn quá 30 ngày.",
        "benefits": "Cảnh báo sớm các khoản nợ khó đòi trước 2 kỳ thanh toán, hỗ trợ phòng kế toán đưa ra chính sách tín dụng phù hợp."
      },
      {
        "name": "Mô hình Phân cụm Khách hàng Bán buôn (RFM Segmentation)",
        "algo": "Phân cụm không giám sát (K-Means & DBSCAN)",
        "objective": "Phân loại hơn 1,000 đối tác khách hàng thành các nhóm chiến lược để thiết lập chính sách chiết khấu và ưu tiên cấp hàng linh hoạt.",
        "benefits": "Nâng cao mức độ giữ chân khách hàng trọng yếu và thúc đẩy doanh thu bán buôn."
      }
    ]
  },
  "ragChatbot": {
    "title": "Trợ lý Trí tuệ Nhân tạo Tra cứu Dữ liệu (Chatbot RAG)",
    "subtitle": "Hệ thống truy xuất tăng cường kết nối trực tiếp Kho DWH Sovigaz",
    "status": "under_development",
    "statusText": "Đang trong lộ trình xây dựng kiến trúc Vector & RAG Pipeline",
    "progress": 20,
    "description": "Trợ lý AI thông minh cho phép Ban Lãnh đạo và phòng Kế hoạch tra cứu thông tin sản xuất, số liệu doanh thu và quy định biểu mẫu A3 bằng ngôn ngữ tự nhiên thông qua kỹ thuật RAG.",
    "features": [
      {
        "title": "Hỏi đáp số liệu kinh doanh tức thời bằng ngôn ngữ tự nhiên",
        "desc": "Người dùng có thể gõ câu hỏi: \"Doanh thu xí nghiệp miền Nam tháng 12 đạt bao nhiêu % kế hoạch?\", hệ thống tự động sinh truy vấn và trả lời kèm bảng biểu trực quan."
      },
      {
        "title": "Tra cứu quy định & biểu mẫu A3 chuẩn mực",
        "desc": "Truy vấn nhanh công thức tính toán đơn vị chuẩn DVC, quy chế luân chuyển nội bộ và hướng dẫn xử lý số liệu kế toán."
      },
      {
        "title": "Bảo mật dữ liệu nội bộ với kiến trúc Enterprise RAG",
        "desc": "Dữ liệu được vector hóa và lưu trữ cục bộ, kiểm soát quyền truy cập theo vai trò người dùng (Role-Based Access Control)."
      }
    ],
    "architectureComponents": [
      "Cơ sở dữ liệu Vector (ChromaDB) lưu trữ tài liệu đặc tả & biểu mẫu A3",
      "Công cụ trích xuất metadata từ CSDL Kho DWH Sovigaz SQL Server",
      "Mô hình ngôn ngữ lớn hỗ trợ đa nhiệm ngữ cảnh tiếng Việt kỹ thuật chuyên sâu",
      "Giao diện hội thoại tương tác mượt mà tích hợp ngay trên cổng điều hành"
    ]
  }
};
