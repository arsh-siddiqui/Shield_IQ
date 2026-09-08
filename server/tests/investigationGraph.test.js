'use strict';

const assert = require('assert');
const { generateInvestigationGraph } = require("../services/intelligence/investigationGraph");



describe('Test Suite', () => {
  console.log('\n=== INVESTIGATION GRAPH TESTS ===');

  it("generates deterministic nodes and edges with deduplication", async () => {
    const mockInvestigation = {
      _id: "inv12345",
      scanId: { riskLevel: "high" },
      headers: {
        subject: "Test Subject",
        from: "Sender <sender@example.com>",
        to: "Recipient <recipient@example.com>, other@example.com",
        received: [
          { ipAddresses: ["8.8.8.8", "1.1.1.1"] },
          { ipAddresses: ["8.8.8.8"] } // Duplicate IP
        ]
      },
      attachments: [
        { filename: "bad.exe", sizeBytes: 1024, sha256: "abcdef123" }
      ]
    };

    const mockIndicators = [
      { type: "ip", normalizedValue: "8.8.8.8", threatStatus: "flagged", severity: "high", geolocation: { status: "success", country: "US" } },
      { type: "domain", normalizedValue: "example.com", threatStatus: "clean" }
    ];

    const graph = generateInvestigationGraph(mockInvestigation, mockIndicators);

    assert.strictEqual(graph.meta.truncated, false);

    // Nodes
    const nodes = graph.nodes;
    const invNode = nodes.find(n => n.id === "inv_inv12345");
    assert.ok(invNode);
    
    const emailNode = nodes.find(n => n.id === "email_doc_inv12345");
    assert.ok(emailNode);

    const senderNode = nodes.find(n => n.id === "person_sender@example.com");
    assert.ok(senderNode);

    // IP 8.8.8.8 should only appear ONCE despite being in received array multiple times and indicators array
    const ipNodes = nodes.filter(n => n.id === "ip_8.8.8.8");
    assert.strictEqual(ipNodes.length, 1);

    // Attachment and hash nodes
    assert.ok(nodes.find(n => n.id === "attachment_bad.exe"));
    assert.ok(nodes.find(n => n.id === "hash_abcdef123"));
    
    // Edges
    const edges = graph.edges;
    // Edge from investigation to email
    assert.ok(edges.find(e => e.source === "inv_inv12345" && e.target === "email_doc_inv12345"));
    // Edge from email to ip_8.8.8.8 via received
    assert.ok(edges.find(e => e.source === "email_doc_inv12345" && e.target === "ip_8.8.8.8" && e.relation === "received_via"));
    
    // Total count validation
    assert.ok(nodes.length > 0);
    assert.ok(edges.length > 0);
  });

  it("handles truncation limits safely", async () => {
    // Generate massive received array to hit edge/node limit
    const massiveReceived = [];
    for (let i = 0; i < 600; i++) {
      massiveReceived.push({ ipAddresses: [`10.0.0.${i}`] });
    }

    const mockInvestigation = {
      _id: "inv_massive",
      headers: {
        subject: "Massive",
        received: massiveReceived
      }
    };

    const graph = generateInvestigationGraph(mockInvestigation, []);
    assert.strictEqual(graph.meta.truncated, true);
    assert.ok(graph.nodes.length <= graph.meta.nodeLimit);
    assert.ok(graph.edges.length <= graph.meta.edgeLimit);
  });

  });


