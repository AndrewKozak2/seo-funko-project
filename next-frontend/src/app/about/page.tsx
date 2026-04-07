import { Metadata } from "next";
import styles from "./About.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Funko Pop Store",
  description:
    "Learn more about our team of collectors and our store's mission.",
};

export default function AboutPage() {
  return (
    <div className={`container ${styles.aboutWrapper}`}>
      <h1 className={styles.title}>About Funko Pop Store</h1>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Who We Are</h2>
        <p className={styles.text}>
          We are a team of passionate collectors who have been helping fans find
          rare and exclusive Funko Pop figures since 2023.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Our Quality Policy (Mission)</h2>
        <p className={styles.text}>
          We guarantee 100% authenticity for every figure. All items undergo a
          strict box condition check before shipping to ensure the best
          experience for collectors.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subtitle}>Contact Information</h2>
        <ul className={styles.contactList}>
          <li>Email: support@pop-collectors.pp.ua</li>
          <li>
            Instagram:
            <a href="#" className={styles.link}>
              @funko_store_ua
            </a>
          </li>
        </ul>
        <p className={styles.founded}>Founded: November 2025</p>
      </section>
      <div className={styles.authorSignature}>
        <img
          src="https://scene7.toyota.eu/is/image/toyotaeurope/01-2011-lexus-lfa-review?wid=1280&fit=fit,1&ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0"
          alt="Andriy Kozak"
          width={50}
          height={50}
          className={styles.authorAvatar}
        />
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>
            Author:
            <Link href="/authors/andriy-kozak" className={styles.authorLink}>
              Andriy Kozak
            </Link>
          </h3>
          <p className={styles.authorBio}>
            Store founder and pop culture expert. Senior collector with a
            personal collection of over 300 Marvel and F1 figures. Funko
            authentication expert.
          </p>
          <small className={styles.dates}>
            Published: April 10, 2026 | Updated: April 12, 2026
          </small>
        </div>
      </div>
      <div className={styles.authorSignature}>
        <img
          src="https://avtoto.com.ua/blog/wp-content/uploads/2017/11/1280px-1967_Dodge_Charger_fastback_red_front.jpg"
          alt="Sasha-Khoiskyi"
          width={50}
          height={50}
          className={styles.authorAvatar}
        />
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>
            Author:
            <Link href="/authors/sasha-khoiskyi" className={styles.authorLink}>
              Sasha Khoiskyi
            </Link>
          </h3>
          <p className={styles.authorBio}>
            Co-founder and vintage Funko enthusiast. Specializes in rare Star
            Wars vault drops, anime exclusives, and analyzing production batch
            codes.
          </p>
          <small className={styles.dates}>
            Published: April 10, 2026 | Updated: April 12, 2026
          </small>
        </div>
      </div>
    </div>
  );
}
