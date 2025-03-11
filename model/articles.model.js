const db = require("../db/connection")


const fetchArticles = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[article_id])
        .then(({rows}) => {
            console.log("fetching articles:", rows);
            return rows;
        })
}

module.exports = {fetchArticles}