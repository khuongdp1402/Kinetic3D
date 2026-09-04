# KINETIC3D — MASTER PROJECT SPECIFICATION
**Version:** 2.0 (Production-Ready Architecture)  
**Status:** Canonical Single Source of Truth (SSOT)  
**Last Updated:** September 2026  

> [!IMPORTANT]
> **DÀNH CHO TẤT CẢ AGENT / LẬP TRÌNH VIÊN TIẾP THEO:**  
> Đây là tài liệu quy chuẩn đặc tả toàn bộ dự án **Kinetic3D**. Trước khi thực hiện bất kỳ thay đổi nào về kiến trúc, cơ sở dữ liệu, API hoặc giao diện người dùng, bạn **BẮT BUỘC** phải đọc kỹ tài liệu này. Khi có bất kỳ thay đổi nào phát sinh trong quá trình phát triển, bạn **BẮT BUỘC** phải cập nhật lại tài liệu này để duy trì tính đồng nhất cho toàn hệ thống.

---

## 1. TỔNG QUAN & TẦM NHÌN DỰ ÁN (PROJECT VISION)

**Kinetic3D** là nền tảng thương mại điện tử 3D thế hệ mới kết hợp xưởng chế tác kỹ thuật số tùy biến theo yêu cầu (Disruptive 3D E-Commerce & Futuristic Custom Fabrication Workshop).

- **Sứ mệnh cốt lõi:** Xóa bỏ sự nhàm chán của các trang thương mại điện tử truyền thống; mang đến trải nghiệm 3D tương tác thời gian thực, trực quan hóa sản phẩm bằng Three.js/WebGL, tính toán báo giá động tức thì và khả năng biến ý tưởng 2D thành sản phẩm thực tế.
- **Phong cách thiết kế (Aesthetic Direction):** **Cyber-Tech / Modern Minimalist**:
  - Tông màu chủ đạo: Nền tối sâu thẳm (`#0a0a0f`, `#12131a`), điểm nhấn vàng hổ phách / cam neon (`#f5b942`, `#fb923c`), độ tương phản cao, typography hiện đại (`Be Vietnam Pro`, `JetBrains Mono`).
  - Tiêu chuẩn hiệu năng: Mọi trang phải đảm bảo tốc độ cuộn lướt 60-120 FPS mượt mà, không giật lag, tối ưu hóa triệt để GPU/CPU (chỉ sử dụng 3D WebGL khi người dùng tương tác chi tiết, không lạm dụng Canvas nặng trên trang chủ).

---

## 2. CHIẾN LƯỢC SẢN PHẨM & SẢN PHẨM TRỌNG TÂM (CORE OFFERINGS)

### 2.1. Sản Phẩm Thương Mại Sẵn Có (Ready-to-Ship Catalog)
- **K-Standard (Phụ kiện bàn làm việc công nghệ cao):** Dock sạc thông minh Cyber-tech in nguyên khối PETG, đế tản nhiệt đèn LED, khay đựng đồ phong cách viễn tưởng.
- **Artisan Mech Keycaps:** Bộ phím cơ độc bản in công nghệ Resin SLA độ phân giải siêu cao (0.02mm), chủ đề Sci-Fi/Mecha.
- **Mecha & Figurine:** Mô hình tĩnh nhân vật, robot Mecha tỷ lệ 1:12 với panel line sắc nét phục vụ sở thích sơn phết thủ công.

### 2.2. Sản Phẩm KEY Chiến Lược (Key Differentiators & Revenue Drivers)
1. **Bản In Đa Màu AMS (Multi-Material / Multi-Color 3D Fabrication):**
   - Ứng dụng công nghệ in đa vật liệu/đa màu tự động (Automatic Material System).
   - Mô hình lắp ráp phức hợp nhiều chi tiết cơ khí (ví dụ: Bản in xe tăng Sherman M4A1 gồm 75 chi tiết trên khay in).
   - Cho phép xem trước cấu trúc tháo rời (exploded view) trong trang chi tiết sản phẩm.
2. **Công Cụ AI Tạo 3D Từ Ảnh 2D (Image-to-3D Generator Studio):**
   - Cho phép người dùng tải lên hình ảnh chụp thực tế, hình phác thảo (sketch) hoặc bản vẽ 2D qua thanh Capsule viền Neon xoay động phong cách Tripo3D.
   - Hệ thống tự động phân tích và tạo mô hình 3D (Mesh Quad tối ưu từ 500 đến 2M poly, kèm bộ texture PBR 8K).
3. **Dịch Vụ In 3D Theo Yêu Cầu (Custom On-Demand Requests):**
   - Người dùng tải file STL/OBJ/STEP hoặc gửi yêu cầu tùy biến kích thước, màu sắc và vật liệu.
   - Định giá động theo thể tích vật liệu (Volume-based pricing), thời gian in và độ phân giải lớp in.
4. **Trình Cấu Hình 3D Thời Gian Thực (Interactive 3D Configurator):**
   - Trực tiếp xoay, thu phóng, đổi chất liệu (PLA+, PETG, Resin, Carbon) và màu sắc ngay trong trình duyệt.
   - Hiển thị công tơ mét giá động (Pricing Odometer) cập nhật mượt mà khi thay đổi thông số.

---

## 3. KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ (TECHNICAL ARCHITECTURE)

```
[ Client Browser (Next.js 15) ] 
       │ HTTP / JSON / FormData
       ▼
[ Kinetic3D.WebAPI (.NET 8) ] ── Clean Architecture
       ├── Application Layer (MediatR CQRS, FluentValidation)
       ├── Domain Layer (Entities, Value Objects, Domain Events)
       └── Infrastructure Layer
             ├── PostgreSQL (JSONB Dynamic Attributes)
             ├── MinIO (S3-compatible Asset Storage: GLB/STL/Images)
             ├── Meilisearch (Instant Full-Text Search Engine)
             └── Casso / VietQR (Automated Banking Webhook)
```

### 3.1. Backend: .NET 8 WebAPI & Clean Architecture
- **Kinetic3D.Domain:** Định nghĩa các thực thể cốt lõi (`Product`, `Category`, `Order`, `OrderItem`, `CustomRequest`, `User`).
- **Kinetic3D.Application:** Chứa các lệnh CQRS (Commands/Queries qua MediatR), DTOs, Event Handlers và Interfaces.
- **Kinetic3D.Infrastructure:**
  - `ApplicationDbContext` (Entity Framework Core 8 với Npgsql).
  - `MinioStorageService`: Tải lên và quản lý tệp nhị phân 3D (`.glb`, `.stl`, `.step`) và hình ảnh.
  - `MeilisearchService`: Đồng bộ chỉ mục tìm kiếm tức thì cho sản phẩm thông qua Domain Events.
  - `JwtTokenGenerator` & `CurrentUserService`: Bảo mật xác thực API.
- **Kinetic3D.WebAPI:** Các REST Controllers chuẩn hóa (`ProductsController`, `CategoriesController`, `OrdersController`, `CustomRequestsController`, `UploadsController`, `AuthController`).

### 3.2. Cơ Sở Dữ Liệu: PostgreSQL & Quy Chuẩn JSONB
> [!CAUTION]
> **QUY TẮC CỐT LÕI VỀ CSDL:** TUYỆT ĐỐI KHÔNG tạo các bảng riêng biệt cho Color hoặc Size. Mọi biến thể và thuộc tính động bắt buộc phải lưu trong cột `JSONB`.

- **Bảng `Products`**:
  - `Id` (UUID/string)
  - `Name`, `Slug`, `Description`, `ShortDescription` (text)
  - `BasePrice` (decimal)
  - `CategoryId` (FK to `Categories`)
  - `Images` (text array)
  - `Model3DUrl` (text - URL file GLB/STL trong MinIO)
  - `Colors` (JSONB array: `["Matte Black", "Cyber Gold", "Neon Orange"]`)
  - `Sizes` (JSONB array: `["Standard", "Scale 1:12", "XL"]`)
  - `Specs` (JSONB object: `{"Vật liệu": "Resin SLA", "Độ phân giải": "0.02mm"}`)
  - `PricingRules` (JSONB: Quy tắc cộng trừ giá theo tùy chọn)
  - `Featured` (boolean - cờ đánh dấu hiển thị tại trang chủ)
  - `InStock` (boolean), `IsDeleted` (boolean - soft delete), `CreatedAt`, `UpdatedAt`
- **Bảng `Categories`**: `Id`, `Name`, `Slug`, `Description`, `ImageUrl`, `IsActive`.
- **Bảng `Orders`**: `Id`, `OrderNumber`, `CustomerEmail`, `CustomerName`, `CustomerPhone`, `ShippingAddress`, `ShippingCity`, `TotalAmount`, `DiscountAmount`, `FinalAmount`, `PaymentMethod` (COD, CassoVietQR), `PaymentStatus` (Pending, Paid, Failed), `OrderStatus` (Pending, Processing, Completed, Cancelled), `CreatedAt`.
- **Bảng `OrderItems`**: `Id`, `OrderId`, `ProductId`, `Quantity`, `UnitPrice`, `SelectedVariant` (JSONB: `{color, size, customText}`), `Subtotal`.
- **Bảng `CustomRequests`**: `Id`, `CustomerEmail`, `CustomerName`, `Description`, `FileUrl`, `Status`, `EstimatedPrice`, `CreatedAt`.

### 3.3. Frontend: Next.js 15 (App Router) & React 19
- **Thư mục:** `src/Kinetic3D.WebUI_V2/`
- **Quản lý trạng thái:** Zustand (`useCartStore` lưu trạng thái giỏ hàng, tự động đồng bộ localStorage).
- **Đồ họa 3D:** Three.js, `@react-three/fiber`, `@react-three/drei` (Được cô lập tại trang chi tiết `/products/[id]`, giải phóng tài nguyên trang chủ).
- **Hiệu ứng & Hoạt ảnh:** Framer Motion, CSS 3D Transforms (`perspective: 1300px` cho Curved Carousel), CSS GPU Keyframe Animations.

### 3.4. Dịch Vụ Hạ Tầng Độc Lập (Self-Hosted Docker)
- **MinIO:** Cổng 9000 (API) / 9001 (Console UI). Lưu trữ bucket `kinetic3d-assets`.
- **Meilisearch:** Cổng 7700. Đảm bảo phản hồi tìm kiếm < 15ms.
- **PostgreSQL:** Cổng 5432.
- **Môi trường triển khai:** Chạy độc lập hoàn toàn bằng `docker-compose.yml`, không phụ thuộc vào dịch vụ đám mây trả phí của bên thứ 3.

---

## 4. CHI TIẾT CÁC CHỨC NĂNG ĐANG CÓ (FUNCTIONAL INVENTORY)

1. **Trang Chủ (Storefront Landing Page - `http://localhost:3003/`):**
   - **Hero Banner:** Curved 3D Arc Carousel hình trụ uốn cong đa chiều (Tripo3D style), hỗ trợ vuốt chạm, auto-play, đổi slide.
   - **Logo Marquee:** Thanh thương hiệu đối tác chuyển động liên tục.
   - **Chuyển Ảnh Thành 3D (Image-to-3D):** Thanh tải ảnh Capsule với viền Neon chạy động 360 độ liên tục, hỗ trợ drag-and-drop; Visual 3D render sắc nét kèm 2 popup lệch tầng (Trên-Trái: Chi tiết cao; Dưới-Phải: Mesh thông minh).
   - **Sản Phẩm Nổi Bật (Featured Grid):** Lưới 5 cột responsive, lấy 8-12 sản phẩm được đánh dấu `featured: true` từ admin, tích hợp hiệu ứng `SplitRevealImage` (khi rê chuột, vạch laser chia cắt bám theo con trỏ chuột soi bản vẽ mộc bên trái và bản tô màu bên phải; mặc định hiển thị 100% màu đầy đủ).
   - **Lĩnh Vực Ứng Dụng (Industry Showcase):** Giao diện tab 5 ngành (E-Commerce, Game Dev, VR/AR, Industrial Design, Animation) cuộn mượt mà không dùng horizontal pinning.
   - **Social Proof & Final CTA:** Thống kê đánh giá và nút kêu gọi hành động với ánh sáng ambient CSS thuần (0% tải WebGL phụ).
2. **Trang Danh Mục & Tìm Kiếm (`/products`):**
   - Lọc theo danh mục, khoảng giá, trạng thái nổi bật.
   - Tìm kiếm tức thì với Meilisearch (gõ ký tự hiện kết quả ngay lập tức).
3. **Trang Chi Tiết Sản Phẩm & 3D Configurator (`/products/[id]`):**
   - Viewer 3D tương tác xoay 360, đổi màu sắc, chất liệu và kích thước.
   - Hiển thị thông số kỹ thuật chi tiết, quy cách in 3D, file mô hình đính kèm.
   - Nút Thêm vào giỏ / Mua ngay với cập nhật giá tức thì.
4. **Giỏ Hàng & Thanh Toán (`/cart`, `/checkout`):**
   - Modal giỏ hàng trượt từ cạnh phải, điều chỉnh số lượng, áp mã giảm giá (voucher).
   - Trang thanh toán thu thập thông tin người nhận, địa chỉ giao hàng và phương thức thanh toán.
5. **Cổng Quản Trị Admin (`/admin`):**
   - Quản lý sản phẩm (thêm/sửa/xóa, upload ảnh lên MinIO, gán cờ `featured`).
   - Quản lý danh mục sản phẩm.
   - Quản lý đơn hàng và trạng thái đơn.
   - Quản lý yêu cầu in tùy biến (`/admin/custom-requests`).
   - Quản lý chiến dịch Flash Sales & Vouchers.

---

## 5. BÁO CÁO DỌN DẸP CODE DƯ THỪA (CLEANUP REPORT)

Đã loại bỏ các tài liệu cũ và component không còn sử dụng để tránh nhầm lẫn:
- **Tài liệu cũ đã xóa:**
  - `Kinetic3D_Phase1_MasterPlan.md` (Kế hoạch sơ khai giai đoạn 1).
  - `plan.md` (Tài liệu phác thảo tạm thời).
  - `db_structure.md` (Đã tích hợp đầy đủ vào tài liệu này).
  - Các thư mục phase thử nghiệm cũ (`.planning/phases/06` đến `.planning/phases/10`).
- **Mã nguồn dư thừa đã xóa:**
  - `ProductStack.tsx` (Component ghim sticky 100vh gây gián đoạn cuộn trang — đã thay bằng `FeaturedProductsGrid.tsx`).
  - `ShermanShowcaseSection.tsx` (Component 3D xe tăng nặng 16.5MB GLB trên trang chủ — đã chuyển về trang chi tiết sản phẩm).
  - `FeaturesBento.tsx` (Component bento "Công nghệ đằng sau" theo yêu cầu người dùng).
  - `ManifestoReveal.tsx` (Component tuyên ngôn có pinning scroll).
  - `ToonhubHero.tsx` (Component hero thử nghiệm cũ).

---

## 6. CHIẾN LƯỢC TOÀN DIỆN: SEO, AEO VÀ GEO

Để chuẩn bị vận hành thực tế và đạt thứ hạng cao trên các công cụ tìm kiếm và AI, hệ thống áp dụng chiến lược 3 trụ cột:

```
┌──────────────────────────────────────────────────────────────┐
│                    KINETIC3D DISCOVERY ENGINE                │
├───────────────────┬──────────────────────┬───────────────────┤
│    SEO (Search)   │     AEO (Answer)     │   GEO (Generative)│
│  Google / Bing    │ ChatGPT / Perplexity │  LLMs / Citations │
├───────────────────┼──────────────────────┼───────────────────┤
│ • Dynamic Metadata│ • Schema.org JSON-LD │ • /llms.txt feed  │
│ • sitemap.xml     │ • Direct QA Snippets │ • Entity branding │
│ • robots.txt      │ • FAQPage markup     │ • Clean technical │
│ • Semantic HTML5  │ • Product structured │   provenance docs │
└───────────────────┴──────────────────────┴───────────────────┘
```

1. **SEO (Search Engine Optimization - Công cụ tìm kiếm truyền thống):**
   - Sinh metadata động (`title`, `description`, OpenGraph, Twitter Cards) cho từng sản phẩm và danh mục.
   - Cung cấp `sitemap.ts` tự động sinh ra XML Sitemap chứa toàn bộ URL hợp lệ.
   - Cung cấp `robots.ts` chỉ dẫn bot thu thập dữ liệu đúng cách, chặn các trang `/admin` nhạy cảm.
2. **AEO (Answer Engine Optimization - Tối ưu cho công cụ trả lời như Perplexity, ChatGPT Search, Claude):**
   - Nhúng JSON-LD Schema (`Organization`, `WebSite`, `Product`, `FAQPage`) vào `layout.tsx` và `products/[id]`.
   - Cung cấp các đoạn định nghĩa trực tiếp (Direct Answers) về thông số vật liệu in 3D (PETG, PLA+, SLA Resin) để AI trích xuất làm câu trả lời chuẩn xác.
3. **GEO (Generative Engine Optimization - Tối ưu cho mô hình ngôn ngữ AI):**
   - Triển khai tệp chuẩn quy ước quốc tế `/llms.txt` tại thư mục `public/`.
   - Giúp các bot AI (GPTBot, ClaudeBot, PerplexityBot) đọc hiểu toàn bộ danh mục dịch vụ, năng lực in 3D và cấu trúc sản phẩm của Kinetic3D chỉ qua một tệp văn bản tinh gọn mà không cần crawl phức tạp.

---

## 7. ĐẶC TẢ TÍCH HỢP THANH TOÁN CASSO (VIETQR AUTOMATION)

Để phục vụ vận hành thực tế tại thị trường Việt Nam, hệ thống chuẩn bị tích hợp cổng thanh toán tự động qua **Casso.vn** (Mã VietQR động):

### 7.1. Luồng Hoạt Động (Workflow)
1. **Tạo Đơn Hàng:** Khách hàng chọn thanh toán chuyển khoản ngân hàng -> Backend tạo bản ghi đơn hàng với mã định danh `KINETIC_{ORDER_ID}` (ví dụ: `KINETIC_1082`).
2. **Hiển Thị VietQR Động:** Frontend hiển thị mã QR VietQR chuẩn NAPAS 247 được sinh tự động với:
   - Ngân hàng thụ hưởng & Số tài khoản của Kinetic3D Studio.
   - Số tiền chính xác (`FinalAmount`).
   - Nội dung chuyển khoản bắt buộc: `KINETIC_{ORDER_ID}`.
3. **Người Dùng Chuyển Khoản:** Khách hàng quét mã bằng bất kỳ app ngân hàng nào (Vietcombank, MB, Techcombank, MoMo, v.v.). Tiền được chuyển tức thì qua NAPAS.
4. **Casso Bắn Webhook:** Trong vòng 1-2 giây, hệ thống Casso phát hiện biến động số dư và gửi HTTP POST Webhook tới backend:
   ```
   POST /api/payments/casso-webhook
   Header: Secure-Token: <CASSO_WEBHOOK_SECRET>
   Body: { "data": [{ "description": "KINETIC_1082...", "amount": 350000, ... }] }
   ```
5. **Khớp Lệnh & Cập Nhật Trạng Thái:**
   - Backend xác thực `Secure-Token`.
   - Phân tích cú pháp chuỗi mô tả để lấy `ORDER_ID`.
   - Kiểm tra số tiền khớp với `FinalAmount`.
   - Cập nhật `PaymentStatus = Paid`, kích hoạt quy trình sản xuất in 3D và gửi email xác nhận.
   - Frontend tự động chuyển hướng sang trang *"Thanh toán thành công"*.

---

## 8. TRUNG TÂM ĐỒNG BỘ 3D & KHO MẪU HẠT GIỐNG (3D MODEL INGESTION ENGINE & SEED CATALOG)

Nhằm giải quyết bài toán khởi đầu (Cold Start) khi xưởng chưa có sẵn file 3D và ảnh thực tế, Kinetic3D trang bị hệ thống **3D Model Ingestion Engine** với các đặc điểm:

### 8.1. Trang Quản Trị Đồng Bộ Dữ Liệu 3D (`/admin/sync`)
- Cho phép quản trị viên xem danh mục các mẫu in 3D tuyển chọn từ các kho mở hàng đầu thế giới (Thingiverse, Khronos Group, Three.js Samples, Open 3D Archives).
- Hỗ trợ xem trước thông số in (kích thước mm, khối lượng nhựa gram, thời gian in dự kiến, số chi tiết).
- Chức năng **chọn lọc bằng checkbox** và bấm **"Đồng bộ về hệ thống" (Sync Selected)** để tự động nạp vào PostgreSQL với đầy đủ thông số kỹ thuật JSONB, giá bán, giá khuyến mãi và đường dẫn file 3D (.glb).
- Hiển thị trực quan trạng thái: *"Đã có trong Shop"* (kèm link xem trực tiếp) vs *"Sẵn sàng nạp"*.

### 8.2. Danh Mục 18 Sản Phẩm 3D Thật (Verified 3D Real Catalog) & Bản Quyền Hợp Pháp
Toàn bộ 18 sản phẩm trong hệ thống hiện tại đều sở hữu file mô hình 3D (.glb) thật 100% cùng ảnh thumbnail là ảnh chụp/render 3D thực tế của chính mẫu in (không sử dụng stock photo hay ảnh không khớp):
1. **Xe Tăng Hạng Trung Sherman M4A1 (AMS Edition):** 62 chi tiết in rời lắp ghép cơ học, file `sherman_print_plate.glb`, thumbnail `sherman-m4a1-plate.jpg`.
2. **Siêu Xe Thể Thao Tương Lai Concept One (1:24):** Hypercar concept PBR bóng bẩy, file `CarConcept.glb`, thumbnail `car-concept.jpg`.
3. **Đồng Hồ Cơ Khí Chronograph Thụy Sĩ (Luxury Watch):** Bezel vát kim cương và vỏ kim loại, file `ChronographWatch.glb`, thumbnail `watch-chronograph.jpg`.
4. **Kính Mát Thời Trang Tương Lai Cyberpunk Khronos:** Gọng in PETG siêu nhẹ rãnh polarized, file `SunglassesKhronos.glb`, thumbnail `sunglasses-khronos.jpg`.
5. **Xe Đua Đồ Chơi Khớp Lắp Ráp Cơ Học (Modular Toy Car):** Khung thân tháo lắp và bánh xe lăn mượt mà, file `ToyCar.glb`, thumbnail `toy-car.jpg`.
6. **Cáo Lửa Thần Thoại Low-Poly Khớp Động (Flexi Fox):** Khớp cử động linh hoạt print-in-place, file `Fox.glb`, thumbnail `fox-figurine.jpg`.
7. **Đèn Lồng Bão Kim Loại Vintage (Vintage Lantern):** Khung sắt cổ điển quai xách cơ khí, file `Lantern.glb`, thumbnail `lantern-retro.jpg`.
8. **Bình Nước Thể Thao Tối Giản Cách Nhiệt (Water Bottle):** Thân rãnh công thái học nắp ren kín nước, file `WaterBottle.glb`, thumbnail `water-bottle.jpg`.
9. **Đài Cassette Retro 1980s Cyber Boombox:** Băng từ cổ điển loa đôi, file `BoomBox.glb`, thumbnail `boombox-retro.jpg`.
10. **Máy Ảnh Cổ Điển Bellows Steampunk (Antique Camera):** Ống thụt da xếp và chân tripod gỗ kim loại, file `AntiqueCamera.glb`, thumbnail `antique-camera.jpg`.
11. **Đèn Rọi Công Nghiệp Treo Tường (Barn Wall Lamp):** Chóa đèn nhôm kim loại cổ điển, file `AnisotropyBarnLamp.glb`, thumbnail `barn-lamp.jpg`.
12. **Vịt Vàng Đồ Chơi Khớp Mảnh In 3D (Classic Yellow Duck):** Biểu tượng Rubber Duck Debugging, file `Duck.glb`, thumbnail `duck-yellow.png`.
13. **Rồng Thần Thoại Khớp Động (Flexi Dragon Multi-Color):** Rồng in liền khối uốn lượn đa màu, file `DragonAttenuation.glb`, thumbnail `dragon-sculpture.jpg`.
14. **Mũ Giáp Chiến Binh Cyberpunk (Damaged Helmet):** Tượng decor viễn tưởng vết xước chiến trường, file `DamagedHelmet.glb`, thumbnail `cyber-helmet.png`.
15. **Hộp Bánh Răng Hành Tinh Vô Tận (Planetary Gear Fidget):** 6 bánh răng vệ tinh quay đồng tốc print-in-place, file `GearboxAssy.glb`, thumbnail `gearbox-assy-print.jpg`.
16. **Robot Trợ Lý Biểu Cảm Cyber-Bot (Expressive Robot):** Khớp động biểu cảm sinh động, file `RobotExpressive.glb`, thumbnail `robot-expressive-print.jpg`.
17. **Động Cơ Đẩy Không Gian Primary Ion Drive:** Buồng đốt plasma viễn tưởng Sci-Fi, file `PrimaryIonDrive.glb`, thumbnail `primary-ion-drive-print.jpg`.
18. **Tượng Điêu Khắc Nữ Hoàng Nefertiti (Stone Edition):** Scan bảo tàng 3D tinh xảo vương miện hoàng gia, file `Nefertiti.glb`, thumbnail `nefertiti-bust-print.jpg`.

### 8.3. Trình Cấu Hình 3D Kỹ Thuật Tại Trang Chi Tiết (`/products/[id]`)
- Nhúng **Three.js 3D Viewer** với 3 chế độ kiểm tra chuyên sâu:
  - **PBR Màu:** Render vật liệu thực tế với độ bóng và phản xạ ánh sáng môi trường.
  - **Phôi Clay:** Mô phỏng phôi in nhựa thô mờ (matte finish).
  - **Lưới Wireframe:** Soi cấu trúc lưới đa giác 3D màu hổ phách (`#f59e0b`).
- Bảng **6 thẻ thông số in 3D kỹ thuật**: Số chi tiết, Thời gian in, Khối lượng, Dung sai kỹ thuật, Công nghệ in, Độ cao lớp in.
- Ma trận biến thể thực tế: Vật liệu (PLA+, PETG, Resin SLA, Carbon Fiber), Tỉ lệ (Scale), Hoàn thiện thủ công, Khắc laser tên cá nhân hóa.
- **Công tơ mét nhảy giá động (Price Odometer)** tính toán tức thì theo thời gian thực và kết nối trực tiếp vào giỏ hàng & thanh toán VietQR.

---

## 9. GIAO THỨC DÀNH CHO CÁC AGENT TƯƠNG LAI (MAINTENANCE PROTOCOL)

Khi bạn (hoặc bất kỳ AI agent nào) được giao nhiệm vụ mở rộng hệ thống Kinetic3D, bạn **BẮT BUỘC** tuân thủ các nguyên tắc sau:
1. **Đọc Spec trước:** Bắt đầu công việc bằng cách đọc tài liệu này (`PROJECT_SPEC.md`).
2. **Không phá vỡ kiến trúc CSDL:** Tuyệt đối không tạo bảng riêng cho Color/Size; tiếp tục sử dụng JSONB cho thuộc tính động.
3. **Giữ vững phong cách Cyber-Tech & 60FPS:** Mọi component mới phải tuân thủ bảng màu tối, điểm nhấn vàng hổ phách, không gây giật lag trang chủ.
4. **Cập nhật Spec khi có thay đổi:** Bất kỳ tính năng mới, endpoint mới hoặc sửa đổi cấu trúc nào đều phải được bổ sung ngay vào tài liệu này trước khi hoàn thành phiên làm việc.

