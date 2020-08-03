const { validationResult } = require('express-validator');
const requestIp = require('request-ip');

const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const roleService = require('../services/role.service');
const globalHelper = require('../helpers/global.helper');

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

module.exports.login = async (req, res, next) => {
  try {
    const _errors = validationResult(req);
    const _request = req.body;

    if(!_errors.isEmpty()) {
      return next(_errors);
    } else {
      const _user = {
        email    : _request.email,
        password : _request.password
        // 'password' : globalModule.getDecrypted(_request.password, process.env.CRYPTO_PUBLIC_KEY),
      };
      if(_user.email && _user.password && emailRegex.test(_user.email)) {
        const _encryptedUser = await userService.getUser({email: _user.email}, next);
        const _decryptedUser = await userService.getDecryptedUser(_encryptedUser, next);
        if(_decryptedUser && _decryptedUser.email && _decryptedUser.password && _user.email === _decryptedUser.email && _user.password === _decryptedUser.password) {
          _decryptedUser.currentIp = requestIp.getClientIp(req);
          const tokenData = await authService.createToken(_decryptedUser, next);
          const token = {
            accessToken  : tokenData.accessToken,
            refreshToken : tokenData.refreshToken,
            expiresIn    : tokenData.expiresIn,
            loginUser    : tokenData.loginUser
          };
          return res.send({
            success : true,
            message : 'You have successfully login to BOLT™!',
            user    : tokenData.loginUser,
            _jwt    : await globalHelper.getEncrypted(token, process.env.CRYPTO_PUBLIC_KEY)
          });
        } else {
          return next({
            status  : 400,
            title   : 'Incorrect username or password!',
            message : 'It seems that either your email or your password dose not match.'
          });
        }
      } else {
        return next({
          status  : 403,
          title   : 'Invalid User',
          message : 'Invalid User Details.'
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const _errors = validationResult(req);
    const _request = req.body;

    if(!_errors.isEmpty()) {
      return next(_errors);
    } else {
      // const _password = await globalHelper.getDecrypted(_request.password, process.env.CRYPTO_PUBLIC_KEY);
      const _role = await roleService.getRole('USER', next);
      const _user = {
        email     : _request.email,
        username  : _request.username,
        firstName : _request.firstName,
        lastName  : _request.lastName,
        password  : _request.password,
        phone     : _request.phone,
        roles     : [_role],
        status    : 'active'
      };
      const _encryptedUser = await userService.getEncryptedUser(_user, next);
      const user = await userService.createUser(_encryptedUser, next);
      return res.send({
        success : true,
        title   : 'User register successfully!',
        message : 'User has been register successfully.',
        role    : user
      });
    }
  } catch (error) {
    return next(error);
  }
};