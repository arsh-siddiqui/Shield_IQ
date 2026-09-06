const mongoose = require('mongoose');
const Vulnerability = require('../models/Vulnerability');
const env = require('../config/env');

const vulnerabilitiesData = [
  {
    title: 'SQL Injection',
    slug: 'sql-injection',
    category: 'Injection',
    severity: 'Critical',
    description: 'SQL Injection (SQLi) is a vulnerability where an attacker can interfere with the queries that an application makes to its database. This can allow attackers to view, modify, or delete data they are not normally authorized to access.',
    whyItHappens: 'It occurs when untrusted user input is directly concatenated into a dynamic SQL query without proper sanitization or parameterization.',
    vulnerableExample: 'const query = `SELECT * FROM users WHERE username = \'${req.body.username}\' AND password = \'${req.body.password}\'`;',
    impact: 'Attackers can bypass authentication, access, modify, or delete sensitive data, and in some cases, gain administrative control over the database server.',
    secureFix: 'const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;\nawait db.query(query, [req.body.username, req.body.password]);',
    prevention: [
      'Use Prepared Statements (Parameterized Queries)',
      'Use Stored Procedures',
      'Enforce Least Privilege',
      'Input Validation (Allow-listing)'
    ],
    labId: 'lab-sqli-01',
    prerequisites: ['Basic Database Knowledge', 'Understanding of HTTP Requests'],
    assessment: [
      {
        question: 'What is the primary root cause of SQL Injection?',
        options: [
          { text: 'Using outdated database software', isCorrect: false },
          { text: 'Concatenating untrusted user input directly into SQL queries', isCorrect: true, explanation: 'Direct string concatenation allows user input to change the logical structure of the query.' },
          { text: 'Using NoSQL databases', isCorrect: false },
          { text: 'Encrypting the database connection', isCorrect: false }
        ]
      },
      {
        question: 'Which of the following is the most effective defense against SQL Injection?',
        options: [
          { text: 'Client-side input validation', isCorrect: false },
          { text: 'Prepared statements (Parameterized queries)', isCorrect: true, explanation: 'Prepared statements ensure the database treats input as data, not as executable code.' },
          { text: 'Web Application Firewall (WAF)', isCorrect: false },
          { text: 'Encoding HTML output', isCorrect: false }
        ]
      },
      {
        question: 'In the vulnerable query `SELECT * FROM users WHERE username = \'admin\' --\' AND password = \'\'`, what does `--` do?',
        options: [
          { text: 'It deletes the table.', isCorrect: false },
          { text: 'It comments out the rest of the query, bypassing the password check.', isCorrect: true, explanation: 'The `--` sequence in SQL denotes the start of a comment, neutralizing trailing conditions.' },
          { text: 'It encrypts the password.', isCorrect: false },
          { text: 'It creates a new user.', isCorrect: false }
        ]
      }
    ]
  },
  {
    title: 'Cross-Site Scripting (XSS)',
    slug: 'cross-site-scripting',
    category: 'Injection',
    severity: 'High',
    description: 'Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into web pages viewed by other users. These scripts execute in the victim\'s browser under the context of the vulnerable site.',
    whyItHappens: 'XSS happens when an application includes untrusted data in a web page without proper validation or escaping.',
    vulnerableExample: '<div>Welcome back, <%- user.name %>!</div>',
    impact: 'Attackers can steal session cookies, deface websites, redirect users to malicious sites, or perform actions on behalf of the user.',
    secureFix: '<div>Welcome back, <%= user.name %>!</div> // Using a templating engine that auto-escapes HTML entities.',
    prevention: [
      'Context-Aware Output Encoding',
      'Use Content Security Policy (CSP)',
      'Sanitize HTML Input (e.g., DOMPurify)',
      'Set HttpOnly flag on cookies'
    ],
    labId: 'lab-xss-01',
    prerequisites: ['HTML/JavaScript Basics'],
    assessment: [
      {
        question: 'What is the primary goal of an XSS attack?',
        options: [
          { text: 'To crash the backend server', isCorrect: false },
          { text: 'To execute malicious JavaScript in a victim\'s browser', isCorrect: true, explanation: 'XSS targets the client side, running scripts in the victim\'s browser.' },
          { text: 'To inject SQL commands into the database', isCorrect: false },
          { text: 'To intercept network traffic', isCorrect: false }
        ]
      },
      {
        question: 'Which mitigation technique restricts where scripts can be loaded from?',
        options: [
          { text: 'Content Security Policy (CSP)', isCorrect: true, explanation: 'CSP defines which dynamic resources are allowed to load and execute.' },
          { text: 'Parameterized Queries', isCorrect: false },
          { text: 'CORS Configuration', isCorrect: false },
          { text: 'CSRF Tokens', isCorrect: false }
        ]
      },
      {
        question: 'Which flag protects session cookies from being accessed via JavaScript `document.cookie`?',
        options: [
          { text: 'Secure', isCorrect: false },
          { text: 'SameSite', isCorrect: false },
          { text: 'HttpOnly', isCorrect: true, explanation: 'The HttpOnly flag prevents client-side scripts from accessing the cookie.' },
          { text: 'Domain', isCorrect: false }
        ]
      }
    ]
  },
  {
    title: 'Cross-Site Request Forgery (CSRF)',
    slug: 'csrf',
    category: 'Broken Access Control',
    severity: 'High',
    description: 'CSRF forces a logged-in victim\'s browser to send a forged HTTP request, including the victim\'s session cookie, to a vulnerable web application.',
    whyItHappens: 'It occurs when web applications rely solely on ambient credentials (like cookies) to authenticate requests and do not verify the intentionality of state-changing requests.',
    vulnerableExample: '<form action="https://bank.com/transfer" method="POST">\n  <input type="hidden" name="to" value="attacker_account">\n  <input type="hidden" name="amount" value="1000">\n</form>\n<script>document.forms[0].submit();</script>',
    impact: 'Attackers can trick users into unintentionally performing state-changing actions, such as transferring funds, changing email addresses, or updating passwords.',
    secureFix: 'Include an unpredictable CSRF token in state-changing requests:\n<input type="hidden" name="csrf_token" value="abc123xyz...">\nAlso use SameSite cookie attributes.',
    prevention: [
      'Implement Anti-CSRF Tokens (Synchronizer Token Pattern)',
      'Use SameSite Cookie Attribute (Strict or Lax)',
      'Require Re-authentication for sensitive actions',
      'Verify Origin with standard headers'
    ],
    labId: 'lab-csrf-01',
    prerequisites: ['Understanding of HTTP Methods', 'Cookies and Sessions'],
    assessment: [
      {
        question: 'What is the main requirement for a CSRF attack to succeed?',
        options: [
          { text: 'The attacker must steal the victim\'s password.', isCorrect: false },
          { text: 'The victim must have an active, authenticated session with the target site.', isCorrect: true, explanation: 'CSRF relies on the browser automatically including session cookies with the forged request.' },
          { text: 'The target site must be vulnerable to SQL Injection.', isCorrect: false },
          { text: 'The attacker must have physical access to the victim\'s device.', isCorrect: false }
        ]
      },
      {
        question: 'What is the most common defense against CSRF?',
        options: [
          { text: 'Anti-CSRF Tokens', isCorrect: true, explanation: 'A unique, unpredictable token included in the request proves the request was intentionally generated by the user.' },
          { text: 'Input Sanitization', isCorrect: false },
          { text: 'Output Encoding', isCorrect: false },
          { text: 'Prepared Statements', isCorrect: false }
        ]
      },
      {
        question: 'Which cookie attribute helps prevent CSRF by restricting when cookies are sent with cross-site requests?',
        options: [
          { text: 'HttpOnly', isCorrect: false },
          { text: 'Secure', isCorrect: false },
          { text: 'Max-Age', isCorrect: false },
          { text: 'SameSite', isCorrect: true, explanation: 'SameSite instructs the browser whether to send cookies along with cross-site requests.' }
        ]
      }
    ]
  },
  {
    title: 'File Upload Vulnerability',
    slug: 'file-upload',
    category: 'Security Misconfiguration',
    severity: 'Critical',
    description: 'A file upload vulnerability occurs when a web server allows users to upload files without sufficiently validating their name, type, contents, or size.',
    whyItHappens: 'Applications often rely on easily spoofed client-side checks or simple extension checks instead of deeply analyzing file contents or executing uploaded files in a restricted environment.',
    vulnerableExample: 'app.post("/upload", (req, res) => {\n  const file = req.files.profilePic;\n  file.mv(`/public/uploads/${file.name}`);\n});',
    impact: 'Attackers can upload web shells to execute arbitrary commands, host malware, overwrite critical system files, or exhaust server resources.',
    secureFix: '1. Validate file types strictly (mime type + magic bytes)\n2. Rename uploaded files to a random UUID\n3. Store files outside the web root or on an external bucket',
    prevention: [
      'Store files outside of the web root directory',
      'Rename uploaded files',
      'Validate file types using "magic bytes" (not just extensions)',
      'Limit file sizes',
      'Scan for malware'
    ],
    labId: 'lab-fileupload-01',
    prerequisites: ['Basic Backend Routing'],
    assessment: [
      {
        question: 'Why is relying on the file extension (e.g., .jpg) insufficient for validating an upload?',
        options: [
          { text: 'Because file extensions are too long.', isCorrect: false },
          { text: 'Because an attacker can easily rename a malicious script (e.g., shell.php) to shell.php.jpg.', isCorrect: true, explanation: 'Extensions are user-controlled and do not guarantee the actual file content is safe.' },
          { text: 'Because browsers cannot read file extensions.', isCorrect: false },
          { text: 'Because it slows down the server.', isCorrect: false }
        ]
      },
      {
        question: 'Where is the safest place to store user-uploaded files?',
        options: [
          { text: 'In the same folder as the application source code', isCorrect: false },
          { text: 'Directly inside the public web root (e.g., /public/uploads/)', isCorrect: false },
          { text: 'Outside the web root or on a dedicated cloud storage bucket (e.g., AWS S3)', isCorrect: true, explanation: 'Storing files outside the web root prevents attackers from directly executing uploaded scripts via a URL.' },
          { text: 'Inside the database as raw text', isCorrect: false }
        ]
      },
      {
        question: 'What is a "web shell"?',
        options: [
          { text: 'A tool used by administrators to securely manage a website', isCorrect: false },
          { text: 'A malicious script uploaded by an attacker to execute arbitrary commands on the server', isCorrect: true, explanation: 'A web shell provides a remote interface for an attacker to control the compromised server.' },
          { text: 'A secure wrapper around HTML file inputs', isCorrect: false },
          { text: 'A type of anti-virus software for web servers', isCorrect: false }
        ]
      }
    ]
  },
  {
    title: 'Insecure Direct Object Reference (IDOR)',
    slug: 'idor',
    category: 'Broken Access Control',
    severity: 'High',
    description: 'IDOR occurs when an application provides direct access to objects based on user-supplied input without proper authorization checks.',
    whyItHappens: 'Developers often assume that because a user is logged in, they are only requesting their own data, forgetting to verify ownership before returning the requested resource.',
    vulnerableExample: 'app.get("/api/receipts/:id", async (req, res) => {\n  // Missing ownership check!\n  const receipt = await Receipt.findById(req.params.id);\n  res.json(receipt);\n});',
    impact: 'Attackers can access, modify, or delete data belonging to other users simply by changing the ID in the URL or API payload.',
    secureFix: 'app.get("/api/receipts/:id", async (req, res) => {\n  // Check ownership!\n  const receipt = await Receipt.findOne({ _id: req.params.id, userId: req.user._id });\n  if (!receipt) return res.status(404).send();\n  res.json(receipt);\n});',
    prevention: [
      'Implement strict Access Control checks (Ownership Validation)',
      'Use indirect object references (e.g., per-user session maps)',
      'Use unpredictable IDs (e.g., UUIDs) to prevent enumeration, though access control is still required'
    ],
    labId: 'lab-idor-01',
    prerequisites: ['REST API Basics', 'Authentication vs Authorization'],
    assessment: [
      {
        question: 'What is the root cause of an IDOR vulnerability?',
        options: [
          { text: 'Using predictable, sequential IDs (like 1, 2, 3)', isCorrect: false },
          { text: 'Failing to verify that the authenticated user is authorized to access the requested resource', isCorrect: true, explanation: 'While predictable IDs make IDOR easier to exploit, the root cause is the missing authorization check.' },
          { text: 'Failing to encrypt data at rest', isCorrect: false },
          { text: 'Using outdated session tokens', isCorrect: false }
        ]
      },
      {
        question: 'Which of the following is the BEST way to fix an IDOR vulnerability?',
        options: [
          { text: 'Change sequential IDs (e.g., 5) to UUIDs (e.g., a1b2c3d4...)', isCorrect: false },
          { text: 'Obfuscate or Base64 encode the ID in the URL', isCorrect: false },
          { text: 'Enforce access control checks on the backend to verify the user owns the resource', isCorrect: true, explanation: 'UUIDs are a defense-in-depth measure, but backend authorization checks are the only complete fix.' },
          { text: 'Hide the API endpoint from the frontend code', isCorrect: false }
        ]
      },
      {
        question: 'True or False: If an API endpoint requires a valid JWT token to access, it cannot be vulnerable to IDOR.',
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true, explanation: 'Authentication (JWT) proves WHO you are. IDOR is a failure of Authorization (WHAT you are allowed to access).' }
        ]
      }
    ]
  },
  {
    title: 'Command Injection',
    slug: 'command-injection',
    category: 'Injection',
    severity: 'Critical',
    description: 'OS Command Injection is a vulnerability that allows an attacker to execute arbitrary operating system (OS) commands on the server that is running an application.',
    whyItHappens: 'It occurs when an application passes unsafe user supplied data (forms, cookies, HTTP headers) to a system shell.',
    vulnerableExample: 'const { exec } = require("child_process");\napp.get("/ping", (req, res) => {\n  exec(`ping -c 4 ${req.query.ip}`, (error, stdout) => res.send(stdout));\n});',
    impact: 'Full system compromise. Attackers can read sensitive files, modify the system, pivot to the internal network, or install backdoors.',
    secureFix: 'Use language-specific APIs instead of OS commands, or strictly validate input:\nconst { execFile } = require("child_process");\nexecFile("ping", ["-c", "4", req.query.ip], (error, stdout) => res.send(stdout));',
    prevention: [
      'Avoid calling OS commands directly',
      'Use built-in language APIs (e.g., fs.readFile instead of cat)',
      'Use safer execution functions (execFile instead of exec) that do not spawn a shell',
      'Strictly validate and sanitize input (Allow-listing)'
    ],
    labId: 'lab-cmd-01',
    prerequisites: ['Basic Linux/OS Commands'],
    assessment: [
      {
        question: 'In the command `ping -c 4 8.8.8.8; ls -la`, what does the `;` character do?',
        options: [
          { text: 'It comments out the rest of the line', isCorrect: false },
          { text: 'It terminates the first command and executes the second command', isCorrect: true, explanation: 'The semicolon is a shell metacharacter used to chain commands together.' },
          { text: 'It connects to a database', isCorrect: false },
          { text: 'It escapes the IP address', isCorrect: false }
        ]
      },
      {
        question: 'Which Node.js function is inherently more dangerous because it spawns a full shell?',
        options: [
          { text: 'execFile()', isCorrect: false },
          { text: 'spawn()', isCorrect: false },
          { text: 'exec()', isCorrect: true, explanation: 'exec() spawns a shell to run the command, which evaluates shell metacharacters like ; and &&.' },
          { text: 'readFile()', isCorrect: false }
        ]
      },
      {
        question: 'What is the best way to prevent Command Injection?',
        options: [
          { text: 'Filter out the `;` character from user input', isCorrect: false },
          { text: 'Avoid calling OS commands entirely and use language-specific APIs', isCorrect: true, explanation: 'Using native APIs eliminates the need to interact with a system shell, removing the injection vector completely.' },
          { text: 'Run the web server as the root user', isCorrect: false },
          { text: 'Encrypt the command payload', isCorrect: false }
        ]
      }
    ]
  },
  {
    title: 'Directory Traversal',
    slug: 'directory-traversal',
    category: 'Broken Access Control',
    severity: 'High',
    description: 'Directory Traversal (or Path Traversal) allows an attacker to read arbitrary files on the server that is running an application.',
    whyItHappens: 'It happens when user input is used to construct a file path, and the application fails to validate that the resulting path is within the intended directory.',
    vulnerableExample: 'app.get("/images", (req, res) => {\n  const file = req.query.filename;\n  res.sendFile(__dirname + "/public/images/" + file);\n});\n// Attacker requests: ?filename=../../../../etc/passwd',
    impact: 'Attackers can read sensitive files like application source code, configuration files, credentials, and system files (e.g., /etc/passwd).',
    secureFix: 'const path = require("path");\nconst safeDir = path.resolve(__dirname, "public/images");\nconst requestedPath = path.resolve(safeDir, req.query.filename);\nif (!requestedPath.startsWith(safeDir)) throw new Error("Invalid path");\nres.sendFile(requestedPath);',
    prevention: [
      'Avoid passing user input directly to filesystem APIs',
      'Validate input against an allow-list of permitted files',
      'Normalize the path and verify it starts with the intended base directory',
      'Run the application with least privilege'
    ],
    labId: 'lab-dt-01',
    prerequisites: ['File System Navigation'],
    assessment: [
      {
        question: 'What is the typical sequence used in a Directory Traversal attack?',
        options: [
          { text: '||', isCorrect: false },
          { text: 'DROP TABLE', isCorrect: false },
          { text: '../', isCorrect: true, explanation: 'The ../ sequence (dot-dot-slash) instructs the filesystem to step up one directory level.' },
          { text: '<script>', isCorrect: false }
        ]
      },
      {
        question: 'Which of the following files is a common target for Directory Traversal attacks on Linux systems?',
        options: [
          { text: '/etc/passwd', isCorrect: true, explanation: '/etc/passwd is a standard file on Unix/Linux systems that lists user accounts and is a classic target to confirm traversal vulnerabilities.' },
          { text: 'C:\\Windows\\System32\\cmd.exe', isCorrect: false },
          { text: 'index.html', isCorrect: false },
          { text: 'robots.txt', isCorrect: false }
        ]
      },
      {
        question: 'How can you securely serve files based on user input?',
        options: [
          { text: 'Remove all slashes from the user input', isCorrect: false },
          { text: 'Normalize the path and verify it remains inside the intended base directory', isCorrect: true, explanation: 'Path normalization resolves relative segments (like ../), allowing you to safely verify the final absolute path.' },
          { text: 'Check if the file has a .txt extension', isCorrect: false },
          { text: 'Only allow logged-in users to request files', isCorrect: false }
        ]
      }
    ]
  },
  {
    title: 'Weak Authentication',
    slug: 'weak-authentication',
    category: 'Identification and Authentication Failures',
    severity: 'High',
    description: 'Weak Authentication refers to flaws in how a system verifies user identity, making it easy for attackers to compromise accounts.',
    whyItHappens: 'Common causes include allowing weak passwords, failing to enforce rate limiting against brute-force attacks, exposing session IDs in URLs, or implementing custom, flawed authentication logic.',
    vulnerableExample: 'app.post("/login", async (req, res) => {\n  // Vulnerable: Passwords stored as plaintext, no rate limiting!\n  const user = await User.findOne({ username: req.body.username, password: req.body.password });\n});',
    impact: 'Attackers can take over user accounts, leading to data theft, fraud, and unauthorized actions.',
    secureFix: 'Use strong cryptographic hashing (e.g., bcrypt, Argon2) for passwords, implement rate limiting, and enforce Multi-Factor Authentication (MFA).',
    prevention: [
      'Hash passwords using strong, salted algorithms (bcrypt, Argon2)',
      'Implement Rate Limiting / Account Lockouts to prevent brute force',
      'Require strong, complex passwords',
      'Implement Multi-Factor Authentication (MFA)',
      'Do not expose session tokens in URLs'
    ],
    labId: 'lab-auth-01',
    prerequisites: ['Authentication Basics', 'Hashing Concepts'],
    assessment: [
      {
        question: 'Why should passwords never be stored in plain text?',
        options: [
          { text: 'It takes up too much database space.', isCorrect: false },
          { text: 'If the database is compromised, attackers immediately gain access to all user accounts.', isCorrect: true, explanation: 'Plain text passwords offer no protection if the storage medium is breached.' },
          { text: 'It slows down the login process.', isCorrect: false },
          { text: 'Databases cannot index plain text fields.', isCorrect: false }
        ]
      },
      {
        question: 'Which of the following is the correct way to store a password?',
        options: [
          { text: 'Base64 encoding', isCorrect: false },
          { text: 'MD5 hashing', isCorrect: false },
          { text: 'Symmetric encryption (e.g., AES)', isCorrect: false },
          { text: 'Salted cryptographic hashing (e.g., bcrypt)', isCorrect: true, explanation: 'Bcrypt is designed specifically for password hashing. It includes a salt and is computationally slow to resist brute-forcing.' }
        ]
      },
      {
        question: 'What mechanism helps prevent brute-force or credential stuffing attacks?',
        options: [
          { text: 'Rate Limiting / Account Lockout', isCorrect: true, explanation: 'Rate limiting restricts how many failed login attempts can be made in a given time frame, stalling brute-force attacks.' },
          { text: 'Cross-Origin Resource Sharing (CORS)', isCorrect: false },
          { text: 'Content Security Policy (CSP)', isCorrect: false },
          { text: 'SQL Parameterization', isCorrect: false }
        ]
      }
    ]
  },
  {
    title: 'Insecure Cookie Handling',
    slug: 'insecure-cookie-handling',
    category: 'Security Misconfiguration',
    severity: 'Medium',
    description: 'Insecure cookie handling occurs when sensitive cookies (like session tokens) are issued without the proper security attributes, exposing them to theft or manipulation.',
    whyItHappens: 'Developers often forget to configure cookie flags in production, leaving them vulnerable to interception over unencrypted connections or theft via XSS.',
    vulnerableExample: 'res.cookie("session_id", userSessionToken); // Missing Secure, HttpOnly, and SameSite flags!',
    impact: 'Attackers can steal session tokens (Session Hijacking) via network sniffing or XSS, or execute CSRF attacks.',
    secureFix: 'res.cookie("session_id", userSessionToken, { httpOnly: true, secure: true, sameSite: "strict" });',
    prevention: [
      'Set the HttpOnly flag to prevent JavaScript access',
      'Set the Secure flag to ensure the cookie is only sent over HTTPS',
      'Set the SameSite attribute to prevent CSRF',
      'Use appropriately short expiration times'
    ],
    labId: 'lab-cookie-01',
    prerequisites: ['HTTP Protocol', 'Browser Cookies'],
    assessment: [
      {
        question: 'Which cookie flag ensures that a cookie is only transmitted over an encrypted (HTTPS) connection?',
        options: [
          { text: 'HttpOnly', isCorrect: false },
          { text: 'Secure', isCorrect: true, explanation: 'The Secure flag tells the browser never to send the cookie over an unencrypted HTTP connection.' },
          { text: 'SameSite', isCorrect: false },
          { text: 'Max-Age', isCorrect: false }
        ]
      },
      {
        question: 'What attack is the `HttpOnly` flag designed to mitigate?',
        options: [
          { text: 'SQL Injection', isCorrect: false },
          { text: 'Cross-Site Request Forgery (CSRF)', isCorrect: false },
          { text: 'Cross-Site Scripting (XSS)', isCorrect: true, explanation: 'HttpOnly prevents client-side JavaScript (which XSS relies on) from reading the cookie.' },
          { text: 'Directory Traversal', isCorrect: false }
        ]
      },
      {
        question: 'What attack is the `SameSite=Strict` attribute primarily designed to prevent?',
        options: [
          { text: 'Cross-Site Request Forgery (CSRF)', isCorrect: true, explanation: 'SameSite prevents the browser from sending the cookie with cross-site requests, effectively blocking CSRF.' },
          { text: 'Command Injection', isCorrect: false },
          { text: 'Network Sniffing', isCorrect: false },
          { text: 'Clickjacking', isCorrect: false }
        ]
      }
    ]
  }
];

async function seedVulnerabilities() {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("[Seed] Connected to MongoDB.");

    let count = 0;
    for (const vuln of vulnerabilitiesData) {
      const result = await Vulnerability.findOneAndUpdate(
        { slug: vuln.slug },
        vuln,
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`[Seed] Successfully seeded ${count} vulnerabilities.`);
    process.exit(0);
  } catch (err) {
    console.error("[Seed] Error:", err);
    process.exit(1);
  }
}

seedVulnerabilities();
