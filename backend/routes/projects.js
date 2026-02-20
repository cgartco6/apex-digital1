const router = require('express').Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  uploadProjectFiles
} = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/files', uploadProjectFiles);

module.exports = router;
