const { validateCopilotOutput } = require('../services/ai/investigationOutputValidator');

describe('investigationOutputValidator', () => {
  it('should validate and sanitize correct output, keeping valid evidence IDs', () => {
    const catalog = [{ id: 'E_VERDICT' }, { id: 'E_IND_1' }];
    const aiOutput = {
      summary: 'Test summary',
      confidence: 85,
      keyFindings: [
        {
          title: 'Bad IP',
          severity: 'high',
          description: 'IP is malicious',
          evidenceIds: ['E_IND_1', 'E_FAKE_ID']
        }
      ]
    };

    const validated = validateCopilotOutput(aiOutput, catalog);
    expect(validated.summary).toBe('Test summary');
    expect(validated.confidence).toBe(85);
    expect(validated.keyFindings[0].severity).toBe('high');
    expect(validated.keyFindings[0].evidenceIds).toContain('E_IND_1');
    expect(validated.keyFindings[0].evidenceIds).not.toContain('E_FAKE_ID'); // Hallucinated ID removed
  });

  it('should normalize invalid severities', () => {
    const catalog = [];
    const aiOutput = {
      keyFindings: [
        {
          title: 'Test',
          severity: 'extreme', // Invalid
          description: 'Test',
          evidenceIds: []
        }
      ]
    };

    const validated = validateCopilotOutput(aiOutput, catalog);
    expect(validated.keyFindings[0].severity).toBe('info');
  });

  it('should restrict confidence to 0-100', () => {
    const catalog = [];
    const aiOutput = {
      confidence: 150
    };

    const validated = validateCopilotOutput(aiOutput, catalog);
    expect(validated.confidence).toBe(100);
  });
});
