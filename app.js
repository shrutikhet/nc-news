const express = require("express");

const app = express();

const {
  getEndpoints,
  handleNonExistentEndpoint,
} = require("./controller/api.controller");

const { getTopics } = require("./controller/topics.controller");

const {
  getArticles,
  getArticlesById,
  updateArticleVotes
} = require("./controller/articles.controller");
const {
  getCommentsForArticle,
  addCommentsForArticle,
  deleteComment
} = require("./controller/comments.controller");
const { allUsers } = require("./controller/users.controller");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.post("/api/articles/:article_id/comments", addCommentsForArticle);

app.patch("/api/articles/:article_id", updateArticleVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.get("/api/users", allUsers )

app.all("/*", handleNonExistentEndpoint);

app.use((err, req, res, next) => {
  console.log("Error Code:", err.code, err.status);
  if (err.status === 404 || err.status === 400) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log("Error Code:", err.code, err.status);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log("Error is:", err.code, err.status);
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
