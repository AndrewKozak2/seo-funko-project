import { useState } from "react";
import { PreOrderModal } from "../PreOrderModal/PreOrderModal";
import styles from "./Hero.module.css";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroPanel}>
            <div className={styles.textSide}>
              <span className={styles.badge}>LIMITED EDITION</span>
              <h1>IRON MAN POP</h1>
              <button
                className={styles.preOrderBtn}
                onClick={() => setIsModalOpen(true)}
              >
                Pre-Order Now
              </button>
            </div>
            <div className={styles.imageSide}>
              <img src="/assets/iron.png" alt="Iron Man" />
            </div>
          </div>
        </div>
      </section>
      <PreOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
