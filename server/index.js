const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const sendEmail = require("./utils/sendEmail");
const PromoCode = require("./models/PromoCode");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected successfully!"))
  .catch((err) => console.log(" MongoDB connection error:", err));

const adminAuth = (req, res, next) => {
  const password = req.headers["x-admin-key"];
  const correctPassword = process.env.ADMIN_SECRET;

  if (!password || password !== correctPassword) {
    return res.status(403).json({ message: "Access denied: Invalid password" });
  }
  next();
};

app.get("/", (req, res) => {
  res.send("Funko Store API is running...");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      codeExpires,
      isVerified: false,
    });
    await newUser.save();

    console.log(
      `[DEV MODE] Код підтвердження для ${email}: ${verificationCode}`,
    );

    try {
      await sendEmail(email, verificationCode);
    } catch (emailError) {
      console.error(
        "Попередження: Лист не відправлено, але юзера створено.",
        emailError.message,
      );
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.codeExpires < new Date()) {
      return res.status(400).json({
        message: "Verification code has expired. Please register again.",
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.codeExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Email verified successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

app.get("/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/orders/user/:email", async (req, res) => {
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
});

app.patch("/orders/:id/status", adminAuth, async (req, res) => {
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
});

app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saveOrder = await newOrder.save();
    console.log("New Order Created", saveOrder);
    res.status(201).json(saveOrder);
  } catch (error) {
    console.error("Order Save Error", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

app.put("/user/update", async (req, res) => {
  try {
    const { email, newName } = req.body;
    if (!email || !newName) {
      return res
        .status(400)
        .json({ message: "Email and new name are required" });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { name: newName },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Profile successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/user/:email", async (req, res) => {
  try {
    const emailToDelete = req.params.email;
    await Order.deleteMany({ "customer.email": emailToDelete });
    const deleteUser = await User.findOneAndDelete({ email: emailToDelete });
    if (!deleteUser) {
      return res.status(404).json({ message: "User not deleted" });
    }
    res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error to deleting user", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If an account exists, a reset code was sent." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const emailSubject = "Password Reset Code - Funko Shop";
    const emailMessage = `Your password reset code is: ${resetCode}. It is valid for 15 minutes.`;

    await sendEmail(user.email, resetCode, "reset");
    res
      .status(200)
      .json({ message: "If an account exists, a reset code was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.resetPasswordCode !== resetCode) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res
        .status(400)
        .json({ message: "Reset code has expired. Please request a new one." });
    }

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/apply-promo", async (req, res) => {
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
});

app.get("/promocodes", async (req, res) => {
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
});

app.delete("/promocodes/:id", async (req, res) => {
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
