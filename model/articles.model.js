const db = require("../db/connection");
const { fetchCountOfCommentsForId } = require("../model/comment.model");

const fetchArticles = () => {
  let queryString = `select articles.article_id,articles.title,articles.topic,articles.author,articles.created_at,articles.votes,articles.article_img_url,COUNT(COMMENTS.ARTICLE_ID) as comment_count from articles left join comments on articles.article_id = comments.article_id GROUP BY articles.article_id order by articles.created_at desc`;

  return db.query(queryString).then(({ rows }) => {
    console.log("The articles are sorted", rows);
    return rows;
  });
};

const fetchArticlesById = (article_id) => {
  console.log("fetching articles for article ID:", article_id);
  let queryString = `SELECT * FROM articles `;
  const queryParams = [];

  if (article_id) {
    console.log("we have article id:", article_id);
    queryString += `WHERE article_id = $1`;
    queryParams.push(article_id);
  }
  return db.query(`${queryString};`, queryParams).then(({ rows }) => {
    console.log("The articles we have received:", rows);
    return rows[0];
  });
};

module.exports = { fetchArticles, fetchArticlesById };
