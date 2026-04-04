import { Instagram, Twitter, Facebook, Github } from "lucide-react";
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
              <Instagram size={24} className={styles.icon} />
              <Twitter size={24} className={styles.icon} />
              <Facebook size={24} className={styles.icon} />
              <Github size={24} className={styles.icon} />
            </div>
          </div>
          <div className={styles.linksGroup}>
            <h4>Shop</h4>
            <ul>
              <li>
                <a href="#">All Figures</a>
              </li>
              <li>
                <a href="#">Exclusives</a>
              </li>
              <li>
                <a href="#">New Releases</a>
              </li>
              <li>
                <a href="#">Sale</a>
              </li>
            </ul>
          </div>
          <div className={styles.linksGroup}>
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Shipping</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>
            © {new Date().getFullYear()} Funko Pop Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
