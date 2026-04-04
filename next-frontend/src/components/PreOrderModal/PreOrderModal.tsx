"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import styles from "./PreOrderModal.module.css";

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreOrderModal({ isOpen, onClose }: PreOrderModalProps) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("You are on the list! We'll notify you.");
    setEmail("");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>

        {/* 3. ОПТИМІЗОВАНА КАРТИНКА */}
        <Image
          src="/assets/iron.png"
          alt="Iron Man Figure Pre-order"
          width={200} // Вкажи приблизний розмір
          height={200}
          className={styles.image}
        />

        <h2 className={styles.title}>Join the Waitlist</h2>
        <p className={styles.description}>
          This exclusive Iron Man Pop is currently in production. Enter your
          email to get early access when it drops!
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Enter your email..."
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitBtn}>
            Notify Me
          </button>
        </form>
      </div>
    </div>
  );
}
