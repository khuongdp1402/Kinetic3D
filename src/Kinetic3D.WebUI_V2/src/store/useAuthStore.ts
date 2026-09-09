import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role?: string;
  tier?: "Free" | "Starter" | "Pro" | "Max" | "Team";
  credits?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateCredits: (credits: number) => void;
  addCredits: (amount: number) => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token, user) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      updateCredits: (credits) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits } : null,
        })),
      addCredits: (amount) =>
        set((state) => ({
          user: state.user ? { ...state.user, credits: (state.user.credits || 0) + amount } : null,
        })),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "kinetic3d-auth",
    }
  )
);
