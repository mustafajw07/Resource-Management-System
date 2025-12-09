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
            requisition_type_name AS requisitionTypeName,
            requisition_stage_id AS requisitionStageId,
            requisition_stage_name AS requisitionStageName,
            fulfillment_medium_id AS fulfillmentMediumId,
            fulfillment_medium_name AS fulfillmentMediumName,
            urgency_id AS urgencyId,
            urgency_name AS urgencyName,
            requisition_status_id AS requisitionStatusId,
            requisition_status_name AS requisitionStatusName,
            capability_area_id AS capabilityAreaId,
            capability_area_name AS capabilityAreaName,
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
            FROM resource_planning_dev.vw_requisition_full;
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