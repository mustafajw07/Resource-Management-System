const sql = require('../database/db.js');

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

        return new Promise((resolve, reject) => {
            sql.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    },
};

module.exports = ProjectRequisition;