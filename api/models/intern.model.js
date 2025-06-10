const sql = require("./db.js");

// constructor
const Intern = function(intern) {
  this.name = intern.name;
  this.joiningDate = intern.joiningDate;
  this.onGoingTech = intern.onGoingTech;
};

Intern.getAll = (result) => {
  let query = `SELECT  intern.id, intern.name, intern.joining_date , technology.tech_name
                FROM intern
                JOIN technology
                ON intern.ongoing_tech = technology.id;`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Intern.create = (body, result) => {
  sql.query("INSERT INTO intern SET ?", body, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, "Added Successfully!");
  });
};

Intern.findById = (id, result) => {
  sql.query(`SELECT * FROM intern WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

module.exports = Intern;