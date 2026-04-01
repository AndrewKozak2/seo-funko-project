import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
import { useAuthStore } from "../../store/authStore";
import styles from "./Header.module.css";

interface HeaderProps {
  cartItemsCount: number;
  onOpenCart: () => void;
}

export function Header({ cartItemsCount, onOpenCart }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allCollections, setAllCollections] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || "",
  );
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (localSearch.trim()) {
      navigate(`/?search=${localSearch}`);
    } else {
      navigate(`/`);
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
    navigate(`/?search=${collection}`);
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
          <a className={styles.logoLink} href="/">
            <h1 className={styles.logo}>
              <span className={styles.brandAccent}>Funko</span> Pop Store
            </h1>
          </a>

          <nav className={styles.navigation}>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
            <Link to="/#figures" className={styles.navLink}>
              Figures
            </Link>
            <Link
              to="/exclusives"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Exclusives
            </Link>
            <Link
              to="/offers"
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
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
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/#figures" onClick={() => setIsMobileMenuOpen(false)}>
                Figures
              </Link>
              <Link to="/exclusives" onClick={() => setIsMobileMenuOpen(false)}>
                Exclusives
              </Link>
              <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)}>
                Offers
              </Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                Wishlist
              </Link>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={styles.mobileLogoutBtn}
                >
                  Logout ({user.name})
                </button>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
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
                onChange={handleSearchChange}
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
                      {popularSearches.length > 0 && (
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
                      )}
                    </>
                  ) : (
                    <div className={styles.searchResults}>
                      <h4 className={styles.dropdownTitle}>PRODUCTS</h4>
                      {searchResults.length > 0 ? (
                        <div className={styles.resultItemsWrapper}>
                          {searchResults.map((product) => (
                            <Link
                              to={`/product/${product.id}`}
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

            <Link to="/wishlist" className={styles.actionBtn}>
              <Heart size={24} className={styles.actionIcon} />
            </Link>
            <div className={styles.authContainer}>
              {user ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={styles.actionBtn}
                      title="Admin Dashboard"
                    >
                      <Settings size={24} color="#ff8a00" />
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={styles.actionBtn}
                    title="My Account"
                  >
                    <span className={styles.userName}>{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className={styles.actionBtn}
                    title="Logout"
                  >
                    <LogOut size={24} className={styles.actionIconLogout} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className={styles.actionBtn} title="Login">
                  <User size={24} className={styles.actionIcon} />
                </Link>
              )}
            </div>
            <div>
              <button className={styles.actionBtn} onClick={onOpenCart}>
                <ShoppingCart size={24} className={styles.actionIcon} />
                {cartItemsCount > 0 && (
                  <span className={styles.badge}>{cartItemsCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
