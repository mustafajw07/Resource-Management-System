const sql = require('../database/db.js');
const util = require('util');

// Use promisified query for cleaner async/await usage
const queryAsync = util.promisify(sql.query).bind(sql);

function toSnake(key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// Convert a value to MySQL DATETIME string (YYYY-MM-DD HH:MM:SS)
function toSqlDate(value) {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Repository for project requisition data access.
 * Exposes async functions that return Promises.
 */
const ProjectRequisition = {
    /**
     * Retrieve all project requisition data rows with their category information.
     */
    async getAll() {
        const query = `
            SELECT
            requisition_id AS requisitionId,
            requisition_date AS requisitionDate,
            project_id AS projectId,
            project_name AS projectName,
            client_id AS clientId,
            client_name AS clientName,
            project_status AS projectStatus,
            project_start_date AS projectStartDate,
            project_end_date AS projectEndDate,
            requisition_type_id AS requisitionTypeId,
            requisition_type AS requisitionType,
            requisition_stage_id AS requisitionStageId,
            requisition_stage AS requisitionStage,
            skill_id AS skillId,
            skill AS skill,
            fulfillment_medium_id AS fulfillmentMediumId,
            fulfillment_medium AS fulfillmentMedium,
            requisition_status_id AS requisitionStatusId,
            requisition_status AS requisitionStatus,
            hiring_poc_id AS hiringPocId,
            hiring_poc_name AS hiringPocName,
            hiring_poc_email AS hiringPocEmail,
            client_poc_name AS clientPocName,
            fte_head_count AS fteHeadCount,
            fte_total_allocation AS fteTotalAllocation,
            fulfilled_allocation AS fulfilledAllocation,
            tentative_onboarding_date AS tentativeOnboardingDate,
            ageing_days AS ageingDays
            FROM vw_requisition_full WHERE requisition_status <> 'Complete' AND requisition_stage <> 'Closure' AND requisition_date   >= (CURDATE() - INTERVAL 15 DAY);
        `;

        return queryAsync(query);
    },

    async create(data = {}) {
        const allowed = [
            'requisitionDate',
            'projectId',
            'requisitionTypeId',
            'requisitionStageId',
            'hiringPocId',
            'clientPocId',
            'fulfillmentMediumId',
            'skillId',
            'requisitionStatusId',
            'fteHeadCount',
            'fteTotalAllocation',
            'fulfilledAllocation',
            'tentativeOnboardingDate',
            'ageingDays',
            'notes'
        ];

        const cols = [];
        const placeholders = [];
        const values = [];

        const dateFields = new Set(['requisitionDate', 'tentativeOnboardingDate']);

        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
                cols.push(toSnake(key));
                placeholders.push('?');

                if (dateFields.has(key)) {
                    const sqlDate = toSqlDate(data[key]);
                    if (sqlDate === null) {
                        throw new Error(`${key} is not a valid date`);
                    }
                    values.push(sqlDate);
                } else {
                    values.push(data[key]);
                }
            }
        }

        if (cols.length === 0) {
            throw new Error('No valid fields provided for insert');
        }

        // 1️⃣ Insert requisition
        const sqlStr =
            `INSERT INTO requisition (${cols.join(',')})
         VALUES (${placeholders.join(',')})`;

        const result = await queryAsync(sqlStr, values);
        const requisitionId = result.insertId;

        // 2️⃣ Insert note if present
        if (data.notes && data.notes.trim()) {
            const noteSql = `
            INSERT INTO RequisitionNote
            (requisition_id, note_text, created_by)
            VALUES (?, ?, ?)
        `;

            await queryAsync(noteSql, [
                requisitionId,
                data.notes,
                data.hiringPocId || null
            ]);
        }

        return { insertId: requisitionId };
    },


    /**
     * Update an existing requisition by requisitionId. Data is camelCase
     * Returns { affectedRows }
     */
    async update(requisitionId, data = {}) {
        if (!requisitionId) {
            throw new Error('requisitionId is required for update');
        }

        const allowed = [
            'requisitionDate',
            'projectId',
            'requisitionTypeId',
            'requisitionStageId',
            'hiringPocId',
            'clientPocId',
            'fulfillmentMediumId',
            'urgencyId',
            'requisitionStatusId',
            'fteHeadCount',
            'skillId',
            'fteTotalAllocation',
            'fulfilledAllocation',
            'notes',
            'tentativeOnboardingDate',
            'ageingDays',
            'capabilityAreaId'
        ];

        const sets = [];
        const values = [];

        const dateFields = new Set(['requisitionDate', 'tentativeOnboardingDate']);
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
                sets.push(`${toSnake(key)} = ?`);
                if (dateFields.has(key)) {
                    const sqlDate = toSqlDate(data[key]);
                    if (sqlDate === null) {
                        throw new Error(`${key} is not a valid date`);
                    }
                    values.push(sqlDate);
                } else {
                    values.push(data[key]);
                }
            }
        }

        if (sets.length === 0) {
            throw new Error('No valid fields provided for update');
        }

        values.push(requisitionId);
        const sqlStr = `UPDATE requisition SET ${sets.join(', ')} WHERE requisition_id = ?`;
        const result = await queryAsync(sqlStr, values);
        return { affectedRows: result.affectedRows };
    }
};

module.exports = ProjectRequisition;