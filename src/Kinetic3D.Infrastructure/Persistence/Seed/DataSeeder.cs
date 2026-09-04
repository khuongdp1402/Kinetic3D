using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kinetic3D.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Kinetic3D.Infrastructure.Persistence.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        if (await context.Categories.AnyAsync())
        {
            return;
        }

        var kStandard = new Category
        {
            Id = Guid.NewGuid(),
            Name = "K-Standard",
            Slug = "k-standard",
            Description = "Dòng sản phẩm tiêu chuẩn hóa có tệp khách hàng rộng: Đồ decor phong cách công nghệ, keycap độc lạ, dock sạc thông minh và mô hình in sẵn.",
            Image = "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop"
        };

        var kPersonal = new Category
        {
            Id = Guid.NewGuid(),
            Name = "K-Personal",
            Slug = "k-personal",
            Description = "Dòng cá nhân hóa sâu: Tượng Chibi kỷ niệm vẽ từ ảnh chụp thật bằng AI dựng hình, bảng hiệu signature 3D nổi và logo độc bản.",
            Image = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
        };

        var kHeritage = new Category
        {
            Id = Guid.NewGuid(),
            Name = "K-Heritage",
            Slug = "k-heritage",
            Description = "Dòng lưu niệm văn hóa: Bản mô phỏng kiến trúc danh lam thắng cảnh ứng dụng vật liệu in thế hệ mới (composite vân gỗ/đá).",
            Image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
        };

        context.Categories.AddRange(kStandard, kPersonal, kHeritage);

        var products = new List<Product>
        {
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Cyber-Tech Desk Organizer",
                Slug = "cyber-tech-desk-organizer",
                CategoryId = kStandard.Id,
                BasePrice = 290000,
                Description = "Dock sạc thông minh kết hợp khay đựng đồ phong cách Cyber-tech. In nguyên khối bằng nhựa PETG độ bền cao, tích hợp đèn LED nền hắt sáng và khe tản nhiệt cho thiết bị di động.",
                ShortDescription = "Dock sạc & khay đựng thông minh phong cách công nghệ.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Nhựa PETG" }, { "Khối lượng", "250g" }, { "Kích thước", "20 x 15 x 8cm" } },
                Colors = new List<string> { "Cyber Black", "Neon Lime" },
                Sizes = new List<string> { "Tiêu Chuẩn" },
                InStock = true,
                Featured = true
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Artisan Mech Keycap Set",
                Slug = "artisan-mech-keycap-set",
                CategoryId = kStandard.Id,
                BasePrice = 150000,
                Description = "Bộ 4 nút Keycap Artisan cho bàn phím cơ, được in bằng công nghệ Resin SLA độ phân giải siêu cao (0.02mm). Các chi tiết nổi khối 3D sắc nét theo chủ đề khoa học viễn tưởng.",
                ShortDescription = "Keycap Resin độc bản chủ đề Sci-Fi.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Resin SLA" }, { "Khối lượng", "10g" }, { "Profile", "Cherry/SA" } },
                Colors = new List<string> { "Clear Resin", "Cyber Yellow" },
                Sizes = new List<string> { "1U (Phím thường)" },
                InStock = true,
                Featured = false
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Mecha Anime Figurine",
                Slug = "mecha-anime-figurine",
                CategoryId = kStandard.Id,
                BasePrice = 480000,
                Description = "Mô hình Mecha tĩnh thu nhỏ 1:12. Bề mặt được xử lý chà nhám tinh tế và có các rãnh đi chìm (panel line) sắc xảo để khách hàng tự do sơn phết theo ý thích.",
                ShortDescription = "Mô hình Mecha in sẵn tỉ lệ 1:12.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Nhựa PLA+" }, { "Khối lượng", "350g" }, { "Tỉ lệ", "1:12" } },
                Colors = new List<string> { "Xám Base", "Trắng" },
                Sizes = new List<string> { "15cm", "25cm" },
                InStock = true,
                Featured = true
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Tượng Chibi Kỷ Niệm (AI-Generated)",
                Slug = "tuong-chibi-ky-niem-ai",
                CategoryId = kPersonal.Id,
                BasePrice = 1200000,
                Description = "Khách hàng cung cấp ảnh chân dung, hệ thống AI Generative sẽ tạo hình Chibi 3D dễ thương. Sản phẩm in bằng Resin lỏng cao cấp cho bề mặt láng mịn, tái hiện thần thái khuôn mặt chân thực.",
                ShortDescription = "Tượng Chibi cá nhân hóa độc bản từ ảnh thật.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Resin cao cấp" }, { "Công nghệ", "AI Gen 3D" }, { "Quy trình", "Thiết kế & In" } },
                Colors = new List<string> { "Sơn Phết Thủ Công", "Màu Nhựa Gốc" },
                Sizes = new List<string> { "10cm", "15cm", "20cm" },
                InStock = true,
                Featured = true
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Bảng Hiệu Signature 3D",
                Slug = "bang-hieu-signature-3d",
                CategoryId = kPersonal.Id,
                BasePrice = 790000,
                Description = "Bảng hiệu đặt bàn hoặc treo tường khắc nổi 3D tên cá nhân hoặc thông điệp riêng. Có tích hợp đèn LED âm bản tạo hiệu ứng hắt sáng neon độc đáo.",
                ShortDescription = "Bảng hiệu nổi 3D tích hợp LED âm bản.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "PLA & Acrylic" }, { "Đèn", "LED Neon Flex" }, { "Kích thước", "Tùy chỉnh" } },
                Colors = new List<string> { "Đen/Xanh Lá", "Trắng/Cam" },
                Sizes = new List<string> { "Cỡ Nhỏ", "Cỡ Trung" },
                InStock = true,
                Featured = false
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Logo Độc Bản F&B",
                Slug = "logo-doc-ban-fb",
                CategoryId = kPersonal.Id,
                BasePrice = 1500000,
                Description = "Được thiết kế dành riêng cho quán cafe, nhà hàng. Dựng nổi 3D logo thương hiệu với chi tiết phức tạp, sơn thủ công chống phai và độ cứng cáp chống va đập tốt.",
                ShortDescription = "Logo nổi 3D cho chuỗi F&B.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "PETG độ bền cao" }, { "Độ dày", "10 - 20mm" }, { "Tuổi thọ", "> 5 năm" } },
                Colors = new List<string> { "Theo yêu cầu thương hiệu" },
                Sizes = new List<string> { "Tùy chỉnh" },
                InStock = true,
                Featured = false
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Mô Hình Chùa Một Cột K-Heritage",
                Slug = "mo-hinh-chua-mot-cot-k-heritage",
                CategoryId = kHeritage.Id,
                BasePrice = 650000,
                Description = "Bản mô phỏng danh lam thắng cảnh ứng dụng vật liệu in thế hệ mới pha trộn 30% bột gỗ tự nhiên. Cho ra sản phẩm có vân nhám như gỗ thật và thoang thoảng hương thơm nhẹ.",
                ShortDescription = "Mô hình kiến trúc in từ Composite Vân Gỗ.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Wood-Composite (30% bột gỗ)" }, { "Kích thước", "12 x 12 x 15cm" }, { "Hương thơm", "Gỗ tự nhiên" } },
                Colors = new List<string> { "Gỗ Sồi Trắng", "Gỗ Óc Chó" },
                Sizes = new List<string> { "Tiêu Chuẩn" },
                InStock = true,
                Featured = true
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Khuê Văn Các Mini",
                Slug = "khue-van-cac-mini",
                CategoryId = kHeritage.Id,
                BasePrice = 750000,
                Description = "Mô hình biểu tượng Khuê Văn Các được in bằng công nghệ FDM cực nét. Kết cấu rỗng thông minh giúp làm giảm trọng lượng và tối ưu vật liệu bảo vệ môi trường.",
                ShortDescription = "Mô hình Khuê Văn Các làm quà lưu niệm.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Nhựa PLA sinh học" }, { "Độ chi tiết", "Cao (Lớp cắt 0.1mm)" } },
                Colors = new List<string> { "Đỏ Gạch", "Gỗ Cổ" },
                Sizes = new List<string> { "Tỉ lệ 1:50", "Tỉ lệ 1:100" },
                InStock = true,
                Featured = false
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Di Tích Tháp Chăm Vân Đá",
                Slug = "di-tich-thap-cham-van-da",
                CategoryId = kHeritage.Id,
                BasePrice = 1100000,
                Description = "Khối kiến trúc Tháp Chăm được phục dựng 3D qua máy quét (scan 3D) và in bằng vật liệu Composite pha bột đá. Cầm nặng tay, nhám lạnh y như đá thật ngàn năm tuổi.",
                ShortDescription = "Mô phỏng Tháp Chăm bằng Composite Vân Đá.",
                Images = new List<string>
                {
                    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                },
                Specs = new Dictionary<string, string> { { "Vật liệu", "Stone-Composite" }, { "Trọng lượng", "850g" }, { "Cảm giác bề mặt", "Nhám mịn tự nhiên" } },
                Colors = new List<string> { "Đá Sa Thạch", "Đá Xám Cổ" },
                Sizes = new List<string> { "Tiêu Chuẩn" },
                InStock = true,
                Featured = true
            }
        };

        context.Products.AddRange(products);

        const string adminPassword = "Admin@123";
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@kinetic3d.io",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            DisplayName = "Kinetic3D Admin",
            Role = "Admin"
        };

        context.Users.Add(admin);

        await context.SaveChangesAsync();

        logger.LogInformation("Seed data created. Admin login: {Email} / {Password}", admin.Email, adminPassword);
    }
}
