const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

const verify = async (req, res) => {
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
};

const forgotPassword = async (req, res) => {
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
};

const resetPassword = async (req, res) => {
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
};

const updateUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
  try {
    const emailToDelete = req.params.email;
    await Order.updateMany(
      { "customer.email": emailToDelete },
      {
        $set: {
          "customer.email": "deleted@user.com",
          "customer.name": "Deleted User",
          "customer.address": "Deleted Address",
          "customer.phone": "0000000000",
        },
      },
    );
    const deleteUser = await User.findOneAndDelete({ email: emailToDelete });
    if (!deleteUser) {
      return res.status(404).json({ message: "User not deleted" });
    }
    res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Error to deleting user", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  register,
  login,
  verify,
  forgotPassword,
  resetPassword,
  updateUser,
  deleteUser,
};
