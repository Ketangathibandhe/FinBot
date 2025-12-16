import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({ // 'get' added so that current token can be accessed 
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

      //Updates User Data in background
      refreshUser: async () => {
        try {
          //get Token from store
          const currentToken = get().token; 
          
          if (!currentToken) return;

          const res = await axios.get(
            "http://localhost:5000/api/profile/view",
            { 
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${currentToken}` // imp to send token in Header 
              }
            }
          );

          //update User so that the sidebar telegram linked status could be green 
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