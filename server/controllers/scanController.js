const asyncHandler = require("express-async-handler");
const ScanHistory = require("../models/ScanHistory");
const sendSuccess = require("../utils/apiResponse");
const { analyzeContent } = require("../services/scanService");

// @route  POST /api/scan
// @access Public (saves to history only when authenticated)
//
// Accepts { scanType: "url"|"email"|"sms"|"whatsapp"|"qr", content: string }.
// Runs the mock heuristic analyzer (see services/scanService.js) and, if the
// request is authenticated, persists the result to the user's scan history.
// This is explicitly NOT connected to a real detection model yet — see the
// project brief (Gemini / Google Safe Browsing are a later phase).
const scanContent = asyncHandler(async (req, res) => {
  const { scanType, content } = req.body;

  const result = analyzeContent(content, scanType);

  let saved = null;
  if (req.user) {
    const target =
      scanType === "qr"
        ? "Uploaded QR code"
        : (content || "").trim().slice(0, 300) || "(empty input)";

    saved = await ScanHistory.create({
      user: req.user._id,
      scanType: result.scanType,
      target,
      riskLevel: result.riskLevel.replace(" Risk", ""),
      riskScore: result.riskScore,
      confidence: result.confidence,
      category: result.category,
      summary: result.summary,
      reasons: result.reasons,
      recommendations: result.recommendations,
    });
  }

  return sendSuccess(res, {
    message: "Scan complete.",
    data: { result, savedToHistory: Boolean(saved), scanId: saved?._id },
  });
});

module.exports = { scanContent };
