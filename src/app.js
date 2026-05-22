const express = require("express");
const cors = require("cors");
const path = require("path");

const helmet = require("helmet");
const morgan = require("morgan");
const globalErrorHandler = require('./middlewares/errorMiddleware');



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json());
app.use(cors());
app.use(helmet());
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

app.use(globalErrorHandler);
module.exports = app;
