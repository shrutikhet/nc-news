const endpoints = require("../endpoints.json")

const getEndpoints = (request,response) => {
    console.log("i am inside the endpoints")
    response.status(200).send({endpoints})
}

module.exports = {getEndpoints};