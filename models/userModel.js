const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
    minLength: [3, 'user name must be at least 3 characters'],
    maxLength: [16, 'user name must be less than 16 characters'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'provide a valid email '],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, 'enter your password'],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'guide-lead', 'admin'],
    default: 'user',
  },
  passwordConfirm: {
    type: String,
    minLength: 8,
    required: [true, 'enter your confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'paswords are not the same',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
});

userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.ChangedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = this.passwordChangeAt.getTime() / 1000;
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model('User', userSchema);
