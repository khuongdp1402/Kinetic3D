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
        // Always ensure default admin exists
        if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
        {
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
            logger.LogInformation("Admin user created: {Email} / {Password}", admin.Email, adminPassword);
        }

        // Check if any legacy mock products with null Model3DUrl exist
        var hasLegacyMock = await context.Products.AnyAsync(p => p.Model3DUrl == null || p.Model3DUrl == "");
        var count = await context.Products.CountAsync();

        if (hasLegacyMock || count == 0)
        {
            logger.LogInformation("Phát hiện dữ liệu mẫu cũ (mock không có file 3D). Tiến hành làm sạch và nạp 12 bản in 3D thực tế...");

            // Remove legacy mock products if any
            var legacyProducts = await context.Products.Where(p => p.Model3DUrl == null || p.Model3DUrl == "").ToListAsync();
            if (legacyProducts.Any())
            {
                context.Products.RemoveRange(legacyProducts);
                await context.SaveChangesAsync();
                logger.LogInformation("Đã xóa {Count} sản phẩm mock cũ không có bản in 3D.", legacyProducts.Count);
            }

            // Setup standard categories for real 3D prints
            var catAms = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "ams-multi-color") ?? new Category
            {
                Id = Guid.NewGuid(),
                Name = "Bản In Đa Màu AMS",
                Slug = "ams-multi-color",
                Description = "Công nghệ in đa vật liệu tự động chuyển màu Bambu Lab AMS. Lớp in phân tầng chuẩn xác, bền chắc và sắc nét.",
                Image = "/images/products/sherman-m4a1-plate.jpg"
            };

            var catResin = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "collectible-resin") ?? new Category
            {
                Id = Guid.NewGuid(),
                Name = "Collectible Resin SLA",
                Slug = "collectible-resin",
                Description = "Mô hình tĩnh & Figure điêu khắc in quang hóa Resin SLA độ nét cao hiển vi 0.02mm.",
                Image = "/images/products/cyber-bot-print.jpg"
            };

            var catSciFi = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "industrial-sci-fi") ?? new Category
            {
                Id = Guid.NewGuid(),
                Name = "Industrial & Sci-Fi",
                Slug = "industrial-sci-fi",
                Description = "Mô hình kỹ thuật, cơ khí chính xác, động cơ đẩy không gian và trang thiết bị viễn tưởng tỉ lệ thực tế.",
                Image = "/images/products/primary-ion-drive-print.jpg"
            };

            var catDesk = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "desk-stationery") ?? new Category
            {
                Id = Guid.NewGuid(),
                Name = "Dụng Cụ Học Tập & Bàn Làm Việc",
                Slug = "desk-stationery",
                Description = "Vật phẩm văn phòng, lịch vạn niên, khay cắm bút Voronoi & giá đỡ công nghệ thông minh.",
                Image = "/images/products/thoi-khoa-bieu.jpg"
            };

            var catArtisan = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "artisan-keycaps") ?? new Category
            {
                Id = Guid.NewGuid(),
                Name = "Artisan Keycaps",
                Slug = "artisan-keycaps",
                Description = "Keycap bàn phím cơ chế tác nghệ nhân độc bản, tương thích switch Cherry MX, hiệu ứng xuyên LED.",
                Image = "/images/products/artisan-keycap.jpg"
            };

            var catPip = await context.Categories.FirstOrDefaultAsync(c => c.Slug == "print-in-place") ?? new Category
            {
                Id = Guid.NewGuid(),
                Name = "Print-in-Place Khớp Động",
                Slug = "print-in-place",
                Description = "Mô hình in nguyên khối không cần lắp ráp với các đốt khớp uốn lượn linh hoạt 360 độ.",
                Image = "/images/products/flexi-dragon.jpg"
            };

            var allCats = new[] { catAms, catResin, catSciFi, catDesk, catArtisan, catPip };
            foreach (var c in allCats)
            {
                if (!await context.Categories.AnyAsync(x => x.Id == c.Id || x.Slug == c.Slug))
                {
                    context.Categories.Add(c);
                }
            }
            await context.SaveChangesAsync();

            // 12 Real 3D Printed Products
            var realProducts = new List<Product>
            {
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Xe Tăng Hạng Trung Sherman M4A1 (AMS Edition)",
                    Slug = "m4a1-sherman-tank-ams",
                    CategoryId = catAms.Id,
                    BasePrice = 850000,
                    ShortDescription = "Khay In Đa Vật Liệu AMS // 75 Chi Tiết Tháo Rời",
                    Description = "Khay in đa vật liệu tự động (AMS) mô hình xe tăng Sherman M4A1. Cấu trúc 75 chi tiết cơ khí tháo rời tinh xảo, tái hiện chân thực từng module xích kéo, thân xe và tháp pháo xoay.",
                    ImageUrl = "/images/products/sherman-m4a1-plate.jpg",
                    Images = new List<string>
                    {
                        "/images/products/sherman-m4a1-plate.jpg",
                        "/images/products/sherman-tank-print.jpg"
                    },
                    Model3DUrl = "/models/sherman_print_plate.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Số chi tiết", "75 chi tiết lắp ghép" },
                        { "Thời gian in", "14 giờ 20 phút" },
                        { "Khối lượng", "420g (Nhựa PETG Chịu Lực)" },
                        { "Công nghệ in", "FDM Đa Màu Bambu Lab AMS" },
                        { "Độ cao lớp in", "0.12 mm" },
                        { "Tỉ lệ", "1:35 Chuẩn Sa Bàn Quân Sự" },
                        { "Độ hoàn thiện", "Cắt gọt support sẵn sàng lắp ráp" }
                    },
                    Colors = new List<string> { "Xanh Rêu Quân Đội (Olive Drab)", "Sa Mạc Cát (Desert Tan)", "Đen Thao Trường" },
                    Sizes = new List<string> { "Tỉ lệ 1:35 (210mm)", "Tỉ lệ 1:24 (290mm)" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Robot Trợ Lý Biểu Cảm (Expressive Cyber-Bot)",
                    Slug = "cyber-mech-explorer",
                    CategoryId = catResin.Id,
                    BasePrice = 1250000,
                    ShortDescription = "SLA Resin 8K // Khớp Cử Động 3 Trục",
                    Description = "Chiến binh Mecha trợ lý tương lai với panel line siêu sắc nét, bề mặt láng mịn không tì vết. In quang hóa Resin SLA độ phân giải siêu cao 8K, tối ưu cho sưu tầm và sơn phết thủ công.",
                    ImageUrl = "/images/products/cyber-bot-print.jpg",
                    Images = new List<string>
                    {
                        "/images/products/cyber-bot-print.jpg",
                        "/images/products/robot-expressive-print.jpg"
                    },
                    Model3DUrl = "/models/RobotExpressive.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Độ phân giải", "19 micron (Resin SLA 8K)" },
                        { "Khối lượng", "160g" },
                        { "Thời gian in", "6 giờ 45 phút" },
                        { "Khớp cử động", "3 trục xoay linh hoạt" },
                        { "Xử lý bề mặt", "Rửa siêu âm & Sấy tia UV hoàn thiện" }
                    },
                    Colors = new List<string> { "Vàng Cyber / Trắng Mecha", "Xám Gunmetal Titan", "Cam Hổ Phách" },
                    Sizes = new List<string> { "Chiều cao 15cm", "Chiều cao 22cm" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Mũ Giáp Chiến Binh Cyberpunk (Damaged Helmet)",
                    Slug = "cyberpunk-tactical-helmet",
                    CategoryId = catResin.Id,
                    BasePrice = 1850000,
                    ShortDescription = "Carbon PETG 1:1 // Chi Tiết Vết Chém Thực Chiến",
                    Description = "Mũ giáp công nghệ tương lai phong cách chiến binh viễn tưởng bị hư hại trong giao tranh. Tái hiện vết xước, lỗ đạn và lớp giáp phân tầng cơ khí cực kỳ sắc nét.",
                    ImageUrl = "/images/products/cyber-helmet-print.jpg",
                    Images = new List<string>
                    {
                        "/images/products/cyber-helmet-print.jpg",
                        "/images/products/cyber-helmet.png"
                    },
                    Model3DUrl = "/models/DamagedHelmet.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Độ phân giải", "1.68 triệu polygons" },
                        { "Khối lượng", "280g (Resin Tough Polycarbonate)" },
                        { "Thời gian in", "8 giờ 30 phút" },
                        { "Vật liệu", "PETG Carbon chịu va đập" },
                        { "Độ cao lớp in", "0.08 mm" }
                    },
                    Colors = new List<string> { "Đen Carbon Matt & Cam Neon", "Đồng Cổ Rỉ Sét", "Xám Thép Phân Tầng" },
                    Sizes = new List<string> { "Trưng Bày Để Bàn (130mm)", "Tỉ Lệ Đội Đầu 1:1 (310mm)" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Hộp Bánh Răng Hành Tinh Cơ Khí (Epicyclic Gearbox)",
                    Slug = "epicyclic-gearbox-assembly",
                    CategoryId = catSciFi.Id,
                    BasePrice = 520000,
                    ShortDescription = "Cơ Khí Hành Tinh // Tỉ Số Truyền Động 4:1",
                    Description = "Mô hình hộp số hành tinh cơ khí xoay tỷ số truyền động chính xác theo chuẩn kỹ thuật CAD. Vận hành êm ái, thích hợp làm đồ chơi giải tỏa căng thẳng (fidget) hoặc giáo cụ trực quan.",
                    ImageUrl = "/images/products/gearbox-assy-print.jpg",
                    Images = new List<string>
                    {
                        "/images/products/gearbox-assy-print.jpg",
                        "/images/products/gearbox-print.jpg"
                    },
                    Model3DUrl = "/models/GearboxAssy.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Số bánh răng", "6 bánh răng hành tinh lồng ghép" },
                        { "Tỉ số truyền", "4:1 chuẩn động học" },
                        { "Dung sai khe hở", "0.15 mm (Xoay trơn tru không kẹt)" },
                        { "Vòng bi", "Tích hợp ổ bi thép 608ZZ" }
                    },
                    Colors = new List<string> { "Cam Cơ Khí & Xám Thép", "Xanh Cyan Neon", "Vàng Gold Kim Loại" },
                    Sizes = new List<string> { "Cầm Tay (Module 1.5)", "Trưng Bày Bàn (Module 2.5)" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Động Cơ Đẩy Không Gian Primary Ion Drive",
                    Slug = "primary-ion-thruster-drive",
                    CategoryId = catSciFi.Id,
                    BasePrice = 1450000,
                    ShortDescription = "Turbine Lồng Ghép // CAD Precision",
                    Description = "Mô hình cụm động cơ đẩy hạt nhân ion không gian viễn tưởng chuẩn CAD. Tái hiện từng cánh turbine đồng tâm, buồng ion hóa plasma và vòi phun hạt gia tốc siêu trường.",
                    ImageUrl = "/images/products/primary-ion-drive-print.jpg",
                    Images = new List<string>
                    {
                        "/images/products/primary-ion-drive-print.jpg",
                        "/images/products/ion-drive-print.jpg"
                    },
                    Model3DUrl = "/models/PrimaryIonDrive.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Độ phức tạp", "3 lớp vành turbine lồng ghép" },
                        { "Dung sai", "0.1 mm" },
                        { "Thời gian in", "11 giờ" },
                        { "Vật liệu", "PETG Gia Cường Sợi Thủy Tinh" }
                    },
                    Colors = new List<string> { "Metallic Gunmetal & Cam Ánh Kim", "Bạc Anodized & Xanh Lôi Điện" },
                    Sizes = new List<string> { "Mô Hình 220mm", "Phiên Bản Lớn 320mm Có Chân Đế" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tượng Điêu Khắc Nữ Hoàng Nefertiti Tinh Xảo",
                    Slug = "tuong-nu-hoang-nefertiti-dieu-khac",
                    CategoryId = catResin.Id,
                    BasePrice = 690000,
                    ShortDescription = "Bột Đá Cổ Đại // Vân Nhám Điêu Khắc Bảo Tàng",
                    Description = "Bản tái hiện 3D tượng bán thân Nữ hoàng Nefertiti được quét quang học từ hiện vật gốc tại Bảo tàng Berlin. In bằng vật liệu Composite pha bột đá mịn mang lại độ nhám mát tự nhiên.",
                    ImageUrl = "/images/products/nefertiti-bust-print.jpg",
                    Images = new List<string>
                    {
                        "/images/products/nefertiti-bust-print.jpg",
                        "/images/products/nefertiti-print.jpg"
                    },
                    Model3DUrl = "/models/Nefertiti.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Công nghệ", "Resin SLA Composite Bột Đá" },
                        { "Độ phân giải", "500,000 polygons" },
                        { "Khối lượng", "320g" },
                        { "Chiều cao", "180 mm" }
                    },
                    Colors = new List<string> { "Sa Thạch Cổ (Sandstone)", "Đá Trắng Hy Lạp (Marble White)", "Đen Đá Huyền Thạch" },
                    Sizes = new List<string> { "Chiều Cao 18cm", "Chiều Cao 28cm" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Rồng Thần Thoại Khớp Động In Liền Khối (Flexi Dragon)",
                    Slug = "imperial-articulated-dragon",
                    CategoryId = catPip.Id,
                    BasePrice = 420000,
                    ShortDescription = "Print-In-Place // 48 Đốt Khớp Uốn Lượn 360",
                    Description = "Mô hình Rồng Phương Đông in nguyên khối không cần lắp ráp (Print-In-Place). Toàn bộ 48 đốt sống và vây rồng cử động uốn lượn mượt mà ngay sau khi gỡ khỏi bàn in.",
                    ImageUrl = "/images/products/flexi-dragon.jpg",
                    Images = new List<string>
                    {
                        "/images/products/flexi-dragon.jpg",
                        "/images/products/dragon-sculpture.jpg"
                    },
                    Model3DUrl = "/models/DragonAttenuation.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Công nghệ in", "Print-In-Place liền khối" },
                        { "Số đốt khớp", "48 đốt cử động tự do" },
                        { "Vật liệu", "PLA Silk Hai Tông Màu (Dual-Color Silk)" },
                        { "Chiều dài duỗi thẳng", "450 mm" }
                    },
                    Colors = new List<string> { "Silk Vàng Đồng Ánh Đỏ", "Silk Xanh Lục Bảo Ánh Tím", "Đen Huyền Ảo Cầu Vồng" },
                    Sizes = new List<string> { "Dài 45cm", "Dài 65cm Cỡ Đại" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Siêu Xe Thể Thao Tỉ Lệ 1:24 (Cyber Supercar Edition)",
                    Slug = "cyber-supercar-edition",
                    CategoryId = catAms.Id,
                    BasePrice = 1150000,
                    ShortDescription = "Khí Động Học // Vỏ Ghép Đa Màu FDM",
                    Description = "Bản in siêu xe khí động học tương lai được phân tách thành các mảng chi tiết vỏ thân, kính chắn gió và lốp cao su dẻo TPU. Cửa cánh chim có thể mở linh hoạt.",
                    ImageUrl = "/images/products/supercar-print.jpg",
                    Images = new List<string>
                    {
                        "/images/products/supercar-print.jpg",
                        "/images/products/car-concept.jpg"
                    },
                    Model3DUrl = "/models/CarConcept.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Tỉ lệ", "1:24 Chuẩn Mô Hình Xe" },
                        { "Vật liệu lốp", "TPU 95A Cao Su Dẻo" },
                        { "Số chi tiết", "32 bộ phận ghép ngàm" },
                        { "Kích thước", "210 x 95 x 55 mm" }
                    },
                    Colors = new List<string> { "Đỏ Rosso Corsa & Đen Carbon", "Vàng Chanh Cyber Lime", "Trắng Băng Tuyết" },
                    Sizes = new List<string> { "Tỉ lệ 1:24 (21cm)", "Tỉ lệ 1:18 (28cm)" },
                    InStock = true,
                    Featured = true
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Bảng Thời Khóa Biểu & Lịch Vạn Niên Cơ Học Để Bàn",
                    Slug = "bang-thoi-khoa-bieu-lich-van-nien-co-hoc",
                    CategoryId = catDesk.Id,
                    BasePrice = 240000,
                    ShortDescription = "Lịch 3 Vòng Xoay Độc Lập // Khay Đựng Bút Tích Hợp",
                    Description = "Bảng thời khóa biểu kết hợp lịch vạn niên cơ học in liền khối đa tầng. 3 vòng xoay độc lập cho phép đánh dấu thứ trong tuần, tiết học / ca làm việc và ngày trong tháng. Chân đế tích hợp khay để bút.",
                    ImageUrl = "/images/products/thoi-khoa-bieu.jpg",
                    Images = new List<string>
                    {
                        "/images/products/thoi-khoa-bieu.jpg"
                    },
                    Model3DUrl = "/models/coffeeMug.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Số chi tiết", "1 khối tích hợp Print-in-place" },
                        { "Thời gian in", "4 giờ 50 phút" },
                        { "Khối lượng", "135g (Nhựa PLA+ Matte)" },
                        { "Kích thước", "140 x 110 x 95 mm" }
                    },
                    Colors = new List<string> { "Vân Gỗ Sồi (Wood Composite)", "Cam Hổ Phách & Đen Nhám", "Trắng Sứ Tối Giản" },
                    Sizes = new List<string> { "Để Bàn Học (140mm)", "Cỡ Lớn Phòng Học (200mm)" },
                    InStock = true,
                    Featured = false
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Khay Cắm Bút Đa Giác Voronoi Để Bàn",
                    Slug = "khay-cam-but-da-giac-voronoi",
                    CategoryId = catDesk.Id,
                    BasePrice = 170000,
                    ShortDescription = "Thuật Toán Voronoi // Cấu Trúc Thoáng Khí",
                    Description = "Khay đựng bút phong cách toán học tế bào Voronoi với kết cấu lưới rỗng thông gió, nhẹ và cứng vững. Giúp sắp xếp bút, thước kẻ và dụng cụ học tập gọn gàng, tạo điểm nhấn hiện đại.",
                    ImageUrl = "/images/products/khay-but-hoc-tap.jpg",
                    Images = new List<string>
                    {
                        "/images/products/khay-but-hoc-tap.jpg",
                        "/images/products/voronoi-vase-print.jpg"
                    },
                    Model3DUrl = "/models/coffeeMug.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Cấu trúc", "Tế bào Voronoi không gian" },
                        { "Khối lượng", "75g (Nhựa PLA Sinh Học)" },
                        { "Kích thước", "85 x 85 x 110 mm" },
                        { "Kháng nước", "Có" }
                    },
                    Colors = new List<string> { "Đen Mờ Nhám", "Trắng Tinh Khiết", "Cam Hổ Phách" },
                    Sizes = new List<string> { "Tiêu Chuẩn (110mm)", "Cỡ Lớn Đa Ngăn (150mm)" },
                    InStock = true,
                    Featured = false
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Giá Đỡ Điện Thoại Đa Góc & Treo Cáp Cyber-Dock",
                    Slug = "gia-do-dien-thoai-cyber-dock",
                    CategoryId = catDesk.Id,
                    BasePrice = 140000,
                    ShortDescription = "Góc Nghiêng Công Thái Học // Rãnh Kẹp Cáp Type-C",
                    Description = "Đế đỡ điện thoại thông minh in 3D góc nghiêng công thái học 60 độ tối ưu xem video và gọi video call. Tích hợp rãnh luồn dây sạc chống gãy gập và chân đệm chống trượt.",
                    ImageUrl = "/images/products/gia-do-dien-thoai.jpg",
                    Images = new List<string>
                    {
                        "/images/products/gia-do-dien-thoai.jpg"
                    },
                    Model3DUrl = "/models/DamagedHelmet.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Góc nghiêng", "60 độ công thái học" },
                        { "Tương thích", "Mọi dòng điện thoại & Tablet đến 11 inch" },
                        { "Rãnh sạc", "Chuẩn cáp Type-C / Lightning" }
                    },
                    Colors = new List<string> { "Đen Nhám PETG", "Cam Cyber", "Xanh Neon" },
                    Sizes = new List<string> { "Tiêu Chuẩn (Điện Thoại)", "Cỡ Lớn (iPad/Tablet)" },
                    InStock = true,
                    Featured = false
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Keycap Cơ Khí Cyberpunk Robot Artisan (1U)",
                    Slug = "titan-mech-keycap-sla",
                    CategoryId = catArtisan.Id,
                    BasePrice = 350000,
                    ShortDescription = "Resin SLA 12K // Stem Cherry MX Xuyên LED",
                    Description = "Nút phím cơ chế tác nghệ nhân theo chủ đề robot chiến binh viễn tưởng. Đúc bằng Resin SLA độ phân giải 12K, chân cắm chuẩn Cherry MX lắp khít mọi switch phím cơ hiện đại.",
                    ImageUrl = "/images/products/artisan-keycap.jpg",
                    Images = new List<string>
                    {
                        "/images/products/artisan-keycap.jpg"
                    },
                    Model3DUrl = "/models/DamagedHelmet.glb",
                    Specs = new Dictionary<string, string>
                    {
                        { "Profile phím", "OEM / Cherry R4 (Hàng ESC)" },
                        { "Chuẩn stem", "Chữ thập Cherry MX chuẩn" },
                        { "Vật liệu", "Resin Tough SLA Độ Bền Cao" },
                        { "Hiệu ứng", "Xuyên sáng LED nền RGB" }
                    },
                    Colors = new List<string> { "Titan Smoke Khói Mờ", "Neon Violet Xuyên LED", "Vàng Gold Sơn Phết Thủ Công" },
                    Sizes = new List<string> { "1U Standard" },
                    InStock = true,
                    Featured = false
                }
            };

            foreach (var product in realProducts)
            {
                var existing = await context.Products.FirstOrDefaultAsync(p => p.Slug == product.Slug);
                if (existing == null)
                {
                    context.Products.Add(product);
                }
                else
                {
                    existing.Name = product.Name;
                    existing.BasePrice = product.BasePrice;
                    existing.Description = product.Description;
                    existing.ShortDescription = product.ShortDescription;
                    existing.ImageUrl = product.ImageUrl;
                    existing.Images = product.Images;
                    existing.Model3DUrl = product.Model3DUrl;
                    existing.Specs = product.Specs;
                    existing.Colors = product.Colors;
                    existing.Sizes = product.Sizes;
                    existing.InStock = product.InStock;
                    existing.Featured = product.Featured;
                    existing.CategoryId = product.CategoryId;
                }
            }

            await context.SaveChangesAsync();
            logger.LogInformation("Hoàn tất nạp 12 bản in 3D thực tế vào hệ sinh thái Kinetic3D!");
        }
    }
}
