// ============================================================
// Kinetic3D — Central Mock Data
// All pages reference this single source of truth.
// Replace with API calls once backend is ready.
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  price: number;
  salePrice: number | null;
  description: string;
  shortDescription: string;
  images: string[];
  specs: Record<string, string>;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

// ─── Categories ──────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "k-standard",
    name: "K-Standard",
    slug: "k-standard",
    description: "Dòng sản phẩm tiêu chuẩn hóa có tệp khách hàng rộng: Đồ decor phong cách công nghệ, keycap độc lạ, dock sạc thông minh và mô hình in sẵn.",
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop",
    productCount: 3,
  },
  {
    id: "k-personal",
    name: "K-Personal",
    slug: "k-personal",
    description: "Dòng cá nhân hóa sâu: Tượng Chibi kỷ niệm vẽ từ ảnh chụp thật bằng AI dựng hình, bảng hiệu signature 3D nổi và logo độc bản.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    productCount: 3,
  },
  {
    id: "k-heritage",
    name: "K-Heritage",
    slug: "k-heritage",
    description: "Dòng lưu niệm văn hóa: Bản mô phỏng kiến trúc danh lam thắng cảnh ứng dụng vật liệu in thế hệ mới (composite vân gỗ/đá).",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    productCount: 3,
  }
];

// ─── Products ────────────────────────────────────────────────

export const products: Product[] = [
  // ── K-Standard ──
  {
    id: "prod-1",
    name: "Cyber-Tech Desk Organizer",
    slug: "cyber-tech-desk-organizer",
    categoryId: "k-standard",
    categoryName: "K-Standard",
    price: 350000,
    salePrice: 290000,
    description: "Dock sạc thông minh kết hợp khay đựng đồ phong cách Cyber-tech. In nguyên khối bằng nhựa PETG độ bền cao, tích hợp đèn LED nền hắt sáng và khe tản nhiệt cho thiết bị di động.",
    shortDescription: "Dock sạc & khay đựng thông minh phong cách công nghệ.",
    images: [
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Nhựa PETG", "Khối lượng": "250g", "Kích thước": "20 x 15 x 8cm" },
    colors: ["Cyber Black", "Neon Lime"],
    sizes: ["Tiêu Chuẩn"],
    inStock: true,
    featured: true,
  },
  {
    id: "prod-2",
    name: "Artisan Mech Keycap Set",
    slug: "artisan-mech-keycap-set",
    categoryId: "k-standard",
    categoryName: "K-Standard",
    price: 150000,
    salePrice: null,
    description: "Bộ 4 nút Keycap Artisan cho bàn phím cơ, được in bằng công nghệ Resin SLA độ phân giải siêu cao (0.02mm). Các chi tiết nổi khối 3D sắc nét theo chủ đề khoa học viễn tưởng.",
    shortDescription: "Keycap Resin độc bản chủ đề Sci-Fi.",
    images: [
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Resin SLA", "Khối lượng": "10g", "Profile": "Cherry/SA" },
    colors: ["Clear Resin", "Cyber Yellow"],
    sizes: ["1U (Phím thường)"],
    inStock: true,
    featured: false,
  },
  {
    id: "prod-3",
    name: "Mecha Anime Figurine",
    slug: "mecha-anime-figurine",
    categoryId: "k-standard",
    categoryName: "K-Standard",
    price: 550000,
    salePrice: 480000,
    description: "Mô hình Mecha tĩnh thu nhỏ 1:12. Bề mặt được xử lý chà nhám tinh tế và có các rãnh đi chìm (panel line) sắc xảo để khách hàng tự do sơn phết theo ý thích.",
    shortDescription: "Mô hình Mecha in sẵn tỉ lệ 1:12.",
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Nhựa PLA+", "Khối lượng": "350g", "Tỉ lệ": "1:12" },
    colors: ["Xám Base", "Trắng"],
    sizes: ["15cm", "25cm"],
    inStock: true,
    featured: true,
  },

  // ── K-Personal ──
  {
    id: "prod-4",
    name: "Tượng Chibi Kỷ Niệm (AI-Generated)",
    slug: "tuong-chibi-ky-niem-ai",
    categoryId: "k-personal",
    categoryName: "K-Personal",
    price: 1200000,
    salePrice: null,
    description: "Khách hàng cung cấp ảnh chân dung, hệ thống AI Generative sẽ tạo hình Chibi 3D dễ thương. Sản phẩm in bằng Resin lỏng cao cấp cho bề mặt láng mịn, tái hiện thần thái khuôn mặt chân thực.",
    shortDescription: "Tượng Chibi cá nhân hóa độc bản từ ảnh thật.",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Resin cao cấp", "Công nghệ": "AI Gen 3D", "Quy trình": "Thiết kế & In" },
    colors: ["Sơn Phết Thủ Công", "Màu Nhựa Gốc"],
    sizes: ["10cm", "15cm", "20cm"],
    inStock: true,
    featured: true,
  },
  {
    id: "prod-5",
    name: "Bảng Hiệu Signature 3D",
    slug: "bang-hieu-signature-3d",
    categoryId: "k-personal",
    categoryName: "K-Personal",
    price: 850000,
    salePrice: 790000,
    description: "Bảng hiệu đặt bàn hoặc treo tường khắc nổi 3D tên cá nhân hoặc thông điệp riêng. Có tích hợp đèn LED âm bản tạo hiệu ứng hắt sáng neon độc đáo.",
    shortDescription: "Bảng hiệu nổi 3D tích hợp LED âm bản.",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "PLA & Acrylic", "Đèn": "LED Neon Flex", "Kích thước": "Tùy chỉnh" },
    colors: ["Đen/Xanh Lá", "Trắng/Cam"],
    sizes: ["Cỡ Nhỏ", "Cỡ Trung"],
    inStock: true,
    featured: false,
  },
  {
    id: "prod-6",
    name: "Logo Độc Bản F&B",
    slug: "logo-doc-ban-fb",
    categoryId: "k-personal",
    categoryName: "K-Personal",
    price: 1500000,
    salePrice: null,
    description: "Được thiết kế dành riêng cho quán cafe, nhà hàng. Dựng nổi 3D logo thương hiệu với chi tiết phức tạp, sơn thủ công chống phai và độ cứng cáp chống va đập tốt.",
    shortDescription: "Logo nổi 3D cho chuỗi F&B.",
    images: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "PETG độ bền cao", "Độ dày": "10 - 20mm", "Tuổi thọ": "> 5 năm" },
    colors: ["Theo yêu cầu thương hiệu"],
    sizes: ["Tùy chỉnh"],
    inStock: true,
    featured: false,
  },

  // ── K-Heritage ──
  {
    id: "prod-7",
    name: "Mô Hình Chùa Một Cột K-Heritage",
    slug: "mo-hinh-chua-mot-cot-k-heritage",
    categoryId: "k-heritage",
    categoryName: "K-Heritage",
    price: 650000,
    salePrice: null,
    description: "Bản mô phỏng danh lam thắng cảnh ứng dụng vật liệu in thế hệ mới pha trộn 30% bột gỗ tự nhiên. Cho ra sản phẩm có vân nhám như gỗ thật và thoang thoảng hương thơm nhẹ.",
    shortDescription: "Mô hình kiến trúc in từ Composite Vân Gỗ.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Wood-Composite (30% bột gỗ)", "Kích thước": "12 x 12 x 15cm", "Hương thơm": "Gỗ tự nhiên" },
    colors: ["Gỗ Sồi Trắng", "Gỗ Óc Chó"],
    sizes: ["Tiêu Chuẩn"],
    inStock: true,
    featured: true,
  },
  {
    id: "prod-8",
    name: "Khuê Văn Các Mini",
    slug: "khue-van-cac-mini",
    categoryId: "k-heritage",
    categoryName: "K-Heritage",
    price: 890000,
    salePrice: 750000,
    description: "Mô hình biểu tượng Khuê Văn Các được in bằng công nghệ FDM cực nét. Kết cấu rỗng thông minh giúp làm giảm trọng lượng và tối ưu vật liệu bảo vệ môi trường.",
    shortDescription: "Mô hình Khuê Văn Các làm quà lưu niệm.",
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Nhựa PLA sinh học", "Độ chi tiết": "Cao (Lớp cắt 0.1mm)" },
    colors: ["Đỏ Gạch", "Gỗ Cổ"],
    sizes: ["Tỉ lệ 1:50", "Tỉ lệ 1:100"],
    inStock: true,
    featured: false,
  },
  {
    id: "prod-9",
    name: "Di Tích Tháp Chăm Vân Đá",
    slug: "di-tich-thap-cham-van-da",
    categoryId: "k-heritage",
    categoryName: "K-Heritage",
    price: 1100000,
    salePrice: null,
    description: "Khối kiến trúc Tháp Chăm được phục dựng 3D qua máy quét (scan 3D) và in bằng vật liệu Composite pha bột đá. Cầm nặng tay, nhám lạnh y như đá thật ngàn năm tuổi.",
    shortDescription: "Mô phỏng Tháp Chăm bằng Composite Vân Đá.",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    ],
    specs: { "Vật liệu": "Stone-Composite", "Trọng lượng": "850g", "Cảm giác bề mặt": "Nhám mịn tự nhiên" },
    colors: ["Đá Sa Thạch", "Đá Xám Cổ"],
    sizes: ["Tiêu Chuẩn"],
    inStock: true,
    featured: true,
  }
];

// ─── Testimonials ────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Sarah Chen",
    role: "Lead Mechanical Engineer",
    company: "Apex Robotics",
    quote: "Kinetic3D cut our prototyping cycle from 3 weeks to 48 hours. The surface finish on their SLA parts rivals injection molding.",
  },
  {
    id: "t-2",
    name: "Marcus Hoffman",
    role: "Creative Director",
    company: "Volt Studio",
    quote: "The WebGL configurator is a game-changer. Our clients can see exactly what they are getting before we commit to print.",
  },
  {
    id: "t-3",
    name: "Dr. Yuki Tanaka",
    role: "R&D Director",
    company: "NeuraTech Labs",
    quote: "We needed bio-compatible housings with sub-50 micron tolerances. Kinetic3D delivered on every single spec. No exceptions.",
  },
  {
    id: "t-4",
    name: "James Okoro",
    role: "Founder & CEO",
    company: "SkyFrame Architecture",
    quote: "Their architectural models are works of art. The level of detail at 1:200 scale is something I have never seen from any other service.",
  },
  {
    id: "t-5",
    name: "Elena Vasquez",
    role: "Product Manager",
    company: "Meridian Hardware",
    quote: "The Startup Kit Alpha saved us at least $50k in tooling costs. We went from concept to investor demo in under a month.",
  },
  {
    id: "t-6",
    name: "Raj Patel",
    role: "CTO",
    company: "Prism Dynamics",
    quote: "Zero-defect policy is not just marketing with these guys. Three orders, zero rejects. That track record speaks for itself.",
  },
];

// ─── Video Showcase Data ─────────────────────────────────────

export const showcaseVideos = [
  {
    id: "v-1",
    label: "01 // THIẾT KẾ",
    title: "Bản Vẽ Kỹ Thuật Số",
    description: "From concept to parametric model in hours.",
    // Placeholder — user will provide real 3D printing videos later
    videoUrl: "https://videos.pexels.com/video-files/5532765/5532765-sd_640_360_25fps.mp4",
    posterUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "v-2",
    label: "02 // IN ẤN",
    title: "Lớp Chồng Lớp",
    description: "Sub-10 micron precision on every surface.",
    videoUrl: "https://videos.pexels.com/video-files/5532771/5532771-sd_640_360_25fps.mp4",
    posterUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "v-3",
    label: "03 // HOÀN THIỆN",
    title: "Bề Mặt Hoàn Hảo",
    description: "Post-processing that rivals injection molding.",
    videoUrl: "https://videos.pexels.com/video-files/5532773/5532773-sd_640_360_25fps.mp4",
    posterUrl: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "v-4",
    label: "04 // GIAO HÀNG",
    title: "Vận Chuyển Toàn Cầu",
    description: "Shock-isolated, sealed, tracked worldwide.",
    videoUrl: "https://videos.pexels.com/video-files/5532776/5532776-sd_640_360_25fps.mp4",
    posterUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  },
];

// ─── Stats ───────────────────────────────────────────────────

export const stats = [
  { label: "Sản phẩm đã sản xuất", value: 2847, suffix: "" },
  { label: "Tỷ lệ chính xác", value: 99.7, suffix: "%" },
  { label: "Thời gian giao hàng", value: 48, suffix: "h", prefix: "< " },
  { label: "Quốc gia phục vụ", value: 142, suffix: "" },
];

// ─── Helper Functions ────────────────────────────────────────

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return products.filter((p) => p.categoryId === category.id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q)
  );
}
