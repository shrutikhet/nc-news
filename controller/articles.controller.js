const { fetchArticles } = require("../model/articles.model");
//const { handleNonExistentInfo } = require("./api.controller");

const getArticles = ( request, response ) => {
  console.log("Starting getArticles");
  const { article_id } = request.params;
  console.log("Article Id:", article_id);

  fetchArticles(article_id).then((rows) => {
    console.log("getting articles:", rows);
    if (rows.length === 0) {
      response.status(404).send({ msg: "Data not found!!" });
    } else {
      response.status(200).send({ articles: rows });
    }
  });
};

module.exports = { getArticles };
