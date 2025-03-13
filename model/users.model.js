const db = require("../db/connection")


const usersExists = (username) => {
    return  db.query(`select * from users where username = $1`,[username])
            .then(({rows}) => {
                if(rows.length !== 0) {
                        return true;
                }
                return false;
            })
}


const getUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

module.exports = {usersExists, getUsers};