require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-flash-latest',
  maxVideoLength: parseInt(process.env.MAX_VIDEO_LENGTH_MINUTES || '90') * 60, // seconds
  pdfOutputDir: process.env.PDF_OUTPUT_DIR || '../generated/pdfs',
};

// Validate required env vars
const requiredVars = ['GEMINI_API_KEY'];
const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please copy .env.example to .env and fill in the values.');
  process.exit(1);
}

module.exports = config;
