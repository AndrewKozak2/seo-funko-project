const adminAuth = (req, res, next) => {
  const password = req.headers["x-admin-key"];
  const correctPassword = process.env.ADMIN_SECRET;

  if (!password || password !== correctPassword) {
    return res.status(403).json({ message: "Access denied: Invalid password" });
  }
  next();
};

module.exports = { adminAuth };
