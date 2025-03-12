const { fetchArticles, fetchArticlesById } = require("../model/articles.model");
//const { handleNonExistentInfo } = require("./api.controller");

const getArticles = (request, response, next) => {


  fetchArticles()
    .then((rows) => {
      console.log("getting articles:", rows);
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
  console.log("getArticlesById");
  const { article_id } = request.params;
  if (article_id) {

  }

  fetchArticlesById(article_id)
    .then((row) => {
        
      if (!row) {
        console.log("rejecting",row," article id:", article_id);
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
