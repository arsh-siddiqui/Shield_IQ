/**
 * investigationTimeline.js
 * Generates a normalized chronological timeline from EmailInvestigation evidence.
 */
exports.generateInvestigationTimeline = (investigation) => {
  const events = [];

  const addEvent = (timestamp, type, title, description, source, metadata = {}) => {
    if (!timestamp) return;
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return; // Malformed
      events.push({
        timestamp: date.toISOString(),
        type,
        title,
        description,
        source,
        metadata
      });
    } catch (e) {
      // Ignore invalid dates
    }
  };

  // 1. Email Date Header
  if (investigation.headers?.date) {
    addEvent(
      investigation.headers.date,
      "email_date",
      "Email Date Header",
      "Timestamp provided by the sender's mail client (Date header).",
      "header"
    );
  }

  // 2. Received Hops
  if (investigation.headers?.received && Array.isArray(investigation.headers.received)) {
    investigation.headers.received.forEach((hop, idx) => {
      if (hop.timestamp) {
        let desc = hop.by ? `Received by ${hop.by}` : "Received by MTA";
        if (hop.from) desc += ` from ${hop.from}`;
        
        addEvent(
          hop.timestamp,
          "received_hop",
          `Received Hop ${investigation.headers.received.length - idx}`,
          desc,
          "header",
          { raw: hop.raw, hopIndex: idx }
        );
      }
    });
  }

  // 3. Investigation Created
  if (investigation.createdAt) {
    addEvent(
      investigation.createdAt,
      "investigation_created",
      "Investigation Created",
      "The email was uploaded/pasted for forensic analysis.",
      "investigation"
    );
  }

  // 4. Enrichment Timestamps (approximate based on updatedAt or specific fields if they exist)
  if (investigation.enrichmentStatus && investigation.enrichmentStatus !== 'pending') {
    // If the investigation was updated after creation, it might be the enrichment finish time.
    if (investigation.updatedAt && investigation.updatedAt > investigation.createdAt) {
      const statusTitle = investigation.enrichmentStatus.charAt(0).toUpperCase() + investigation.enrichmentStatus.slice(1);
      addEvent(
        investigation.updatedAt,
        "enrichment_completed",
        `Enrichment ${statusTitle}`,
        `Threat intelligence orchestration ${investigation.enrichmentStatus}.`,
        "enrichment",
        { status: investigation.enrichmentStatus }
      );
    }
  }

  // Sort ascending by timestamp
  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};
