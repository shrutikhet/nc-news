const { fetchCommentsForArticleId } = require("../model/comment.model");


const getCommentsForArticle = (request, response, next) => {
    const {article_id} = request.params;
    if (article_id) {
        fetchCommentsForArticleId(article_id)
        .then((comments) => {
            if(comments.length === 0) {
                return Promise.reject({status: 404, msg : "Comments not Found!!"})
            } else {
                response.status(200).send({comments});
            }
        })
        .catch((err) => {
            next(err);
        }) 
    } 
}

module.exports = {getCommentsForArticle}