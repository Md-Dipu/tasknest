const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { ensureAuthenticated } = require('../middleware/auth');

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
