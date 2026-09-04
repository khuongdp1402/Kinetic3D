"use client";

import { motion, Variants } from "framer-motion";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen pt-16 relative z-10 overflow-hidden" style={{ color: "var(--c-white)" }}>
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[120px] pointer-events-none -z-10" style={{ backgroundColor: "var(--c-lime-05)" }} />

      {/* Hero */}
      <div className="py-20 px-6" style={{ borderBottom: "1px solid var(--c-white-10)" }}>
        <motion.div
          className="max-w-[var(--container-max)] mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="text-xs uppercase tracking-[0.2em] block mb-3"
            style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
          >
            Về chúng tôi
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold tracking-[-0.04em] mb-6 max-w-3xl"
            style={{ color: "var(--c-white)" }}
          >
            Chúng tôi hiện thực hoá{" "}
            <span style={{ color: "var(--c-orange)" }}>những ý tưởng khó nhất</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--c-white-50)" }}
          >
            Kinetic3D là nền tảng in 3D cá nhân hoá, biến bản thiết kế số thành vật thể
            thật với độ chính xác dưới 10 micron. Từ linh kiện kỹ thuật đến tượng lưu niệm
            — nếu thiết kế được, chúng tôi in được.
          </motion.p>
        </motion.div>
      </div>

      {/* Values */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            {
              number: "01",
              title: "Độ chính xác",
              desc: "Độ phân giải lớp in dưới 10 micron trên 12 loại chất liệu. Mọi bề mặt đều được kỹ thuật hoá, không phải áng chừng.",
            },
            {
              number: "02",
              title: "Tốc độ",
              desc: "Thời gian xử lý trung bình dưới 48 giờ. Báo giá tức thời, không cần chờ đợi.",
            },
            {
              number: "03",
              title: "Quy mô",
              desc: "Từ một mẫu thử nghiệm đến hàng nghìn sản phẩm sản xuất. Năng lực của chúng tôi mở rộng theo tham vọng của bạn.",
            },
          ].map((item) => (
            <motion.div
              key={item.number}
              variants={itemVariants}
              className="p-8 relative group overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                border: "1px solid var(--c-white-10)",
                backgroundColor: "var(--c-bg-card)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--c-lime-50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--c-white-10)";
              }}
            >
              <span
                className="text-xs block mb-4 relative z-10"
                style={{ color: "var(--c-lime)", fontFamily: "var(--font-mono)" }}
              >
                {item.number} //
              </span>
              <h3 className="text-xl font-bold tracking-[-0.02em] mb-3 relative z-10" style={{ color: "var(--c-white)" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: "var(--c-white-50)" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Contact */}
      <div className="px-6 py-20 relative" style={{ borderTop: "1px solid var(--c-white-10)" }}>
        <motion.div
          className="max-w-[var(--container-max)] mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-4" style={{ color: "var(--c-white)" }}>
            Liên hệ với chúng tôi
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--c-white-50)", fontFamily: "var(--font-mono)" }}>
            Sẵn sàng bắt đầu dự án của bạn? Chúng tôi phản hồi trong vòng 4 giờ.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="mailto:hello@kinetic3d.io"
              className="link-hover text-sm uppercase tracking-[0.15em] transition-colors"
              style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-orange)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-80)")}
            >
              hello@kinetic3d.io
            </a>
            <a
              href="tel:+84900000000"
              className="link-hover text-sm uppercase tracking-[0.15em] transition-colors"
              style={{ color: "var(--c-white-80)", fontFamily: "var(--font-mono)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--c-orange)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--c-white-80)")}
            >
              +84 (0) 90 000 0000
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
