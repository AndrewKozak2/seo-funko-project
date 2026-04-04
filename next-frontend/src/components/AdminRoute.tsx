"use client";

import { useEffect } from "react";
// 1. ЗАМІНА: Redirect у Next.js робиться через useRouter або redirect
import { useRouter } from "next/navigation"; 
import { useAuthStore } from "@/store/authStore";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // 2. ЗАМІНА: process.env замість import.meta.env
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    // 3. Якщо не адмін — перенаправляємо на головну
    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, router]);

  // Якщо не адмін — нічого не рендеримо, поки працює редирект
  if (!isAdmin) {
    return null; 
  }

  return <>{children}</>;
};