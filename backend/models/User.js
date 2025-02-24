const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  troop: { type: String, required: true } // New field for troop
}, { timestamps: true });

// Force the collection name to be "logindetails"
module.exports = mongoose.model('User', UserSchema, 'logindetails');
