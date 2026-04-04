"use client";
import { useRouter } from "next/navigation";
import { customStyles } from "./selectStyles";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Image from "next/image";
import { type City, type Warehouse } from "@/services/novaPoshta";
import { useCheckout } from "@/hooks/useCheckout";
import styles from "./Checkout.module.css";

export default function CheckoutPage() {
  const router = useRouter();

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
    promoCode,
    setPromoCode,
    discount,
    finalPrice,
    handleApplyPromo,
    isCheckingPromo,
  } = useCheckout();

  if (cart.length === 0) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "150px 20px" }}
      >
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Your cart is empty
        </h2>
        <button
          onClick={() => router.push("/")}
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
    <div className="container" style={{ padding: "100px 20px 100px 20px" }}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.summaryBlock}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        <div>
          {cart.map((item) => (
            <div key={item.product.id} className={styles.summaryItem}>
              <div
                className={styles.imageWrapper}
                style={{ position: "relative", width: "60px", height: "60px" }}
              >
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className={styles.summaryImage}
                />
              </div>
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
            <div className={styles.totalRight}>
              {discount > 0 && (
                <span className={styles.oldPrice}>
                  ${totalPrice.toFixed(2)}
                </span>
              )}
              <span className={styles.totalAmount}>
                ${finalPrice.toFixed(2)}
              </span>
            </div>
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
              if (!val) setSelectedWarehouse(null);
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

        <div className={styles.inputGroup}>
          <label className={styles.label}>Promo Code</label>
          <div className={styles.promoFlex}>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter promo code..."
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              disabled={isCheckingPromo || discount > 0}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isCheckingPromo || !promoCode || discount > 0}
              className={styles.promoApplyBtn}
            >
              {isCheckingPromo ? "..." : discount > 0 ? "Applied" : "Apply"}
            </button>
          </div>
          {discount > 0 && (
            <p className={styles.promoSuccess}>
              Discount of {discount}% successfully applied!
            </p>
          )}
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
