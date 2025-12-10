const projectRequisition = require("../repository/projectRequisition.repository");

function isValidDate(d) {
    return !isNaN(new Date(d).getTime());
}

function buildValidationErrors(payload, required = []) {
    const errors = [];
    for (const field of required) {
        if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
            errors.push({ field, message: `${field} is required` });
        }
    }
    return errors;
}

/**
 * GET /project-requisitions
 * Returns all project requisition rows.
 * 
 */
exports.findAll = async (req, res) => {
    try {
        const data = await projectRequisition.getAll();
        return res.status(200).json(data);
    } catch (err) {
        const message = (err && err.message) ? err.message : 'Some error occurred while retrieving Project requisition data.';
        return res.status(500).json({ message });
    }
};

/**
 * Create new requisition
 */
exports.create = async (req, res) => {
    try {
        const payload = req.body || {};

        // Basic validation: require projectName and requisitionDate at minimum
        const required = ['projectName', 'requisitionDate'];
        const errors = buildValidationErrors(payload, required);

        if (payload.requisitionDate && !isValidDate(payload.requisitionDate)) {
            errors.push({ field: 'requisitionDate', message: 'requisitionDate must be a valid date' });
        }

        if (payload.fteHeadCount !== undefined && isNaN(Number(payload.fteHeadCount))) {
            errors.push({ field: 'fteHeadCount', message: 'fteHeadCount must be a number' });
        }

        if (errors.length) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const result = await projectRequisition.create(payload);
        return res.status(201).json({ message: 'Created', id: result.insertId });
    } catch (err) {
        console.error('projectRequisition.create error:', err);
        const message = (err && err.message) ? err.message : 'Some error occurred while creating Project requisition.';
        return res.status(500).json({ message });
    }
};

/**
 * Update existing requisition
 */
exports.update = async (req, res) => {
    try {
        const requisitionId = req.params && req.params.id;
        const payload = req.body || {};

        if (!requisitionId) {
            return res.status(400).json({ message: 'requisitionId (url param) is required' });
        }

        // Validate some fields if present
        const errors = [];
        if (payload.requisitionDate && !isValidDate(payload.requisitionDate)) {
            errors.push({ field: 'requisitionDate', message: 'requisitionDate must be a valid date' });
        }
        if (payload.fteHeadCount !== undefined && isNaN(Number(payload.fteHeadCount))) {
            errors.push({ field: 'fteHeadCount', message: 'fteHeadCount must be a number' });
        }

        if (errors.length) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const result = await projectRequisition.update(requisitionId, payload);
        if (result.affectedRows && result.affectedRows > 0) {
            return res.status(200).json({ message: 'Updated' });
        }

        return res.status(404).json({ message: 'Requisition not found' });
    } catch (err) {
        console.error('projectRequisition.update error:', err);
        const message = (err && err.message) ? err.message : 'Some error occurred while updating Project requisition.';
        return res.status(500).json({ message });
    }
};