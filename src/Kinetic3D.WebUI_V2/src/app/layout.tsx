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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kinetic3d.vn"),
  icons: {
    icon: [
      { url: "/brand/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/brand/icon.svg",
    shortcut: "/brand/icon.svg",
  },
  title: {
    default: "Kinetic3D — Xưởng Chế Tác & Thương Mại Điện Tử 3D Đa Màu",
    template: "%s | Kinetic3D",
  },
  description: "Nền tảng thương mại điện tử 3D và xưởng in 3D theo yêu cầu đột phá: Công nghệ AMS đa màu tự động, AI dựng mẫu 3D trong vài giây, thanh toán trực tuyến bảo mật tức thì.",
  keywords: [
    "In 3D đa màu",
    "AMS",
    "Kinetic3D",
    "AI 2D to 3D",
    "In 3D theo yêu cầu",
    "Resin SLA 12K",
    "Bambu Lab AMS",
    "Chế tác mô hình 3D",
    "In 3D giá rẻ",
    "Thanh toán trực tuyến",
  ],
  authors: [{ name: "Kinetic3D Engineering Team", url: "https://kinetic3d.vn" }],
  creator: "Kinetic3D",
  publisher: "Kinetic Technologies Vietnam Co., Ltd.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Kinetic3D — Xưởng Chế Tác & Thương Mại Điện Tử 3D Đa Màu",
    description: "In 3D đa màu AMS, công nghệ AI 2D sang 3D và tùy biến sản phẩm 3D thời gian thực.",
    url: "https://kinetic3d.vn",
    siteName: "Kinetic3D",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinetic3D — Xưởng Chế Tác & Thương Mại Điện Tử 3D Đa Màu",
    description: "In 3D đa màu AMS, công cụ AI 2D to 3D và xưởng in 3D công nghiệp theo yêu cầu.",
  },
  alternates: {
    canonical: "/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kinetic3d.vn/#organization",
      "name": "Kinetic3D",
      "legalName": "Kinetic Technologies Vietnam Co., Ltd.",
      "url": "https://kinetic3d.vn",
      "logo": "https://kinetic3d.vn/favicon.ico",
      "description": "Nền tảng thương mại điện tử 3D và xưởng chế tác kỹ thuật số đa màu AMS theo yêu cầu tại Việt Nam.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84988888888",
        "contactType": "customer service",
        "availableLanguage": ["Vietnamese", "English"],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://kinetic3d.vn/#localbusiness",
      "name": "Kinetic3D — Xưởng Chế Tác In 3D Đa Màu",
      "image": "https://kinetic3d.vn/favicon.ico",
      "telephone": "+84988888888",
      "email": "contact@kinetic3d.vn",
      "priceRange": "₫₫",
      "paymentAccepted": "Cash, Bank Transfer, QR Code",
      "currenciesAccepted": "VND",
      "openingHours": "Mo-Su 08:00-22:00",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Khu Công Nghệ Cao TP. Thủ Đức",
        "addressLocality": "TP. Hồ Chí Minh",
        "addressCountry": "VN",
      },
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
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script async defer src="https://accounts.google.com/gsi/client"></script>
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
