import { useState } from "react";
import { type ProductAdmin } from "./AdminProducts";
import styles from "./CreateProductModal.module.css";
import toast from "react-hot-toast";

interface CreateProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
  products: ProductAdmin[];
}

export function CreateProductModal({
  onClose,
  onSuccess,
  products,
}: CreateProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productMode, setProductMode] = useState<"standard" | "bundle">(
    "standard",
  );
  const [bundleCollection, setBundleCollection] = useState("");
  const [selectedBundleItems, setSelectedBundleItems] = useState<string[]>([]);
  const [bundlePrice, setBundlePrice] = useState("");
  const uniqueCollections = Array.from(
    new Set(products.map((p) => p.collection)),
  );

  const availableBundleProducts = products.filter(
    (p) => p.collection === bundleCollection && !p.isBundle,
  );

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    collection: "",
    isExclusive: false,
    isBundle: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const savedKey = localStorage.getItem("adminKey") || "";

      let finalPayload: any = {};

      if (productMode === "standard") {
        if (!imageFile) {
          toast.error("Please select an image!");
          setIsLoading(false);
          return;
        }
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const uploadResponse = await fetch(`${apiUrl}/upload`, {
          method: "POST",
          body: uploadData,
        });
        if (!uploadResponse.ok) throw new Error("Failed to load image");
        const uploadResult = await uploadResponse.json();

        const safeTitle = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
        const randomNum = Math.floor(Math.random() * 1000);

        finalPayload = {
          ...formData,
          id: `${safeTitle}-${randomNum}`,
          price: Number(formData.price),
          imageUrl: uploadResult.imageUrl,
        };
      } else if (productMode === "bundle") {
        if (selectedBundleItems.length !== 2) {
          toast.error("Please select exactly 2 product for the bundle!");
          setIsLoading(false);
          return;
        }
        if (!bundlePrice) {
          toast.error("Please enter a bundle price");
          setIsLoading(false);
          return;
        }

        const product1 = products.find((p) => p.id === selectedBundleItems[0]);
        const product2 = products.find((p) => p.id === selectedBundleItems[1]);

        if (!product1 || !product2) throw new Error("Products not found");

        const autoTitle = `${bundleCollection}: ${product1.title} & ${product2.title}`;

        const oldPriceCalculated = Math.ceil(product1.price + product2.price);

        const safeTitle = autoTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const randomNum = Math.floor(Math.random() * 1000);

        finalPayload = {
          title: autoTitle,
          price: Number(bundlePrice),
          originalPrice: oldPriceCalculated,
          collection: bundleCollection,
          isBundle: true,
          isExclusive: false,
          id: `bundle-${safeTitle}-${randomNum}`,
          imageUrl: product1.imageUrl,
          bundleImages: [product1.imageUrl, product2.imageUrl],
        };
      }

      const productResponse = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey,
        },
        body: JSON.stringify(finalPayload),
      });
      if (!productResponse.ok) throw new Error("Failed to create product");

      toast.success(
        `${productMode === "bundle" ? "Bundle" : "Product"} created successfully!`,
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add New Product</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${productMode === "standard" ? styles.activeTab : ""}`}
            onClick={() => setProductMode("standard")}
          >
            Standard
          </button>
          <button
            className={`${styles.tabBtn} ${productMode === "bundle" ? styles.activeTab : ""}`}
            onClick={() => setProductMode("bundle")}
          >
            Bundle
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {productMode === "standard" && (
            <>
              <div className={styles.inputGroup}>
                <label>Title</label>

                <input
                  type="text"
                  placeholder="Enter Title"
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
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Product Image</label>
                <label className={styles.fileUploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.hiddenFileInput}
                    required={!imageFile}
                  />

                  <div className={styles.fileUploadPlaceholder}>
                    {imageFile ? (
                      <span className={styles.fileName}>
                        ✓ {imageFile.name}
                      </span>
                    ) : (
                      <span>Click or drag to upload an image</span>
                    )}
                  </div>
                </label>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={styles.imagePreview}
                  />
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>Collection</label>
                {isNewCollection ? (
                  <input
                    type="text"
                    placeholder="Enter new collection name"
                    value={formData.collection}
                    onChange={(e) =>
                      setFormData({ ...formData, collection: e.target.value })
                    }
                    required
                  />
                ) : (
                  <div className={styles.customSelectWrapper}>
                    <div
                      className={styles.customSelectTrigger}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>
                        {formData.collection || "Select a collection"}
                      </span>
                      <span className={styles.arrow}>
                        {isDropdownOpen ? "▲" : "▼"}
                      </span>
                    </div>

                    {isDropdownOpen && (
                      <ul className={styles.customSelectList}>
                        {uniqueCollections.map((colName) => (
                          <li
                            key={colName}
                            className={styles.customSelectOption}
                            onClick={() => {
                              setFormData({ ...formData, collection: colName });
                              setIsDropdownOpen(false);
                            }}
                          >
                            {colName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={isNewCollection}
                    onChange={(e) => {
                      setIsNewCollection(e.target.checked);
                      setFormData({ ...formData, collection: "" });
                    }}
                  />
                  Add new collection?
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isExclusive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isExclusive: e.target.checked,
                      })
                    }
                  />
                  Is Exclusive?
                </label>
              </div>
            </>
          )}
          {productMode === "bundle" && (
            <>
              <div className={styles.inputGroup}>
                <label>Select Collection for Bundle</label>
                <div className={styles.customSelectWrapper}>
                  <div
                    className={styles.customSelectTrigger}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{bundleCollection || "Select a collection"}</span>
                    <span className={styles.arrow}>
                      {isDropdownOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <ul className={styles.customSelectList}>
                      {uniqueCollections.map((colName) => (
                        <li
                          key={colName}
                          className={styles.customSelectOption}
                          onClick={() => {
                            setBundleCollection(colName);
                            setSelectedBundleItems([]);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {colName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {bundleCollection && (
                <div className={styles.bundleSelectionArea}>
                  <label>Select Exactly 2 Products:</label>

                  {availableBundleProducts.length < 2 ? (
                    <p className={styles.warningText}>
                      Not enough products in this collection to make a bundle.
                    </p>
                  ) : (
                    <div className={styles.bundleGrid}>
                      {availableBundleProducts.map((product) => {
                        const isSelected = selectedBundleItems.includes(
                          product.id,
                        );
                        return (
                          <div
                            key={product.id}
                            className={`${styles.bundleItem} ${isSelected ? styles.bundleItemSelected : ""}`}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedBundleItems((prev) =>
                                  prev.filter((id) => id !== product.id),
                                );
                              } else if (selectedBundleItems.length < 2) {
                                setSelectedBundleItems((prev) => [
                                  ...prev,
                                  product.id,
                                ]);
                              }
                            }}
                          >
                            <img src={product.imageUrl} alt={product.title} />
                            <span>
                              {product.title}, ${product.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {selectedBundleItems.length === 2 && (
                <div className={styles.inputGroup}>
                  <label>Bundle Price</label>
                  <input
                    type="number"
                    placeholder="Enter bundle price"
                    value={bundlePrice}
                    onChange={(e) => setBundlePrice(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}
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
