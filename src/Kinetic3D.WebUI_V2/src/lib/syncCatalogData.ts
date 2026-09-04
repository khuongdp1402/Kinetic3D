export interface Syncable3DProduct {
  syncId: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categoryBadge: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  salePrice: number;
  imageUrl: string;
  images: string[];
  model3DUrl: string;
  colors: string[];
  sizes: string[];
  featured: boolean;
  author: string;
  authorUrl: string;
  license: string;
  source: string;
  specs: Record<string, string>;
}

export const SYNCABLE_CATALOG: Syncable3DProduct[] = [
  // ── 1. DỤNG CỤ HỌC TẬP & BÀN LÀM VIỆC ──
  {
    syncId: "sync-thoi-khoa-bieu",
    name: "Bảng Thời Khóa Biểu & Lịch Vạn Niên Cơ Học Để Bàn",
    slug: "bang-thoi-khoa-bieu-lich-van-nien-co-hoc",
    categoryId: "0e2afc16-4eab-4396-9382-681681cbed4d",
    categoryName: "Dụng Cụ Học Tập & Bàn Làm Việc",
    categoryBadge: "Dụng cụ học tập",
    description: "Bảng thời khóa biểu kết hợp lịch vạn niên cơ học in liền khối đa tầng. 3 vòng xoay độc lập cho phép đánh dấu thứ trong tuần, tiết học / ca làm việc và ngày trong tháng. Chân đế tích hợp khay để bút và rãnh kẹp thời khóa biểu in giấy.",
    shortDescription: "Bảng thời khóa biểu & lịch vạn niên 3 vòng xoay cơ học để bàn.",
    basePrice: 240000,
    salePrice: 190000,
    imageUrl: "/images/products/thoi-khoa-bieu.jpg",
    images: [
      "/images/products/thoi-khoa-bieu.jpg",
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/coffeeMug.glb",
    colors: ["Vân Gỗ Sồi (Wood Composite)", "Cam Hổ Phách & Đen Nhám", "Trắng Sứ Tối Giản"],
    sizes: ["Để Bàn Học (140mm)", "Cỡ Lớn Phòng Học (200mm)"],
    featured: true,
    author: "Kinetic3D Academic Design Lab",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Kinetic3D Desk & School Collection",
    specs: {
      "Số chi tiết": "1 khối tích hợp (Print-in-place)",
      "Thời gian in": "4 giờ 50 phút",
      "Khối lượng": "135g (Nhựa PLA+ Matte / Wood)",
      "Dung sai": "±0.1 mm (Khớp xoay trơn tru)",
      "Công nghệ in": "FDM Đa Màu Bambu Lab AMS",
      "Độ cao lớp in": "0.16 mm",
      "Kích thước hoàn thiện": "140 x 110 x 95 mm",
      "Tính năng": "3 vòng xoay đánh dấu tiết học & ngày tháng"
    }
  },
  {
    syncId: "sync-khay-cam-but",
    name: "Khay Cắm Bút Đa Giác Voronoi Để Bàn",
    slug: "khay-cam-but-da-giac-voronoi",
    categoryId: "0e2afc16-4eab-4396-9382-681681cbed4d",
    categoryName: "Dụng Cụ Học Tập & Bàn Làm Việc",
    categoryBadge: "Dụng cụ học tập",
    description: "Khay đựng bút phong cách toán học tế bào Voronoi với kết cấu lưới rỗng thông gió, nhẹ và cứng vững. Giúp sắp xếp bút, thước kẻ, kéo và dụng cụ học tập gọn gàng, tạo điểm nhấn hiện đại cho bàn học và bàn làm việc.",
    shortDescription: "Khay cắm bút học tập cấu trúc rỗng tế bào Voronoi hiện đại.",
    basePrice: 170000,
    salePrice: 135000,
    imageUrl: "/images/products/khay-but-hoc-tap.jpg",
    images: [
      "/images/products/khay-but-hoc-tap.jpg",
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/coffeeMug.glb",
    colors: ["Đen Mờ Nhám", "Trắng Tinh Khiết", "Cam Hổ Phách"],
    sizes: ["Tiêu Chuẩn (110mm)", "Cỡ Lớn Đa Ngăn (150mm)"],
    featured: false,
    author: "Open Voronoi Studio",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Thingiverse Mathematical Designs",
    specs: {
      "Số chi tiết": "1 khối đúc",
      "Thời gian in": "3 giờ 10 phút",
      "Khối lượng": "75g (Nhựa PLA Sinh Học)",
      "Dung sai": "±0.1 mm",
      "Công nghệ in": "FDM 0.16mm",
      "Độ cao lớp in": "0.16 mm",
      "Kích thước": "85 x 85 x 110 mm"
    }
  },

  // ── 2. DECOR TRANG TRÍ KHÔNG GIAN ──
  {
    syncId: "sync-nefertiti-sculpture",
    name: "Tượng Điêu Khắc Nữ Hoàng Nefertiti Tinh Xảo",
    slug: "tuong-dieu-khac-nu-hoang-nefertiti",
    categoryId: "56e0f3aa-420e-42e6-bd72-86034a138849",
    categoryName: "Decor Trang Trí Không Gian",
    categoryBadge: "Decor nghệ thuật",
    description: "Bản phục dựng quét 3D độ phân giải cao của pho tượng bán thân Nữ hoàng Nefertiti huyền thoại. Ứng dụng vật liệu in composite pha bột đá sa thạch và đá cẩm thạch cho cảm giác cầm nặng tay, mát lạnh và có vân đá tự nhiên tinh tế.",
    shortDescription: "Tượng phục dựng nghệ thuật cổ đại in từ composite vân đá.",
    basePrice: 400000,
    salePrice: 320000,
    imageUrl: "/images/products/nefertiti-print.jpg",
    images: [
      "/images/products/nefertiti-print.jpg",
      "https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/Nefertiti.glb",
    colors: ["Đá Cẩm Thạch Trắng (Marble)", "Đá Sa Thạch Vàng (Sandstone)", "Đen Huyền Bí (Basalt)"],
    sizes: ["Tỉ lệ 1:4 (165mm)", "Tỉ lệ 1:2 (330mm)"],
    featured: true,
    author: "Neues Museum Scan & Three.js Archive",
    authorUrl: "https://threejs.org",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Cultural Heritage 3D Open Data",
    specs: {
      "Số chi tiết": "1 khối đúc đặc chân đế",
      "Thời gian in": "5 giờ 40 phút",
      "Khối lượng": "210g (Composite Pha Bột Đá)",
      "Dung sai": "±0.05 mm",
      "Công nghệ in": "FDM Stone-Composite / SLA Resin",
      "Độ cao lớp in": "0.10 mm",
      "Kích thước hoàn thiện": "80 x 95 x 165 mm",
      "Cảm giác chất liệu": "Nặng tay, sần nhám tự nhiên như đá tạc"
    }
  },

  // ── 3. VẬT KỶ NIỆM & QUÀ LƯU NIỆM ──
  {
    syncId: "sync-damaged-helmet",
    name: "Mũ Giáp Chiến Binh Cyberpunk (Damaged Helmet)",
    slug: "mu-giap-chien-binh-cyberpunk",
    categoryId: "7e097d43-32f5-4a4d-9740-899e3f9096cc",
    categoryName: "Vật Kỷ Niệm & Quà Lưu Niệm",
    categoryBadge: "Kỷ niệm & Lưu niệm",
    description: "Tác phẩm điêu khắc 3D mũ bảo hộ chiến thuật mang dấu vết thực chiến theo phong cách Cyber-SciFi. Bề mặt thể hiện các vết nứt, vết cháy xém và rãnh kỹ thuật tinh xảo. Có thể in bằng nhựa thường để sơn weathering thủ công hoặc in bằng nhựa giả đồng/gỗ.",
    shortDescription: "Tượng decor mũ giáp Cyberpunk phong cách viễn tưởng.",
    basePrice: 480000,
    salePrice: 380000,
    imageUrl: "/images/products/cyber-helmet-print.jpg",
    images: [
      "/images/products/cyber-helmet-print.jpg",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/DamagedHelmet.glb",
    colors: ["Vàng Đồng Cổ (Antique Bronze)", "Xám Kim Loại", "Trắng Sứ"],
    sizes: ["Bản Để Bàn (110mm)", "Bản Studio (180mm)"],
    featured: true,
    author: "BattleAxe / Sketchfab & Khronos Group",
    authorUrl: "https://sketchfab.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Khronos glTF Sample Models",
    specs: {
      "Số chi tiết": "1 khối liền đặc",
      "Thời gian in": "7 giờ 15 phút",
      "Khối lượng": "165g",
      "Dung sai": "±0.05 mm",
      "Công nghệ in": "SLA 12K Resin / FDM Fine",
      "Độ cao lớp in": "0.08 mm (Ultra Detail)",
      "Kích thước hoàn thiện": "110 x 110 x 130 mm",
      "Xử lý bề mặt": "Phun sơn lót Primer sẵn sàng custom"
    }
  },

  // ── 4. PHỤ KIỆN CÔNG NGHỆ & TRƯNG BÀY ──
  {
    syncId: "sync-phone-dock",
    name: "Giá Đỡ Điện Thoại Đa Góc & Treo Dây Sạc Cyber-Dock",
    slug: "gia-do-dien-thoai-treo-day-sac-cyber-dock",
    categoryId: "6af24b1e-871c-42fe-a055-7f6422b09d3d",
    categoryName: "Phụ Kiện Công Nghệ & Trưng Bày",
    categoryBadge: "Phụ kiện công nghệ",
    description: "Giá đỡ điện thoại góc nghiêng công thái học 65 độ giúp xem video, học trực tuyến và livestream thoải mái. Thiết kế có rãnh khoét thông minh luồn cáp sạc chống gãy đầu gập, phía sau có 2 kẹp cuộn dây sạc gọn gàng và móc treo tai nghe smartwatch bên hông.",
    shortDescription: "Giá đỡ điện thoại góc nghiêng 65° tích hợp kẹp dây sạc gọn gàng.",
    basePrice: 180000,
    salePrice: 145000,
    imageUrl: "/images/products/gia-do-dien-thoai.jpg",
    images: [
      "/images/products/gia-do-dien-thoai.jpg",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/BoomBox.glb",
    colors: ["Đen Cyber Stealth", "Xám Titan Nhám", "Cam Neon Đậm"],
    sizes: ["Tiêu Chuẩn (Smartphone)", "Cỡ Lớn (Tablet / iPad)"],
    featured: true,
    author: "Open Desk Organization Project",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Kinetic3D Desk Gadget Lab",
    specs: {
      "Số chi tiết": "1 chi tiết in liền đệm chống trượt",
      "Thời gian in": "3 giờ 20 phút",
      "Khối lượng": "110g (Nhựa PETG Chịu Lực)",
      "Dung sai": "±0.1 mm",
      "Công nghệ in": "FDM Precision 0.16mm",
      "Độ cao lớp in": "0.16 mm",
      "Kích thước hoàn thiện": "105 x 90 x 115 mm",
      "Rãnh cáp": "Tương thích cáp Type-C, Lightning, MagSafe"
    }
  },
  {
    syncId: "sync-artisan-keycap",
    name: "Keycap Cơ Khí Cyberpunk Robot Artisan (1U)",
    slug: "keycap-co-khi-cyberpunk-robot-artisan",
    categoryId: "6af24b1e-871c-42fe-a055-7f6422b09d3d",
    categoryName: "Phụ Kiện Công Nghệ & Trưng Bày",
    categoryBadge: "Phụ kiện công nghệ",
    description: "Nút phím cơ Artisan tỉ lệ 1U đúc bằng công nghệ Resin SLA hiển vi 12K. Tái hiện khuôn mặt chiến binh robot viễn tưởng với kính ngắm cyber xuyên sáng LED RGB từ switch phím. Chân cắm chuẩn chữ thập Cherry MX tương thích mọi bàn phím cơ phổ biến.",
    shortDescription: "Keycap Artisan 1U Robot viễn tưởng xuyên sáng LED cho bàn phím cơ.",
    basePrice: 220000,
    salePrice: 175000,
    imageUrl: "/images/products/artisan-keycap.jpg",
    images: [
      "/images/products/artisan-keycap.jpg",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/steampunk_camera.glb",
    colors: ["Đen Titan Kính Cyan", "Trắng Sứ Kính Đỏ Neon", "Vàng Đồng Cổ Kính Hổ Phách"],
    sizes: ["Hàng ESC (R4 1U)", "Hàng Space / Chữ (1U)"],
    featured: true,
    author: "Cyber Mech Artisan Studio",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Kinetic3D Mechanical Keycaps",
    specs: {
      "Số chi tiết": "1 khối đúc resin",
      "Thời gian in": "1 giờ 40 phút (In theo mẻ 12 chiếc)",
      "Khối lượng": "8g (Resin Cứng Cao Cấp)",
      "Dung sai": "±0.02 mm (Chân switch bám cực chắc)",
      "Công nghệ in": "SLA 12K Resin Siêu Mịn",
      "Độ cao lớp in": "0.02 mm",
      "Kích thước": "18 x 18 x 14 mm",
      "Chân switch": "Chuẩn Cherry MX Cross-Stem"
    }
  },

  // ── 5. ĐỒ CHƠI KHỚP ĐỘNG & CƠ KHÍ ──
  {
    syncId: "sync-flexi-dragon",
    name: "Rồng Thần Thoại Khớp Động In Liền Khối (Flexi Dragon)",
    slug: "rong-than-thoai-khop-dong-flexi-dragon",
    categoryId: "46e5c9b9-9c0c-477c-8e4e-06e0602b51cc",
    categoryName: "Đồ Chơi Khớp Động & Cơ Khí",
    categoryBadge: "Đồ chơi khớp động",
    description: "Mô hình rồng huyền bí với toàn bộ đốt xương sống, cánh và chân được in liền khối hoàn toàn (Print-in-place). Ngay khi gỡ khỏi bàn in, các khớp nối cử động uốn lượn mượt mà như rồng bay lượn trong không khí. Đồ chơi cầm tay xả stress cực kỳ độc đáo và bắt mắt.",
    shortDescription: "Rồng thần thoại uốn lượn in liền khối print-in-place không cần lắp ráp.",
    basePrice: 320000,
    salePrice: 260000,
    imageUrl: "/images/products/flexi-dragon.jpg",
    images: [
      "/images/products/flexi-dragon.jpg",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/DragonAttenuation.glb",
    colors: ["Cầu Vồng Tơ Lụa (Silk Rainbow)", "Đỏ Rồng Lửa & Vàng Kim", "Xanh Rêu Cổ Thần"],
    sizes: ["Cầm Tay (35cm)", "Trưng Bày Bàn (50cm)"],
    featured: true,
    author: "McGybeer & Open Flexi Community",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Thingiverse Articulated Models",
    specs: {
      "Số chi tiết": "Print-in-place (36 đốt khớp động in cùng lúc)",
      "Thời gian in": "7 giờ 15 phút",
      "Khối lượng": "165g (Nhựa PLA Silk bóng)",
      "Dung sai": "Khe hở 0.35mm giữa các đốt khớp",
      "Công nghệ in": "FDM Đa Sắc Màu",
      "Độ cao lớp in": "0.15 mm",
      "Kích thước chiều dài": "350 x 85 x 65 mm",
      "Độ linh hoạt": "Uốn cong 360 độ tự do"
    }
  },
  {
    syncId: "sync-gearbox-assy",
    name: "Hộp Bánh Răng Hành Tinh Vô Tận (Planetary Gear Fidget)",
    slug: "hop-banh-rang-hanh-tinh-vo-tan",
    categoryId: "46e5c9b9-9c0c-477c-8e4e-06e0602b51cc",
    categoryName: "Đồ Chơi Khớp Động & Cơ Khí",
    categoryBadge: "Cơ khí & Khớp động",
    description: "Cụm bánh răng hành tinh cơ khí in liền khối (Print-in-place) chuyển động siêu êm mượt. Khi xoay vòng ngoài, 6 bánh răng vệ tinh và bánh răng mặt trời quay đồng tốc tạo cảm giác xúc giác (tactile feedback) giải tỏa căng thẳng cực đã. Không cần lắp ráp, vừa in xong là quay được ngay.",
    shortDescription: "Đồ chơi bánh răng hành tinh cơ khí in liền khối print-in-place.",
    basePrice: 260000,
    salePrice: 210000,
    imageUrl: "/images/products/gearbox-print.jpg",
    images: [
      "/images/products/gearbox-print.jpg",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/GearboxAssy.glb",
    colors: ["Cam Cơ Khí & Xám", "Đen Nhám & Vàng Đồng", "Trong Suốt Clear Resin"],
    sizes: ["Bỏ Túi (70mm)", "Đặt Bàn (95mm)"],
    featured: false,
    author: "Open Mechanics Community",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Thingiverse Mechanical Prints",
    specs: {
      "Số chi tiết": "Print-in-place (In nguyên khối quay ngay)",
      "Thời gian in": "4 giờ 45 phút",
      "Khối lượng": "95g (Nhựa PETG chịu mài mòn)",
      "Dung sai": "Khe hở 0.3mm giữa các bánh răng",
      "Công nghệ in": "FDM Precision 0.16mm",
      "Độ cao lớp in": "0.16 mm",
      "Kích thước hoàn thiện": "90 x 90 x 45 mm",
      "Bảo trì": "Bôi trơn sẵn mỡ silicon chịu nhiệt"
    }
  },
  {
    syncId: "sync-robot-expressive",
    name: "Robot Trợ Lý Biểu Cảm (Expressive Cyber-Bot)",
    slug: "robot-tro-ly-bieu-cam-cyber-bot",
    categoryId: "46e5c9b9-9c0c-477c-8e4e-06e0602b51cc",
    categoryName: "Đồ Chơi Khớp Động & Cơ Khí",
    categoryBadge: "Nhân vật & Robot",
    description: "Mô hình chú robot đáng yêu với khớp cầu linh hoạt ở đầu, tay và chân. Có thể tạo nhiều tư thế ngộ nghĩnh trên bàn học hoặc bàn làm việc. Đầu có khay đựng namecard hoặc kẹp giấy note thông minh.",
    shortDescription: "Robot trợ lý để bàn khớp động biểu cảm linh hoạt.",
    basePrice: 300000,
    salePrice: 240000,
    imageUrl: "/images/products/cyber-bot-print.jpg",
    images: [
      "/images/products/cyber-bot-print.jpg",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/RobotExpressive.glb",
    colors: ["Trắng Sứ & Xanh Dương", "Vàng Chanh & Xám", "Hồng Pastel & Trắng"],
    sizes: ["Tiêu Chuẩn (120mm)", "Mini (80mm)"],
    featured: true,
    author: "Three.js Art Studio",
    authorUrl: "https://threejs.org",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Three.js Models Collection",
    specs: {
      "Số chi tiết": "5 chi tiết khớp nối cầu",
      "Thời gian in": "3 giờ 15 phút",
      "Khối lượng": "70g (Nhựa PLA Sinh Học)",
      "Dung sai": "±0.1 mm",
      "Công nghệ in": "FDM Đa Màu",
      "Độ cao lớp in": "0.15 mm",
      "Kích thước hoàn thiện": "75 x 50 x 120 mm",
      "Độ tuổi phù hợp": "Mọi lứa tuổi (An toàn không độc hại)"
    }
  },

  // ── 6. MÔ HÌNH QUÂN SỰ & XE CỘ CHI TIẾT CAO ──
  {
    syncId: "sync-sherman-m4a1",
    name: "Xe Tăng Hạng Trung Sherman M4A1 (AMS Edition)",
    slug: "xe-tang-sherman-m4a1-ams",
    categoryId: "98484c27-06c0-4026-a182-b44d8b15328f",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryBadge: "Mô hình quân sự",
    description: "Mô hình xe tăng Sherman M4A1 tỉ lệ chuẩn với 75 chi tiết in rời có độ chính xác cao. Hỗ trợ lắp ghép cơ học không cần keo dán, tháp pháo xoay 360 độ và nòng pháo nâng hạ góc bắn. Tối ưu cho in 3D nhiều màu trên hệ thống Bambu Lab AMS.",
    shortDescription: "Mô hình xe tăng Sherman M4A1 75 chi tiết in rời lắp ghép cơ học.",
    basePrice: 850000,
    salePrice: 680000,
    imageUrl: "/images/products/sherman-tank-print.jpg",
    images: [
      "/images/products/sherman-tank-print.jpg",
      "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/sherman_print_plate.glb",
    colors: ["Xanh Quân Đội (Olive Drab)", "Xám Sa Mạc (Desert Sand)", "Đen Cyber Stealth"],
    sizes: ["Tỉ lệ 1:35 (Chuẩn)", "Tỉ lệ 1:24 (Lớn)", "Tỉ lệ 1:16 (Collector)"],
    featured: true,
    author: "Bambu Lab AMS Community & Open CAD",
    authorUrl: "https://thingiverse.com",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Thingiverse & Open 3D Print Archives",
    specs: {
      "Số chi tiết": "75 chi tiết in rời (Multi-part kit)",
      "Thời gian in": "14 giờ 20 phút (0.12mm layer)",
      "Khối lượng": "280g (Nhựa PLA+ Matte)",
      "Dung sai": "±0.08 mm (Khớp nối cơ học)",
      "Công nghệ in": "FDM Đa màu Bambu Lab AMS",
      "Độ cao lớp in": "0.12 mm High Precision",
      "Kích thước hoàn thiện": "185 x 85 x 95 mm",
      "Độ khó lắp ráp": "Trung bình (Có sơ đồ hướng dẫn)"
    }
  },
  {
    syncId: "sync-ion-drive",
    name: "Động Cơ Đẩy Không Gian Primary Ion Drive",
    slug: "dong-co-day-primary-ion-drive",
    categoryId: "98484c27-06c0-4026-a182-b44d8b15328f",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryBadge: "Mô hình viễn tưởng",
    description: "Bản mô phỏng kỹ thuật động cơ đẩy hạt Ion viễn tưởng của tàu thám hiểm không gian. Thiết kế dạng modular với các ống dẫn năng lượng plasma, buồng đốt từ tính và vòng tản nhiệt dạng tổ ong. Thích hợp làm vật trưng bày bàn làm việc hoặc gắn đèn LED hắt sáng.",
    shortDescription: "Mô hình động cơ đẩy Ion Sci-Fi trưng bày bàn làm việc.",
    basePrice: 550000,
    salePrice: 450000,
    imageUrl: "/images/products/ion-drive-print.jpg",
    images: [
      "/images/products/ion-drive-print.jpg",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/PrimaryIonDrive.glb",
    colors: ["Bạc Titanium Metallic", "Đen Mờ Nhám", "Xanh Cyan Neon"],
    sizes: ["Tiêu chuẩn (140mm)", "Cỡ lớn (200mm)"],
    featured: true,
    author: "NASA / Khronos Group & Three.js",
    authorUrl: "https://threejs.org",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Three.js glTF Repository",
    specs: {
      "Số chi tiết": "1 khối tích hợp (Print-in-place)",
      "Thời gian in": "8 giờ 30 phút",
      "Khối lượng": "190g (PLA Metallic)",
      "Dung sai": "±0.1 mm",
      "Công nghệ in": "FDM / SLA Resin",
      "Độ cao lớp in": "0.16 mm",
      "Kích thước hoàn thiện": "140 x 120 x 160 mm",
      "Tính năng đặc biệt": "Khoang rỗng luồn dây LED Type-C"
    }
  },
  {
    syncId: "sync-supercar-24",
    name: "Siêu Xe Thể Thao Tỉ Lệ 1:24 (Cyber Supercar Edition)",
    slug: "sieu-xe-the-thao-ti-le-1-24",
    categoryId: "98484c27-06c0-4026-a182-b44d8b15328f",
    categoryName: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    categoryBadge: "Mô hình xe cộ",
    description: "Mô hình siêu xe thể thao hiệu năng cao tỉ lệ 1:24 với đường cong khí động học uốn lượn sắc sảo. Tái hiện khoang lái chi tiết, vô lăng, mâm xe thể thao và cánh gió sau. Bề mặt có thể đánh bóng và phủ bóng ceramic như sơn xe thật.",
    shortDescription: "Mô hình siêu xe thể thao 1:24 chi tiết cao.",
    basePrice: 650000,
    salePrice: 520000,
    imageUrl: "/images/products/supercar-print.jpg",
    images: [
      "/images/products/supercar-print.jpg",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop"
    ],
    model3DUrl: "/models/ferrari.glb",
    colors: ["Đỏ Rosso Corsa", "Vàng Cyber Gold", "Đen Nhám Carbon"],
    sizes: ["Tỉ lệ 1:24 (190mm)", "Tỉ lệ 1:18 (250mm)"],
    featured: false,
    author: "Three.js Automotive Showcase",
    authorUrl: "https://threejs.org",
    license: "Creative Commons Attribution (CC-BY 4.0)",
    source: "Three.js Samples",
    specs: {
      "Số chi tiết": "12 chi tiết (Thân vỏ + Mâm bánh xoay)",
      "Thời gian in": "9 giờ 10 phút",
      "Khối lượng": "180g (Nhựa PLA+ High Gloss)",
      "Dung sai": "±0.08 mm",
      "Công nghệ in": "FDM Fine 0.12mm",
      "Độ cao lớp in": "0.12 mm",
      "Kích thước hoàn thiện": "190 x 85 x 50 mm",
      "Bánh xe": "Trục kim loại xoay tự do"
    }
  }
];
