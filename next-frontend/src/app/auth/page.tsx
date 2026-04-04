"use client"; // ОБОВ'ЯЗКОВО

import { useRouter } from "next/navigation"; // 1. ЗАМІНА useNavigate
import { ArrowLeft } from "lucide-react";

// 2. ІМПОРТИ ФОРМ: за умови, що вони лежать у тій же папці
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { VerifyEmailForm } from "./VerifyEmailForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { LoginForm } from "./LoginForm";
import { useAuthFlow } from "./useAuthFlow"; // Твій кастомний хук логіки

import styles from "./Auth.module.css";

export default function AuthPage() {
  const router = useRouter();

  const {
    authMode,
    setAuthMode,
    formData,
    setFormData,
    code,
    isLoading,
    handleAuth,
    handleVerify,
    handleForgotPassword,
    handleResetPassword,
    handleOtpChange,
    handleKeyDown,
  } = useAuthFlow();

  return (
    <div className={styles.wrapper}>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <div className={styles.authBox}>
        {/* 3. ЗАМІНА: router.push("/") замість navigate("/") */}
        <button onClick={() => router.push("/")} className={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Store
        </button>

        <h2 className={styles.title}>
          {authMode === "login" && "Welcome Back"}
          {authMode === "register" && "Create Account"}
          {authMode === "verify" && "Verify Email"}
          {authMode === "forgot-password" && "Reset Password"}
          {authMode === "reset-password" && "Create New Password"}
        </h2>

        {/* Логіка перемикання режимів залишається такою ж */}
        {authMode === "verify" ? (
          <VerifyEmailForm
            email={formData.email}
            code={code}
            isLoading={isLoading}
            onOtpChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            onSubmit={handleVerify}
          />
        ) : authMode === "forgot-password" ? (
          <ForgotPasswordForm
            email={formData.email}
            isLoading={isLoading}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onSubmit={handleForgotPassword}
            onBack={() => setAuthMode("login")}
          />
        ) : authMode === "reset-password" ? (
          <ResetPasswordForm
            email={formData.email}
            code={code}
            isLoading={isLoading}
            formData={formData}
            setFormData={setFormData}
            onOtpChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            onSubmit={handleResetPassword}
            onBack={() => setAuthMode("login")}
          />
        ) : (
          <LoginForm
            authMode={authMode as "login" | "register"}
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            onSubmit={handleAuth}
            onForgotPassword={() => setAuthMode("forgot-password")}
            onToggleMode={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          />
        )}
      </div>
    </div>
  );
}
