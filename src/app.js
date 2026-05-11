const express = require("express");
const cors = require("cors");

const helmet = require("helmet");
const morgan = require("morgan");
const globalErrorHandler = require('./middlewares/errorMiddleware');



const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) 


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));



app.get("/test", (req, res) => {
  res.send("Auth Service Running");
});
// app.use('/api/v1/notification', )

app.use('/api/v1/user', require('./routes/userRoute'));


app.use(globalErrorHandler);
module.exports = app;
