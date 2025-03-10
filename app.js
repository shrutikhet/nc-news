const express = require("express");

const app = express();

const {getEndpoints} = require("./controller/api.controller")

//app.use(express.json());

app.get('/api', getEndpoints);




module.exports = app;