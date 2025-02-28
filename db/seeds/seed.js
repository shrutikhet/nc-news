const db = require("../connection");
const format = require("pg-format");
const {convertTimestampToDate} = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  console.log("Seeding is happening:");
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      console.log("Dropping table comments and articles if exists");
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      console.log("Dropping table topics");
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      console.log("Dropping table users");
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      console.log("Creating topics");
      return createTableTopics();
    })
    .then(() => {
      console.log("Creating users");
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
    .then((topics) => {
      // const users = insertUsersData(userData);
      return Promise.all([insertUsersData(userData), topics]);
    })
    .then((data) => {
      // console.log("inside articles insert checking users:",data[0].rows);
      return insertArticlesData(data[0].rows, data[1].rows, articleData);
    })
    .then((data) => {
      return insertCommentsData(data, commentData);
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
  console.log(topicData);
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
  // console.log(userData);
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

function insertArticlesData(users, topics, articleData) {
  const articles = articleData.map((article) => {
    const topic = topics.find((topic) => {
      return article.topic === topic.slug;
    });

    const author = users.map((user) => {
      return user.username === article.author;
    });
    return [
      article.title,
      topic.slug,
      author.username,
      article.body,
      convertTimestampToDate(article.created_at).created_at,
      article.votes,
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

function insertCommentsData(data, commentData) {
  const comments = commentData.map((comment) => {
    const article = data.rows.find((article) => {
      return article.title === comment.article_title;
    });

    return [
      article.article_id,
      comment.body,
      comment.votes,
      article.author,
      convertTimestampToDate(comment.created_at).created_at,
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
