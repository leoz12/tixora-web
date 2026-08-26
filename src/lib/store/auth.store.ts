import { create } from "zustand";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// Auth tokens live only in httpOnly cookies now - not readable by JS, so
// there's nothing to read synchronously here. Initial hydration (asking the
// backend "am I logged in?" via GET /auth/me) happens in Providers/
// AuthHydrator instead, since that needs the API client and React Query.
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
