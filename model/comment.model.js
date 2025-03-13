const db = require("../db/connection")
const format = require("pg-format");

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

const insertCommentsForArticle = (article_id, username, body) => {
    console.log("inside insert comments:",article_id,body,0,username,Date.now());
    const promises =[username, body];
    
   
        return username && body && db.query(`INSERT INTO comments (article_id,body,author)
                        VALUES
                        ($1,$2,$3) RETURNING *;`,[article_id,body,username])
                .then(({rows}) => {
                    //console.log("rows:",rows);
                    return rows[0];
                })
    
}

module.exports = {fetchCountOfCommentsForId,fetchCommentsForArticleId,insertCommentsForArticle}