const db = require("../db/connection");

const fetchArticles = (sort) => {
  let queryString = `SELECT * FROM articles `;
  const queryParams = [];

  if (sort) {
    console.log("we have sort condition", sort);
    queryString += ` order by ${sort} desc`;
    queryParams.push(sort);
  }
  return db.query(`${queryString};`).then(({ rows }) => {
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
