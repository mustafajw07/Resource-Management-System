module.exports = app => {
    const interns = require("../services/intern.service");

    let router = require("express").Router();

    // Create a new intern
    router.post("/", interns.create);

    // Retrieve all interns
    router.get("/", interns.findAll);

    router.get("/:id" , interns.findOne);

    app.use('/api/interns', router);
};