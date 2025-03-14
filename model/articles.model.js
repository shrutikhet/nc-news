const db = require("../db/connection");

const fetchArticles = (sort_by, order,column_name,value) => {
  

  let selectQuery = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.created_at,articles.votes,articles.article_img_url,COUNT(COMMENTS.ARTICLE_ID) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const groupByQuery = `GROUP BY articles.article_id `;

  let whereQyery = '';

  if(column_name && value) {

    console.log(whereQyery);
     whereQyery = `WHERE ${column_name} = '${value}' `;
     console.log(whereQyery);
  }

  let orderByQuery = `ORDER BY articles.created_at desc`;

  if (sort_by && order) {
    orderByQuery = `ORDER BY articles.${sort_by} ${order}`;
  }

  selectQuery += whereQyery + groupByQuery + orderByQuery;

  console.log(selectQuery);

  return db.query(selectQuery).then(({ rows }) => {
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

const isArticleIdValid = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return false;
      }
      return true;
    });
};

const updateVotesForArticleId = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
                    SET votes = votes + $1
                    WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      console.log("Updated rows are :", rows);
      return rows;
    });
};

module.exports = {
  fetchArticles,
  fetchArticlesById,
  isArticleIdValid,
  updateVotesForArticleId,
};
