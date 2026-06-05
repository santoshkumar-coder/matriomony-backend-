const kafka = require('../config/kafka');

const producer = kafka.producer();
let isConnected = false;

const connectProducer = async () => {
  if (isConnected) return;
  await producer.connect();
  isConnected = true;
  console.log('✅ Kafka Producer connected');
};

const disconnectProducer = async () => {
  await producer.disconnect();
  isConnected = false;
  console.log('Kafka Producer disconnected');
};

// Auto-reconnect on unexpected disconnect
producer.on(producer.events.DISCONNECT, async () => {
  console.warn('⚠️ Kafka Producer disconnected. Reconnecting...');
  isConnected = false;
  setTimeout(async () => {
    await connectProducer().catch(console.error);
  }, 3000); // wait 3s before reconnecting
});

/**
 * Publish a message to a Kafka topic
 * @param {string} topic
 * @param {object} message - JS object, will be JSON stringified
 * @param {string} [key]   - optional partition key
 */
const publishMessage = async (topic, message, key = null) => {
  try {
    // Reconnect if disconnected before sending
    if (!isConnected) {
      console.warn('⚠️ Producer not connected. Reconnecting before publish...');
      await connectProducer();
    }

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
    // If disconnected mid-send, reconnect and retry once
    if (err.message.includes('disconnected') || err.message.includes('DISCONNECTED')) {
      console.warn('⚠️ Producer lost during send. Retrying after reconnect...');
      isConnected = false;
      await connectProducer();
      await producer.send({
        topic,
        messages: [
          {
            key: key ? String(key) : null,
            value: JSON.stringify(message),
          },
        ],
      });
      console.log(`📤 Published to [${topic}] after reconnect:`, message);
    } else {
      console.error(`❌ Failed to publish to [${topic}]:`, err.message);
      throw err;
    }
  }
};

module.exports = { connectProducer, disconnectProducer, publishMessage };