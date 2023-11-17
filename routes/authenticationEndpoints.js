const express = require('express');
const { login, register, logout, refresh, user } = require('../controllers/authentication');
const { verifyUser } = require('../middleware/verification');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/user", verifyUser, user);

module.exports = router;