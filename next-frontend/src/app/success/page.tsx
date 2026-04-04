"use client"; // Обов'язково, бо використовуємо хуки навігації

import { useEffect } from "react";
// 1. ЗАМІНА: Нові хуки від Next.js
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import styles from "./Success.module.css";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 2. ЗАМІНА: Отримуємо дані з URL-рядка
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");

  // 3. ЛОГІКА ЗАХИСТУ: Якщо людина просто зайшла на /success без замовлення — викидаємо
  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId, router]);

  if (!orderId) {
    return null; // Поки йде редирект, нічого не рендеримо
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.receiptCard}>
        <CheckCircle size={60} className={styles.icon} />
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.text}>Your order has been confirmed.</p>

        <div className={styles.details}>
          <div className={styles.detailsRow}>
            <span>Order Number:</span>
            <span>{orderId}</span>
          </div>
          <div className={styles.detailsRow}>
            <span>Total Paid:</span>
            <span>${total}</span>
          </div>
        </div>

        {/* 4. ЗАМІНА: router.push для повернення до магазину */}
        <button onClick={() => router.push("/")} className={styles.homeBtn}>
          Back to Store
        </button>
      </div>
    </div>
  );
}