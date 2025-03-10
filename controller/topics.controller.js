const {fetchTopics}  = require("../model/topics.model")


const getTopics = (request,response,next) => {
    return fetchTopics()
        .then((topics) =>{
            console.log("controller:",topics)
        response.status(200).send({topics});
        })
        .catch((error) => {
           next(error);
        })
}

module.exports = {getTopics};