const sql = require('../database/db.js');
const util = require('util');

// Use promisified query for cleaner async/await usage
const queryAsync = util.promisify(sql.query).bind(sql);

function toSnake(key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
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
            fulfillment_medium_id AS fulfillmentMediumId,
            fulfillment_medium AS fulfillmentMedium,
            urgency_id AS urgencyId,
            urgency AS urgency,
            requisition_status_id AS requisitionStatusId,
            requisition_status AS requisitionStatus,
            capability_area_id AS capabilityAreaId,
            capability_area AS capabilityArea,
            hiring_poc_id AS hiringPocId,
            hiring_poc_name AS hiringPocName,
            hiring_poc_email AS hiringPocEmail,
            client_poc_name AS clientPocName,
            fte_head_count AS fteHeadCount,
            fte_total_allocation AS fteTotalAllocation,
            fulfilled_allocation AS fulfilledAllocation,
            notes AS notes,
            tentative_onboarding_date AS tentativeOnboardingDate,
            ageing_days AS ageingDays
            FROM vw_requisition_full;
        `;

        return queryAsync(query);
    },

    /**
     * Create a new requisition record. Accepts an object with properties in camelCase.
     * Returns the newly created insertId.
     */
    async create(data = {}) {
        // Allowed fields we will persist (snake_case derived from these keys)
        const allowed = [
            'requisitionDate','projectId','projectName','clientId','clientName','projectStatus',
            'projectStartDate','projectEndDate','requisitionTypeId','requisitionStageId','fulfillmentMediumId',
            'urgencyId','requisitionStatusId','capabilityAreaId','hiringPocId','hiringPocName','hiringPocEmail',
            'clientPocName','fteHeadCount','fteTotalAllocation','fulfilledAllocation','notes','tentativeOnboardingDate'
        ];

        const cols = [];
        const placeholders = [];
        const values = [];

        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
                cols.push(toSnake(key));
                placeholders.push('?');
                values.push(data[key]);
            }
        }

        if (cols.length === 0) {
            throw new Error('No valid fields provided for insert');
        }

        const sqlStr = `INSERT INTO resource_planning_dev.requisition (${cols.join(',')}) VALUES (${placeholders.join(',')})`;
        const result = await queryAsync(sqlStr, values);
        return { insertId: result.insertId };
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
            'requisitionDate','projectId','projectName','clientId','clientName','projectStatus',
            'projectStartDate','projectEndDate','requisitionTypeId','requisitionStageId','fulfillmentMediumId',
            'urgencyId','requisitionStatusId','capabilityAreaId','hiringPocId','hiringPocName','hiringPocEmail',
            'clientPocName','fteHeadCount','fteTotalAllocation','fulfilledAllocation','notes','tentativeOnboardingDate'
        ];

        const sets = [];
        const values = [];

        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
                sets.push(`${toSnake(key)} = ?`);
                values.push(data[key]);
            }
        }

        if (sets.length === 0) {
            throw new Error('No valid fields provided for update');
        }

        values.push(requisitionId);
        const sqlStr = `UPDATE resource_planning_dev.requisition SET ${sets.join(', ')} WHERE requisition_id = ?`;
        const result = await queryAsync(sqlStr, values);
        return { affectedRows: result.affectedRows };
    }
};

module.exports = ProjectRequisition;