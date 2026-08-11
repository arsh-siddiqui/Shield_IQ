'use strict';

/**
 * In-memory rate limiter for ShieldIQ Assistant endpoint.
 * Limits users to 15 requests per 10 minutes.
 */

const userRequestsMap = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 15;

function assistantRateLimiter(req, res, next) {
  const userId = req.user?._id ? req.user._id.toString() : req.ip;
  const now = Date.now();

  let record = userRequestsMap.get(userId);
  if (!record || now - record.startTime > WINDOW_MS) {
    record = { startTime: now, count: 0 };
  }

  record.count += 1;
  userRequestsMap.set(userId, record);

  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please wait a few minutes before sending more assistant messages.'
    });
  }

  next();
}

module.exports = assistantRateLimiter;
