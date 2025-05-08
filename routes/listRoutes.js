const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// List routes
router.post('/add', ensureAuthenticated, listController.addList);
router.post('/delete/:id', ensureAuthenticated, listController.deleteList);
router.post(
  '/set-default/:id',
  ensureAuthenticated,
  listController.setDefaultList
);
router.post(
  '/unset-default',
  ensureAuthenticated,
  listController.unsetDefaultList
);

module.exports = router;
