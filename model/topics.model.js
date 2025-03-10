const db = require("../db/connection");

const fetchTopics = () => {
  return db.query("Select slug,description from topics;").then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchTopics };
