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

/**
* GET /requisitions/:id/stage-logs
* Returns stage change history for a requisition
*/
exports.updateRequisitionStage = async (req, res) => {
  try {
    const requisitionId = req.params.id;
    const { requisitionStageId } = req.body;
    const changedBy = req.user?.email || 'system';
    const requisition = await requisitionAuditLog.findById(requisitionId);
    if (!requisition) {
      return res.status(404).json({ message: 'Requisition not found' });
    }
    const oldStageValue = requisition.requisitionStageValue;
    await requisitionAuditLog.updateStage(requisitionId, requisitionStageId);
    const updatedRequisition = await requisitionAuditLog.findById(requisitionId);
    const newStageValue = updatedRequisition.requisitionStageValue;
    await requisitionAuditLog.logStageChange(
      requisitionId,
      oldStageValue,
      newStageValue,
      changedBy
    );
    return res.status(200).json({ message: 'Stage updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update stage' });
  }
};