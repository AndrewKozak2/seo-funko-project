import toast from "react-hot-toast";
import { type FunkoPop } from "../../types/product";
import styles from "./BundleCard.module.css";

interface BundleCardProps {
  bundle: FunkoPop;
  onAddToCart: (product: FunkoPop) => void;
}

export function BundleCard({ bundle, onAddToCart }: BundleCardProps) {
  return (
    <div className={styles.bundleCard}>
      <span className={styles.bundleBadge}>COMBO DEAL</span>
      <div className={styles.imagesContainer}>
        <img src={bundle.bundleImages?.[0]} alt="Figure 1" />
        <span className={styles.plusSign}>+</span>
        <img src={bundle.bundleImages?.[1]} alt="Figure 2" />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{bundle.title}</h3>
          <p className={styles.collection}>{bundle.collection}</p>
        </div>

        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.oldPrice}>${bundle.originalPrice}</span>
            <span className={styles.price}>${bundle.price}</span>
          </div>

          <button
            onClick={() => {
              onAddToCart(bundle);
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
