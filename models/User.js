const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['student', 'professional', 'religious'],
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
