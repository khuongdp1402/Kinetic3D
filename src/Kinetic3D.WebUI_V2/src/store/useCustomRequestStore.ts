// @deprecated Custom requests now go through customRequestsApi (lib/api.ts) + real backend storage.
// This localStorage-only store is no longer wired into any page — kept in case something still imports it.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CustomRequestStatus =
  | "pending_review" // Chờ duyệt
  | "quoted" // Đã báo giá, chờ khách xác nhận
  | "confirmed" // Khách đã xác nhận sản xuất
  | "rejected"; // Từ chối

export interface CustomRequest {
  id: string;
  createdAt: string;
  referenceImage: string; // data URL of the uploaded photo
  sketchPreview: string | null; // data URL of the generated 2D edge-detect sketch
  description: string;
  status: CustomRequestStatus;
  quotedPrice: number | null;
  adminNote: string | null;
  customerEmail: string | null;
}

interface CustomRequestState {
  requests: CustomRequest[];
  addRequest: (req: Omit<CustomRequest, "id" | "createdAt" | "status" | "quotedPrice" | "adminNote">) => string;
  setQuote: (id: string, price: number, note?: string) => void;
  confirmProduction: (id: string) => void;
  reject: (id: string, note?: string) => void;
  getRequestById: (id: string) => CustomRequest | undefined;
}

export const useCustomRequestStore = create<CustomRequestState>()(
  persist(
    (set, get) => ({
      requests: [],
      addRequest: (req) => {
        const id = `CR-${Date.now()}`;
        const newRequest: CustomRequest = {
          ...req,
          id,
          createdAt: new Date().toISOString(),
          status: "pending_review",
          quotedPrice: null,
          adminNote: null,
        };
        set((state) => ({ requests: [newRequest, ...state.requests] }));
        return id;
      },
      setQuote: (id, price, note) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, status: "quoted", quotedPrice: price, adminNote: note ?? r.adminNote } : r
          ),
        })),
      confirmProduction: (id) =>
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r)),
        })),
      reject: (id, note) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === id ? { ...r, status: "rejected", adminNote: note ?? r.adminNote } : r
          ),
        })),
      getRequestById: (id) => get().requests.find((r) => r.id === id),
    }),
    {
      name: "kinetic3d-custom-requests",
    }
  )
);
