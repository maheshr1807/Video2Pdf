const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { generatePDF } = require('../services/pdfService');
const { AppError } = require('../middleware/errorMiddleware');
const { logger } = require('../utils/logger');

const PDF_DIR = path.join(__dirname, '..', '..', 'generated', 'pdfs');

// Ensure PDF directory exists
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

/**
 * POST /api/pdf/generate
 * Body: {
 *   documentData: <structured JSON from AI pipeline>,
 *   metadata: { videoId, title, channel, url },
 *   options: { includeSummary, includeKeyPoints, includeExamples, includeQuiz, includeInterviewQuestions }
 * }
 * Response: { success, data: { pdfId, pdfUrl, filename, pageEstimate } }
 */
router.post('/generate', async (req, res, next) => {
  try {
    const { documentData, metadata, options = {} } = req.body;

    if (!documentData || !documentData.title) {
      throw new AppError('Document data is required.', 400, 'MISSING_DOCUMENT_DATA');
    }

    if (!documentData.chapters || documentData.chapters.length === 0) {
      throw new AppError('No chapters found in document data.', 422, 'NO_CHAPTERS');
    }

    // Generate unique ID for this PDF
    const pdfId = uuidv4();
    const safeTitle = (documentData.title || 'document')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 40)
      .toLowerCase();
    const filename = `${safeTitle}-${pdfId.substring(0, 8)}.pdf`;
    const outputPath = path.join(PDF_DIR, filename);

    logger.info(`Generating PDF: ${filename}`);

    await generatePDF(
      documentData,
      metadata || {},
      {
        includeSummary: options.includeSummary !== false,
        includeKeyPoints: options.includeKeyPoints !== false,
        includeExamples: options.includeExamples !== false,
        includeQuiz: options.includeQuiz !== false,
        includeInterviewQuestions: options.includeInterviewQuestions !== false,
      },
      outputPath
    );

    // Get file stats
    const stats = fs.statSync(outputPath);
    const fileSizeKB = Math.round(stats.size / 1024);

    // Estimate page count (rough: cover + TOC + intro + chapters + questions)
    const pageEstimate = 3 + documentData.chapters.length +
      (options.includeInterviewQuestions && documentData.interviewQuestions?.length > 0 ? 1 : 0) +
      (options.includeQuiz && documentData.mcqs?.length > 0 ? 1 : 0) + 1;

    res.json({
      success: true,
      data: {
        pdfId,
        filename,
        pdfUrl: `/generated/pdfs/${filename}`,
        downloadUrl: `/api/pdf/${pdfId}/download?filename=${filename}`,
        fileSizeKB,
        pageEstimate,
        chapterCount: documentData.chapters.length,
        title: documentData.title,
        language: documentData.language,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/pdf/:id/download
 * Query: { filename: string }
 */
router.get('/:id/download', (req, res, next) => {
  try {
    const { filename } = req.query;
    if (!filename) {
      throw new AppError('Filename is required.', 400, 'MISSING_FILENAME');
    }

    // Security: ensure filename doesn't traverse directories
    const safeFilename = path.basename(filename);
    const filePath = path.join(PDF_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      throw new AppError('PDF not found. It may have been cleaned up.', 404, 'PDF_NOT_FOUND');
    }

    res.download(filePath, safeFilename, (err) => {
      if (err) {
        logger.error(`Download error: ${err.message}`);
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/pdf/:id
 * Query: { filename: string }
 */
router.delete('/:id', (req, res, next) => {
  try {
    const { filename } = req.query;
    if (!filename) throw new AppError('Filename required.', 400, 'MISSING_FILENAME');

    const safeFilename = path.basename(filename);
    const filePath = path.join(PDF_DIR, safeFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'PDF deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
