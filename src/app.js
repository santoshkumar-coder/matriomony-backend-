const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const globalErrorHandler = require("./middlewares/errorMiddleware");
const ticketRoutes = require("../src/routes/ticketRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".ngrok-free.dev");
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/test", (req, res) => {
  res.send("Auth Service Running");
});

app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/success-stories", require("./routes/successStoryRoutes"));
app.use("/api/v1/interests", require("./routes/sendInterestRoutes"));
app.use("/api/v1/matches", require("./routes/match.routes"));
app.use("/api/v1/dashboardStats", require("./routes/dashboardStatsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/banners", require("./routes/bannerRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/spam", require("../src/routes/spamRoutes"));

app.use("/api/v1/saved-searches", require("./routes/savedSearchRoutes"));
app.use("/api/v1/tickets", ticketRoutes);

app.use(globalErrorHandler);

module.exports = app;