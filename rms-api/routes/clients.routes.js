module.exports = app => {
    const client = require("../services/clients.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

   // Retrieve all clients
    router.get("/", client.findAll);

    // Retrieve managers by client id
    router.get("/managers/:id", client.findManagerById);

    app.use('/api/clients', router);
};