import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type FunkoPop } from "../types/product";

interface WishlistState {
  wishlist: FunkoPop[];
  addToWishlist: (product: FunkoPop) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      addToWishlist: (product) => {
        const currentProducts = get().wishlist;
        const isAlredyInWishlist = currentProducts.some(
          (item) => item.id === product.id,
        );
        if (isAlredyInWishlist) {
          return;
        }
        set({
          wishlist: [...currentProducts, product],
        });
      },
      removeFromWishlist: (productIdToRemove) => {
        const currentProducts = get().wishlist;
        const updateProducts = currentProducts.filter(
          (item) => item.id !== productIdToRemove,
        );
        set({ wishlist: updateProducts });
      },
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
