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
    }
};

module.exports = ProjectRepository;