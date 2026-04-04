import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type CartItem, type FunkoPop } from "../types/product";

interface CartState {
  cart: CartItem[];
  // 1. Додаємо стан для модалки
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  addToCart: (product: FunkoPop) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      // 2. Початковий стан — закрито
      isCartOpen: false,
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id,
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          // При додаванні товару можна автоматично відкривати кошик:
          return {
            cart: [...state.cart, { product, quantity: 1 }],
          };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),

      increaseQuantity: (productId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        })),

      decreaseQuantity: (productId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item,
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "funko-cart-storage",
      // 3. ФІШКА: Зберігаємо в localStorage ТІЛЬКИ масив cart.
      // Стан isCartOpen не зберігаємо, щоб він завжди був false при старті.
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);
