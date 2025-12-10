module.exports = app => {
    const projects = require("../services/project.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

   // Retrieve all projects
    router.get("/", projects.findAll);

    app.use('/api/projects', router);
};