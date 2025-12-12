const sql = require('../database/db.js');
const util = require('util');

// Promisified query helper for the existing mysql pool
const queryAsync = util.promisify(sql.query).bind(sql);

/**
 * ProjectRepository
 * Standard CRUD operations for the `Project` table.
 * Returns/accepts camelCase objects.
 */
const ProjectRepository = {
    /**
     * Get all Projects
     * @returns {Promise<Array<{projectId:number,projectName:string,clientId:number,status:string,startDate:Date,endDate:Date}>>}
     */
    async getAll() {
        const sqlStr = `SELECT project_id, project_name, client_id, status, start_date, end_date
                        FROM project;`;
        const rows = await queryAsync(sqlStr);
        if (!rows || rows.length === 0) return [];
        return rows.map(r => ({
            projectId: r.project_id,
            projectName: r.project_name,
            clientId: r.client_id,
            status: r.status,
            startDate: r.start_date,
            endDate: r.end_date
        }));
    },

    /**
     * Get Project Utilization
     * @returns {Promise<Array<{userId:number,firstName:string,lastName:string,email:string,locationId:number,locationName:string,projectId:number,projectName:string,utilizationPercentage:number,allocationStartDate:Date,allocationEndDate:Date}>>}
     */
    async getUtilization() {
        const sqlStr = `SELECT user_id, first_name, 
                        last_name, email, location_id, location_name, 
                        project_id, project_name, utilization_percentage, 
                        allocation_start_date, allocation_end_date
                        FROM vw_user_project_utilization_details;`;
        const rows = await queryAsync(sqlStr);
        if (!rows || rows.length === 0) return [];
        return rows.map(r => ({
            userId: r.user_id,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            locationId: r.location_id,
            locationName: r.location_name,
            projectId: r.project_id,
            projectName: r.project_name,
            utilizationPercentage: r.utilization_percentage,
            allocationStartDate: r.allocation_start_date,
            allocationEndDate: r.allocation_end_date
        }));
    }
};


module.exports = ProjectRepository;