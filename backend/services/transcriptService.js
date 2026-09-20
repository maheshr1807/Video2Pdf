const { YoutubeTranscript } = require('youtube-transcript');
const { logger } = require('../utils/logger');

/**
 * Fetch the transcript/captions for a YouTube video.
 * Returns an array of { text, duration, offset } objects.
 */
async function fetchTranscript(videoId, preferredLang = 'en') {
  try {
    logger.info(`Fetching transcript for video: ${videoId}`);

    // Try preferred language first, then fall back to any available
    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: preferredLang,
      });
    } catch {
      logger.warn(`No transcript in ${preferredLang}, trying auto-detection...`);
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    }

    if (!transcriptItems || transcriptItems.length === 0) {
      throw Object.assign(new Error('No transcript content found for this video.'), {
        statusCode: 422,
        code: 'EMPTY_TRANSCRIPT',
      });
    }

    logger.info(`Transcript fetched: ${transcriptItems.length} segments`);
    return transcriptItems;
  } catch (err) {
    if (err.statusCode) throw err;

    const message = err.message || '';
    if (
      message.includes('Could not get') ||
      message.includes('disabled') ||
      message.includes('no transcript')
    ) {
      throw Object.assign(
        new Error(
          'No accessible transcript is available for this video. ' +
            'The video may have captions disabled or restricted.'
        ),
        { statusCode: 422, code: 'TRANSCRIPT_UNAVAILABLE' }
      );
    }

    throw Object.assign(new Error(`Transcript fetch failed: ${message}`), {
      statusCode: 502,
      code: 'TRANSCRIPT_FETCH_ERROR',
    });
  }
}

/**
 * Convert transcript items array to a raw text string with timestamps.
 */
function transcriptItemsToRaw(items) {
  return items
    .map((item) => {
      const seconds = Math.floor((item.offset || 0) / 1000);
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `[${m}:${s}] ${item.text}`;
    })
    .join('\n');
}

/**
 * Detect the primary language from transcript items (basic heuristic).
 */
function detectLanguage(items) {
  // youtube-transcript sometimes provides language info
  if (items[0] && items[0].lang) return items[0].lang;
  return 'en'; // Default assumption
}

module.exports = { fetchTranscript, transcriptItemsToRaw, detectLanguage };
