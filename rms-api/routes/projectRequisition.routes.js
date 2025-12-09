module.exports = app => {
    const projectRequisition = require("../services/projectRequisition.service");
    const roleMiddleware = require("../middleware/auth");
     

    let router = require("express").Router();

    // Retrieve all project requisitions
    router.get("/",projectRequisition.findAll);

    // Create a new project requisition
    router.post("/", projectRequisition.create);

    // Update an existing project requisition by id
    router.put("/:id", projectRequisition.update);

    app.use('/api/project-requisitions', router);
};