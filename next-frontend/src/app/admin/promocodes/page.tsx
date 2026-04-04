"use client"; // 1. ГОВОРИМО NEXT.JS, ЩО ЦЕ КЛІЄНТСЬКА СТОРІНКА

import { useState, useEffect } from "react";
import { CreatePromoModal } from "./CreatePromoModal"; // Лежить в цій же папці
import styles from "./AdminPromoCodes.module.css";
import toast from "react-hot-toast";

interface PromoCode {
  _id: string;
  code: string;
  discount: number;
  isActive: boolean;
}

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. ЗМІННА ОТОЧЕННЯ ДЛЯ NEXT.JS
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    try {
      const savedKey = localStorage.getItem("adminKey");

      const response = await fetch(`${apiUrl}/promocodes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey || "",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setPromoCodes(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load promo codes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this promo code?",
    );
    if (!isConfirmed) return;

    try {
      const savedKey = localStorage.getItem("adminKey");

      const response = await fetch(`${apiUrl}/promocodes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey || "",
        },
      });

      if (!response.ok) throw new Error("Failed to delete");

      setPromoCodes((prevCodes) =>
        prevCodes.filter((promo) => promo._id !== id),
      );
      toast.success("Promo code deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete promo code");
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Promo Codes Control</h1>
          <p className={styles.subtitle}>
            Manage your active discounts: {promoCodes.length}
          </p>
        </div>

        <button
          className={styles.createPromoBtn}
          onClick={() => setIsModalOpen(true)}
        >
          + Create New Code
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code Name</th>
              <th>Discount Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className={styles.emptyTableMessage}>
                  No active promo codes found.
                </td>
              </tr>
            )}

            {promoCodes.map((promo) => (
              <tr key={promo._id}>
                <td>
                  <strong className={styles.promoCodeText}>{promo.code}</strong>
                </td>
                <td>{promo.discount}% OFF</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      promo.isActive
                        ? styles.statusActive
                        : styles.statusDisabled
                    }`}
                  >
                    {promo.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(promo._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. МОДАЛКА: Не забудь перевірити її код так само */}
      <CreatePromoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(newPromo) => {
          setPromoCodes((prevCodes) => [newPromo, ...prevCodes]);
        }}
      />
    </>
  );
}
