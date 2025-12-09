const projectRequisition = require("../repository/projectRequisition.repository");

exports.findAll = async (req, res) => {
    try {
        const data = await projectRequisition.getAll();
        return res.status(200).json(data);
    } catch (err) {
        const message = (err && err.message) ? err.message : 'Some error occurred while retrieving Project requisition data.';
        return res.status(500).json({ message });
    }
};