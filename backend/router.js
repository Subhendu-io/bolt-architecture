const express = require('express');
const router = express.Router();

// importing controllers
const authController = require('./controllers/auth.controller');
const roleController = require('./controllers/role.controller');
const userController = require('./controllers/user.controller');

// importing validators
const authValidator = require('./validators/auth.validator');
const roleValidator = require('./validators/role.validator');

// test
const testController = require('./controllers/test.controller');
router.get('/app', testController.sendHello);
router.get('/test', testController.test);

// auth routes
router.post('/auth/login', authValidator.login, authController.login);
router.post('/auth/register', authValidator.register, authController.register);

// role routes
router.post('/roles', roleValidator.createRole, roleController.createRole);
router.get('/roles', roleController.getRoles);

// user routes
router.get('/user/users', userController.getUsers);

module.exports = router;