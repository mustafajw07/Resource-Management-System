const sql = require('../database/db.js');
const util = require('util');

// Promisified query helper for the existing mysql pool
const queryAsync = util.promisify(sql.query).bind(sql);

/**
 * NoteRepository.
 */
const NoteRepository = {
    /**
     * Get notes by requisition id
     * @param {number|string} id
     */
    async getById(id) {
        const sqlStr = `SELECT
                        rn.note_text,
                        u.first_name AS created_by_name,
                        rn.created_at
                    FROM RequisitionNote rn
                    LEFT JOIN user u
                        ON rn.created_by = u.user_id
                    WHERE rn.requisition_id = ?
                    ORDER BY rn.created_at DESC;`;
        const rows = await queryAsync(sqlStr, [id]);
        if (!rows || rows.length === 0) return null;
        const r = rows;
        return r.map((item) => {
            return {
                noteText: item.note_text,
                createdByName: item.created_by_name,
                createdAt: item.created_at
            };
        });
    },

    /**
     * Create a new note
     * @param {Object} noteData
     * @param {number} noteData.requisitionId
     * @param {string} noteData.noteText
     * @param {number} createdBy
     */
    async create(noteData, createdBy) {
        const sqlStr = `INSERT INTO RequisitionNote (requisition_id, note_text, created_by, created_at)
                        VALUES (?, ?, ?, NOW());`;
        const rows = await queryAsync(sqlStr, [noteData.requisitionId, noteData.noteText, createdBy]);
        return rows;
    }
};

module.exports = NoteRepository;