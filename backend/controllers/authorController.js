const Author = require("../models/Author");

const getAuthorBySlug = async (req, res) => {
  try {
    const author = await Author.findOne({ slug: req.params.slug });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAuthorBySlug,
};
