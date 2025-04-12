const fs = require("fs");
const path = require("path");

const errorHandler = (err, req, res, next) => {
  const logFilePath = path.join(__dirname, "../../logs/error.log");
  const logMessage = `${new Date().toISOString()} - ${req.method} ${
    req.url
  } - ${err.message} - ${err.stack}\n`;
  fs.appendFile(logFilePath, logMessage, (fsErr) => {
    if (fsErr) {
      console.error("Failed to write to log file:", fsErr);
    }
  });

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });

  next();
};

module.exports = errorHandler;
