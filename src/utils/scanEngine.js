import { scanResultTemplates } from "../data/dummyData";

const HIGH_RISK_WORDS = [
  "blocked", "suspend", "verify immediately", "click here", "urgent", "otp", "pin",
  "password", "kyc", "winner", "congratulations", "claim now", "act now", "limited time",
  "guaranteed", "free gift", "account will be", "final notice", "confirm your details",
];

const MEDIUM_RISK_WORDS = ["offer", "discount", "sale", "reward", "bonus", "gift card", "sign up", "subscribe"];

/**
 * Fallback local heuristic scanner for offline or quick client-side analysis.
 */
export function analyzeContent(rawText = "", type = "url") {
  const text = rawText.toLowerCase().trim();

  let score = 8; // baseline
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

  // Suspicious-looking links push the score up too.
  if (/https?:\/\/[^\s]*(-verify|-secure|-update|\.info|\.win|\.xyz)/i.test(text)) {
    score += 20;
  }

  // Empty input still returns a plausible demo result instead of erroring out.
  if (!text) {
    score = 62;
  }

  score = Math.min(98, Math.max(2, score));

  let band = "safe";
  if (score >= 70) band = "high";
  else if (score >= 40) band = "medium";
  else if (score >= 15) band = "low";

  const confidence = Math.min(99, 72 + matchedHigh * 6 + matchedMedium * 3);

  const template = scanResultTemplates[band];

  return {
    riskScore: score,
    confidence,
    scanType: type,
    scannedAt: new Date().toISOString(),
    ...template,
  };
}
