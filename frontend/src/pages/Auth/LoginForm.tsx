import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Auth.module.css";

interface LoginFormProps {
  authMode: "login" | "register";
  formData: any;
  setFormData: (data: any) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
  onToggleMode: () => void;
}

export function LoginForm({
  authMode,
  formData,
  setFormData,
  isLoading,
  onSubmit,
  onForgotPassword,
  onToggleMode,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <form onSubmit={onSubmit}>
        {authMode === "register" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            required
            className={styles.input}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
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

          {authMode === "login" && (
            <div className={styles.forgotPasswordWrapper}>
              <span
                className={styles.forgotPasswordLink}
                onClick={onForgotPassword}
              >
                Forgot Password?
              </span>
            </div>
          )}
        </div>

        {authMode === "register" && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className={styles.input}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
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
        )}

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : authMode === "login"
              ? "Login"
              : "Sign Up"}
        </button>
      </form>
      <p className={styles.toggleText}>
        {authMode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <span className={styles.toggleLink} onClick={onToggleMode}>
          {authMode === "login" ? "Sign Up" : "Login"}
        </span>
      </p>
    </>
  );
}
