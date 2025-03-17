const db = require("../db/connection");

const defaultQueryParams = {
  sort_by: "created_at",
  order: "desc",
  possible_column_names: [
    "votes",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_img_url",
  ],
  possible_order: ["asc", "desc"],
  column_name: undefined,
  value: undefined,
};

const fetchArticles = (queryParams) => {
  queryParams.sort_by = !queryParams.sort_by
    ? defaultQueryParams.sort_by
    : queryParams.sort_by;
  queryParams.order = !queryParams.order
    ? defaultQueryParams.order
    : queryParams.order;
  queryParams.column_name = !queryParams.column_name
    ? defaultQueryParams.column_name
    : queryParams.column_name;
  queryParams.value = !queryParams.value
    ? defaultQueryParams.value
    : queryParams.value;

  if (
    queryParams.sort_by &&
    !defaultQueryParams.possible_column_names.includes(queryParams.sort_by)
  ) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  if (
    queryParams.column_name &&
    !defaultQueryParams.possible_column_names.includes(queryParams.column_name)
  ) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  if (!defaultQueryParams.possible_order.includes(queryParams.order)) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }

  let selectQuery = `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.created_at,articles.votes,articles.article_img_url,COUNT(COMMENTS.ARTICLE_ID) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const groupByQuery = `GROUP BY articles.article_id `;

  let whereQyery = "";
  let orderByQuery = "";

  if (queryParams.column_name && queryParams.value) {
    whereQyery = `WHERE ${queryParams.column_name} = '${queryParams.value}' `;
   }

  if (queryParams.sort_by && queryParams.order) {
    orderByQuery = `ORDER BY articles.${queryParams.sort_by} ${queryParams.order}`;
  }

  selectQuery += whereQyery + groupByQuery + orderByQuery;

  return db.query(selectQuery).then(({ rows }) => {
    return rows;
  });
};

const fetchArticlesById = (article_id) => {
  let queryString = `SELECT articles.*, COUNT(comments.comment_id)  as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const queryParams = [];

  if (article_id) {
    queryString += `WHERE articles.article_id = $1 group by articles.article_id`;
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
      return rows;
    });
};

module.exports = {
  fetchArticles,
  fetchArticlesById,
  isArticleIdValid,
  updateVotesForArticleId,
};
