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
        const query = `SELECT * FROM vw_requisition_full;`;

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