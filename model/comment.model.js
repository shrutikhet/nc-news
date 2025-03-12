const db = require("../db/connection")

const fetchCountOfCommentsForId = (article_id) => {
    if (article_id) {
        db.query(`SELECT * FROM comments where article_id = $1`,[article_id])
        .then(({rows}) => {
            return rows.length;
        })
    }
}

module.exports = {fetchCountOfCommentsForId}