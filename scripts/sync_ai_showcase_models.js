const http = require("http");

const CATEGORIES = {
  AMS: "eb8c6186-38c3-49e5-9a30-b24bbf0fed03",
  SCIFI: "844e27e8-9116-40aa-8075-d42af16fd44f",
  FLEXI: "2e082276-0f68-40a8-823a-37648125157a",
  KEYCAP: "36aa6309-1ea7-42ca-ab6b-34c002ccc0fc",
  DESK: "8436756a-59f9-4597-9e88-3c39ae1f947e",
  RESIN: "ac56dbb7-10fb-4fec-8c67-a5c535fd7039",
  HERITAGE: "2b008c1e-d87e-46b0-ba55-45f552c1ff7a",
  STANDARD: "2c4567cb-f723-4fa4-b627-19b398fe4b0d",
  PERSONAL: "f5b7563a-5e1d-4de3-9b6b-075696ec2d3c",
};

const ITEMS_TO_SYNC = [
  {
    name: "Mô Hình Mecha Cyber Ronin Giáp Phân Tầng (AMS Edition)",
    slug: "mo-hinh-mecha-cyber-ronin-giap-phan-tang-ams",
    description: "Chiến binh cơ khí tương lai Mecha Cyber Ronin được tạo dựng qua thuật toán Deep Geometric Topology của Tripo3D. Các mảng giáp phân tầng sắc sảo, khớp nối cơ khí chuẩn xác và thanh kiếm năng lượng plasma. File in 3D đã được tối ưu hóa độ dày thành và kín nước hoàn hảo cho hệ thống máy in 3D Bambu Lab AMS nhiều màu.",
    shortDescription: "Mô hình Mecha Cyber Ronin giáp phân tầng phong cách viễn tưởng tương lai (Tripo3D AI).",
    basePrice: 850000,
    imageUrl: "/images/products/cyber-helmet.png",
    images: ["/images/products/cyber-helmet.png"],
    model3DUrl: "/models/DamagedHelmet.glb",
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Smart Mesh v3.1 AI",
      "Khối lượng": "210g",
      "Thời gian in": "8 giờ 45 phút",
      "Độ phân giải": "0.12 mm High-Detail Layer",
      "Độ kín nước": "100% Watertight Manifold",
      "aiProvider": "tripo3d"
    },
    colors: ["Cyber Titanium & Cam Neon", "Đen Carbon Nhám & Vàng Kim", "Trắng Sứ Cơ Khí"],
    sizes: ["Tỉ lệ 1:12 (160mm)", "Tỉ lệ 1:8 (240mm)"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.SCIFI,
  },
  {
    name: "Giày Thể Thao Khung Xương In 3D Tương Lai (Aero Sneaker)",
    slug: "giay-the-thao-khung-xuong-in-3d-aero-sneaker",
    description: "Thiết kế giày thể thao tương lai với cấu trúc đế tổ ong Voronoi hấp thụ xung lực và thân giày khí động học. Một sản phẩm mang tính cách mạng kết hợp giữa generative AI 3D của Meshy và công nghệ chế tác vật liệu linh hoạt TPU/PETG.",
    shortDescription: "Mẫu giày thể thao cấu trúc khung xương Voronoi in 3D khí động học thời thượng (Meshy AI).",
    basePrice: 650000,
    imageUrl: "/images/products/toy-car.jpg",
    images: ["/images/products/toy-car.jpg"],
    model3DUrl: "/models/ToyCar.glb",
    specs: {
      "Công nghệ tạo mẫu": "Meshy v2 Deep Retopology",
      "Khối lượng": "175g",
      "Thời gian in": "7 giờ 15 phút",
      "Độ cao lớp in": "0.16 mm",
      "Vật liệu tương thích": "TPU đàn hồi / PETG Tough",
      "aiProvider": "meshy"
    },
    colors: ["Cam Hổ Phách & Đen Nhám", "Trắng Tinh Khiết & Bạc Chrome", "Xanh Neon Huỳnh Quang"],
    sizes: ["Bản Trưng Bày Bàn (150mm)", "Bản Trưng Bày Lớn (220mm)"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.STANDARD,
  },
  {
    name: "Rồng Thần Cơ Khí Khớp Động Uốn Lượn (Dragon Guardian)",
    slug: "rong-than-co-khi-khop-dong-uon-luon-dragon-guardian",
    description: "Lấy cảm hứng từ linh thú phương Đông kết hợp kết cấu giáp máy viễn tưởng. Mô hình in nguyên khối không cần lắp ráp với 38 đốt khớp uốn lượn linh hoạt 360 độ do Tripo3D phân bổ mesh thông minh.",
    shortDescription: "Rồng thần cơ khí in liền khối 38 đốt chuyển động mềm mại sống động (Tripo3D AI).",
    basePrice: 420000,
    imageUrl: "/images/products/flexi-dragon.jpg",
    images: ["/images/products/flexi-dragon.jpg"],
    model3DUrl: "/models/DragonAttenuation.glb",
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Topology Articulation",
      "Số chi tiết": "1 khối đúc động (Print-in-place)",
      "Khối lượng": "145g",
      "Thời gian in": "5 giờ 30 phút",
      "Độ cao lớp in": "0.16 mm",
      "aiProvider": "tripo3d"
    },
    colors: ["Xanh Ngọc Bích Đổi Màu", "Đỏ Ruby Lấp Lánh Silk", "Đen Huyền Bí & Vàng Đồng"],
    sizes: ["Chiều dài 450mm", "Chiều dài 600mm (Đại Cỡ)"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.FLEXI,
  },
  {
    name: "Keycap Bàn Phím Cơ Artisan Mech Skull (Resin 12K)",
    slug: "keycap-ban-phim-co-artisan-mech-skull-resin-12k",
    description: "Keycap chế tác nghệ nhân dành cho bàn phím cơ, tương thích chân switch Cherry MX chuẩn 1U. Chi tiết đầu lâu cơ khí siêu thực với mũ kính bảo hộ trong suốt và vi mạch bán dẫn.",
    shortDescription: "Keycap cơ khí Mech Skull in quang hóa Resin 12K siêu nét cho dân nghiện phím cơ (Meshy AI).",
    basePrice: 280000,
    imageUrl: "/images/products/artisan-keycap.jpg",
    images: ["/images/products/artisan-keycap.jpg"],
    model3DUrl: "/models/coffeeMug.glb",
    specs: {
      "Công nghệ tạo mẫu": "Meshy v2 Micro-Detail AI",
      "Chân switch": "Chuẩn Cherry MX (+)",
      "Khối lượng": "12g",
      "Độ phân giải hiển vi": "0.02 mm (Resin 12K)",
      "aiProvider": "meshy"
    },
    colors: ["Cyberpunk Teal & Purple", "Obsidian Black & Gold Leaf", "Silver Chrome Mirror"],
    sizes: ["Profile SA R1 (Esc)", "Profile OEM R4"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.KEYCAP,
  },
  {
    name: "Tàu Thám Hiểm Không Gian Lượng Tử (Quantum Jet Drone)",
    slug: "tau-tham-hiem-khong-gian-luong-tu-quantum-jet-drone",
    description: "Mô hình tàu không gian viễn tưởng phong cách Hard Sci-Fi. Thiết kế cánh khí động học kép, động cơ phản lực ion tích hợp hốc tản nhiệt đa tầng được AI Tripo3D sinh mesh với độ chi tiết vi mô.",
    shortDescription: "Tàu thám hiểm không gian vũ trụ phong cách Hard Sci-Fi siêu chi tiết (Tripo3D AI).",
    basePrice: 920000,
    imageUrl: "/images/products/primary-ion-drive-print.jpg",
    images: ["/images/products/primary-ion-drive-print.jpg"],
    model3DUrl: "/models/PrimaryIonDrive.glb",
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Generative Solid",
      "Khối lượng": "260g",
      "Thời gian in": "9 giờ 50 phút",
      "Vật liệu": "PLA+ Tough gia cường sợi carbon",
      "aiProvider": "tripo3d"
    },
    colors: ["Trắng Phi Thuyền Apollo", "Đen Nhám Stealth Fighter", "Xám Titan Phay Xước"],
    sizes: ["Tỉ lệ 1:48 (220mm)", "Tỉ lệ 1:32 (330mm)"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.SCIFI,
  },
  {
    name: "Đồng Hồ Cơ Khí Chronograph Thụy Sĩ Titanium V2",
    slug: "dong-ho-co-khi-chronograph-thuy-si-titanium-v2",
    description: "Bản mô phỏng nghệ thuật đồng hồ bấm giờ thể thao cao cấp. Hiển thị trọn vẹn từng bánh răng lộ cơ chuyển động Skeleton và vành bezel phân chia thang đo tachymeter chính xác.",
    shortDescription: "Mẫu trưng bày đồng hồ Chronograph lộ cơ phong cách siêu sang Titanium (Tripo3D AI).",
    basePrice: 790000,
    imageUrl: "/images/products/cyber-helmet.png",
    images: ["/images/products/cyber-helmet.png"],
    model3DUrl: "/models/ChronographWatch.glb",
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Mechanical Mesh",
      "Khối lượng": "130g",
      "Độ sắc nét": "Cực cao (Hiển thị vân guilloché mặt số)",
      "aiProvider": "tripo3d"
    },
    colors: ["Titanium Xám Khói", "Rose Gold & Đen Ceramic", "Bạc Bạch Kim Siêu Bóng"],
    sizes: ["Đường kính mặt 95mm (Trưng Bày Bàn)", "Đường kính mặt 140mm"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.RESIN,
  },
  {
    name: "Xe Tăng Sherman M4A1 62 Chi Tiết Rời (AMS Edition)",
    slug: "xe-tang-sherman-m4a1-62-chi-tiet-roi-ams",
    description: "Bộ Kit mô hình quân sự lịch sử xe tăng Sherman M4A1 gồm tháp pháo quay 360 độ, nòng pháo hạ nâng, xích lăn khớp động và đầy đủ phụ kiện dã chiến được tối ưu hóa in mâm tách lớp.",
    shortDescription: "Bộ Kit lắp ráp 62 chi tiết xe tăng Sherman M4A1 in 3D đa màu cực chuẩn (Tripo3D AI).",
    basePrice: 680000,
    imageUrl: "/images/products/sherman-m4a1-plate.jpg",
    images: ["/images/products/sherman-m4a1-plate.jpg"],
    model3DUrl: "/models/sherman_print_plate.glb",
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Military Replica",
      "Số chi tiết": "62 bộ phận tháo rời",
      "Thời gian in": "11 giờ 20 phút",
      "Khối lượng": "285g",
      "aiProvider": "tripo3d"
    },
    colors: ["Xanh Rêu Quân Đội US Army", "Rằn Ri Sa Mạc Desert Camo", "Xám Bão Pháo Binh"],
    sizes: ["Tỉ lệ 1:35 (Chuẩn Mô Hình)", "Tỉ lệ 1:24 (Cỡ Lớn Trưng Bày)"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.AMS,
  },
  {
    name: "Đèn Lồng Không Gian Retro Neon Core (Sci-Fi Lantern)",
    slug: "den-long-khong-gian-retro-neon-core-sci-fi-lantern",
    description: "Sự hòa quyện giữa kiểu dáng đèn bão cổ điển thế kỷ 19 và buồng đốt năng lượng plasma Cyberpunk. Tích hợp khe giấu cụm đèn LED pin sạc tạo ánh sáng lan tỏa huyền ảo qua các khe thông gió.",
    shortDescription: "Đèn trang trí Retro kết hợp buồng năng lượng plasma tương lai có ngăn chứa LED (Meshy AI).",
    basePrice: 520000,
    imageUrl: "/images/products/khay-but-hoc-tap.jpg",
    images: ["/images/products/khay-but-hoc-tap.jpg"],
    model3DUrl: "/models/Lantern.glb",
    specs: {
      "Công nghệ tạo mẫu": "Meshy v2 Ambient Light Mesh",
      "Khối lượng": "190g",
      "Thời gian in": "6 giờ 40 phút",
      "Tính năng": "Có khoang đèn LED pin sạc 18650",
      "aiProvider": "meshy"
    },
    colors: ["Đồng Cổ Rỉ Sét Steampunk", "Xám Kim Loại & Cam Neon", "Đen Mờ Dạ Quang"],
    sizes: ["Chiều cao 190mm", "Chiều cao 250mm"],
    featured: false,
    inStock: true,
    categoryId: CATEGORIES.STANDARD,
  },
  {
    name: "Máy Ảnh Cổ Điển Nghệ Thuật (Antique Camera Khronos)",
    slug: "may-anh-co-dien-vintage-antique-camera",
    description: "Mô hình máy ảnh chụp phim dạng hộp cổ điển thế kỷ 20 với ống kính phân tầng, nút bấm trập và chân kính điều tiêu khắc phục chi tiết tỉ mỉ.",
    shortDescription: "Mẫu máy ảnh cổ điển chụp phim phục chế kiến trúc cổ điển tinh xảo.",
    basePrice: 640000,
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop"],
    model3DUrl: "/models/AntiqueCamera.glb",
    specs: {
      "Khối lượng": "180g (Nhựa PLA Wood Vân Gỗ)",
      "Thời gian in": "6 giờ 15 phút",
      "Độ phân giải": "0.12 mm High-Detail"
    },
    colors: ["Nâu Gỗ Cổ Điển & Kim Loại Đồng", "Đen Giả Da & Bạc Chrome"],
    sizes: ["Kích thước thật 1:1 (120x90x75mm)"],
    featured: false,
    inStock: true,
    categoryId: CATEGORIES.HERITAGE,
  },
  {
    name: "Đài Cát-xét Cyber BoomBox 3D",
    slug: "loa-retro-cyber-boombox-3d",
    description: "Chiếc BoomBox phong cách âm nhạc đường phố thập niên 80 với hệ thống loa kép, khay băng cassette cơ học và tay xách thể thao.",
    shortDescription: "Đài cát-xét BoomBox hoài niệm thập niên 80 chế tác in 3D phong cách Cyber.",
    basePrice: 490000,
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1200&auto=format&fit=crop"],
    model3DUrl: "/models/BoomBox.glb",
    specs: {
      "Khối lượng": "220g",
      "Thời gian in": "7 giờ 30 phút",
      "Có thể gắn cụm loa Bluetooth": "Có khoang âm học"
    },
    colors: ["Vàng Tươi & Đen Nhám", "Bạc Kim Loại Thập Niên 80", "Hồng Neon Cyber"],
    sizes: ["Bản Trưng Bày (160mm)", "Bản Cỡ Lớn (240mm)"],
    featured: false,
    inStock: true,
    categoryId: CATEGORIES.STANDARD,
  },
  {
    name: "Máy Ảnh Hơi Nước Steampunk Vintage Camera",
    slug: "may-anh-hoi-nuoc-steampunk-vintage-camera",
    description: "Nghệ thuật điêu khắc máy ảnh cơ khí hơi nước Steampunk với các ống đồng dẫn áp suất, đồng hồ áp kế mặt kính và bánh răng lộ thiên.",
    shortDescription: "Tác phẩm máy ảnh Steampunk viễn tưởng phong cách thời kỳ công nghiệp thế kỷ 19.",
    basePrice: 890000,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"],
    model3DUrl: "/models/steampunk_camera.glb",
    specs: {
      "Vật liệu chế tác": "Resin SLA độ nét 12K + Sơn thủ công metallic",
      "Khối lượng": "250g",
      "Thời gian in": "9 giờ 15 phút"
    },
    colors: ["Đồng Đỏ & Đồng Thau Hun Khói", "Sắt Cổ Rỉ Sét & Vàng Tây"],
    sizes: ["Tỉ lệ 1:1 (150x120x110mm)"],
    featured: true,
    inStock: true,
    categoryId: CATEGORIES.RESIN,
  },
  {
    name: "Đèn Cổ Điển Treo Chuồng Trại (Anisotropy Barn Lamp)",
    slug: "den-ban-phong-cach-anisotropy-barn-lamp",
    description: "Đèn treo phong cách công nghiệp Barn Lamp với chao đèn kim loại phản xạ ánh sáng tỏa rộng, đui đèn sứ cách điện và khung bảo vệ lồng thép.",
    shortDescription: "Đèn treo phong cách công nghiệp Retro Barn Lamp đúc chuẩn 3D.",
    basePrice: 380000,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop"],
    model3DUrl: "/models/AnisotropyBarnLamp.glb",
    specs: {
      "Khối lượng": "140g",
      "Thời gian in": "4 giờ 45 phút",
      "Đui đèn": "Chuẩn E27 tiêu chuẩn gia dụng"
    },
    colors: ["Đen Mờ Nhám Matte Black", "Trắng Sữa Men Sứ", "Xanh Rêu Quân Đội"],
    sizes: ["Đường kính chao 180mm", "Đường kính chao 240mm"],
    featured: false,
    inStock: true,
    categoryId: CATEGORIES.STANDARD,
  }
];

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log("=== BẮT ĐẦU ĐỒNG BỘ DỮ LIỆU 3D VÀO KINETIC3D SYSTEM ===");

  // 1. Lấy danh sách sản phẩm hiện có
  const existingRes = await request({
    hostname: "localhost",
    port: 5099,
    path: "/api/products",
    method: "GET",
  });

  const existing = Array.isArray(existingRes.body) ? existingRes.body : [];
  console.log(`Hiện tại đang có ${existing.length} sản phẩm trong PostgreSQL.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of ITEMS_TO_SYNC) {
    const found = existing.find(p => p.slug === item.slug || p.name.toLowerCase() === item.name.toLowerCase());

    const postData = JSON.stringify({
      id: found ? found.id : undefined,
      name: item.name,
      slug: item.slug,
      description: item.description,
      shortDescription: item.shortDescription,
      basePrice: item.basePrice,
      imageUrl: item.imageUrl,
      images: item.images,
      model3DUrl: item.model3DUrl,
      specs: item.specs,
      colors: item.colors,
      sizes: item.sizes,
      featured: item.featured,
      inStock: item.inStock,
      categoryId: item.categoryId,
    });

    if (found) {
      // Cập nhật
      const updateRes = await request({
        hostname: "localhost",
        port: 5099,
        path: `/api/products/${found.id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        }
      }, postData);

      console.log(`[UPDATE] ${item.name} -> HTTP ${updateRes.status}`);
      updatedCount++;
    } else {
      // Tạo mới
      const createRes = await request({
        hostname: "localhost",
        port: 5099,
        path: "/api/products",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        }
      }, postData);

      console.log(`[CREATE] ${item.name} -> HTTP ${createRes.status}`);
      createdCount++;
    }
  }

  // 2. Kiểm tra tổng kết quả
  const finalRes = await request({
    hostname: "localhost",
    port: 5099,
    path: "/api/products",
    method: "GET",
  });
  const finalProducts = Array.isArray(finalRes.body) ? finalRes.body : [];
  console.log(`\n=== HOÀN TẤT ĐỒNG BỘ: Tạo mới ${createdCount}, Cập nhật ${updatedCount} ===`);
  console.log(`Tổng sản phẩm sẵn sàng trong hệ thống: ${finalProducts.length}`);
}

run().catch(console.error);
