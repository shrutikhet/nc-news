const db = require("./connection.js");
const inquirer = require("inquirer");

const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/development-data/index");

const seed = require("./seeds/seed.js");

const questions = [
  {
    name: "tableName",
    message: "Which table data do you want to see?",
    default: "topics",
  },
];

getData = (tableName) => {
  return db.query(`select * from ${tableName};`).then((data) => {});
};
seed({ topicData, userData, articleData, commentData })
  .then(() => {
    return inquirer.prompt(questions);
  })
  .then((answers) => {
    getData(answers.tableName);
  });
