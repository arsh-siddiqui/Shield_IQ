'use strict';

const emailHistoryService = require('../services/emailHistoryService');

exports.createEmail = async (req, res, next) => {
  try {
    const userId = req.user._id; // Enforce user isolation
    const { sender, recipient, subject, body } = req.body;

    if (!sender || !recipient || !body) {
      return res.status(400).json({ error: 'Sender, recipient, and body are required.' });
    }

    const result = await emailHistoryService.createEmailHistory(userId, { sender, recipient, subject, body });
    
    // Do not log the body
    console.log(`[EmailHistory] User ${userId} stored legitimate email from ${sender}. Status: ${result.status}`);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getEmails = async (req, res, next) => {
  try {
    const userId = req.user._id; // Enforce user isolation
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    const emails = await emailHistoryService.getEmailHistoryList(userId, limit, skip);
    res.json({ emails });
  } catch (error) {
    next(error);
  }
};

exports.getEmailById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const emailId = req.params.id;

    const email = await emailHistoryService.getEmailHistoryById(userId, emailId);
    if (!email) {
      return res.status(404).json({ error: 'Email not found.' });
    }

    res.json({ email });
  } catch (error) {
    next(error);
  }
};

exports.deleteEmail = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const emailId = req.params.id;

    const success = await emailHistoryService.deleteEmailHistory(userId, emailId);
    if (!success) {
      return res.status(404).json({ error: 'Email not found or unauthorized.' });
    }

    console.log(`[EmailHistory] User ${userId} deleted email ${emailId}.`);
    res.json({ success: true, message: 'Email deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.rebuildIndex = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(`[EmailHistory] Rebuilding RAG index for User ${userId}...`);
    
    const result = await emailHistoryService.rebuildUserRAGIndex(userId);
    
    console.log(`[EmailHistory] Rebuild complete for User ${userId}: ${result.successCount} succeeded, ${result.failCount} failed.`);
    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
