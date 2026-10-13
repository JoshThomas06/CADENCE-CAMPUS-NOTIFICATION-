const { Kafka, logLevel } = require('kafkajs');
const EventEmitter = require('events');

// Global in-memory event bus singleton across microservices running in the same Node process (or test runner)
if (!global.__CAMPUS_EVENT_BUS__) {
  global.__CAMPUS_EVENT_BUS__ = new EventEmitter();
  global.__CAMPUS_EVENT_BUS__.setMaxListeners(50);
}

class ResilientKafkaClient {
  constructor({ clientId, brokers = [process.env.KAFKA_BROKER || 'localhost:9092'] }) {
    this.clientId = clientId;
    this.brokers = brokers;
    this.useKafka = process.env.DISABLE_KAFKA !== 'true';
    this.isKafkaConnected = false;
    this.producer = null;
    this.consumer = null;

    try {
      this.kafka = new Kafka({
        clientId: this.clientId,
        brokers: this.brokers,
        connectionTimeout: 2000,
        requestTimeout: 3000,
        logLevel: logLevel.NOTHING,
        retry: {
          retries: 2,
          initialRetryTime: 300
        }
      });
    } catch (e) {
      this.useKafka = false;
    }
  }

  async getProducer() {
    if (this.producer) return this.producer;

    if (this.useKafka) {
      try {
        const prod = this.kafka.producer();
        await prod.connect();
        this.producer = prod;
        this.isKafkaConnected = true;
        console.log(`[KafkaProducer:${this.clientId}] Connected to Kafka broker (${this.brokers.join(',')})`);
        return this.producer;
      } catch (err) {
        console.warn(`[KafkaProducer:${this.clientId}] Kafka unavailable (${err.message}). Using local in-memory EventBus fallback.`);
        this.isKafkaConnected = false;
      }
    }

    // Local fallback producer
    this.producer = {
      send: async ({ topic, messages }) => {
        for (const msg of messages) {
          const valueStr = msg.value.toString();
          global.__CAMPUS_EVENT_BUS__.emit(topic, {
            topic,
            partition: 0,
            message: {
              key: msg.key,
              value: Buffer.from(valueStr),
              timestamp: Date.now()
            }
          });
        }
        return [{ topicName: topic, partition: 0, errorCode: 0, baseOffset: '0' }];
      },
      disconnect: async () => {}
    };
    return this.producer;
  }

  async publish(topic, payload, key = null) {
    const prod = await this.getProducer();
    const valueStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await prod.send({
      topic,
      messages: [{
        key: key || (payload.id || 'default_key'),
        value: valueStr
      }]
    });
  }

  async startConsumer({ groupId, topics, eachMessage }) {
    if (this.useKafka) {
      try {
        const cons = this.kafka.consumer({ groupId });
        await cons.connect();
        for (const topic of topics) {
          await cons.subscribe({ topic, fromBeginning: false });
        }
        await cons.run({ eachMessage });
        this.consumer = cons;
        this.isKafkaConnected = true;
        console.log(`[KafkaConsumer:${groupId}] Subscribed to [${topics.join(', ')}] on Kafka broker`);
        return this.consumer;
      } catch (err) {
        console.warn(`[KafkaConsumer:${groupId}] Kafka consumer connection failed. Falling back to in-memory EventBus.`);
      }
    }

    // Fallback in-memory consumer
    for (const topic of topics) {
      global.__CAMPUS_EVENT_BUS__.on(topic, async (eventData) => {
        try {
          await eachMessage(eventData);
        } catch (e) {
          console.error(`[LocalConsumer:${groupId}] Error processing event on topic ${topic}:`, e);
        }
      });
    }
    console.log(`[LocalConsumer:${groupId}] Subscribed to [${topics.join(', ')}] on local EventBus`);
  }
}

module.exports = { ResilientKafkaClient };
