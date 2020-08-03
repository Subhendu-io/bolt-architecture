const { check } = require('express-validator');

exports.login = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
];

exports.register = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
  check('firstName', 'Your first name is not valid').exists().notEmpty().isLength({ min: 3, max: 50 }),
  check('lastName', 'Your last name is not valid').exists().notEmpty().isLength({ min: 3, max: 50 }),
  check('username', 'Your username is not valid').exists().notEmpty().isLength({ min: 4, max: 50 }),
  check('password', 'Your password is not valid').exists().notEmpty().isLength({ min: 6, max: 50 }),
  check('phone', 'Your phone number is not valid').exists().notEmpty(),
];