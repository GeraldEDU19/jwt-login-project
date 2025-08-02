const express = require('express');
const userController = require('../controllers/user.controller');
const middleware = require('../middleware');

const router = express.Router();


router.get('/login', userController.getLoginPage);

router.post('/login',
    middleware.loginLimiter, 
    middleware.validateSchema("login"), 
    userController.postLogin
);

router.post('/register',
    middleware.strictLimiter,
    middleware.validateSchema("userRegistration"),
    userController.postRegister
);

router.post('/logout', 
    middleware.authenticateToken,
    userController.logout
);

router.get('/', 
    middleware.authenticateToken, 
    userController.getUsers
);

router.get('/all', 
    userController.getUsers
);
module.exports = router;
