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

// Task routes
router.post('/add', ensureAuthenticated, taskController.addTask);
router.post('/delete/:id', ensureAuthenticated, taskController.deleteTask);

module.exports = router;
