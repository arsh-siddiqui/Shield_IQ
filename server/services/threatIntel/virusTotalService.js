/**
 * virusTotalService.js — VirusTotal Threat API lookup.
 * API: https://www.virustotal.com/api/v3/domains/{domain}
 */

const axios = require('axios');
const env = require('../../config/env');
const { normalizeDomain } = require('./phishDestroyService'); // Reuse the domain normalizer

/**
 * Checks a URL against the VirusTotal API.
 * @param {string} rawUrl - The extracted URL to check.
 * @returns {Promise<Object>} Normalized threat intelligence response.
 */
async function checkVirusTotal(rawUrl) {
  const domain = normalizeDomain(rawUrl);
  if (!domain) {
    return {
      provider: 'VirusTotal',
      status: 'error',
      malicious: false
    };
  }

  const apiKey = env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return {
      provider: 'VirusTotal',
      status: 'skipped',
      malicious: false,
      detail: 'No VirusTotal API key configured.'
    };
  }

  try {
    const url = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`;
    
    const response = await axios.get(url, {
      headers: {
        'x-apikey': apiKey
      },
      timeout: parseInt(env.VIRUSTOTAL_TIMEOUT_MS, 10),
      validateStatus: () => true
    });

    if (response.status === 404) {
      return {
        provider: 'VirusTotal',
        status: 'not_found',
        malicious: false,
        riskScore: 0,
        severity: 'none',
        detail: 'Domain not found in VirusTotal database.'
      };
    }

    if (response.status !== 200 || !response.data || !response.data.data) {
      return {
        provider: 'VirusTotal',
        status: 'error',
        malicious: false,
        detail: `API returned status ${response.status}`
      };
    }

    const stats = response.data.data.attributes.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const totalPositives = malicious + suspicious;
    
    const isThreat = totalPositives > 0;
    let severity = 'none';
    let riskScore = 0;

    if (isThreat) {
      if (malicious >= 3) {
        severity = 'critical';
        riskScore = 100;
      } else if (malicious > 0 || suspicious >= 2) {
        severity = 'high';
        riskScore = 80;
      } else {
        severity = 'medium';
        riskScore = 50;
      }
    }

    return {
      provider: 'VirusTotal',
      status: 'found',
      malicious: isThreat,
      riskScore,
      severity,
      detail: isThreat 
        ? `Flagged by ${totalPositives} security vendors (Malicious: ${malicious}, Suspicious: ${suspicious}).`
        : 'Checked against multiple security vendors and found no threats.',
      checkedAt: new Date().toISOString()
    };

  } catch (error) {
    return {
      provider: 'VirusTotal',
      status: 'error',
      malicious: false,
      detail: error.message
    };
  }
}

module.exports = {
  checkVirusTotal
};
