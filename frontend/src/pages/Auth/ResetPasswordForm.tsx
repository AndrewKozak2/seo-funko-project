import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";

interface ResetPasswordFormProps {
  email: string;
  code: string[];
  isLoading: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onOtpChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export function ResetPasswordForm({
  email,
  code,
  isLoading,
  formData,
  setFormData,
  onOtpChange,
  onKeyDown,
  onSubmit,
  onBack,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <form onSubmit={onSubmit}>
      <p className={styles.infoText}>
        Enter the 6-digit code sent to <strong>{email}</strong>
        and your new password.
      </p>

      <div className={styles.otpContainer} style={{ marginBottom: "20px" }}>
        {code.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => onOtpChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className={styles.otpInput}
            required
          />
        ))}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>New Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            required
            className={styles.input}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Confirm New Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            className={styles.input}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save New Password"}
      </button>

      <p className={styles.backToLoginWrapper}>
        <span className={styles.backToLoginLink} onClick={onBack}>
          Cancel & Back to Login
        </span>
      </p>
    </form>
  );
}
