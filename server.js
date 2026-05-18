
require('dotenv').config();
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const http = require("http");
const app = require("./src/app");
const { initSocket } = require("./src/socket/socket");
require("dotenv").config();
const { connectProducer } = require("./src/kafka/producer");
const { connectConsumer } = require("./src/kafka/consumer");
const axios = require('axios');
// .

const server = http.createServer(app);
const dns = require("node:dns/promises");
const e = require('express');
dns.setServers(["8.8.8.8", "1.1.1.1"]);


// initialize socket
const io = initSocket(server);
// connectDB(); 

const PORT = process.env.PORT || 5001;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VenbaImpex API Documentation",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  // apis: ["./routes/*.js"], // path to route files
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.listen(PORT, () => {
//   console.log(`
// --------------------------------
// || Service running on ${PORT} ||
// --------------------------------

// Swagger Docs:
// http://localhost:${PORT}/api-docs
// `);
// });

// async function sendEvent() {
//   await axios.post(
//     'https://unvaried-pungent-tantrum.ngrok-free.dev/kafka/topics/match-events',
//     {
//       records: [
//         { value: JSON.stringify({ orderId: 1, price: 100 }) }
//       ]
//     },
//     {
//       headers: {
//         'Content-Type': 'application/vnd.kafka.json.v2+json',
//         'ngrok-skip-browser-warning': 'true'  // ← skip ngrok warning
//       }
//     }
//   )
// }
// sendEvent().catch(err => console.error('Error sending event:', err));
// sendEvent()
const start = async () => {
  await connectDB();

  try {
    await connectProducer();
    await connectConsumer();
  } catch (err) {
    console.error('⚠️  Kafka unavailable, continuing without it:', err.message);
  }

  app.listen(PORT, () => {
    console.log('------------------------------');
    console.log(`|| Service running on ${PORT} ||`);
    console.log('------------------------------');
  });
};
start();


module.exports = { io };