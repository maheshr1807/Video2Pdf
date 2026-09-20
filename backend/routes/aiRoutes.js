const express = require('express');
const router = express.Router();
const { runAIPipeline } = require('../services/aiService');
const { chunkText } = require('../services/chunkingService');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * POST /api/ai/analyze
 * Body: {
 *   cleanedTranscript: string,
 *   videoTitle: string,
 *   outputLanguage?: string,   // e.g. 'English', 'Tamil', 'Hindi'
 *   options?: {
 *     includeSummary: boolean,
 *     includeKeyPoints: boolean,
 *     includeExamples: boolean,
 *     includeQuiz: boolean,
 *     includeInterviewQuestions: boolean
 *   }
 * }
 * Response: { success, data: <structured document JSON> }
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const {
      cleanedTranscript,
      videoTitle,
      outputLanguage = 'English',
      options = {},
    } = req.body;

    if (!cleanedTranscript || cleanedTranscript.trim().length < 50) {
      throw new AppError(
        'Transcript is too short or empty to process.',
        422,
        'TRANSCRIPT_TOO_SHORT'
      );
    }

    if (!videoTitle) {
      throw new AppError('Video title is required.', 400, 'MISSING_TITLE');
    }

    // Chunk the transcript
    const chunkObjects = chunkText(cleanedTranscript);
    const chunks = chunkObjects.map((c) => c.text);

    // Run AI pipeline
    const documentData = await runAIPipeline({
      cleanedTranscript,
      chunks,
      videoTitle,
      outputLanguage,
      options: {
        includeSummary: options.includeSummary !== false,
        includeKeyPoints: options.includeKeyPoints !== false,
        includeExamples: options.includeExamples !== false,
        includeQuiz: options.includeQuiz !== false,
        includeInterviewQuestions: options.includeInterviewQuestions !== false,
      },
    });

    res.json({
      success: true,
      data: documentData,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
