const express = require("express");
const cors = require("cors");
const path = require("path");

const helmet = require("helmet");
const morgan = require("morgan");
const globalErrorHandler = require('./middlewares/errorMiddleware');
const cookieParser = require("cookie-parser");



const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());


app.get("/test", (req, res) => {
  res.send("Auth Service Running");
});
// app.use('/api/v1/notification', )

app.use('/api/v1/user', require('./routes/userRoutes'));
app.use("/api/v1/success-stories", require("./routes/successStoryRoutes"));
app.use('/api/v1/interests', require('./routes/sendInterestRoutes'));
app.use("/api/v1/matches", require("./routes/match.routes"));
app.use("/api/v1/dashboardStats", require("./routes/dashboardStatsRoutes"))
app.use("/api/v1/admin", require("./routes/adminRoutes"))
app.use("/api/v1/tickets", require("./routes/ticketRoutes"))

app.use(globalErrorHandler);
module.exports = app;
