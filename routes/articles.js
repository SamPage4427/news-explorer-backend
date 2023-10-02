const router = require("express").Router();
const {
  getSavedArticles,
  createSavedArticle,
  deleteSavedArticle,
} = require("../controllers/articles.js");
const auth = require("../middlewares/authorization");
// or/and
const { validateId, validateNewsItem } = require("../middlewares/validation");

router.get("/", getSavedArticles);
router.post("/", auth, validateNewsItem, createSavedArticle);
router.delete("/:articleId", auth, validateId, deleteSavedArticle);

module.exports = router;
