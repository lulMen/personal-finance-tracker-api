const express = require('express');
const { exchangeToken } = require('../controllers/utilityController');

const router = express.Router();

router.get('/', exchangeToken);

module.exports = router;