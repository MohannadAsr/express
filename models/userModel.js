const Mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please insert your name'],
  },
  email: {
    type: String,
    required: [true, 'Please insert your E-mail'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'please Provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please provide a password'],
    select: false,
  },
  blocked: {
    type: Boolean,
    default: false,
    select: false,
  },
  changedPassDate: {
    type: Date,
    default: null,
  },
});

// Encrypt the password before save it only if not modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async (userPassword, reqPassword) => {
  return await bcrypt.compare(userPassword, reqPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  // check if password changed
  if (this.changedPassDate) {
    const changePassTimeStamp = parseInt(
      this.changedPassDate.getTime() / 1000,
      10
    );

    return changePassTimeStamp > JWTTimeStamp ? true : false;
  }
  // if not changed
  return false;
};

const User = Mongoose.model('User', userSchema);

module.exports = User;
