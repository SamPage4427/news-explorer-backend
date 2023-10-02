const Articles = require("../models/articles");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const getSavedArticles = (req, res, next) => {
  Articles.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createSavedArticle = (req, res, next) => {
  const { source, link, image, keyword, title, text, date } = req.body;
  const owner = req.user._id;

  Articles.create({
    source,
    title,
    text,
    date,
    link,
    image,
    keyword,
    owner,
  })
    .then((item) => res.send({ data: item }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        return next(new BadRequestError("Invalid data sent to the server"));
      }
      return next(e);
    });
};

const deleteSavedArticle = (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;

  Articles.findById(articleId)
    .orFail(new NotFoundError("Item not found"))
    .then((item) => {
      if (item.owner.equals(userId)) {
        return item.remove(() => res.send({ item }));
      }
      return next(new ForbiddenError("User not authorized to remove item"));
    })
    .catch(next);
};

module.exports = {
  getSavedArticles,
  createSavedArticle,
  deleteSavedArticle,
};
