const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/authMiddleware");
const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", adminAuth, createProduct);
router.delete("/:id", adminAuth, deleteProduct);

module.exports = router;
