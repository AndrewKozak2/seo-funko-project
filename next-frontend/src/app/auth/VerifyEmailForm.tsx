"use client"; // 1. ПРАВИЛО: Додаємо, бо компонент інтерактивний

import React from "react";
import styles from "./Auth.module.css"; // Переконайся, що шлях вірний

interface VerifyEmailFormProps {
  email: string;
  code: string[];
  isLoading: boolean;
  onOtpChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function VerifyEmailForm({
  email,
  code,
  isLoading,
  onOtpChange,
  onKeyDown,
  onSubmit,
}: VerifyEmailFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <p className={styles.infoText}>
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>

      <div className={styles.otpContainer}>
        {code.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            autoComplete="one-time-code" // 2. ПІДКАЗКА: Допомагає мобільним девайсам підтягнути код з СМС/Пошти
            onChange={(e) => onOtpChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className={styles.otpInput}
            required
            disabled={isLoading} // 3. UX: Блокуємо інпути під час перевірки
          />
        ))}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify & Enter"}
      </button>
    </form>
  );
}
