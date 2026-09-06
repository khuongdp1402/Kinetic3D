import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // unique cart item id (can be productId + variants stringified)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customText: string;
  image?: string;
  variants: {
    color: string;
    size: string;
    material?: string;
    finish?: string;
    [key: string]: string | undefined;
  };
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "kinetic3d-cart",
    }
  )
);
