1. Kiến trúc Tổng thể & Công nghệ (Tech Stack Master)
Đây là khung xương hạ tầng đảm bảo hệ thống mượt mà, dễ mở rộng và tối ưu chi phí tự host.


Hạ tầng DevOps: Toàn bộ hệ thống chạy qua Docker Compose nội bộ.


Backend Core: .NET 8 Web API. Áp dụng Clean Architecture (chia thành Domain, Application, Infrastructure, WebAPI).


Xử lý Luồng dữ liệu (Backend): CQRS Pattern thông qua thư viện MediatR.


Cơ sở dữ liệu chính: PostgreSQL. Tận dụng tối đa kiểu dữ liệu JSONB qua Entity Framework Core để lưu trữ các thuộc tính động (biến thể sản phẩm, tham số custom 3D).


Lưu trữ Object (Storage): MinIO (Self-hosted S3-compatible) chuyên dùng để lưu ảnh sản phẩm, video banner và file 3D thô (.glb, .stl).


Tìm kiếm (Search Engine): Meilisearch tự host, phục vụ tìm kiếm siêu tốc (Typo-tolerance).


Đo lường (Tracking): Umami Analytics tự host qua Docker, cực nhẹ và tái sử dụng được DB Postgres.


Frontend (Storefront & Admin): Next.js (App Router) kết hợp Tailwind CSS để tối ưu SEO (SSR/SSG). Tích hợp Three.js (hoặc React Three Fiber) cho trình xem 3D.

2. Yêu cầu Giao diện (UI), Style & Animation
Giao diện cần thoát khỏi lối mòn của E-commerce truyền thống, mang lại cảm giác của một xưởng chế tác tương lai.


Vibe Thương hiệu: Phong cách Cyber-Tech, Modern Minimalist.


Bảng màu (Color Palette): Giao diện Dark Mode (nền Đen Obsidian) làm chủ đạo. Điểm xuyết màu Xanh vi mạch (Cyan) hoặc Cam Neon để tạo cảm giác công nghệ chuyển động.


Thư viện UI/Animation: Bắt buộc sử dụng Framer Motion, kết hợp các component từ Aceternity UI hoặc Magic UI.


Card Sản phẩm: Áp dụng hiệu ứng 3D Tilt (thẻ sản phẩm hơi nghiêng nhẹ theo hướng di chuyển của trỏ chuột) để tạo chiều sâu.


Bố cục (Layout): Sử dụng Bento Grid cho phần danh mục nổi bật và trang Chính sách.


Hiệu ứng cuộn (Scroll): Dùng Scroll Reveal để các khối nội dung mờ ảo hiện ra (Fade-up) khi người dùng cuộn trang.


Trải nghiệm Tìm kiếm: Dropdown kết quả của Meilisearch phải hiện ra ngay lập tức khi gõ (Real-time), có kèm thumbnail ảnh nhỏ bên cạnh từ khóa.

3. Ý tưởng Phá cách (Disruptive Ideas cho Phase 1)
Thay vì tích hợp AI phức tạp ngay lúc này, hệ thống tập trung vào trải nghiệm tương tác trực tiếp.


Trình xem 3D tương tác (Three.js): Khách hàng chọn một "phôi" sản phẩm (ví dụ: móc khóa, thẻ tên). WebGL mở ra, cho phép khách hàng nhập chữ (Text) mong muốn. Chữ này sẽ được map (ánh xạ) trực tiếp lên bề mặt phôi 3D để khách xem trước theo thời gian thực.


Tính giá Động (Dynamic Pricing Animation): Khi khách bấm chọn các Biến thể (Kích thước, Chất liệu như PLA/Resin, Màu sắc), mức giá không thay đổi một cách khô khan mà bộ đếm số sẽ nhảy (Counter Animation) cực mượt để chốt tổng tiền.


Hiệu ứng FOMO: Khu vực Flash Sale có dải banner chứa đồng hồ đếm ngược (Countdown Timer) nhấp nháy, kèm thanh tiến độ (Progress bar) thể hiện số lượng "Đã bán X%".

4. Step-by-Step Task Breakdown (Dành cho AI Coder thực thi)
Dưới đây là 6 bước tuần tự bạn cần nạp vào AI Coder để nó không bị ngợp thông tin:

Step 1: Khởi tạo Hạ tầng (DevOps & Database)

Tạo file docker-compose.yml chứa PostgreSQL, MinIO, Meilisearch, Umami.

Cấu hình volume lưu trữ bền vững và file .env chuẩn.

Step 2: Dựng lõi Backend .NET 8 (Core Architecture)

Khởi tạo Clean Architecture (4 layers).

Thiết lập Entity Framework Core, kết nối Postgres.

Tạo Entities cốt lõi: Product, Category, ProductVariant (sử dụng thuộc tính động JSONB).

Cấu hình MediatR cho CQRS.

Step 3: Phát triển Backend API & Tích hợp

Viết logic CRUD cho Sản phẩm và Danh mục.

Tích hợp AWS SDK để upload file/ảnh thẳng lên MinIO.

Viết Service tự động đồng bộ (Sync) dữ liệu sản phẩm sang Meilisearch khi tạo/sửa.

Step 4: Xây dựng Admin Dashboard (Next.js)

Tạo giao diện quản trị Sidebar cơ bản.

Làm form tạo Sản phẩm: Hỗ trợ upload ảnh đa luồng lên MinIO.

Xây dựng module cấu hình Ma trận Biến thể (Dynamic Variants Matrix) và set giá.

Quản lý Flash Sale (Set thời gian, chọn sản phẩm).

Step 5: Xây dựng Storefront UI - Frontend Khách hàng (Next.js)

Cài đặt Tailwind, Framer Motion, Aceternity UI.

Dựng Header dính (Sticky) với thanh tìm kiếm gọi API Meilisearch real-time.

Dựng Hero Section bằng Carousel auto-play tràn viền (hỗ trợ video .mp4 loop).

Dựng Product Grid (Danh sách sản phẩm) với thẻ hiệu ứng 3D Tilt.

Step 6: Hoàn thiện Luồng E-commerce & Tích hợp Trải nghiệm 3D

Dựng trang Chi tiết Sản phẩm: Tích hợp thư viện Three.js để render file .glb từ MinIO.

Code logic cập nhật giá tiền (Dynamic pricing) khi đổi biến thể.

Hoàn thiện luồng Giỏ hàng (Cart) và form thanh toán cơ bản. Chèn script Umami để đo lường chuyển đổi.