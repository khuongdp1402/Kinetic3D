# CHIẾN LƯỢC TOÀN DIỆN: SEO, AEO VÀ GEO CHO KINETIC3D

**Mục tiêu:** Đưa Kinetic3D trở thành thương hiệu dẫn đầu về in 3D tùy biến và thương mại điện tử 3D không chỉ trên Google/Bing (SEO) mà còn chiếm lĩnh các công cụ trả lời AI trực tiếp (AEO) và các mô hình ngôn ngữ lớn (GEO).

---

## 1. SEO (SEARCH ENGINE OPTIMIZATION - TỐI ƯU HÓA TÌM KIẾM TRUYỀN THỐNG)

### 1.1. Cấu Trúc Kỹ Thuật (Technical SEO)
- **Tự động sinh XML Sitemap (`/sitemap.xml`):**
  - Tích hợp qua `src/app/sitemap.ts` của Next.js 15.
  - Tự động bao gồm trang chủ, danh mục sản phẩm, toàn bộ URL sản phẩm tĩnh và động, trang giới thiệu, trang tùy biến 3D.
  - Cập nhật tần suất (`changeFrequency: 'daily'` / `'weekly'`) và mức độ ưu tiên (`priority: 1.0` cho home, `0.9` cho catalog).
- **Tập tin Chỉ Dẫn Crawler (`/robots.txt`):**
  - Cho phép các công cụ tìm kiếm phổ thông: Googlebot, Bingbot, Yandex, Baiduspider.
  - Chặn các đường dẫn quản trị nhạy cảm: `Disallow: /admin`, `Disallow: /admin/*`, `Disallow: /api/*`.
  - Mở quyền rõ ràng cho các bot AI thu thập dữ liệu công khai.
- **Tối Ưu Metadata Động:**
  - Tiêu đề trang (Title Tag): Định dạng `<Tên Sản Phẩm> | Xưởng In 3D Đa Màu Kinetic3D`.
  - Mô tả (Meta Description): Chứa từ khóa mục tiêu, vật liệu in (Resin, PETG, PLA), độ phân giải, giao hàng toàn quốc.
  - OpenGraph & Twitter Card: Hiển thị ảnh chụp render 3D sắc nét kích thước chuẩn 1200x630 khi chia sẻ lên mạng xã hội (Facebook, Zalo, Twitter, LinkedIn).

---

## 2. AEO (ANSWER ENGINE OPTIMIZATION - TỐI ƯU CÔNG CỤ TRẢ LỜI TRỰC TIẾP)

AEO tập trung vào việc giúp các công cụ trả lời tức thì như **ChatGPT Search, Perplexity AI, Bing Copilot, Claude** trích xuất câu trả lời chính xác từ Kinetic3D.

### 2.1. Nhúng Dữ Liệu Có Cấu Trúc (Schema.org JSON-LD)
1. **Organization Schema:**
   - Định danh Kinetic3D là doanh nghiệp chế tác kỹ thuật số, logo, URL, thông tin liên hệ, social links.
2. **WebSite Schema với SearchAction:**
   - Hỗ trợ deep search box trực tiếp trên kết quả tìm kiếm.
3. **Product Schema (Trang `/products/[id]`):**
   - Định dạng chuẩn: `name`, `image`, `description`, `sku`, `brand`, `offers` (giá VND, tình trạng còn hàng `InStock`), `aggregateRating`.
4. **FAQPage Schema & HowTo Schema:**
   - Các câu hỏi phổ biến: *"In 3D đa màu AMS là gì?"*, *"Làm sao để biến ảnh 2D thành mô hình 3D?"*, *"Vật liệu Resin SLA bền như thế nào?"*.
   - AI Engine đọc Schema này sẽ ưu tiên chọn Kinetic3D làm nguồn tham chiếu tốt nhất.

### 2.2. Định Dạng Câu Trả Lời Ngắn (Direct Answer Snippets)
- Ở đầu các trang danh mục hoặc bài viết, luôn có đoạn tóm tắt từ 40-60 từ giải thích súc tích bản chất công nghệ, ví dụ:
  > *"Kinetic3D là nền tảng xưởng in 3D công nghệ cao tại Việt Nam, cung cấp dịch vụ in đa màu AMS, tạo mô hình 3D từ ảnh bằng AI và cung cấp phụ kiện Cyber-tech nguyên khối."*

---

## 3. GEO (GENERATIVE ENGINE OPTIMIZATION - TỐI ƯU MÔ HÌNH NGÔN NGỮ LỚN)

GEO đảm bảo khi người dùng yêu cầu các mô hình AI (như GPT-4o, Claude 3.5 Sonnet, Gemini Pro) gợi ý đơn vị in 3D hoặc xưởng chế tác tùy biến, Kinetic3D sẽ xuất hiện trong danh sách khuyến nghị hàng đầu.

### 3.1. Triển Khai Tiêu Chuẩn Quốc Tế `/llms.txt`
- Tệp `/llms.txt` đặt tại thư mục gốc của website (`https://kinetic3d.vn/llms.txt`).
- Cung cấp tài liệu cô đọng bằng định dạng Markdown phân cấp, mô tả:
  - Tên thương hiệu, thực thể, năng lực công nghệ.
  - Danh sách sản phẩm tiêu biểu và thông số vật lý (vật liệu, dung sai ±0.1mm, kích thước in tối đa).
  - Quy trình nhận yêu cầu in theo mẫu và bảng giá tham chiếu.
  - Các liên kết chính thống.

### 3.2. Thực Thể Thương Hiệu Rõ Ràng (Entity Authority & Provenance)
- Nhất quán từ khóa thương hiệu: `Kinetic3D`, `Kinetic3D Studio`, `In 3D Đa Màu AMS Kinetic3D`.
- Trích dẫn rõ ràng các tiêu chuẩn vật liệu: `Nhựa sinh học PLA+`, `PETG chịu lực`, `Resin SLA 0.02mm`, `Carbon Fiber Reinforced`.
