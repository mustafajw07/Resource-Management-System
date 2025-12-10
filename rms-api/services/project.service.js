const ProjectRepository = require('../repository/project.repository');

/**
 * GET /projects
 * Returns all projects.
 */
exports.findAll = async (req, res) => {
  try {
    const data = await ProjectRepository.getAll();
    return res.status(200).json(data);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Some error occurred while retrieving projects';
    return res.status(500).json({ message });
  }
};