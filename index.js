//connect to database
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");

// import ROUTES
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");

// UTILS
const APIError = require("./util/APIError");

//middleware import
const errorhandler = require("./middlewares/errorhandler")

// create express app
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//connect to mongoDB
mongoose
.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
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
  next(new APIError(`${req.method} ${req.path} is not found`, 404));
});

// Global error handler middleware
app.use(errorhandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
