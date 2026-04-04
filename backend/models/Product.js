const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  collection: { type: String, required: true },
  isExclusive: { type: Boolean, default: false },

  originalPrice: { type: Number },
  isBundle: { type: Boolean, default: false },
  bundleImages: { type: [String] },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
