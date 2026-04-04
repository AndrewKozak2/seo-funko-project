const PromoCode = require("../models/PromoCode");

const getPromos = async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_SECRET) {
      return res
        .status(403)
        .json({ message: "Access denied. Invalid admin key" });
    }
    const promoCodes = await PromoCode.find();
    res.json(promoCodes);
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching promo codes" });
  }
};

const createPromo = async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { code, discount } = req.body;

    if (!code || !discount) {
      return res
        .status(400)
        .json({ message: "Code and discount are required" });
    }

    const newPromo = await PromoCode.create({
      code: code.toUpperCase(),
      discount: Number(discount),
      isActive: true,
    });

    res.status(201).json(newPromo);
  } catch (error) {
    console.error("Create promo error:", error);
    res.status(500).json({ message: "Error creating promo code" });
  }
};

const deletePromo = async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.params;
    const deletePromoCode = await PromoCode.findByIdAndDelete(id);
    if (!deletePromoCode) {
      return res.status(404).json({ message: "Promo Code not deleted" });
    }

    res.json({ message: "Promo code deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting promo code" });
  }
};

const applyPromo = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code });

    if (!promo) {
      return res.status(400).json({ message: "Invalid promo code" });
    }
    if (!promo.isActive) {
      return res.status(400).json({ message: "Promo code is inactive" });
    }
    res.status(200).json({
      message: "Promo code applied successfully!",
      discount: promo.discount,
    });
  } catch (error) {
    console.error("Promo code error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPromos, createPromo, deletePromo, applyPromo };
