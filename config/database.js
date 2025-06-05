const colors = require('colors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(colors.green.bold('MongoDB connected'));
  } catch (err) {
    console.error(colors.red.bold(err.message));
    process.exit(1);
  }
};

module.exports = connectDB;
