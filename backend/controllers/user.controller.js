const userService = require('../services/user.service');

module.exports.getUsers = async (req, res, next) => {
  try {
    const _mQuery = {};
    const _mProjection = 'email password username firstName lastName roles saltSecret';
    const _users = await userService.getUsers(_mQuery, _mProjection, next);
    return res.send({
      success : true,
      users   : _users,
      message : 'User data sent successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const _user = req.user;
    const user = await userService.getUser({email: _user.email}, next);
    if(user && user['email']) {
      return res.send({
        'success' : true,
        'user'    : user,
        'message' : 'User data sent successfully.',
      });
    } else {
      return next({
        status  : 500,
        title   : 'User Not found!',
        message : 'Sorry, We could not find any user with this details.'
      });
    }
  } catch (error) {
    return next(error);
  }
};