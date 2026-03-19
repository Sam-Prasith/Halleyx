const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboard,
  saveDashboard,
  updateDashboard,
} = require('../controllers/dashboardController');

router.use(protect);

router.route('/')
  .get(getDashboard)
  .post(saveDashboard)
  .put(updateDashboard);

module.exports = router;
