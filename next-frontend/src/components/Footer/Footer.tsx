// МИ НЕ ПИШЕМО "use client", щоб цей компонент був SSR-ним
import Link from "next/link"; // 1. ЗАМІНА: для швидкої навігації без перезавантаження
//import { Instagram, Twitter, Facebook, Github } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.brandInfo}>
            <h3>
              <span className={styles.brandAccent}>Funko</span> Pop Store
            </h3>
            <p>
              Your ultimate destination for exclusive and rare collectible
              figures.
            </p>
            <div className={styles.socials}>
              {/* Тут можна теж обгорнути в <Link>, якщо це реальні профілі */}
   {  /*         <Instagram size={24} className={styles.icon} />
              <Twitter size={24} className={styles.icon} />
              <Facebook size={24} className={styles.icon} />
              <Github size={24} className={styles.icon} />*/}
            </div>
          </div>

          <div className={styles.linksGroup}>
            <h4>Shop</h4>
            <ul>
              <li>
                {/* 2. ЗАМІНА: href замість посилань-заглушок */}
                <Link href="/figures">All Figures</Link>
              </li>
              <li>
                <Link href="/exclusives">Exclusives</Link>
              </li>
              <li>
                <Link href="/new-releases">New Releases</Link>
              </li>
              <li>
                <Link href="/sale">Sale</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksGroup}>
            <h4>Support</h4>
            <ul>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/shipping">Shipping</Link>
              </li>
              <li>
                <Link href="/returns">Returns</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>
            {/* 3. МАГІЯ: Це виконається на СЕРВЕРІ в момент запиту */}©{" "}
            {new Date().getFullYear()} Funko Pop Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
