const rateLimit = require("express-rate-limit");

// Auth routes: 5 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { success: false, message: "Too many attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot password: Strict — 3 requests per 15 minutes
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: "Too many password reset attempts. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API routes: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, forgotPasswordLimiter, apiLimiter };
