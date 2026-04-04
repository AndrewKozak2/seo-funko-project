import { useEffect } from "react";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import styles from "./Cart.module.css";

interface CartProps {
  isOpen: boolean;
  onCloseCart: () => void;
}

export function Cart({ isOpen, onCloseCart }: CartProps) {
  const cartItems = useCartStore((state) => state.cart);
  const onRemoveItem = useCartStore((state) => state.removeFromCart);
  const onIncreaseQuantity = useCartStore((state) => state.increaseQuantity);
  const onDecreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const navigate = useNavigate();
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCloseCart]);
  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onCloseCart}
      />
      <div
        className={`${styles.container} ${isOpen ? styles.containerOpen : ""}`}
      >
        <div className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={24} />
            <h2>Cart</h2>
          </div>
          <button className={styles.closeButton} onClick={onCloseCart}>
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
                onCloseCart();
                navigate("/checkout");
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
