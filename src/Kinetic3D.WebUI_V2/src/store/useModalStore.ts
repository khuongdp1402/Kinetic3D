import { create } from "zustand";

export interface PreviewProduct {
  id: string;
  name: string;
  creator: string;
  tags: string[];
  likes: number;
  image: string;
  glbUrl: string;
  prompt: string;
  price: number;
}

interface ModalState {
  isOpen: boolean;
  product: PreviewProduct | null;
  openModal: (product: PreviewProduct) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  product: null,
  openModal: (product) => set({ isOpen: true, product }),
  closeModal: () => set({ isOpen: false, product: null }),
}));
