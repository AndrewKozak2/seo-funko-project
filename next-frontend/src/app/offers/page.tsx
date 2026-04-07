"use client";

import { useEffect, useMemo } from "react";
import { BundleCard } from "@/components/BundleCard/BundleCard";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { Tag } from "lucide-react";
import styles from "./Offers.module.css";

export default function OffersPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const bundles = useMemo(() => {
    return products.filter((item) => item.isBundle === true);
  }, [products]);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <h2>Loading Bundles...</h2>
      </div>
    );
  }

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.header}>
        <Tag size={40} color="#ff8a00" />
        <h1 className={styles.title}>Special Offers & Bundles</h1>
      </div>
      <div className={`product-grid ${styles.centeredGrid}`}>
        {bundles.length > 0 ? (
          bundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onAddToCart={addToCart}
            />
          ))
        ) : (
          <div className={styles.loadingWrapper}>
            <h2>No offers available right now.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
