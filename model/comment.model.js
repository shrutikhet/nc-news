const db = require("../db/connection")

const fetchCountOfCommentsForId = (article_id) => {
    if (article_id) {
        return db.query(`SELECT * FROM comments where article_id = $1`,[article_id])
        .then(({rows}) => {
            return rows.length;
        })
    }
}

const fetchCommentsForArticleId = (article_id) => {
    
    if (article_id) {
        return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,[article_id])
        .then(({rows}) => {
            return rows;
        })
    }
}

module.exports = {fetchCountOfCommentsForId,fetchCommentsForArticleId}