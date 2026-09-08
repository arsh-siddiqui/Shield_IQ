'use strict';

const assert = require('assert');
const { generateInvestigationTimeline } = require("../services/intelligence/investigationTimeline");



describe('Test Suite', () => {
  console.log('\n=== INVESTIGATION TIMELINE TESTS ===');

  it("generates chronological events from evidence without fabricating timestamps", async () => {
    const mockInvestigation = {
      createdAt: "2024-01-10T10:05:00.000Z",
      updatedAt: "2024-01-10T10:06:00.000Z",
      enrichmentStatus: "completed",
      headers: {
        date: "2024-01-10T09:00:00.000Z",
        received: [
          { timestamp: "2024-01-10T09:10:00.000Z", by: "mx1.example.com", from: "sender.example.com" },
          { timestamp: "2024-01-10T09:05:00.000Z", by: "mx2.example.com" } // out of order in array, should be sorted in output
        ]
      }
    };

    const timeline = generateInvestigationTimeline(mockInvestigation);

    // There should be 5 events: 1 email_date, 2 received_hop, 1 created, 1 enrichment
    assert.strictEqual(timeline.length, 5);

    // Check chronological sorting
    assert.strictEqual(timeline[0].type, "email_date");
    assert.strictEqual(timeline[0].timestamp, "2024-01-10T09:00:00.000Z");

    assert.strictEqual(timeline[1].type, "received_hop");
    assert.strictEqual(timeline[1].timestamp, "2024-01-10T09:05:00.000Z");

    assert.strictEqual(timeline[2].type, "received_hop");
    assert.strictEqual(timeline[2].timestamp, "2024-01-10T09:10:00.000Z");

    assert.strictEqual(timeline[3].type, "investigation_created");
    assert.strictEqual(timeline[3].timestamp, "2024-01-10T10:05:00.000Z");

    assert.strictEqual(timeline[4].type, "enrichment_completed");
    assert.strictEqual(timeline[4].timestamp, "2024-01-10T10:06:00.000Z");
  });

  it("safely handles missing or malformed dates", async () => {
    const mockInvestigation = {
      createdAt: "2024-01-10T10:05:00.000Z",
      headers: {
        date: "invalid-date-string",
        received: [
          { timestamp: null }
        ]
      }
    };

    const timeline = generateInvestigationTimeline(mockInvestigation);
    
    // Should only have investigation_created, as invalid ones are skipped
    assert.strictEqual(timeline.length, 1);
    assert.strictEqual(timeline[0].type, "investigation_created");
  });

  });


