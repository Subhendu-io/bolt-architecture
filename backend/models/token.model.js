const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  'access_token': {
    type     : String,
    required : 'Access Token can\'t be empty.'
  },
  'refresh_token': {
    type     : String,
    required : 'Refresh Token can\'t be empty.'
  },
  'expires_in': {
    type     : String,
    required : 'Expires In can\'t be empty.'
  },
  'active': {
    type     : Boolean,
    required : 'Active In can\'t be empty.'
  },
  'oauth_data': {
    type: Object
  },
}, {
  timestamps: true,
});

const Token = mongoose.model('Token', tokenSchema, 'app_user');

module.exports = Token;