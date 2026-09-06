# Hướng Dẫn Tích Hợp API Tripo3D & Meshy và Chiến Lược Nguồn Bản Vẽ 3D (Kinetic3D)

Tài liệu này cung cấp chi tiết kỹ thuật tích hợp API của **Tripo3D** và **Meshy**, cùng chiến lược vận hành nguồn hàng 3D hỗn hợp (Hybrid 3D Sourcing) cho nền tảng thương mại điện tử **Kinetic3D**.

---

## 1. Tích Hợp API Tripo3D (Tripo AI)

**Website:** [https://www.tripo3d.ai](https://www.tripo3d.ai)  
**API Documentation:** [https://platform.tripo3d.ai/docs](https://platform.tripo3d.ai/docs)  
**Đặc điểm nổi bật:** Tốc độ tạo mô hình 3D cực nhanh (8 - 20 giây), hỗ trợ xuất trực tiếp GLB, USDZ, FBX, OBJ, và có tính năng tự động tối ưu lưới (Auto-Retopology & Quad Mesh).

### 1.1. Luồng hoạt động (Workflow)
1. Client/Backend gửi yêu cầu khởi tạo task (Text-to-3D hoặc Image-to-3D) kèm API Key.
2. Tripo3D trả về `task_id` và trạng thái `queued` / `running`.
3. Backend polling theo chu kỳ 2 - 3 giây hoặc nhận Webhook callback.
4. Khi task đạt `success`, nhận URL tải file `.glb` (và texture PBR) về lưu trữ tại MinIO/S3 của Kinetic3D.

### 1.2. Endpoint Khởi Tạo Task

**POST** `https://api.tripo3d.ai/v2/openapi/task`  
**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <TRIPO_API_KEY>
```

#### A. Text-to-3D (Mô tả văn bản -> Mô hình 3D)
```json
{
  "type": "text_to_model",
  "prompt": "Cyberpunk high-tech robotic helmet, intricate mechanical details, clean topology, studio lighting"
}
```

#### B. Image-to-3D (Ảnh chụp/bản phác thảo 2D -> Mô hình 3D)
```json
{
  "type": "image_to_model",
  "file": {
    "type": "png",
    "url": "https://kinetic3d.vn/uploads/user-sketch.png"
  }
}
```

### 1.3. Endpoint Kiểm Tra Tiến Độ & Nhận Kết Quả

**GET** `https://api.tripo3d.ai/v2/openapi/task/{task_id}`  
**Headers:**
```http
Authorization: Bearer <TRIPO_API_KEY>
```

**Response mẫu khi hoàn thành:**
```json
{
  "code": 0,
  "data": {
    "task_id": "9b8f21e0-xxxx-xxxx-xxxx",
    "type": "text_to_model",
    "status": "success",
    "progress": 100,
    "output": {
      "model": "https://tripo-models.s3.amazonaws.com/xxxx/model.glb",
      "rendered_image": "https://tripo-models.s3.amazonaws.com/xxxx/preview.webp"
    }
  }
}
```

### 1.4. Code Mẫu Backend (.NET 8 Clean Architecture)

```csharp
public class Tripo3DService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public Tripo3DService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _apiKey = config["Tripo3D:ApiKey"]!;
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<string> GenerateFromTextAsync(string prompt)
    {
        var payload = new { type = "text_to_model", prompt };
        var response = await _httpClient.PostAsJsonAsync("https://api.tripo3d.ai/v2/openapi/task", payload);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<TripoTaskResponse>();
        return result.Data.TaskId;
    }

    public async Task<TripoTaskResult?> PollTaskAsync(string taskId)
    {
        var response = await _httpClient.GetAsync($"https://api.tripo3d.ai/v2/openapi/task/{taskId}");
        if (!response.IsSuccessStatusCode) return null;

        var result = await response.Content.ReadFromJsonAsync<TripoTaskResponse>();
        return result?.Data;
    }
}
```

---

## 2. Tích Hợp API Meshy (Meshy AI)

**Website:** [https://www.meshy.ai](https://www.meshy.ai)  
**API Documentation:** [https://docs.meshy.ai](https://docs.meshy.ai)  
**Đặc điểm nổi bật:** Chất lượng chi tiết cao, AI Texturing chuyên nghiệp (Color, Roughness, Normal, Metallic), hỗ trợ Remesh đa giác Quads/Triangles rất chuẩn cho máy in 3D FDM/SLA.

### 2.1. Text to 3D

**POST** `https://api.meshy.ai/openapi/v2/text-to-3d`  
**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <MESHY_API_KEY>
```
**Request Body:**
```json
{
  "mode": "preview",
  "prompt": "Futuristic mechanical cyber warrior, high poly, 3d print ready",
  "art_style": "realistic",
  "negative_prompt": "low quality, blurry, deformed, thin walls"
}
```

### 2.2. Image to 3D

**POST** `https://api.meshy.ai/openapi/v1/image-to-3d`  
**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <MESHY_API_KEY>
```
**Request Body:**
```json
{
  "image_url": "https://kinetic3d.vn/uploads/input-image.jpg",
  "enable_pbr": true,
  "surface_mode": "hard"
}
```

### 2.3. Polling Task Result

**GET** `https://api.meshy.ai/openapi/v2/text-to-3d/{task_id}`  
**Headers:**
```http
Authorization: Bearer <MESHY_API_KEY>
```
**Response mẫu khi thành công:**
```json
{
  "id": "018f3a21-xxxx-xxxx-xxxx",
  "status": "SUCCEEDED",
  "progress": 100,
  "model_urls": {
    "glb": "https://assets.meshy.ai/xxxx/model.glb",
    "fbx": "https://assets.meshy.ai/xxxx/model.fbx",
    "obj": "https://assets.meshy.ai/xxxx/model.obj",
    "usdz": "https://assets.meshy.ai/xxxx/model.usdz"
  },
  "thumbnail_url": "https://assets.meshy.ai/xxxx/thumbnail.png"
}
```

---

## 3. Chiến Lược Nguồn Hàng Bản Vẽ 3D Hỗn Hợp (Hybrid 3D Sourcing)

Để vừa tối ưu chi phí R&D, vừa đảm bảo chất lượng in 100% không lỗi giao cho khách hàng, Kinetic3D áp dụng mô hình 3 tầng:

```
                  ┌─────────────────────────────────────────┐
                  │          KINETIC3D PLATFORM             │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│  TIER 1: CORE    │          │ TIER 2: PARTNER  │          │  TIER 3: AI LAB  │
│ In-House Tested  │          │ Open License /   │          │ On-Demand Custom │
│ 100% Print-Ready │          │ Affiliate 3D     │          │ Pay-As-You-Go    │
└────────┬─────────┘          └────────┬─────────┘          └────────┬─────────┘
         │                             │                             │
         ▼                             ▼                             ▼
Bán trực tiếp có sẵn          Đăng bán chia sẻ phí           Nạp Credit Topup
Casso VietQR / COD            hoặc link Affiliate           Tripo3D / Meshy
```

### Tầng 1: Kho Bản In Độc Quyền Kiểm Định (In-House Core - 100% Print-Ready)
- **Mục tiêu**: Nguồn doanh thu tức thì của **Phase 1 (Production)**.
- **Quy trình**:
  1. Đội ngũ kỹ thuật chọn lọc các model chất lượng cao (M4A1 Sherman, Cyberpunk Helmet, Đồng hồ Chronograph, Siêu xe Concept).
  2. Cắt lát (slicing) qua Bambu Studio / OrcaSlicer, tối ưu độ dày thành (wall loops >= 3), infill (15-25% Gyroid), thiết lập hỗ trợ (Tree Support).
  3. In test mẫu thực tế trên máy Bambu Lab X1C / A1 Mini hoặc máy in Resin 12K.
  4. Sau khi test độ khít khớp nối thành công, mới upload lên cửa hàng Kinetic3D bán cố định.

### Tầng 2: Thư Viện Mở Hợp Pháp & Tiếp Thị Liên Kết (Open Library & Affiliate)
- **Các nguồn tài nguyên hàng đầu**:
  1. **Printables (Prusa)**: Rất nhiều bản vẽ Creative Commons (CC BY, CC BY-SA). Nếu có giấy phép phi thương mại (CC NC), liên hệ tác giả tham gia Printables Club / Patreon để mua **Commercial License** (thường từ $5 - $20/tháng cho phép bán bản in vật lý không giới hạn).
  2. **MakerWorld (Bambu Lab)**: Hệ sinh thái in 3D màu AMS lớn nhất hiện nay. Hầu hết các mẫu đã kèm profile in `.3mf` hoàn chỉnh.
  3. **Thangs & CGTrader & Cults3D**:
     - **Chương trình Affiliate (Ăn hoa hồng)**: Đăng tải hình ảnh render 3D đẹp mắt lên website Kinetic3D, dẫn link affiliate tải bản vẽ sang CGTrader / Cults3D để nhận hoa hồng 10% - 30% khi khách hàng mua file số.
     - **Gia công hộ (Print On Demand)**: Khách hàng mua file hoặc có sẵn file, tải lên Kinetic3D để xưởng báo giá in theo trọng lượng gram nhựa và số giờ máy in.

### Tầng 3: AI 3D On-Demand Custom (Phase 2 Lab)
- **Cơ chế kinh doanh token**:
  - Khách hàng mới nhận **30 Credits miễn phí** (được khóa bởi Hardware Fingerprint chống clone).
  - Khách hàng có thể nạp gói token trả trước (**Starter 100**, **Creator 500**, **Pro 2000**, **Studio 5000**) qua VietQR MBBank.
  - Khi người dùng nhập prompt văn bản hoặc ảnh phác thảo, hệ thống gọi API **Tripo3D / Meshy** tiêu tốn 10 - 25 credits.
  - Người dùng xem trước mô hình 3D trên Three.js viewer ngay trên trình duyệt. Nếu ưng ý, bấm **"Gửi Sang Xưởng Đặt In 3D"** -> Kỹ thuật viên kiểm tra độ dày lưới và báo giá in hoàn thiện.

---

## 4. Mô Hình Thuê Ngoài & Kết Nối Mạng Lưới Xưởng In 3D (Print Farm POD)

Khi đơn hàng tăng cao, xưởng in Kinetic3D kết nối với các đối tác in 3D vệ tinh:
1. **Chuẩn hóa thông số đơn hàng (Payload JSON)**:
   - Tên sản phẩm, link tải file `.3mf` / `.stl` từ MinIO nội bộ.
   - Loại vật liệu: `PLA Matte`, `PETG Carbon Fiber`, `ABS Tough`, `SLA Resin 8K`.
   - Cấu hình in: `Layer height: 0.16mm`, `Infill: 20% Gyroid`, `Color: Black/Neon Green`.
2. **Thông báo đơn qua Telegram Bot**:
   - Khi khách hàng thanh toán thành công qua Casso VietQR, backend tự động bắn thông báo vào nhóm Telegram xưởng in kèm mã đơn, danh sách linh kiện và địa chỉ giao hàng.
3. **Tracking thời gian thực**:
   - Khách hàng và đối tác tra cứu tiến độ in qua `/tracking` bằng mã đơn hàng, số điện thoại hoặc email.
