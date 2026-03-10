import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import styles from "./Auth.module.css";

type AuthMode = "login" | "register" | "verify";
// Trigger Vercel rebuild after rollback
export function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleAuth = async (e: React.ChangeEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const endpoint = authMode === "login" ? "login" : "register";

      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (authMode === "login") {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/");
      } else {
        toast.success("Verification code sent to your email!");
        setAuthMode("verify");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Verification failed");

      login(data.user, data.token);
      toast.success("Email verified! Welcome to Funko Store.");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Invalid code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <div className={styles.authBox}>
        <button onClick={() => navigate("/")} className={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Store
        </button>

        <h2 className={styles.title}>
          {authMode === "login" && "Welcome Back"}
          {authMode === "register" && "Create Account"}
          {authMode === "verify" && "Verify Email"}
        </h2>

        {authMode === "verify" ? (
          <form onSubmit={handleVerify}>
            <p
              style={{
                color: "#94a3b8",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              We've sent a 6-digit code to <strong>{formData.email}</strong>
            </p>

            <div className={styles.otpContainer}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={styles.otpInput}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify & Enter"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth}>
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
              <input
                type="password"
                required
                className={styles.input}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : authMode === "login"
                  ? "Login"
                  : "Sign Up"}
            </button>
          </form>
        )}

        {authMode !== "verify" && (
          <p className={styles.toggleText}>
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              className={styles.toggleLink}
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
            >
              {authMode === "login" ? "Sign Up" : "Login"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
