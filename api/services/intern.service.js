const Intern = require("../models/intern.model");

exports.findAll = async (req, res) => {

  Intern.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving interns."
      });
    else res.json(data);
  });
};


exports.create = async (req , res) => {

  const intern = new Intern({
    name: req.body.name,
    joiningDate: req.body.joiningDate,
    onGoingTech: req.body.onGoingTech
  });

  Intern.create(intern ,(err , data) => {
    if(err) 
      res.status(500).send({
        message:
          err.message || "Some error occurred while adding new record."
      });
    else res.json(data);
  });
}

exports.findOne = (req, res) => {
  Intern.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Intern with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Intern with id " + req.params.id
        });
      }
    } else res.json(data);
  });
};
