const User = require('../models/User');
const List = require('../models/List');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Default lists and task configuration by user type
const defaultConfig = {
  student: {
    lists: [
      { name: 'To Do', isDefault: true },
      { name: 'In Progress', isDefault: false },
      { name: 'Done', isDefault: false },
    ],
    defaultTask: { title: 'Start a new assignment', listIndex: 0 },
  },
  professional: {
    lists: [
      { name: 'Backlog', isDefault: true },
      { name: 'Working On', isDefault: false },
      { name: 'Completed', isDefault: false },
    ],
    defaultTask: { title: 'Review project roadmap', listIndex: 0 },
  },
  religious: {
    lists: [
      { name: 'Daily Practices', isDefault: true },
      { name: 'Community Tasks', isDefault: false },
      { name: 'Reflection', isDefault: false },
    ],
    defaultTask: { title: 'Morning prayer', listIndex: 0 },
  },
};

exports.getRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

exports.register = async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      userType: userType || 'student',
    });
    await user.save();

    // Create default lists sequentially to preserve order
    const config = defaultConfig[userType || 'student'];
    const lists = [];
    for (const listConfig of config.lists) {
      const list = await new List({
        name: listConfig.name,
        isDefault: listConfig.isDefault,
        user: user._id,
      }).save();
      lists.push(list);
    }

    // Create default task in the default list
    const defaultList = lists[config.defaultTask.listIndex];
    const task = new Task({
      title: config.defaultTask.title,
      list: defaultList._id,
      user: user._id,
    });
    await task.save();

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Registration failed' });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.login = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: false,
});

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.redirect('/');
  });
};
