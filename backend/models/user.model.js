const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  'email': {
    type      : String,
    required  : 'Email can\'t be empty.',
    lowercase : true,
    unique    : true,
    trim      : true,
  },
  'first_name': {
    type     : String,
    required : 'First name can\'t be empty.',
  },
  'last_name': {
    type     : String,
    required : 'Last name can\'t be empty.',
  },
  'password': {
    type      : String,
    trim      : true,
    minlength : [4, 'Password must be at least 4 character long']
  },
  'roles': {
    type: [Object],
  },
  saltSecret: String
}, {
  timestamps: true,
});

userSchema.path('email').validate((val) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid email, please enter a valid email.');

userSchema.pre('save', function(next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema, 'app_user');

module.exports = User;