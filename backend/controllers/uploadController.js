const multer = require('multer');
const s3Service = require('../services/s3Service');
const { Project } = require('../models');

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadProjectFile = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { projectId } = req.body;
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No file uploaded' });

      const url = await s3Service.uploadFile(file, `projects/${projectId}`);
      
      // Update project files
      const project = await Project.findByPk(projectId);
      await project.update({
        files: { ...project.files, [file.originalname]: url }
      });

      res.json({ url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];
