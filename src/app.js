const express = require("express");
const cors = require("cors");

const helmet = require("helmet");
const morgan = require("morgan");
const globalErrorHandler = require('./middleware/errorMiddleware');




const app = express();


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));



app.get("/test", (req, res) => {
  res.send("Auth Service Running");
});
// app.use('/api/v1/notification', )


app.use(globalErrorHandler);
module.exports = app;
