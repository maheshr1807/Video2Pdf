const express = require('express');
const router = express.Router();
const { fetchTranscript, transcriptItemsToRaw, detectLanguage } = require('../services/transcriptService');
const { cleanTranscriptItems } = require('../services/textCleaner');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * POST /api/transcripts/extract
 * Body: { videoId: string, preferredLang?: string }
 * Response: { success, data: { raw, cleaned, language, segmentCount } }
 */
router.post('/extract', async (req, res, next) => {
  try {
    const { videoId, preferredLang = 'en' } = req.body;

    if (!videoId) {
      throw new AppError('Video ID is required.', 400, 'MISSING_VIDEO_ID');
    }

    // Fetch transcript
    const transcriptItems = await fetchTranscript(videoId, preferredLang);

    // Detect language
    const detectedLang = detectLanguage(transcriptItems);

    // Convert to raw text (with timestamps for reference)
    const raw = transcriptItemsToRaw(transcriptItems);

    // Clean the transcript
    const cleaned = cleanTranscriptItems(transcriptItems);

    res.json({
      success: true,
      data: {
        raw,
        cleaned,
        language: detectedLang,
        segmentCount: transcriptItems.length,
        wordCount: cleaned.split(/\s+/).length,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/transcripts/:videoId
 * Quick transcript fetch (GET convenience endpoint)
 */
router.get('/:videoId', async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const transcriptItems = await fetchTranscript(videoId);
    const cleaned = cleanTranscriptItems(transcriptItems);
    const detectedLang = detectLanguage(transcriptItems);

    res.json({
      success: true,
      data: {
        cleaned,
        language: detectedLang,
        segmentCount: transcriptItems.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
