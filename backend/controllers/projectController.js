const { Project, User } = require('../models');
const { projectQueue } = require('../queue/bull');
const logger = require('../utils/logger');

exports.createProject = async (req, res) => {
  try {
    const { type, package, style, requirements, price } = req.body;

    const project = await Project.create({
      userId: req.user.id,
      type,
      package,
      style,
      requirements,
      price,
      status: 'pending_payment'
    });

    logger.info(`Project created: ${project.id}`);

    res.status(201).json(project);
  } catch (error) {
    logger.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(projects);
  } catch (error) {
    logger.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    logger.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.update(req.body);

    res.json(project);
  } catch (error) {
    logger.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    logger.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

exports.uploadProjectFiles = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // File upload logic here (using multer or similar)
    const files = req.files; // Assuming multer is set up

    await project.update({
      files: { ...project.files, ...files }
    });

    res.json({ message: 'Files uploaded successfully', files });
  } catch (error) {
    logger.error('Upload files error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};
