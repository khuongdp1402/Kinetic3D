import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield, RefreshCw, Truck, FileText, ArrowLeft, CheckCircle } from "lucide-react";

interface PolicyDoc {
  slug: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  icon: any;
  sections: { heading: string; content: string[] }[];
}

const POLICIES: Record<string, PolicyDoc> = {
  terms: {
    slug: "terms",
    title: "Điều Khoản Dịch Vụ & Bản Quyền Sở Hữu Trí Tuệ",
    subtitle: "Quy định sử dụng nền tảng chế tác 3D và bảo vệ bản quyền tệp thiết kế của khách hàng",
    effectiveDate: "01/09/2026",
    icon: FileText,
    sections: [
      {
        heading: "1. Giới Thiệu & Chấp Thuận Điều Khoản",
        content: [
          "Chào mừng bạn đến với Kinetic3D (thuộc Kinetic Technologies Vietnam). Khi truy cập trang web, sử dụng công cụ tạo mẫu 3D bằng AI hoặc đặt in sản phẩm, bạn đồng ý tuân thủ các điều khoản dịch vụ này.",
          "Nếu bạn đại diện cho một tổ chức hoặc doanh nghiệp, bạn cam đoan rằng bạn có toàn quyền pháp lý ràng buộc tổ chức đó với các điều khoản này."
        ],
      },
      {
        heading: "2. Quyền Sở Hữu Trí Tuệ Đối Với Tệp Thiết Kế (STL, OBJ, STEP)",
        content: [
          "Khách hàng giữ 100% quyền sở hữu trí tuệ và tác quyền đối với tất cả các tệp CAD, mô hình 3D hoặc hình ảnh 2D được tải lên hệ thống Kinetic3D.",
          "Kinetic3D cam kết KHÔNG sao chép, phân phối, bán lại hoặc sử dụng tệp thiết kế của khách hàng cho bất kỳ mục đích thương mại nào khác ngoài việc thực hiện lệnh in và chế tác theo đơn hàng.",
          "Đối với các mô hình 3D được tạo ra bằng công cụ AI Mesh của Kinetic3D từ tài khoản Pro hoặc Enterprise, khách hàng sở hữu toàn quyền thương mại hóa kết quả đầu ra."
        ],
      },
      {
        heading: "3. Quy Trình Đặt Hàng & Thanh Toán Tự Động",
        content: [
          "Hệ thống hỗ trợ thanh toán trực tuyến tự động qua chuyển khoản ngân hàng (quét mã QR) và thanh toán khi nhận hàng (COD).",
          "Lệnh sản xuất trong xưởng in 3D sẽ được kích hoạt ngay lập tức khi hệ thống ghi nhận thanh toán thành công.",
          "Trong trường hợp thanh toán COD, nhân viên hỗ trợ của xưởng có thể liên hệ xác nhận thông số kỹ thuật trước khi đưa vào hàng đợi in."
        ],
      },
      {
        heading: "4. Giới Hạn Trách Nhiệm",
        content: [
          "Khách hàng chịu trách nhiệm đảm bảo các tệp tải lên không vi phạm luật sở hữu trí tuệ, bản quyền tác giả hoặc các quy định pháp luật hiện hành về vũ khí, công cụ nguy hiểm.",
          "Kinetic3D có quyền từ chối lệnh in nếu phát hiện sản phẩm vi phạm pháp luật hoặc thuần phong mỹ tục."
        ],
      },
    ],
  },
  refund: {
    slug: "refund",
    title: "Chính Sách Bảo Hành, Đổi Trả & Hoàn Tiền",
    subtitle: "Cam kết tiêu chuẩn chất lượng in 3D cơ khí và chính sách in lại miễn phí 100%",
    effectiveDate: "01/09/2026",
    icon: RefreshCw,
    sections: [
      {
        heading: "1. Cam Kết Tiêu Chuẩn Kỹ Thuật Kinetic3D",
        content: [
          "Mọi sản phẩm in 3D FDM và SLA Resin tại xưởng Kinetic3D đều trải qua quy trình kiểm soát chất lượng (QC) nghiêm ngặt trước khi xuất xưởng:",
          "• Độ chính xác kích thước FDM: Dung sai trong phạm vi ±0.1mm đối với chi tiết tiêu chuẩn.",
          "• Độ phân giải SLA Resin 12K: Độ mịn lớp in 0.02mm, không có bọt khí hoặc tì vết kết cấu bề mặt.",
          "• Độ bền cơ học: Đảm bảo độ kết dính lớp in tối ưu theo đúng thông số của từng loại vật liệu (PLA+, PETG, TPU, Carbon Fiber)."
        ],
      },
      {
        heading: "2. Điều Kiện Được In Lại Miễn Phí Hoặc Hoàn Tiền 100%",
        content: [
          "Kinetic3D hỗ trợ in lại miễn phí 100% hoặc hoàn tiền trong các trường hợp sau (thông báo trong vòng 7 ngày kể từ khi nhận hàng):",
          "• Sản phẩm bị nứt, gãy vỡ hoặc biến dạng do quá trình đóng gói và vận chuyển bưu tá.",
          "• Sản phẩm bị sai màu sắc, sai chất liệu so với đơn đặt hàng đã xác nhận.",
          "• Sai lệch kích thước vượt quá dung sai công bố (> 0.25mm) khiến chi tiết cơ khí không lắp ráp được.",
          "• Lỗi tách lớp (delamination) hoặc lỗi bề mặt nghiêm trọng do thiết bị in gây ra."
        ],
      },
      {
        heading: "3. Quy Trình Xử Lý Đổi Trả & Hoàn Tiền",
        content: [
          "Bước 1: Chụp ảnh hoặc quay video ngắn rõ nét lỗi của sản phẩm kèm mã đơn hàng (KN3D-...).",
          "Bước 2: Gửi thông tin qua Zalo / Hotline xưởng: 0988.888.888 hoặc email support@kinetic3d.vn.",
          "Bước 3: Đội ngũ kỹ sư sẽ phản hồi xác nhận trong vòng 2 giờ làm việc. Nếu hợp lệ, xưởng sẽ ưu tiên in lại ngay và gửi hỏa tốc cho quý khách trong 24h.",
          "Trong trường hợp hoàn tiền, số tiền sẽ được chuyển khoản hoàn trả về STK ngân hàng của quý khách trong 24-48 giờ làm việc."
        ],
      },
      {
        heading: "4. Trường Hợp Miễn Trừ Bảo Hành",
        content: [
          "• Tệp mô hình 3D gốc do khách hàng cung cấp có lỗi thiết kế thành mỏng (< 0.6mm), lỗi đảo mặt tam giác (inverted normals) mà khách đã được cảnh báo trước nhưng vẫn yêu cầu in.",
          "• Sản phẩm hư hỏng do sử dụng sai mục đích, tiếp xúc nhiệt độ vượt ngưỡng cho phép của vật liệu (ví dụ: để chi tiết PLA ngoài trời nắng gắt > 60°C).",
          "• Khách hàng tự ý mài giũa, cắt gọt hoặc can thiệp nhiệt làm hỏng kết cấu."
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Chính Sách Đóng Gói, Vận Chuyển & Đồng Kiểm",
    subtitle: "Quy chuẩn đóng gói chống sốc đa tầng và thời gian giao hàng toàn quốc",
    effectiveDate: "01/09/2026",
    icon: Truck,
    sections: [
      {
        heading: "1. Phạm Vi & Đơn Vị Vận Chuyển",
        content: [
          "Kinetic3D cung cấp dịch vụ giao hàng tận nơi trên toàn bộ 63 tỉnh thành Việt Nam thông qua các đối tác chuyển phát uy tín: Viettel Post, GHN, Ahamove và GrabExpress (giao hỏa tốc nội thành).",
          "Mọi đơn hàng đều có mã vận đơn theo dõi trực tiếp trên trang Tra cứu đơn hàng của Kinetic3D."
        ],
      },
      {
        heading: "2. Thời Gian Gia Công & Giao Hàng",
        content: [
          "• Thời gian chế tác in 3D: Từ 12 đến 36 giờ tùy thuộc vào thể tích và số lượng chi tiết.",
          "• Khu vực Nội thành Hà Nội & TP. Hồ Chí Minh: 24 giờ sau khi in xong (hỗ trợ ship hỏa tốc 2 giờ).",
          "• Các tỉnh thành miền Trung, Tây Nguyên, miền Tây: 48 - 72 giờ làm việc."
        ],
      },
      {
        heading: "3. Quy Chuẩn Đóng Gói Bảo Vệ Mô Hình 3D",
        content: [
          "Do đặc thù mô hình 3D và các chi tiết cơ khí có thể có các ngàm, khớp nối nhạy cảm, Kinetic3D áp dụng quy chuẩn đóng gói 4 lớp:",
          "• Lớp 1: Túi màng PE chống ẩm mốc và hạt hút ẩm silica gel.",
          "• Lớp 2: Quấn màng xốp khí bóng nổ chống sốc đa tầng (dày tối thiểu 15mm).",
          "• Lớp 3: Hạt xốp chèn kín toàn bộ khoảng trống trong thùng carton 5 lớp chịu lực.",
          "• Lớp 4: Niêm phong băng keo cảnh báo 'Hàng Dễ Vỡ - Xin Nhẹ Tay' chuyên dụng."
        ],
      },
      {
        heading: "4. Chính Sách Đồng Kiểm Khi Nhận Hàng",
        content: [
          "Khách hàng có quyền yêu cầu đồng kiểm hàng hóa cùng nhân viên giao hàng trước khi thanh toán (với đơn COD) hoặc ký nhận.",
          "Nếu phát hiện kiện hàng bị móp méo nặng hoặc gãy vỡ, quý khách vui lòng từ chối nhận hàng và liên hệ ngay hotline 0988.888.888 để được hỗ trợ gửi mẫu mới thay thế ngay lập tức."
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Chính Sách Bảo Mật Thông Tin & Dữ Liệu CAD",
    subtitle: "Cam kết bảo mật dữ liệu cá nhân, thanh toán VietQR và bản vẽ kỹ thuật",
    effectiveDate: "01/09/2026",
    icon: Shield,
    sections: [
      {
        heading: "1. Mục Đích Thu Thập Dữ Liệu",
        content: [
          "Kinetic3D chỉ thu thập các thông tin tối thiểu cần thiết để xử lý đơn hàng và giao sản phẩm:",
          "• Họ tên, số điện thoại, địa chỉ nhận hàng của người nhận.",
          "• Tệp mô hình 3D (STL/OBJ/GLB/STEP) và ảnh tham chiếu được tải lên cho mục đích in mẫu.",
          "• Lịch sử giao dịch thanh toán (Kinetic3D tuyệt đối không lưu trữ số thẻ hay mật khẩu ngân hàng của khách hàng)."
        ],
      },
      {
        heading: "2. Cam Kết Bảo Mật Tệp 3D & Bản Vẽ CAD Khách Hàng",
        content: [
          "Chúng tôi hiểu rằng nhiều tệp thiết kế là bí mật kinh doanh, bản mẫu R&D hoặc sáng tạo cá nhân độc quyền của quý khách.",
          "Kinetic3D cam kết:",
          "• Lưu trữ tệp CAD trên máy chủ mã hóa bảo mật, chỉ mở quyền truy cập cho kỹ sư vận hành máy in theo lệnh sản xuất.",
          "• Tuyệt đối không tải lên các thư viện công cộng, không bán hoặc chia sẻ tệp thiết kế cho bên thứ ba.",
          "• Hỗ trợ ký thỏa thuận bảo mật NDA (Non-Disclosure Agreement) đối với các dự án doanh nghiệp và khách hàng Studio Enterprise."
        ],
      },
      {
        heading: "3. An Toàn Thanh Toán Trực Tuyến",
        content: [
          "Giao dịch thanh toán được thực hiện trực tiếp và an toàn giữa ứng dụng ngân hàng của quý khách và tài khoản định danh xưởng qua mã QR tiêu chuẩn.",
          "Kinetic3D không bao giờ thu thập, yêu cầu hoặc lưu trữ mật khẩu, mã OTP hoặc thông tin bảo mật ngân hàng của khách hàng."
        ],
      },
      {
        heading: "4. Quyền Yêu Cầu Xóa Dữ Liệu",
        content: [
          "Quý khách có quyền yêu cầu xóa vĩnh viễn tệp thiết kế và thông tin cá nhân khỏi hệ thống máy chủ của chúng tôi sau khi đơn hàng hoàn tất bằng cách gửi email về privacy@kinetic3d.vn."
        ],
      },
    ],
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    notFound();
  }

  const IconComponent = policy.icon;

  const policyNav = [
    { slug: "terms", label: "Điều khoản dịch vụ" },
    { slug: "refund", label: "Chính sách đổi trả & bảo hành" },
    { slug: "shipping", label: "Vận chuyển & đóng gói" },
    { slug: "privacy", label: "Bảo mật thông tin & CAD" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative z-10 transition-colors" style={{ color: "var(--c-white)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono mb-8 hover:underline"
          style={{ color: "var(--c-lime)" }}
        >
          <ArrowLeft size={14} /> Quay lại trang chủ
        </Link>

        {/* Policy Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b" style={{ borderColor: "var(--c-white-10)" }}>
          {policyNav.map((item) => {
            const isActive = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/policies/${item.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-[var(--c-lime)] text-[var(--c-bg-deep)] border-[var(--c-lime)] font-extrabold"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
                style={{ color: isActive ? "#000000" : "var(--c-white)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Document Header */}
        <div 
          className="p-8 rounded-3xl border mb-10 transition-colors"
          style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)" }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border"
              style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-lime-30)", color: "var(--c-lime)" }}
            >
              <IconComponent size={24} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">CHÍNH SÁCH CHÍNH THỨC</span>
              <p className="text-xs font-mono" style={{ color: "var(--c-white-50)" }}>
                Hiệu lực từ ngày: {policy.effectiveDate} • Phiên bản 2.4
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {policy.title}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--c-white-70)" }}>
            {policy.subtitle}
          </p>
        </div>

        {/* Document Body Sections */}
        <div className="space-y-8">
          {policy.sections.map((sec, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border transition-colors"
              style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-10)" }}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--c-white)" }}>
                <CheckCircle size={18} className="text-[var(--c-lime)] shrink-0" />
                <span>{sec.heading}</span>
              </h2>
              <div className="space-y-3">
                {sec.content.map((p, pIdx) => (
                  <p 
                    key={pIdx}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--c-white-80)" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support Footer Box */}
        <div 
          className="mt-12 p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          style={{ backgroundColor: "var(--c-bg-deep)", borderColor: "var(--c-white-15)" }}
        >
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--c-white)" }}>Bạn cần hỗ trợ thêm về chính sách hoặc kỹ thuật in?</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--c-white-50)" }}>Đội ngũ kỹ sư xưởng Kinetic3D sẵn sàng hỗ trợ 24/7 qua hotline và Zalo.</p>
          </div>
          <a
            href="tel:0988888888"
            className="px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--c-lime)", color: "var(--c-bg-deep)" }}
          >
            Hotline: 0988.888.888
          </a>
        </div>
      </div>
    </div>
  );
}
