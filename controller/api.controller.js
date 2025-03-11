const endpoints = require("../endpoints.json")

const getEndpoints = (request,response) => {
    console.log("i am inside the endpoints")
    response.status(200).send({endpoints})
}

const handleNonExistentEndpoint = (request,response) => {
    console.log("inside handle non existing endpoint")
    response.status(404).send({msg: "Invalid Endpoint!!"});
}

const handleNonExistentInfo = (request,response) => {
    console.log("inside handle non existing data")
    response.status(404).send({msg: "No Data Found!!"});
}

module.exports = {getEndpoints,handleNonExistentEndpoint,handleNonExistentInfo};