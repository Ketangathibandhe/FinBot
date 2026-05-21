// Validates that all required environment variables are set before server starts
const validateEnv = () => {
  const requiredVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "TELEGRAM_BOT_TOKEN",
    "GEMINI_API_KEY",
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error(` Missing required environment variables: ${missing.join(", ")}`);
    console.error("Please create a .env file with these variables. See .env.example for reference.");
    process.exit(1);
  }
};

module.exports = { validateEnv };
