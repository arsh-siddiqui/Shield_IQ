const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendSuccess = require("../utils/apiResponse");
const { sendTokenCookie, clearTokenCookie } = require("../utils/jwt");

/**
 * Strips fields the client should never see / doesn't need, and reshapes
 * the user document into what the frontend's AppDataContext expects.
 */
function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.accountRole,
    avatar: user.avatarInitials,
    xp: user.xp,
    streakDays: user.streakDays,
    status: user.status,
    isAdmin: user.role === "admin",
    memberSince: user.createdAt,
  };
}

// @route  POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, accountRole } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists.");
  }

  const user = await User.create({ name, email, password, accountRole });
  sendTokenCookie(res, user._id);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Account created.",
    data: { user: toPublicUser(user) },
  });
});

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (user.status === "Suspended") {
    res.status(403);
    throw new Error("This account has been suspended. Contact support.");
  }

  sendTokenCookie(res, user._id);

  return sendSuccess(res, {
    message: "Logged in.",
    data: { user: toPublicUser(user) },
  });
});

// @route  POST /api/auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  return sendSuccess(res, { message: "Logged out." });
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: { user: toPublicUser(req.user) } });
});

module.exports = { register, login, logout, getMe, toPublicUser };
