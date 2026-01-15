module.exports = app => {
    const projects = require("../services/project.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

    // Require authentication for all note routes
    // router.use(roleMiddleware());

    // Retrieve all projects
    router.get("/", projects.findAll);

    // Retrieve a project utilization
    router.get("/utilization", projects.getProjectUtilization);

    app.use('/api/projects', router);
};