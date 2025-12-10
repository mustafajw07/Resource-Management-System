module.exports = app => {
    const users = require("../services/users.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

   // Retrieve all users data
    router.get("/", users.findAll);

    app.use('/api/users', router);
};