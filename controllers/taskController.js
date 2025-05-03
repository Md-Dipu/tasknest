const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.render('dashboard/student', { user: req.user, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.addTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  try {
    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user._id,
    });
    await task.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findOneAndDelete({ _id: id, user: req.user._id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
