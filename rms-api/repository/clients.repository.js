const sql = require('../database/db.js');
const util = require('util');

// Promisified query helper for the existing mysql pool
const queryAsync = util.promisify(sql.query).bind(sql);

/**
 * ClientRepository
 * Standard CRUD operations for the `Client` and `OnShoreManager` table.
 * Returns/accepts camelCase objects.
 */
const ClientRepository = {
    /**
     * Get all clients
     * @returns {Promise<Array<{client_id:number,client_name:string}>>}
     */
    async getAll() {
        const sqlStr = `SELECT client_id, client_name
                        FROM client
                        where is_active = 1;`;
        const rows = await queryAsync(sqlStr);
        return rows.map(r => ({
            clientId: r.client_id,
            clientName: r.client_name
        }));
    },

    /**
     * Get managers by client id
     * @param {number|string} client_id
     */
    async getManagersByClientId(client_id) {
        const sqlStr = `SELECT id, manager_name, project_id, client_id FROM onshoremanager where client_id = ?;`;
        const rows = await queryAsync(sqlStr, [client_id]);
        if (!rows || rows.length === 0) return [];
        const r = rows[0];
        return [{
            managerId: r.id,
            managerName: r.manager_name,
            projectId: r.project_id,
            clientId: r.client_id
        }];
    }
};

module.exports = ClientRepository;