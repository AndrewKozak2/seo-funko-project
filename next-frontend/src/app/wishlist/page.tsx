"use client";
import Link from "next/link";
import { Trash2, HeartOff } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "@/components/ProductCard/ProductCard";

import styles from "./Wishlist.module.css";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleClearAll = () => {
    if (window.confirm("Are you sure want to clear your wishlist?")) {
      clearWishlist();
      toast.success("Wishlist cleared");
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ paddingTop: "100px" }}>
        <div className={styles.emptyState}>
          <HeartOff size={64} color="#334155" />
          <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
          <p>Seems like you haven't found your favorite Funkos yet</p>
          <Link href="/" className={styles.backLink}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "100px 20px 100px 20px" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          My Wishlist{" "}
          <span className={styles.countBadge}>{wishlist.length}</span>
        </h1>
        <button onClick={handleClearAll} className={styles.clearBtn}>
          <Trash2 size={18} />
          Clear All
        </button>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}