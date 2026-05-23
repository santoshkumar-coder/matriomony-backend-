const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'matrimony-user-service',
  brokers: [process.env.KAFKA_BROKER || '187.127.137.216:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 3,
  },
});
const brokerHost = process.env.KAFKA_BROKER || '187.127.137.216';

module.exports = kafka;
// const brokerHost = process.env.KAFKA_BROKER || 'localhost';
// const brokerPort = process.env.KAFKA_PORT || '9092';  // default as string

// const kafka = new Kafka({
//   clientId: 'matrimony-user-service',
//   brokers: [`${brokerHost}:${brokerPort}`],
//   retry: {
//     initialRetryTime: 300,
//     retries: 5,
//   },
// });
// console.log(`Kafka configured with broker: ${brokerHost}:${brokerPort}`);

// module.exports = kafka;




// const axios = require('axios');

// const sendEvent = async (topic, message) => {
//   console.log(`[sendEvent] Preparing to send message to topic: "${topic}"`);
//   console.log(`[sendEvent] Message payload:`, message);

//   try {
//     console.log("url", `${process.env.KAFKA_BROKER}/${topic}`)
//     const response = await axios.post(
//       `${process.env.KAFKA_BROKER}/topics/${topic}`,
//       // { records: [{ value: JSON.stringify(message) }] },
//       { records: [{ value: message }] },
//       {
//         headers: {
//           'Content-Type': 'application/vnd.kafka.json.v2+json',
//           'ngrok-skip-browser-warning': 'true'
//         }
//       }
//     );

//     // console.log(`[sendEvent] Message sent successfully to topic: "${topic}"`);
//     // console.log(`[sendEvent] Response status: ${response.status}`);
//     // console.log(`[sendEvent] Response data:`, response.data);

//   } catch (error) {
//     console.error(`[sendEvent] Failed to send message to topic: "${topic}"`);
//     if (error.response) {
//       console.error(`[sendEvent] Response status: ${error.response.status}`);
//       console.error(`[sendEvent] Response data:`, error.response.data);
//     } else {
//       console.error(`[sendEvent] Error:`, error.message);
//     }
//   }
// }

// console.log('sendEvent function loaded');

// module.exports = { sendEvent };