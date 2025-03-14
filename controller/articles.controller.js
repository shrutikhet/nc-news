const { fetchArticles, fetchArticlesById, updateVotesForArticleId } = require("../model/articles.model");

const getArticles = (request, response, next) => {
  const {sort_by, order,column_name,value} = request.query;

  fetchArticles({sort_by, order, column_name,value})
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
    if(article_id && inc_votes) {
         updateVotesForArticleId(article_id,inc_votes)
        .then((article) => {
            if(article.length !== 0) {
                response.status(200).send({article: article[0]});
            } else {
                return Promise.reject({status: 400, msg: 'Article id does not exists'});
            }
        })
        .catch((err) => {
            next(err);
        })  
    } else {
         Promise.reject({status: 400, msg: 'Bad Request!!'})
    }

}
module.exports = { getArticles, getArticlesById, updateArticleVotes };
