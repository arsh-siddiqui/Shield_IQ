'use strict';

const asyncHandler = require('express-async-handler');
const { parseEmail } = require('../services/forensics/emailParser');
const EmailInvestigation = require('../models/EmailInvestigation');
const Scan = require('../models/Scan');
const { analyzeContent } = require('../services/scanService');
const { enrichInvestigation } = require('../services/intelligence/enrichmentService');
const crypto = require('crypto');

// @route   POST /api/email-forensics/analyze
const analyzeEml = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file uploaded.' }
    });
  }

  // 1. Parse .eml
  let forensicData;
  try {
    forensicData = await parseEmail(req.file.buffer);
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: err.code || 'INVALID_EML', message: err.message }
    });
  }

  // 2. Create the EmailInvestigation record (status: processing)
  const sourceMetadata = {
    originalFilename: req.file.originalname,
    contentType: req.file.mimetype,
    sizeBytes: req.file.size,
    uploadedAt: new Date(),
    inputMethod: 'eml_upload'
  };

  const investigation = new EmailInvestigation({
    user: req.user._id,
    sourceType: 'eml_upload',
    status: 'processing',
    analysisDepth: 'forensic',
    headers: forensicData.headers,
    authentication: forensicData.authentication,
    body: forensicData.body,
    extracted: forensicData.extracted,
    attachments: forensicData.attachments,
    sourceMetadata
  });
  await investigation.save();

  // 3. Build string for existing scanner
  let contentString = '';
  if (forensicData.headers.from) contentString += `From: ${forensicData.headers.from}\n`;
  if (forensicData.headers.to) contentString += `To: ${forensicData.headers.to}\n`;
  if (forensicData.headers.subject) contentString += `Subject: ${forensicData.headers.subject}\n`;
  contentString += `\n${forensicData.body.plainText}`;

  // Enforce length limits for scanner
  const truncatedContent = contentString.trim().slice(0, 5000) || '(empty input)';

  // 4. Run existing scanner pipeline
  let scanResult;
  try {
    scanResult = await analyzeContent(truncatedContent, 'email', req.user._id);
  } catch (err) {
    investigation.status = 'failed';
    investigation.analysisSummary = err.message;
    await investigation.save();
    
    return res.status(500).json({
      success: false,
      error: { code: 'SCANNER_ERROR', message: 'Error analyzing email content.' }
    });
  }

  // 5. Create Scan
  const inputHash = crypto.createHash('sha256').update(truncatedContent).digest('hex');
  const target = 'Uploaded .eml file';
  
  const savedScan = await Scan.create({
    user: req.user._id,
    target,
    fullContent: truncatedContent,
    scanType: 'email',
    inputType: 'email',
    inputHash,
    classification: scanResult.classification || (scanResult.riskLevel === 'safe' ? 'legitimate' : scanResult.riskLevel === 'high' || scanResult.riskLevel === 'critical' ? 'phishing' : 'suspicious'),
    riskLevel: scanResult.riskLevel,
    riskScore: scanResult.riskScore,
    confidence: scanResult.confidence,
    mlResult: scanResult.ml,
    heuristicResult: { category: scanResult.category, detectedSignals: scanResult.detectedSignals },
    threatIntelResult: scanResult.intelligence,
    ragResult: scanResult.rag,
    llmResult: scanResult.groq,
    evidence: scanResult.reasons || [],
    retrievedEmails: scanResult.rag?.retrievedEmails || [],
    recommendations: scanResult.recommendations || [],
    forensicInvestigationId: investigation._id
  });

  // 6. Finalize Investigation
  investigation.status = 'completed';
  investigation.scanId = savedScan._id;
  await investigation.save();

  // 7. Enrich extracted indicators (non-blocking: failure does not break response)
  let enrichmentResult = { enriched: [], geoPoints: [], indicatorIds: [] };
  try {
    enrichmentResult = await enrichInvestigation(investigation);
    // Update investigation with enriched data
    investigation.enrichmentStatus = 'completed';
    investigation.indicators = enrichmentResult.indicatorIds;
    investigation.geoPoints = enrichmentResult.geoPoints;
    await investigation.save();
  } catch (enrichErr) {
    // Enrichment failure is non-fatal — log and mark as partial
    investigation.enrichmentStatus = 'partial';
    try { await investigation.save(); } catch { /* non-fatal */ }
  }

  // 8. Update User Streak
  const { updateStreak } = require('../utils/streakHelper');
  updateStreak(req.user);
  await req.user.save();

  // 9. Return Normalized Response
  return res.status(200).json({
    success: true,
    data: {
      investigationId: investigation._id,
      scanId: savedScan._id,
      sourceType: investigation.sourceType,
      analysisDepth: investigation.analysisDepth,
      headers: investigation.headers,
      authentication: investigation.authentication,
      body: investigation.body,
      extracted: investigation.extracted,
      attachments: investigation.attachments,
      enrichmentStatus: investigation.enrichmentStatus,
      geoPoints: enrichmentResult.geoPoints,
      indicators: enrichmentResult.enriched.map(ind => ({
        type: ind.type,
        value: ind.value,
        normalizedValue: ind.normalizedValue,
        isPublicIP: ind.isPublicIP,
        intelligenceState: ind.intelligenceState,
        geolocation: ind.geolocation || null,
        virusTotal: ind.virusTotal ? {
          status: ind.virusTotal.status,
          threat: ind.virusTotal.threat,
          severity: ind.virusTotal.severity,
          confidence: ind.virusTotal.confidence,
          maliciousVotes: ind.virusTotal.maliciousVotes,
          suspiciousVotes: ind.virusTotal.suspiciousVotes,
          totalEngines: ind.virusTotal.totalEngines,
          summary: ind.virusTotal.summary,
        } : null,
      })),
      forensicEvidence: null,
      personalizationEvidence: scanResult.rag,
      detection: {
        classification: savedScan.classification,
        riskLevel: savedScan.riskLevel,
        riskScore: savedScan.riskScore,
        confidence: savedScan.confidence,
        reasons: scanResult.reasons
      },
      scan: savedScan
    }
  });
});

module.exports = {
  analyzeEml
};
