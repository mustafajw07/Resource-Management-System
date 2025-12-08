const sql = require('../database/db.js');

/**
 * Repository for reference data access.
 * Exposes async functions that return Promises.
 */
const ReferenceDataRepository = {
    /**
     * Retrieve all reference data rows with their category information.
     * @returns {Promise<Array<{id:number,name:string,categoryId:number,categoryName:string}>>}
     */
    async getAll() {
        const query = `
            SELECT
                rd.id AS id,
                rd.name AS name,
                rc.id AS categoryId,
                rc.name AS categoryName
            FROM ReferenceData rd
            JOIN ReferenceCategory rc ON rc.id = rd.category_id
            ORDER BY rd.id
        `;

        return new Promise((resolve, reject) => {
            sql.query(query, (err, results) => {
                if (err) {
                    return reject(err);
                }

                // Map database rows to a consistent camelCase shape
                const mapped = results.map((r) => ({
                    id: r.id,
                    name: r.name,
                    categoryId: r.categoryId,
                    categoryName: r.categoryName,
                }));

                resolve(mapped);
            });
        });
    },
};

module.exports = ReferenceDataRepository;