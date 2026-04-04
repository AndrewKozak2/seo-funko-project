const Order = require("../models/Order");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const userOrders = await Order.find({ "customer.email": userEmail }).sort({
      createdAt: -1,
    });
    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true },
    );
    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updateOrder);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saveOrder = await newOrder.save();
    console.log("New Order Created", saveOrder);
    res.status(201).json(saveOrder);
  } catch (error) {
    console.error("Order Save Error", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

module.exports = { getOrders, getUserOrders, updateOrderStatus, createOrder };
