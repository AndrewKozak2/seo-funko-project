const mongoose = require("mongoose");

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const PromoCodes = mongoose.model("PromoCodes", PromoSchema);
module.exports = PromoCodes;