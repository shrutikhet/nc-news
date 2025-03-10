const db = require("../db/connection")

const fetchTopics = () => {
    return db.query("Select * from topics;")
           .then(({rows}) => {
            console.log(rows);
                return rows;
           })
}

module.exports = {fetchTopics}