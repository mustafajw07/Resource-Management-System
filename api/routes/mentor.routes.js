module.exports = app => {
    const mentors = require("../services/mentor.service");

    let router = require("express").Router();

    // Retrieve all mentors
    router.get("/", mentors.findAll);

    app.use('/api/mentors', router);
};