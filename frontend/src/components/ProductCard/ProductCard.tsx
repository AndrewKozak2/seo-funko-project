import { type FunkoPop } from "../../types/product";
import { useWishlistStore } from "../../store/wishlistStore";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: FunkoPop;
  onAddToCart: (product: FunkoPop) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const isLiked = wishlist.some((item) => item.id === product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromWishlist(product.id);
      toast.error("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };
  return (
    <div className={styles.card}>
      {product.isExclusive && <span className={styles.badge}>Exclusive</span>}
      <button
        className={`${styles.wishlistBtn} ${isLiked ? styles.active : ""}`}
        onClick={handleWishlistToggle}
      >
        <Heart size={20} fill={isLiked ? "#ff4d4d" : "none"} />
      </button>
      <Link to={`/product/${product.id}`} className={styles.imageContainer}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className={styles.image}
        />
      </Link>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.collection}>{product.collection}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price}</span>
          </div>

          <button
            onClick={() => {
              onAddToCart(product);
              toast.success("Product added to cart!");
            }}
            className={styles.button}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
