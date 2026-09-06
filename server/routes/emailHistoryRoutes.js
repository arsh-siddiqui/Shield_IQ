'use strict';

const express = require('express');
const router = express.Router();
const emailHistoryController = require('../controllers/emailHistoryController');
const { protect } = require('../middleware/auth');

// All email history routes require authentication
router.use(protect);

router.post('/', emailHistoryController.createEmail);
router.get('/', emailHistoryController.getEmails);
router.get('/:id', emailHistoryController.getEmailById);
router.delete('/:id', emailHistoryController.deleteEmail);

// Internal/maintenance endpoint (still scoped to the authenticated user)
router.post('/rebuild', emailHistoryController.rebuildIndex);

module.exports = router;
