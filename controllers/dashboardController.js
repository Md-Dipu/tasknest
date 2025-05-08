const Task = require('../models/Task');
const List = require('../models/List');

exports.getDashboard = async (req, res) => {
  try {
    const lists = await List.find({ user: req.user._id });
    const tasks = await Task.find({ user: req.user._id });
    if (req.user.userType === 'student') {
      res.render('dashboard/student', { user: req.user, lists, tasks });
    } else if (req.user.userType === 'professional') {
      res.render('dashboard/professional', { user: req.user, lists, tasks });
    } else if (req.user.userType === 'religious') {
      res.render('dashboard/religious', { user: req.user, lists, tasks });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
