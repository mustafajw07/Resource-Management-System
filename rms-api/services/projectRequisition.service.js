const projectRequisition = require("../repository/projectRequisition.repository");
const { check, validationResult } = require('express-validator');

/**
 * GET /project-requisitions
 * Returns all project requisition rows.
 * 
 */
exports.findAll = async (req, res) => {
    try {
        const data = await projectRequisition.getAll();
        const THRESHOLD_DAYS = 15;
        const today = new Date();
        const updatedData = data.map(item => {
            const onboardingDate = new Date(item.tentativeOnboardingDate);
            let diffDays = null;
            let urgency = 'UNKNOWN';

            if (!isNaN(onboardingDate)) {
                const diffTime = onboardingDate - today;
                diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) {
                    urgency = 'OVERDUE';
                } else if (diffDays <= THRESHOLD_DAYS) {
                    urgency = 'Immediate';
                } else {
                    urgency = 'Long Term';
                }
            }

            return {
                ...item,
                urgency
            };
        });

        return res.status(200).json(updatedData);
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
        // Run express-validator checks programmatically
        await check('requisitionDate', 'requisitionDate is required').notEmpty().run(req);
        await check('requisitionDate', 'requisitionDate must be a valid date').optional({ checkFalsy: true }).isISO8601().run(req);
        await check('fteHeadCount', 'fteHeadCount must be a number').optional({ checkFalsy: true }).isNumeric().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        const payload = req.body || {};
        const result = await projectRequisition.create(payload);
        return res.status(201).json(true);
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
        // Run express-validator checks for optional fields
        await check('requisitionDate', 'requisitionDate must be a valid date').optional({ checkFalsy: true }).isISO8601().run(req);
        await check('fteHeadCount', 'fteHeadCount must be a number').optional({ checkFalsy: true }).isNumeric().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        const result = await projectRequisition.update(requisitionId, payload);
        if (result.affectedRows && result.affectedRows > 0) {
            return res.status(200).json(true);
        }

        return res.status(404).json({ message: 'Requisition not found' });
    } catch (err) {
        console.error('projectRequisition.update error:', err);
        const message = (err && err.message) ? err.message : 'Some error occurred while updating Project requisition.';
        return res.status(500).json({ message });
    }
};