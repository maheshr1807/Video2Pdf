require('dotenv').config();
const app = require('./app');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 5000; // Restart triggered

app.listen(PORT, () => {
  logger.info(`🚀 Video2PDF AI Backend running on port ${PORT}`);
  logger.info(`📄 Environment: ${process.env.NODE_ENV || 'development'}`);
});
