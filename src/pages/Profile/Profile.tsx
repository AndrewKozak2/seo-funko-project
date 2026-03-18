import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { LogOut } from "lucide-react";
import styles from "./Profile.module.css";
import toast from "react-hot-toast";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
}

export function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchMyOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/orders/user/${user.email}`);

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchMyOrders();
  }, [user]);

  if (!user) return null;

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditing(false);
      return;
    }
    setIsUpdating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, newName: newName }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Updated failed");

      if (login && token) {
        login(data.user, token);
      }
      setIsEditing(false);
      toast.success("Name successfully updated!");
    } catch (error) {
      console.error("Name update error:", error);
      toast.error(`Failed to update name`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.profileBox}>
        <h2 className={styles.title}>Profile</h2>

        <div className={styles.card}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            {isEditing ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={styles.editInput}
                />
                <button
                  className={styles.saveBtn}
                  onClick={handleUpdateName}
                  disabled={isUpdating}
                >
                  {isUpdating ? "..." : "Save"}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.nameRow}>
                <p className={styles.userName}>{user.name}</p>
                <button
                  className={styles.editBtn}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            )}
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} />
          <span>LogOut</span>
        </button>
      </div>

      <div className={styles.ordersSection}>
        <h3 className={styles.ordersTitle}>Order history</h3>

        {loadingOrders ? (
          <p className={styles.loadingText}>Loading your purchases...</p>
        ) : orders.length === 0 ? (
          <p className={styles.emptyText}>
            You don't have any orders yet. It's time to choose your first Funko
            figure!
          </p>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>
                    Order #{order._id.slice(-6)}
                  </span>
                  <span className={styles.orderStatus}>{order.status}</span>
                </div>
                <div className={styles.orderItemsList}>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className={styles.itemImage}
                        />
                      ) : (
                        <div className={styles.itemImagePlaceholder}>
                          No Img
                        </div>
                      )}

                      <div className={styles.itemDetails}>
                        <p className={styles.itemTitle}>{item.title}</p>
                        <p className={styles.itemMeta}>
                          {item.quantity} items × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderTotal}>
                    Sum: ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
