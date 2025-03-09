// connect to database
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

// import ROUTES
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");

// UTILS
const APIError = require("./util/APIError");

// middleware import
const errorhandler = require("./middlewares/errorhandler")

// create express app
const app = express();

// Apply middlewares
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  handler: (req, res) => {
    console.log('Too many requests, rate limit exceeded');
    res.status(429).json({ message: "Too many requests, please try again later" });
  }
}));

// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error(" MongoDB Connection Failed:", err);
    process.exit(1); // Exit the process with a failure code
  });

// ROUTES
const V1_PREFIX = "/api/v1";
app.use(`${V1_PREFIX}/users`, usersRoutes);
app.use(`${V1_PREFIX}/posts`, postsRoutes);

// handling not found routes
app.use((req, res, next) => {
  console.log(`Route not found: ${req.method} ${req.path}`);
  next(new APIError(`${req.method} ${req.path} is not found`, 404));
});

// Global error handler middleware
app.use(errorhandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
