const NoteRepository = require('../repository/notes.repository');

/**
 * GET /notes/:id
 * Returns notes by id.
 */
exports.getRequisitionNotes = async (req, res) => {
  try {
    const requisitionId = req.params.id;
    const data = await NoteRepository.getById(requisitionId);
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving notes';
    return res.status(500).json({ message });
  }
};

/**
 * POST /notes
 * Creates a new note.
 * Expected body: { requisitionId: String, noteText: String }
 */
exports.createNote = async (req, res) => {
  try {
    const noteData = req.body;
    const newNote = await NoteRepository.create(noteData, 1); // Assuming '1' is the ID of the user creating the note
    if (!newNote) {
      return res.status(400).json({ message: 'Failed to create note' });
    }
    return res.status(200).json(true);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while creating the note';
    return res.status(500).json({ message });
  }
};