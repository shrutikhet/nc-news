const { isArticleIdValid } = require("../model/articles.model");
const {
  fetchCommentsForArticleId,
  insertCommentsForArticle,
  deleteCommentQuery,
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

  if (article_id) {
    isArticleIdValid(article_id)
      .then((isValid) => {
        if (isValid) {
          return insertCommentsForArticle(article_id, username, body);
        } else {
          return Promise.reject({ status: 404, msg: "Article Id not found!!" });
        }
      })
      .then((comment) => {
        response.status(201).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  if (comment_id) {
    deleteCommentQuery(comment_id)
      .then((rows) => {
        if (rows && rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Not Found",
          });
        }
        response.status(204).send({});
      })
      .catch((err) => {
        next(err);
      });
  }
};

module.exports = {
  getCommentsForArticle,
  addCommentsForArticle,
  deleteComment,
};
