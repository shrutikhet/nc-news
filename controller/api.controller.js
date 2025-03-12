const endpoints = require("../endpoints.json");

const getEndpoints = (request, response) => {
  response.status(200).send({ endpoints });
};

const handleNonExistentEndpoint = (request, response) => {
  response.status(404).send({ msg: `Invalid Endpoint!!` });
};

const handleNonExistentInfo = (request, response) => {
  response.status(404).send({ msg: "No Data Found!!" });
};

module.exports = {
  getEndpoints,
  handleNonExistentEndpoint,
  handleNonExistentInfo,
};
