export const dwhTablesRaw = {
  "DM_RevenueBySaleLedger": {
    "tableName": "DM_RevenueBySaleLedger",
    "tableType": "Fact / Data Mart",
    "domain": "Bán hàng & Doanh thu",
    "columns": [
      {
        "name": "AccountObjectID",
        "businessName": "ID Khách hàng (GUID)",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "Dim_Customer(CustomerID)",
        "description": "Mã định danh duy nhất của khách hàng trên hệ thống MISA (dạng GUID)."
      },
      {
        "name": "AccountObjectNameDI",
        "businessName": "Tên đối tượng khách hàng",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên đầy đủ của khách hàng hoặc đơn vị mua hàng trên hóa đơn chứng từ."
      },
      {
        "name": "InventoryItemCode",
        "businessName": "Mã hàng MISA",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_Products(InventoryItemCode)",
        "description": "Mã vật tư/hàng hóa ban đầu theo danh mục kế toán trên MISA."
      },
      {
        "name": "InventoryItemName",
        "businessName": "Tên mặt hàng bán",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên mô tả của mặt hàng/vật tư xuất bán trên chứng từ."
      },
      {
        "name": "Revenue",
        "businessName": "Doanh thu thuần (VND)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Doanh thu thuần sau chiết khấu và chưa bao gồm thuế GTGT."
      },
      {
        "name": "SaleAmount",
        "businessName": "Tiền hàng trước thuế / Số lượng",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng giá trị tiền hàng bán trước thuế GTGT (VND) hoặc lượng giao dịch theo ngữ cảnh chứng từ."
      },
      {
        "name": "RefDate",
        "businessName": "Ngày chứng từ",
        "role": "Attribute",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "Dim_Date(Date)",
        "description": "Ngày lập chứng từ bán hàng trên phần mềm MISA (định dạng YYYY-MM-DD)."
      },
      {
        "name": "UnitPrice",
        "businessName": "Đơn giá bán giao dịch",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Đơn giá bán của một đơn vị sản phẩm theo đơn vị tính giao dịch (chưa bao gồm VAT)."
      },
      {
        "name": "ReceiptAmount",
        "businessName": "Tổng tiền thanh toán",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng số tiền thanh toán của hóa đơn, bao gồm tiền hàng và thuế GTGT (VND). Dùng để tính doanh thu: ReceiptAmount - VATAmount."
      },
      {
        "name": "VATAmount",
        "businessName": "Tiền thuế GTGT",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số tiền thuế giá trị gia tăng (VAT) ghi nhận trên hóa đơn (VND)."
      },
      {
        "name": "RefNo",
        "businessName": "Số chứng từ",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số chứng từ bán hàng trên MISA (VD: BD00000277, BH00000409)."
      },
      {
        "name": "InvNo",
        "businessName": "Số hóa đơn GTGT",
        "role": "PK",
        "dataType": "BIGINT",
        "nullable": "NO",
        "fk": "-",
        "description": "Số hóa đơn tài chính phát hành cho khách hàng (VD: 277, 409). Dùng để đếm số lượng hóa đơn/đơn hàng."
      },
      {
        "name": "PostedDate",
        "businessName": "Ngày hạch toán",
        "role": "FK",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "Dim_Date(Date)",
        "description": "Ngày ghi sổ kế toán tài chính. Trọng yếu dùng làm khóa liên kết với bảng thời gian Dim_Date để cắt số liệu báo cáo."
      },
      {
        "name": "JournalMemo",
        "businessName": "Diễn giải chứng từ",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "YES",
        "fk": "-",
        "description": "Nội dung ghi chú, giải thích chi tiết nghiệp vụ bán hàng."
      },
      {
        "name": "RefTypeName",
        "businessName": "Loại chứng từ",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Phân loại chứng từ kế toán (VD: Bán hàng hóa trong nước chưa thu tiền, Bán hàng thu tiền ngay)."
      },
      {
        "name": "IsInvoiceExported",
        "businessName": "Trạng thái xuất HĐ",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "YES",
        "fk": "-",
        "description": "Cờ xác định hóa đơn đã được xuất/phát hành hay chưa (1: Đã xuất, 0: Chưa xuất)."
      },
      {
        "name": "IsOutwardExported",
        "businessName": "Trạng thái xuất kho",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "YES",
        "fk": "-",
        "description": "Cờ xác định phiếu xuất kho đã được lập và ghi sổ (1: Đã xuất kho)."
      },
      {
        "name": "RefNoFinance",
        "businessName": "Số chứng từ tài chính",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã định danh chứng từ dùng cho mục đích kế toán tài chính."
      },
      {
        "name": "RefNoManagement",
        "businessName": "Số chứng từ quản trị",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã định danh chứng từ dùng cho mục đích kế toán quản trị nội bộ."
      },
      {
        "name": "DiscountAmount",
        "businessName": "Tiền chiết khấu",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Giá trị chiết khấu thương mại hoặc giảm giá bán hàng cho khách hàng (VND)."
      },
      {
        "name": "BranchID",
        "businessName": "Mã chi nhánh (GUID)",
        "role": "FK",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "Dim_Stock(BranchID)",
        "description": "Mã GUID xác định chi nhánh phát sinh giao dịch bán hàng."
      },
      {
        "name": "AccountObjectCode",
        "businessName": "Mã khách hàng",
        "role": "FK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_Customer(AccountObjectCode)",
        "description": "Mã đối tượng khách hàng trên MISA. Dùng để nối với Dim_Customer lấy phân loại khách hàng (nội bộ hay bên ngoài)."
      },
      {
        "name": "MainUnitPrice",
        "businessName": "Đơn giá chuẩn hóa (DVC)",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Đơn giá đã được quy đổi tương ứng với đơn vị tính chuẩn (Đơn vị chính)."
      },
      {
        "name": "MainConvertRate",
        "businessName": "Hệ số quy đổi",
        "role": "Attribute",
        "dataType": "DECIMAL(10,4)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tỷ lệ chuyển đổi từ đơn vị giao dịch sang đơn vị tính chuẩn (VD: 1 bình = 6 m3 thì hệ số là 6)."
      },
      {
        "name": "MainQuantity",
        "businessName": "Số lượng chuẩn hóa (DVC)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Khối lượng/sản lượng xuất bán đã quy đổi theo đơn vị tính chính (DVC) phục vụ tổng hợp đồng nhất."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày giờ hệ thống thực hiện trích xuất, chuyển đổi và nạp bản ghi này vào DWH."
      },
      {
        "name": "DB",
        "businessName": "Cơ sở dữ liệu nguồn",
        "role": "System",
        "dataType": "VARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên cơ sở dữ liệu nguồn nơi bản ghi được trích xuất (VD: SOVIGAZ_2026_Dev)."
      },
      {
        "name": "UnitID",
        "businessName": "Mã đơn vị tính",
        "role": "FK",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "Dim_Unit(UnitID)",
        "description": "Mã GUID đơn vị tính của mặt hàng giao dịch."
      },
      {
        "name": "InventoryItemCode_New",
        "businessName": "Mã sản phẩm chuẩn hóa",
        "role": "FK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_Products(InventoryItemCode_New)",
        "description": "Mã vật tư/hàng hóa mới đã được chuẩn hóa bởi INDA/Sovigaz để đồng bộ liên kết giữa MISA và File kế hoạch Excel."
      }
    ]
  },
  "DM_AccountObjectDebt": {
    "tableName": "DM_AccountObjectDebt",
    "tableType": "Fact / Data Mart",
    "domain": "Quản lý Công nợ",
    "columns": [
      {
        "name": "AccountObjectCode",
        "businessName": "Mã khách hàng / đối tác",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_Customer(AccountObjectCode)",
        "description": "Mã định danh đối tượng công nợ trên MISA. Nối với Dim_Customer."
      },
      {
        "name": "AccountObjectName",
        "businessName": "Tên khách hàng / đối tác",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên đầy đủ của khách hàng/đơn vị đang theo dõi công nợ."
      },
      {
        "name": "ReceiptableDebtAmount",
        "businessName": "Số nợ còn lại cuối kỳ",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số tiền công nợ còn phải thu tại thời điểm chốt số liệu (VND). Công thức: Dư đầu kỳ + Phát sinh - Đã thanh toán."
      },
      {
        "name": "PaidAmount",
        "businessName": "Số tiền đã thanh toán",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng số tiền khách hàng đã thanh toán/trả nợ trong kỳ (VND)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian hệ thống nạp dữ liệu vào bảng."
      },
      {
        "name": "ReceivableAccountCode",
        "businessName": "Tài khoản công nợ",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Account(Account)",
        "description": "Số hiệu tài khoản kế toán theo dõi công nợ (131: Phải thu khách hàng, 136/1361: Phải thu nội bộ, 344: Nhận ký quỹ, ký cược...)."
      },
      {
        "name": "OpeningBalance",
        "businessName": "Số dư nợ đầu kỳ",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số tiền nợ còn lại chuyển từ kỳ kế toán trước sang kỳ này (VND)."
      },
      {
        "name": "PeriodAmount",
        "businessName": "Số nợ phát sinh trong kỳ",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng giá trị tiền nợ mới phát sinh thêm trong kỳ kế toán (VND)."
      }
    ]
  },
  "Fact_AnalyticsDebit": {
    "tableName": "Fact_AnalyticsDebit",
    "tableType": "Fact / Data Mart",
    "domain": "Quản lý Công nợ",
    "columns": [
      {
        "name": "DebtType",
        "businessName": "Mã phân loại tuổi nợ",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã số định danh nhóm tuổi nợ (1: Nợ trước hạn, 2: Nợ đến hạn, 3: Quá hạn 1-30 ngày, 4: Quá hạn 31-60 ngày, 5: Quá hạn >60 ngày, khó đòi...)."
      },
      {
        "name": "Amount",
        "businessName": "Giá trị nợ (VND)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số tiền nợ rơi vào khoảng tuổi nợ tương ứng (VND)."
      },
      {
        "name": "DebtDescription",
        "businessName": "Diễn giải nhóm tuổi nợ",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên mô tả của nhóm tuổi nợ (VD: 'Nợ trước hạn 0-30 ngày', 'Nợ quá hạn 1-30 ngày', 'Nợ khó đòi'...)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày giờ thực hiện xử lý dữ liệu tuổi nợ."
      },
      {
        "name": "Account",
        "businessName": "Tài khoản công nợ",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "Dim_Account(Account)",
        "description": "Số hiệu tài khoản công nợ (131, 136, 1361...)."
      },
      {
        "name": "AccountObjectCode",
        "businessName": "Mã khách hàng",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_Customer(AccountObjectCode)",
        "description": "Mã đối tượng khách hàng phát sinh khoản nợ."
      }
    ]
  },
  "Fact_ActualProduction": {
    "tableName": "Fact_ActualProduction",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columns": [
      {
        "name": "CategoryName",
        "businessName": "Mã nhóm sản phẩm chuẩn",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_ProductCategories(CategoryName)",
        "description": "Mã danh mục nhóm sản phẩm sản xuất (VD: 1_OXY KHÍ, 2_OXY LỎNG, 9.0_QH48...)."
      },
      {
        "name": "ProductName",
        "businessName": "Tên sản phẩm",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên tiếng Việt của sản phẩm sản xuất (Oxy khí, Oxy lỏng, Que hàn...)."
      },
      {
        "name": "ProductQuantity",
        "businessName": "Sản lượng sản xuất (DVT)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Sản lượng tự sản xuất thực tế tính theo đơn vị tính thông thường tại xí nghiệp."
      },
      {
        "name": "PurchaseQuantity",
        "businessName": "Sản lượng mua ngoài",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số lượng mua bổ sung từ nhà cung cấp bên ngoài nhập kho."
      },
      {
        "name": "ProductQuantityDVC",
        "businessName": "Sản lượng sản xuất (DVC)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Sản lượng sản xuất quy đổi về đơn vị chuẩn đồng nhất của toàn tổng công ty."
      },
      {
        "name": "ProductValue",
        "businessName": "Giá trị sản xuất thực tế",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng giá trị quy tiền của sản lượng sản xuất thực tế đạt được trong tháng (VND)."
      },
      {
        "name": "Date",
        "businessName": "Tháng ghi nhận",
        "role": "PK",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "Dim_Date(Date)",
        "description": "Ngày đầu của tháng ghi nhận số liệu sản xuất (YYYY-MM-01)."
      },
      {
        "name": "FactoryCode",
        "businessName": "Mã nhà máy / xí nghiệp",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Stock(StockCode)",
        "description": "Mã viết tắt xí nghiệp thực hiện sản xuất (BD: Bình Dương, BH: Biên Hòa, CT: Cần Thơ, HP: Hải Phòng, KH: Khánh Hội, NT: Nha Trang...)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian xử lý nạp dữ liệu từ file Excel vào DWH."
      }
    ]
  },
  "Fact_KPI_Month": {
    "tableName": "Fact_KPI_Month",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columns": [
      {
        "name": "Indicator",
        "businessName": "Mã loại chỉ tiêu",
        "role": "FK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Indicator(Indicator)",
        "description": "Mã chỉ tiêu (SP: Sản phẩm, VT-HH: Vật tư hàng hóa, DV: Dịch vụ)."
      },
      {
        "name": "StockCode",
        "businessName": "Mã chi nhánh / xí nghiệp",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Stock(StockCode)",
        "description": "Mã xí nghiệp được giao chỉ tiêu kế hoạch (BD, BH, CT, HP...)."
      },
      {
        "name": "InventoryCodePlan",
        "businessName": "Mã sản phẩm kế hoạch",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_ProductCategories(CategoryName)",
        "description": "Mã dòng sản phẩm theo quy định kế hoạch (VD: 1_OXY KHÍ, 8.1_CO2 KHÍ, 9.2_QH7018...)."
      },
      {
        "name": "InventoryItemName",
        "businessName": "Tên sản phẩm kế hoạch",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên sản phẩm tương ứng trong bảng kế hoạch tháng."
      },
      {
        "name": "InventoryItemGroup",
        "businessName": "Nhóm sản phẩm",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Nhóm ngành hàng (Oxy, Ni tơ, Argon, Que hàn...)."
      },
      {
        "name": "ProductionValue",
        "businessName": "KPI Giá trị sản xuất",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch giá trị sản xuất phải đạt được trong tháng (VND)."
      },
      {
        "name": "ProductUnit",
        "businessName": "KPI Sản lượng SX (DVT)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Chỉ tiêu sản lượng sản xuất theo đơn vị tính thường."
      },
      {
        "name": "ProductUnitDVC",
        "businessName": "KPI Sản lượng SX (DVC)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Chỉ tiêu sản lượng sản xuất quy đổi theo đơn vị chuẩn."
      },
      {
        "name": "QuantityDVT",
        "businessName": "KPI Sản lượng tiêu thụ (DVT)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch sản lượng hàng bán ra theo đơn vị tính thường."
      },
      {
        "name": "QuantityDVC",
        "businessName": "KPI Sản lượng tiêu thụ (DVC)",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch sản lượng hàng bán ra quy đổi theo đơn vị tính chuẩn."
      },
      {
        "name": "Amount",
        "businessName": "KPI Doanh thu tháng",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Chỉ tiêu doanh thu kế hoạch bán hàng trong tháng (VND)."
      },
      {
        "name": "Date",
        "businessName": "Tháng kế hoạch",
        "role": "PK",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "Dim_Date(Date)",
        "description": "Ngày đầu của tháng giao KPI (YYYY-MM-01)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian chạy pipeline xử lý dữ liệu unpivot từ Excel."
      }
    ]
  },
  "Fact_KPI_Year": {
    "tableName": "Fact_KPI_Year",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columns": [
      {
        "name": "Parent_Stock",
        "businessName": "Mã tổng kho / xí nghiệp",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_ParentStock(ParentStockCode)",
        "description": "Mã đơn vị/xí nghiệp cấp quản lý được giao kế hoạch năm."
      },
      {
        "name": "Production",
        "businessName": "Kế hoạch sản xuất năm",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng giá trị sản xuất kế hoạch cả năm của đơn vị (VND)."
      },
      {
        "name": "Amount",
        "businessName": "Kế hoạch doanh thu năm",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tổng doanh thu kế hoạch cả năm của đơn vị (VND)."
      },
      {
        "name": "Year",
        "businessName": "Năm kế hoạch",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "Dim_Year(Value)",
        "description": "Năm giao chỉ tiêu kế hoạch (2022, 2023, 2024, 2025, 2026...)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian xử lý nạp dữ liệu."
      }
    ]
  },
  "Fact_KPI_By_Product": {
    "tableName": "Fact_KPI_By_Product",
    "tableType": "Fact / Data Mart",
    "domain": "Sản xuất & KPI",
    "columns": [
      {
        "name": "RevenueCode",
        "businessName": "Mã chỉ tiêu",
        "role": "FK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Indicator(Indicator)",
        "description": "Mã nhóm chỉ tiêu (SP, VT, HH, DV)."
      },
      {
        "name": "StockCode",
        "businessName": "Mã xí nghiệp",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Stock(StockCode)",
        "description": "Mã chi nhánh/xí nghiệp áp dụng KPI."
      },
      {
        "name": "CategoryName",
        "businessName": "Mã nhóm sản phẩm",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_ProductCategories(CategoryName)",
        "description": "Mã nhóm sản phẩm (VD: 1_OXY KHÍ, 9.0_QH48...)."
      },
      {
        "name": "ProductName",
        "businessName": "Tên sản phẩm",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên gọi sản phẩm."
      },
      {
        "name": "ProductCategoryName",
        "businessName": "Tên nhóm sản phẩm",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên phân nhóm mặt hàng (Que hàn, Khí CO2, Dây thép đai...)."
      },
      {
        "name": "ProductQuantityDVT",
        "businessName": "KHSX theo DVT",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch sản lượng sản xuất cả năm theo đơn vị tính thường."
      },
      {
        "name": "ProductQuantityDVC",
        "businessName": "KHSX theo DVC",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch sản lượng sản xuất cả năm quy đổi đơn vị chuẩn."
      },
      {
        "name": "ProductQuantityDVT1",
        "businessName": "KHTT theo DVT",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch sản lượng tiêu thụ cả năm theo đơn vị tính thường."
      },
      {
        "name": "SaleQuantityDVC",
        "businessName": "KHTT theo DVC",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch sản lượng tiêu thụ cả năm quy đổi đơn vị chuẩn."
      },
      {
        "name": "Amount",
        "businessName": "Kế hoạch doanh thu năm",
        "role": "Measure",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Kế hoạch doanh thu bán hàng cả năm của sản phẩm tại chi nhánh (VND)."
      },
      {
        "name": "Year",
        "businessName": "Năm kế hoạch",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "Dim_Year(Value)",
        "description": "Năm áp dụng kế hoạch."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian xử lý dữ liệu."
      }
    ]
  },
  "Dim_Customer": {
    "tableName": "Dim_Customer",
    "tableType": "Dimension",
    "domain": "Khách hàng & Đối tác",
    "columns": [
      {
        "name": "CustomerID",
        "businessName": "ID khách hàng (GUID)",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã định danh duy nhất của khách hàng trên hệ thống MISA."
      },
      {
        "name": "CustomerName",
        "businessName": "Tên đầy đủ khách hàng",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên công ty, bệnh viện, cơ sở y tế hoặc cá nhân khách hàng."
      },
      {
        "name": "AccountObjectCode",
        "businessName": "Mã đối tượng khách hàng",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã định danh nghiệp vụ kế toán của khách hàng (VD: BDBV78, TKHIEP)."
      },
      {
        "name": "Address",
        "businessName": "Địa chỉ trụ sở / giao dịch",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "YES",
        "fk": "-",
        "description": "Địa chỉ liên hệ hoặc địa chỉ giao hàng của khách hàng."
      },
      {
        "name": "CompanyTaxCode",
        "businessName": "Mã số thuế doanh nghiệp",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã số thuế của doanh nghiệp khách hàng."
      },
      {
        "name": "Tel",
        "businessName": "Điện thoại bàn",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Số điện thoại cố định của khách hàng."
      },
      {
        "name": "Mobile",
        "businessName": "Điện thoại di động",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Số điện thoại liên hệ cá nhân."
      },
      {
        "name": "Fax",
        "businessName": "Số Fax",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Số fax doanh nghiệp."
      },
      {
        "name": "EmailAddress",
        "businessName": "Địa chỉ Email",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "YES",
        "fk": "-",
        "description": "Hòm thư điện tử liên hệ nhận hóa đơn điện tử."
      },
      {
        "name": "Website",
        "businessName": "Trang web",
        "role": "Attribute",
        "dataType": "NVARCHAR(200)",
        "nullable": "YES",
        "fk": "-",
        "description": "Trang thông tin điện tử của khách hàng."
      },
      {
        "name": "AccountObjectGroupListName",
        "businessName": "Nhóm khách hàng MISA",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "YES",
        "fk": "-",
        "description": "Phân loại nhóm khách hàng trên phần mềm kế toán (NL, CN, ĐL, BV...)."
      },
      {
        "name": "Country",
        "businessName": "Quốc gia",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Quốc gia của khách hàng (mặc định: Việt Nam)."
      },
      {
        "name": "ProvinceOrCity",
        "businessName": "Tỉnh / Thành phố",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tỉnh thành nơi khách hàng đăng ký hoạt động."
      },
      {
        "name": "District",
        "businessName": "Quận / Huyện",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "YES",
        "fk": "-",
        "description": "Quận/huyện của khách hàng."
      },
      {
        "name": "WardOrCommune",
        "businessName": "Phường / Xã",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "YES",
        "fk": "-",
        "description": "Phường/xã địa chỉ khách hàng."
      },
      {
        "name": "BranchID",
        "businessName": "Mã chi nhánh quản lý (GUID)",
        "role": "FK",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "Dim_Stock(BranchID)",
        "description": "Mã GUID chi nhánh phụ trách quản lý khách hàng."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian đồng bộ dữ liệu vào DWH."
      },
      {
        "name": "Excel_Customer_Category",
        "businessName": "Phân loại khách hàng chuẩn hóa",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Cột nghiệp vụ then chốt: KHNB (Khách hàng nội bộ), NB (Nội bộ), BV (Bệnh viện), ĐL (Đại lý), NL (Người liên quan/ngoài). Dùng trong logic DAX để tách doanh thu bán ngoài vs LCNB."
      },
      {
        "name": "StockCode",
        "businessName": "Mã xí nghiệp phụ trách",
        "role": "FK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Stock(StockCode)",
        "description": "Mã chi nhánh/xí nghiệp chăm sóc khách hàng (BD, BH, CT, HP, KH, NT, TK, VP)."
      }
    ]
  },
  "Dim_Products": {
    "tableName": "Dim_Products",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columns": [
      {
        "name": "InventoryItemID",
        "businessName": "ID sản phẩm (GUID)",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "-",
        "description": "Khóa chính GUID của sản phẩm trên phần mềm MISA."
      },
      {
        "name": "BranchID",
        "businessName": "Chi nhánh quản lý (GUID)",
        "role": "FK",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "Dim_Stock(BranchID)",
        "description": "Mã chi nhánh quản lý sản phẩm."
      },
      {
        "name": "BarCode",
        "businessName": "Mã vạch sản phẩm",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã vạch quản lý hàng hóa."
      },
      {
        "name": "InventoryItemCode",
        "businessName": "Mã hàng gốc MISA",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã vật tư/sản phẩm nguyên bản trên CSDL MISA."
      },
      {
        "name": "InventoryItemName",
        "businessName": "Tên vật tư / sản phẩm",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên mô tả của mặt hàng/vật tư."
      },
      {
        "name": "InventoryItemType",
        "businessName": "Loại vật tư (Mã số)",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "Dim_InventoryItemType(InventoryItemTypeValue)",
        "description": "Mã loại vật tư: 0: Vật tư hàng hóa, 1: Thành phẩm, 2: Dịch vụ..."
      },
      {
        "name": "InventoryItemCategoryList",
        "businessName": "Danh sách nhóm VT",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "YES",
        "fk": "-",
        "description": "Danh sách mã GUID nhóm vật tư liên quan."
      },
      {
        "name": "InventoryItemCategoryCode",
        "businessName": "Mã nhóm ngành MISA",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã nhóm vật tư trên phần mềm MISA."
      },
      {
        "name": "Description",
        "businessName": "Diễn giải chi tiết",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mô tả quy cách, thông số kỹ thuật của sản phẩm."
      },
      {
        "name": "UnitID",
        "businessName": "Mã đơn vị tính",
        "role": "FK",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "Dim_Unit(UnitID)",
        "description": "Mã GUID đơn vị tính chuẩn."
      },
      {
        "name": "GuarantyPeriod",
        "businessName": "Thời gian bảo hành",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "YES",
        "fk": "-",
        "description": "Thời hạn bảo hành tính theo tháng."
      },
      {
        "name": "MinimumStock",
        "businessName": "Định mức tồn kho tối thiểu",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mức tồn kho an toàn quy định."
      },
      {
        "name": "InventoryItemSource",
        "businessName": "Nguồn gốc sản phẩm",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "YES",
        "fk": "-",
        "description": "Nguồn gốc xuất xứ hàng hóa."
      },
      {
        "name": "DefaultStockID",
        "businessName": "Kho ngầm định (GUID)",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "-",
        "description": "Kho lưu trữ mặc định khi xuất nhập vật tư."
      },
      {
        "name": "InventoryAccount",
        "businessName": "TK kho kế toán",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản theo dõi hàng tồn kho (152, 155, 156...)."
      },
      {
        "name": "COGSAccount",
        "businessName": "TK giá vốn",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản giá vốn hàng bán (632)."
      },
      {
        "name": "SaleAccount",
        "businessName": "TK doanh thu",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản ghi nhận doanh thu bán hàng (511)."
      },
      {
        "name": "PurchaseDiscountRate",
        "businessName": "Tỷ lệ chiết khấu mua",
        "role": "Attribute",
        "dataType": "DECIMAL(5,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tỷ lệ chiết khấu khi mua hàng (%)."
      },
      {
        "name": "UnitPrice",
        "businessName": "Đơn giá chuẩn",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Đơn giá niêm yết chuẩn."
      },
      {
        "name": "SalePrice1",
        "businessName": "Giá bán 1",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Bảng giá bán cấp 1."
      },
      {
        "name": "SalePrice2",
        "businessName": "Giá bán 2",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Bảng giá bán cấp 2."
      },
      {
        "name": "SalePrice3",
        "businessName": "Giá bán 3",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Bảng giá bán cấp 3."
      },
      {
        "name": "FixedSalePrice",
        "businessName": "Giá bán cố định",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Giá bán cố định theo hợp đồng nguyên tắc."
      },
      {
        "name": "IsUnitPriceAfterTax",
        "businessName": "Giá đã gồm thuế",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "YES",
        "fk": "-",
        "description": "Cờ xác định đơn giá đã gồm VAT hay chưa."
      },
      {
        "name": "TaxRate",
        "businessName": "Thuế suất GTGT (%)",
        "role": "Attribute",
        "dataType": "DECIMAL(5,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mức thuế suất VAT áp dụng cho sản phẩm (0%, 5%, 8%, 10%)."
      },
      {
        "name": "ImportTaxRate",
        "businessName": "Thuế nhập khẩu (%)",
        "role": "Attribute",
        "dataType": "DECIMAL(5,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Thuế suất nhập khẩu áp dụng."
      },
      {
        "name": "ExportTaxRate",
        "businessName": "Thuế xuất khẩu (%)",
        "role": "Attribute",
        "dataType": "DECIMAL(5,2)",
        "nullable": "YES",
        "fk": "-",
        "description": "Thuế suất xuất khẩu áp dụng."
      },
      {
        "name": "InventoryCategorySpecialTaxID",
        "businessName": "Thuế tiêu thụ đặc biệt ID",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã thuế tiêu thụ đặc biệt nếu có."
      },
      {
        "name": "IsSystem",
        "businessName": "Là dữ liệu hệ thống",
        "role": "System",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ xác định danh mục mặc định của MISA."
      },
      {
        "name": "Inactive",
        "businessName": "Ngừng sử dụng",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ xác định mặt hàng còn kinh doanh hay đã ngừng (False: Còn dùng)."
      },
      {
        "name": "IsSaleDiscount",
        "businessName": "Có chiết khấu bán",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ xác định mặt hàng có áp dụng chính sách chiết khấu."
      },
      {
        "name": "DiscountType",
        "businessName": "Loại chiết khấu",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Loại hình chiết khấu áp dụng."
      },
      {
        "name": "IsFollowSerialNumber",
        "businessName": "Theo dõi Serial/Lô",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Theo dõi theo số serial/số lô chai khí."
      },
      {
        "name": "CostMethod",
        "businessName": "Phương pháp tính giá vốn",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "YES",
        "fk": "-",
        "description": "Phương pháp xuất kho (Bình quân gia quyền, FIFO...)."
      },
      {
        "name": "CreatedDate",
        "businessName": "Ngày tạo",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày tạo bản ghi trên hệ thống."
      },
      {
        "name": "CreatedBy",
        "businessName": "Người tạo",
        "role": "System",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tài khoản nhân sự tạo bản ghi."
      },
      {
        "name": "ModifiedDate",
        "businessName": "Ngày chỉnh sửa",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày chỉnh sửa gần nhất."
      },
      {
        "name": "ModifiedBy",
        "businessName": "Người chỉnh sửa",
        "role": "System",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tài khoản thực hiện chỉnh sửa."
      },
      {
        "name": "InventoryItemCategoryName",
        "businessName": "Tên phân nhóm vật tư",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên nhóm mặt hàng trên MISA (Phụ tùng, Khí hóa lỏng, Que hàn...)."
      },
      {
        "name": "Specificity",
        "businessName": "Quy cách đặc thù",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "YES",
        "fk": "-",
        "description": "Thông số kỹ thuật đặc thù."
      },
      {
        "name": "PurchaseDescription",
        "businessName": "Mô tả mua hàng",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mô tả chi tiết khi lập đơn mua hàng."
      },
      {
        "name": "SaleDescription",
        "businessName": "Mô tả bán hàng",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "YES",
        "fk": "-",
        "description": "Mô tả chi tiết khi lập đơn bán hàng."
      },
      {
        "name": "TACareerGroupID",
        "businessName": "Mã nhóm ngành thuế",
        "role": "Attribute",
        "dataType": "BIGINT",
        "nullable": "YES",
        "fk": "-",
        "description": "Mã ngành nghề tính thuế theo quy định nhà nước."
      },
      {
        "name": "FixedUnitPrice",
        "businessName": "Đơn giá cố định",
        "role": "Attribute",
        "dataType": "DECIMAL(18,2)",
        "nullable": "NO",
        "fk": "-",
        "description": "Đơn giá cố định theo biểu giá."
      },
      {
        "name": "FrontEndFormula",
        "businessName": "Công thức Front-End",
        "role": "System",
        "dataType": "NVARCHAR(200)",
        "nullable": "YES",
        "fk": "-",
        "description": "Công thức tính toán giao diện."
      },
      {
        "name": "BackEndFormula",
        "businessName": "Công thức Back-End",
        "role": "System",
        "dataType": "NVARCHAR(200)",
        "nullable": "YES",
        "fk": "-",
        "description": "Công thức tính toán tầng CSDL."
      },
      {
        "name": "BaseOnFormula",
        "businessName": "Dựa trên công thức",
        "role": "System",
        "dataType": "NVARCHAR(200)",
        "nullable": "YES",
        "fk": "-",
        "description": "Căn cứ công thức tính giá."
      },
      {
        "name": "IsDeleted",
        "businessName": "Đã xóa",
        "role": "System",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ đánh dấu xóa mềm."
      },
      {
        "name": "ServerRowVersion",
        "businessName": "Phiên bản hàng",
        "role": "System",
        "dataType": "BIGINT",
        "nullable": "NO",
        "fk": "-",
        "description": "Phiên bản dữ liệu đồng bộ server."
      },
      {
        "name": "UploadState",
        "businessName": "Trạng thái tải lên",
        "role": "System",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Trạng thái upload dữ liệu."
      },
      {
        "name": "IsCRM",
        "businessName": "Đồng bộ CRM",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ cho phép đồng bộ sang phần mềm CRM."
      },
      {
        "name": "NotAllowSyncToCRM",
        "businessName": "Chặn đồng bộ CRM",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ ngăn chặn đồng bộ sang CRM."
      },
      {
        "name": "InventoryItemCategoryIDList",
        "businessName": "Chuỗi ID danh mục",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "NO",
        "fk": "-",
        "description": "Chuỗi chứa các ID nhóm vật tư phân cấp."
      },
      {
        "name": "DiscountAccount",
        "businessName": "TK chiết khấu",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản kế toán hạch toán chiết khấu (5211)."
      },
      {
        "name": "SaleOffAccount",
        "businessName": "TK giảm giá",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản kế toán giảm giá hàng bán (5213)."
      },
      {
        "name": "ReturnAccount",
        "businessName": "TK trả lại hàng",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản hàng bán bị trả lại (5212)."
      },
      {
        "name": "ReplaceInventoryItemID",
        "businessName": "ID mặt hàng thay thế",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã hàng thay thế khi hết hàng."
      },
      {
        "name": "ReplaceInventoryItemName",
        "businessName": "Tên hàng thay thế",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tên mặt hàng thay thế."
      },
      {
        "name": "ProcessAccount",
        "businessName": "TK gia công",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản chi phí gia công chế biến."
      },
      {
        "name": "Excel_Product_Name",
        "businessName": "Tên SP theo Excel",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tên sản phẩm tương ứng trong file Excel của Sovigaz."
      },
      {
        "name": "Excel_Category_Name",
        "businessName": "Nhóm SP theo Excel",
        "role": "FK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "Dim_ProductCategories(CategoryName)",
        "description": "Tên nhóm sản phẩm chuẩn hóa dùng liên kết với Dim_ProductCategories (VD: 1_OXY KHÍ, VT, HH, DV...)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian nạp dữ liệu vào DWH."
      },
      {
        "name": "InventoryItemCode_New",
        "businessName": "Mã sản phẩm chuẩn hóa mới",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Khóa chính nghiệp vụ chuẩn hóa mới do dự án thiết kế, đảm bảo liên kết toàn vẹn với bảng Fact Bán hàng và Kế hoạch KPI."
      }
    ]
  },
  "Dim_ProductCategories": {
    "tableName": "Dim_ProductCategories",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columns": [
      {
        "name": "Indicator",
        "businessName": "Mã chỉ tiêu",
        "role": "FK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_Indicator(Indicator)",
        "description": "Mã phân loại chỉ tiêu lớn (SP: Sản phẩm, VT, HH: Vật tư hàng hóa, DV: Dịch vụ, DTTC + DT KHÁC)."
      },
      {
        "name": "CategoryName",
        "businessName": "Mã danh mục chuẩn",
        "role": "PK",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã phân nhóm sản phẩm chuẩn (VD: 1_OXY KHÍ, 2_OXY LỎNG, 3_NITO KHÍ, 8.1_CO2 KHÍ, 9.0_QH48...)."
      },
      {
        "name": "Name",
        "businessName": "Tên sản phẩm chuẩn",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên gọi chuẩn tiếng Việt (Oxy khí, Oxy lỏng, Ni tơ khí, Que hàn N48...)."
      },
      {
        "name": "Group",
        "businessName": "Nhóm ngành khí / vật tư",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên phân nhóm cấp cao (Oxy, Ni tơ, Argon, Que hàn, CO2 Khí, VT,HH, Dịch vụ...)."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian cập nhật danh mục."
      }
    ]
  },
  "Dim_Stock": {
    "tableName": "Dim_Stock",
    "tableType": "Dimension",
    "domain": "Tổ chức & Kho bãi",
    "columns": [
      {
        "name": "StockID",
        "businessName": "ID kho (GUID)",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "-",
        "description": "Khóa GUID định danh kho trên hệ thống CSDL."
      },
      {
        "name": "BranchID",
        "businessName": "Mã chi nhánh (GUID)",
        "role": "Attribute",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã GUID chi nhánh phụ trách kho."
      },
      {
        "name": "StockCode",
        "businessName": "Mã xí nghiệp / kho",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã viết tắt chính thức của xí nghiệp (BD, BH, CT, HP, KH, NT, PR, TK, VP, ZC)."
      },
      {
        "name": "StockName",
        "businessName": "Tên xí nghiệp / chi nhánh",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên đầy đủ của đơn vị (Xí nghiệp Bình Dương, Biên Hòa, Cần Thơ, Hải Phòng, Văn phòng công ty...)."
      },
      {
        "name": "Description",
        "businessName": "Địa chỉ chi nhánh",
        "role": "Attribute",
        "dataType": "NVARCHAR(500)",
        "nullable": "YES",
        "fk": "-",
        "description": "Địa chỉ địa lý nơi đặt trụ sở nhà máy/chi nhánh."
      },
      {
        "name": "InventoryAccount",
        "businessName": "TK kho phụ trách",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản kế toán kho tương ứng."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian đồng bộ danh mục kho."
      },
      {
        "name": "ParentStockCode",
        "businessName": "Mã tổng kho quản lý",
        "role": "FK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "Dim_ParentStock(ParentStockCode)",
        "description": "Mã đơn vị cấp tổng kho quản lý trực tiếp xí nghiệp này."
      }
    ]
  },
  "Dim_ParentStock": {
    "tableName": "Dim_ParentStock",
    "tableType": "Dimension",
    "domain": "Tổ chức & Kho bãi",
    "columns": [
      {
        "name": "ParentStockCode",
        "businessName": "Mã tổng kho quản lý",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã viết tắt của đơn vị cấp trên quản lý (BD, BH, CT, HP, KH, NT, TK, VP)."
      },
      {
        "name": "ParentStockName",
        "businessName": "Tên tổng kho / xí nghiệp quản lý",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên gọi chính thức của đơn vị cấp trên (2. XN Bình Dương, 3. XN Hơi Biên Hòa, 4. XN Hơi Cần Thơ...)."
      }
    ]
  },
  "Dim_Indicator": {
    "tableName": "Dim_Indicator",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columns": [
      {
        "name": "Indicator",
        "businessName": "Mã chỉ tiêu",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Mã viết tắt chỉ tiêu: SP, VT, HH, DV, DTTC + DT KHÁC."
      },
      {
        "name": "Name",
        "businessName": "Tên chỉ tiêu kinh doanh",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Diễn giải đầy đủ: Doanh thu từ sản phẩm, Doanh thu vật tư hàng hóa, Doanh thu dịch vụ, Doanh thu tài chính và khác."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian nạp danh mục."
      }
    ]
  },
  "Dim_InventoryItemType": {
    "tableName": "Dim_InventoryItemType",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columns": [
      {
        "name": "InventoryItemTypeValue",
        "businessName": "Mã loại vật tư (Số)",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Giá trị số phân loại (0, 1, 2...)."
      },
      {
        "name": "InventoryItemTypeName",
        "businessName": "Tên loại vật tư",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên bản chất mặt hàng: Vật tư hàng hóa, Thành phẩm, Dịch vụ."
      },
      {
        "name": "CreatedBy",
        "businessName": "Người tạo",
        "role": "System",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản người tạo."
      },
      {
        "name": "CreatedDate",
        "businessName": "Ngày tạo",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "YES",
        "fk": "-",
        "description": "Ngày tạo bản ghi."
      },
      {
        "name": "ModifiedBy",
        "businessName": "Người sửa",
        "role": "System",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Người chỉnh sửa gần nhất."
      },
      {
        "name": "ModifiedDate",
        "businessName": "Ngày sửa",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày sửa gần nhất."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian nạp dữ liệu."
      }
    ]
  },
  "Dim_Unit": {
    "tableName": "Dim_Unit",
    "tableType": "Dimension",
    "domain": "Vật tư & Sản phẩm",
    "columns": [
      {
        "name": "UnitID",
        "businessName": "Mã đơn vị tính (GUID)",
        "role": "PK",
        "dataType": "UNIQUEIDENTIFIER",
        "nullable": "NO",
        "fk": "-",
        "description": "Khóa chính GUID của đơn vị tính trên MISA."
      },
      {
        "name": "UnitName",
        "businessName": "Tên đơn vị tính",
        "role": "Attribute",
        "dataType": "NVARCHAR(50)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên đơn vị đo lường: chai, m3, kg, cặp, bình, lít..."
      },
      {
        "name": "Description",
        "businessName": "Diễn giải chi tiết",
        "role": "Attribute",
        "dataType": "NVARCHAR(255)",
        "nullable": "YES",
        "fk": "-",
        "description": "Ghi chú quy cách hoặc dịch vụ liên quan."
      },
      {
        "name": "Inactive",
        "businessName": "Ngừng sử dụng",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ xác định đơn vị tính còn hiệu lực hay đã ngừng dùng."
      },
      {
        "name": "IsDeleted",
        "businessName": "Đã xóa",
        "role": "System",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ đánh dấu xóa mềm."
      },
      {
        "name": "CreatedBy",
        "businessName": "Người tạo",
        "role": "System",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản tạo bản ghi."
      },
      {
        "name": "CreatedDate",
        "businessName": "Ngày tạo",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời điểm tạo bản ghi."
      },
      {
        "name": "ModifiedBy",
        "businessName": "Người sửa",
        "role": "System",
        "dataType": "NVARCHAR(50)",
        "nullable": "YES",
        "fk": "-",
        "description": "Tài khoản sửa đổi."
      },
      {
        "name": "ModifiedDate",
        "businessName": "Ngày sửa",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời điểm sửa đổi."
      },
      {
        "name": "RowVersion",
        "businessName": "Phiên bản dòng",
        "role": "System",
        "dataType": "BIGINT",
        "nullable": "NO",
        "fk": "-",
        "description": "Phiên bản dữ liệu nội bộ."
      },
      {
        "name": "ServerRowVersion",
        "businessName": "Phiên bản server",
        "role": "System",
        "dataType": "BIGINT",
        "nullable": "NO",
        "fk": "-",
        "description": "Phiên bản server."
      },
      {
        "name": "UploadState",
        "businessName": "Trạng thái tải lên",
        "role": "System",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Trạng thái upload."
      },
      {
        "name": "ETL_DATE",
        "businessName": "Thời điểm ETL",
        "role": "System",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Thời gian nạp dữ liệu vào DWH."
      }
    ]
  },
  "Dim_Account": {
    "tableName": "Dim_Account",
    "tableType": "Dimension",
    "domain": "Quản lý Công nợ",
    "columns": [
      {
        "name": "Account",
        "businessName": "Số hiệu tài khoản",
        "role": "PK",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Số hiệu tài khoản kế toán theo Thông tư 200 (131, 136, 1361, 344...)."
      },
      {
        "name": "Description",
        "businessName": "Tên gọi tài khoản",
        "role": "Attribute",
        "dataType": "NVARCHAR(100)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên đầy đủ của tài khoản (Phải thu khách hàng, Phải thu nội bộ, Nhận ký quỹ ký cược...)."
      }
    ]
  },
  "Dim_Date": {
    "tableName": "Dim_Date",
    "tableType": "Dimension",
    "domain": "Tổ chức & Thời gian",
    "columns": [
      {
        "name": "DateKey",
        "businessName": "Mã khóa ngày (Số)",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Khóa ngày dạng số nguyên YYYYMMDD (VD: 20240112)."
      },
      {
        "name": "Date",
        "businessName": "Ngày lịch",
        "role": "PK",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Giá trị ngày tháng năm đầy đủ (YYYY-MM-DD 00:00:00)."
      },
      {
        "name": "Day",
        "businessName": "Ngày trong tháng",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Số thứ tự ngày trong tháng (1 - 31)."
      },
      {
        "name": "Month",
        "businessName": "Tháng",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Tháng trong năm (1 - 12)."
      },
      {
        "name": "Year",
        "businessName": "Năm",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Năm dương lịch (2022, 2024, 2026...)."
      },
      {
        "name": "Quarter",
        "businessName": "Quý",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Quý trong năm (1, 2, 3, 4)."
      },
      {
        "name": "Week",
        "businessName": "Tuần trong năm",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Tuần thứ mấy trong năm (1 - 53)."
      },
      {
        "name": "DayOfWeek",
        "businessName": "Thứ trong tuần",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Thứ trong tuần (1: Chủ nhật, 2: Thứ hai ... 7: Thứ bảy)."
      },
      {
        "name": "MonthName",
        "businessName": "Tên tháng tiếng Anh",
        "role": "Attribute",
        "dataType": "VARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên tiếng Anh của tháng (January, February...)."
      },
      {
        "name": "YearMonth",
        "businessName": "Chuỗi Năm-Tháng",
        "role": "Attribute",
        "dataType": "VARCHAR(7)",
        "nullable": "NO",
        "fk": "-",
        "description": "Định dạng YYYY-MM dùng hiển thị trục thời gian (VD: 2024-01)."
      },
      {
        "name": "IsWeekend",
        "businessName": "Là cuối tuần",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ xác định ngày Thứ bảy hoặc Chủ nhật (True/False)."
      }
    ]
  },
  "Dim_Month": {
    "tableName": "Dim_Month",
    "tableType": "Dimension",
    "domain": "Tổ chức & Thời gian",
    "columns": [
      {
        "name": "MonthKey",
        "businessName": "Mã khóa tháng (Số)",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Khóa tháng dạng số nguyên YYYYMM (VD: 202605)."
      },
      {
        "name": "Year",
        "businessName": "Năm",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Năm dương lịch."
      },
      {
        "name": "Month",
        "businessName": "Tháng",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Chỉ số tháng (1 - 12)."
      },
      {
        "name": "MonthName",
        "businessName": "Tên tháng tiếng Anh",
        "role": "Attribute",
        "dataType": "VARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên tiếng Anh của tháng (May, June...)."
      },
      {
        "name": "Quarter",
        "businessName": "Quý",
        "role": "Attribute",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Quý trong năm (1 - 4)."
      },
      {
        "name": "YearMonth",
        "businessName": "Chuỗi Năm-Tháng",
        "role": "PK",
        "dataType": "VARCHAR(7)",
        "nullable": "NO",
        "fk": "-",
        "description": "Định dạng chuỗi YYYY-MM (VD: 2026-05)."
      },
      {
        "name": "StartDate",
        "businessName": "Ngày đầu tháng",
        "role": "Attribute",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày bắt đầu của tháng (YYYY-MM-01)."
      },
      {
        "name": "EndDate",
        "businessName": "Ngày cuối tháng",
        "role": "Attribute",
        "dataType": "DATETIME",
        "nullable": "NO",
        "fk": "-",
        "description": "Ngày kết thúc của tháng (YYYY-MM-28/29/30/31)."
      },
      {
        "name": "IsCurrent",
        "businessName": "Là tháng hiện tại",
        "role": "Attribute",
        "dataType": "BIT",
        "nullable": "NO",
        "fk": "-",
        "description": "Cờ đánh dấu tháng hiện tại đang xử lý số liệu."
      },
      {
        "name": "MonthVietnamese",
        "businessName": "Tên tháng tiếng Việt",
        "role": "Attribute",
        "dataType": "NVARCHAR(20)",
        "nullable": "NO",
        "fk": "-",
        "description": "Tên hiển thị tiếng Việt (Tháng 1, Tháng 2, ..., Tháng 12)."
      }
    ]
  },
  "Dim_Year": {
    "tableName": "Dim_Year",
    "tableType": "Dimension",
    "domain": "Tổ chức & Thời gian",
    "columns": [
      {
        "name": "YearText",
        "businessName": "Chuỗi năm",
        "role": "Attribute",
        "dataType": "VARCHAR(10)",
        "nullable": "NO",
        "fk": "-",
        "description": "Năm dạng chuỗi văn bản (VD: '2026')."
      },
      {
        "name": "Value",
        "businessName": "Giá trị năm",
        "role": "PK",
        "dataType": "INT",
        "nullable": "NO",
        "fk": "-",
        "description": "Giá trị năm dạng số nguyên (VD: 2026). Dùng làm khóa liên kết với Fact_KPI_Year."
      }
    ]
  }
};
export default dwhTablesRaw;
