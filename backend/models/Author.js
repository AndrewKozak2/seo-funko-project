const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  linkedin: { type: String },
  articlesCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Author", authorSchema);
