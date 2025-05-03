const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const taskController = require('../controllers/taskController');

router.get('/', (req, res) => res.render('index', { user: req.user }));
router.get('/register', (req, res) =>
  res.render('auth/register', { user: req.user })
);
router.post('/register', authController.register);
router.get('/login', (req, res) =>
  res.render('auth/login', { user: req.user })
);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Task routes
router.get('/dashboard', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  if (req.user.userType === 'student') {
    return taskController.getTasks(req, res);
  }
  res.render(`dashboard/${req.user.userType}`, { user: req.user, tasks: [] });
});
router.post('/tasks', taskController.addTask);
router.post('/tasks/:id/delete', taskController.deleteTask);

module.exports = router;
