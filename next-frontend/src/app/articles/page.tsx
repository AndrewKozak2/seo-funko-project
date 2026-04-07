import Link from "next/link";
import styles from "./BlogIndex.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Funko Pop Store",
  description:
    "Read the latest guides, news, and tips for Funko Pop collectors.",
};

const blogPosts = [
  {
    id: 1,
    slug: "how-to-spot-fake-funko",
    title: "How to Spot a Fake Funko Pop Figure?",
    excerpt:
      "Learn how to identify counterfeit products by checking box artwork, fonts, and serial numbers. Protect your collection!",
    author: "Andriy Kozak",
    date: "April 10, 2026",
  },
  {
    id: 2,
    slug: "funko-stickers-explained",
    title: "Funko Stickers Explained: Chase, Glow & Flocked",
    excerpt:
      "What do all those stickers on a Funko box mean? From standard exclusives to the holy grail 'Chase' variants, let's break it down.",
    author: "Sasha Khoiskyi",
    date: "April 5, 2026",
  },
  {
    id: 3,
    slug: "best-ways-to-display-collection",
    title: "Top 5 Ways to Display Your Collection",
    excerpt:
      "Whether you are an in-box or out-of-box collector, displaying your Funko Pops properly is an art form. Here are the best methods.",
    author: "Andriy Kozak",
    date: "March 28, 2026",
  },
];

export default function BlogIndexPage() {
  return (
    <div className={`container ${styles.pageWrapper}`}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Funko Collectors Blog</h1>
        <p className={styles.subtitle}>
          Tips, guides, and news from our experts.
        </p>
      </div>

      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <div key={post.id} className={styles.card}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>

              <div className={styles.cardMeta}>
                <span>By {post.author}</span>
                <span>{post.date}</span>
              </div>
            </div>

            <Link
              href={`/articles/${post.slug}`}
              className={styles.readMoreBtn}
            >
              Read Article
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
