const { getUsers } = require("../model/users.model")

const allUsers = (request,response,next) => {
    getUsers()
    .then((users) => {
        response.status(200).send({users});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {allUsers};