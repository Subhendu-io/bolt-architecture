// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const requestIp = require('request-ip');

const { validationResult } = require('express-validator');

// const authService = require('../services/auth.service');
const userService = require('../services/user.service');
// const googleService = require('../services/google.service');
// const acsdService = require('../services/acsd.service');
// const onecService = require('../services/onec.service');
// const slackService = require('../services/slack.service');
// const commonModule = require('../helpers/common.module');
const globalModule = require('../helpers/global.module');

// const User = mongoose.model('User');
// const Token = mongoose.model('Token');

module.exports.login = async (req, res, next) => {
  try {
    const _errors = validationResult(req);

    if(!_errors.isEmpty()) {
      return next({
        status  : 422,
        success : false,
        errors  : _errors.array(),
        message : 'Validation Error!'
      });
    } else {
      const _user = {
        email    : req.body.email,
        password : globalModule.getDecrypted(req.body.password, process.env.CRYPTO_PUBLIC_KEY),
      };
      const _mQuery = { 'email': _user.email };
      const _mProjection = 'email first_name last_name roles';
      const _userData = await userService.getUser(_mQuery, _mProjection, next);
      console.log(_userData);
      // if(smResponse.status === "SUCCESS") {
      //   await User.findOne({ 'email': user['email'] }, async (errUser, docUser) => {
      //     if(errUser) {
      //       console.log('********** @ auth.controller.js ==> login() ==> User.findOne() ==> :: error ::', errUser);
      //       return next(errUser);
      //     } else if(docUser && docUser['email'] && docUser['email'] === user.email) {
      //       const tokenData = await authService.createToken(docUser, req, next);
      //       if(tokenData && tokenData['login_user']) {
      //         //loginLimiter.resetKey(requestIp.getClientIp(req));
      //         return res.send({
      //           'success': true,
      //           'message': 'You have successfully login to AccountingSuite™!',
      //           'user': tokenData['login_user'],
      //           '_jwt': globalModule.getEncrypted(tokenData, process.env.CRYPTO_PUBLIC_KEY)
      //         });
      //       } else {
      //         return next({
      //           status: 500,
      //           title: 'Invalid Token Data!',
      //           message: 'Sorry, due to an internal server error, we could logged you at this time.'
      //         });
      //       }
      //     } else {
      //       return next({
      //         status: 400,
      //         title: 'Incorrect username or password!',
      //         message: getBadLoginInfo(req)
      //       });
      //     }
      //   });
      // } else {
      //   return next({
      //     status: 400,
      //     title: 'Incorrect username or password!',
      //     message: getBadLoginInfo(req)
      //   });
      // }
    }
  } catch (error) {
    console.log('********** @ auth.controller.js ==> login() ==> tryCatch() ==> :: error ::', error);
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server error!',
      message : 'Sorry, due to an internal server error, we could logged you with this email at this time.'
    });
  }
};

// module.exports.socialLogin = async (req, res, next) => {
//   try {
//     const provider = req.params.provider;
//     if(provider && provider === 'google') {
//       const redirectUrl = process.env.BASE_URL + '/oauth/login/google';
//       return googleService.oAuth2(req, res, redirectUrl);
//     } else {
//       return next({
//         status  : 404,
//         title   : 'Provider not found!',
//         message : provider + 'login provider not found.'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> socialLogin() ==> tryCatch() ==> :: error ::', error);
//     return next({
//       status  : 500,
//       errors  : error,
//       title   : 'Internal server error!',
//       message : 'Sorry, due to an internal server error, we could logged you with this email at this time.'
//     });
//   }
// };

// module.exports.getUserInfo = async (req, res, next) => {
//   try {
//     const _user = req.user;
//     const _mQuery = { 'email': _user.email };
//     const _mProjection = 'email first_name last_name roles';
//     const _userData = await userService.getUser(_mQuery, _mProjection, next);

//     if(_userData) {
//       return res.send({
//         'success' : true,
//         'user'    : _user,
//         'title'   : 'User Data sent successfully.',
//         'message' : 'User information sent successfully.',
//       });
//     } else {
//       return next({
//         status  : 404,
//         title   : 'No user found!',
//         message : 'Sorry, We could not find any user with this email.'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> getUserInfo() ==> tryCatch() ==> :: error ::', error);
//     return next({
//       status  : 500,
//       errors  : error,
//       title   : 'Internal server error!',
//       message : 'Sorry, due an internal error, we could not get user info at this time.'
//     });
//   }
// };

// module.exports.logout = async (req, res, next) => {
//   try {
//     const reqBody = globalModule.getDecrypted(req.body, process.env.CRYPTO_PUBLIC_KEY);
//     const refreshToken = reqBody.refresh_token;

//     if(!refreshToken) {
//       return next({
//         status  : 403,
//         title   : 'Unauthorized request!',
//         message : 'No user token found!'
//       });
//     } else {
//       await Token.findOneAndUpdate({ 'refresh_token': refreshToken, 'active': true }, { 'active': false }, (errToken, docToken) => {
//         if(errToken) {
//           console.log('********** @ auth.controller.js ==> logout() ==> Token.findOneAndUpdate() ==> :: error ::', errToken);
//           return next(errToken);
//         } else {
//           console.log(docToken);
//           return res.send({
//             success : true,
//             title   : 'Logout successfully!',
//             message : 'You have successfully logout from AccountingSuite™!',
//           });
//         }
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> logout() ==> tryCatch() ==> :: error ::', error);
//     return next({
//       status  : 500,
//       errors  : error,
//       title   : 'Internal server error!',
//       message : 'Sorry, due an internal error, we could not regiter user at this time.'
//     });
//   }
// };

// module.exports.register = async (req, res, next) => {
//   try {
//     const _errors = validationResult(req);
//     const reqBody = req.body;

//     if(!_errors.isEmpty()) {
//       _errors.status = 422;
//       _errors.message = 'Validation error!';
//       return next(_errors);
//     } else {
//       await User.findOne({ 'email': reqBody['email'] }, (errUser, docUser) => {
//         if(errUser) {
//           return next(errUser);
//         } else {
//           if(isDeveloper === true) {
//             return res.send({
//               success        : false,
//               isDeveloper    : isDeveloper,
//               isPreDeveloper : isPreDeveloper,
//               title          : 'Partner already registered.',
//               message        : 'You already have access to our Developer Ecosystem. Please SignIn to your account.'
//             });
//           } else if(isPreDeveloper === true && docUser['W2W_Password_Set'] === 1) {
//             return res.send({
//               'success': false,
//               'isDeveloper': isDeveloper,
//               'isPreDeveloper': isPreDeveloper,
//               'title': 'Partner already registered.',
//               'message': 'Your request has already been sent to our partner manager. While we work on your request, please SignIn to your account to play with your playground.'
//             });
//           } else {
//             const userData = {
//               'email': reqBody['email'],
//               'company': reqBody['company'],
//               'firstname': reqBody['first_name'],
//               'lastname': reqBody['last_name'],
//               'phone': reqBody['phone'],
//               'cancelURL': process.env.BASE_URL + '/register'
//             };
//             acsdService.post('/W2W_Trial_Form_Try_Now', userData).then(response => {
//               console.log('********** @ auth.controller.js ==> register() ==> acsdService() ==> W2W_Trial_Form_Try_Now() :: success ::');
//               if(response['status'] == true) {
//                 return res.send({
//                   'success': true,
//                   'user': userData,
//                   'message': 'User created please verify email to continue.'
//                 });
//               } else {
//                 return next({
//                   status: 500,
//                   title: 'Internal server error!',
//                   message: 'Sorry, due an internal error, we could register this user at this time.'
//                 });
//               }
//             }).catch(error => {
//               console.log('********** @ auth.controller.js ==> register() ==> acsdService() ==> W2W_Trial_Form_Try_Now() :: Error');
//               if(error['error']['status'] == 'SUCCESS') {
//                 return res.send({
//                   'success': true,
//                   'user': userData,
//                   'message': 'User created please verify email to continue.'
//                 });
//               } else {
//                 return next({
//                   status: 500,
//                   title: 'Internal server error!',
//                   message: 'Sorry, due an internal error, we could register this user at this time.'
//                 });
//               }
//             });
//           }
//         }
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> register() ==> tryCatch() :: error ::', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due to an internal server error, we could register you at this time.'
//     });
//   }
// };

// module.exports.socialRegister = async (req, res, next) => {
//   try {
//     const _provider = req.params.provider;
//     const _tokenData = globalModule.getDecryptedHex(req.params.token, process.env.CRYPTO_PUBLIC_KEY);

//     if(_tokenData && _tokenData['email']) {
//       const _mQuery = { 'email': _tokenData['email'] };
//       const _mProjection = 'email name company phone deco_acl';
//       const _user = await userService.findUser(_mQuery, _mProjection, next);
//       if(_user && _user['email'] === _tokenData['email']) {
//         if(_provider == 'google') {
//           const redirectUrl = process.env.BASE_URL + '/oauth/register/google';
//           return googleService.oAuth2(req, res, redirectUrl, globalModule.getEncryptedHex(_user, process.env.CRYPTO_PRIVATE_KEY));
//         }
//         return res.send({
//           'success': false,
//           'status': _provider + 'provider not found!'
//         });
//       } else {
//         return next({
//           status: 500,
//           title: 'Internal server error!',
//           message: 'Sorry, due an internal error, we could not register you at this time. Please try email verification method for registration.'
//         });
//       }
//     } else {
//       return next({
//         status: 400,
//         title: 'Bad Request Data!',
//         message: 'Sorry, due an internal error, we could not register you at this time. Please try email verification method for registration.'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> socialRegister() ==> tryCatch() :: error ::', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could not register this user at this time. Please try email verification method for registration.'
//     });
//   }
// };

// module.exports.sendVerificationEmail = async (req, res, next) => {
//   try {
//     const _errors = validationResult(req);
//     const reqBody = req.body;

//     if(!_errors.isEmpty()) {
//       _errors.status = 422;
//       _errors.message = 'Validation error!';
//       return next(_errors);
//     } else {
//       const _user = await userService.findUserByEmail(reqBody['email'], next);

//       if(_user && _user['email'] && _user['W2W_Unverified_User_Token']) {
//         const data = {
//           'deco_email_type': reqBody['deco_email_type'], // 'REGISTER' or 'FORGOT_PASSWORD'
//           'token': _user['W2W_Unverified_User_Token']
//         };
//         await acsdService.post('/W2W_Resend_Verification_Email', data).then(response => {
//           console.log('********** @ auth.controller.js ==> sendVerificationEmail() ==> acsdService() ==> W2W_Resend_Verification_Email() :: success ::');
//           if(response['status'] === 'SUCCESS') {
//             if(reqBody['deco_email_type'] === 'REGISTER') {
//               const userData = {
//                 'DECO_Email_Sent': true,
//                 'DECO_Email_Sent_Date': new Date()
//               };
//               User.findByIdAndUpdate(_user['_id'], userData);
//             }
//             return res.send({
//               'success': true,
//               'title': 'Verification email sent!',
//               'message': 'Verification email sent to your email.'
//             });
//           } else {
//             return next({
//               status: 500,
//               title: 'Internal server error!',
//               message: 'Sorry, due an internal error, we could send verification email at this time.'
//             });
//           }
//         }).catch(err => {
//           console.log('********** @ auth.controller.js ==> sendVerificationEmail() ==> acsdService() ==> W2W_Resend_Verification_Email() :: Error ::', err);
//           return next({
//             status: 500,
//             title: 'Internal server error!',
//             message: 'Sorry, due an internal error, we could send verification email at this time.'
//           });
//         });
//       } else {
//         return next({
//           status: 404,
//           title: 'User not found!',
//           message: 'Sorry, we could find any user with email at this time.'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> sendVerificationEmail() ==> tryCatch ==> :: error ::', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could send verification email at this time.'
//     });
//   }
// };

// module.exports.verifyEmail = async (req, res, next) => {
//   try {
//     const reqBody = req.body;
//     let _mQuery;
//     if(reqBody['verify_type'] === 'TOKEN' && reqBody['token']) {
//       _mQuery = {
//         'W2W_Unverified_User_Token': reqBody['token']
//       };
//     } else if(reqBody['verify_type'] === 'CODE' && reqBody['email'] && reqBody['email'] !== '' && reqBody['code'] && reqBody['code'] != '') {
//       _mQuery = {
//         'email': reqBody['email']
//       };
//     } else {
//       return next({
//         status: 400,
//         title: 'Invalid Request!',
//         message: 'Sorry, invalid request data, we could send verification email at this time.'
//       });
//     }
//     const _user = await userService.findUser(_mQuery, false, next);
//     if(_user && _user['email'] && _user['W2W_Unverified_User_Token'] && _user['W2W_Verification_Code']) {
//       const userData = {
//         'token': _user['W2W_Unverified_User_Token'],
//         'VerificationCode': _user['W2W_Verification_Code'],
//       };
//       await acsdService.post('/W2W_Verify_Email_With_Code', userData).then(async response => {
//         console.log('********** @ auth.controller.js ==> verifyEmail() ==> acsdService() ==> W2W_Verify_Email_With_Code() :: Success ::');
//         if(response['status'] === 'SUCCESS') {
//           const newUser = {
//             'DECO_Email_Verified': true,
//             'DECO_Email_Verified_Date': new Date(),
//             'DECO_Registration_Date': new Date()
//           };
//           const _role = 'PREDEVELOPER';
//           await userService.updateUserRole(_user['email'], _role, next);

//           await User.findByIdAndUpdate(_user['_id'], newUser, { new: true }, async (userErr, userDoc) => {
//             if(userErr) {
//               console.log('********** @ auth.controller.js ==> verifyEmail() ==> User.findByIdAndUpdate() ==> :: error ::', userErr);
//               return next(userErr);
//             } else if(userDoc) {
//               let _hasPassword = false;
//               let isPreDeveloper = userService.hasRole(userDoc, 'PREDEVELOPER');

//               if(userDoc['password'] && userDoc['password'] !== '' && userDoc['W2W_Password_Set'] && userDoc['W2W_Password_Set'] === 1) {
//                 _hasPassword = true;
//               } else {
//                 _hasPassword = false;
//               }

//               if(!isPreDeveloper) {
//                 acsdService.post('/DECO_NOTIFICATION_EMAIL', { 'token': userDoc['W2W_Unverified_User_Token'] }).then(result => {
//                   console.log('********** @ auth.controller.js ==> verifyEmail() ==> acsdService() ==> DECO_NOTIFICATION_EMAIL() ==> :: Success ::');
//                 }).catch(error => {
//                   console.log('********** @ auth.controller.js ==> verifyEmail() ==> acsdService() ==> DECO_NOTIFICATION_EMAIL() ==> :: Error ::', error);
//                 });
//                 slackService.sendSlackRegisterUserMessage(userDoc['name'], userDoc['email'], userDoc['company']).then(result => {
//                   console.log('********** @ auth.controller.js ==> verifyEmail() ==> slackService() ==> sendSlackRegisterUserMessage() ==> :: Success ::');
//                 }).catch(error => {
//                   console.log('********** @ auth.controller.js ==> verifyEmail() ==> slackService() ==> sendSlackRegisterUserMessage() ==> :: Error ::', error);
//                 });
//               }

//               const devUser = {
//                 email: userDoc['email'],
//                 token: userDoc['W2W_Unverified_User_Token'],
//                 hasPassword: _hasPassword,
//               };
//               return res.send({
//                 'success': true,
//                 'user': devUser,
//                 'message': 'Email verified successfully.'
//               });
//             } else {
//               return next({
//                 status: 500,
//                 errors: userErr,
//                 title: 'Internal server error!',
//                 message: 'Sorry, due an internal error, we could verify this email at this time.'
//               });
//             }
//           });
//         } else {
//           return next({
//             status: 500,
//             title: 'Internal server error!',
//             message: 'Sorry, due an internal error, we could verify this email at this time.'
//           });
//         }
//       }).catch(error => {
//         console.log('********** @ auth.controller.js ==> verifyEmail() ==> acsdService() ==> W2W_Verify_Email_With_Code() ==> :: Error', error);
//         return next({
//           status: 500,
//           title: 'Internal server error!',
//           message: 'Sorry, due an internal error, we could verify this email at this time.'
//         });
//       });
//     } else {
//       return next({
//         status: 404,
//         title: 'Invalid User Data!',
//         message: 'Sorry, invalid User data, we could send verification email at this time.'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> verifyEmail() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could verify this email at this time.'
//     });
//   }
// };

// module.exports.setPassword = async (req, res, next) => {
//   try {
//     const _errors = validationResult(req);
//     const reqBody = req.body;

//     if(!_errors.isEmpty()) {
//       _errors.status = 422;
//       _errors.message = 'Validation error!';
//       return next(_errors);
//     } else {
//       const _password = globalModule.getDecrypted(reqBody['password'], process.env.CRYPTO_PUBLIC_KEY);
//       const _confirmPassword = globalModule.getDecrypted(reqBody['confirm_password'], process.env.CRYPTO_PUBLIC_KEY);
//       if(_confirmPassword !== _password) {
//         return next({
//           status: 400,
//           title: 'Validation error!',
//           message: 'Password and confirm password mismatch.'
//         });
//       }
//       const _mQuery = {
//         'email': reqBody['email'],
//         'DECO_Email_Verified': true,
//         'W2W_Unverified_User_Token': reqBody['token']
//       };
//       const _user = await userService.findUser(_mQuery, false, next);
//       if(_user && _user['email'] && _user['W2W_Unverified_User_Token']) {
//         const userData = {
//           'token': _user['W2W_Unverified_User_Token'],
//           'password': _password
//         };
//         acsdService.post('/W2W_Set_Password', userData).then(response => {
//           console.log('********** @ auth.controller.js ==> setPassword() ==> acsdService ==> /W2W_Set_Password :: Success ::');
//           if(response['status'] === 'SUCCESS') {
//             const devUser = {
//               'DECO_Password_Set': true,
//               'DECO_Password_Set_Date': new Date(),
//             };
//             acsdService.post('/W2W_Get_Trial_Form_Current_State', { 'token': _user['W2W_Unverified_User_Token'], 'subscription_type': 'DEVELOPER' }).then(result => {
//               console.log('********** @ auth.controller.js ==> verifyEmail() ==> acsdService ==> /W2W_Get_Trial_Form_Current_State :: Success ::');
//               User.findByIdAndUpdate(_user['_id'], devUser, { new: true }, (userErr, userDoc) => {
//                 if(!userErr && userDoc) {
//                   return res.send({
//                     'success': true,
//                     'message': 'Your password has been updated successfully.'
//                   });
//                 } else {
//                   return next({
//                     status: 500,
//                     errors: userErr,
//                     message: 'INTERNAL SERVER ERROR'
//                   });
//                 }
//               });
//             }).catch(error => {
//               console.log('********** @ auth.controller.js ==> verifyEmail() ==> acsdService ==> /W2W_Get_Trial_Form_Current_State :: Error ==> ', error);
//               User.findByIdAndUpdate(_user['_id'], devUser, { new: true }, (userErr, userDoc) => {
//                 if(!userErr && userDoc) {
//                   return res.send({
//                     'success': true,
//                     'message': 'Your password has been updated successfully.'
//                   });
//                 } else {
//                   return next({
//                     status: 500,
//                     errors: userErr,
//                     message: 'INTERNAL SERVER ERROR'
//                   });
//                 }
//               });
//             });
//           } else {
//             return res.send({
//               'success': false,
//               'message': 'Password and confirm password mismatch.'
//             });
//           }
//         }).catch(error => {
//           console.log('********** @ auth.controller.js ==> setPassword() ==> acsdService ==> /W2W_Set_Password :: Error ==> ', error);
//           return next({
//             status: 500,
//             errors: error,
//             message: 'INTERNAL SERVER ERROR'
//           });
//         });
//       } else {
//         return next({
//           status: 500,
//           title: 'User not found!',
//           message: 'Sorry, we could set password at this time.'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> setPassword() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could set your password at this time.'
//     });
//   }
// };

// module.exports.authenticateSocialRegister = async (req, res, next) => {
//   try {
//     const _provider = req.params.provider;
//     const _code = req.body.code;
//     const _stateUser = req.body.state;
//     const redirectUrl = process.env.BASE_URL + '/oauth/register/google';

//     if(_provider == 'google' && _stateUser) {
//       await googleService.getToken(_code, redirectUrl).then(async googleToken => {
//         if(googleToken['access_token'] && googleToken['refresh_token']) {
//           await googleService.getUserInfo(googleToken).then(async googleResponse => {
//             let googleData = JSON.parse(googleResponse);
//             let stateData = globalModule.getDecryptedHex(_stateUser, process.env.CRYPTO_PRIVATE_KEY);
//             if(stateData['email'] && googleData['email'] && stateData['email'] == googleData['email']) {
//               const _mQuery = { email: googleData['email'] };
//               const _mProjection = '_id email name phone company W2W_Unverified_User_Token';
//               let _user = await userService.findUser(_mQuery, _mProjection, next);
//               if(_user && _user['email'] && _user['W2W_Unverified_User_Token']) {
//                 const devUser = {
//                   'email': _user['email'],
//                   'token': _user['W2W_Unverified_User_Token'],
//                 };
//                 return res.send({
//                   'success': true,
//                   'user': devUser,
//                   'googleUser': googleData,
//                   'googleToken': globalModule.getEncrypted(googleToken, process.env.CRYPTO_PUBLIC_KEY),
//                   'message': 'User exists! calling verification email api of Accounting Dashboard.'
//                 });
//               } else {
//                 return next({
//                   status: 404,
//                   title: 'ACS user not found!',
//                   message: 'User dose not exist.'
//                 });
//               }
//             } else {
//               return res.send({
//                 'code': 203,
//                 'success': false,
//                 'googleUser': googleData,
//                 'message': 'Authenticated user dose not match registered user please try again!'
//               });
//             }
//           }).catch(error => {
//             return next({
//               status: 401,
//               errors: error,
//               title: 'Unauthorized User Token!',
//               message: 'Sorry, we could authenticate user due to unauthorized user token.'
//             });
//           });
//         } else {
//           return next({
//             status: 400,
//             title: 'Unauthorized User!',
//             message: 'Unable to authenticate ' + _provider + ' user.'
//           });
//         }
//       }).catch(err => {
//         return next({
//           status: 500,
//           errors: err,
//           title: 'Internal server error!',
//           message: 'Sorry, due an internal error, we could not registered at this time.'
//         });
//       });
//     } else {
//       return res.send({
//         'code': 404,
//         'success': false,
//         'message': _provider + 'login provider not found!'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> authenticateSocialRegister() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could not registered at this time.'
//     });
//   }
// };

// module.exports.refreshToken = async (req, res, next) => {
//   try {
//     const _body = globalModule.getDecrypted(req.body, process.env.CRYPTO_PUBLIC_KEY);
//     const refreshToken = _body.refresh_token;
//     const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

//     if(!refreshToken) {
//       return next({
//         status: 403,
//         message: 'Invalid Request.'
//       });
//     } else {
//       await Token.findOne({ 'refresh_token': refreshToken, 'active': true }, (errToken, docToken) => {
//         if(errToken) {
//           return next(errToken);
//         } else if(docToken && docToken['refresh_token'] === refreshToken) {
//           jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//             if(err) {
//               return next({
//                 status: 403,
//                 errors: err,
//                 title: 'Unauthorized Request!',
//                 message: 'Unauthorized Request User.'
//               });
//             } else if(user.email == undefined || user.email == null || emailRegex.test(user.email) == false) {
//               return next({
//                 status: 403,
//                 title: 'Unauthorized Request!',
//                 message: 'Unauthorized Request User.'
//               });
//             } else {
//               const userData = {
//                 '_id': user._id,
//                 'email': user.email,
//                 'name': user.name,
//                 'roles': user.roles,
//                 'scia': globalModule.getEncrypted(requestIp.getClientIp(req), process.env.CRYPTO_PRIVATE_KEY)
//               };

//               const _expiresIn = '5h';
//               const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: _expiresIn });
//               const tokenData = {
//                 'expires_in': _expiresIn,
//                 'access_token': accessToken,
//                 'refresh_token': refreshToken
//               };

//               const _tokenData = {
//                 'access_token': tokenData['access_token'],
//                 'expires_in': tokenData['expires_in'],
//               };

//               Token.findOneAndUpdate({ 'refresh_token': refreshToken, 'active': true }, _tokenData, (tokenErr, tokenDoc) => {
//                 if(tokenErr) {
//                   return next(tokenErr);
//                 } else if(tokenDoc) {
//                   return res.send({
//                     'success': true,
//                     'message': 'Refresh token sent successfully.',
//                     '_jwt': globalModule.getEncrypted(tokenData, process.env.CRYPTO_PUBLIC_KEY)
//                   });
//                 } else {
//                   return next({
//                     status: 403,
//                     title: 'Internal server error!',
//                     message: 'Sorry, due an internal error, we could not refresh token at this time.'
//                   });
//                 }
//               });
//             }
//           });
//         } else {
//           return next({
//             status: 403,
//             title: 'Unauthorized Request!',
//             message: 'Unauthorized Request User.'
//           });
//         }
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> refreshToken() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due to an internal server error, we could not log you in with this email at this time.'
//     });
//   }
// };

// module.exports.checkUser = async (req, res, next) => {
//   try {
//     const _email = req.body.email;
//     const _user = await userService.findUserByEmail(_email, next);
//     if(_user && _user['email']) {
//       const devUser = {
//         email: _user['email']
//       };
//       return res.send({
//         'success': true,
//         'user': devUser,
//         'title': 'User found!',
//         'message': 'An user found with this email.'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> checkUser() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due to an internal error, we could not check your email at this time.'
//     });
//   }
// };

// module.exports.verifyForgotPassEmail = async (req, res, next) => {
//   try {
//     const reqBody = req.body;

//     let _mQuery;
//     if(reqBody['verify_type'] === 'TOKEN' && reqBody['token']) {
//       _mQuery = {
//         'W2W_Unverified_User_Token': reqBody['token']
//       };
//     } else if(reqBody['verify_type'] === 'CODE' && reqBody['email'] && reqBody['email'] !== '' && reqBody['code'] && reqBody['code'] != '') {
//       _mQuery = {
//         'email': reqBody['email']
//       };
//     } else {
//       return next({
//         status: 400,
//         title: 'Invalid request!',
//         message: 'Sorry, due to invalid request data, we could not verify your email at this time.'
//       });
//     }
//     const _mProjection = 'email W2W_Unverified_User_Token';
//     const _user = await userService.findUser(_mQuery, _mProjection, next);
//     if(_user && _user['email'] && _user['W2W_Unverified_User_Token'] && _user['W2W_Unverified_User_Token']) {
//       const devUser = {
//         email: _user['email'],
//         token: _user['W2W_Unverified_User_Token']
//       };
//       return res.send({
//         'success': true,
//         'user': devUser,
//         'message': 'Email verified successfully.'
//       });
//     } else {
//       return next({
//         status: 400,
//         title: 'Invalid User Data!',
//         message: 'Sorry, due to invalid User data, we could not verify your email at this time.'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> verifyForgotPassEmail() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could not verify email at this time.'
//     });
//   }
// };

// module.exports.resetPassword = async (req, res, next) => {
//   try {
//     const _errors = validationResult(req);
//     const reqBody = req.body;

//     if(!_errors.isEmpty()) {
//       _errors.status = 422;
//       _errors.message = 'Validation error!';
//       return next(_errors);
//     } else {
//       const _password = globalModule.getDecrypted(reqBody['password'], process.env.CRYPTO_PUBLIC_KEY);
//       const _confirmPassword = globalModule.getDecrypted(reqBody['confirm_password'], process.env.CRYPTO_PUBLIC_KEY);
//       if(_confirmPassword !== _password) {
//         return res.send({
//           'success': false,
//           'message': 'Password and confirm password mismatch.'
//         });
//       }
//       const _user = await userService.findUserByEmail(reqBody['email'], next);
//       const data = {
//         'UserName': _user['email'],
//         'UserPassword': commonModule.decryptPwd(_user['password']),
//         'NewUserPassword': _password
//       };
//       const userData = {
//         password: commonModule.encryptPwd(_password)
//       };
//       await onecService.changePlaygroundPassword(data).then(response => {
//         console.log('********** @ auth.controller.js ==> onecService() ==> changePlaygroundPassword() ==> :: Success :: ');
//         User.findOneAndUpdate({ 'email': reqBody['email'], 'W2W_Unverified_User_Token': reqBody['token'] }, userData, (errUser, docUser) => {
//           if(errUser) {
//             return next(errUser);
//           } else if(docUser && docUser['email'] && docUser['W2W_Unverified_User_Token']) {
//             return res.send({
//               'success': true,
//               'title': 'Password updated successfully!',
//               'message': 'Your password has been updated successfully.'
//             });
//           } else {
//             return next({
//               status: 400,
//               title: 'Invalid request!',
//               message: 'Unable to update your password due to invalid request data.'
//             });
//           }
//         });
//       }).catch(error => {
//         console.log('********** @ auth.controller.js ==> onecService() ==> changePlaygroundPassword() ==> :: Error');
//         return next({
//           status: 500,
//           // errors  : error,
//           title: 'Internal server error!',
//           message: 'Sorry, due an internal error, we could not update your password at this time.'
//         });
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> resetPassword() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could not update your password at this time.'
//     });
//   }
// };

// module.exports.authenticateToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(token == null) {
//       return next({
//         status: 401,
//         title: 'Unauthorized User Token!',
//         message: 'Unauthorized Request. Token not fount'
//       });
//     } else {
//       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if(err) {
//           return next({
//             status: 401,
//             errors: err,
//             title: 'Unauthorized User Token!',
//             message: 'Sorry, we could authenticate user due to unauthorized user token.'
//           });
//         } else {
//           req.user = user;
//           next();
//         }
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> authenticateToken() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could authenticate user due to unauthorized user token at this time.'
//     });
//   }
// };

// module.exports.authenticateTokenRole = (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(token == null) {
//       return next({
//         status: 401,
//         title: 'Unauthorized User Token!',
//         message: 'Unauthorized Request. Token not found'
//       });
//     } else {
//       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if(err) {
//           return next({
//             status: 401,
//             errors: err,
//             title: 'Unauthorized User Token!',
//             message: 'Sorry, we could authenticate user due to unauthorized user token.'
//           });
//         } else {
//           req.user = user;
//           next();
//         }
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> authenticateTokenRole() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could authenticate user due to unauthorized user token at this time.'
//     });
//   }
// };

// module.exports.authenticateOneCToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(token == null) {
//       return next({
//         status: 401,
//         title: 'Invalid requested token!',
//         message: 'Sorry, we could authenticate user due to unauthorized user token.'
//       });
//     } else {
//       let apiKey = token;
//       if(!apiKey) {
//         return next({
//           status: 403,
//           title: 'Unauthorized User Token!',
//           message: 'Sorry, we could authenticate user due to unauthorized user token.'
//         });
//       } else {
//         req.user = {
//           apisecretkey: apiKey
//         };
//         next();
//       }
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> authenticateOneCToken() ==> tryCatch() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Internal server error!',
//       message: 'Sorry, due an internal error, we could authenticate user due to unauthorized user token at this time.'
//     });
//   }
// };

// module.exports.authenticateSocialLogin = async (req, res, next) => {
//   try {
//     const _provider = req.params.provider;
//     const _code = req.body.code;
//     const redirectUrl = process.env.BASE_URL + '/oauth/login/google';

//     if(_provider == 'google') {
//       await googleService.getToken(_code, redirectUrl).then(async googleToken => {
//         if(googleToken['access_token'] && googleToken['refresh_token']) {
//           await googleService.getUserInfo(googleToken).then(async googleResponse => {
//             let googleData = JSON.parse(googleResponse);
//             const _mQuery = { email: googleData['email'] };
//             const _mProjection = 'email name company phone deco_acl';
//             let _user = await userService.findUser(_mQuery, _mProjection, next);

//             if(_user && _user['email'] && _user['email'] == googleData['email']) {
//               _user.oauthData = {
//                 'google': {
//                   'user': googleData,
//                   'token': googleToken
//                 }
//               };
//               const tokenData = await authService.createToken(_user, req, next);

//               if(tokenData && tokenData['login_user']) {
//                 return res.send({
//                   'success': true,
//                   'message': 'You have successfully login to AccountingSuite™!',
//                   'user': tokenData['login_user'],
//                   'googleUser': googleData,
//                   '_gwt': globalModule.getEncrypted(googleToken, process.env.CRYPTO_PUBLIC_KEY),
//                   '_jwt': globalModule.getEncrypted(tokenData, process.env.CRYPTO_PUBLIC_KEY),
//                 });
//               } else {
//                 return next({
//                   status: 500,
//                   title: 'Internal server error!',
//                   message: 'Sorry, due an internal error, we could login at this time.'
//                 });
//               }
//             } else {
//               return next({
//                 status: 403,
//                 title: 'User Not Found!',
//                 message: 'Sorry, we could found any user with this email.'
//               });
//             }
//           }).catch(error => {
//             console.log('********** @ auth.controller.js ==> authenticateSocialLogin() ==> googleService() ==> getUserInfo() ==> :: Error :: ', error);
//             return next({
//               status: 500,
//               errors: error,
//               title: 'Unauthorized Google User!',
//               message: 'Sorry, due to unauthorized google user, we could login at this time.'
//             });
//           });
//         }
//       }).catch(err => {
//         console.log('********** @ auth.controller.js ==> authenticateSocialLogin() ==> googleService() ==> getToken() ==> :: Error :: ', err);
//         return next({
//           status: 500,
//           errors: err,
//           title: 'Unauthorized Google User!',
//           message: 'Sorry, due to unauthorized google user, we could login at this time.'
//         });
//       });
//     } else {
//       return next({
//         status: 404,
//         title: 'Provider not found!',
//         message: _provider + 'login provider not found!'
//       });
//     }
//   } catch (error) {
//     console.log('********** @ auth.controller.js ==> verifyEmail() ==> authenticateSocialLogin() ==> :: Error :: ', error);
//     return next({
//       status: 500,
//       errors: error,
//       title: 'Unauthorized Google User!',
//       message: 'Sorry, due to unauthorized google user, we could login at this time.'
//     });
//   }
// };
