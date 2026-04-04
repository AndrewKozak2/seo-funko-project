"use client"; // 1. ПРАВИЛО: Форма інтерактивна — маємо додати цю директиву

import React from "react";
import styles from "./Auth.module.css";

interface ForgotPasswordProps {
  email: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export function ForgotPasswordForm({
  email,
  isLoading,
  onChange,
  onSubmit,
  onBack,
}: ForgotPasswordProps) {
  return (
    <form onSubmit={onSubmit}>
      <p className={styles.infoText}>
        Enter your email and we'll send you a 6-digit code to reset your
        password.
      </p>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          required
          className={styles.input}
          placeholder="your@email.com"
          autoComplete="email" // 2. UX: Допомагаємо браузеру зрозуміти тип поля
          value={email}
          onChange={onChange}
          disabled={isLoading} // 3. Блокуємо інпут, поки йде відправка листа
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Code"}
      </button>

      <p className={styles.backToLoginWrapper}>
        <span className={styles.backToLoginLink} onClick={onBack}>
          Back to Login
        </span>
      </p>
    </form>
  );
}
