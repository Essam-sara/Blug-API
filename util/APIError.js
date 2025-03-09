class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static handleMongooseError(err, req, res, next) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Validation Error", details: err.message });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID Format" });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate Key Error", details: err.message });
    }
    next(err);
  }
}

module.exports = APIError;
