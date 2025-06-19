const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const { ensureAuthenticated } = require('../middleware/auth');

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
router.patch('/update/:id', ensureAuthenticated, listController.updateList);
router.post('/share/:id', ensureAuthenticated, listController.shareList);

module.exports = router;
