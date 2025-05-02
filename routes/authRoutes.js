const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

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

module.exports = router;
