const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: false, unique: true, sparse: true }, // Add sparse: true
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
});

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Pre-validate hook to enforce password requirement for non-Google users
userSchema.pre('validate', function (next) {
  if (!this.googleId && !this.password) {
    this.invalidate('password', 'Password is required for non-Google users');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);