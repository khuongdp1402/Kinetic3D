import { create } from "zustand";
import { persist } from "zustand/middleware";

type Currency = "VND" | "USD";
type Language = "vi" | "en";

interface AppState {
  isAuthModalOpen: boolean;
  isSubscriptionModalOpen: boolean;
  language: Language;
  currency: Currency;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: Currency) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthModalOpen: false,
      isSubscriptionModalOpen: false,
      language: "vi", // Default to Vietnamese
      currency: "VND", // Default to VND
      
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      
      openSubscriptionModal: () => set({ isSubscriptionModalOpen: true }),
      closeSubscriptionModal: () => set({ isSubscriptionModalOpen: false }),
      
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "kinetic3d-app-settings",
      partialize: (state) => ({ language: state.language, currency: state.currency }), // Only persist lang and currency
    }
  )
);
