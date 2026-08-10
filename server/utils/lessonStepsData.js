/**
 * Structured lesson step content for all 25 ShieldIQ lessons.
 *
 * Each lesson contains:
 *   intro        — tagline + objectives (What you'll learn)
 *   understand   — concept (key idea) + points[] (numbered concept cards)
 *   seeIt        — realistic example + red flags
 *   tryItYourself — interactive activity example + red flags to find
 *   realWorld    — scenario + multiple choice options with feedback
 *   quiz         — 1–2 questions with explanation for the correct answer
 *   takeaway     — title + summary sentence + points[]
 */
const ALL_LESSON_STEPS = {

  // ── PHISHING ───────────────────────────────────────────────────────────────

  "ph-1": {
    intro: {
      tagline: "Understand what phishing is and how scammers use it.",
      objectives: [
        "Know the definition of phishing",
        "Recognize the most common delivery channels",
        "Understand why phishing works on people",
        "Know your first line of defence"
      ]
    },
    understand: {
      title: "What Is Phishing?",
      concept: "Phishing is when a scammer pretends to be someone you trust to trick you into giving up sensitive information.",
      points: [
        {
          title: "It arrives in many forms",
          text: "Phishing can arrive by email, SMS, WhatsApp message, or phone call. The channel doesn't matter — the goal is always the same."
        },
        {
          title: "They impersonate trusted names",
          text: "Scammers pretend to be banks, payment apps, government agencies, or even people you know."
        },
        {
          title: "The goal is your data",
          text: "They want your password, OTP, card details, or Aadhaar number. Sometimes they want money directly."
        },
        {
          title: "It works because of emotion",
          text: "Phishing exploits fear, urgency, excitement, or curiosity. When you panic, you stop checking details."
        }
      ]
    },
    seeIt: {
      example: "From: alerts@sbi-secure-update.com\nSubject: URGENT: Your SBI Account Has Been Blocked!\n\nDear Customer,\nYour SBI account has been suspended due to suspicious activity.\nClick here to restore access immediately:\nhttp://sbi-secure-update.com/verify",
      sender: "SBI-ALERT",
      redFlags: [
        { text: "sbi-secure-update.com", reason: "Not the real SBI domain (sbi.co.in). Banks only email from their official domain." },
        { text: "has been suspended", reason: "Fear tactic — threatening account loss to make you panic and act fast." },
        { text: "Click here to restore access immediately", reason: "Legitimate banks never ask you to click email links to fix account issues." }
      ]
    },
    tryItYourself: {
      example: "Your HDFC NetBanking has been temporarily disabled due to failed login attempts.\nReactivate your account now: https://hdfc-netbanking-verify.in",
      sender: "HDFC-ALERTS",
      redFlags: [
        { text: "hdfc-netbanking-verify.in", reason: "HDFC's real domain is hdfcbank.com. This is a fake lookalike domain." },
        { text: "now", reason: "Urgency word designed to push you to act without thinking." }
      ]
    },
    realWorld: {
      scenario: "You get an email saying your Paytm account has been blocked. It asks you to click a link within 2 hours to reactivate. What do you do?",
      options: [
        { id: "a", text: "Click the link and enter my details quickly", correct: false, feedback: "Clicking sends your credentials straight to the scammer. Never use links from unexpected emails." },
        { id: "b", text: "Open the official Paytm app and check my account there", correct: true, feedback: "Correct. Always verify through the official app. If nothing is wrong there, the email is fake." },
        { id: "c", text: "Reply to the email asking if it's real", correct: false, feedback: "Replying confirms your email is active and invites more targeted attacks." }
      ]
    },
    quiz: [
      {
        question: "What is the primary goal of a phishing attack?",
        explanation: "Phishing is about stealing your personal data — passwords, OTPs, card numbers. The scammer impersonates a trusted entity to make you hand it over voluntarily.",
        options: [
          { id: "1", text: "To make your device run slowly", correct: false },
          { id: "2", text: "To steal your personal information or money", correct: true },
          { id: "3", text: "To send you a promotional offer", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "STOP → CHECK → VERIFY",
      summary: "Never let urgency decide for you.",
      points: [
        { title: "STOP", text: "Don't react immediately to any urgent email or SMS." },
        { title: "CHECK", text: "Look at the sender domain and any links. Do they match the official company?" },
        { title: "VERIFY", text: "Open the official app or type the URL yourself. Never follow links from messages." }
      ]
    }
  },

  "ph-2": {
    intro: {
      tagline: "See exactly how a phishing attack unfolds step by step.",
      objectives: [
        "Understand the 5-step phishing lifecycle",
        "Know exactly where to break the chain",
        "Recognize the 'hook' used in messages",
        "Learn why verification is the key defence"
      ]
    },
    understand: {
      title: "How Phishing Works",
      concept: "A phishing attack follows a predictable chain — breaking any link in that chain protects you.",
      points: [
        {
          title: "Step 1 — The hook",
          text: "The scammer sends a realistic-looking message with an urgent problem: 'Your account is suspended', 'Your parcel is held', 'Suspicious login detected'."
        },
        {
          title: "Step 2 — The fake link",
          text: "The message contains a link to a convincing fake website that looks identical to the real one."
        },
        {
          title: "Step 3 — You enter your details",
          text: "You type your password, card number, or OTP into the fake site. The scammer captures it instantly."
        },
        {
          title: "Step 4 — The attack succeeds",
          text: "Within seconds, the scammer uses your credentials to access your real accounts or drain money."
        },
        {
          title: "Where to break the chain",
          text: "Step 3 is your best opportunity. If you never follow the link, the attack fails completely."
        }
      ]
    },
    seeIt: {
      example: "From: noreply@amazon-account-team.co\nSubject: Action Required: Unusual Sign-In Detected\n\nWe noticed a sign-in from Mumbai on a new device.\nIf this wasn't you, secure your account now:\nhttps://amazon-account-team.co/secure",
      sender: "Amazon Security",
      redFlags: [
        { text: "amazon-account-team.co", reason: "Amazon's real domain is amazon.in or amazon.com — '.co' is a fake variation." },
        { text: "secure your account now", reason: "Classic fear tactic to make you click without examining the link." },
        { text: "https://amazon-account-team.co/secure", reason: "The link domain is fake. It leads to a phishing site, not Amazon." }
      ]
    },
    tryItYourself: {
      example: "IRCTC Alert: Your ticket PNR 1234567890 has been cancelled due to a payment issue.\nRebook immediately to keep your seat: https://irctc-rebooking.com/login",
      sender: "IRCTC-SERVICE",
      redFlags: [
        { text: "irctc-rebooking.com", reason: "Real IRCTC only operates from irctc.co.in. Any other domain is fake." },
        { text: "Rebook immediately", reason: "Urgency forces action before you check whether the problem is real." }
      ]
    },
    realWorld: {
      scenario: "An SMS from 'VM-HDFCBK' says your netbanking is suspended and includes a link. What is your safest first action?",
      options: [
        { id: "a", text: "Click the link and check what's wrong", correct: false, feedback: "Sender names can be spoofed. The link is the dangerous part — never click it." },
        { id: "b", text: "Open the HDFC app and check your account status directly", correct: true, feedback: "Correct. Your bank app shows the real status. If nothing is wrong there, the SMS is fake." },
        { id: "c", text: "Reply to the SMS asking for more information", correct: false, feedback: "Replying confirms your number is active and encourages the scammer to try harder." }
      ]
    },
    quiz: [
      {
        question: "At which step can you best break the phishing chain?",
        explanation: "Step 3 — entering your data — is the irreversible moment. Refusing to click the link in Step 2 prevents you from ever reaching that point.",
        options: [
          { id: "1", text: "Step 1 — before the scammer sends the message", correct: false },
          { id: "2", text: "Step 2 — by not clicking the link in the message", correct: true },
          { id: "3", text: "Step 4 — after your data has already been captured", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "The Link Is the Trap",
      summary: "If you don't click the link, the entire phishing attack fails.",
      points: [
        { title: "Never follow links from messages", text: "Open the official app or type the website address yourself." },
        { title: "Sender names can be faked", text: "A message appearing to come from your bank can still be from a scammer." },
        { title: "Verify through official channels only", text: "If in doubt, call the company's official helpline printed on your card." }
      ]
    }
  },

  "ph-3": {
    intro: {
      tagline: "Learn to read URLs like a cybersecurity expert.",
      objectives: [
        "Find the real domain in any URL",
        "Spot lookalike and typosquat domains",
        "Recognize suspicious URL patterns",
        "Know what to do before clicking any link"
      ]
    },
    understand: {
      title: "Spotting Fake Links",
      concept: "The domain — the text right before the first slash after https:// — tells you who really owns the site.",
      points: [
        {
          title: "Find the real domain",
          text: "In 'https://secure.sbi.co.in/login', the domain is 'sbi.co.in'. In 'https://sbi.co.in.verify.com/login', the domain is 'verify.com'. Subdomains before the domain don't make a site official."
        },
        {
          title: "Look for lookalike spelling",
          text: "Scammers replace letters to deceive: 'paypa1' (number 1, not lowercase L), 'amaz0n' (zero instead of O), or 'netf1ix' (number 1 instead of L)."
        },
        {
          title: "Suspicious TLDs",
          text: "Real banks use .com, .in, .co.in. If you see .info, .xyz, .net, .click on a banking URL, treat it as suspicious."
        },
        {
          title: "Extra words in the domain",
          text: "Anything like 'sbi-kyc-update.in' or 'hdfc-secure-verify.com' is fake. Real bank domains are short and plain."
        }
      ]
    },
    seeIt: {
      example: "SBI Security Alert:\nYour account will be blocked within 30 minutes.\nVerify your KYC immediately:\nhttp://sbi-kyc-update.info",
      sender: "SBI-ALERTS",
      redFlags: [
        { text: "blocked within 30 minutes", reason: "False urgency — makes you panic and click without checking the link." },
        { text: "Verify your KYC immediately", reason: "Banks never ask you to verify KYC through a link in a message." },
        { text: "http://sbi-kyc-update.info", reason: "Not sbi.co.in. The .info TLD and extra words are classic fake domain signs." }
      ]
    },
    tryItYourself: {
      example: "Your Netflix subscription expires today.\nUpdate your payment here:\nhttps://netflix-billing-update.com/login",
      sender: "Netflix Support",
      redFlags: [
        { text: "expires today", reason: "Urgency language to push you into acting before you check the link." },
        { text: "netflix-billing-update.com", reason: "Not netflix.com. Extra words in the domain are a clear red flag." }
      ]
    },
    realWorld: {
      scenario: "You receive an SMS: 'Your parcel cannot be delivered. Pay ₹25 using this link to reschedule: bit.ly/parcel-fee'. What should you do?",
      options: [
        { id: "a", text: "Pay ₹25 — it's a small amount and I want my parcel", correct: false, feedback: "This is a card harvesting scam. They steal your full card details, not just ₹25." },
        { id: "b", text: "Click the link to see what courier company it is first", correct: false, feedback: "Even clicking confirms your number is active. Any payment link from an SMS is suspect." },
        { id: "c", text: "Go to the official courier company website or app to check my orders", correct: true, feedback: "Correct. Real courier updates appear in the official app — never through links in random SMS." }
      ]
    },
    quiz: [
      {
        question: "In the URL 'https://sbi.co.in.account-verify.com', what is the actual domain?",
        explanation: "The actual domain is 'account-verify.com'. 'sbi.co.in' is used as a subdomain to confuse you, but the site is owned by whoever registered 'account-verify.com'.",
        options: [
          { id: "1", text: "sbi.co.in", correct: false },
          { id: "2", text: "account-verify.com", correct: true },
          { id: "3", text: "https://", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Check the Domain First",
      summary: "The part right before the first single slash after https:// is the real domain — everything else is decoration.",
      points: [
        { title: "Find the real domain", text: "Look at what comes before the first '/' after 'https://'. That's who owns the site." },
        { title: "Subdomains don't make it official", text: "'sbi.co.in.phishing.com' — the real domain is 'phishing.com', not SBI." },
        { title: "Bookmark your banking sites", text: "Save your bank's real URL as a bookmark and always use it. Never search and click." }
      ]
    }
  },

  "ph-4": {
    intro: {
      tagline: "Spot the warning signs in suspicious emails before clicking anything.",
      objectives: [
        "Identify generic greetings as a red flag",
        "Recognize urgency language",
        "Check sender email domains",
        "Know what actions legitimate companies never ask for"
      ]
    },
    understand: {
      title: "Identifying Phishing Messages",
      concept: "Phishing messages have consistent warning signs — once you know them, you'll spot them even in well-crafted emails.",
      points: [
        {
          title: "Generic greetings",
          text: "'Dear Customer' or 'Dear User' instead of your real name. Your bank knows your name and uses it."
        },
        {
          title: "Urgency and threats",
          text: "'Your account will be suspended in 24 hours', 'Act now or lose access'. Real institutions give you days to weeks to respond."
        },
        {
          title: "Mismatched sender domain",
          text: "The email address domain must match the company's official website. 'support@paypal-verify.net' is not PayPal."
        },
        {
          title: "Credential requests",
          text: "No bank or legitimate service will ever ask for your password, OTP, or PIN via email. If they do, it's always a scam."
        },
        {
          title: "Grammar or spelling errors",
          text: "Professional companies proofread their communications. Errors in official-looking emails are a strong signal of fraud."
        }
      ]
    },
    seeIt: {
      example: "From: security@paypalconfirm.net\nDear Valued Customer,\n\nWe have notice unusual activity on your account. Your account is limited.\nPlease confirm your information within 48 hours or your account will be permanently closed.\n\nConfirm here: paypalconfirm.net/limited",
      sender: "PayPal Security",
      redFlags: [
        { text: "Dear Valued Customer", reason: "Real PayPal uses your full name. Generic greetings are the first red flag." },
        { text: "We have notice unusual activity", reason: "Grammar error — a professional company would never send this." },
        { text: "paypalconfirm.net", reason: "PayPal's real domain is paypal.com — any variation is a fake phishing domain." }
      ]
    },
    tryItYourself: {
      example: "Dear User,\nYour Google account have been compromised. Verify your information now to avoid losing all data.\nGo to: google-account-recovery.com",
      sender: "Google-Security",
      redFlags: [
        { text: "Dear User", reason: "Google always uses your name. 'Dear User' means they don't actually know who you are." },
        { text: "your Google account have been compromised", reason: "Grammar error — 'have been' is incorrect. Google doesn't send messages like this." },
        { text: "google-account-recovery.com", reason: "Not google.com. Google's real support is at accounts.google.com." }
      ]
    },
    realWorld: {
      scenario: "You get an email from 'support@flipkart-alerts.co' saying your order is delayed and asking you to confirm your address by clicking a link. What do you do?",
      options: [
        { id: "a", text: "Click the link and update my address quickly", correct: false, feedback: "'flipkart-alerts.co' is not Flipkart's domain (flipkart.com). Clicking would expose your data to scammers." },
        { id: "b", text: "Open the Flipkart app and track my order directly", correct: true, feedback: "Correct. Always check your order status directly in the official app — never through an email link." },
        { id: "c", text: "Reply to the email to ask for confirmation", correct: false, feedback: "Replying engages with the scammer and confirms your email is active." }
      ]
    },
    quiz: [
      {
        question: "Which of these is NOT a reliable indicator that an email might be phishing?",
        explanation: "Professional design and logos are easy to copy. The real red flags are the sender domain, generic greetings, urgency threats, and requests for credentials.",
        options: [
          { id: "1", text: "Generic greeting: 'Dear Customer'", correct: false },
          { id: "2", text: "Professional-looking logo and design", correct: true },
          { id: "3", text: "Urgent threat of account closure", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "The 5 Phishing Red Flags",
      summary: "Real companies use your name, give you time, and never ask for passwords.",
      points: [
        { title: "Generic greeting", text: "'Dear Customer' — your bank knows your name. Scammers don't." },
        { title: "Urgency + threat", text: "Deadlines of 24–48 hours are pressure tactics. Real companies don't do this." },
        { title: "Wrong sender domain", text: "The email domain must exactly match the company's real website." },
        { title: "Credential requests", text: "No company will ever ask for your password or OTP over email." },
        { title: "Grammar errors", text: "Mistakes in a professional communication are a strong warning sign." }
      ]
    }
  },

  "ph-5": {
    intro: {
      tagline: "Know exactly what to do in the minutes after clicking a phishing link.",
      objectives: [
        "Know the first thing to do if you clicked a phishing link",
        "Understand how to limit the damage fast",
        "Know when and how to contact your bank",
        "Learn why 2FA helps even after a breach"
      ]
    },
    understand: {
      title: "What To Do After Clicking",
      concept: "If you clicked a phishing link, fast action in the next few minutes can prevent most of the damage.",
      points: [
        {
          title: "Step 1 — STOP immediately",
          text: "If you realize mid-form that the site looks wrong, stop and do not submit anything. Submitted data is gone. Unsubmitted data is still safe."
        },
        {
          title: "Step 2 — Change passwords on another device",
          text: "Use your phone's data (not the same Wi-Fi) to immediately change passwords for any account affected."
        },
        {
          title: "Step 3 — Call your bank",
          text: "If you entered any financial details, call the bank's official helpline within minutes. Use the number on the back of your card."
        },
        {
          title: "Step 4 — Enable 2FA",
          text: "Two-factor authentication means that even if your password is stolen, the scammer still can't log in without your phone."
        },
        {
          title: "Step 5 — Report it",
          text: "Report the incident at cybercrime.gov.in or call 1930 (India Cybercrime Helpline)."
        }
      ]
    },
    seeIt: {
      example: "You clicked: https://sbi-kyc-verify.info/login\n\nThe page looks exactly like SBI NetBanking.\nIt asks for:\n- Customer ID\n- Password\n- Mobile OTP\n\nYou entered your Customer ID before noticing the URL looks wrong.",
      sender: "Phishing Site",
      redFlags: [
        { text: "sbi-kyc-verify.info", reason: "Not onlinesbi.sbi.co.in. The .info TLD is a clear giveaway." },
        { text: "Mobile OTP", reason: "Real banking sites never ask for the OTP as part of a login form step." }
      ]
    },
    tryItYourself: {
      example: "You clicked a WhatsApp link that opened a page asking for your Aadhaar number, PAN card, and mobile number to 'complete your KYC update'.",
      sender: "WhatsApp Link",
      redFlags: [
        { text: "asking for your Aadhaar number", reason: "KYC is never completed through a WhatsApp link — this is identity theft." },
        { text: "PAN card, and mobile number", reason: "Combining multiple government ID fields in one form is a data harvesting tactic." }
      ]
    },
    realWorld: {
      scenario: "You clicked a suspicious link and entered your email address before realising it was fake. You didn't enter your password. What is your most important next step?",
      options: [
        { id: "a", text: "Do nothing — I only gave my email address, not my password", correct: false, feedback: "Your email can now be used for targeted attacks. Change your email password immediately and enable 2FA." },
        { id: "b", text: "Change your email password on a different device and enable 2FA", correct: true, feedback: "Correct. Even a submitted email address can lead to further attacks. Act immediately." },
        { id: "c", text: "Delete the phishing email and move on", correct: false, feedback: "Deleting the email doesn't undo the data you submitted. Changing your password is the priority." }
      ]
    },
    quiz: [
      {
        question: "If you accidentally clicked a phishing link and entered your bank password, what should you do FIRST?",
        explanation: "Changing the password immediately on a separate device is the top priority. Until you change it, the scammer holds the keys to your account.",
        options: [
          { id: "1", text: "Tell your friends to warn them", correct: false },
          { id: "2", text: "Change your bank password on another device right now", correct: true },
          { id: "3", text: "Wait to see if anything suspicious happens", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Act in Minutes, Not Hours",
      summary: "Every minute after a phishing click that you don't act is a minute the scammer has your data.",
      points: [
        { title: "STOP — don't submit data", text: "If you realize mid-form, close immediately without clicking Submit." },
        { title: "Change passwords fast", text: "Use another device on a different network to change credentials." },
        { title: "Call your bank", text: "For financial details, call the official number on your card right away." },
        { title: "Report to 1930", text: "India's Cybercrime Helpline is 1930. File a report." }
      ]
    }
  },

  // ── UPI / PAYMENTS ─────────────────────────────────────────────────────────

  "up-1": {
    intro: {
      tagline: "Understand the collect request trap before you get caught by it.",
      objectives: [
        "Know the difference between sending and receiving in UPI",
        "Understand why collect requests are dangerous",
        "Recognize the typical script scammers use",
        "Know the UPI golden rule"
      ]
    },
    understand: {
      title: "UPI Scams: The Collect Request Trap",
      concept: "In UPI, YOU enter your PIN only when money leaves your account. Receiving money requires no action from you.",
      points: [
        {
          title: "What is a Collect Request?",
          text: "Anyone can send you a 'Collect Request' — a payment notification asking you to approve money being taken FROM your account."
        },
        {
          title: "The scam script",
          text: "The scammer says: 'I'm sending you money. A request will appear — just approve it to receive the money.' But approving sends money OUT, not IN."
        },
        {
          title: "Your PIN = money leaving",
          text: "Every time you enter your UPI PIN, you are authorizing a payment FROM your account. If someone tells you to enter your PIN to RECEIVE money, it is a lie."
        },
        {
          title: "Receiving needs no action",
          text: "When someone genuinely sends you money via UPI, it appears in your account instantly with no approval or PIN needed from you."
        }
      ]
    },
    seeIt: {
      example: "WhatsApp Message:\n'I'm sending ₹5,000 for your phone. Check PhonePe — there will be a request. Just approve it to receive the money.'\n\n[PhonePe Notification]\nPay ₹5,000 to 9876543210?\n[Approve] [Decline]",
      sender: "Fake Buyer",
      redFlags: [
        { text: "Just approve it to receive the money", reason: "Approving a collect request SENDS money. You never approve to receive." },
        { text: "Pay ₹5,000 to 9876543210?", reason: "The word 'Pay' clearly shows this deducts from your account." }
      ]
    },
    tryItYourself: {
      example: "Seller message: 'I've initiated the payment of ₹2,500 to your GPay. A notification will appear — just enter your PIN to claim it.'\n\n[Google Pay Alert]\nApprove payment request for ₹2,500?",
      sender: "OLX Scam Buyer",
      redFlags: [
        { text: "just enter your PIN to claim it", reason: "You enter a PIN to SEND money. Receiving money never requires your PIN." },
        { text: "Approve payment request", reason: "'Approve request' = money goes OUT of your account." }
      ]
    },
    realWorld: {
      scenario: "You're selling a phone. The buyer says he's paying via UPI and a 'collect request' will appear on PhonePe. A notification shows 'Pay ₹8,500'. What should you do?",
      options: [
        { id: "a", text: "Approve it — I'm supposed to receive money", correct: false, feedback: "The word 'Pay' means money leaves your account. You would lose ₹8,500." },
        { id: "b", text: "Decline it — receiving money never requires approving a payment", correct: true, feedback: "Correct. Legitimate UPI payments from buyers don't require you to approve anything." },
        { id: "c", text: "Ask the buyer to send a screenshot of his transaction", correct: false, feedback: "Screenshots are easily faked. Always check your own account and decline collect requests from strangers." }
      ]
    },
    quiz: [
      {
        question: "When do you enter your UPI PIN?",
        explanation: "Your UPI PIN authorizes money to leave your account. Receiving money is automatic and requires no PIN or approval from you.",
        options: [
          { id: "1", text: "To receive money into your account", correct: false },
          { id: "2", text: "To send money or approve a payment request", correct: true },
          { id: "3", text: "To check your account balance", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "UPI: PIN = Sending, Not Receiving",
      summary: "Real incoming UPI payments need no approval, no PIN, no action from you.",
      points: [
        { title: "PIN = money leaves", text: "If you need your PIN, money is going out. Always." },
        { title: "Receiving is automatic", text: "Legitimate transfers arrive instantly. You do nothing." },
        { title: "Decline all stranger collect requests", text: "If you don't know who sent it, decline it immediately." }
      ]
    }
  },

  "up-2": {
    intro: {
      tagline: "Learn why scanning someone's QR code sends your money, not theirs.",
      objectives: [
        "Know how QR codes work in payment apps",
        "Understand the 'scan to receive' scam",
        "Know who should scan whose QR",
        "Recognize QR-based scam scenarios"
      ]
    },
    understand: {
      title: "QR Code Scams",
      concept: "When you scan someone's QR code in a payment app, YOU are the one paying — not them.",
      points: [
        {
          title: "QR codes in payment apps trigger payments",
          text: "A QR code displayed on PhonePe or Google Pay encodes a payment request. Scanning it initiates a payment FROM your account."
        },
        {
          title: "To receive money, share YOUR QR",
          text: "If you want someone to pay you, show them your own QR code or tell them your UPI ID. They scan your code — you receive money."
        },
        {
          title: "The scam",
          text: "A scammer tells you to scan their QR code to 'receive' your prize, refund, or payment. Scanning their QR causes your app to ask you to pay them."
        },
        {
          title: "QR codes outside payment apps",
          text: "QR codes from strangers, posters, or WhatsApp can also link to phishing websites. Don't scan QR codes you didn't request."
        }
      ]
    },
    seeIt: {
      example: "WhatsApp Message:\n'Here is your QR code. Scan it on PhonePe to receive ₹10,000 cashback. Offer expires in 10 minutes!'\n\n[QR Code Image attached]\n\n[After Scanning: PhonePe shows 'Pay ₹10,000 to Merchant?']",
      sender: "Unknown Number",
      redFlags: [
        { text: "Scan it on PhonePe to receive ₹10,000 cashback", reason: "Scanning a QR code in PhonePe triggers a PAYMENT — not a receipt." },
        { text: "Offer expires in 10 minutes!", reason: "Artificial urgency to prevent you from stopping to think." }
      ]
    },
    tryItYourself: {
      example: "Instagram DM: 'Congratulations! You won our giveaway. Scan the QR below to receive your ₹15,000 prize money.'\n\n[QR Code]\n\nScanning it opens Google Pay with: 'Pay ₹15,000?'",
      sender: "Instagram Scammer",
      redFlags: [
        { text: "Scan the QR below to receive your ₹15,000 prize money", reason: "QR codes in payment apps trigger payments OUT, not receipts IN." },
        { text: "Congratulations! You won our giveaway.", reason: "Fake prize hooks are used to lower your guard before the QR scam." }
      ]
    },
    realWorld: {
      scenario: "A customer at your shop says he'll pay using his phone's QR code. He shows you a QR on Google Pay and tells you to scan it to receive payment. What should you do?",
      options: [
        { id: "a", text: "Scan his QR code as instructed", correct: false, feedback: "Scanning his QR code means YOU pay HIM. This is a common market QR scam." },
        { id: "b", text: "Show him your own QR code for him to scan instead", correct: true, feedback: "Correct. To receive payment, the customer scans YOUR QR code — you never scan theirs." },
        { id: "c", text: "Ask for a screenshot of the payment first", correct: false, feedback: "Screenshots are easily faked. Always use your own QR code or UPI ID for receiving payments." }
      ]
    },
    quiz: [
      {
        question: "To receive money via UPI, you should:",
        explanation: "Sharing your own QR code or UPI ID lets the payer send money TO you. If you scan their QR, you become the payer.",
        options: [
          { id: "1", text: "Scan the payer's QR code on your payment app", correct: false },
          { id: "2", text: "Share your own QR code or UPI ID with the payer", correct: true },
          { id: "3", text: "Approve the collect request they send you", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Share Your QR to Receive. Scan Their QR to Pay.",
      summary: "You control the QR shown, not the QR scanned.",
      points: [
        { title: "Scanning = you pay", text: "When you scan a QR in a payment app, money comes OUT of your account." },
        { title: "To receive: show your QR", text: "Display your own QR code or share your UPI ID to receive money." },
        { title: "Reject random QR scans", text: "Don't scan QR codes sent over WhatsApp or from strangers." }
      ]
    }
  },

  "up-3": {
    intro: {
      tagline: "Learn the one rule about OTPs that can never have exceptions.",
      objectives: [
        "Understand what an OTP protects",
        "Know why no one legitimate ever needs your OTP",
        "Recognize the most common OTP scam scripts",
        "Know exactly what to do when asked for an OTP"
      ]
    },
    understand: {
      title: "OTP Scams: The Golden Rule",
      concept: "An OTP is a one-time key that only you should ever use. Sharing it gives someone else that key — permanently.",
      points: [
        {
          title: "What an OTP does",
          text: "An OTP (One-Time Password) proves that you have access to your registered phone number. It authorizes a specific action — like a login or transaction."
        },
        {
          title: "The golden rule",
          text: "No bank, payment app, government portal, or any legitimate company will EVER ask you for your OTP over the phone, by SMS, or on WhatsApp."
        },
        {
          title: "Common scam scripts",
          text: "'Share the OTP to block suspicious activity on your account.' 'We need it to verify your KYC.' 'Share it to reverse a mistaken transfer.' All are false pretexts."
        },
        {
          title: "The SMS itself warns you",
          text: "Every OTP SMS includes the line 'Do NOT share this OTP with anyone.' The bank itself tells you. If someone asks for it, they are a scammer."
        }
      ]
    },
    seeIt: {
      example: "Phone Call:\n'Hello, I'm from SBI Bank. We've detected suspicious activity. To block unauthorized transactions, share the OTP just sent to your phone.'\n\n[SMS arrives: Your SBI OTP is 743921. Do NOT share with anyone.]",
      sender: "Fake Bank Executive",
      redFlags: [
        { text: "please share the OTP", reason: "No bank ever asks for your OTP. This is the definitive test — if they ask, it's a scam." },
        { text: "To block unauthorized transactions", reason: "Creating fear of losing money makes you want to 'help' by complying." },
        { text: "Do NOT share with anyone", reason: "The SMS itself warns you not to share it. The bank already knows sharing is dangerous." }
      ]
    },
    tryItYourself: {
      example: "WhatsApp Message:\n'Hi! I accidentally sent ₹5,000 to your UPI by mistake. Please share the OTP you received so I can reverse the transaction from my end.'",
      sender: "Unknown Number",
      redFlags: [
        { text: "Please share the OTP you received", reason: "Reversing a bank transfer never requires the RECIPIENT'S OTP. This is a lie." },
        { text: "I accidentally sent ₹5,000", reason: "A guilt and sympathy hook designed to make you want to 'help' by sharing the OTP." }
      ]
    },
    realWorld: {
      scenario: "A 'bank executive' calls saying your account was used for fraud and asks for the OTP that just arrived on your phone to 'freeze the transactions'. What do you do?",
      options: [
        { id: "a", text: "Share the OTP — I need to stop the fraud", correct: false, feedback: "Sharing the OTP does the opposite — it authorizes a transaction FROM your account." },
        { id: "b", text: "Hang up and call my bank's official helpline myself", correct: true, feedback: "Correct. Hang up immediately. Call the number on the back of your card to verify if there is a real issue." },
        { id: "c", text: "Ask them to prove they're from the bank first", correct: false, feedback: "Scammers provide fake employee IDs and branch names confidently. Hang up regardless." }
      ]
    },
    quiz: [
      {
        question: "A bank employee calls asking for your OTP to 'protect your account'. You should:",
        explanation: "Banks have backend systems to protect your account. They never need your OTP. An OTP request from anyone is always a scam — no exceptions.",
        options: [
          { id: "1", text: "Share it only if they know your account details", correct: false },
          { id: "2", text: "Hang up immediately — banks never ask for OTPs", correct: true },
          { id: "3", text: "Ask them to email the request first", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Your OTP Is For Your Eyes Only",
      summary: "The moment someone asks for your OTP, end the call — no matter what they say.",
      points: [
        { title: "No legitimate service needs your OTP", text: "Banks, apps, government — none of them need it over a call or message." },
        { title: "Hang up immediately", text: "Don't argue, don't explain. Just hang up." },
        { title: "Call back on official numbers", text: "If you're worried, call the number printed on your bank card." }
      ]
    }
  },

  "up-4": {
    intro: {
      tagline: "Learn why payment screenshots and invoices can be completely faked.",
      objectives: [
        "Understand how fake payment confirmations work",
        "Know how to verify a real payment",
        "Recognize fake invoice scam patterns",
        "Know why 'fees to receive money' is always fraud"
      ]
    },
    understand: {
      title: "Fake Payment Requests & Invoices",
      concept: "A payment screenshot proves nothing. Only your bank or UPI app shows you what actually arrived.",
      points: [
        {
          title: "Screenshots are trivial to fake",
          text: "Anyone can create a convincing payment confirmation screenshot in minutes using editing apps. They look identical to real ones."
        },
        {
          title: "The OLX / marketplace scam",
          text: "The buyer sends a fake screenshot claiming payment was sent. They pressure you to hand over the item before you actually check your bank app."
        },
        {
          title: "Fake seller invoices",
          text: "Some scammers send invoices demanding payment for services or goods you didn't order, hoping you'll pay without checking."
        },
        {
          title: "Fees to receive money",
          text: "If you're told to pay any fee — GST, processing, security deposit — before receiving money that's owed to you, it is always a scam. No exceptions."
        }
      ]
    },
    seeIt: {
      example: "[WhatsApp image: PhonePe payment screenshot showing ₹15,000 to 'Your Name']\n\nMessage: 'Done, I've sent the money. Check PhonePe. You can hand over the laptop now.'\n\n[Your actual PhonePe: No transaction received]",
      sender: "Fake Buyer",
      redFlags: [
        { text: "You can hand over the laptop now", reason: "Pressure to give the item before you verify the payment in your actual app." },
        { text: "[Your actual PhonePe: No transaction received]", reason: "The screenshot was fake — your app shows the truth." }
      ]
    },
    tryItYourself: {
      example: "Email from: payments@amazon-seller-verify.net\n\nDear Seller,\nYour payout of ₹8,200 has been processed. Due to account verification, please pay ₹500 GST clearance fee first to release the funds.",
      sender: "Fake Amazon Seller Services",
      redFlags: [
        { text: "amazon-seller-verify.net", reason: "Not Amazon's real domain. Payouts come from sellercentral.amazon.in only." },
        { text: "pay ₹500 GST clearance fee first", reason: "Paying to receive money owed to you is always a scam. No legitimate payment has upfront fees." }
      ]
    },
    realWorld: {
      scenario: "A buyer sends a screenshot showing ₹12,000 sent to your UPI. They want the product right now. What is the correct action?",
      options: [
        { id: "a", text: "Hand it over — I can see the payment in the screenshot", correct: false, feedback: "Screenshots can be faked in minutes. The product would be gone with no real payment received." },
        { id: "b", text: "Open my bank or UPI app and verify the credit appears there first", correct: true, feedback: "Correct. Only your bank app shows real transactions. Wait until you see the actual credit before handing anything over." },
        { id: "c", text: "Ask them to send the payment again to be sure", correct: false, feedback: "A second fake screenshot will look just as real. Always check your own app, not their screenshots." }
      ]
    },
    quiz: [
      {
        question: "How should you verify a UPI payment before handing goods to a buyer?",
        explanation: "Only your own bank or UPI app shows real received transactions. Screenshots shown by the buyer can be faked.",
        options: [
          { id: "1", text: "Trust the screenshot they sent on WhatsApp", correct: false },
          { id: "2", text: "Open your bank or UPI app and check your balance directly", correct: true },
          { id: "3", text: "Ask to see the payment confirmation on their phone", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Your App is the Truth. Screenshots Are Not.",
      summary: "Always verify in your own bank or UPI app before releasing any goods or services.",
      points: [
        { title: "Open your app, not their screenshot", text: "Real transactions show in your PhonePe/GPay/bank app immediately." },
        { title: "No payment from fees", text: "Any fee required before receiving money owed to you = scam." },
        { title: "Wait for actual credit", text: "If the credit hasn't appeared in your app, no payment was made." }
      ]
    }
  },

  // ── SOCIAL ENGINEERING ─────────────────────────────────────────────────────

  "se-1": {
    intro: {
      tagline: "Learn how scammers use fake authority to make you comply.",
      objectives: [
        "Recognize how fake authority scams work",
        "Know what real government agencies actually do",
        "Understand why fear is the scammer's main tool",
        "Know the correct response to any authority threat call"
      ]
    },
    understand: {
      title: "Fake Authority Scams",
      concept: "Real police and government agencies never call to demand immediate payment or threaten arrest over the phone.",
      points: [
        {
          title: "The script",
          text: "Scammers call posing as police, CBI, ED, TRAI, or bank fraud teams. They claim your number or Aadhaar is linked to illegal activity."
        },
        {
          title: "The threat",
          text: "'You will be arrested within 2 hours unless you cooperate.' This extreme fear response bypasses rational thinking."
        },
        {
          title: "The demand",
          text: "They ask you to pay a 'clearance fee', 'security deposit', or transfer money to a 'safe account' to 'protect' it during the investigation."
        },
        {
          title: "What real agencies actually do",
          text: "Real police and government agencies send official written notices to your registered address. They never call and demand immediate payment."
        }
      ]
    },
    seeIt: {
      example: "Phone Call:\n'This is Officer Sharma from the Cyber Crime Branch. Your number has been used to send 47 fraudulent messages. You are liable for arrest. To avoid immediate detention, pay ₹25,000 as a security deposit to our account within 2 hours.'",
      sender: "Fake Cyber Crime Officer",
      redFlags: [
        { text: "pay ₹25,000 as a security deposit", reason: "Law enforcement never collects fines or deposits over the phone. This is extortion." },
        { text: "within 2 hours", reason: "Artificial time pressure to prevent you from consulting family or an actual lawyer." },
        { text: "liable for arrest", reason: "Threatening arrest without any prior written notice or court order is always a fraud." }
      ]
    },
    tryItYourself: {
      example: "Automated Call: 'This is TRAI. Your mobile number has been flagged for illegal activity and will be disconnected in 2 hours. Press 1 to speak to a Cybercrime Officer immediately.'",
      sender: "Fake TRAI Robocall",
      redFlags: [
        { text: "disconnected in 2 hours", reason: "TRAI gives advance written notice before any action. A 2-hour robocall threat is always fake." },
        { text: "Press 1 to speak to a Cybercrime Officer", reason: "Real regulators don't use automated calls with 'press 1' menus to handle legal matters." }
      ]
    },
    realWorld: {
      scenario: "A 'CBI officer' calls saying your bank account is linked to money laundering and you must transfer all your savings to a 'safe government account' within 1 hour. What do you do?",
      options: [
        { id: "a", text: "Follow their instructions to clear my name", correct: false, feedback: "The 'safe government account' is the scammer's account. Real CBI doesn't operate by phone calls." },
        { id: "b", text: "Hang up, call my bank to check my account, and report to 1930", correct: true, feedback: "Correct. Hang up immediately. Real investigations involve written summons, not urgent phone demands for money." },
        { id: "c", text: "Ask for their badge number and verify it online", correct: false, feedback: "Scammers provide fake badge numbers confidently. Hang up regardless of what 'verification' they offer." }
      ]
    },
    quiz: [
      {
        question: "Real government agencies contacting you about a legal matter will:",
        explanation: "Official legal communications from government agencies come via registered post or official court summons — never via a phone call demanding immediate payment.",
        options: [
          { id: "1", text: "Call your mobile and demand payment within hours", correct: false },
          { id: "2", text: "Send an official written notice or summons to your address", correct: true },
          { id: "3", text: "Ask you to transfer money to a 'safe account'", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Hang Up. Report. Verify.",
      summary: "Fear is the weapon. Hanging up immediately removes the weapon.",
      points: [
        { title: "Hang up immediately", text: "Don't argue or try to verify. Scammers are trained to counter your doubts." },
        { title: "Real agencies send letters", text: "Arrests and fines go through written legal notices — not phone calls." },
        { title: "Call 1930", text: "India's Cybercrime Helpline handles these reports. Call and report the number." }
      ]
    }
  },

  "se-2": {
    intro: {
      tagline: "Understand why urgency is a scammer's most powerful weapon — and how to defuse it.",
      objectives: [
        "Understand what urgency does to your thinking",
        "Recognize artificial urgency tactics",
        "Learn to pause deliberately when pressured",
        "Know the real timeline that legitimate institutions use"
      ]
    },
    understand: {
      title: "Urgency & Fear as Manipulation Tools",
      concept: "Scammers create artificial time pressure because a panicking brain skips the checks that would catch the scam.",
      points: [
        {
          title: "Why urgency works",
          text: "Under stress, the brain shifts to fast, automatic responses. Scammers exploit this — they want you to act before you think."
        },
        {
          title: "Common urgency tactics",
          text: "'Respond within 10 minutes', 'Your account closes today', 'Last warning before legal action', 'You have been selected — offer expires now'."
        },
        {
          title: "Fear amplifies urgency",
          text: "Threats of arrest, account suspension, legal action, or losing money all create extreme fear. Fear speeds up your response and disables your checks."
        },
        {
          title: "Real institutions are patient",
          text: "Banks, courts, and government bodies give you weeks to respond to legitimate notices. They don't send 15-minute ultimatums."
        }
      ]
    },
    seeIt: {
      example: "SMS: 'ALERT: Your Aadhaar has been used to open 3 fraudulent accounts. To prevent your number from being blocked by DOT, call +91 7XX-XXXXXXX within 15 minutes. Time is running out!'",
      sender: "Scam Alert SMS",
      redFlags: [
        { text: "within 15 minutes. Time is running out!", reason: "Artificial deadline to force panic before you can verify anything." },
        { text: "Your Aadhaar has been used to open 3 fraudulent accounts", reason: "A scary claim that is impossible to immediately verify — designed to induce fear." },
        { text: "+91 7XX-XXXXXXX", reason: "Government alerts don't include mobile numbers. They use official helplines and written notices." }
      ]
    },
    tryItYourself: {
      example: "Email: 'FINAL WARNING: Your income tax return has been flagged for discrepancy. A case has been filed. Avoid prosecution — pay ₹4,500 penalty immediately at: tax-india-secure.com'",
      sender: "Fake IT Department",
      redFlags: [
        { text: "FINAL WARNING", reason: "Extreme urgency language designed to trigger immediate fear response." },
        { text: "tax-india-secure.com", reason: "The real IT department operates from incometax.gov.in only." },
        { text: "pay ₹4,500 penalty immediately", reason: "Real tax penalties require formal assessment orders — not website payments from unsolicited emails." }
      ]
    },
    realWorld: {
      scenario: "A pop-up on your browser says 'YOUR COMPUTER HAS A VIRUS! Call Microsoft Support at this number immediately or your data will be deleted in 5 minutes'. What should you do?",
      options: [
        { id: "a", text: "Call the number immediately to fix it", correct: false, feedback: "Microsoft never shows pop-ups with phone numbers. Calling connects you to scammers seeking remote access to your PC." },
        { id: "b", text: "Close the browser tab and ignore the pop-up", correct: true, feedback: "Correct. These 'scareware' pop-ups are harmless by themselves. Just close the tab. There is no actual virus." },
        { id: "c", text: "Restart my computer to remove the virus", correct: false, feedback: "Restarting is fine but unnecessary. The pop-up can't actually detect anything. Just close the browser tab." }
      ]
    },
    quiz: [
      {
        question: "When a message creates extreme urgency with a 10-minute deadline, the best response is to:",
        explanation: "Legitimate emergencies from real institutions never come with 10-minute phone ultimatums. The urgency itself is the warning sign — pause, breathe, and verify independently.",
        options: [
          { id: "1", text: "Act immediately to avoid the consequence", correct: false },
          { id: "2", text: "Pause, breathe, and verify through official channels before doing anything", correct: true },
          { id: "3", text: "Forward the message to others for advice", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Urgency Is the Warning Sign — Not the Signal to Act",
      summary: "The more urgent it feels, the more important it is to slow down.",
      points: [
        { title: "Pause deliberately", text: "When you feel panic from a message, that's exactly when to stop and breathe." },
        { title: "Real deadlines are measured in days", text: "Banks and government bodies give you days or weeks. 15-minute ultimatums are always fake." },
        { title: "Verify, then decide", text: "Every genuine emergency can be verified through the official app, website, or helpline." }
      ]
    }
  },

  "se-3": {
    intro: {
      tagline: "Recognize when a scammer is pretending to be someone you know.",
      objectives: [
        "Understand how account cloning and impersonation works",
        "Recognize the 'I lost my phone' script",
        "Know what to look for in a suspicious account",
        "Learn the one reliable verification step"
      ]
    },
    understand: {
      title: "Impersonation Scams",
      concept: "Scammers hack or clone social accounts to impersonate friends. The one reliable check is calling the person's real saved number.",
      points: [
        {
          title: "How accounts get cloned",
          text: "Scammers copy profile photos and names to create fake social media accounts. They then send you a request or message, appearing to be your friend."
        },
        {
          title: "The 'lost phone' script",
          text: "'Hi, I lost my phone. Using my wife's/friend's number.' This explains the unknown number and creates an emotional pretext for the money request."
        },
        {
          title: "Red flags in the request",
          text: "Urgency + money + 'don't call me' are the three elements of nearly every impersonation scam. Real friends in real emergencies would WANT you to call."
        },
        {
          title: "AI voice cloning is real",
          text: "Scammers can now clone someone's voice from just 30 seconds of audio. Even a voicemail that sounds exactly like your mother could be fake."
        }
      ]
    },
    seeIt: {
      example: "WhatsApp from unknown number:\n'Hi [Name], this is Rahul. Lost my phone. Using my wife's. Medical emergency — need ₹5,000 right now. Will return tomorrow. Send to: 9876543210 on GPay.'\n\n[Rahul's real number is saved in your contacts]",
      sender: "Impersonation via Unknown Number",
      redFlags: [
        { text: "Lost my phone. Using my wife's.", reason: "Classic setup to explain why a different, unknown number is being used." },
        { text: "need ₹5,000 right now", reason: "Urgency + money request is the core of the impersonation scam." },
        { text: "Will return tomorrow", reason: "A quick repayment promise lowers resistance to the request." }
      ]
    },
    tryItYourself: {
      example: "Instagram DM from an account with your friend's photo (0 followers, created yesterday):\n'Hey! My real account got hacked. This is my backup. I need ₹3,000 for a flight home urgently. Please don't call — I'll explain later.'",
      sender: "Cloned Account",
      redFlags: [
        { text: "0 followers, created yesterday", reason: "A real backup account would have history. A brand new account is a clone." },
        { text: "Please don't call", reason: "A real friend in trouble would want you to call. 'Don't call' blocks the one reliable verification." }
      ]
    },
    realWorld: {
      scenario: "A colleague messages you from an unknown number asking for ₹8,000 urgently, promising to explain later. What do you do?",
      options: [
        { id: "a", text: "Send the money — they're my colleague and must be in trouble", correct: false, feedback: "The number could belong to a scammer. Never send money without verifying through a known channel." },
        { id: "b", text: "Call my colleague's actual saved number to verify first", correct: true, feedback: "Correct. A 30-second call on their real number confirms if this is genuine or a scam." },
        { id: "c", text: "Ask them to explain the situation via WhatsApp first", correct: false, feedback: "Scammers have compelling stories ready. The only reliable verification is calling their known number." }
      ]
    },
    quiz: [
      {
        question: "The most reliable way to verify a money request from someone on an unknown number is:",
        explanation: "Scammers can copy photos, create believable stories, and even clone voices. The only unbeatable check is calling the person's saved contact number directly.",
        options: [
          { id: "1", text: "Ask them details only your real friend would know", correct: false },
          { id: "2", text: "Call their saved/known number to verify in person", correct: true },
          { id: "3", text: "Check if their profile photo matches", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Always Call Their Real Number",
      summary: "Before sending anyone money over an unknown number, call their saved contact first.",
      points: [
        { title: "Call, don't text", text: "Call their saved number — not the unknown one. A real friend will answer." },
        { title: "'Don't call' = red flag", text: "Any request that discourages verification is automatically suspicious." },
        { title: "UPI transfers are irreversible", text: "Once sent, money is almost impossible to recover. Verify before you act." }
      ]
    }
  },

  "se-4": {
    intro: {
      tagline: "Spot fake job offers before they cost you money.",
      objectives: [
        "Recognize the common fake job scam pattern",
        "Know why upfront fees mean a scam",
        "Understand how 'task-based' income scams work",
        "Verify job offers through official channels"
      ]
    },
    understand: {
      title: "Fake Job Scams",
      concept: "No legitimate employer ever charges you money before you start working. Any 'registration fee' is the scam.",
      points: [
        {
          title: "The hook",
          text: "Impossibly high pay for minimal skill: '₹2,000/day for data entry', 'Earn ₹1,500/hour liking videos'. Real similar roles pay ₹50–₹150/hour."
        },
        {
          title: "The registration fee",
          text: "After initial contact, they ask for ₹299–₹2,000 as a 'registration fee', 'training material deposit', or 'equipment security'. This money is never returned."
        },
        {
          title: "The cycle escalates",
          text: "Early investors often receive some payout to build trust. Then a second 'upgrade fee' is required to access better tasks. It never ends."
        },
        {
          title: "Task-based scams",
          text: "Telegram groups ask you to 'like videos' or 'complete tasks' for pay. Small initial earnings build trust before you're asked to invest more money."
        }
      ]
    },
    seeIt: {
      example: "WhatsApp Message:\n'Work from home! Earn ₹800-₹1,500 per hour with simple data entry.\nNo experience needed. Welcome bonus: ₹500.\nRegistration fee: ₹299 (refundable). Contact: +91 98XX XXXXXX'",
      sender: "Fake HR Recruiter",
      redFlags: [
        { text: "₹800-₹1,500 per hour by completing simple data entry", reason: "This is 5–10x the real market rate for data entry. Impossible pay = bait." },
        { text: "Registration fee: ₹299 (refundable)", reason: "Real employers never charge fees. 'Refundable' is always a lie in these scams." },
        { text: "Welcome bonus: ₹500", reason: "The 'bonus' is bait designed to make the ₹299 fee seem like a great deal." }
      ]
    },
    tryItYourself: {
      example: "Telegram Group Post:\n'Earn ₹500 per task by liking YouTube videos! Over ₹2,50,000 paid to members. Pay ₹500 to activate your account. Complete 5 tasks today to earn ₹3,000!'\n\n[Member screenshots showing payouts are all posted by the same few accounts]",
      sender: "Fake Task Group",
      redFlags: [
        { text: "Pay ₹500 to activate your account", reason: "Any upfront payment to 'activate' a job is a scam." },
        { text: "Earn ₹500 per task by liking YouTube videos", reason: "YouTube doesn't pay third parties for likes. This income source doesn't exist." }
      ]
    },
    realWorld: {
      scenario: "A recruiter on LinkedIn offers ₹3,000/day for product review tasks but asks for ₹1,000 'training material deposit' before you start. What do you do?",
      options: [
        { id: "a", text: "Pay the deposit — it seems refundable and the pay is great", correct: false, feedback: "This is exactly how the scam begins. After ₹1,000, there will be more fees. Nothing is refunded." },
        { id: "b", text: "Refuse and report the recruiter's profile as fraudulent", correct: true, feedback: "Correct. No legitimate employer charges you to begin working. Report the profile." },
        { id: "c", text: "Ask for a signed contract before paying", correct: false, feedback: "Scammers send convincing fake contracts. The only safe answer is never paying upfront." }
      ]
    },
    quiz: [
      {
        question: "A legitimate employer will:",
        explanation: "Real employers pay you for work performed. They never charge you to start, no matter how small the fee or convincing the reason.",
        options: [
          { id: "1", text: "Ask for a small fee to start your training", correct: false },
          { id: "2", text: "Pay you for your work — never charge you anything upfront", correct: true },
          { id: "3", text: "Offer ₹1,000+/hour for simple online tasks", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Real Jobs Pay You. Fake Jobs Charge You.",
      summary: "If you pay to start working, you're paying the scammer.",
      points: [
        { title: "No upfront fees. Ever.", text: "Any job requiring advance payment before your first rupee is earned is a scam." },
        { title: "Impossible pay = red flag", text: "If the hourly rate seems too high for the skill needed, it's bait." },
        { title: "Verify on official platforms", text: "Check if the company exists on MCA21.gov.in or their own verifiable website." }
      ]
    }
  },

  // ── SAFE BROWSING ──────────────────────────────────────────────────────────

  "sb-1": {
    intro: {
      tagline: "Learn to identify the real owner of any website in seconds.",
      objectives: [
        "Find the domain in any URL",
        "Understand how subdomains can deceive you",
        "Identify fake domains that look official",
        "Develop safe URL habits"
      ]
    },
    understand: {
      title: "Checking Website URLs",
      concept: "The text right before the FIRST single slash after 'https://' is the real domain — that's who owns the site.",
      points: [
        {
          title: "How to find the real domain",
          text: "In 'https://onlinesbi.sbi.co.in/login', the domain is 'sbi.co.in'. Everything before it ('onlinesbi') is a subdomain and can be anything — it doesn't make the site official."
        },
        {
          title: "The subdomain trick",
          text: "'https://sbi.co.in.login-verify.com' — 'sbi.co.in' is the subdomain here. The real domain is 'login-verify.com'. A scammer put a real bank name as a subdomain to fool you."
        },
        {
          title: "Official vs fake domains",
          text: "SBI uses 'sbi.co.in'. Any domain like 'sbi-kyc.in', 'sbibank.net', 'onlinesbi.com' is fake."
        },
        {
          title: "Safe URL habits",
          text: "Bookmark your bank's real URL. Always type it yourself or use your saved bookmark. Never search for 'SBI login' and click results."
        }
      ]
    },
    seeIt: {
      example: "Real SBI URL: https://onlinesbi.sbi.co.in\n\nFake lookalike URLs:\n1. https://sbi.co.in.login-verify.com  → real domain: login-verify.com\n2. https://secure-sbi-netbanking.in     → real domain: secure-sbi-netbanking.in\n3. http://sbi-kyc-update.info           → real domain: sbi-kyc-update.info",
      sender: "URL Analysis",
      redFlags: [
        { text: "sbi.co.in.login-verify.com", reason: "'sbi.co.in' is just a subdomain. The real domain is 'login-verify.com' — a fake site." },
        { text: "secure-sbi-netbanking.in", reason: "SBI's real domain is 'sbi.co.in'. This is a completely different domain." },
        { text: "http://sbi-kyc-update.info", reason: "Uses HTTP (not HTTPS) and .info TLD. No bank uses these for real services." }
      ]
    },
    tryItYourself: {
      example: "Which URL is the legitimate Income Tax portal?\n\n1. https://incometaxindiaefiling.gov.in\n2. https://incometax-india-filing.com\n3. https://incometax.gov.in.forms.com\n4. https://incometaxindia.gov.in",
      sender: "URL Verification Practice",
      redFlags: [
        { text: "incometax-india-filing.com", reason: "Real government sites use .gov.in. '.com' with hyphens is a fake domain." },
        { text: "incometax.gov.in.forms.com", reason: "The actual domain here is 'forms.com'. 'gov.in' is just a subdomain trick." }
      ]
    },
    realWorld: {
      scenario: "You searched 'HDFC netbanking login' and the first result shows 'https://hdfcbank.net/netbanking'. Is it safe?",
      options: [
        { id: "a", text: "Yes — it has 'hdfcbank' in the name", correct: false, feedback: "HDFC Bank's real domain is hdfcbank.com. 'hdfcbank.net' is a different, potentially dangerous domain." },
        { id: "b", text: "No — go to hdfcbank.com directly, never trust search results for banking", correct: true, feedback: "Correct. Bookmark your bank's real URL and use it directly. Never rely on search results." },
        { id: "c", text: "Check if it has HTTPS — if yes, it's safe", correct: false, feedback: "Scam sites use HTTPS too. HTTPS confirms encryption — not that the site is legitimate." }
      ]
    },
    quiz: [
      {
        question: "What is the real domain in the URL 'https://hdfc.co.in.verify-account.xyz'?",
        explanation: "The domain is everything between the double-slash and the first single slash. Here: 'hdfc.co.in.verify-account.xyz' — the real domain is 'verify-account.xyz'.",
        options: [
          { id: "1", text: "hdfc.co.in", correct: false },
          { id: "2", text: "verify-account.xyz", correct: true },
          { id: "3", text: "https://", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Domain = Identity",
      summary: "The domain is the only reliable identifier of who owns a website.",
      points: [
        { title: "Find the real domain", text: "Look between '//' and the first single '/'. That's the real owner." },
        { title: "Subdomains are irrelevant", text: "Anyone can create 'sbi.co.in.myfakesite.com'. The domain is 'myfakesite.com'." },
        { title: "Bookmark, don't search", text: "Bookmark your banking sites. Use them every time. Never search and click." }
      ]
    }
  },

  "sb-2": {
    intro: {
      tagline: "Learn to visually identify suspicious or fake websites.",
      objectives: [
        "Spot visual red flags on fake websites",
        "Recognize suspicious payment page behaviour",
        "Know why impossibly low prices are always bait",
        "Identify fake e-commerce and prize sites"
      ]
    },
    understand: {
      title: "Recognizing Suspicious Websites",
      concept: "Fake websites often have visual cues that reveal them — you just need to know where to look.",
      points: [
        {
          title: "Impossible pricing",
          text: "An iPhone 15 for ₹5,999, a brand bag for ₹499. These prices are physically impossible. When a price is too good to be true by a massive margin, it's bait."
        },
        {
          title: "Payment redirects to unknown domains",
          text: "Real online stores process payment on their own domain or known gateways (Razorpay, Paytm, CCAvenue). If checkout redirects to a completely different domain, leave immediately."
        },
        {
          title: "No business contact information",
          text: "Legitimate businesses list a physical address, company email, and phone number. A Gmail address as the only contact is a red flag."
        },
        {
          title: "Aggressive pop-ups",
          text: "Pop-ups you can't close, countdown timers, 'you are visitor 1,000,000' banners. These are manipulation tactics, not signs of a real website."
        }
      ]
    },
    seeIt: {
      example: "Fake shopping site: 'ShoppinG Deal's'\n\n- iPhone 15 Pro listed at ₹5,999\n- 'Checkout' button redirects to: checkout-payment.xyz\n- Contact: shopdeals999@gmail.com\n- SSL padlock present, but domain is shoppingdeals.net\n- No refund policy, no physical address",
      sender: "Fake E-Commerce Site",
      redFlags: [
        { text: "iPhone 15 Pro listed at ₹5,999", reason: "Real iPhone 15 Pro costs ₹1,29,900+. An 95% discount is impossible." },
        { text: "checkout-payment.xyz", reason: "Payment redirecting to a completely different domain is a strong indicator of fraud." },
        { text: "shopdeals999@gmail.com", reason: "Real businesses have domain-based emails (support@company.com), not Gmail." }
      ]
    },
    tryItYourself: {
      example: "Website pop-up:\n'⚠️ Congratulations! You are visitor #1,000,000! Claim your free iPhone!\n\nEnter your name, address, and credit card number to pay ₹99 shipping.'\n\n[Close button is non-functional]",
      sender: "Scareware Pop-Up",
      redFlags: [
        { text: "Congratulations! You are visitor #1,000,000!", reason: "This pop-up appears for every visitor — it's a fabricated hook, not a real event." },
        { text: "credit card number to pay ₹99 shipping", reason: "The card details are the actual target. The ₹99 is just a reason to ask for them." },
        { text: "Close button is non-functional", reason: "Trapping you on the page is an aggressive tactic — a sign of a fraudulent site." }
      ]
    },
    realWorld: {
      scenario: "A website offers 90% off branded shoes and requests payment only via personal UPI ID (not a payment gateway). What do you do?",
      options: [
        { id: "a", text: "Buy — discounts are common online and I'll risk it", correct: false, feedback: "90% off branded goods is not possible through legitimate retail. This is a fraud site." },
        { id: "b", text: "Refuse — personal UPI IDs and impossible discounts are major red flags", correct: true, feedback: "Correct. Legitimate retailers use payment gateways. Payment to a personal UPI ID for an online purchase is always suspect." },
        { id: "c", text: "Buy only if the site has HTTPS", correct: false, feedback: "Scam sites use HTTPS. The payment method and pricing are the real red flags, not the padlock." }
      ]
    },
    quiz: [
      {
        question: "Which is the most serious red flag on a shopping website?",
        explanation: "A checkout that redirects to a completely different domain means the actual payment is being collected by someone other than the store you see. This is a classic fraud pattern.",
        options: [
          { id: "1", text: "The website loads slowly", correct: false },
          { id: "2", text: "Payment checkout redirects to an unrelated domain", correct: true },
          { id: "3", text: "The site has no social media links", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Look Beyond the Design",
      summary: "Fake sites can look professional. Pricing, payment method, and contact info are what reveal them.",
      points: [
        { title: "Too cheap = bait", text: "Impossible discounts on branded goods are the primary lure of fraud sites." },
        { title: "Check the payment page URL", text: "The URL during checkout should stay on the same domain as the store." },
        { title: "Look for real contact info", text: "Physical address, company email, and phone number — if missing, it's suspect." }
      ]
    }
  },

  "sb-3": {
    intro: {
      tagline: "Understand what the HTTPS padlock really tells you — and what it doesn't.",
      objectives: [
        "Know what HTTPS and the padlock actually mean",
        "Understand why HTTPS doesn't guarantee a site is safe",
        "Know what you must always check alongside HTTPS",
        "Apply the correct two-step website check"
      ]
    },
    understand: {
      title: "HTTPS Explained",
      concept: "HTTPS means your connection is encrypted. It does NOT mean the site is legitimate. Scammers use HTTPS too.",
      points: [
        {
          title: "What HTTPS actually means",
          text: "HTTPS encrypts data between your browser and the website. No one intercepting the traffic can read what you type. This is important but limited."
        },
        {
          title: "What HTTPS does NOT mean",
          text: "HTTPS doesn't tell you who runs the site. A scammer can get a free SSL certificate in minutes and show you the same padlock as a real bank."
        },
        {
          title: "Phishing sites use HTTPS",
          text: "Over 80% of phishing sites now use HTTPS. The padlock is no longer a safety indicator — it only tells you the connection is encrypted."
        },
        {
          title: "The correct two-step check",
          text: "For a website to be safe you need BOTH: (1) HTTPS (encrypted connection) AND (2) the correct, official domain (legitimate ownership)."
        }
      ]
    },
    seeIt: {
      example: "Browser address bar:\n🔒 https://hdfc-bank-netbanking-secure.com\n\n✅ SSL padlock shown\n✅ HTTPS present\n✅ Page looks identical to HDFC NetBanking\n❌ Domain is NOT hdfcbank.com\n\nThe padlock only protects the data in transit to this scammer's site.",
      sender: "Browser Security Demo",
      redFlags: [
        { text: "hdfc-bank-netbanking-secure.com", reason: "This is not HDFC's domain. The padlock is irrelevant to who actually runs the site." }
      ]
    },
    tryItYourself: {
      example: "Your friend says: 'This website is safe — it has the padlock!'\n\nThe site URL is: https://paytm-customer-support.co\n\nIs your friend correct?",
      sender: "Friend's Recommendation",
      redFlags: [
        { text: "paytm-customer-support.co", reason: "Paytm's real domain is paytm.com — not .co. The padlock is unrelated to this." }
      ]
    },
    realWorld: {
      scenario: "A site has HTTPS and shows a padlock, but the domain is 'axisbank-login.net'. Is it safe for banking?",
      options: [
        { id: "a", text: "Yes — the padlock confirms it's official", correct: false, feedback: "The padlock only confirms encryption. 'axisbank-login.net' is not Axis Bank's domain (axisbank.com)." },
        { id: "b", text: "No — the domain is not axisbank.com, regardless of the padlock", correct: true, feedback: "Correct. Domain verification is your primary safety check. HTTPS is secondary." },
        { id: "c", text: "Ask the site for their security certificate", correct: false, feedback: "Any site can have a certificate, including fraudulent ones. Domain check is the only reliable indicator." }
      ]
    },
    quiz: [
      {
        question: "A site with HTTPS and a padlock is:",
        explanation: "HTTPS means the connection is encrypted — not that the site is trustworthy. You must still verify the domain is the real official one.",
        options: [
          { id: "1", text: "Guaranteed to be a legitimate website", correct: false },
          { id: "2", text: "Encrypting your connection, but could still be a phishing site", correct: true },
          { id: "3", text: "Approved by the government or a bank", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Padlock + Correct Domain = Safe",
      summary: "HTTPS without the right domain is half a check — and still dangerous.",
      points: [
        { title: "Padlock ≠ legitimacy", text: "Free SSL certificates are available to everyone, including scammers." },
        { title: "Domain is the primary check", text: "The domain name is the only reliable indicator of who runs the site." },
        { title: "Both checks needed", text: "HTTPS (encryption) + correct official domain = only then consider it safe." }
      ]
    }
  },

  "sb-4": {
    intro: {
      tagline: "Protect yourself from malware disguised as useful software.",
      objectives: [
        "Know where safe downloads come from",
        "Recognize fake update and driver pop-ups",
        "Understand what file extensions signal risk",
        "Know how to respond to OS security warnings"
      ]
    },
    understand: {
      title: "Safe Downloads",
      concept: "Safe software comes from official app stores or the developer's own official website — nowhere else.",
      points: [
        {
          title: "What is malware?",
          text: "Malware is software that harms your device or steals data. It arrives disguised as something useful: a free tool, a video player, a PDF converter, or an 'update'."
        },
        {
          title: "Safe download sources",
          text: "Google Play Store, Apple App Store, or the software maker's official website (nvidia.com, adobe.com). Anywhere else introduces risk."
        },
        {
          title: "Fake update pop-ups",
          text: "Websites cannot detect your driver or software versions. Any pop-up saying 'your Flash Player / Chrome / driver is outdated' is a scam trying to install malware."
        },
        {
          title: "Heed OS warnings",
          text: "Windows SmartScreen and macOS Gatekeeper warn you about unverified publishers for good reason. If the warning appears, don't proceed."
        }
      ]
    },
    seeIt: {
      example: "Email:\n'Free PDF Converter — no watermarks! Download: pdf-free-tools.net/converter.exe'\n\nFile: pdf_converter.exe\nSize: 45 KB (real converters are 10+ MB)\nPublisher: Unknown\nWindows warns: 'This app could harm your device'",
      sender: "Malware Distribution Email",
      redFlags: [
        { text: "pdf_converter.exe", reason: "Legitimate PDF tools don't need .exe files. An .exe from an email link is very high risk." },
        { text: "45 KB", reason: "A real PDF converter would be several MB. A 45KB executable is almost certainly malware." },
        { text: "This app could harm your device", reason: "Windows SmartScreen says this because it is genuinely dangerous. Trust this warning." }
      ]
    },
    tryItYourself: {
      example: "Browser pop-up:\n'⚠️ Your video driver is outdated! Download the latest update for better performance: driver-update-now.xyz/setup.exe'",
      sender: "Fake Driver Update Pop-Up",
      redFlags: [
        { text: "driver-update-now.xyz", reason: "Real driver updates come from nvidia.com, amd.com, or intel.com — not random .xyz sites." },
        { text: "Your video driver is outdated!", reason: "Websites cannot read your driver versions. This warning is entirely fabricated." }
      ]
    },
    realWorld: {
      scenario: "A website shows a pop-up: 'Your Flash Player is outdated. Update it to view this content.' Should you click the download button?",
      options: [
        { id: "a", text: "Yes — I need Flash to view the content", correct: false, feedback: "Adobe Flash was discontinued in December 2020. Any Flash update pop-up is a malware installer." },
        { id: "b", text: "No — Flash is discontinued and all such pop-ups are malware traps", correct: true, feedback: "Correct. Flash is dead. These pop-ups are one of the oldest malware distribution tactics still used today." },
        { id: "c", text: "Only if the website looks professional", correct: false, feedback: "Malware sites can look professional. The pop-up content — not the design — is the red flag." }
      ]
    },
    quiz: [
      {
        question: "Where should you download software updates from?",
        explanation: "Official app stores and the developer's own website are the only verified, safe sources. Third-party download sites often bundle malware with legitimate software.",
        options: [
          { id: "1", text: "The first result in a Google search for 'free download'", correct: false },
          { id: "2", text: "The official app store or the developer's own website", correct: true },
          { id: "3", text: "Any site that offers a free version of the software", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Official Sources Only",
      summary: "If the software didn't come from an official app store or the developer's own site, don't install it.",
      points: [
        { title: "Official sources only", text: "Google Play, Apple App Store, or the developer's real website." },
        { title: "Pop-up updates are always fake", text: "No website can detect your software versions. Close pop-up update warnings." },
        { title: "Trust OS warnings", text: "Windows/macOS warnings about unknown publishers exist to protect you. Listen to them." }
      ]
    }
  },

  // ── ONLINE ACCOUNT SECURITY ────────────────────────────────────────────────

  "oa-1": {
    intro: {
      tagline: "Build passwords that actually protect your accounts.",
      objectives: [
        "Understand what makes a password weak or strong",
        "Know why password reuse is dangerous",
        "Create a strong password you can remember",
        "Learn about password managers"
      ]
    },
    understand: {
      title: "Strong Passwords",
      concept: "A long, unique, random password for each account is your single most effective account protection.",
      points: [
        {
          title: "Why common passwords fail",
          text: "'Rahul@123', 'myname2024', 'password1' — these appear on every hacker wordlist. Automated tools crack them in under a second."
        },
        {
          title: "Length is the most important factor",
          text: "Every extra character makes the password exponentially harder to crack. 12 characters is the minimum. 16+ is better."
        },
        {
          title: "Unique for every account",
          text: "If one site is breached and you reuse passwords, every account with the same password is immediately at risk."
        },
        {
          title: "Use a password manager",
          text: "Tools like Bitwarden (free), Google Password Manager, or 1Password create and store unique strong passwords for every site — you only need to remember one master password."
        }
      ]
    },
    seeIt: {
      example: "Weak Passwords:\n- arjun1990       (name + year)\n- Arjun@123      (name + pattern)\n- password1       (top 10 most common)\n- MyDog@2024     (personal info)\n\nStrong Passwords:\n- xK9!mLqR2@vPz  (random, 14 chars)\n- correct-horse-battery-staple  (passphrase)\n- Tb7#nW!3@Qr$Lx  (long and random)",
      sender: "Password Strength Examples",
      redFlags: [
        { text: "arjun1990", reason: "Name + birth year is the first combination any attacker tries." },
        { text: "password1", reason: "One of the most used passwords in the world. Cracked in milliseconds." },
        { text: "MyDog@2024", reason: "Personal information combined with the current year — very guessable." }
      ]
    },
    tryItYourself: {
      example: "Identify which passwords are strong and which are weak:\n\n1. Priya@2024\n2. m!Xy3$Qz9#Lp\n3. ilovecricket\n4. qwerty123\n5. I-Like-Chai-And-Biryani-7!",
      sender: "Password Strength Practice",
      redFlags: [
        { text: "Priya@2024", reason: "Name + year pattern. Predictable and present in common password wordlists." },
        { text: "qwerty123", reason: "Keyboard pattern + sequential numbers. One of the most common weak passwords." }
      ]
    },
    realWorld: {
      scenario: "You use the same password for Gmail, Instagram, and your bank netbanking. Instagram is hacked and your password is exposed. What is at risk?",
      options: [
        { id: "a", text: "Only my Instagram account", correct: false, feedback: "Password reuse means every account with that password is compromised. Your Gmail and bank are both at immediate risk." },
        { id: "b", text: "All accounts using the same password — including my bank", correct: true, feedback: "Correct. This is called credential stuffing — attackers automatically try breached passwords across all major services." },
        { id: "c", text: "Nothing — the breach happened on Instagram, not my bank", correct: false, feedback: "The password is what matters, not which site was breached. All accounts sharing that password are at risk." }
      ]
    },
    quiz: [
      {
        question: "Which password is the strongest?",
        explanation: "The random 14-character password with mixed symbols, numbers, and letters is exponentially stronger than name-based patterns, regardless of how 'clever' the variation seems.",
        options: [
          { id: "1", text: "Rahul@India2024!", correct: false },
          { id: "2", text: "P@ssw0rd", correct: false },
          { id: "3", text: "z$7!Qm#Lx9@Bp2", correct: true }
        ]
      }
    ],
    takeaway: {
      title: "Long. Unique. Random.",
      summary: "One weak password reused everywhere is your biggest account security risk.",
      points: [
        { title: "Minimum 12 characters", text: "Length is the single most important factor. Add more characters, not just symbols." },
        { title: "Unique for every site", text: "One breach exposing a reused password can cascade across all your accounts." },
        { title: "Use a password manager", text: "Bitwarden is free. It creates and stores unique strong passwords automatically." }
      ]
    }
  },

  "oa-2": {
    intro: {
      tagline: "Add a second layer of protection that stops attackers even if they have your password.",
      objectives: [
        "Understand what two-factor authentication is",
        "Know why it's so effective",
        "Know which accounts need it most urgently",
        "Choose the strongest 2FA method for you"
      ]
    },
    understand: {
      title: "Two-Factor Authentication (2FA)",
      concept: "2FA means an attacker needs both your password AND physical access to your phone to get in — the password alone is useless.",
      points: [
        {
          title: "What 2FA adds",
          text: "After entering your password, you must provide a second proof — typically an OTP sent to your phone, or a code from an authenticator app."
        },
        {
          title: "Why stolen passwords stop working",
          text: "Even if a scammer buys your password from a data breach, they can't log in without the second factor — which requires physical access to your phone."
        },
        {
          title: "Enable email 2FA first",
          text: "Your email is the master key to every account. Whoever controls your email can reset your bank password, social accounts, and everything else."
        },
        {
          title: "Authenticator apps are stronger than SMS",
          text: "SMS OTPs can be intercepted via SIM-swapping. Authenticator apps (Google Authenticator, Authy) generate codes locally on your phone and cannot be intercepted."
        }
      ]
    },
    seeIt: {
      example: "Gmail Login with 2FA enabled:\n\nStep 1: Enter email + password → Correct ✓\nStep 2: Enter the 6-digit code from Google Authenticator → Required\n\n[Attacker has the password but not your phone]\n→ Login blocked at Step 2. Account protected.",
      sender: "2FA Login Flow",
      redFlags: [
        { text: "Step 1 only", reason: "Without 2FA, a stolen password is all an attacker needs. Step 2 makes the password insufficient alone." }
      ]
    },
    tryItYourself: {
      example: "Which of these counts as Two-Factor Authentication?\n\nA. Security question after your password\nB. OTP sent to your registered mobile number after password\nC. Entering the same password twice\nD. Fingerprint scan as the only login method",
      sender: "2FA Identification Exercise",
      redFlags: [
        { text: "A. Security question after your password", reason: "A knowledge question is still a single 'something you know' factor — not true 2FA." },
        { text: "C. Entering the same password twice", reason: "Repeating one factor is not two factors. Nothing changes about the security model." }
      ]
    },
    realWorld: {
      scenario: "A hacker in Russia has your Gmail password from a data breach. You have SMS 2FA enabled. What happens when they try to log in?",
      options: [
        { id: "a", text: "They access Gmail using the password", correct: false, feedback: "2FA blocks them. After the password, they need an OTP sent to your Indian SIM card — which they don't have." },
        { id: "b", text: "They're blocked at step 2 — they can't get the OTP from your phone", correct: true, feedback: "Exactly right. The password is useless without the second factor." },
        { id: "c", text: "They can still get in using your security question", correct: false, feedback: "Properly configured 2FA doesn't allow security question bypasses during normal login flow." }
      ]
    },
    quiz: [
      {
        question: "With 2FA enabled, what does an attacker need to access your account?",
        explanation: "2FA requires two independent proofs: your password (something you know) AND a code from your phone (something you have). One alone is not enough.",
        options: [
          { id: "1", text: "Just your password", correct: false },
          { id: "2", text: "Your password AND physical access to your phone", correct: true },
          { id: "3", text: "Your password and your date of birth", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Enable 2FA on Email First",
      summary: "2FA makes a stolen password worthless to an attacker.",
      points: [
        { title: "Email first", text: "Your email unlocks every account that uses it for recovery. Protect it first." },
        { title: "Authenticator apps over SMS", text: "SMS can be intercepted via SIM swap. Authenticator apps are safer." },
        { title: "2FA takes 2 minutes to set up", text: "Go to your email settings → Security → 2-Step Verification. Do it today." }
      ]
    }
  },

  "oa-3": {
    intro: {
      tagline: "Learn why sharing a password — with anyone — is always a security risk.",
      objectives: [
        "Understand why sharing passwords creates uncontrolled risk",
        "Recognize requests for passwords as scam signals",
        "Know what legitimate IT support actually needs",
        "Apply the no-share rule consistently"
      ]
    },
    understand: {
      title: "Never Share Passwords",
      concept: "No legitimate service, employer, or government agency ever needs your password. If they ask, it's a scam.",
      points: [
        {
          title: "Why sharing is always risky",
          text: "Once shared, you lose all control. You don't know whether the person's device is secure, who else they may share it with, or what they do with access."
        },
        {
          title: "Legitimate services don't need your password",
          text: "Banks, IT departments, government portals — they all have their own backend systems. They don't need your password to fix issues."
        },
        {
          title: "Common scam requests",
          text: "'Share your NetBanking password to verify your account.' 'Give me your Gmail password to fix the technical issue.' Both are always fraud — no exceptions."
        },
        {
          title: "Password sharing in relationships",
          text: "Sharing account passwords in relationships is a common financial abuse vector. Your accounts should remain private regardless of personal trust."
        }
      ]
    },
    seeIt: {
      example: "Phone Call:\n'Hi, this is Microsoft Tech Support. We detected a virus on your computer. I need your Windows login password to run the fix remotely.'\n\nOR\n\n'Hi, this is SBI Bank's fraud team. We need your NetBanking password to verify your account isn't compromised.'",
      sender: "Tech Support Scam Call",
      redFlags: [
        { text: "I need your Windows login password to run the fix remotely", reason: "Microsoft never calls users and never needs your password. Remote access tools don't require it." },
        { text: "We need your NetBanking password to verify your account", reason: "Banks have backend access. They never need your password." }
      ]
    },
    tryItYourself: {
      example: "WhatsApp from partner:\n'If you really trust me, share your Instagram password first, then your email, and then your bank app password. We should have no secrets.'",
      sender: "Relationship Pressure",
      redFlags: [
        { text: "If you really trust me", reason: "Using trust as leverage to demand credentials is emotional manipulation, not a healthy request." },
        { text: "then your bank app password", reason: "The escalation from social to financial accounts is a red flag pattern." }
      ]
    },
    realWorld: {
      scenario: "Your workplace IT support calls and asks for your email password to 'fix a sync issue'. What do you do?",
      options: [
        { id: "a", text: "Share it — IT needs it for their job", correct: false, feedback: "Legitimate IT professionals use admin tools that don't require your personal password. This is likely a social engineering attack." },
        { id: "b", text: "Refuse and report the call to your actual IT department", correct: true, feedback: "Correct. Report this as a potential social engineering attempt. Real IT never needs your credentials." },
        { id: "c", text: "Give them a slightly wrong password to test if they're real", correct: false, feedback: "If they test it and know it's wrong, you've engaged with a scammer. Simply refuse and report." }
      ]
    },
    quiz: [
      {
        question: "When should you share your password?",
        explanation: "Legitimate companies — including your own bank, employer IT, or government agencies — never need your password. They have administrative systems that don't require it.",
        options: [
          { id: "1", text: "With family members you completely trust", correct: false },
          { id: "2", text: "With IT support when they're helping fix something", correct: false },
          { id: "3", text: "Never — your password is only for you to use", correct: true }
        ]
      }
    ],
    takeaway: {
      title: "Your Password Is Yours Alone",
      summary: "The moment anyone asks for your password, treat it as a potential scam — regardless of who they claim to be.",
      points: [
        { title: "No legitimate service needs it", text: "Banks, IT, government — none of them require your password for any legitimate action." },
        { title: "Sharing removes your control", text: "Once shared, you can never take it back or control who else uses it." },
        { title: "Refuse and report", text: "If an IT call, bank call, or even a partner asks for your password, refuse and report." }
      ]
    }
  },

  "oa-4": {
    intro: {
      tagline: "Recognize fake account recovery agents before they take control of your accounts.",
      objectives: [
        "Know how account recovery scams work",
        "Understand what recovery codes actually do",
        "Know the only legitimate way to recover accounts",
        "Recognize red flags in recovery offers"
      ]
    },
    understand: {
      title: "Account Recovery Scams",
      concept: "Every 'account recovery agent' who asks for a code your platform just sent is stealing your account, not recovering it.",
      points: [
        {
          title: "The scam setup",
          text: "You post publicly that you're locked out of Facebook or Instagram. Scammers posing as 'recovery experts' reply offering help for a fee."
        },
        {
          title: "The critical step they exploit",
          text: "They ask you to share the OTP or 'verification code' the platform just sent to your phone. That code IS your account recovery key."
        },
        {
          title: "What happens when you share it",
          text: "They immediately use the code to take over your account. You lose access entirely. They then extort you for more money to 'return' it."
        },
        {
          title: "Real account recovery is self-service",
          text: "Google, Facebook, Instagram, and every major platform have free, self-service recovery flows. There are no human agents you need to pay."
        }
      ]
    },
    seeIt: {
      example: "Comment on your Facebook post about being locked out:\n'@[YourName] I had the same problem! This agent recovered my account in 20 minutes: +91 98XX XXXXXX. Only ₹500.'\n\n[Agent asks: 'Share the 6-digit code Facebook just texted you to verify your identity']",
      sender: "Fake Facebook Recovery Agent",
      redFlags: [
        { text: "Only ₹500", reason: "Facebook recovery is always free through official channels. Any fee means it's a scam." },
        { text: "Share the 6-digit code Facebook just texted you", reason: "That code IS the recovery key. Sharing it gives them instant access to your account." }
      ]
    },
    tryItYourself: {
      example: "Google search: 'recover hacked Gmail account'\n\nSponsored ad: 'Google Gmail Recovery — Recover any account in 24 hours! Call +91 7XX XXXXXXX'\n\nThey ask for: Your Gmail ID + the verification code Google sent to your recovery phone.",
      sender: "Fake Google Recovery Service Ad",
      redFlags: [
        { text: "Google Gmail Recovery — Call this number", reason: "Google's recovery is entirely self-service at accounts.google.com. There are no paid phone agents." },
        { text: "the verification code Google sent to your recovery phone", reason: "This code grants full account access. Sharing it = you hand over your account." }
      ]
    },
    realWorld: {
      scenario: "You're locked out of Instagram. Someone comments on your post offering to recover it for ₹800 and asks for the code Instagram sent to your phone. What do you do?",
      options: [
        { id: "a", text: "Share the code — ₹800 is worth getting my account back", correct: false, feedback: "Sharing the code gives them access to your account. They'll take it, not recover it for you." },
        { id: "b", text: "Use Instagram's official 'Get more help' at help.instagram.com instead", correct: true, feedback: "Correct. Every major platform has a free, official recovery process. Use only that." },
        { id: "c", text: "Ask the person to prove they're a real recovery agent", correct: false, feedback: "Scammers have fake credentials ready. Simply don't engage — use official help centers." }
      ]
    },
    quiz: [
      {
        question: "When a 'recovery agent' asks for the code your social media platform just sent, that code is:",
        explanation: "The code sent by a platform for 'verification' or 'recovery' IS the key to your account. Sharing it immediately transfers account control to whoever receives it.",
        options: [
          { id: "1", text: "A verification code proving your identity to the agent", correct: false },
          { id: "2", text: "Your account recovery key — sharing it gives them full access", correct: true },
          { id: "3", text: "Safe to share because it expires quickly", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Official Help Centers Only",
      summary: "No legitimate platform requires a human agent or a fee for account recovery.",
      points: [
        { title: "Self-service is the right way", text: "Google, Facebook, Instagram — all have free official recovery at their own help centers." },
        { title: "Any code = access key", text: "Whatever code the platform sends during recovery — sharing it means losing your account." },
        { title: "Paid recovery = scam", text: "If someone wants money to recover your account, they are the thief." }
      ]
    }
  },

  // ── MODERN SCAMS ───────────────────────────────────────────────────────────

  "ms-1": {
    intro: {
      tagline: "Recognize investment scams before you invest a single rupee.",
      objectives: [
        "Know why guaranteed high returns are impossible",
        "Understand how Ponzi schemes use real payouts to build trust",
        "Verify investments through SEBI before committing",
        "Recognize common investment scam red flags"
      ]
    },
    understand: {
      title: "Investment Scams",
      concept: "Real investments always carry risk. Any investment promising guaranteed high returns is fraud — no exceptions.",
      points: [
        {
          title: "Why guaranteed returns don't exist",
          text: "The best legitimate investment funds average 12–18% annually over many years. Weekly returns of 30% or monthly returns of 50% are mathematically impossible."
        },
        {
          title: "How Ponzi schemes work",
          text: "Early investors receive real payouts — funded by new investor money. This builds trust. Eventually the scheme collapses when new money stops flowing in."
        },
        {
          title: "The recruitment trap",
          text: "Victims are recruited by friends or family who are already making money. This social proof makes it feel safe — but your friend is also a victim."
        },
        {
          title: "The SEBI check",
          text: "In India, all investment products must be registered with SEBI. Check sebi.gov.in before investing in anything. If it's not listed, don't invest."
        }
      ]
    },
    seeIt: {
      example: "Telegram Channel: 'ShieldCrypto VIP Investment'\n\nAdmin: 'Invest ₹10,000. Get ₹3,000 weekly returns guaranteed. Over 500 verified investors. This week: 32% profit. Slots filling up!'\n\n[Multiple screenshots of supposed withdrawals]",
      sender: "Fake Investment Channel",
      redFlags: [
        { text: "₹3,000 weekly returns guaranteed", reason: "30% weekly returns are mathematically impossible in any legitimate investment." },
        { text: "Multiple screenshots of supposed withdrawals", reason: "Screenshots from a Telegram group can all be fabricated or from accounts controlled by the scammer." },
        { text: "Slots filling up!", reason: "Fake scarcity to force fast investment decisions before you research." }
      ]
    },
    tryItYourself: {
      example: "WhatsApp forward:\n'GOVT APPROVED! Invest in National Prosperity Fund. Min ₹5,000. 200% returns in 6 months. Limited slots. Call: +91 7XX-XXXXXXX. Supporting PM's Digital India mission.'",
      sender: "Investment Scam Forward",
      redFlags: [
        { text: "GOVT APPROVED!", reason: "The government does not approve private investment schemes distributed via WhatsApp." },
        { text: "200% returns in 6 months", reason: "200% in 6 months means quadrupling your money — mathematically impossible legitimately." },
        { text: "Call: +91 7XX-XXXXXXX", reason: "Real government schemes are announced on official portals — not WhatsApp forwards with phone numbers." }
      ]
    },
    realWorld: {
      scenario: "A friend invites you to an investment group promising ₹50,000 returns on ₹10,000 in 2 months. She says she already received her first payout. What do you do?",
      options: [
        { id: "a", text: "Join since my friend got a real payout", correct: false, feedback: "Early payouts are how Ponzi schemes build trust. Your friend is also a victim who will eventually lose money." },
        { id: "b", text: "Decline and gently warn your friend about Ponzi scheme patterns", correct: true, feedback: "Correct. 500% returns in 2 months is impossible. Help your friend understand the danger before she invests more." },
        { id: "c", text: "Invest a small amount first to test it", correct: false, feedback: "Early investors often DO receive returns in Ponzi schemes — designed specifically to pull you in deeper before the collapse." }
      ]
    },
    quiz: [
      {
        question: "Which is the clearest sign of an investment scam?",
        explanation: "Guaranteed returns are mathematically impossible in legitimate investing. All real investments carry risk. 'Guaranteed' is always a lie.",
        options: [
          { id: "1", text: "The investment involves cryptocurrency", correct: false },
          { id: "2", text: "The investment promises guaranteed unusually high returns", correct: true },
          { id: "3", text: "The investment scheme operates online", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Guaranteed = Fraud",
      summary: "Check SEBI. If it's not registered, don't invest.",
      points: [
        { title: "No guarantees exist in real investing", text: "Returns are always uncertain. Anyone guaranteeing them is lying." },
        { title: "Check SEBI registration", text: "Verify any investment product at sebi.gov.in before committing money." },
        { title: "Early payouts = bait", text: "Ponzi schemes use real early payouts to build trust before the collapse." }
      ]
    }
  },

  "ms-2": {
    intro: {
      tagline: "Learn why seeing or hearing someone is no longer enough to trust a message.",
      objectives: [
        "Understand what deepfakes are",
        "Know how voice cloning works",
        "Recognize deepfake scam patterns",
        "Know the only reliable verification method"
      ]
    },
    understand: {
      title: "Deepfake Awareness",
      concept: "AI can convincingly replicate anyone's face and voice from just seconds of existing media — seeing or hearing is no longer proof.",
      points: [
        {
          title: "What deepfakes are",
          text: "Deepfakes use AI to create realistic video or audio of a real person saying or doing things they never said or did."
        },
        {
          title: "Voice cloning is the bigger threat",
          text: "From just 10–30 seconds of audio (a voicemail, a video), AI can clone anyone's voice. A fake 'emergency call' from a family member's voice is now technically feasible."
        },
        {
          title: "The scam pattern",
          text: "Scammer sends a voice message or video call using a family member's or CEO's cloned voice asking for urgent money. Always combined with 'don't call me back right now'."
        },
        {
          title: "The only reliable verification",
          text: "Call the person's real saved number directly yourself. Thirty seconds on a live call with their actual number confirms or denies everything."
        }
      ]
    },
    seeIt: {
      example: "WhatsApp voice message from 'Dad':\n[Sounds exactly like your father's voice]\n'Beta, in trouble at office. My phone broke. Using colleague's. Need ₹20,000 right now — send to this account. Don't call me, I'm in a meeting. Transfer immediately.'\n\n[Voice sounds 99% like your father]",
      sender: "AI Voice Clone",
      redFlags: [
        { text: "Don't call me, I'm in a meeting", reason: "Blocking verification is the essential scam element. A real father in trouble would want you to call." },
        { text: "Using colleague's phone", reason: "Explains why the number is different — but deepfake voice calls can also come from spoofed familiar numbers." },
        { text: "Transfer immediately", reason: "Extreme urgency combined with blocking contact = deepfake scam signature." }
      ]
    },
    tryItYourself: {
      example: "Video call from an unknown number:\n[Screen shows your company CEO's face and voice]\n'I need ₹5 lakhs transferred to this vendor today — confidential acquisition. Don't involve finance. Confirm when done.'\n\n[Face and voice match the CEO's videos perfectly]",
      sender: "Business Deepfake Scam",
      redFlags: [
        { text: "Don't involve finance", reason: "Bypassing established financial procedures is a red flag, even from a senior leader." },
        { text: "confidential acquisition", reason: "Urgency + secrecy is the standard business deepfake fraud pattern." }
      ]
    },
    realWorld: {
      scenario: "You receive a voice message that sounds exactly like your mother saying she's had an accident and needs ₹30,000 right now. What do you do?",
      options: [
        { id: "a", text: "Transfer immediately — that's my mother's voice", correct: false, feedback: "AI voice cloning can replicate any voice from seconds of audio. The voice alone is no longer sufficient proof." },
        { id: "b", text: "Hang up, call her real saved number directly, and only act after speaking to her live", correct: true, feedback: "Correct. A live call on her real number is the only verification that cannot be faked by AI." },
        { id: "c", text: "Ask the voice a secret question only she would know", correct: false, feedback: "Better than nothing, but scammers may have researched you. Calling her real number is more reliable." }
      ]
    },
    quiz: [
      {
        question: "Why can't you fully trust a voice message even if it sounds exactly like someone you know?",
        explanation: "AI voice cloning technology can recreate any person's voice from a small sample of audio. A voicemail that sounds perfect may be artificially generated.",
        options: [
          { id: "1", text: "Voice messages always have poor audio quality", correct: false },
          { id: "2", text: "AI can clone any voice from just seconds of sample audio", correct: true },
          { id: "3", text: "Family members often play phone pranks", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Call Their Real Number. Always.",
      summary: "In the age of voice cloning, the only verification that cannot be faked is a live call on a known number.",
      points: [
        { title: "Voice ≠ identity", text: "AI clones voices. A familiar voice in a WhatsApp message is not enough proof." },
        { title: "Call their real saved number", text: "Before sending money to anyone, call their real number yourself — even if the original message sounded real." },
        { title: "Establish a family codeword", text: "Agree on a private word with family. If they can't say it, the contact may be fake." }
      ]
    }
  },

  "ms-3": {
    intro: {
      tagline: "Understand why perfect grammar no longer makes a message safe.",
      objectives: [
        "Know how AI has changed phishing quality",
        "Understand which checks still work in the AI era",
        "Recognize AI-crafted personalized scam messages",
        "Apply the correct detection methods for today"
      ]
    },
    understand: {
      title: "AI-Generated Scams",
      concept: "AI tools now write flawless scam messages in any language — grammar errors can no longer be your primary safety filter.",
      points: [
        {
          title: "The old detection method is broken",
          text: "For years, bad grammar and spelling helped identify phishing. AI writing tools eliminate this. Today's phishing emails can be indistinguishable from real corporate communications."
        },
        {
          title: "AI enables personalization",
          text: "AI tools can scrape your LinkedIn, Facebook, and public data to craft highly personal messages: your real name, job title, company, and recent activities."
        },
        {
          title: "What still works",
          text: "Domain verification, avoiding unexpected links, and checking directly in the official app remain reliable. AI cannot change the actual domain without losing credibility."
        },
        {
          title: "Stay skeptical of unexpected contact",
          text: "If an email or message is unexpected — even if perfectly written and apparently from a trusted source — verify it through official channels before acting."
        }
      ]
    },
    seeIt: {
      example: "From: security@axis-bankv2.com\nSubject: Important Notice Regarding Your Account\n\nDear Mr. Rajesh Kumar,\n\nWe identified a potential unauthorized access on your savings account ending in 4521. For your protection, some transactions are temporarily restricted.\n\nVerify your identity within 24 hours to restore full access:\n[Restore Access →]\n\nWarm regards,\nAxis Bank Digital Security Team",
      sender: "AI-Crafted Phishing Email",
      redFlags: [
        { text: "axis-bankv2.com", reason: "Axis Bank's real domain is axisbank.com. The '-v2' variation is a fake domain. Grammar is perfect but the domain gives it away." }
      ]
    },
    tryItYourself: {
      example: "WhatsApp message:\n'Hi Priya! It's been a while. Given your finance background, I thought you'd love this — a new platform backed by ex-Goldman Sachs executives. Projected 18% monthly returns. Want the onboarding details?'",
      sender: "AI-Personalized Scam Message",
      redFlags: [
        { text: "18% monthly returns", reason: "18% monthly = 216% annually. Mathematically impossible in any legitimate financial product." },
        { text: "ex-Goldman Sachs executives", reason: "Name-dropping reputable institutions adds false credibility — a favourite AI scam technique." }
      ]
    },
    realWorld: {
      scenario: "You receive a perfectly written, professional email from your 'bank' about a suspicious login. No grammar errors at all. What's your primary check?",
      options: [
        { id: "a", text: "Trust it since the writing quality confirms it's legitimate", correct: false, feedback: "AI writes flawless phishing emails. Writing quality is no longer a reliable indicator." },
        { id: "b", text: "Check the sender's email domain and verify directly in the banking app", correct: true, feedback: "Correct. Domain verification and the official app are the only reliable checks in the AI era." },
        { id: "c", text: "Reply to ask if the email is genuine", correct: false, feedback: "Replying to a phishing email confirms your address is active. Use the official app to verify instead." }
      ]
    },
    quiz: [
      {
        question: "In the AI era, which detection method remains consistently reliable for phishing?",
        explanation: "AI can write perfect messages in any style, but it cannot change the sender's email domain or URL without detection. Domain verification remains the most reliable check.",
        options: [
          { id: "1", text: "Checking for grammar and spelling mistakes", correct: false },
          { id: "2", text: "Verifying the sender domain and checking your account in the official app", correct: true },
          { id: "3", text: "Checking whether the message has a professional tone", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "AI Changed the Rules",
      summary: "Perfect grammar is no longer a safety signal — verify the domain and check the official app.",
      points: [
        { title: "Grammar is no longer a filter", text: "AI creates perfect phishing messages. Stop relying on writing quality." },
        { title: "Domain verification still works", text: "AI cannot change the actual sending domain without it being detectable." },
        { title: "Always verify in the official app", text: "For any account-related message, open the official app and check directly there." }
      ]
    }
  },

  "ms-4": {
    intro: {
      tagline: "Spot fake giveaways, clone accounts, and social media fraud before it costs you.",
      objectives: [
        "Recognize fake celebrity giveaways",
        "Identify cloned social media accounts",
        "Know what real giveaways look like",
        "Apply the one rule that stops all social media scams"
      ]
    },
    understand: {
      title: "Social Media Scams",
      concept: "If a giveaway requires any payment to claim a prize, it is a scam — no exceptions, regardless of who it appears to come from.",
      points: [
        {
          title: "Fake celebrity giveaways",
          text: "Scammers create near-identical clone accounts of celebrities. They post giveaway announcements asking followers to 'send ₹200 to claim ₹5,000'. The money disappears."
        },
        {
          title: "Clone account red flags",
          text: "Clone accounts have: very recent creation date, slightly different username (extra underscore or number), no verified blue checkmark on the actual platform."
        },
        {
          title: "The comment section trick",
          text: "The comments section of scam giveaways is filled with fake accounts all saying 'I received mine!' This social proof is completely manufactured."
        },
        {
          title: "Romance scams",
          text: "Long-term fake relationship built over weeks or months on social media, then money requested for an 'emergency'. The emotional investment makes victims vulnerable."
        }
      ]
    },
    seeIt: {
      example: "Instagram post from @Virat.Kohli.Official_:\n'Celebrating 100M followers! Sending ₹5,000 to 1,000 lucky followers! Send ₹299 processing fee to @CashGifts2024. First 1,000 only! ❤️'\n\n[50,000 likes, thousands of comments: 'I got mine!']",
      sender: "Fake Celebrity Giveaway",
      redFlags: [
        { text: "@Virat.Kohli.Official_", reason: "The real Virat Kohli has a verified blue checkmark. Underscores and dots in usernames are clone account signals." },
        { text: "Send ₹299 processing fee", reason: "You never pay to receive a prize. This fee IS the entire scam." },
        { text: "thousands of comments: 'I got mine!'", reason: "Comments in giveaway scams are from bot accounts or the scammer's own accounts." }
      ]
    },
    tryItYourself: {
      example: "Facebook friend request from 'Deepika Padukone Official (Backup)':\n\n'Hi! My main account got hacked. Adding from backup. Giving away ₹1,000 to fans during this time. Share your UPI ID and I'll transfer right away.'\n\n[23 mutual friends, identical profile photo]",
      sender: "Cloned Celebrity Account",
      redFlags: [
        { text: "My main account got hacked. This is my backup.", reason: "The 'hacked main account' story is the standard explanation for why this isn't the verified profile." },
        { text: "23 mutual friends", reason: "Clone accounts mass-add people to appear legitimate. Mutual friends don't confirm authenticity." }
      ]
    },
    realWorld: {
      scenario: "An Instagram account with 10,000 followers claiming to be Amitabh Bachchan offers you ₹10,000 if you pay ₹200 GST for the transfer. Do you participate?",
      options: [
        { id: "a", text: "Yes — 10,000 followers means it's probably real", correct: false, feedback: "Followers can be bought cheaply. The real Amitabh Bachchan has 30M+ followers with a verified blue checkmark." },
        { id: "b", text: "No — real giveaways never require payment to claim the prize", correct: true, feedback: "Correct. Paying to receive a prize is always and entirely a scam." },
        { id: "c", text: "Only if they have a blue checkmark in the screenshot they send", correct: false, feedback: "Blue checkmarks are trivially easy to add to screenshots. Verify on the actual platform." }
      ]
    },
    quiz: [
      {
        question: "A celebrity giveaway asks you to send ₹500 to 'receive ₹10,000'. You should:",
        explanation: "Paying to receive a prize is the defining characteristic of this scam. Legitimate giveaways are funded by the organizer — no payment from you is ever required.",
        options: [
          { id: "1", text: "Send ₹500 — the ₹10,000 is worth the risk", correct: false },
          { id: "2", text: "Ignore it — real giveaways never require payment", correct: true },
          { id: "3", text: "Ask if others have received their prize first", correct: false }
        ]
      }
    ],
    takeaway: {
      title: "Pay to Win = Always a Scam",
      summary: "Real prizes never require you to pay anything to claim them.",
      points: [
        { title: "Never pay to receive a prize", text: "This is the universal rule for every giveaway, everywhere. No exceptions." },
        { title: "Verify accounts on the platform itself", text: "Check for the verified blue checkmark in the actual app, not in screenshots." },
        { title: "Clone accounts look very real", text: "Same photo, mutual friends, professional bio — but they'll always ask for money." }
      ]
    }
  }
};

module.exports = ALL_LESSON_STEPS;
