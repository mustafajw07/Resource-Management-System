module.exports = app => {
    const requisitionAuditLog = require("../services/requisitionAuditLog.service");
    const roleMiddleware = require("../middleware/auth");
     

    let router = require("express").Router();

    // Retrieve all project requisitions logs
    router.get("/",requisitionAuditLog.findAll);

    app.use('/api/requisitions-log', router);
};