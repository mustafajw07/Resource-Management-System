const sql = require("./db.js");

// constructor
const Mentor = function(mentor) {
  this.name = mentor.name;
};

Mentor.getAll = (title, result) => {
  let query = "SELECT * FROM mentor;";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Mentor;