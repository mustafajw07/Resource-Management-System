const requisitionAuditLog = require('../repository/requisitionAuditLog.repository');

/**
 * GET /requisitions-log
 * Returns all requisitionlogs.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await requisitionAuditLog.getAllLogs();
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving logs';
    return res.status(500).json({ message });
  }
};