import { useState } from "react";
import styles from "./Newsletter.module.css";
import toast from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email) {
      toast.success("Successfully subscribed to the newsletter!");
      setEmail("");
    }
  };
  return (
    <section className={styles.newsletterWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Funko's Newsletter</h2>
        <p className={styles.subtitle}>
          Join our mailing list and be the first to hear about new releases,
          upcoming events, and more!
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address*"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button className={styles.submitBtn} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
}
