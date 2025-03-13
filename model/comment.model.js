const db = require("../db/connection")
const format = require("pg-format");
const { usersExists } = require("./users.model");

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
   
    if(username &&  username.length !== 0) {
      return usersExists(username)
            .then((userExists) => {
                if(userExists) {
                    return db.query(`INSERT INTO comments (article_id,body,author)
                        VALUES
                        ($1,$2,$3) RETURNING *;`,[article_id,body,username]);
                } else {
                    return Promise.reject({status: 400, msg: `${username} does not exists!! Create first`})
                }
            })
            .then(({rows}) => {
                return rows[0];
            })
    } else {
        return Promise.reject({status: 400, msg: "Username does not exists!!"})
    }
    
}

const deleteCommentQuery = (comment_id) => {
    console.log("Comment id to be deleted:",comment_id);
    return db.query(`DELETE FROM comments where comment_id = $1 returning *;`, [comment_id])
            .then(({rows}) => {
                console.log("rows that got deleted:",rows);
                return rows;
            })
}

module.exports = {fetchCountOfCommentsForId,fetchCommentsForArticleId,insertCommentsForArticle,deleteCommentQuery}