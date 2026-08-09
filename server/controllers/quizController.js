const asyncHandler = require("express-async-handler");
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");
const AdminLog = require("../models/AdminLog");
const sendSuccess = require("../utils/apiResponse");

// @route  GET /api/quizzes
// @access Public
// Supports ?article=<id>, ?category=, ?difficulty= filters.
const getQuizzes = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.article) filter.article = req.query.article;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const quizzes = await Quiz.find(filter).populate("article", "title category");
  return sendSuccess(res, { data: { quizzes } });
});

// @route  GET /api/quizzes/:id
// @access Public
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }
  return sendSuccess(res, { data: { quiz } });
});

// @route  POST /api/quizzes
// @access Private/Admin
const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create(req.body);
  await AdminLog.create({ admin: req.user._id, action: "quiz.create", targetId: quiz._id });
  return sendSuccess(res, { statusCode: 201, message: "Quiz created.", data: { quiz } });
});

// @route  PUT /api/quizzes/:id
// @access Private/Admin
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "quiz.update", targetId: quiz._id });
  return sendSuccess(res, { message: "Quiz updated.", data: { quiz } });
});

// @route  DELETE /api/quizzes/:id
// @access Private/Admin
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }
  await AdminLog.create({ admin: req.user._id, action: "quiz.delete", targetId: req.params.id });
  return sendSuccess(res, { message: "Quiz deleted." });
});

// @route  POST /api/quizzes/:id/submit
// @access Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { optionId } = req.body;
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found.");
  }

  const option = quiz.options.id(optionId);
  if (!option) {
    res.status(400);
    throw new Error("That option doesn't belong to this quiz.");
  }

  const xpAwarded = option.correct ? quiz.xpReward : 0;

  const result = await QuizResult.findOneAndUpdate(
    { user: req.user._id, quiz: quiz._id },
    { selectedOptionId: optionId, correct: option.correct, xpAwarded },
    { new: true, upsert: true }
  );

  if (xpAwarded > 0) {
    req.user.xp += xpAwarded;
    await req.user.save();
  }

  return sendSuccess(res, {
    message: option.correct ? "Correct!" : "Not quite.",
    data: { result, correct: option.correct, xpAwarded, xpTotal: req.user.xp },
  });
});

module.exports = { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, submitQuiz };
