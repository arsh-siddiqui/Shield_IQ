'use strict';

/**
 * Updates a user's daily activity streak.
 * Rule:
 *   - If active today (same calendar date): streakDays stays unchanged.
 *   - If active yesterday: streakDays increments by 1.
 *   - If last active older than yesterday or first time: streakDays starts at 1.
 */
function updateStreak(user) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const lastActiveStr = user.lastActiveDate ? new Date(user.lastActiveDate).toISOString().split('T')[0] : null;

  if (lastActiveStr === todayStr) {
    return false; // Already active today — no change
  }

  const yesterday = new Date(now.getTime() - 86400000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActiveStr === yesterdayStr) {
    user.streakDays = (user.streakDays || 0) + 1;
  } else {
    user.streakDays = 1;
  }

  user.lastActiveDate = now;
  return true;
}

module.exports = { updateStreak };
