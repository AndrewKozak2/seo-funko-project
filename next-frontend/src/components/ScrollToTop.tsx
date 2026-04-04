"use client"; // Обов'язково, бо працюємо з window

import { useEffect } from "react";
// 1. ЗАМІНА: В Next.js немає useLocation, є usePathname
import { usePathname } from "next/navigation"; 

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 2. Логіка залишається такою ж
    window.scrollTo(0, 0);
  }, [pathname]); // Спрацьовує щоразу, як змінюється шлях

  return null;
}