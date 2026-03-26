import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./AdminLayout.module.css";

export function AdminLayout() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("adminKey");
    if (savedKey) {
      verifyLogin(savedKey);
    }
  }, []);

  const verifyLogin = async (key: string) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
      });

      if (response.status === 403) {
        toast.error("Wrong password!");
        localStorage.removeItem("adminKey");
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) throw new Error("Failed to verify");

      setIsAuthenticated(true);
      localStorage.setItem("adminKey", key);
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyLogin(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setIsAuthenticated(false);
    setPassword("");
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginWrapper}>
        <form onSubmit={handleLogin} className={styles.loginBox}>
          <h2>Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Admin Key"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Funko Admin</h2>

        <nav className={styles.navMenu}>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/promocodes"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Promo Codes
          </NavLink>
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout & Exit
        </button>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
