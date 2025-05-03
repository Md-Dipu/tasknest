const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.userType === 'student') {
    return taskController.getTasks(req, res);
  }
  res.render(`dashboard/${req.user.userType}`, { user: req.user, tasks: [] });
});

module.exports = router;
