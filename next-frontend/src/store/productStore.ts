import { create } from "zustand";
// Використовуємо аліас @/ для чистих імпортів
import { type FunkoPop } from "@/types/product";

interface ProductState {
  products: FunkoPop[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

// 1. ЗАМІНА: У Next.js використовуємо process.env замість import.meta.env
// Також додаємо фолбек (запасний варіант) на localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    // Починаємо завантаження — скидаємо старі помилки
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      // Оновлюємо стан: дані прийшли, завантаження закінчено
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: (error as Error).message,
        isLoading: false,
      });
    }
  },
}));
