const kafka = require('../config/kafka');
const TOPICS = require('./topics');
const User = require('../models/userModel');
const { publishMessage } = require('./producer');

const consumer = kafka.consumer({ groupId: 'user-service-group' });

const connectConsumer = async () => {
  await consumer.connect();
  console.log('✅ Kafka Consumer connected');

  // Subscribe to all relevant topics
  await consumer.subscribe({
    topics: [TOPICS.USER_CREATED, TOPICS.GET_ALL_USERS],
    fromBeginning: false,
  });

  await consumer.run({
    // eachMessage: async ({ topic, message }) => {
    //   const payload = JSON.parse(message.value.toString());
    //   console.log(`📥 [${topic}]`, payload);

    //   switch (topic) {
    //     case TOPICS.GET_ALL_USERS:
    //       await handleGetAllUsers(payload);
    //       break;
    //   }
    // },
    eachMessage: async ({ topic, message }) => {
      let payload;
      try {
        payload = JSON.parse(message.value.toString());
      } catch (err) {
        console.error(`❌ Bad message on [${topic}], skipping:`, message.value.toString());
        return; // skip bad message, consumer stays alive
      }

      console.log(`📥 [${topic}]`, payload);

      switch (topic) {
        case TOPICS.USER_CREATED:
          await handleUserCreated(payload);
          break;
        case TOPICS.GET_ALL_USERS:
          await handleGetAllUsers(payload);
          break;
      }
    },
  });
};




const handleGetAllUsers = async (payload) => {
  try {
    const { correlationId, requestedBy } = payload;

    const users = await User.find({}).select('-password').lean();

    // Reply back on the reply topic so the requester can pick it up
    await publishMessage(TOPICS.GET_ALL_USERS_REPLY, {
      correlationId,
      requestedBy,
      total: users.length,
      users,
    });

    console.log(`✅ Replied with ${users.length} users → [${TOPICS.GET_ALL_USERS_REPLY}]`);
  } catch (err) {
    console.error('❌ handleGetAllUsers error:', err.message);
  }
};

const disconnectConsumer = async () => {
  await consumer.disconnect();
  console.log('Kafka Consumer disconnected');
};


module.exports = { connectConsumer };