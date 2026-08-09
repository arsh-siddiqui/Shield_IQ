/**
 * Mock scan "analysis" engine. This intentionally mirrors the heuristics in
 * the frontend's src/utils/scanEngine.js so results feel consistent whether
 * the app is running against the API or falling back to local analysis.
 *
 * NOT a real detection model — per the project brief, Gemini / Google Safe
 * Browsing / real scanner logic are explicitly out of scope for this phase.
 * Replace analyzeContent() with a real call when that's ready; every caller
 * only depends on the shape of the object it returns.
 */

const HIGH_RISK_WORDS = [
  "blocked", "suspend", "verify immediately", "click here", "urgent", "otp", "pin",
  "password", "kyc", "winner", "congratulations", "claim now", "act now", "limited time",
  "guaranteed", "free gift", "account will be", "final notice", "confirm your details",
];

const MEDIUM_RISK_WORDS = ["offer", "discount", "sale", "reward", "bonus", "gift card", "sign up", "subscribe"];

const RESULT_TEMPLATES = {
  high: {
    riskLevel: "High Risk",
    category: "Phishing — Fake Bank Login",
    summary:
      "This message pretends to be from your bank and tries to rush you into clicking a link that steals your login details.",
    reasons: [
      { title: "Urgent, scary language", detail: "Phrases like \"account will be blocked\" are designed to make you panic and act without thinking.", severity: "high" },
      { title: "Suspicious link domain", detail: "The link goes to a domain that is not an official, verified domain.", severity: "high" },
      { title: "Generic greeting", detail: "It says \"Dear Customer\" instead of using your real name, which official senders usually include.", severity: "medium" },
      { title: "Requests sensitive info", detail: "It asks you to \"verify\" a PIN, password, or OTP — something legitimate senders never do by message.", severity: "high" },
      { title: "Mismatched sender address", detail: "The sender's email or number doesn't match the organization's official contact.", severity: "medium" },
    ],
    recommendations: [
      "Do not click the link or download any attachment.",
      "Do not reply with any personal or banking information.",
      "Report the message through the official app or website.",
      "Block and delete the sender.",
    ],
  },
  medium: {
    riskLevel: "Medium Risk",
    category: "Suspicious — Unverified Sender",
    summary: "This message has some warning signs but isn't a clear-cut scam. Treat it with caution before acting.",
    reasons: [
      { title: "Unfamiliar sender", detail: "This sender or number hasn't contacted you before and isn't in your verified contacts.", severity: "medium" },
      { title: "Mild urgency language", detail: "Words like \"limited time\" or \"act soon\" are used, though less aggressively than a typical scam.", severity: "medium" },
      { title: "Link shortener used", detail: "The link uses a shortened URL, which hides the real destination.", severity: "medium" },
    ],
    recommendations: [
      "Verify the sender through an official channel before clicking anything.",
      "Avoid entering any personal information until you're sure it's legitimate.",
      "When in doubt, contact the organization directly using a number you already trust.",
    ],
  },
  low: {
    riskLevel: "Low Risk",
    category: "Likely Legitimate — Minor Flags",
    summary: "This message looks mostly legitimate, with only minor points worth a second glance.",
    reasons: [
      { title: "Slightly informal tone", detail: "Marketing messages sometimes use casual language — not a scam signal by itself.", severity: "low" },
      { title: "Contains a tracked link", detail: "The link includes tracking parameters, which is normal for newsletters and promotions.", severity: "low" },
    ],
    recommendations: [
      "Generally safe to proceed, but avoid entering sensitive information unless you recognize the sender.",
      "Unsubscribe if you no longer wish to receive these messages.",
    ],
  },
  safe: {
    riskLevel: "Safe",
    category: "Verified — No Threats Detected",
    summary: "No phishing indicators, suspicious links, or manipulation tactics were found in this message.",
    reasons: [
      { title: "Verified domain", detail: "The link or sender domain matches a known, official source.", severity: "low" },
      { title: "No urgency or fear tactics", detail: "The message doesn't pressure you to act quickly or share sensitive information.", severity: "low" },
    ],
    recommendations: [
      "No action needed — this message appears safe.",
      "Still avoid sharing passwords or OTPs even with senders you trust.",
    ],
  },
};

const VALID_TYPES = ["url", "email", "sms", "whatsapp", "qr"];

function analyzeContent(rawText = "", type = "url") {
  const text = String(rawText || "").toLowerCase().trim();
  const scanType = VALID_TYPES.includes(type) ? type : "url";

  let score = 8;
  let matchedHigh = 0;
  let matchedMedium = 0;

  HIGH_RISK_WORDS.forEach((w) => {
    if (text.includes(w)) {
      score += 16;
      matchedHigh += 1;
    }
  });
  MEDIUM_RISK_WORDS.forEach((w) => {
    if (text.includes(w)) {
      score += 8;
      matchedMedium += 1;
    }
  });

  if (/https?:\/\/[^\s]*(-verify|-secure|-update|\.info|\.win|\.xyz)/i.test(text)) {
    score += 20;
  }

  if (!text) {
    score = 62; // QR uploads carry no text — return a plausible demo result
  }

  score = Math.min(98, Math.max(2, score));

  let band = "safe";
  if (score >= 70) band = "high";
  else if (score >= 40) band = "medium";
  else if (score >= 15) band = "low";

  const confidence = Math.min(99, 72 + matchedHigh * 6 + matchedMedium * 3);
  const template = RESULT_TEMPLATES[band];

  return {
    riskScore: score,
    confidence,
    scanType,
    scannedAt: new Date().toISOString(),
    ...template,
  };
}

module.exports = { analyzeContent, VALID_TYPES };
