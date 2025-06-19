const colors = require('colors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const listRoutes = require('./routes/listRoutes');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Passport configuration
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'No user found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Home route
app.get('/', (req, res) => res.render('index', { user: req.user }));

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/lists', listRoutes);
app.use('/tasks', taskRoutes);

/**
 * Connect to the database and start the server
 */
async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(colors.yellow.bold(`[INFO] Server running on port ${PORT}`));
    });
  } catch (err) {
    console.error(colors.red.bold('Failed to connect to the database:', err));
  }
}

startServer();

/**
 * Handle 404 errors
 */
app.use((req, res) => {
  res.status(404).render('404', { user: req.user });
});

/**
 * Handle 500 errors
 */
app.use((err, req, res, next) => {
  console.error(colors.red.bold('Server Error:', err));
  res.status(500).render('500', { user: req.user, error: err.message });
});

module.exports = app;
