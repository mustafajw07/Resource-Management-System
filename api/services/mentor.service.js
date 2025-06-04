const Mentor = require("../models/mentor.model");

exports.findAll = async (req, res) => {
  const title = req.query.title;

  Mentor.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving mentors."
      });
    else res.json(data);
  });
};