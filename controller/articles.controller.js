const { fetchArticles, fetchArticlesById, updateVotesForArticleId } = require("../model/articles.model");

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

const updateArticleVotes = (request,response,next) => {
    const {inc_votes} = request.body;
    const {article_id} = request.params;
    updateVotesForArticleId(article_id,inc_votes)
    .then((article) => {
        response.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    })  

}
module.exports = { getArticles, getArticlesById, updateArticleVotes };
