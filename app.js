const express = require("express");

const app = express();

const { getEndpoints, handleNonExistentEndpoint } = require("./controller/api.controller");

const { getTopics } = require("./controller/topics.controller");

const { getArticles } = require("./controller/articles.controller");

//app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

app.all("/*", handleNonExistentEndpoint)

app.use((err, req, res, next) => {
    console.log("Error:", err.code);
})

app.use((err, req, res, next) => {
  console.log("error 22P02");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log("Server Error");
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
