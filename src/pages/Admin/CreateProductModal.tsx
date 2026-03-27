import { useState } from "react";
import styles from "./CreateProductModal.module.css";
import toast from "react-hot-toast";

interface CreateProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProductModal({
  onClose,
  onSuccess,
}: CreateProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    imageUrl: "",
    collection: "",
    isExclusive: false,
    isBundle: false,
    originalPrice: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const safeTitle = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const randomNum = Math.floor(Math.random() * 1000);
    let finalId = formData.isBundle
      ? `bundle-${safeTitle}-${randomNum}`
      : `${safeTitle}-${randomNum}`;
    const productPayload = {
      ...formData,
      id: finalId,
      price: Number(formData.price),
    };
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const savedKey = localStorage.getItem("adminKey");
      const response = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey || "",
        },
        body: JSON.stringify(productPayload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create products");
      }

      toast.success("Product created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>imageUrl</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>collection</label>
            <input
              type="text"
              value={formData.collection}
              onChange={(e) =>
                setFormData({ ...formData, collection: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.isExclusive}
                onChange={(e) =>
                  setFormData({ ...formData, isExclusive: e.target.checked })
                }
              />
              Is Exclusive?
            </label>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
