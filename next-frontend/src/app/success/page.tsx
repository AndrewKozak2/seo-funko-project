"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import styles from "./Success.module.css";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
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

        <button onClick={() => router.push("/")} className={styles.homeBtn}>
          Back to Store
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={<div className={styles.wrapper}>Loading your order...</div>}
    >
      <SuccessContent />
    </Suspense>
  );
}
