// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log only in development
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err.message);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;
