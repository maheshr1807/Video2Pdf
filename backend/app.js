const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter, aiLimiter } = require('./middleware/rateLimitMiddleware');

// Route imports
const videoRoutes = require('./routes/videoRoutes');
const transcriptRoutes = require('./routes/transcriptRoutes');
const aiRoutes = require('./routes/aiRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// Core middleware
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || false : 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve generated PDFs statically
app.use('/generated', express.static(path.join(__dirname, '..', 'generated')));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/ai/', aiLimiter);

// API Routes
app.use('/api/videos', videoRoutes);
app.use('/api/transcripts', transcriptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Video2PDF AI Backend is running' });
});

app.get('/', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') return next();
  res.json({
    status: 'success',
    message: 'Video2PDF backend is running'
  });
});

// Global error handler
app.use(errorHandler);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

module.exports = app;
