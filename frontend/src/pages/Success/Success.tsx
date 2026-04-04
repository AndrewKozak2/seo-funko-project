import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import styles from "./Success.module.css";

export function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, total } = location.state || {};
  if (!orderId) {
    navigate("/");
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.receiptCard}>
        <CheckCircle size={60} className={styles.icon} />
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.text}>Your order has been confirmed.</p>

        <div className={styles.details}>
          <div className={styles.detailsRow}>
            <span>Order Number:</span>
            <span>{orderId}</span>
          </div>
          <div className={styles.detailsRow}>
            <span>Total Paid:</span>
            <span>{total}</span>
          </div>
        </div>

        <button onClick={() => navigate("/")} className={styles.homeBtn}>
          Back to Store
        </button>
      </div>
    </div>
  );
}
