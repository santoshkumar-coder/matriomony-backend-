const kafka = require('../config/kafka');

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('✅ Kafka Producer connected');
};

const disconnectProducer = async () => {
  await producer.disconnect();
  console.log('Kafka Producer disconnected');
};

/**
 * Publish a message to a Kafka topic
 * @param {string} topic
 * @param {object} message - JS object, will be JSON stringified
 * @param {string} [key]   - optional partition key
 */
const publishMessage = async (topic, message, key = null) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: key ? String(key) : null,
          value: JSON.stringify(message),
        },
      ],
    });
    console.log(`📤 Published to [${topic}]:`, message);
  } catch (err) {
    console.error(`❌ Failed to publish to [${topic}]:`, err.message);
    throw err;
  }
};

module.exports = { connectProducer, disconnectProducer, publishMessage };