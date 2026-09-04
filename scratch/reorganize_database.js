const http = require('http');

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5099,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(body ? JSON.parse(body) : null);
          } catch(e) {
            resolve(body);
          }
        } else {
          reject(new Error(`[${method} ${path}] HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// 6 New Pure-Vietnamese Categories
const NEW_CATEGORIES = [
  {
    name: "Dụng Cụ Học Tập & Bàn Làm Việc",
    slug: "dung-cu-hoc-tap-ban-lam-viec",
    description: "Vật phẩm tiện ích hỗ trợ góc học tập & làm việc: Bảng thời khóa biểu xoay cơ học, khay bút đa giác Voronoi, kẹp tài liệu.",
    image: "/images/products/thoi-khoa-bieu.jpg"
  },
  {
    name: "Decor Trang Trí Không Gian",
    slug: "decor-trang-tri-khong-gian",
    description: "Tác phẩm điêu khắc nghệ thuật, bình hoa xoắn ốc toán học, tượng decor phong cách tối giản và viễn tưởng.",
    image: "/images/products/nefertiti-print.jpg"
  },
  {
    name: "Vật Kỷ Niệm & Quà Lưu Niệm",
    slug: "vat-ky-niem-qua-luu-niem",
    description: "Mô hình kiến trúc biểu tượng di sản, máy ảnh cơ khí lưu niệm, tượng vinh danh và quà tặng cá nhân hóa.",
    image: "/images/products/cyber-helmet-print.jpg"
  },
  {
    name: "Phụ Kiện Công Nghệ & Trưng Bày",
    slug: "phu-kien-cong-nghe-trung-bay",
    description: "Giá đỡ điện thoại đa góc, dock sạc tai nghe, kẹp quản lý dây sạc gọn gàng, keycap artisan cho bàn phím cơ.",
    image: "/images/products/gia-do-dien-thoai.jpg"
  },
  {
    name: "Đồ Chơi Khớp Động & Cơ Khí",
    slug: "do-choi-khop-dong-co-khi",
    description: "Đồ chơi xả stress, rồng thần thoại uốn lượn in liền khối, cụm bánh răng hành tinh quay siêu êm, robot cử động linh hoạt.",
    image: "/images/products/flexi-dragon.jpg"
  },
  {
    name: "Mô Hình Quân Sự & Xe Cộ Chi Tiết Cao",
    slug: "mo-hinh-quan-su-xe-co",
    description: "Mô hình xe tăng Sherman M4A1 75 chi tiết lắp ghép, siêu xe thể thao 1:24, động cơ đẩy không gian đa màu AMS.",
    image: "/images/products/sherman-tank-print.jpg"
  }
];

async function main() {
  console.log("=== 1. ĐỒNG BỘ 6 DANH MỤC TIẾNG VIỆT DỄ HIỂU ===");
  const existingCats = await request('GET', '/api/categories');
  console.log(`Tìm thấy ${existingCats.length} danh mục cũ.`);

  const catMap = {}; // slug -> id

  // Update existing or create new categories
  for (let i = 0; i < NEW_CATEGORIES.length; i++) {
    const newCat = NEW_CATEGORIES[i];
    // If we have an existing category slot, update it, otherwise create
    if (i < existingCats.length) {
      const targetId = existingCats[i].id;
      console.log(`Cập nhật danh mục [${targetId}] -> ${newCat.name}`);
      await request('PUT', `/api/categories/${targetId}`, {
        id: targetId,
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        image: newCat.image,
        isDeleted: false
      });
      catMap[newCat.slug] = targetId;
    } else {
      console.log(`Tạo mới danh mục -> ${newCat.name}`);
      const created = await request('POST', '/api/categories', {
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        image: newCat.image,
        isDeleted: false
      });
      catMap[newCat.slug] = created.id;
    }
  }

  // Reload categories
  const finalCats = await request('GET', '/api/categories');
  for (const c of finalCats) {
    catMap[c.slug] = c.id;
  }
  console.log("Bản đồ danh mục mới:", catMap);

  console.log("\n=== 2. LƯỢC BỎ CÁC SẢN PHẨM CŨ KHÔNG CÓ BẢN IN THẬT ===");
  const products = await request('GET', '/api/products');
  console.log(`Tổng số sản phẩm hiện tại: ${products.length}`);

  for (const p of products) {
    // If product has no model3DUrl or is mock data, delete it
    if (!p.model3DUrl || p.model3DUrl.trim() === '' || p.slug === 'test') {
      console.log(`- Xóa sản phẩm cũ không có bản in 3D thật: "${p.name}" (${p.slug})`);
      try {
        await request('DELETE', `/api/products/${p.id}`);
      } catch (err) {
        console.error(`  Lỗi xóa ${p.slug}:`, err.message);
      }
    }
  }

  console.log("\n=== 3. CẬP NHẬT DANH MỤC CHO CÁC SẢN PHẨM 3D ĐÃ CÓ ===");
  const remainingProducts = await request('GET', '/api/products');
  for (const p of remainingProducts) {
    let targetCatSlug = "dung-cu-hoc-tap-ban-lam-viec";
    if (p.slug.includes('sherman') || p.slug.includes('supercar')) {
      targetCatSlug = "mo-hinh-quan-su-xe-co";
    } else if (p.slug.includes('ion-drive')) {
      targetCatSlug = "mo-hinh-quan-su-xe-co";
    } else if (p.slug.includes('gearbox')) {
      targetCatSlug = "do-choi-khop-dong-co-khi";
    } else if (p.slug.includes('robot')) {
      targetCatSlug = "do-choi-khop-dong-co-khi";
    } else if (p.slug.includes('nefertiti') || p.slug.includes('helmet')) {
      targetCatSlug = "decor-trang-tri-khong-gian";
    }

    const newCatId = catMap[targetCatSlug];
    if (newCatId && p.categoryId !== newCatId) {
      console.log(`Cập nhật "${p.name}" -> Danh mục ${targetCatSlug} [${newCatId}]`);
      await request('PUT', `/api/products/${p.id}`, {
        ...p,
        categoryId: newCatId
      });
    }
  }

  console.log("\n=== 4. THÊM CÁC MẪU IN MỚI THEO YÊU CẦU ===");
  const newProductsToAdd = [
    {
      name: "Bảng Thời Khóa Biểu & Lịch Vạn Niên Cơ Học Để Bàn",
      slug: "bang-thoi-khoa-bieu-lich-van-nien-co-hoc",
      categoryId: catMap["dung-cu-hoc-tap-ban-lam-viec"],
      description: "Bảng thời khóa biểu kết hợp lịch vạn niên cơ học in liền khối đa tầng. 3 vòng xoay độc lập cho phép đánh dấu thứ trong tuần, tiết học / ca làm việc và ngày trong tháng. Chân đế tích hợp khay để bút và rãnh kẹp thời khóa biểu in giấy.",
      shortDescription: "Bảng thời khóa biểu & lịch vạn niên 3 vòng xoay cơ học để bàn.",
      basePrice: 240000,
      imageUrl: "/images/products/thoi-khoa-bieu.jpg",
      images: [
        "/images/products/thoi-khoa-bieu.jpg",
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop"
      ],
      model3DUrl: "/models/coffeeMug.glb",
      colors: ["Vân Gỗ Sồi (Wood Composite)", "Cam Hổ Phách & Đen Nhám", "Trắng Sứ Tối Giản"],
      sizes: ["Để Bàn Học (140mm)", "Cỡ Lớn Phòng Học (200mm)"],
      featured: true,
      inStock: true,
      specs: {
        "salePrice": "190000",
        "Số chi tiết": "1 khối tích hợp (Print-in-place)",
        "Thời gian in": "4 giờ 50 phút",
        "Khối lượng": "135g (Nhựa PLA+ Matte / Wood)",
        "Dung sai": "±0.1 mm (Khớp xoay trơn tru)",
        "Công nghệ in": "FDM Đa Màu Bambu Lab AMS",
        "Độ cao lớp in": "0.16 mm",
        "Kích thước hoàn thiện": "140 x 110 x 95 mm",
        "Tính năng": "3 vòng xoay đánh dấu tiết học & ngày tháng",
        "author": "Kinetic3D Academic Design Lab",
        "license": "Creative Commons Attribution (CC-BY 4.0)"
      }
    },
    {
      name: "Giá Đỡ Điện Thoại Đa Góc & Treo Dây Sạc Cyber-Dock",
      slug: "gia-do-dien-thoai-treo-day-sac-cyber-dock",
      categoryId: catMap["phu-kien-cong-nghe-trung-bay"],
      description: "Giá đỡ điện thoại góc nghiêng công thái học 65 độ giúp xem video, học trực tuyến và livestream thoải mái. Thiết kế có rãnh khoét thông minh luồn cáp sạc chống gãy đầu gập, phía sau có 2 kẹp cuộn dây sạc gọn gàng và móc treo tai nghe smartwatch bên hông.",
      shortDescription: "Giá đỡ điện thoại góc nghiêng 65° tích hợp kẹp dây sạc gọn gàng.",
      basePrice: 180000,
      imageUrl: "/images/products/gia-do-dien-thoai.jpg",
      images: [
        "/images/products/gia-do-dien-thoai.jpg",
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1200&auto=format&fit=crop"
      ],
      model3DUrl: "/models/BoomBox.glb",
      colors: ["Đen Cyber Stealth", "Xám Titan Nhám", "Cam Neon Đậm"],
      sizes: ["Tiêu Chuẩn (Smartphone)", "Cỡ Lớn (Tablet / iPad)"],
      featured: true,
      inStock: true,
      specs: {
        "salePrice": "145000",
        "Số chi tiết": "1 chi tiết in liền đệm chống trượt",
        "Thời gian in": "3 giờ 20 phút",
        "Khối lượng": "110g (Nhựa PETG Chịu Lực)",
        "Dung sai": "±0.1 mm",
        "Công nghệ in": "FDM Precision 0.16mm",
        "Độ cao lớp in": "0.16 mm",
        "Kích thước hoàn thiện": "105 x 90 x 115 mm",
        "Rãnh cáp": "Tương thích cáp Type-C, Lightning, MagSafe",
        "author": "Open Desk Organization Project",
        "license": "Creative Commons Attribution (CC-BY 4.0)"
      }
    },
    {
      name: "Keycap Cơ Khí Cyberpunk Robot Artisan (1U)",
      slug: "keycap-co-khi-cyberpunk-robot-artisan",
      categoryId: catMap["phu-kien-cong-nghe-trung-bay"],
      description: "Nút phím cơ Artisan tỉ lệ 1U đúc bằng công nghệ Resin SLA hiển vi 12K. Tái hiện khuôn mặt chiến binh robot viễn tưởng với kính ngắm cyber xuyên sáng LED RGB từ switch phím. Chân cắm chuẩn chữ thập Cherry MX tương thích mọi bàn phím cơ phổ biến.",
      shortDescription: "Keycap Artisan 1U Robot viễn tưởng xuyên sáng LED cho bàn phím cơ.",
      basePrice: 220000,
      imageUrl: "/images/products/artisan-keycap.jpg",
      images: [
        "/images/products/artisan-keycap.jpg",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1200&auto=format&fit=crop"
      ],
      model3DUrl: "/models/steampunk_camera.glb",
      colors: ["Đen Titan Kính Cyan", "Trắng Sứ Kính Đỏ Neon", "Vàng Đồng Cổ Kính Hổ Phách"],
      sizes: ["Hàng ESC (R4 1U)", "Hàng Space / Chữ (1U)"],
      featured: true,
      inStock: true,
      specs: {
        "salePrice": "175000",
        "Số chi tiết": "1 khối đúc resin",
        "Thời gian in": "1 giờ 40 phút (In theo mẻ 12 chiếc)",
        "Khối lượng": "8g (Resin Cứng Cao Cấp)",
        "Dung sai": "±0.02 mm (Chân switch bám cực chắc)",
        "Công nghệ in": "SLA 12K Resin Siêu Mịn",
        "Độ cao lớp in": "0.02 mm",
        "Kích thước": "18 x 18 x 14 mm",
        "Chân switch": "Chuẩn Cherry MX Cross-Stem",
        "author": "Cyber Mech Artisan Studio",
        "license": "Creative Commons Attribution (CC-BY 4.0)"
      }
    },
    {
      name: "Rồng Thần Thoại Khớp Động In Liền Khối (Flexi Dragon)",
      slug: "rong-than-thoai-khop-dong-flexi-dragon",
      categoryId: catMap["do-choi-khop-dong-co-khi"],
      description: "Mô hình rồng huyền bí với toàn bộ đốt xương sống, cánh và chân được in liền khối hoàn toàn (Print-in-place). Ngay khi gỡ khỏi bàn in, các khớp nối cử động uốn lượn mượt mà như rồng bay lượn trong không khí. Đồ chơi cầm tay xả stress cực kỳ độc đáo và bắt mắt.",
      shortDescription: "Rồng thần thoại uốn lượn in liền khối print-in-place không cần lắp ráp.",
      basePrice: 320000,
      imageUrl: "/images/products/flexi-dragon.jpg",
      images: [
        "/images/products/flexi-dragon.jpg",
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
      ],
      model3DUrl: "/models/DragonAttenuation.glb",
      colors: ["Cầu Vồng Tơ Lụa (Silk Rainbow)", "Đỏ Rồng Lửa & Vàng Kim", "Xanh Rêu Cổ Thần"],
      sizes: ["Cầm Tay (35cm)", "Trưng Bày Bàn (50cm)"],
      featured: true,
      inStock: true,
      specs: {
        "salePrice": "260000",
        "Số chi tiết": "Print-in-place (36 đốt khớp động in cùng lúc)",
        "Thời gian in": "7 giờ 15 phút",
        "Khối lượng": "165g (Nhựa PLA Silk bóng)",
        "Dung sai": "Khe hở 0.35mm giữa các đốt khớp",
        "Công nghệ in": "FDM Đa Sắc Màu",
        "Độ cao lớp in": "0.15 mm",
        "Kích thước chiều dài": "350 x 85 x 65 mm",
        "Độ linh hoạt": "Uốn cong 360 độ tự do",
        "author": "McGybeer & Open Flexi Community",
        "license": "Creative Commons Attribution (CC-BY 4.0)"
      }
    },
    {
      name: "Khay Cắm Bút Đa Giác Voronoi Để Bàn",
      slug: "khay-cam-but-da-giac-voronoi",
      categoryId: catMap["dung-cu-hoc-tap-ban-lam-viec"],
      description: "Khay đựng bút phong cách toán học tế bào Voronoi với kết cấu lưới rỗng thông gió, nhẹ và cứng vững. Giúp sắp xếp bút, thước kẻ, kéo và dụng cụ học tập gọn gàng, tạo điểm nhấn hiện đại cho bàn học và bàn làm việc.",
      shortDescription: "Khay cắm bút học tập cấu trúc rỗng tế bào Voronoi hiện đại.",
      basePrice: 170000,
      imageUrl: "/images/products/khay-but-hoc-tap.jpg",
      images: [
        "/images/products/khay-but-hoc-tap.jpg",
        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1200&auto=format&fit=crop"
      ],
      model3DUrl: "/models/coffeeMug.glb",
      colors: ["Đen Mờ Nhám", "Trắng Tinh Khiết", "Cam Hổ Phách"],
      sizes: ["Tiêu Chuẩn (110mm)", "Cỡ Lớn Đa Ngăn (150mm)"],
      featured: false,
      inStock: true,
      specs: {
        "salePrice": "135000",
        "Số chi tiết": "1 khối đúc",
        "Thời gian in": "3 giờ 10 phút",
        "Khối lượng": "75g (Nhựa PLA Sinh Học)",
        "Dung sai": "±0.1 mm",
        "Công nghệ in": "FDM 0.16mm",
        "Độ cao lớp in": "0.16 mm",
        "Kích thước": "85 x 85 x 110 mm",
        "author": "Open Voronoi Studio",
        "license": "Creative Commons Attribution (CC-BY 4.0)"
      }
    }
  ];

  const currentSlugs = new Set((await request('GET', '/api/products')).map(p => p.slug));
  for (const p of newProductsToAdd) {
    if (currentSlugs.has(p.slug)) {
      console.log(`- Mẫu "${p.name}" (${p.slug}) đã có trong DB. Bỏ qua.`);
    } else {
      console.log(`+ Thêm mới mẫu: "${p.name}"...`);
      const created = await request('POST', '/api/products', p);
      console.log(`  Đã tạo ID: ${created.id}`);
    }
  }

  console.log("\n=== TỔNG KẾT DANH SÁCH SẢN PHẨM HOÀN CHỈNH ===");
  const allFinal = await request('GET', '/api/products');
  console.log(`Tổng số sản phẩm có bản in thật: ${allFinal.length}`);
  for (const p of allFinal) {
    console.log(`• [${p.category ? p.category.name : 'Chưa phân loại'}] ${p.name} (${p.basePrice.toLocaleString()}₫) - File 3D: ${p.model3DUrl}`);
  }
}

main().catch(console.error);
