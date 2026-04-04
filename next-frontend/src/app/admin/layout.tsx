"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
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
    router.push("/");
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

  const getNavLinkClass = (href: string) => {
    return pathname === href 
      ? `${styles.navLink} ${styles.active}` 
      : styles.navLink;
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Funko Admin</h2>

        <nav className={styles.navMenu}>
          <Link href="/admin/products" className={getNavLinkClass("/admin/products")}>
            Products
          </Link>
          <Link href="/admin/orders" className={getNavLinkClass("/admin/orders")}>
            Orders
          </Link>
          <Link href="/admin/promocodes" className={getNavLinkClass("/admin/promocodes")}>
            Promo Codes
          </Link>
        </nav>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout & Exit
        </button>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}