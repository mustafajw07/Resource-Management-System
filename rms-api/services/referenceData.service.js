const ReferenceDataRepository = require('../repository/referenceData.repository');

/**
 * GET /reference-data
 * Returns all reference data rows.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await ReferenceDataRepository.getAll();
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving reference data.';
    return res.status(500).json({ message });
  }
};