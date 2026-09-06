// DetectIQ — Global Content & Configuration Constants.


export const heroStats = [];

export const howItWorks = [
  {
    step: "Detect",
    title: "Detect",
    description: "Paste a link, email, or SMS and let DetectIQ scan it in seconds.",
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
    title: "Unified Scanner",
    description: "Analyze URLs and emails for threats using machine learning and multi-layered heuristics.",
    icon: "ScanLine",
    color: "primary",
  },
  {
    title: "Personalized Detection",
    description: "DetectIQ compares suspicious messages against your own historical communication patterns.",
    icon: "FileSearch",
    color: "secondary",
  },
  {
    title: "Vulnerabilities",
    description: "Explore common web vulnerabilities with detailed, jargon-free explanations.",
    icon: "BookOpen",
    color: "primary",
  },
  {
    title: "Practice Previews",
    description: "Examine realistic vulnerability patterns in a safe, controlled sandbox.",
    icon: "Joystick",
    color: "accent",
  },
  {
    title: "Assessments",
    description: "Test your knowledge and prove your understanding of core security concepts.",
    icon: "CheckCircle",
    color: "secondary",
  },
  {
    title: "Adaptive Profiles",
    description: "Track your progress as DetectIQ dynamically tailors recommendations to your weaknesses.",
    icon: "TrendingUp",
    color: "accent",
  },
];

export const testimonials = [
  {
    name: "Priya Nair",
    role: "Bank Employee",
    quote: "I almost clicked a fake courier link last month. DetectIQ's decoder made me realize how obvious the signs were once I knew what to look for.",
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
    q: "Is DetectIQ free to use?",
    a: "Yes, the core scanner and awareness lessons are free. Businesses can unlock team dashboards on a paid plan.",
  },
  {
    q: "Does DetectIQ store the messages I scan?",
    a: "Scans are processed to give you a result and are not shared with anyone else. You can delete your scan history anytime from your profile.",
  },
  {
    q: "Do I need any technical knowledge?",
    a: "No. DetectIQ is built for everyone — every result is explained in plain, everyday language.",
  },
  {
    q: "What can I scan?",
    a: "Links, emails, SMS texts, and WhatsApp messages. Just paste or type it in.",
  },
];





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
