const express = require("express");

const app = express();

const {getEndpoints} = require("./controller/api.controller")

const {getTopics} = require("./controller/topics.controller")

//app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid input" });
    } else next(err);
  });


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Server Error!"});
});




module.exports = app;