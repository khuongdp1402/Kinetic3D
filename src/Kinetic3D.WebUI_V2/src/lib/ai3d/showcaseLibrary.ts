export interface AI3DShowcaseItem {
  id: string;
  name: string;
  slug: string;
  provider: "tripo" | "meshy";
  categoryName: string;
  categoryId: string;
  categoryBadge: string;
  prompt: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  salePrice: number;
  imageUrl: string;
  images: string[];
  model3DUrl: string;
  faces: number;
  vertices: number;
  printWeight: string;
  printTime: string;
  colors: string[];
  sizes: string[];
  specs: Record<string, string>;
  featured: boolean;
}

export const AI_SHOWCASE_LIBRARY: AI3DShowcaseItem[] = [
  {
    id: "ai-mecha-ronin-3d",
    name: "Mô Hình Mecha Cyber Ronin Giáp Phân Tầng (AMS Edition)",
    slug: "mo-hinh-mecha-cyber-ronin-giap-phan-tang-ams",
    provider: "tripo",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryId: "c018ecaa-dcb7-4a0b-9366-0d4e963ee3f2",
    categoryBadge: "Mecha & Khớp Động",
    prompt: "Cyberpunk mecha ronin samurai robot with layered armor plates, glowing plasma katana, detailed mechanical joints, sci-fi titanium chassis, watertight 3d print model",
    description: "Chiến binh cơ khí tương lai Mecha Cyber Ronin được tạo dựng qua thuật toán Deep Geometric Topology của Tripo3D. Các mảng giáp phân tầng sắc sảo, khớp nối cơ khí chuẩn xác và thanh kiếm năng lượng plasma. File in 3D đã được tối ưu hóa độ dày thành và kín nước hoàn hảo cho hệ thống máy in 3D Bambu Lab AMS nhiều màu.",
    shortDescription: "Mô hình Mecha Cyber Ronin giáp phân tầng phong cách viễn tưởng tương lai.",
    basePrice: 850000,
    salePrice: 720000,
    imageUrl: "/images/products/cyber-helmet.png",
    images: [
      "/images/products/cyber-helmet.png",
      "/images/products/cyber-helmet.png"
    ],
    model3DUrl: "/models/DamagedHelmet.glb",
    faces: 1680500,
    vertices: 840250,
    printWeight: "210g (Nhựa PLA+ Tough / Resin)",
    printTime: "8 giờ 45 phút",
    colors: ["Cyber Titanium & Cam Neon", "Đen Carbon Nhám & Vàng Kim", "Trắng Sứ Cơ Khí"],
    sizes: ["Tỉ lệ 1:12 (160mm)", "Tỉ lệ 1:8 (240mm)"],
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Smart Mesh v3.1 AI",
      "Số chi tiết": "1 khối liền thân (Print-in-place)",
      "Khối lượng": "210g",
      "Thời gian in": "8 giờ 45 phút",
      "Độ phân giải": "0.12 mm High-Detail Layer",
      "Độ kín nước": "100% Watertight Manifold"
    },
    featured: true
  },
  {
    id: "ai-aero-sneaker-3d",
    name: "Giày Thể Thao Khung Xương In 3D Tương Lai (Aero Sneaker)",
    slug: "giay-the-thao-khung-xuong-in-3d-aero-sneaker",
    provider: "meshy",
    categoryName: "Phụ Kiện Công Nghệ & Bàn Phím Cơ",
    categoryId: "239e088e-647d-4171-aa30-e7f016f4ad1f",
    categoryBadge: "Thời Trang In 3D",
    prompt: "Futuristic parametric sneaker with voronoi lattice midsole, aerodynamic cyberpunk shoe structure, organic 3d printed footwear concept, photorealistic PBR materials",
    description: "Thiết kế giày thể thao tương lai với cấu trúc đế tổ ong Voronoi hấp thụ xung lực và thân giày khí động học. Một sản phẩm mang tính cách mạng kết hợp giữa generative AI 3D và công nghệ chế tác vật liệu linh hoạt TPU/PETG.",
    shortDescription: "Mẫu giày thể thao cấu trúc khung xương Voronoi in 3D khí động học thời thượng.",
    basePrice: 650000,
    salePrice: 550000,
    imageUrl: "/images/products/toy-car.jpg",
    images: [
      "/images/products/toy-car.jpg"
    ],
    model3DUrl: "/models/ToyCar.glb",
    faces: 890000,
    vertices: 445000,
    printWeight: "175g (Nhựa dẻo TPU 95A / PETG)",
    printTime: "7 giờ 15 phút",
    colors: ["Cam Hổ Phách & Đen Nhám", "Trắng Tinh Khiết & Bạc Chrome", "Xanh Neon Huỳnh Quang"],
    sizes: ["Bản Trưng Bày Bàn (150mm)", "Bản Trưng Bày Lớn (220mm)"],
    specs: {
      "Công nghệ tạo mẫu": "Meshy v2 Deep Retopology",
      "Khối lượng": "175g",
      "Thời gian in": "7 giờ 15 phút",
      "Độ cao lớp in": "0.16 mm",
      "Vật liệu tương thích": "TPU đàn hồi / PETG Tough"
    },
    featured: true
  },
  {
    id: "ai-dragon-guardian-3d",
    name: "Rồng Thần Cơ Khí Khớp Động Uốn Lượn (Dragon Guardian)",
    slug: "rong-than-co-khi-khop-dong-uon-luon-dragon-guardian",
    provider: "tripo",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryId: "c018ecaa-dcb7-4a0b-9366-0d4e963ee3f2",
    categoryBadge: "Khớp Động Nghệ Thuật",
    prompt: "Mechanical cyber dragon with articulated segmented spine, metallic scales, oriental dragon head sculpt, print-in-place ball joints, intricate details",
    description: "Sinh vật thần thoại được tái hiện dưới hình hài cơ khí với từng đốt sống cử động uốn lượn uyển chuyển ngay sau khi in ra mà không cần lắp ráp (Print-in-place). Đầu rồng chạm khắc vảy đa tầng sắc sảo và râu rồng khí động học.",
    shortDescription: "Rồng thần cơ khí in liền khối khớp động linh hoạt uốn lượn 360 độ.",
    basePrice: 790000,
    salePrice: 680000,
    imageUrl: "/images/products/dragon-sculpture.jpg",
    images: [
      "/images/products/dragon-sculpture.jpg"
    ],
    model3DUrl: "/models/DragonAttenuation.glb",
    faces: 1820000,
    vertices: 910000,
    printWeight: "165g (Nhựa PLA Silk Gradient Đổi Màu)",
    printTime: "7 giờ 15 phút",
    colors: ["Xanh Lục Bảo Ánh Kim", "Vàng Hoàng Kim Tơ Lụa", "Đỏ Ruby Gradient Đổi Màu"],
    sizes: ["Tiêu Chuẩn (350mm duỗi thẳng)", "Cỡ Đại Bàn Làm Việc (500mm)"],
    specs: {
      "Công nghệ tạo mẫu": "Tripo3D Organic Mesh v3.1",
      "Số đốt sống": "32 khớp cầu xoay độc lập",
      "Khối lượng": "165g",
      "Thời gian in": "7 giờ 15 phút",
      "Tính năng đặc biệt": "In liền khối không cần dán keo (Print-in-place)"
    },
    featured: true
  },
  {
    id: "ai-artisan-keycap-3d",
    name: "Keycap Bàn Phím Cơ Artisan Mech Skull (Resin 12K)",
    slug: "keycap-ban-phim-co-artisan-mech-skull-resin-12k",
    provider: "meshy",
    categoryName: "Phụ Kiện Công Nghệ & Bàn Phím Cơ",
    categoryId: "239e088e-647d-4171-aa30-e7f016f4ad1f",
    categoryBadge: "Phụ Kiện Công Nghệ",
    prompt: "Cyber skull mechanical artisan keycap for mechanical keyboard, MX stem, cyberpunk cyberpunk helmet details, translucent visor with LED passthrough, ultra sharp edges",
    description: "Nút bàn phím cơ Artisan cao cấp tạo hình đầu lâu cơ khí Cyberpunk. Chân switch chuẩn Cherry MX đúc liền, hốc mắt xuyên LED RGB rực rỡ và các rãnh dẫn khí tản nhiệt vi mô. Đạt độ phân giải siêu nét khi in trên máy in SLA Resin 12K.",
    shortDescription: "Keycap Artisan Cyber Skull đúc Resin 12K sắc sảo, xuyên LED switch MX.",
    basePrice: 220000,
    salePrice: 185000,
    imageUrl: "/images/products/sunglasses-khronos.jpg",
    images: [
      "/images/products/sunglasses-khronos.jpg"
    ],
    model3DUrl: "/models/SunglassesKhronos.glb",
    faces: 580000,
    vertices: 290000,
    printWeight: "12g (Resin Tough Titanium)",
    printTime: "1 giờ 15 phút",
    colors: ["Titan Xám Mờ", "Hổ Phách Xuyên Sáng", "Đen Bóng Obsidian"],
    sizes: ["Profile OEM Chuẩn (1u)", "Profile Cherry (1u)"],
    specs: {
      "Chân switch": "Chuẩn Cross (+) Cherry MX, Gateron, Kailh",
      "Công nghệ in": "SLA Resin 12K / Phủ bóng UV bóng bẩy",
      "Độ mịn lớp in": "0.025 mm (25 microns)",
      "Khối lượng": "12g"
    },
    featured: false
  },
  {
    id: "ai-quantum-jet-drone-3d",
    name: "Tàu Thám Hiểm Không Gian Lượng Tử (Quantum Jet Drone)",
    slug: "tau-tham-hiem-khong-gian-luong-tu-quantum-jet-drone",
    provider: "tripo",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryId: "c018ecaa-dcb7-4a0b-9366-0d4e963ee3f2",
    categoryBadge: "Sci-Fi Không Gian",
    prompt: "Futuristic sci-fi spacecraft drone with twin ion booster engines, aerodynamic vector wings, glowing fusion reactor core, modular sci-fi exploration vehicle",
    description: "Mô hình tàu không gian thám hiểm lượng tử với cụm động cơ ion phản lực đôi, cánh gió vector và lõi phản ứng hợp hạch. Chi tiết sắc cạnh chuẩn công nghiệp vũ trụ viễn tưởng.",
    shortDescription: "Tàu không gian thám hiểm động cơ ion phản lực đôi đa chi tiết.",
    basePrice: 690000,
    salePrice: 590000,
    imageUrl: "/images/products/primary-ion-drive-print.jpg",
    images: [
      "/images/products/primary-ion-drive-print.jpg"
    ],
    model3DUrl: "/models/PrimaryIonDrive.glb",
    faces: 1450800,
    vertices: 725400,
    printWeight: "190g (PLA Metallic)",
    printTime: "8 giờ 30 phút",
    colors: ["Xanh Dương Vũ Trụ & Bạc", "Cam Lửa Plasma & Đen Nhám", "Trắng Tàu Không Gian"],
    sizes: ["Tỉ lệ Bàn Làm Việc (160mm)", "Tỉ lệ Lớn Trưng Bày (240mm)"],
    specs: {
      "Khối lượng": "190g",
      "Thời gian in": "8 giờ 30 phút",
      "Công nghệ": "FDM Đa màu Bambu Lab AMS",
      "Độ cao lớp in": "0.16 mm"
    },
    featured: true
  },
  {
    id: "ai-luxury-chronograph-3d",
    name: "Đồng Hồ Cơ Khí Chronograph Thụy Sĩ Titanium V2",
    slug: "dong-ho-co-khi-chronograph-thuy-si-titanium-v2",
    provider: "tripo",
    categoryName: "Decor Trang Trí Không Gian",
    categoryId: "8d3e9f45-6672-4cf0-84a2-20c24200d753",
    categoryBadge: "Cơ Khí Cao Cấp",
    prompt: "Luxury mechanical chronograph watch with visible gears, tourbillon escapement, damascus steel bezel, intricate dial, high-end Swiss horology design",
    description: "Phiên bản nâng cấp V2 của tuyệt tác đồng hồ cơ khí Chronograph với viền bezel thép Damascus và các bánh răng tinh vi đan xen. Khung vỏ vát cạnh mạnh mẽ tôn vinh kỹ thuật chế tác cơ khí chính xác.",
    shortDescription: "Đồng hồ cơ khí Chronograph Thụy Sĩ viền bezel thép Damascus tinh xảo.",
    basePrice: 990000,
    salePrice: 850000,
    imageUrl: "/images/products/watch-chronograph.jpg",
    images: [
      "/images/products/watch-chronograph.jpg"
    ],
    model3DUrl: "/models/ChronographWatch.glb",
    faces: 1420000,
    vertices: 710000,
    printWeight: "45g (Resin Tough Titanium)",
    printTime: "3 giờ 10 phút",
    colors: ["Vàng Kim Hoàng Gia & Đen", "Titanium Ánh Bạc Xước", "Xanh Biển Hoàng Gia"],
    sizes: ["Kích Thước Thật (45mm)", "Bản Trưng Bày Khổng Lồ (120mm)"],
    specs: {
      "Số chi tiết": "Mặt số 3 tầng nổi",
      "Vật liệu": "Resin Tough chịu lực cao",
      "Độ phân giải": "25 microns siêu mịn",
      "Thời gian in": "3 giờ 10 phút"
    },
    featured: true
  },
  {
    id: "ai-sherman-tank-plate-3d",
    name: "Xe Tăng Sherman M4A1 62 Chi Tiết Rời (AMS Edition)",
    slug: "xe-tang-sherman-m4a1-62-chi-tiet-roi-ams",
    provider: "tripo",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryId: "c018ecaa-dcb7-4a0b-9366-0d4e963ee3f2",
    categoryBadge: "Quân Sự Chi Tiết Cao",
    prompt: "Sherman M4A1 military tank kit card sprue plate with 62 discrete parts, military green, movable turret, separate tracks and wheels, model kit assembly",
    description: "Bộ khay in kit card xe tăng Sherman M4A1 gồm 62 chi tiết in rời có độ chính xác cơ học cao. Cho phép người chơi tự tay tách khỏi vỉ và lắp ráp các cụm: bánh xích, thân xe, tháp pháo xoay 360 độ và nòng pháo nâng hạ.",
    shortDescription: "Khay in xe tăng Sherman M4A1 62 chi tiết tháo lắp khớp động chân thực.",
    basePrice: 850000,
    salePrice: 680000,
    imageUrl: "/images/products/sherman-m4a1-plate.jpg",
    images: [
      "/images/products/sherman-m4a1-plate.jpg"
    ],
    model3DUrl: "/models/sherman_print_plate.glb",
    faces: 1964114,
    vertices: 982059,
    printWeight: "280g (PLA+ Matte Quân Đội)",
    printTime: "14 giờ 20 phút",
    colors: ["Xanh Rêu Quân Đội (Army Olive)", "Xám Xi Măng Tàng Hình", "Cát Sa Mạc Vàng Nhạt"],
    sizes: ["Tỉ lệ 1:35 (185mm)", "Tỉ lệ 1:24 (260mm)"],
    specs: {
      "Số chi tiết": "62 chi tiết in rời (Multi-part assembly)",
      "Khối lượng": "280g",
      "Thời gian in": "14 giờ 20 phút",
      "Tính năng": "Tháp pháo xoay 360°, nòng pháo nâng hạ, bánh xe quay tự do"
    },
    featured: true
  },
  {
    id: "ai-sci-fi-lantern-3d",
    name: "Đèn Lồng Không Gian Retro Neon Core (Sci-Fi Lantern)",
    slug: "den-long-khong-gian-retro-neon-core-sci-fi-lantern",
    provider: "meshy",
    categoryName: "Decor Trang Trí Không Gian",
    categoryId: "8d3e9f45-6672-4cf0-84a2-20c24200d753",
    categoryBadge: "Decor Không Gian",
    prompt: "Retro sci-fi lantern with neon glowing reactor core, brass and worn iron metallic finish, intricate ventilation grills, steampunk cyberpunk lamp",
    description: "Đèn lồng bão kết hợp phong cách cổ điển và lõi năng lượng tương lai Neon Core. Các rãnh thông gió tinh xảo và khoang trong suốt sẵn sàng để lắp đèn LED đổi màu hoặc nến điện tử.",
    shortDescription: "Đèn bão Retro phong cách Sci-Fi viễn tưởng sẵn sàng gắn đèn LED.",
    basePrice: 520000,
    salePrice: 420000,
    imageUrl: "/images/products/lantern-retro.jpg",
    images: [
      "/images/products/lantern-retro.jpg"
    ],
    model3DUrl: "/models/Lantern.glb",
    faces: 1150000,
    vertices: 575000,
    printWeight: "175g (Metallic Bronze PLA)",
    printTime: "6 giờ 50 phút",
    colors: ["Đồng Cổ Điển Ánh Kim", "Đen Nhám Hợp Kim", "Bạc Titan Xước"],
    sizes: ["Để Bàn Học (180mm)", "Treo Tường Khách (260mm)"],
    specs: {
      "Khối lượng": "175g",
      "Thời gian in": "6 giờ 50 phút",
      "Khoang đèn": "Chuẩn bóng LED pin tròn CR2032 / USB 5V",
      "Độ cao lớp in": "0.16 mm"
    },
    featured: false
  }
];
