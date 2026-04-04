import { create } from "zustand";
// 1. ІМПОРТ: Middleware для автоматичного збереження
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // Початковий стан завжди null
      token: null,

      login: (user, token) => {
        // Тобі більше не треба писати localStorage.setItem вручну!
        set({ user, token });
      },

      logout: () => {
        // Тобі більше не треба писати localStorage.removeItem вручну!
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // Унікальний ключ у localStorage
      storage: createJSONStorage(() => localStorage), // Вказуємо, де зберігати
    }
  )
);