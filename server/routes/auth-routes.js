const express = require('express');
const router = express.Router();

const {userLogin, userRegistration, verifyLoginCode} = require('../controllers/auth-controllers');

router.post('/registration', userRegistration);
router.post('/login', userLogin);
router.post('/verify-code', verifyLoginCode);

module.exports = router;