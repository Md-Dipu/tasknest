const Task = require('../models/Task');
const List = require('../models/List');

exports.getDashboard = async (req, res) => {
  // Fetch lists owned by the user or shared with the user
  const lists = await List.find({
    $or: [{ user: req.user._id }, { sharedWith: req.user._id }],
  });

  // Fetch tasks that belong to the lists
  const tasks = await Task.find({
    list: { $in: lists.map((list) => list._id) },
  });

  // Render the appropriate dashboard based on user type
  if (req.user.userType === 'student') {
    res.render('dashboard/student', { user: req.user, lists, tasks });
  } else if (req.user.userType === 'professional') {
    res.render('dashboard/professional', { user: req.user, lists, tasks });
  } else if (req.user.userType === 'religious') {
    res.render('dashboard/religious', { user: req.user, lists, tasks });
  } else {
    res.redirect('/');
  }
};
