"use client";

import Link from "next/link";
//import { Instagram, Twitter, Facebook, Github } from "lucide-react";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export function FooterContent() {
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
              {/*         <Instagram size={24} className={styles.icon} />
              <Twitter size={24} className={styles.icon} />
              <Facebook size={24} className={styles.icon} />
              <Github size={24} className={styles.icon} />*/}
            </div>
          </div>

          <div className={styles.linksGroup}>
            <h4>Shop</h4>
            <ul>
              <li>
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
            {new Date().getFullYear()} Funko Pop Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
export function Footer() {
  const pathname = usePathname();

  if (pathname === "/auth") {
    return null;
  }

  return (
    <Suspense
      fallback={
        <header className={styles.headerWrapper}>
          <div className="container">Loading...</div>
        </header>
      }
    >
      <FooterContent />
    </Suspense>
  );
}
