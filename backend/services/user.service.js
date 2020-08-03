const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const globalHelper = require('../helpers/global.helper');

const User = mongoose.model('User');

module.exports.createUser = async (_user, next) => {
  try {
    return new Promise(resolve => {
      User.create(_user, (errUser, docUser) => {
        if(errUser) {
          if(errUser.code == 11000) {
            return next({
              status  : 422,
              errors  : errUser,
              title   : 'Email or Phone No. already exists',
              message : 'This Email or Phone No. is already registered.'
            });
          } else {
            return next(errUser);
          }
        } else {
          return resolve(docUser);
        }
      });
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getUsers = async (_mQuery, _mProjection, next) => {
  try {
    return await User.find(_mQuery, _mProjection, (errUser, docUser) => {
      if(errUser) {
        return next(errUser);
      } else {
        return docUser;
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getUser = async (_user, next) => {
  try {
    return await User.findOne(_user, 'email password username firstName lastName roles saltSecret', (errUser, docUser) => {
      if(errUser) {
        return next(errUser);
      } else {
        return docUser;
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getEncryptedUser = async (_user, next) => {
  try {
    return new Promise(resolve => {
      bcrypt.genSalt(13, async (err, secrate) => {
        const _encrypted = await globalHelper.encryptPassword(_user.password, secrate);
        _user.password = _encrypted;
        _user.saltSecret = secrate;
        return resolve(_user);
      });
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getDecryptedUser = async (_user, next) => {
  try {
    return new Promise(async resolve => {
      const decrypt = await globalHelper.decryptPassword(_user.password, _user.saltSecret);
      _user.password = decrypt;
      return resolve(_user);
    });
  } catch (error) {
    return next(error);
  }
};