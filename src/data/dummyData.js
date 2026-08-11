// ShieldIQ — Global Content & Configuration Constants.

export const currentUser = {
  name: "Guest",
  email: "",
  role: "Student",
  avatar: "G",
  memberSince: "",
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streakDays: 0,
  scansThisMonth: 0,
  badges: [],
};

export const heroStats = [];

export const howItWorks = [
  {
    step: "Detect",
    title: "Detect",
    description: "Paste a link, email, SMS, or QR code and let ShieldIQ scan it in seconds.",
    icon: "ScanSearch",
  },
  {
    step: "Understand",
    title: "Understand",
    description: "See exactly which words and patterns make a message risky, explained in plain English.",
    icon: "Lightbulb",
  },
  {
    step: "Practice",
    title: "Practice",
    description: "Run through realistic scam simulations in a safe sandbox with zero real risk.",
    icon: "Gamepad2",
  },
  {
    step: "Stay Safe",
    title: "Stay Safe",
    description: "Build lasting habits with daily tips, streaks, and bite-sized lessons.",
    icon: "ShieldCheck",
  },
];

export const landingFeatures = [
  {
    title: "AI Scanner",
    description: "Analyze URLs, emails, SMS, WhatsApp messages, and QR codes for hidden threats.",
    icon: "ScanLine",
    color: "primary",
  },
  {
    title: "Scam Decoder",
    description: "See a message broken down line by line, with every red flag highlighted and explained.",
    icon: "FileSearch",
    color: "secondary",
  },
  {
    title: "Scam Simulator",
    description: "Practice spotting real-world scams in a safe, game-like environment.",
    icon: "Joystick",
    color: "accent",
  },
  {
    title: "Awareness Hub",
    description: "Short, friendly lessons on every scam type — no jargon, ever.",
    icon: "BookOpen",
    color: "primary",
  },
  {
    title: "Attack Replay",
    description: "Watch how a real scam unfolds step by step, from first click to recovery.",
    icon: "History",
    color: "secondary",
  },
  {
    title: "Progress Tracking",
    description: "Levels, streaks, and badges that make staying safe genuinely satisfying.",
    icon: "TrendingUp",
    color: "accent",
  },
];

export const testimonials = [
  {
    name: "Priya Nair",
    role: "Bank Employee",
    quote: "I almost clicked a fake courier link last month. ShieldIQ's decoder made me realize how obvious the signs were once I knew what to look for.",
    avatar: "PN",
  },
  {
    name: "Rohan Kulkarni",
    role: "College Student",
    quote: "The scam simulator feels like a game, not a lecture. I actually finished all the modules in a weekend.",
    avatar: "RK",
  },
  {
    name: "Sana Sheikh",
    role: "Small Business Owner",
    quote: "We forward every suspicious invoice email to the scanner now. It's caught three phishing attempts this quarter.",
    avatar: "SS",
  },
];

export const faqs = [
  {
    q: "Is ShieldIQ free to use?",
    a: "Yes, the core scanner and awareness lessons are free. Businesses can unlock team dashboards on a paid plan.",
  },
  {
    q: "Does ShieldIQ store the messages I scan?",
    a: "Scans are processed to give you a result and are not shared with anyone else. You can delete your scan history anytime from your profile.",
  },
  {
    q: "Do I need any technical knowledge?",
    a: "No. ShieldIQ is built for everyone — every result is explained in plain, everyday language.",
  },
  {
    q: "What can I scan?",
    a: "Links, emails, SMS texts, WhatsApp messages, and QR codes. Just paste, upload, or type it in.",
  },
];

export const quickActions = [
  { label: "Scan a Link", icon: "Link2", to: "/scanner", tab: "url" },
  { label: "Scan an Email", icon: "Mail", to: "/scanner", tab: "email" },
  { label: "AI Assistant", icon: "Bot", to: "/assistant" },
  { label: "Try Simulation", icon: "Gamepad2", to: "/simulator" },
];

export const dailyChallenge = {
  title: "Spot the Fake Job Offer",
  description: "Can you find all 4 red flags in this WhatsApp job offer in under 60 seconds?",
  xpReward: 50,
};

export const scannerTabs = [
  { id: "url", label: "URL", icon: "Link2", placeholder: "Paste a link, e.g. https://example.com/login" },
  { id: "email", label: "Email", icon: "Mail", placeholder: "Paste the full email content here, including sender address..." },
  { id: "sms", label: "SMS", icon: "MessageSquare", placeholder: "Paste the SMS text here..." },
  { id: "whatsapp", label: "WhatsApp", icon: "MessageCircle", placeholder: "Paste the WhatsApp message here..." },
  { id: "qr", label: "QR Code", icon: "QrCode", placeholder: "Upload a QR code image to scan" },
];

export const sampleScanResult = {
  riskLevel: "High Risk",
  riskScore: 87,
  confidence: 94,
  category: "Phishing — Fake Bank Login",
  summary: "This message pretends to be from your bank and tries to rush you into clicking a link that steals your login details.",
  reasons: [
    { title: "Urgent, scary language", detail: "Phrases like \"account will be blocked\" are designed to make you panic and act without thinking.", severity: "high" },
    { title: "Suspicious link domain", detail: "The link goes to \"banklogin-verify.com\", which is not an official bank domain.", severity: "high" },
    { title: "Generic greeting", detail: "It says \"Dear Customer\" instead of using your real name, which banks usually include.", severity: "medium" },
    { title: "Requests sensitive info", detail: "It asks you to \"verify\" your PIN or password, something real banks never do by message.", severity: "high" },
    { title: "Mismatched sender address", detail: "The sender's email domain doesn't match the bank's official domain.", severity: "medium" },
  ],
  recommendations: [
    "Do not click the link or download any attachment.",
    "Do not reply with any personal or banking information.",
    "Report the message to your bank through their official app or website.",
    "Block and delete the sender.",
  ],
};

// ---------------------------------------------------------------------------
// Scan result templates by risk band — the scan engine (src/utils/scanEngine.js)
// picks one of these based on simple keyword heuristics over the pasted input.
// ---------------------------------------------------------------------------
export const scanResultTemplates = {
  high: {
    riskLevel: "High Risk",
    category: "Phishing — Fake Bank Login",
    summary: "This message pretends to be from your bank and tries to rush you into clicking a link that steals your login details.",
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

export const decoderExamples = [
  {
    id: "bank-sms",
    title: "Fake Bank SMS",
    channel: "SMS",
    segments: [
      { text: "Dear Customer, ", tag: null },
      { text: "your account will be blocked", tag: "fear", explanation: "Creates fear of losing access to your money to make you react quickly instead of thinking carefully." },
      { text: " within 24 hours due to KYC update pending. ", tag: "urgency", explanation: "Adds a tight deadline so you don't have time to verify if this is real." },
      { text: "Click here immediately", tag: "urgency", explanation: "Urges instant action — a major red flag. Real banks give you time and multiple ways to respond." },
      { text: " to update: ", tag: null },
      { text: "http://sbi-kyc-update.info", tag: "fake-link", explanation: "This is not an official bank domain. Real bank links use their verified domain, not a random one." },
      { text: ". Failure to update will result in ", tag: null },
      { text: "permanent suspension", tag: "fear", explanation: "Another fear tactic to push you toward clicking without thinking." },
      { text: " of your account.", tag: null },
    ],
  },
  {
    id: "it-support-call",
    title: "Fake IT Support Email",
    channel: "Email",
    segments: [
      { text: "This is ", tag: null },
      { text: "Microsoft Certified Security Officer", tag: "authority", explanation: "Invents an official-sounding title to make you trust the sender without question." },
      { text: " Rajesh Kumar. We detacted a virus on you're system", tag: "grammar", explanation: "Spelling and grammar mistakes like \"detacted\" and \"you're\" are common in scam messages, even ones impersonating big companies." },
      { text: " that requires immediate remote access. ", tag: "urgency", explanation: "Pushes for fast action before you have time to verify who's actually asking." },
      { text: "Please provide your login password", tag: "credential", explanation: "No legitimate IT team ever needs your actual password — they use secure, passwordless verification methods." },
      { text: " so we can fix this on our end immediately.", tag: null },
    ],
  },
];

export const decoderExample = decoderExamples[0];

export const decoderLegend = [
  { tag: "fear", label: "Fear Tactic", color: "danger" },
  { tag: "urgency", label: "False Urgency", color: "accent" },
  { tag: "authority", label: "False Authority", color: "primary" },
  { tag: "grammar", label: "Poor Grammar", color: "secondary" },
  { tag: "credential", label: "Credential Request", color: "danger" },
  { tag: "fake-link", label: "Suspicious Link", color: "primary" },
];

export const simulatorCategories = [
  { id: "bank", label: "Bank", icon: "Landmark", difficulty: "Easy", color: "primary" },
  { id: "otp", label: "OTP", icon: "KeyRound", difficulty: "Easy", color: "secondary" },
  { id: "qr", label: "QR Code", icon: "QrCode", difficulty: "Medium", color: "accent" },
  { id: "job", label: "Job Offer", icon: "Briefcase", difficulty: "Medium", color: "primary" },
  { id: "courier", label: "Courier", icon: "Package", difficulty: "Easy", color: "secondary" },
  { id: "investment", label: "Investment", icon: "TrendingUp", difficulty: "Hard", color: "accent" },
];

export const simulatorScenario = {
  id: "bank",
  app: "Gmail",
  from: "HDFC Bank Alerts <alerts@hdfcbank-secure.net>",
  subject: "Immediate Action Required: Account Suspension Notice",
  time: "9:41 AM",
  body: "Dear Valued Customer,\n\nWe have detected unusual activity on your account. Your account will be suspended within 12 hours unless you verify your identity immediately.\n\nClick the link below to confirm your details and avoid suspension:\n\nverify-hdfc-account.net/confirm\n\nThank you for your prompt attention.\n\nHDFC Bank Security Team",
  choices: [
    { id: "click", label: "Click the Link", icon: "MousePointerClick" },
    { id: "ignore", label: "Ignore It", icon: "EyeOff" },
    { id: "report", label: "Report as Phishing", icon: "Flag" },
  ],
  feedback: {
    click: { correct: false, message: "That link would have taken you to a fake login page designed to steal your credentials.", xp: 5 },
    ignore: { correct: false, message: "Better than clicking, but scammers count on messages being ignored and staying in your inbox as a risk. Reporting removes the threat entirely.", xp: 15 },
    report: { correct: true, message: "Exactly right! Reporting flags the sender and protects others from the same scam.", xp: 30 },
  },
  lessonsLearned: [
    "The domain \"hdfcbank-secure.net\" is not the bank's real domain.",
    "Urgency and threats of suspension are classic pressure tactics.",
    "Always report suspicious bank emails instead of just deleting them.",
  ],
};

export const attackReplaySteps = [
  { id: 1, title: "Phishing Email Arrives", icon: "Mail", description: "A message posing as a bank warns of account suspension and includes an \"official-looking\" link.", tip: "Check the sender's actual email domain, not just the display name." },
  { id: 2, title: "Victim Clicks the Link", icon: "MousePointerClick", description: "Urgency and fear push the victim to click without checking the URL carefully.", tip: "Hover over links to preview the real destination before clicking." },
  { id: 3, title: "Fake Login Page Loads", icon: "MonitorSmartphone", description: "A near-identical copy of the bank's login page opens, hosted on a lookalike domain.", tip: "Type your bank's URL manually instead of clicking links in messages." },
  { id: 4, title: "Credentials Are Stolen", icon: "KeyRound", description: "The victim enters their username and password, which are instantly sent to the scammer.", tip: "Enable two-factor authentication so a password alone isn't enough." },
  { id: 5, title: "Money Is Moved", icon: "Banknote", description: "The scammer logs into the real account and transfers funds before the victim notices.", tip: "Turn on transaction alerts so you're notified the moment money moves." },
  { id: 6, title: "Recovery Begins", icon: "LifeBuoy", description: "The victim reports the fraud to their bank and files a complaint, starting the recovery process.", tip: "Report fraud within hours — most banks have a golden window to reverse transactions." },
];

export const learningPaths = [
  {
    id: "phishing",
    title: "Phishing",
    description: "Spot fake texts and emails before you click.",
    icon: "MailWarning",
    color: "primary",
    lessons: ["ph-1", "ph-2", "ph-3", "ph-4", "ph-5"]
  },
  {
    id: "upi-payment-scams",
    title: "UPI & Payment Scams",
    description: "Keep your money safe on UPI and banking apps.",
    icon: "Banknote",
    color: "secondary",
    lessons: ["up-1", "up-2", "up-3", "up-4"]
  },
  {
    id: "social-engineering",
    title: "Social Engineering",
    description: "Understand how scammers manipulate your emotions.",
    icon: "Users",
    color: "accent",
    lessons: ["se-1", "se-2", "se-3", "se-4"]
  },
  {
    id: "safe-browsing",
    title: "Safe Browsing",
    description: "Navigate the web securely.",
    icon: "Globe",
    color: "primary",
    lessons: ["sb-1", "sb-2", "sb-3", "sb-4"]
  },
  {
    id: "online-account-security",
    title: "Online Account Security",
    description: "Lock down your personal accounts.",
    icon: "Lock",
    color: "secondary",
    lessons: ["oa-1", "oa-2", "oa-3", "oa-4"]
  },
  {
    id: "modern-scams",
    title: "Modern Scams",
    description: "Recognize deepfakes, AI scams, and investment traps.",
    icon: "BrainCircuit",
    color: "accent",
    lessons: ["ms-1", "ms-2", "ms-3", "ms-4"]
  },
  {
    id: "email-security",
    title: "Email Security",
    description: "Protect your inbox from scams and imposters.",
    icon: "Mail",
    color: "primary",
    lessons: ["em-1", "em-2", "em-3"]
  },
  {
    id: "mobile-safety",
    title: "Mobile Safety",
    description: "Stay secure on your phone — the scammer's favourite target.",
    icon: "Smartphone",
    color: "secondary",
    lessons: ["mob-1", "mob-2", "mob-3"]
  },
  {
    id: "privacy-data",
    title: "Privacy & Personal Data",
    description: "Protect your personal information online.",
    icon: "Eye",
    color: "accent",
    lessons: ["prv-1", "prv-2", "prv-3"]
  }
];

export const lessons = {
  "ph-1": { id: "ph-1", title: "What Is Phishing?", description: "The basics of phishing attacks.", difficulty: "Beginner", time: "3 min" },
  "ph-2": { id: "ph-2", title: "How Phishing Works", description: "The lifecycle of a phishing scam.", difficulty: "Beginner", time: "4 min" },
  "ph-3": { id: "ph-3", title: "Spotting Fake Links", description: "Learn to read URLs like a pro.", difficulty: "Intermediate", time: "5 min" },
  "ph-4": { id: "ph-4", title: "Identifying Phishing Messages", description: "Read the red flags in emails.", difficulty: "Beginner", time: "4 min" },
  "ph-5": { id: "ph-5", title: "What To Do After Clicking", description: "Damage control basics.", difficulty: "Advanced", time: "3 min" },

  "up-1": { id: "up-1", title: "UPI Scams", description: "The collect request trap.", difficulty: "Beginner", time: "4 min" },
  "up-2": { id: "up-2", title: "QR Code Scams", description: "Why scanning random codes is risky.", difficulty: "Intermediate", time: "4 min" },
  "up-3": { id: "up-3", title: "OTP Scams", description: "The golden rule of OTPs.", difficulty: "Beginner", time: "3 min" },
  "up-4": { id: "up-4", title: "Fake Payment Requests", description: "Spotting fake invoices.", difficulty: "Intermediate", time: "3 min" },

  "se-1": { id: "se-1", title: "Fake Authority", description: "When scammers pretend to be police.", difficulty: "Intermediate", time: "5 min" },
  "se-2": { id: "se-2", title: "Urgency & Fear", description: "Why scammers rush you.", difficulty: "Beginner", time: "4 min" },
  "se-3": { id: "se-3", title: "Impersonation", description: "When a friend asks for money.", difficulty: "Intermediate", time: "4 min" },
  "se-4": { id: "se-4", title: "Fake Job Scams", description: "Too good to be true jobs.", difficulty: "Beginner", time: "5 min" },

  "sb-1": { id: "sb-1", title: "Checking Website URLs", description: "Read the real domain.", difficulty: "Beginner", time: "3 min" },
  "sb-2": { id: "sb-2", title: "Suspicious Websites", description: "Visual cues of fake sites.", difficulty: "Beginner", time: "4 min" },
  "sb-3": { id: "sb-3", title: "HTTPS Explained", description: "What the padlock means.", difficulty: "Intermediate", time: "4 min" },
  "sb-4": { id: "sb-4", title: "Safe Downloads", description: "Avoiding malware.", difficulty: "Intermediate", time: "3 min" },

  "oa-1": { id: "oa-1", title: "Strong Passwords", description: "Building unbreakable passwords.", difficulty: "Beginner", time: "4 min" },
  "oa-2": { id: "oa-2", title: "Two-Factor Authentication", description: "Your second layer of defense.", difficulty: "Beginner", time: "3 min" },
  "oa-3": { id: "oa-3", title: "Password Sharing", description: "Why you shouldn't share.", difficulty: "Beginner", time: "2 min" },
  "oa-4": { id: "oa-4", title: "Account Recovery Scams", description: "Fake support agents.", difficulty: "Intermediate", time: "4 min" },

  "ms-1": { id: "ms-1", title: "Investment Scams", description: "Guaranteed high returns are fake.", difficulty: "Advanced", time: "6 min" },
  "ms-2": { id: "ms-2", title: "Deepfake Awareness", description: "Seeing is no longer believing.", difficulty: "Advanced", time: "6 min" },
  "ms-3": { id: "ms-3", title: "AI-Generated Scams", description: "Perfect grammar phishing.", difficulty: "Intermediate", time: "5 min" },
  "ms-4": { id: "ms-4", title: "Social Media Scams", description: "Fake giveaways and clones.", difficulty: "Beginner", time: "4 min" },

  "em-1": { id: "em-1", title: "Reading Email Headers", description: "Spot the real sender behind a fake display name.", difficulty: "Beginner", time: "4 min" },
  "em-2": { id: "em-2", title: "Spoofed Email Addresses", description: "How scammers forge sender identities.", difficulty: "Intermediate", time: "4 min" },
  "em-3": { id: "em-3", title: "Malicious Attachments", description: "Why opening attachments can cost you everything.", difficulty: "Intermediate", time: "4 min" },

  "mob-1": { id: "mob-1", title: "Smishing: SMS Phishing", description: "Scam text messages explained.", difficulty: "Beginner", time: "4 min" },
  "mob-2": { id: "mob-2", title: "Vishing: Phone Call Scams", description: "What to do when scammers call.", difficulty: "Beginner", time: "4 min" },
  "mob-3": { id: "mob-3", title: "Unsafe Apps & Permissions", description: "Apps that steal your data in plain sight.", difficulty: "Intermediate", time: "5 min" },

  "prv-1": { id: "prv-1", title: "Oversharing Online", description: "What scammers learn from your social media.", difficulty: "Beginner", time: "3 min" },
  "prv-2": { id: "prv-2", title: "Data Breaches Explained", description: "What happens when a website leaks your data.", difficulty: "Intermediate", time: "4 min" },
  "prv-3": { id: "prv-3", title: "Public Wi-Fi Risks", description: "Why free Wi-Fi is a security trap.", difficulty: "Intermediate", time: "4 min" }
};

export const lessonSteps = {
  "ph-3": {
    understand: {
      title: "Spotting Fake Links",
      text: "Scammers use fake links that look almost identical to the real ones. They hope you'll click without looking closely. A fake link might have a typo, an extra word, or a different ending (like .info instead of .com)."
    },
    seeIt: {
      example: "SBI Security Alert:\nYour account will be blocked within 30 minutes.\nVerify your KYC immediately:\nhttp://sbi-kyc-update.info",
      sender: "SBI-ALERTS",
      redFlags: [
        { text: "blocked within 30 minutes", reason: "Creates false urgency and panic." },
        { text: "Verify immediately", reason: "Pushes you to act without thinking." },
        { text: "http://sbi-kyc-update.info", reason: "Suspicious domain, not the official sbi.co.in website." }
      ]
    },
    tryItYourself: {
      example: "Your Netflix subscription expires today.\nUpdate your payment information here:\nhttps://netflix-billing-update.com/login",
      sender: "Netflix Support",
      redFlags: [
        { text: "expires today", reason: "Urgency to force an immediate reaction." },
        { text: "netflix-billing-update.com", reason: "Not the official netflix.com domain." }
      ]
    },
    realWorld: {
      scenario: "You receive an SMS saying your parcel cannot be delivered unless you pay ₹25 using a link.",
      options: [
        { id: "a", text: "Pay the small amount just in case", correct: false, feedback: "This is a trap. They will steal your card details." },
        { id: "b", text: "Click the link to see what the parcel is", correct: false, feedback: "Even clicking the link can confirm your number is active or download malware." },
        { id: "c", text: "Open the courier's official app or website yourself", correct: true, feedback: "Correct! Never use the link in the message." }
      ]
    },
    quiz: [
      {
        question: "Which of these is the most suspicious URL?",
        options: [
          { id: "1", text: "amazon.com/orders", correct: false },
          { id: "2", text: "amazon-security-login.com", correct: true },
          { id: "3", text: "pay.amazon.in", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "STOP → CHECK → VERIFY",
      points: [
        { title: "STOP", text: "Don't react immediately." },
        { title: "CHECK", text: "Look at the sender, link, and request." },
        { title: "VERIFY", text: "Confirm using an official channel." }
      ]
    }
  }
};

export const quickLearns = [
  {
    id: "ql-1",
    title: "Can You Spot the Fake URL?",
    explanation: "Scammers use similar-looking domains to trick you. Only the part right before the .com or .in matters.",
    options: [
      { id: "a", text: "amazon.com", isSuspicious: false },
      { id: "b", text: "amazon-security-login.com", isSuspicious: true }
    ],
    feedback: "amazon-security-login.com is fake because the main domain is actually 'amazon-security-login', not 'amazon'."
  },
  {
    id: "ql-2",
    title: "Why Do Scammers Create Urgency?",
    explanation: "Panic makes us skip our normal checks. Scammers use deadlines to force you to act fast.",
    options: [
      { id: "a", text: "Your account is locked!", isSuspicious: true },
      { id: "b", text: "Here is your monthly statement.", isSuspicious: false }
    ],
    feedback: "'Your account is locked!' creates instant panic, a classic scammer tactic."
  }
];

export const safetyTips = [
  { title: "Never share your OTP", detail: "OTPs are for your eyes only. No bank will ever ask for them." },
  { title: "Check the actual domain", detail: "Read URLs carefully. Look for extra words or strange endings." },
  { title: "Don't act under pressure", detail: "Urgency is a red flag. Take a breath before clicking." },
  { title: "Verify unexpected payment requests", detail: "Call the person on a known number before sending money." },
  { title: "Use official apps for sensitive actions", detail: "Don't use links from SMS. Open the app directly." }
];

export const initialSkillProgress = {
  "Phishing Detection": 0,
  "Social Engineering": 0,
  "Safe Browsing": 0,
  "Online Payments": 0,
  "Scam Recognition": 0
};

export const recommendations = [
  { title: "Brush up on identifying fake emails.", lessonId: "ph-4", time: "4 min", difficulty: "Beginner" }
];

export const profileBadges = [
  { name: "First Scan", icon: "ScanLine", earned: false },
  { name: "Phish Spotter", icon: "Fish", earned: false },
  { name: "7-Day Streak", icon: "Flame", earned: false },
  { name: "Quiz Master", icon: "GraduationCap", earned: false },
  { name: "Simulation Pro", icon: "Gamepad2", earned: false },
  { name: "Community Guardian", icon: "Users", earned: false },
];

export const completedSimulations = [];

export const adminStats = [
  { label: "Published Articles", value: "11", change: "Active", icon: "FileText" },
  { label: "Scam Templates", value: "6", change: "Active", icon: "ShieldAlert" },
  { label: "Interactive Lessons", value: "25", change: "Active", icon: "BookOpen" },
];

export const adminUsers = [
  { id: 1, name: "ShieldIQ Admin", email: "admin@shieldiq.app", role: "Business", status: "Active", joined: "Aug 2026" },
];

export const adminArticles = [
  { id: 1, title: "Spotting Fake Bank Calls", category: "Bank Fraud", status: "Published", views: "—" },
  { id: 2, title: "The Fake Refund Request", category: "UPI Scam", status: "Published", views: "—" },
  { id: 3, title: "Voice Cloning Scams", category: "Deepfake", status: "Draft", views: "—" },
  { id: 4, title: "Work-From-Home Red Flags", category: "Job Scam", status: "Published", views: "—" },
];

export const monthlyGrowth = [];

export const riskDistribution = [
  { name: "Safe", value: 60, color: "#22C55E" },
  { name: "Low Risk", value: 20, color: "#14B8A6" },
  { name: "Medium Risk", value: 12, color: "#F59E0B" },
  { name: "High Risk", value: 8, color: "#EF4444" },
];

// ---------------------------------------------------------------------------
// Scam Simulator — full multi-scenario data with branching feedback
// ---------------------------------------------------------------------------
export const simulationScenarios = [
  {
    id: "bank",
    label: "Bank Scam",
    icon: "Landmark",
    difficulty: "Easy",
    color: "primary",
    app: "Gmail",
    from: "HDFC Bank Alerts <alerts@hdfcbank-secure.net>",
    subject: "Immediate Action Required: Account Suspension Notice",
    time: "9:41 AM",
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
    id: "otp",
    label: "OTP Scam",
    icon: "KeyRound",
    difficulty: "Easy",
    color: "secondary",
    app: "SMS",
    from: "+91 78XXX-XX341",
    subject: "OTP Request",
    time: "11:02 AM",
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
    id: "job",
    label: "Job Scam",
    icon: "Briefcase",
    difficulty: "Medium",
    color: "primary",
    app: "WhatsApp",
    from: "HR Team — Global Careers Ltd",
    subject: "Work From Home Opportunity",
    time: "4:15 PM",
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
    id: "qr",
    label: "QR Scam",
    icon: "QrCode",
    difficulty: "Medium",
    color: "accent",
    app: "In Person / Poster",
    from: "Parking Payment Kiosk",
    subject: "Scan to Pay Parking Fee",
    time: "1:30 PM",
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
    id: "shopping",
    label: "Shopping Scam",
    icon: "ShoppingBag",
    difficulty: "Medium",
    color: "secondary",
    app: "Instagram DM",
    from: "@mega.deals.India",
    subject: "80% Off Flash Sale — Today Only",
    time: "6:47 PM",
    body: "🔥 iPhone 15 for just Rs. 4,999! Limited stock, first-come first-served. Pay via UPI to reserve yours — no returns once payment is confirmed. Link in bio, hurry before it's gone!",
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
    id: "investment",
    label: "Investment Scam",
    icon: "TrendingUp",
    difficulty: "Hard",
    color: "accent",
    app: "Telegram",
    from: "Wealth Growth Signals",
    subject: "Guaranteed 40% Monthly Returns",
    time: "8:05 AM",
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

export const newDailyChallenges = [
  {
    id: "dc-1",
    message: "Congratulations! You have won ₹1,00,000. Pay ₹499 processing fee to claim your prize.",
    question: "What is the biggest warning sign?",
    options: [
      { id: "a", text: "It's an unexpected win", correct: false },
      { id: "b", text: "Asking for a fee to claim a prize", correct: true },
      { id: "c", text: "The prize amount is too low", correct: false }
    ],
    feedback: "Legitimate lotteries or sweepstakes never ask you to pay money to receive money."
  }
];


// ---------------------------------------------------------------------------
// Leaderboard
// ---------------------------------------------------------------------------
export const leaderboard = [
  { rank: 1, name: "Priya Nair", xp: 4820, avatar: "PN" },
  { rank: 2, name: "Vivaan Joshi", xp: 4110, avatar: "VJ" },
  { rank: 3, name: "Sana Sheikh", xp: 3675, avatar: "SS" },
  { rank: 4, name: "Rohan Kulkarni", xp: 1890, avatar: "RK" },
];
