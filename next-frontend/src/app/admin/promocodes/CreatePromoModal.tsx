"use client"; // Обов'язково додаємо для роботи з useEffect та формами

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./CreatePromoModal.module.css";

interface CreatePromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPromo: any) => void;
}

export function CreatePromoModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePromoModalProps) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Керування скролом при відкритті модалки
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) return toast.error("Please fill all fields");

    setIsLoading(true);
    try {
      // 1. ЗАМІНА: Використовуємо NEXT_PUBLIC_ змінні оточення
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const savedKey = localStorage.getItem("adminKey");

      const response = await fetch(`${apiUrl}/promocodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey || "",
        },
        body: JSON.stringify({ code, discount: Number(discount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create promo code");
      }

      toast.success("Promo code created!");
      setCode("");
      setDiscount("");
      onSuccess(data); // Оновлюємо список у батьківському компоненті
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Create Promo Code</h2>
          <button onClick={onClose} className={styles.closeX}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Promo Code (e.g. SUMMER20)</label>
            <input
              type="text"
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())} // Зручно: автоматично робимо капсом
              placeholder="Enter code"
              maxLength={15}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Discount Percentage (%)</label>
            <input
              type="number"
              className={styles.input}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 15"
              min="1"
              max="99"
              disabled={isLoading}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
