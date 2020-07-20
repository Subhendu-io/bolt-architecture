const express = require('express');
const router = express.Router();

// importing Controllers
// const authController = require('./controllers/auth.controller');
// const userController = require('./controllers/user.controller');
// const roleController = require('./controllers/role.controller');

// // importing Validators
// const roleValidator = require('./validators/role.validator');
// const authValidator = require('./validators/auth.validator');

// auth Routes
// router.post('/auth/login', authValidator.login, authController.login);
// router.post('/auth/register', authValidator.register, authController.register);
// router.post('/auth/token', authController.refreshToken);
// router.post('/auth/logout', authController.logout);

// router.get('/auth/login/social/:provider', authController.socialLogin);
// router.post('/auth/login/social/:provider', authController.authenticateSocialLogin);

// router.get('/auth/register/social/:provider/:token', authController.socialRegister);
// router.post('/auth/register/social/:provider', authController.authenticateSocialRegister);
// router.post('/auth/register/send-verification-email', authValidator.sendVerificationEmail, authController.sendVerificationEmail);
// router.post('/auth/register/verify-email', authController.verifyEmail);
// router.post('/auth/register/set-password', authValidator.setPassword, authController.setPassword);

// router.get('/auth/user/info', authController.authenticateToken, authController.getUserInfo);

// router.post('/auth/forgot-password/check-user', authValidator.checkUser, authController.checkUser);
// router.post('/auth/forgot-password/send-verification-email', authValidator.sendVerificationEmail, authController.sendVerificationEmail);
// router.post('/auth/forgot-password/verify-email', authController.verifyForgotPassEmail);
// router.post('/auth/forgot-password/reset-password', authValidator.setPassword, authController.resetPassword);

// // role CRUD Routes
// router.post('/roles', authController.authenticateToken, roleValidator.createRole, roleController.createRole);
// router.get('/roles', authController.authenticateToken, roleController.getRoles);
// router.get('/roles/:id', authController.authenticateToken, roleController.getRoleById);
// router.put('/roles/:id', authController.authenticateToken, roleValidator.updateRole, roleController.updateRoleById);
// router.delete('/roles/:id', authController.authenticateToken, roleController.deleteRoleById);

module.exports = router;