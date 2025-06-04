module.exports = app => {
    const interns = require("../services/intern.service");

    let router = require("express").Router();

    // Create a new intern
    router.post("/", interns.create);

    // Retrieve all interns
    router.get("/", interns.findAll);

    app.use('/api/interns', router);
};