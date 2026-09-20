const express = require('express');
const router = express.Router();
const { isValidYouTubeUrl, extractVideoId } = require('../utils/validators');
const { getVideoMetadata } = require('../services/youtubeService');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * POST /api/videos/analyze
 * Body: { url: string }
 * Response: { success, data: { videoId, title, channel, thumbnail, url } }
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      throw new AppError('YouTube URL is required.', 400, 'MISSING_URL');
    }

    if (!isValidYouTubeUrl(url)) {
      throw new AppError(
        'Invalid YouTube URL. Please provide a valid YouTube video link.',
        400,
        'INVALID_URL'
      );
    }

    const metadata = await getVideoMetadata(url);

    res.json({
      success: true,
      data: metadata,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/videos/:videoId
 * Returns cached metadata for a video (simple pass-through for MVP)
 */
router.get('/:videoId', async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const metadata = await getVideoMetadata(`https://www.youtube.com/watch?v=${videoId}`);
    res.json({ success: true, data: metadata });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
