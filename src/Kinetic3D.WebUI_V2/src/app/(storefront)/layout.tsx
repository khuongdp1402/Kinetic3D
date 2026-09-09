import Header from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { CreditTopupModal } from "@/components/billing/CreditTopupModal";
import { ComingSoonModal } from "@/components/storefront/ComingSoonModal";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <SmoothScrollProvider>
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
      
      {/* Global Modals */}
      <AuthModal />
      <CreditTopupModal />
      <ComingSoonModal />
    </>
  );
}
