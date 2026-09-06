'use strict';

/**
 * evidenceFusion.js — Combines heuristic, ML, and threat intelligence evidence
 * into a final, coherent risk assessment.
 *
 * Design principles:
 *   1. Heuristic result is the BASELINE — never overridden without strong evidence.
 *   2. Threat intelligence is high-confidence: PhishDestroy threat always forces High risk regardless of other signals.
 *   3. ML probability refines the baseline but is not the sole decision-maker.
 *   4. Groq refines category, summary, and recommendations — does NOT override
 *      the threat-level decision when strong evidence is present.
 *   5. All evidence sources are recorded for transparency.
 *
 * Risk level mapping:
 *   'Safe' | 'Low' | 'Medium' | 'High'  (matches existing frontend bands)
 *
 * IMPORTANT: Scores from different systems are NOT simply added — they measure
 * different things. Fusion uses decision rules, not naive averaging.
 */

const RISK_RANK = { safe: 0, low: 1, medium: 2, high: 3 };
const RISK_FROM_RANK = ['safe', 'low', 'medium', 'high'];

function riskMax(a, b) {
  return RISK_FROM_RANK[Math.max(RISK_RANK[a] || 0, RISK_RANK[b] || 0)];
}

/**
 * Fuse all evidence into a final scan result.
 *
 * @param {Object} heuristicResult   - Output from analyzeContent() (heuristic engine)
 * @param {Object|null} mlEvidence   - Output from mlService.classifyText()
 * @param {Object|null} threatIntel  - Output from threatIntelService.getThreatIntelligence()
 * @param {Object|null} groqResult   - Output from groqService.analyzeWithGroq()
 * @returns {Object} Final merged result with all evidence fields
 */
/**
 * Fuse all evidence into a final scan result.
 *
 * @param {Object} heuristicResult   - Output from analyzeContent() (heuristic engine)
 * @param {Object|null} mlEvidence   - Output from mlService.classifyText()
 * @param {Object|null} threatIntel  - Output from threatIntelService.getThreatIntelligence()
 * @param {Object|null} ragEvidence  - Output from ragClient retrieval
 * @param {Object|null} groqResult   - Output from groqService.analyzeWithGroq()
 * @returns {Object} Final merged result with all evidence fields
 */
function fuseEvidence(heuristicResult, mlEvidence, threatIntel, ragEvidence, groqResult) {
  const analysisSources = ['heuristics'];
  let finalRiskLevel = heuristicResult.riskLevel;
  let finalRiskScore = heuristicResult.riskScore;
  let finalConfidence = heuristicResult.confidence;
  let finalCategory = heuristicResult.category;
  let finalSummary = heuristicResult.summary;
  let finalReasons = [...(heuristicResult.reasons || [])];
  let finalRecommendations = [...(heuristicResult.recommendations || [])];

  // 1. Threat Intelligence (highest priority evidence)
  const phishdestroyFound = threatIntel?.phishdestroy?.status === 'found' && threatIntel.phishdestroy.malicious;

  if (phishdestroyFound) {
    analysisSources.push('phishdestroy');
    const riskScore = threatIntel.phishdestroy.riskScore || 80;
    const severity = threatIntel.phishdestroy.severity || 'high';

    if (riskScore >= 80 || severity === 'critical') {
      finalRiskLevel  = 'high';
      finalRiskScore  = Math.max(finalRiskScore, riskScore);
      finalConfidence = Math.max(finalConfidence, 95);
      finalCategory   = 'Known Suspicious Domain (PhishDestroy)';
      finalSummary    = 'This URL/domain was flagged by PhishDestroy threat intelligence as highly suspicious or malicious.';
      finalReasons = [
        { title: 'Known Threat Domain', detail: `PhishDestroy classified this domain as malicious. Severity: ${severity}.`, severity: 'high' },
        ...finalReasons,
      ];
      finalRecommendations = [
        'Do NOT visit this URL.',
        'Do NOT enter any personal information, passwords, or payment details.',
        ...finalRecommendations,
      ];
    } else {
      finalRiskLevel  = riskMax(finalRiskLevel, 'high');
      finalRiskScore  = Math.max(finalRiskScore, riskScore);
      finalConfidence = Math.max(finalConfidence, 85);
      finalCategory   = 'Suspicious Domain (PhishDestroy)';
      finalReasons = [
        { title: 'Suspicious Domain', detail: `PhishDestroy flagged this domain. Severity: ${severity}.`, severity: 'medium' },
        ...finalReasons,
      ];
    }
  }

  // 2. Machine Learning evidence
  if (mlEvidence?.status === 'available') {
    analysisSources.push('machine_learning');
    const mlPhishProb = mlEvidence.probability;
    const mlLabel     = mlEvidence.label;

    if (mlLabel === 'phishing') {
      if (mlPhishProb >= 0.85 && finalRiskLevel === 'medium') {
        finalRiskLevel  = 'high';
        finalRiskScore  = Math.max(finalRiskScore, 72);
        finalConfidence = Math.min(99, finalConfidence + 10);
      } else if (mlPhishProb >= 0.70 && finalRiskLevel === 'low') {
        finalRiskLevel  = riskMax(finalRiskLevel, 'medium');
        finalRiskScore  = Math.max(finalRiskScore, 45);
        finalConfidence = Math.min(99, finalConfidence + 8);
      } else if (mlPhishProb >= 0.85 && finalRiskLevel === 'low') {
        finalRiskLevel  = riskMax(finalRiskLevel, 'medium');
        finalRiskScore  = Math.max(finalRiskScore, 52);
        finalConfidence = Math.min(99, finalConfidence + 12);
      }
      if (finalRiskLevel === 'high' && mlPhishProb >= 0.70) {
        finalConfidence = Math.min(99, finalConfidence + 5);
      }
    } else if (mlLabel === 'safe') {
      if (mlPhishProb <= 0.15 && finalRiskLevel === 'low' && !phishdestroyFound) {
        finalRiskLevel = 'safe';
        finalRiskScore = Math.min(finalRiskScore, 10);
        finalConfidence = Math.min(99, finalConfidence + 5);
      }
    }
  }

  // 3. RAG Personalization Evidence (Deterministic)
  if (ragEvidence?.status === 'available' && ragEvidence.similarityData?.length > 0) {
    analysisSources.push('rag');
    const avgSim = ragEvidence.similarityData.reduce((acc, curr) => acc + curr.similarity, 0) / ragEvidence.similarityData.length;
    // RAG does not override strong TI or Heuristics, but adds confidence.
    if (avgSim > 0.8 && finalRiskLevel === 'safe') {
      finalConfidence = Math.min(99, finalConfidence + 10);
      finalReasons.push({ title: 'Personalized Context', detail: 'This email is highly similar to your past legitimate correspondence.', severity: 'info' });
    } else if (avgSim < 0.2 && finalRiskLevel === 'safe') {
      // Unusual correspondence
      finalReasons.push({ title: 'Unusual Context', detail: 'This email format is rarely seen in your past legitimate correspondence. Remain vigilant.', severity: 'info' });
    }
  }

  // 4. Groq contextual refinement
  if (groqResult) {
    analysisSources.push('groq');

    // Classification extraction from LLM (optional, to adhere to new schema)
    if (!phishdestroyFound) {
      if (groqResult.category) finalCategory = groqResult.category;
      if (groqResult.summary)  finalSummary  = groqResult.summary;
      if (Array.isArray(groqResult.recommendations) && groqResult.recommendations.length > 0) {
        const existingSet = new Set(finalRecommendations.map(r => r.toLowerCase()));
        for (const rec of groqResult.recommendations) {
          if (!existingSet.has(rec.toLowerCase())) {
            finalRecommendations.push(rec);
            existingSet.add(rec.toLowerCase());
          }
        }
      }
    }

    if (Array.isArray(groqResult.reasons)) {
      for (const reason of groqResult.reasons) {
        finalReasons.push({
          title: `AI Analysis: ${reason.slice(0, 80)}`,
          detail: reason,
          severity: 'low',
        });
      }
    }

    if (Array.isArray(groqResult.socialEngineeringSignals)) {
      for (const sig of groqResult.socialEngineeringSignals) {
        finalReasons.push({
          title: `Social Engineering: ${sig.slice(0, 80)}`,
          detail: sig,
          severity: 'medium',
        });
      }
    }

    if (Array.isArray(groqResult.personalizationEvidence)) {
      for (const evid of groqResult.personalizationEvidence) {
        finalReasons.push({
          title: `Personalization: ${evid.slice(0, 80)}`,
          detail: evid,
          severity: 'info',
        });
      }
    }

    if (!phishdestroyFound && typeof groqResult.confidence === 'number') {
      finalConfidence = Math.min(99, Math.round((finalConfidence + groqResult.confidence) / 2));
    }
    
    // Groq riskScore and riskLevel override ONLY if not overridden by TI
    if (!phishdestroyFound && typeof groqResult.riskScore === 'number' && groqResult.riskScore > finalRiskScore) {
       finalRiskScore = Math.max(finalRiskScore, groqResult.riskScore);
       finalRiskLevel = groqResult.riskLevel || finalRiskLevel;
    }
  }

  finalRiskScore  = Math.min(100, Math.max(0, Math.round(finalRiskScore)));
  finalConfidence = Math.min(99, Math.max(0, Math.round(finalConfidence)));

  let finalClassification = 'legitimate';
  if (finalRiskLevel === 'high' || finalRiskLevel === 'critical') finalClassification = 'phishing';
  else if (finalRiskLevel === 'medium' || finalRiskLevel === 'low') finalClassification = 'suspicious';

  const intelligence = {};
  if (threatIntel?.phishdestroy && threatIntel.phishdestroy.status !== 'skipped') {
    intelligence.phishdestroy = {
      status:    threatIntel.phishdestroy.status,
      malicious: threatIntel.phishdestroy.malicious || false,
      riskScore: threatIntel.phishdestroy.riskScore,
      severity:  threatIntel.phishdestroy.severity,
    };
  }

  const mlOutput = mlEvidence?.status === 'available'
    ? {
        status:       'available',
        label:        mlEvidence.label,
        probability:  mlEvidence.probability,
        modelName:    mlEvidence.modelName,
        modelVersion: mlEvidence.modelVersion,
      }
    : {
        status: mlEvidence?.status || 'unavailable',
        reason: mlEvidence?.reason || 'not_run',
      };

  return {
    classification:  finalClassification,
    riskScore:       finalRiskScore,
    confidence:      finalConfidence,
    riskLevel:       finalRiskLevel,
    scanType:        heuristicResult.scanType,
    scannedAt:       heuristicResult.scannedAt,
    category:        finalCategory,
    summary:         finalSummary,
    reasons:         finalReasons,
    recommendations: finalRecommendations,
    detectedSignals: heuristicResult.detectedSignals || [],

    intelligence,
    ml:  mlOutput,
    rag: ragEvidence,
    heuristics: {
      signalCount: (heuristicResult.detectedSignals || []).length,
      riskLevel:   heuristicResult.riskLevel,
      riskScore:   heuristicResult.riskScore,
    },
    analysisSources,
  };
}

module.exports = { fuseEvidence };

