const db = require("../db/connection");

const fetchArticles = () => {
  let queryString = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.created_at,articles.votes,articles.article_img_url,COUNT(COMMENTS.ARTICLE_ID) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at desc`;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlesById = (article_id) => {
  let queryString = `SELECT * FROM articles `;
  const queryParams = [];

  if (article_id) {
    queryString += `WHERE article_id = $1`;
    queryParams.push(article_id);
  }
  return db.query(`${queryString};`, queryParams).then(({ rows }) => {
    return rows[0];
  });
};

module.exports = { fetchArticles, fetchArticlesById };
