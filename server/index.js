const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/orderRoutes");
const promoRoutes = require("./routes/promoRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/upload", uploadRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/promocodes", promoRoutes);
app.use("/auth", authRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected successfully!"))
  .catch((err) => console.log(" MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Funko Store API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
