"use client"; // ОБОВ'ЯЗКОВО: цей компонент працює тільки в браузері

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./ScrollUpButton.module.css";

export function ScrollUpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // В Next.js код всередині useEffect гарантовано виконується тільки в браузері
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`${styles.scrollBtn} ${isVisible ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top" // Порада для SEO/Accessibility: додавай лейбли кнопкам без тексту
    >
      <ArrowUp size={28} />
    </button>
  );
}
