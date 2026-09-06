import { create } from "zustand";
import { persist } from "zustand/middleware";

type Currency = "VND" | "USD";
type Language = "vi" | "en";

interface AppState {
  isAuthModalOpen: boolean;
  isCreditModalOpen: boolean;
  isSubscriptionModalOpen: boolean;
  selectedPackageId: string | null;
  language: Language;
  currency: Currency;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  
  openCreditModal: (packageId?: string) => void;
  closeCreditModal: () => void;
  
  openSubscriptionModal: (packageId?: string) => void;
  closeSubscriptionModal: () => void;
  
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthModalOpen: false,
      isCreditModalOpen: false,
      isSubscriptionModalOpen: false,
      selectedPackageId: null,
      language: "vi", // Default to Vietnamese
      currency: "VND", // Default to VND
      
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      
      openCreditModal: (packageId) =>
        set({
          isCreditModalOpen: true,
          isSubscriptionModalOpen: true,
          selectedPackageId: packageId || null,
        }),
      closeCreditModal: () =>
        set({
          isCreditModalOpen: false,
          isSubscriptionModalOpen: false,
          selectedPackageId: null,
        }),
      
      openSubscriptionModal: (packageId) =>
        set({
          isCreditModalOpen: true,
          isSubscriptionModalOpen: true,
          selectedPackageId: packageId || null,
        }),
      closeSubscriptionModal: () =>
        set({
          isCreditModalOpen: false,
          isSubscriptionModalOpen: false,
          selectedPackageId: null,
        }),
      
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "kinetic3d-app-settings",
      partialize: (state) => ({ language: state.language, currency: state.currency }), // Only persist lang and currency
    }
  )
);
