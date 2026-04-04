const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/authMiddleware");
const {
  getOrders,
  getUserOrders,
  updateOrderStatus,
  createOrder,
} = require("../controllers/orderController");

router.get("/", adminAuth, getOrders);
router.get("/user/:email", getUserOrders);
router.patch("/:id/status", adminAuth, updateOrderStatus);
router.post("/", createOrder);

module.exports = router;
