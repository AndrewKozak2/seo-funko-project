import { create } from "zustand";
import { type FunkoPop } from "@/types/product";

interface ProductState {
  products: FunkoPop[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
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
