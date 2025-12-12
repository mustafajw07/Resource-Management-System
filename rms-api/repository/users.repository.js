const sql = require('../database/db.js');
const util = require('util');

// Promisified query helper for the existing mysql pool
const queryAsync = util.promisify(sql.query).bind(sql);

function toSnake(key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * UserRepository
 * Standard CRUD operations for the `user` table.
 * Returns/accepts camelCase objects.
 */
const UserRepository = {
    /**
     * Get all users
     * @returns {Promise<Array<{id:number,firstName:string,lastName:string,email:string,jobTitleId:number,locationId:number}>>}
     */
    async getAll() {
        const sqlStr = `SELECT user_id, first_name, last_name, email, job_title_id, location_id FROM user`;
        const rows = await queryAsync(sqlStr);
        return rows.map(r => ({
            id: r.user_id,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            jobTitleId: r.job_title_id,
            locationId: r.location_id
        }));
    },

    /**
     * Get single user by id
     * @param {number|string} id
     */
    async getById(id) {
        const sqlStr = `SELECT user_id, first_name, last_name, email, job_title_id, location_id FROM user WHERE user_id = ? LIMIT 1`;
        const rows = await queryAsync(sqlStr, [id]);
        if (!rows || rows.length === 0) return null;
        const r = rows[0];
        return [{
            id: r.user_id,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            jobTitleId: r.job_title_id,
            locationId: r.location_id
        }];
    }
};

module.exports = UserRepository;