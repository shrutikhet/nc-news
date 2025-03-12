const { fetchArticles, fetchArticlesById } = require("../model/articles.model");

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((rows) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article id not found!!" });
      } else {
        response.status(200).send({ articles: rows });
      }
    })
    .catch((error) => {
      next(error);
    });
};

const getArticlesById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticlesById(article_id)
    .then((row) => {
      if (!row) {
        return Promise.reject({ status: 404, msg: "Article id not found!!" });
      } else {
        response.status(200).send({ article: row });
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getArticles, getArticlesById };
