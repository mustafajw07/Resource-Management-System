module.exports = app => {
    const projectRequisition = require("../services/projectRequisition.service");

    let router = require("express").Router();

    // Retrieve all interns
    router.get("/", projectRequisition.findAll);

    app.use('/api/project-requisitions', router);
};