module.exports = app => {
    const referenceData = require("../services/referenceData.service");

    let router = require("express").Router();

    // Retrieve all interns
    router.get("/", referenceData.findAll);

    app.use('/api/reference-data', router);
};