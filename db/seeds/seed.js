const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  console.log("Seeding is happening:");
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      //console.log("Dropping table comments and articles if exists");
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      //console.log("Dropping table topics");
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      //console.log("Dropping table users");
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      //console.log("Creating topics");
      return createTableTopics();
    })
    .then(() => {
      //console.log("Creating users");
      return createTableUsers();
    })
    .then(() => {
      return createTableArticles();
    })
    .then(() => {
      return createTableComments();
    })
    .then(() => {
      return insertDataTopics(topicData);
    })
    .then(() => {
      return insertUsersData(userData);
    })
    .then(() => {
      return insertArticlesData(articleData);
    })
    .then(({ rows }) => {
      return insertCommentsData(rows, commentData);
    });
};

function createTableTopics() {
  return db.query(`CREATE TABLE topics(
                   slug VARCHAR PRIMARY KEY,
                   description VARCHAR,
                   img_url VARCHAR(1000))`);
}

function createTableUsers() {
  return db.query(`CREATE TABLE users(
                   username VARCHAR PRIMARY KEY,
                   name VARCHAR,
                   avatar_url VARCHAR(1000))`);
}

function createTableArticles() {
  return db.query(`CREATE TABLE articles(
                   article_id SERIAL PRIMARY KEY,
                   title VARCHAR,
                   topic VARCHAR REFERENCES topics(slug) ON DELETE CASCADE,
                   author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
                   body TEXT,
                   created_at TIMESTAMP,
                   votes INTEGER DEFAULT  0,
                   article_img_url VARCHAR(1000))`);
}

function createTableComments() {
  return db.query(`CREATE TABLE comments(
                   comment_id SERIAL PRIMARY KEY,
                   article_id INTEGER REFERENCES articles(article_id) ON DELETE CASCADE,
                   body TEXT,
                   votes INTEGER DEFAULT  0,
                   author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
                   created_at TIMESTAMP
                  )`);
}

function insertDataTopics(topicData) {
  const topics = topicData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  });
  return db.query(
    format(
      `INSERT INTO topics 
                  (slug,description,img_url)
                  VALUES
                  %L RETURNING *;`,
      topics
    )
  );
}

function insertUsersData(userData) {
  const users = userData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
  return db.query(
    format(
      `INSERT INTO users 
                  (username,name,avatar_url)
                  VALUES
                  %L RETURNING *;`,
      users
    )
  );
}

function insertArticlesData(articleData) {
  const articles = articleData.map((article) => {
    return [
      article.title,
      article.topic,
      article.author,
      article.body,
      convertTimestampToDate(article).created_at,
      article.votes === null ? 0 : article.votes,
      article.article_img_url,
    ];
  });

  return db.query(
    format(
      `INSERT INTO articles 
                  (title,topic,author,body,created_at,votes,article_img_url)
                  VALUES
                  %L RETURNING *;`,
      articles
    )
  );
}

function insertCommentsData(rows, commentData) {
  const comments = commentData.map((comment) => {
    const article = rows.find((article) => {
      return article.title === comment.article_title;
    });

    return [
      article.article_id,
      comment.body,
      comment.votes,
      comment.author,
      convertTimestampToDate(comment).created_at,
    ];
  });
  return db.query(
    format(
      `INSERT INTO comments 
                  (article_id,body,votes,author,created_at)
                  VALUES
                  %L RETURNING *;`,
      comments
    )
  );
}
module.exports = seed;
