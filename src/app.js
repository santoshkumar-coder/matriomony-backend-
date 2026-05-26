const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");  
const helmet = require("helmet");
const morgan = require("morgan");
const globalErrorHandler = require('./middlewares/errorMiddleware');
const ticketRoutes = require("../src/routes/ticketRoutes");



const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(helmet());
app.use(morgan("dev"));



app.get("/test", (req, res) => {
  res.send("Auth Service Running");
});
// app.use('/api/v1/notification', )

app.use('/api/v1/user', require('./routes/userRoute'));
app.use("/api/v1/success-stories", require("./routes/successStoryRoutes"));
app.use('/api/v1/interests', require('./routes/sendInterestRoutes'));
app.use("/api/v1/matches", require("./routes/match.routes"));
app.use("/api/v1/dashboardStats", require("./routes/dashboardStatsRoutes"))
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/banners", require("./routes/bannerRoutes"));
app.use("/api/v1/notifications", require("./routes/notificationRoutes"));
app.use("/api/v1/spam", require("../src/routes/spamRoutes"))
app.use("/api/tickets", ticketRoutes);


app.use(globalErrorHandler);
module.exports = app;
