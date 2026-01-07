module.exports = app => {
    const note = require("../services/notes.service");
    const roleMiddleware = require("../middleware/auth");

    let router = require("express").Router();

    // Retrieve notes by requisitionId
    router.get("/:id", note.getRequisitionNotes);

    // Create a new note
    router.post("/", note.createNote);

    app.use('/api/notes', router);
};