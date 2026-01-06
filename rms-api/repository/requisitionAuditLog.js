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
  }
};

module.exports = RequisitionAuditLogRepository;
