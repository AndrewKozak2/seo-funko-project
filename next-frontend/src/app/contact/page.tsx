"use client";
import styles from "./Contact.module.css";
import { ChangeEvent, useState } from "react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted!");
    setIsSubmitted(true);
  };

  return (
    <div className={`container ${styles.contactWrapper}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>
          Have a question about a rare Funko Pop, your order, or just want to
          say hi? Drop us a message!
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <div className={styles.infoBlock}>
            <h3>Email</h3>
            <p>support@pop-collectors.pp.ua</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Social Media</h3>
            <p>Instagram: @funko_store_ua</p>
            <p>Twitter: @funko_ua</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Business Hours</h3>
            <p>Mon-Fri: 10:00 AM - 6:00 PM</p>
            <p>Sat-Sun: Closed</p>
          </div>
        </div>

        <div className={styles.formSection}>
          {isSubmitted ? (
            <div className={styles.successMessage}>
              <h3>Thank you for reaching out!</h3>
              <p>
                We have received your message and will get back to you within 24
                hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" required placeholder="John Doe" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  placeholder="Order Inquiry"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
