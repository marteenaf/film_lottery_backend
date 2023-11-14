const express = require('express');
const { login, register, logout, refresh } = require('../controllers/authentication');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

module.exports = router;