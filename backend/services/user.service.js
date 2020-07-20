const mongoose = require('mongoose');

const User = mongoose.model('User');
const Role = mongoose.model('Role');

module.exports.getUser = async (_mQuery, _mProjection, next) => {
  return User.findOne(_mQuery, _mProjection, (errUser, docUser) => {
    if(errUser) {
      return next(errUser);
    } else if(docUser && docUser['email']) {
      return docUser;
    } else {
      return next({
        status  : 404,
        title   : 'User not found.',
        message : 'Sorry, we could not find any user with this email.'
      });
    }
  });
};

module.exports.findUser = async (_mQuery, _mProjection, next) => {
  return User.findOne(_mQuery, _mProjection, (errUser, docUser) => {
    if(errUser) {
      return next(errUser);
    } else if(docUser && docUser['email']) {
      return docUser;
    } else {
      return next({
        status  : 404,
        title   : 'User not found.',
        message : 'Sorry, we could not find any user with this email.'
      });
    }
  });
};

module.exports.findUserByEmail = async (_email, next) => {
  try {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if(_email && emailRegex.test(_email)) {
      return User.findOne({'email': _email}, (errUser, docUser) => {
        if(errUser) {
          console.log('********* @ user.service.js ==> findUserByEmail ==> Error => ', errUser);
          return next(errUser);
        } else if(docUser && docUser['email'] && docUser['email'] === _email) {
          return docUser;
        } else {
          return next({
            status  : 404,
            title   : 'User not found.',
            message : 'Sorry, we could not find any user with this email.'
          });
        }
      });
    } else {
      return next({
        status  : 400,
        title   : 'User not found.',
        message : 'Sorry, we could not find any user with this email.'
      });
    }
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due to an internal error, we could not find user at this time.'
    });
  }
};

module.exports.hasRole = (user, _role) => {
  if(user && user['email'] && user['deco_acl']) {
    for(let i = 0; i < user['deco_acl'].length; i++) {
      if(user['deco_acl'][i].role === _role) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
};

module.exports.updateUserRole = async (_email, _role, next) => {
  try {
    await Role.findOne({'role': _role}, async (errRole, docRole) => {
      if(errRole) {
        return next(errRole);
      } else if(docRole['role']) {
        const user = {
          'deco_acl': [
            {
              'role'       : docRole['role'],
              'assignedAt' : new Date(),
              'assignedBy' : _email
            }
          ]
        };

        await User.findOneAndUpdate({'email': _email}, user, { new: true }, (errUser, docUser) => {
          if(errUser) {
            return next(errUser);
          } else if(docUser['deco_acl']) {
            return {
              'success' : true,
              'user'    : docUser,
              'message' : 'User role updated successfully!',
            };
          } else {
            return next({
              status  : 500,
              title   : 'Internal server Error!',
              message : 'Sorry, due to an internal error, we could not update user role at this time.'
            });
          }
        });
      } else {
        return next({
          status  : 500,
          title   : 'Internal server Error!',
          message : 'Sorry, due to an internal error, we could not update user role at this time.'
        });
      }
    });
  } catch (error) {
    console.log('********** @ user.service.js ==> updateUserRoleByEmail() ==> User.findOneAndUpdate() :: error ::', error);
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due to an internal error, we could not update user role at this time.'
    });
  }
};