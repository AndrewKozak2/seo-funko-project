const express = require("express");
const router = express.Router();
const { getAuthorBySlug } = require("../controllers/authorController");

router.get("/:slug", getAuthorBySlug);

module.exports = router;
