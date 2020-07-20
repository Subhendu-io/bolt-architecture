const rp = require('request-promise');
const globalModule = require('../helpers/global.module');

module.exports.disconnectAppTokens = (clientId, clientSecret, user) => {
  let tokenData = {
    'secret' : process.env.OAUTH_SECRET,
    'user'   : user ? user : 'apidocsdev'
  };
  let token = globalModule.getEncrypted(tokenData, process.env.CRYPTO_PUBLIC_KEY);

  let options = {
    'method'  : 'POST',
    'uri'     : process.env.OAUTH_URL + '/application/disconnect-all-connection',
    'headers' : {
      'Content-type'  : 'application/json',
      'Authorization' : 'Bearer ' + token,
    },
    'body': {
      'client_id'     : clientId,
      'client_secret' : clientSecret
    },
    'json': true
  };
  rp(options).then(response => {
    return response;
  }).catch(error => {
    return error;
  });
};
