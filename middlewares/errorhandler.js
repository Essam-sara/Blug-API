const APIError = require("../util/APIError"); // تأكد من إضافة هذه السطر

const errorhandler =(err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof APIError) {
    return res
      .status(err.statusCode)
      .json({ status: "failure", message: err.message });
  }
  res.status(500).json({ status: "failure", message: "Internal Server Error" });
};

module.exports = errorhandler;
