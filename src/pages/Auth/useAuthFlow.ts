import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

export type AuthMode =
  | "login"
  | "register"
  | "verify"
  | "forgot-password"
  | "reset-password";

export const useAuthFlow = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "register") {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Password do not match!");
        return;
      }
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
      if (!passwordRegex.test(formData.password)) {
        toast.error(
          "Password must be at least 6 characters long and contain both letters and numbers",
        );
        return;
      }
    }
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

  const handleVerify = async (e: React.FormEvent) => {
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

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");

      toast.success("If the email exists, a reset code was sent.");
      setAuthMode("reset-password");
    } catch (error: any) {
      toast.error(error.message || "Unable to process request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 6 characters long and contain both letters and numbers",
      );
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          resetCode: fullCode,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Request failed");

      toast.success("Password successfully reset! You can now login.");

      setCode(["", "", "", "", "", ""]);
      setFormData({ ...formData, password: "", confirmPassword: "" });

      setAuthMode("login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
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

  return {
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
  };
};
