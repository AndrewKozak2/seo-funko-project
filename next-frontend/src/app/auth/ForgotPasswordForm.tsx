"use client";

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
          autoComplete="email"
          value={email}
          onChange={onChange}
          disabled={isLoading}
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
