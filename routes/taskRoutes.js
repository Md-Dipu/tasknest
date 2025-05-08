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
router.post('/update/:id', ensureAuthenticated, taskController.updateTask);
router.patch(
  '/update/:id/field',
  ensureAuthenticated,
  taskController.updateTaskField
);
router.post('/delete/:id', ensureAuthenticated, taskController.deleteTask);
router.patch(
  '/update-title/:id',
  ensureAuthenticated,
  taskController.updateTaskTitle
);

module.exports = router;
