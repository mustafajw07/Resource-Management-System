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
        const sqlStr = `SELECT 
                    v.user_id,
                    v.manager_id,
                    CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
                    v.is_primary_project,
                    v.first_name,
                    v.last_name,
                    v.email,
                    v.location_id,
                    v.location_name,
                    v.project_id,
                    v.project_name,
                    v.utilization_percentage,
                    v.allocation_start_date,
                    v.allocation_end_date
                FROM vw_user_project_utilization_details v
                LEFT JOIN user m ON v.manager_id = m.user_id;`;
        const rows = await queryAsync(sqlStr);
        if (!rows || rows.length === 0) return [];
        return rows.map(r => ({
            userId: r.user_id,
            managerId: r.manager_id,
            managerName: r.manager_name,
            userName: r.first_name + ' ' + r.last_name,
            isPrimaryProject: r.is_primary_project === 0 ? false : true,
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