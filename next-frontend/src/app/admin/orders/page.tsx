"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./AdminOrders.module.css";

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  totalPrice: number;
  createdAt: string;
  status: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const savedKey = localStorage.getItem("adminKey");
    if (savedKey) {
      fetchOrders(savedKey);
    }
  }, []);

  const fetchOrders = async (key: string) => {
    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading orders");
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const savedKey = localStorage.getItem("adminKey");

      const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": savedKey || "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      toast.success("Status updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return styles.statusDelivered;
      case "Shipped":
        return styles.statusShipped;
      case "Cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>Orders Dashboard</h1>
          <p style={{ color: "#94a3b8", marginTop: "5px" }}>
            Total orders: {orders.length}
          </p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <strong>{order.customer.name}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {order.customer.address}
                  </span>
                </td>
                <td>
                  {order.customer.phone}
                  <br />
                  {order.customer.email}
                </td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`${styles.statusSelect} ${getStatusClass(order.status || "Pending")}`}
                  >
                    <option value="Pending" className={styles.statusOption}>
                      Pending
                    </option>
                    <option value="Shipped" className={styles.statusOption}>
                      Shipped
                    </option>
                    <option value="Delivered" className={styles.statusOption}>
                      Delivered
                    </option>
                    <option value="Cancelled" className={styles.statusOption}>
                      Cancelled
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
