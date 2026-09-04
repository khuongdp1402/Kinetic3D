import type { Metadata } from "next";
import { Be_Vietnam_Pro, Manrope, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  weight: ["500", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinetic3D — Xưởng Chế Tác & Thương Mại Điện Tử 3D Đa Màu",
  description: "Nền tảng thương mại điện tử 3D đột phá: In 3D đa màu AMS, công cụ AI biến ảnh 2D thành mô hình 3D và tùy biến sản phẩm tương tác thời gian thực.",
  keywords: ["In 3D đa màu", "AMS", "Kinetic3D", "AI 2D to 3D", "Custom 3D printing", "Resin SLA", "Figurine Mecha"],
  openGraph: {
    title: "Kinetic3D — Xưởng Chế Tác & Thương Mại Điện Tử 3D Đa Màu",
    description: "In 3D đa màu AMS, công nghệ AI 2D sang 3D và tùy biến sản phẩm 3D thời gian thực.",
    type: "website",
    locale: "vi_VN",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kinetic3d.vn/#organization",
      "name": "Kinetic3D",
      "url": "https://kinetic3d.vn",
      "logo": "https://kinetic3d.vn/favicon.ico",
      "description": "Nền tảng thương mại điện tử 3D và xưởng chế tác kỹ thuật số đa màu AMS theo yêu cầu.",
    },
    {
      "@type": "WebSite",
      "@id": "https://kinetic3d.vn/#website",
      "url": "https://kinetic3d.vn",
      "name": "Kinetic3D",
      "publisher": { "@id": "https://kinetic3d.vn/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://kinetic3d.vn/products?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "var(--c-bg)", color: "var(--c-white)" }}
      >
        <ThemeProvider>
          {children}

          {/* Google Translate Integration */}
          <script async src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
          <script dangerouslySetInnerHTML={{ __html: "function googleTranslateElementInit() { new google.translate.TranslateElement({pageLanguage: 'vi', includedLanguages: 'en,vi', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google_translate_element'); }" }} />

          <div id="google_translate_element" style={{display: "none"}}></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
