"use client"; // 1. ГОВОРИМО NEXT.JS, ЩО ЦЕ КЛІЄНТСЬКИЙ КОМПОНЕНТ

import { useEffect, useMemo } from "react";
// 2. ОНОВЛЕННЯ ШЛЯХІВ: Використовуємо аліаси @
import { BundleCard } from "@/components/BundleCard/BundleCard";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { Tag } from "lucide-react";
import styles from "./Offers.module.css";

export default function OffersPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { products, fetchProducts, isLoading } = useProductStore();

  // 3. ФЕТЧИНГ: Залишаємо клієнтським, як було в оригіналі
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Фільтруємо лише бандли (комбо-пропозиції)
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

      {/* 4. ЗАМІНА: Використовуємо global .product-grid для уніфікації */}
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
          <h3 style={{ color: "#94a3b8" }}>No offers available right now.</h3>
        )}
      </div>
    </div>
  );
}
