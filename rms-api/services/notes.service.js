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