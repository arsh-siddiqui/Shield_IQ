const { buildEvidencePackage } = require('../services/ai/investigationEvidenceBuilder');
const mongoose = require('mongoose');

describe('investigationEvidenceBuilder', () => {
  it('should build a compact evidence package with deterministic IDs', () => {
    const investigation = {
      _id: new mongoose.Types.ObjectId(),
      sourceType: 'eml_upload',
      analysisDepth: 'forensic',
      headers: {
        from: 'attacker@bad.com',
        subject: 'Invoice'
      }
    };
    
    const scan = {
      classification: 'phishing',
      riskScore: 95,
      riskLevel: 'critical',
      confidence: 90
    };

    const indicators = [
      { type: 'ip', normalizedValue: '1.2.3.4', threatStatus: 'flagged' }
    ];

    const timeline = [];
    const graph = { nodes: [], edges: [] };

    const { package: evidencePkg, catalog } = buildEvidencePackage(investigation, scan, indicators, timeline, graph);

    expect(evidencePkg.detection.id).toBe('E_VERDICT');
    expect(evidencePkg.detection.riskLevel).toBe('critical');
    
    expect(evidencePkg.indicators[0].id).toBe('E_IND_1');
    expect(evidencePkg.indicators[0].value).toBe('1.2.3.4');
    
    expect(catalog.length).toBeGreaterThan(3);
    expect(catalog.find(c => c.id === 'E_VERDICT')).toBeDefined();
    expect(catalog.find(c => c.id === 'E_IND_1')).toBeDefined();
  });
});
