const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verify,
  forgotPassword,
  resetPassword,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update", updateUser);
router.delete("/:email", deleteUser);

module.exports = router;
