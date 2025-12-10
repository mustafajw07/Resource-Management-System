const clientRepository = require('../repository/clients.repository');

/**
 * GET /clients
 * Returns all clients rows.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await clientRepository.getAll();
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving clients';
    return res.status(500).json({ message });
  }
};


/**
 * GET /managers/:id
 * Returns all manager.
 */
exports.findManagerById = async (req, res) => {
  try {
    const client_id = req.params.id;
    const data = await clientRepository.getManagersByClientId(client_id);
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving managers';
    return res.status(500).json({ message });
  }
};