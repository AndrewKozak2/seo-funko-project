"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Hero } from "@/components/Hero/Hero";
import { Filters } from "@/components/Filters/Filters";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { Newsletter } from "@/components/Newsletter/Newsletter";
import { useCartStore } from "@/store/cartStore";
import { useProductStore } from "@/store/productStore";
import { useShop } from "@/hooks/useShop";
import styles from "./Shop.module.css";

export default function ShopPage() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { fetchProducts, isLoading, error } = useProductStore();

  const { products, totalCount, visibleCount, filters, actions } = useShop();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <h2>Loading products from Server...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <h2>Error: {error}</h2>
        <p>Make sure the server is running on port 5000</p>
      </div>
    );
  }

  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div className="container">
        <div className="shop-layout">
          <aside className={styles.stickySidebar}>
            <Filters
              selectedCollection={filters.selectedCollections}
              priceRange={filters.priceRange}
              onPriceChange={actions.handlePriceChange}
              onCollectionChange={actions.handleCollectionChange}
            />
          </aside>

          <div className={styles.mainContent} id="figures">
            <div className={styles.productsHeader}>
              <div className={styles.resultsHeaderWrapper}>
                <span>
                  {filters.searchQuery
                    ? `Search Results for "${filters.searchQuery}" (${totalCount} items)`
                    : `Found: ${totalCount} items`}
                </span>
                {filters.searchQuery && (
                  <button
                    className={styles.clearSearchBtn}
                    onClick={actions.resetFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className={styles.sortContainer}>
                <label htmlFor="sort-select">Sort by: </label>
                <select
                  id="sort-select"
                  value={filters.sortParam}
                  onChange={(e) => actions.handleSortChange(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>

            {totalCount > 0 ? (
              <>
                <main className="product-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </main>
                {visibleCount < totalCount && (
                  <div className={styles.loadMoreContainer}>
                    <button
                      className={styles.loadMoreBtn}
                      onClick={actions.loadMore}
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noResults}>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button
                  className={styles.resetBtn}
                  onClick={actions.resetFilters}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Newsletter />
    </>
  );
}
