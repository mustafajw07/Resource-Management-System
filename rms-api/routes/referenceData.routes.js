module.exports = app => {
    const referenceData = require("../services/referenceData.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

   // Retrieve all reference data
    router.get("/", referenceData.findAll);

    app.use('/api/reference-data', router);
};