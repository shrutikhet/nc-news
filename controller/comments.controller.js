const { isArticleIdValid } = require("../model/articles.model");
const {
  fetchCommentsForArticleId,
  insertCommentsForArticle,
} = require("../model/comment.model");

const getCommentsForArticle = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [];

  if (article_id) {
    promises.push(isArticleIdValid(article_id));
    promises.push(fetchCommentsForArticleId(article_id));
    Promise.all(promises)
      .then(([isValid, comments]) => {
        if (isValid) {
          response.status(200).send({ comments });
        } else {
          return Promise.reject({ status: 404, msg: "Article Id not found!!" });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

const addCommentsForArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  console.log("username:", username, " body:", body);
  if (article_id) {
    isArticleIdValid(article_id)
      .then((isValid) => {
        if (isValid) {
          return insertCommentsForArticle(article_id, username, body);
        } else {
            return Promise.reject({ status: 400, msg: "Article Id not found!!" })
        }
      })
      .then((comment) => {
        response.status(200).send({ comment });
       
      })
      .catch((err) => {
        console.log("error inside catch:",err);
        next(err);
      });
  } else {

  }
};

module.exports = { getCommentsForArticle, addCommentsForArticle };
