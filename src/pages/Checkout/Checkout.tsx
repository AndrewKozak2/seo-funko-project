import { useNavigate } from "react-router-dom";
import { customStyles } from "./selectStyles";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { type City, type Warehouse } from "../../services/novaPoshta";
import styles from "./Checkout.module.css";
import { useCheckout } from "../../hooks/useCheckout";

export function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    totalPrice,
    formData,
    setFormData,
    warehouses,
    selectedCity,
    setSelectedCity,
    selectedWarehouse,
    setSelectedWarehouse,
    handleSubmit,
    isSubmitting,
    loadCities,
  } = useCheckout();

  if (cart.length === 0) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "100px 20px" }}
      >
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          className={styles.submitBtn}
          style={{ width: "auto", padding: "15px 30px" }}
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const customWarehouseFilter = (option: any, inputValue: string) => {
    if (!inputValue) return true;

    const search = inputValue.toLowerCase().trim();
    const label = option.label.toLowerCase();

    if (/^\d+$/.test(search)) {
      const exactNumberMatch = new RegExp(`№\\s*${search}\\b`).test(label);
      if (exactNumberMatch) return true;
    }
    const searchTerms = search.split(" ").filter((term) => term.length > 0);
    return searchTerms.every((term) => label.includes(term));
  };

  return (
    <div className="container" style={{ padding: "40px 20px 100px 20px" }}>
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.summaryBlock}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        <div>
          {cart.map((item) => (
            <div key={item.product.id} className={styles.summaryItem}>
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className={styles.summaryImage}
              />
              <div className={styles.summaryInfo}>
                <p className={styles.summaryName}>{item.product.title}</p>
                <p className={styles.summaryQty}>Qty: {item.quantity}</p>
              </div>
              <div className={styles.summaryPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
          <div className={styles.totalBlock}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalAmount}>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            className={styles.input}
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className={styles.input}
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>
            Your Number
          </label>
          <input
            id="phone"
            type="tel"
            required
            className={styles.input}
            placeholder="+380 50 123 45 67"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>City (Nova Poshta)</label>
          <AsyncSelect
            cacheOptions
            defaultOptions
            loadOptions={loadCities}
            onChange={(val) => {
              setSelectedCity(val as City);
              if (!val) {
                setSelectedWarehouse(null);
              }
            }}
            getOptionLabel={(e: City) => e.Present}
            getOptionValue={(e: City) => e.Ref}
            placeholder="Start typing your city..."
            styles={customStyles}
            required
            isClearable={true}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Warehouse</label>
          <Select
            options={warehouses}
            onChange={(val) => setSelectedWarehouse(val as Warehouse)}
            getOptionLabel={(e: Warehouse) => e.Description}
            getOptionValue={(e: Warehouse) => e.Ref}
            placeholder={
              selectedCity ? "Select warehouse..." : "Select a city first"
            }
            isDisabled={!selectedCity}
            styles={customStyles}
            value={selectedWarehouse}
            required
            filterOption={customWarehouseFilter}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
