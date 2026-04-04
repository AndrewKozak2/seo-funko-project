"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import styles from "./Cart.module.css";

// 1. ПРИБИРАЄМО INTERFACE PROPS — тепер ми незалежні!
export function Cart() {
  // 2. БЕРЕМО СТАН ВІДКРИТТЯ ТА ФУНКЦІЮ ЗАКРИТТЯ ЗІ СТОРУ
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  const cartItems = useCartStore((state) => state.cart);
  const onRemoveItem = useCartStore((state) => state.removeFromCart);
  const onIncreaseQuantity = useCartStore((state) => state.increaseQuantity);
  const onDecreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const router = useRouter();

  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  // Блокування скролу
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  // Закриття по Escape
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false); // Використовуємо функцію зі стору
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  // Якщо кошик закритий, ми все одно рендеримо верстку,
  // бо анімація в CSS (styles.containerOpen) зазвичай на це розрахована.
  // Але якщо анімації немає, можна просто робити return null якщо !isCartOpen.

  return (
    <>
      <div
        className={`${styles.overlay} ${isCartOpen ? styles.overlayOpen : ""}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div
        className={`${styles.container} ${isCartOpen ? styles.containerOpen : ""}`}
      >
        <div className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={24} />
            <h2>Cart</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={() => setIsCartOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <ul className={styles.cartList}>
          {cartItems.length === 0 && (
            <div className={styles.emptyState}>
              <ShoppingBag size={48} opacity={0.2} />
              <p>Your cart is empty...</p>
            </div>
          )}

          {cartItems.map((item) => (
            <li key={item.product.id} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{item.product.title}</span>
                <span className={styles.itemPrice}>${item.product.price}</span>
              </div>

              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityButton}
                  onClick={() => onDecreaseQuantity(item.product.id)}
                >
                  <Minus size={16} />
                </button>

                <span className={styles.quantityText}>{item.quantity}</span>

                <button
                  className={styles.quantityButton}
                  onClick={() => onIncreaseQuantity(item.product.id)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => onRemoveItem(item.product.id)}
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>

            <button
              className={styles.checkoutButton}
              onClick={() => {
                setIsCartOpen(false);
                router.push("/checkout");
              }}
            >
              <CreditCard size={20} />
              Go to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
