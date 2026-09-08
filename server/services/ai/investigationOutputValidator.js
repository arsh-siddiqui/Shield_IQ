'use strict';

/**
 * investigationOutputValidator.js
 * Validates the Groq JSON output for the investigation copilot.
 * Ensures the structure is correct, limits string lengths, and purges hallucinated evidence IDs.
 */

function validateCopilotOutput(parsedData, evidenceCatalog) {
  if (!parsedData || typeof parsedData !== 'object') {
    throw new Error('Invalid AI response: not a JSON object');
  }

  const validEvidenceIds = new Set(evidenceCatalog.map(e => e.id));

  // Helper to filter evidence IDs
  const filterEvidence = (ids) => {
    if (!Array.isArray(ids)) return [];
    return ids.filter(id => typeof id === 'string' && validEvidenceIds.has(id)).slice(0, 20);
  };

  // Helper to validate and truncate string
  const validString = (str, maxLen = 1000) => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, maxLen);
  };

  // Helper to validate severity
  const validSeverity = (sev) => {
    const valid = ['info', 'low', 'medium', 'high', 'critical'];
    const lower = typeof sev === 'string' ? sev.toLowerCase() : '';
    return valid.includes(lower) ? lower : 'info';
  };

  // 1. Base fields
  const validated = {
    summary: validString(parsedData.summary, 2000),
    overallAssessment: validString(parsedData.overallAssessment, 2000),
    confidence: typeof parsedData.confidence === 'number' ? Math.max(0, Math.min(100, parsedData.confidence)) : 0,
    uncertainties: Array.isArray(parsedData.uncertainties) 
      ? parsedData.uncertainties.map(u => validString(u, 500)).slice(0, 10) 
      : [],
    keyFindings: [],
    authenticationAssessment: {
      spf: validString(parsedData.authenticationAssessment?.spf, 500),
      dkim: validString(parsedData.authenticationAssessment?.dkim, 500),
      dmarc: validString(parsedData.authenticationAssessment?.dmarc, 500),
      evidenceIds: filterEvidence(parsedData.authenticationAssessment?.evidenceIds)
    },
    infrastructureAssessment: [],
    attachmentAssessment: [],
    recommendedActions: []
  };

  // 2. Key Findings
  if (Array.isArray(parsedData.keyFindings)) {
    validated.keyFindings = parsedData.keyFindings.map(kf => ({
      title: validString(kf.title, 200),
      severity: validSeverity(kf.severity),
      description: validString(kf.description, 1000),
      evidenceIds: filterEvidence(kf.evidenceIds)
    })).slice(0, 10);
  }

  // 3. Infrastructure
  if (Array.isArray(parsedData.infrastructureAssessment)) {
    validated.infrastructureAssessment = parsedData.infrastructureAssessment.map(inf => ({
      indicator: validString(inf.indicator, 200),
      assessment: validString(inf.assessment, 500),
      evidenceIds: filterEvidence(inf.evidenceIds)
    })).slice(0, 20);
  }

  // 4. Attachments
  if (Array.isArray(parsedData.attachmentAssessment)) {
    validated.attachmentAssessment = parsedData.attachmentAssessment.map(att => ({
      filename: validString(att.filename, 200),
      assessment: validString(att.assessment, 500),
      evidenceIds: filterEvidence(att.evidenceIds)
    })).slice(0, 10);
  }

  // 5. Recommendations
  if (Array.isArray(parsedData.recommendedActions)) {
    validated.recommendedActions = parsedData.recommendedActions.map(ra => ({
      priority: validSeverity(ra.priority),
      action: validString(ra.action, 200),
      reason: validString(ra.reason, 500),
      evidenceIds: filterEvidence(ra.evidenceIds)
    })).slice(0, 10);
  }

  return validated;
}

module.exports = {
  validateCopilotOutput
};
