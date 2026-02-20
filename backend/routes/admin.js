const router = require('express').Router();
const {
  getDashboard,
  getUsers,
  getUser,
  updateUser,
  getProjects,
  getPayments,
  getPayouts,
  processPayouts
} = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.get('/projects', getProjects);
router.get('/payments', getPayments);
router.get('/payouts', getPayouts);
router.post('/payouts/process', processPayouts);

module.exports = router;
