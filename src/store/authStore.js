import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      //login action
      login: (userData, token) => {
        set({ user: userData, token: token, isAuthenticated: true });
      },

      //Logout Action
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("finbot-auth"); // cleanup
      },
    }),
    {
      name: "finbot-auth", // saves in LocalStorage with this name 
      storage: createJSONStorage(() => localStorage),
    }
  )
);