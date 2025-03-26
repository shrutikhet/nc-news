const {
  fetchArticles,
  fetchArticlesById,
  updateVotesForArticleId,
} = require("../model/articles.model");

const getArticles = (request, response, next) => {
  const { sort_by, order, column_name, value } = request.query;

  fetchArticles({ sort_by, order, column_name, value })
    .then((rows) => {
      response.status(200).send({ articles: rows });
    })
    .catch((error) => {
      next(error);
    });
};

const getArticlesById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticlesById(article_id)
    .then((row) => {
      response.status(200).send({ article: row });
    })
    .catch((error) => {
      next(error);
    });
};

const updateArticleVotes = (request, response, next) => {
  const { inc_votes } = request.body;
  const { article_id } = request.params;
  if (article_id && inc_votes) {
    updateVotesForArticleId(article_id, inc_votes)
      .then((article) => {
        response.status(200).send({ article: article[0] });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    Promise.reject({ status: 400, msg: "Bad Request!!" });
  }
};
module.exports = { getArticles, getArticlesById, updateArticleVotes };
