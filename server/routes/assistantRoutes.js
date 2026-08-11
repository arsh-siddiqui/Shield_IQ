'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const assistantRateLimiter = require('../middleware/assistantRateLimiter');
const { handleAssistantChat } = require('../controllers/assistantController');

router.post('/chat', protect, assistantRateLimiter, handleAssistantChat);

module.exports = router;
