const requisitionAuditLog = require('../repository/requisitionAuditLog.repository');

/**
 * GET /requisitions-log
 * Returns all requisition logs.
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

/**
 * GET /:id
 * Returns requisition logs by ID.
 */
exports.findByRequisitionId = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await requisitionAuditLog.getLogsByRequisitionId(id);
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving logs for requisition';
    return res.status(500).json({ message });
  }
};
