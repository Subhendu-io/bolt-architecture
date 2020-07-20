const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const requestIp = require('request-ip');

const Token = mongoose.model('Token');

const globalModule = require('../helpers/global.module');

module.exports.createToken = async (_user, req, next) => {
  const userData = {
    '_id'   : _user['_id'],
    'name'  : _user['name'],
    'email' : _user['email'],
    'roles' : _user['deco_acl'],
    'scia'  : globalModule.getEncrypted(requestIp.getClientIp(req), process.env.CRYPTO_PRIVATE_KEY)
  };
  const _expiresIn = '5h';
  const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': _expiresIn });
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
  const tokenData = {
    'expires_in'    : _expiresIn,
    'access_token'  : accessToken,
    'refresh_token' : refreshToken
  };

  let token = new Token();

  token['active'] = true;
  token['access_token'] = tokenData['access_token'];
  token['refresh_token'] = tokenData['refresh_token'];
  token['expires_in'] = tokenData['expires_in'];
  token['login_ip'] = requestIp.getClientIp(req);
  token['login_user'] = userData;
  token['oauth_data'] = _user['oauthData'] ? _user['oauthData'] : {};

  return await token.save().then(docToken => {
    if(docToken && docToken['login_user']) {
      return docToken;
    } else {
      return next({
        status  : 500,
        title   : 'Internal server error!',
        message : 'Sorry, due to an internal server error, we could logged you with this email at this time.'
      });
    }
  }).catch(errToken => {
    return next(errToken);
  });
};