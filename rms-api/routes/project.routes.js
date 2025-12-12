module.exports = app => {
    const projects = require("../services/project.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

   // Retrieve all projects
    router.get("/", projects.findAll);

    // Retrieve a project utilization
    router.get("/utilization", projects.getProjectUtilization);

    app.use('/api/projects', router);
};