/**
 * One-off script to populate a fresh database with the same content the
 * frontend ships as dummy data, so the API has something real to serve
 * from day one. Run with: npm run seed
 *
 * Safe to re-run — it upserts by unique key (email / slug / title) instead
 * of blindly inserting duplicates.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const env = require("../config/env");

const User = require("../models/User");
const Article = require("../models/Article");
const Simulation = require("../models/Simulation");
const Quiz = require("../models/Quiz");

const ARTICLES = [
  { title: "Spotting Fake Bank Calls", category: "Bank Fraud", difficulty: "Beginner", readingTime: "4 min", description: "Learn the exact phrases real bank staff never use on a call.", status: "Published" },
  { title: "Why Banks Never Ask for OTP", category: "Bank Fraud", difficulty: "Beginner", readingTime: "3 min", description: "Understand why OTP requests over phone or SMS are always a scam.", status: "Published" },
  { title: "Fake Loan Approval Scams", category: "Bank Fraud", difficulty: "Intermediate", readingTime: "5 min", description: "How scammers use \"pre-approved loans\" to steal processing fees.", status: "Published" },
  { title: "The Fake Refund Request", category: "UPI Scam", difficulty: "Beginner", readingTime: "3 min", description: "Why a \"Collect Request\" is never how you receive money.", status: "Published" },
  { title: "QR Codes That Charge You", category: "UPI Scam", difficulty: "Intermediate", readingTime: "4 min", description: "Understand how scanning a QR code can trigger a payment, not a receipt.", status: "Published" },
  { title: "Malicious QR Codes in Public", category: "QR Scam", difficulty: "Beginner", readingTime: "3 min", description: "Why you should never scan random QR stickers on parking meters or posters.", status: "Published" },
  { title: "Work-From-Home Red Flags", category: "Job Scam", difficulty: "Beginner", readingTime: "5 min", description: "Spot fake job offers before you pay a single \"registration fee\".", status: "Published" },
  { title: "The Task-Based Job Scam", category: "Job Scam", difficulty: "Intermediate", readingTime: "6 min", description: "How \"like and earn\" jobs trap victims into investing more money.", status: "Published" },
  { title: "Voice Cloning Scams", category: "Deepfake", difficulty: "Advanced", readingTime: "6 min", description: "How scammers clone a relative's voice to fake an emergency call.", status: "Draft" },
  { title: "The Fake IT Support Call", category: "Social Engineering", difficulty: "Intermediate", readingTime: "4 min", description: "Why no real IT team asks you to install remote-access software.", status: "Published" },
  { title: "Building Trust Before the Ask", category: "Social Engineering", difficulty: "Advanced", readingTime: "5 min", description: "The psychology scammers use to earn trust before requesting money.", status: "Published" },
];

const SIMULATIONS = [
  {
    slug: "bank-scam",
    label: "Bank Scam",
    icon: "Landmark",
    color: "primary",
    difficulty: "Easy",
    app: "Gmail",
    from: "HDFC Bank Alerts <alerts@hdfcbank-secure.net>",
    subject: "Immediate Action Required: Account Suspension Notice",
    body: "Dear Valued Customer,\n\nWe have detected unusual activity on your account. Your account will be suspended within 12 hours unless you verify your identity immediately.\n\nClick the link below to confirm your details and avoid suspension:\n\nverify-hdfc-account.net/confirm\n\nThank you for your prompt attention.\nHDFC Bank Security Team",
    feedback: {
      open: { correct: false, message: "That link would have taken you to a fake login page designed to steal your credentials.", xp: 5 },
      ignore: { correct: false, message: "Better than clicking, but scammers count on messages being ignored and staying in your inbox as a risk. Reporting removes the threat entirely.", xp: 15 },
      report: { correct: true, message: "Exactly right! Reporting flags the sender and protects others from the same scam.", xp: 30 },
    },
    lessonsLearned: [
      "The domain \"hdfcbank-secure.net\" is not the bank's real domain.",
      "Urgency and threats of suspension are classic pressure tactics.",
      "Always report suspicious bank emails instead of just deleting them.",
    ],
  },
  {
    slug: "otp-scam",
    label: "OTP Scam",
    icon: "KeyRound",
    color: "secondary",
    difficulty: "Easy",
    app: "SMS",
    from: "+91 78XXX-XX341",
    subject: "OTP Request",
    body: "Congratulations! You've won a Rs. 25,000 cashback reward. To claim it, share the OTP sent to your registered mobile number with our verification executive within 10 minutes.",
    feedback: {
      open: { correct: false, message: "Sharing an OTP hands over full access to whatever it protects — usually your bank account or wallet.", xp: 5 },
      ignore: { correct: false, message: "Ignoring stops you personally, but the scammer will keep calling. Reporting is stronger.", xp: 15 },
      report: { correct: true, message: "Correct — no legitimate reward program ever asks for your OTP. Reporting helps flag the number for others.", xp: 30 },
    },
    lessonsLearned: [
      "An OTP is a one-time password meant only for you — never share it, ever.",
      "\"You've won\" messages that ask for verification info are a classic scam pattern.",
      "Real cashback or rewards never require you to prove anything with an OTP.",
    ],
  },
  {
    slug: "job-scam",
    label: "Job Scam",
    icon: "Briefcase",
    color: "primary",
    difficulty: "Medium",
    app: "WhatsApp",
    from: "HR Team — Global Careers Ltd",
    subject: "Work From Home Opportunity",
    body: "Hi! We're hiring for a part-time data entry role. Earn Rs. 3,000/day working just 2 hours. To get started, pay a refundable registration fee of Rs. 499 to unlock your training material and first task.",
    feedback: {
      open: { correct: false, message: "Paying the \"registration fee\" just starts a cycle — there will always be another fee before you see a rupee.", xp: 5 },
      ignore: { correct: false, message: "Ignoring is safe for you, but this recruiter will keep targeting others. Reporting is more effective.", xp: 15 },
      report: { correct: true, message: "Right call. Legitimate employers never ask candidates to pay to get hired.", xp: 30 },
    },
    lessonsLearned: [
      "Real jobs never require you to pay money to start working.",
      "Unrealistic pay for minimal effort is a major red flag.",
      "\"Refundable\" fees are a common trick — the refund never comes.",
    ],
  },
  {
    slug: "qr-scam",
    label: "QR Scam",
    icon: "QrCode",
    color: "accent",
    difficulty: "Medium",
    app: "In Person / Poster",
    from: "Parking Payment Kiosk",
    subject: "Scan to Pay Parking Fee",
    body: "A QR code sticker is placed over the original parking payment code. Scanning it opens a UPI app with a payment request for Rs. 50 to an unfamiliar personal account name instead of the parking authority.",
    feedback: {
      open: { correct: false, message: "Completing this payment sends money directly to a scammer's personal account, not the parking authority.", xp: 5 },
      ignore: { correct: false, message: "Walking away protects you, but the sticker stays up to trap the next person. Reporting it helps everyone.", xp: 15 },
      report: { correct: true, message: "Well spotted — reporting a tampered QR code to venue staff or authorities gets it removed before others fall for it.", xp: 30 },
    },
    lessonsLearned: [
      "Always check the payee name shown before confirming any UPI payment.",
      "A sticker placed over an official QR code is a common tampering trick.",
      "When in doubt, pay through the venue's app or counter instead of scanning.",
    ],
  },
  {
    slug: "shopping-scam",
    label: "Shopping Scam",
    icon: "ShoppingBag",
    color: "secondary",
    difficulty: "Medium",
    app: "Instagram DM",
    from: "@mega.deals.India",
    subject: "80% Off Flash Sale — Today Only",
    body: "iPhone 15 for just Rs. 4,999! Limited stock, first-come first-served. Pay via UPI to reserve yours — no returns once payment is confirmed. Link in bio, hurry before it's gone!",
    feedback: {
      open: { correct: false, message: "Paying up front to an unverified account for a too-good-to-be-true deal usually means the product never arrives.", xp: 5 },
      ignore: { correct: false, message: "Scrolling past protects you, but the account keeps running the same ad on others. Reporting is the stronger move.", xp: 15 },
      report: { correct: true, message: "Correct — reporting the account helps the platform take it down before more people lose money.", xp: 30 },
    },
    lessonsLearned: [
      "Prices far below market value are designed to override careful thinking.",
      "\"No returns once paid\" removes your only safety net — a major warning sign.",
      "Verified sellers rarely pressure you with countdown urgency.",
    ],
  },
  {
    slug: "investment-scam",
    label: "Investment Scam",
    icon: "TrendingUp",
    color: "accent",
    difficulty: "Hard",
    app: "Telegram",
    from: "Wealth Growth Signals",
    subject: "Guaranteed 40% Monthly Returns",
    body: "Join our exclusive trading group! Our AI-based algorithm guarantees 40% returns every month with zero risk. Early members who invested Rs. 10,000 last month already withdrew Rs. 14,000. Limited slots — deposit now to join.",
    feedback: {
      open: { correct: false, message: "\"Guaranteed\" high returns with \"zero risk\" don't exist in real investing — this is a classic Ponzi setup.", xp: 5 },
      ignore: { correct: false, message: "Not joining protects your money, but the group keeps recruiting. Reporting helps shut it down faster.", xp: 15 },
      report: { correct: true, message: "Exactly — reporting investment fraud to the platform and authorities helps prevent others from losing their savings.", xp: 30 },
    },
    lessonsLearned: [
      "No legitimate investment can guarantee fixed high returns with zero risk.",
      "Screenshots of other people's \"withdrawals\" are easy to fake.",
      "Urgency (\"limited slots\") is used to stop you from researching first.",
    ],
  },
];

// Maps an article title to its quick-check quiz question + options.
const QUIZZES_BY_ARTICLE_TITLE = {
  "Spotting Fake Bank Calls": {
    question: "A caller claiming to be from your bank asks you to confirm your PIN over the phone. What should you do?",
    options: [
      { text: "Share it, since they already know my account number", correct: false },
      { text: "Refuse and hang up — banks never ask for PINs by phone", correct: true },
      { text: "Share only the first two digits", correct: false },
    ],
  },
  "Why Banks Never Ask for OTP": {
    question: "Why do banks never ask for your OTP over a call or message?",
    options: [
      { text: "Because OTPs are meant only for you to use, not to share", correct: true },
      { text: "Because OTPs expire too quickly to be useful", correct: false },
      { text: "Because it's against company policy for no real reason", correct: false },
    ],
  },
  "The Fake Refund Request": {
    question: "You receive a UPI \"Collect Request\" from someone claiming to send you a refund. What's true?",
    options: [
      { text: "Accepting it will receive money into your account", correct: false },
      { text: "Accepting it will actually send money OUT of your account", correct: true },
      { text: "Collect requests are always safe to accept", correct: false },
    ],
  },
  "Work-From-Home Red Flags": {
    question: "A recruiter offers a work-from-home job but asks for a small fee first. What should you do?",
    options: [
      { text: "Pay it since the job pays well anyway", correct: false },
      { text: "Decline — legitimate employers never charge candidates to work", correct: true },
      { text: "Negotiate a lower fee", correct: false },
    ],
  },
  "Voice Cloning Scams": {
    question: "You get a call that sounds exactly like a relative asking for urgent money. What's the safest first step?",
    options: [
      { text: "Send money immediately since it's an emergency", correct: false },
      { text: "Hang up and call your relative back on their known number", correct: true },
      { text: "Ask them to prove it's them over the same call", correct: false },
    ],
  },
};

async function seed() {
  await mongoose.connect(env.MONGO_URI);
  // eslint-disable-next-line no-console
  console.log(`[seed] Connected to ${mongoose.connection.name}`);

  // --- Admin user -----------------------------------------------------------
  let admin = await User.findOne({ email: env.ADMIN_SEED_EMAIL });
  if (!admin) {
    admin = await User.create({
      name: "ShieldIQ Admin",
      email: env.ADMIN_SEED_EMAIL,
      password: env.ADMIN_SEED_PASSWORD,
      role: "admin",
      accountRole: "Business",
    });
    console.log(`[seed] Created admin user: ${admin.email}`);
  } else {
    console.log(`[seed] Admin user already exists: ${admin.email}`);
  }

  // --- Demo user --------------------------------------------------------------
  let demoUser = await User.findOne({ email: "aarav.mehta@example.com" });
  if (!demoUser) {
    demoUser = await User.create({
      name: "Aarav Mehta",
      email: "aarav.mehta@example.com",
      password: "DemoPass123!",
      accountRole: "Professional",
      xp: 2140,
      streakDays: 12,
    });
    console.log(`[seed] Created demo user: ${demoUser.email}`);
  }

  // --- Articles -----------------------------------------------------------
  const articleIdByTitle = {};
  for (const a of ARTICLES) {
    const article = await Article.findOneAndUpdate(
      { title: a.title },
      { ...a, author: admin._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    articleIdByTitle[a.title] = article._id;
  }
  console.log(`[seed] Upserted ${ARTICLES.length} articles`);

  // --- Simulations ----------------------------------------------------------
  for (const s of SIMULATIONS) {
    await Simulation.findOneAndUpdate({ slug: s.slug }, s, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`[seed] Upserted ${SIMULATIONS.length} simulations`);

  // --- Quizzes (linked to the articles just created) -------------------------
  let quizCount = 0;
  for (const [title, quiz] of Object.entries(QUIZZES_BY_ARTICLE_TITLE)) {
    const articleId = articleIdByTitle[title];
    if (!articleId) continue;
    const article = ARTICLES.find((a) => a.title === title);
    await Quiz.findOneAndUpdate(
      { article: articleId },
      {
        article: articleId,
        category: article.category,
        difficulty: article.difficulty,
        question: quiz.question,
        options: quiz.options,
        xpReward: 10,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    quizCount += 1;
  }
  console.log(`[seed] Upserted ${quizCount} quizzes`);

  console.log("[seed] Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
