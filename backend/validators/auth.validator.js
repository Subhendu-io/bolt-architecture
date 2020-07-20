const { check } = require('express-validator');

exports.login = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
];

exports.register = [
  check('first_name', 'Your email is not valid').exists().notEmpty(),
  check('last_name', 'Your email is not valid').exists().notEmpty(),
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
  check('phone', 'Your email is not valid').exists().notEmpty(),
  check('company', 'Your email is not valid').exists().notEmpty(),
  check('interest', 'Your email is not valid'),
  check('is_agreed', 'Your email is not valid').exists().isBoolean(),
];

exports.sendVerificationEmail = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
  check('deco_email_type', 'Invalid application access').exists().isIn(['REGISTER', 'FORGOT_PASSWORD'])
];

exports.setPassword = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
  check('token', 'Your token is not valid').exists().notEmpty(),
  check('password', 'Your password is not valid').exists().notEmpty().isLength({ min: 8, max: 50 }),
  check('confirm_password', 'Your confirm password is not valid').exists().notEmpty().isLength({ min: 8, max: 50 })
];

exports.checkUser = [
  check('email', 'Your email is not valid').exists().notEmpty().isEmail(),
];