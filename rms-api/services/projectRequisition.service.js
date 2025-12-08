const projectRequisition = require("../repository/projectRequisition.repository");

exports.findAll = async (req, res) => {
    try {
        const data = await projectRequisition.getAll();
        return res.json(data);
    } catch (err) {
        // Log error server-side with details for debugging
        console.error('ProjectRequisition.findAll error:', err);
        const message = (err && err.message) ? err.message : 'Some error occurred while retrieving Project requisition data.';
        return res.status(500).json({ message });
    }
};