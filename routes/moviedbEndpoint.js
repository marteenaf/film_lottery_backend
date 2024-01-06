const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middleware/verification');
const { forwardRequest } = require('../controllers/moviedb');

router.post("/", verifyUser, forwardRequest);

module.exports = router;