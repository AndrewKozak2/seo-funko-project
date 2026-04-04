import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./ScrollUpButton.module.css";

export function ScrollUpButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
    >
      <ArrowUp size={28} />
    </button>
  );
}
