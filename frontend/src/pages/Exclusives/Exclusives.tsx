import { useEffect, useMemo } from "react";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { useProductStore } from "../../store/productStore";
import { useCartStore } from "../../store/cartStore";
import { Crown } from "lucide-react";
import styles from "./Exclusives.module.css";

export function Exclusives() {
  const addToCart = useCartStore((state) => state.addToCart);

  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const exclusiveProducts = useMemo(() => {
    return products.filter((product) => product.isExclusive === true);
  }, [products]);

  if (isLoading) {
    return (
      <div
        className="container"
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <h2>Loading Exclusives...</h2>
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: "40px 20px 100px 20px" }}>
      <div className={styles.banner}>
        <Crown size={40} className={styles.icon} />
        <h1 className={styles.pageTitle}>Exclusive Figures</h1>
      </div>
      {exclusiveProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Oops! All exclusives are sold out!</h2>
          <p>Check back later for new rare drops.</p>
        </div>
      ) : (
        <div className="product-grid" style={{ justifyContent: "center" }}>
          {exclusiveProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
