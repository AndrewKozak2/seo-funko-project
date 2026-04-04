import { useState, useEffect } from "react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import {
  searchCities,
  getWarehouses,
  type City,
  type Warehouse,
} from "../services/novaPoshta";
import toast from "react-hot-toast";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
}

export const useCheckout = () => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const finalPrice = totalPrice - (totalPrice * discount) / 100;

  useEffect(() => {
    if (selectedCity) {
      setSelectedWarehouse(null);
      getWarehouses(selectedCity.Ref).then((data) => setWarehouses(data));
    } else {
      setWarehouses([]);
    }
  }, [selectedCity]);

  const loadCities = (
    inputValue: string,
    callback: (options: City[]) => void,
  ) => {
    searchCities(inputValue).then((options) => callback(options));
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsCheckingPromo(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/promocodes/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        return;
      }
      setDiscount(data.discount);
      toast.success("PromoCode success!");
    } catch (error) {
      toast.error("Failed to apply promo code");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !selectedCity ||
      !selectedWarehouse
    ) {
      toast.error("Please fill in all fields, including delivery info");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${selectedCity.Present}, ${selectedWarehouse.Description}`;
      const orderPayload = {
        customer: {
          ...formData,
          address: fullAddress,
        },
        items: cart.map((item) => ({
          productId: item.product._id || item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        totalPrice: finalPrice,
      };

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const savedOrder = await response.json();
      toast.success("Order successfully placed!");
      navigate("/success", {
        state: {
          orderId: savedOrder._id,
          total: finalPrice.toFixed(2),
        },
      });

      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    formData,
    setFormData,
    warehouses,
    selectedCity,
    setSelectedCity,
    selectedWarehouse,
    setSelectedWarehouse,
    handleSubmit,
    isSubmitting,
    cart,
    totalPrice,
    loadCities,
    promoCode,
    setPromoCode,
    discount,
    finalPrice,
    handleApplyPromo,
    isCheckingPromo,
  };
};
