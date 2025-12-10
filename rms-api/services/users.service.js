const usersRepository = require('../repository/users.repository');

/**
 * GET /reference-data
 * Returns all reference data rows.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await usersRepository.getAll();
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving users data.';
    return res.status(500).json({ message });
  }
};