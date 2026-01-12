const sql = require('../database/db.js');
const util = require('util');

// Use promisified query for cleaner async/await usage
const queryAsync = util.promisify(sql.query).bind(sql);

/**
 * Repository for fetching RequisitionAuditLog entries.
 * Provides:
 * - getAll(): Fetch all logs
 */
const RequisitionAuditLogRepository = {
  /**
   * Fetch all audit logs.
   * @returns {Promise<Array<Object>>}
   */
  async getAllLogs() {
    const query = `
      SELECT
        audit_id AS auditId,
        requisition_id AS requisitionId,
        field_name AS fieldName,
        old_value AS oldValue,
        new_value AS newValue,
        action_type AS actionType,
        changed_by AS changedBy,
        changed_at AS changedAt
      FROM RequisitionAuditLog
      ORDER BY changed_at DESC, audit_id DESC
    `;
    return queryAsync(query);
  },
  
  /**
   *  logs the requisition state change.
   */
  async logStageChange(requisitionId, oldStage, newStage, changedBy) {
    const query = `
     INSERT INTO RequisitionAuditLog
     (requisition_id, field_name, old_value, new_value, action_type, changed_by)
     VALUES (?, 'Requisition stage', ?, ?, 'UPDATE', ?)
   `;
    return queryAsync(query, [
      requisitionId,
      oldStage,
      newStage,
      changedBy
    ]);
  },

  /**
   *  Fetch logs for a particular requisition.
   */
  async getLogsByRequisitionId(requisitionId) {
    const query = `
     SELECT
       audit_id AS auditId,
       old_value AS oldStage,
       new_value AS newStage,
       changed_by AS changedBy,
       changed_at AS changedAt
     FROM RequisitionAuditLog
     WHERE requisition_id = ?
       AND field_name = 'stage'
     ORDER BY changed_at DESC
   `;
    return queryAsync(query, [requisitionId]);

  },
  
  /**
   *  Updates the requisition stage.
   */
  async updateStage(requisitionId, requisitionStageId) {
    const query = `
    UPDATE Requisition
    SET requisition_stage_id = ?
    WHERE requisition_id = ?
  `;
    return queryAsync(query, [requisitionStageId, requisitionId]);
  }
};
module.exports = RequisitionAuditLogRepository;
