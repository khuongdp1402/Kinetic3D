TÊN DỰ ÁN: Kinetic3D - Nền tảng E-commerce In 3D & Cá nhân hóa (Phase 1 MVP)

I. MỤC TIÊU PHASE 1
Xây dựng hoàn chỉnh luồng mua bán, trưng bày sản phẩm tiêu chuẩn (decor, keycap), cho phép chọn biến thể (kích thước, màu sắc, chất liệu). Tích hợp tracking traffic chuẩn xác để đo lường hành vi người dùng. Chưa tích hợp AI tạo 3D ở giai đoạn này.

II. KIẾN TRÚC KỸ THUẬT (TECH STACK)

Frontend: Next.js (App Router), Tailwind CSS. Sử dụng Framer Motion và Aceternity UI / Magic UI cho các hiệu ứng animation hiện đại (3D Tilt, Scroll Reveal, Bento Grid).

Backend: .NET 8 Web API. Áp dụng Clean Architecture (Domain, Application, Infrastructure, WebAPI layers). Sử dụng CQRS Pattern thông qua MediatR.

Cơ sở dữ liệu: PostgreSQL (Sử dụng Entity Framework Core, tận dụng kiểu JSONB cho các thuộc tính động).

Lưu trữ tĩnh: MinIO (Self-hosted S3-compatible).

Search Engine: Meilisearch.

Tracking: Umami Analytics (Self-hosted qua Docker).

DevOps: Toàn bộ hạ tầng phụ thuộc chạy qua docker-compose.

III. YÊU CẦU TÍNH NĂNG CHI TIẾT
1. Storefront (Giao diện Khách hàng - Giao diện Cyber/Dark Mode):

Hero Section: Banner carousel động hiển thị sản phẩm nổi bật, kết hợp nút Call-to-Action.
* Danh mục & Tìm kiếm: Thanh tìm kiếm real-time gọi API Meilisearch (trả kết quả ngay khi gõ). Lọc sản phẩm theo Tag (BestSeller, Flash Sale) và Category.

Chi tiết Sản phẩm (Dynamic Variants): Giao diện cho phép chọn Size, Màu, Chất liệu. Giá tiền cập nhật real-time theo lựa chọn. Hiển thị carousel ảnh mượt mà.
* Flash Sale Module: Banner đếm ngược thời gian, hiển thị thanh tiến độ số lượng đã bán.
* Trang Chính sách (Policy): Hiển thị dạng Bento Grid hoặc Icon động.

2. Admin Dashboard & Quản trị:

Quản lý danh mục (Categories) và Tag.
* Quản lý Sản phẩm (CRUD): Upload ảnh trực tiếp lên MinIO, thiết lập ma trận biến thể (Variants) và giá tiền tương ứng.

Quản lý Flash Sale: Set khoảng thời gian và danh sách sản phẩm giảm giá.

Tích hợp Dashboard theo dõi Traffic từ Umami để xem nguồn khách hàng và tỷ lệ chuyển đổi.

IV. QUY TRÌNH TRIỂN KHAI (STEP-BY-STEP)

Step 1: Khởi tạo file docker-compose.yml chứa Postgres, MinIO, Meilisearch, Umami.

Step 2: Dựng khung project .NET 8 theo Clean Architecture, setup EF Core migrations.

Step 3: Xây dựng các API Core (Product, Category, Variants) theo chuẩn CQRS.

Step 4: Khởi tạo Next.js, cấu hình Tailwind, cài đặt Framer Motion. Dựng UI Storefront.

Step 5: Ghép nối API Backend vào Frontend. Test luồng tìm kiếm Meilisearch và load ảnh từ MinIO.