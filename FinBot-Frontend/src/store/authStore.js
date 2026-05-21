import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../lib/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // LOGIN
      login: (userData, token) => {
        set({ user: userData, token, isAuthenticated: true });
      },

      // LOGOUT
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("finbot-auth");
      },

      // Updates User Data in background
      refreshUser: async () => {
        try {
          const currentToken = get().token; 
          
          if (!currentToken) return;

          const res = await api.get("/profile/view");

          // Update User so that the sidebar telegram linked status could be green 
          set({ user: res.data.data });
          
        } catch (err) {
          console.error("refreshUser failed:", err.message);
        }
      },
    }),
    {
      name: "finbot-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);