const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/authMiddleware");

const {
  applyPromo,
  getPromos,
  createPromo,
  deletePromo,
} = require("../controllers/promoController");

router.post("/apply", applyPromo);
router.get("/", adminAuth, getPromos);
router.post("/", adminAuth, createPromo);
router.delete("/:id", adminAuth, deletePromo);

module.exports = router;
