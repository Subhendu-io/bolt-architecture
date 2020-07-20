const userService = require('../services/user.service');

module.exports.getUserByEmail = async (req, res, next) => {
  try {
    const _email = req.user.email;
    const _user = await userService.findUserByEmail(_email, next);
    if(_user && _user['email']) {
      return res.send({
        'success' : true,
        'user'    : _user,
        'message' : 'User data sent successfully.',
      });
    } else {
      return next({
        status  : 500,
        title   : 'User Not found!',
        message : 'Sorry, We could not find any user with this email.'
      });
    }
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due to an internal error, we could not find your details at this time.'
    });
  }
};