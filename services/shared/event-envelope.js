const crypto = require('crypto');

/**
 * Standard CloudEvents v1.0.2 Envelope Builder
 */
function createCloudEvent({ topic, eventType, data, producer = 'domain-service', priority = 'NORMAL', metadata = {} }) {
  const eventId = 'evt_' + crypto.randomUUID();
  const traceId = 'trc_' + crypto.randomBytes(4).toString('hex');
  const timestamp = new Date().toISOString();

  return {
    specversion: '1.0',
    id: eventId,
    traceId,
    source: `/campus/microservices/${producer}`,
    type: eventType,
    topic: topic,
    time: timestamp,
    priority: priority, // NORMAL, HIGH, URGENT, CRITICAL
    datacontenttype: 'application/json',
    data: data,
    metadata: {
      producer,
      timestamp,
      version: '1.0.0',
      ...metadata
    }
  };
}

module.exports = { createCloudEvent };
