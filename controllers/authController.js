const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.register = async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, email, password: hashedPassword, userType });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: false,
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
