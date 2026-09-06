"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, Zap, Printer } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    category: "Công Nghệ & Kỹ Thuật",
    question: "Kinetic3D là gì và khác biệt gì so với các dịch vụ in 3D truyền thống?",
    answer: "Kinetic3D là nền tảng thương mại điện tử 3D và xưởng chế tác kỹ thuật số đột phá tại Việt Nam. Điểm khác biệt cốt lõi là sự kết hợp giữa: hệ thống in đa màu tự động (AMS), công cụ AI tạo dựng mô hình 3D trong vài giây, và hệ thống thanh toán trực tuyến bảo mật, tức thì. Chúng tôi đảm bảo độ chính xác cơ khí cao với sai số dưới ±0.1mm cho FDM và độ mịn 19 micron cho SLA Resin.",
  },
  {
    category: "Công Nghệ & Kỹ Thuật",
    question: "Xưởng Kinetic3D hỗ trợ những loại vật liệu và quy cách in nào?",
    answer: "Chúng tôi hỗ trợ đa dạng vật liệu công nghiệp và nghệ thuật: PLA+ Matte cao cấp (chống lộ vân in), PETG chịu nhiệt và va đập cao, TPU dẻo đàn hồi, Nylon Carbon Fiber chịu lực kết cấu, và Resin SLA 12K siêu chi tiết. Khách hàng có thể tùy chọn in đơn sắc hoặc phối đa màu tự động lên đến 8 màu trên cùng một mô hình.",
  },
  {
    category: "Đặt Hàng & File Custom",
    question: "Tôi có thể tải file thiết kế 3D riêng của mình (STL, OBJ, STEP) lên để in không?",
    answer: "Hoàn toàn được. Bạn chỉ cần truy cập mục 'Custom 3D' trên thanh điều hướng, tải tệp STL, OBJ hoặc STEP lên. Hệ thống sẽ phân tích thể tích, trọng lượng nhựa, gợi ý hướng in tối ưu và báo giá tự động ngay lập tức theo thời gian thực.",
  },
  {
    category: "Thanh Toán & Vận Chuyển",
    question: "Kinetic3D hỗ trợ những phương thức thanh toán nào?",
    answer: "Kinetic3D hỗ trợ thanh toán trực tuyến thuận tiện qua Chuyển khoản ngân hàng (Quét mã QR 24/7 khớp lệnh tự động) và hình thức thanh toán khi nhận hàng (COD) áp dụng toàn quốc. Lệnh in sẽ được đưa vào hàng đợi sản xuất ngay khi hệ thống xác nhận thanh toán.",
  },
  {
    category: "Thanh Toán & Vận Chuyển",
    question: "Thời gian in 3D và giao hàng mất bao lâu?",
    answer: "Thời gian in trung bình từ 12 đến 36 giờ tùy thể tích mô hình. Đơn hàng nội thành Hà Nội và TP. Hồ Chí Minh được giao trong vòng 24 giờ sau khi hoàn thiện in (có hỗ trợ hỏa tốc 2h). Các tỉnh thành khác trên toàn quốc nhận hàng từ 48 đến 72 giờ qua dịch vụ chuyển phát nhanh có đồng kiểm.",
  },
  {
    category: "Bảo Hành & Đổi Trả",
    question: "Chính sách bảo hành và cam kết chất lượng của Kinetic3D như thế nào?",
    answer: "Kinetic3D cam kết chính sách bảo hành in lại miễn phí 100% nếu sản phẩm bị gãy vỡ do vận chuyển, sai lệch kích thước vượt ngưỡng dung sai công bố (> 0.25mm), hoặc bị lỗi tách lớp bề mặt. Quý khách được quyền đồng kiểm khi nhận hàng và thông báo hỗ trợ trong vòng 7 ngày.",
  },
  {
    category: "Gói Pro & Bảng Giá",
    question: "Gói thành viên Pro Workshop mang lại những quyền lợi gì?",
    answer: "Thành viên Pro Workshop (199.000₫/tháng hoặc 165.000₫/tháng khi trả theo năm) được cấp 500 Credits AI tạo mẫu hàng tháng, không giới hạn quyền xuất và tải file STL/GLB/OBJ chất lượng cao, ưu tiên hàng đợi in tốc độ cao và mở khóa tính năng in đa màu AMS nâng cao.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data Schema for Answer Engine Optimization (AEO)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 relative z-10 transition-colors" style={{ backgroundColor: "var(--c-bg)" }}>
      {/* Schema.org FAQPage for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono mb-4 border"
            style={{ backgroundColor: "var(--c-bg-card)", borderColor: "var(--c-white-15)", color: "var(--c-lime)" }}
          >
            <HelpCircle size={14} />
            <span>AEO KNOWLEDGE BASE & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--c-white)" }}>
            Câu Hỏi Thường Gặp Về Xưởng In 3D
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--c-white-60)" }}>
            Mọi thông tin chi tiết về công nghệ in AMS, quy trình AI Mesh, thanh toán tự động và cam kết bảo hành kỹ thuật tại Kinetic3D.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border transition-all duration-200 overflow-hidden"
                style={{
                  backgroundColor: "var(--c-bg-card)",
                  borderColor: isOpen ? "var(--c-lime-30)" : "var(--c-white-10)",
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0"
                      style={{
                        backgroundColor: isOpen ? "var(--c-lime)" : "var(--c-bg-deep)",
                        color: isOpen ? "#000000" : "var(--c-white-60)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm sm:text-base" style={{ color: isOpen ? "var(--c-lime)" : "var(--c-white)" }}>
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[var(--c-lime)]" : "text-neutral-400"}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t" style={{ borderColor: "var(--c-white-05)" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--c-white-80)" }}>
                      {item.answer}
                    </p>
                    {item.category && (
                      <span className="inline-block mt-3 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: "var(--c-white-50)" }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
