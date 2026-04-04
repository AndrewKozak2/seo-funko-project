"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import styles from "./Header.module.css";

// 1. ПРИБИРАЄМО INTERFACE PROPS — вони нам більше не потрібні
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allCollections, setAllCollections] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || "",
  );

  const { user, logout } = useAuthStore();

  // 2. БЕРЕМО ДАНІ КОШИКА ПРЯМО ТУТ
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Додай у свій cartStore метод setIsCartOpen(true), якщо його ще немає
  // Або використовуй те, що в тебе відповідає за відкриття модалки
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  // Рахуємо кількість товарів
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/products`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setAllProducts(data);
        const uniqueCollections = Array.from(
          new Set(data.map((item: any) => item.collection)),
        );
        setAllCollections(uniqueCollections as string[]);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (isSearchFocused && allCollections.length > 0) {
      const shuffled = [...allCollections].sort(() => 0.5 - Math.random());
      setPopularSearches(shuffled.slice(0, 3));
    }
  }, [isSearchFocused, allCollections]);

  const handleSearchSubmit = () => {
    if (localSearch.trim()) {
      router.push(`/?search=${localSearch}`);
    } else {
      router.push(`/`);
    }
    setIsSearchFocused(false);
    setLocalSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
      e.currentTarget.blur();
    }
  };

  const handlePopularClick = (collection: string) => {
    setLocalSearch(collection);
    router.push(`/?search=${collection}`);
    setIsSearchFocused(false);
    setLocalSearch("");
  };

  useEffect(() => {
    if (isMobileMenuOpen || isSearchFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isSearchFocused]);

  const searchResults = allProducts
    .filter((product) => {
      const titleMatch = product.title
        ?.toLowerCase()
        .includes(localSearch.toLowerCase());
      const collectionMatch = product.collection
        ?.toLowerCase()
        .includes(localSearch.toLowerCase());
      return titleMatch || collectionMatch;
    })
    .slice(0, 4);

  return (
    <header className={styles.headerWrapper}>
      <div className="container">
        <div className={styles.headerContent}>
          <Link className={styles.logoLink} href="/">
            <h1 className={styles.logo}>
              <span className={styles.brandAccent}>Funko</span> Pop Store
            </h1>
          </Link>

          <nav className={styles.navigation}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/#figures" className={styles.navLink}>
              Figures
            </Link>
            <Link href="/exclusives" className={styles.navLink}>
              Exclusives
            </Link>
            <Link href="/offers" className={styles.navLink}>
              Offers
            </Link>
          </nav>

          <button
            className={`${styles.burgerBtn} ${isMobileMenuOpen ? styles.burgerBtnOpen : ""}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {isMobileMenuOpen && (
            <nav className={styles.mobileNav}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/#figures" onClick={() => setIsMobileMenuOpen(false)}>
                Figures
              </Link>
              <Link
                href="/exclusives"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exclusives
              </Link>
              <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)}>
                Offers
              </Link>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                Wishlist
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    clearCart();
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={styles.mobileLogoutBtn}
                >
                  Logout ({user.name})
                </button>
              ) : (
                <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </nav>
          )}

          <div className={styles.actions}>
            {isSearchFocused && (
              <div
                className={styles.searchOverlay}
                onClick={() => setIsSearchFocused(false)}
              />
            )}
            <div
              className={`${styles.searchContainer} ${isSearchFocused ? styles.searchContainerActive : ""}`}
            >
              <input
                type="text"
                placeholder="Search figures..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                className={styles.searchInput}
              />
              <Search
                size={20}
                className={styles.searchIcon}
                onClick={handleSearchSubmit}
                style={{ cursor: "pointer" }}
              />
              {isSearchFocused && (
                <div className={styles.searchDropdown}>
                  {!localSearch ? (
                    <>
                      <h4 className={styles.dropdownTitle}>POPULAR SEARCHES</h4>
                      <ul className={styles.popularList}>
                        {popularSearches.map((collection) => (
                          <li
                            key={collection}
                            className={styles.popularItem}
                            onClick={() => handlePopularClick(collection)}
                          >
                            {collection}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className={styles.searchResults}>
                      <h4 className={styles.dropdownTitle}>PRODUCTS</h4>
                      {searchResults.length > 0 ? (
                        <div className={styles.resultItemsWrapper}>
                          {searchResults.map((product) => (
                            <Link
                              href={`/product/${product.id}`}
                              key={product.id}
                              className={styles.searchResultItem}
                              onClick={() => {
                                setIsSearchFocused(false);
                                setLocalSearch("");
                              }}
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className={styles.searchResultImg}
                              />
                              <div className={styles.searchResultInfo}>
                                <span className={styles.searchResultTitle}>
                                  {product.title}
                                </span>
                                <span className={styles.searchResultPrice}>
                                  ${product.price}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className={styles.noResults}>
                          No figures found for "{localSearch}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/wishlist" className={styles.actionBtn}>
              <Heart size={24} className={styles.actionIcon} />
            </Link>

            <div className={styles.authContainer}>
              {user ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={styles.actionBtn}
                      title="Admin Dashboard"
                    >
                      <Settings size={24} color="#ff8a00" />
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className={styles.actionBtn}
                    title="My Account"
                  >
                    <span className={styles.userName}>{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      clearCart();
                      logout();
                    }}
                    className={styles.actionBtn}
                    title="Logout"
                  >
                    <LogOut size={24} className={styles.actionIconLogout} />
                  </button>
                </div>
              ) : (
                <Link href="/auth" className={styles.actionBtn} title="Login">
                  <User size={24} className={styles.actionIcon} />
                </Link>
              )}
            </div>

            {/* 3. ОНОВЛЕНА КНОПКА: Виклич метод відкриття кошика зі свого стору */}
            <button
              className={styles.actionBtn}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={24} className={styles.actionIcon} />
              {cartItemsCount > 0 && (
                <span className={styles.badge}>{cartItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
