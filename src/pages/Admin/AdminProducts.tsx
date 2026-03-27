import { useState, useEffect } from "react";
import styles from "./AdminProducts.module.css";
import toast from "react-hot-toast";
import { CreateProductModal } from "./CreateProductModal";

interface ProductAdmin {
  _id: string;
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  collection: string;
  isExclusive?: boolean;
  isBundle?: boolean;
  originalPrice?: number;
}
export function AdminProducts() {
  const [adminProducts, setAdminProducts] = useState<ProductAdmin[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const fetchAdminProducts = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const savedKey = localStorage.getItem("adminKey");

      const response = await fetch(`${apiUrl}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey || "",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setAdminProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (idToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const savedKey = localStorage.getItem("adminKey");

      const response = await fetch(`${apiUrl}/products/${idToDelete}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": savedKey || "",
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setAdminProducts((prev) => prev.filter((p) => p.id !== idToDelete));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Products</h1>
          <p className={styles.subtitle}>
            Total products: {adminProducts.length}
          </p>
        </div>

        <button
          className={styles.createProductBtn}
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Create New
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Collection</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminProducts.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className={styles.emptyTableMessage}>
                  No products found. Create one!
                </td>
              </tr>
            )}

            {adminProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <strong className={styles.productId}>{product.id}</strong>
                </td>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={styles.imageMin}
                  />
                </td>
                <td className={styles.productTitle}>{product.title}</td>
                <td className={styles.productPrice}>
                  {product.originalPrice && (
                    <span className={styles.oldPrice}>
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className={styles.currentPrice}>${product.price}</span>
                </td>
                <td className={styles.productCollection}>
                  {product.collection}
                </td>
                <td className={styles.productTags}>
                  {product.isBundle && (
                    <span className={styles.badgeBundle}>Bundle</span>
                  )}
                  {product.isExclusive && (
                    <span className={styles.badgeExclusive}>Exclusive</span>
                  )}
                  {!product.isBundle && !product.isExclusive && (
                    <span className={styles.badgeStandard}>Standard</span>
                  )}
                </td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchAdminProducts} 
        />
      )}
    </>
  );
}
