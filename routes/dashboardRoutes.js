const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middleware/auth');

// Dashboard route
router.get('/', ensureAuthenticated, dashboardController.getDashboard);

module.exports = router;
