const rp = require('request-promise');
const queryString = require('query-string');

module.exports.oAuth2 = async (req, res, _redirectUrl, docUser) => {
  try {
    const stringifiedParams = await queryString.stringify({
      'client_id'     : process.env.GOOGLE_CLIENT_ID,
      'redirect_uri'  : _redirectUrl,
      'state'         : docUser,
      'response_type' : 'code',
      'access_type'   : 'offline',
      'prompt'        : 'consent',
      'scope'         : [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
    });

    let googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

    return res.send({
      'success'   : true,
      'oauth_url' : googleLoginUrl
    });
  } catch (error) {
    return res.send({
      'success' : false,
      'errors'  : error
    });
  }
};

module.exports.getToken = async (_code, _redirectUrl) => {
  var options = {
    'method'  : 'POST',
    'uri'     : 'https://oauth2.googleapis.com/token',
    'headers' : {
      'Content-type': 'application/json'
    },
    'body': {
      'code'          : _code,
      'grant_type'    : 'authorization_code',
      'client_id'     : process.env.GOOGLE_CLIENT_ID,
      'client_secret' : process.env.GOOGLE_CLIENT_SECRET,
      'redirect_uri'  : _redirectUrl,
    },
    'json': true
  };
  return rp(options);
};

module.exports.getUserInfo = async (_tokenData) => {
  var options = {
    'method'  : 'GET',
    'uri'     : 'https://www.googleapis.com/oauth2/v2/userinfo',
    'headers' : {
      'Authorization': 'Bearer ' + _tokenData['access_token']
    },
  };
  return rp(options);
};
