const { logger } = require('../utils/logger');

// Approximate tokens: 1 token ≈ 4 characters
const CHARS_PER_TOKEN = 4;
const DEFAULT_CHUNK_SIZE_TOKENS = 2500;
const DEFAULT_OVERLAP_TOKENS = 200;

/**
 * Split a long text into overlapping chunks.
 * @param {string} text - The cleaned transcript text
 * @param {number} chunkSizeTokens - Target tokens per chunk
 * @param {number} overlapTokens - Overlap tokens between chunks
 * @returns {Array<{ index: number, text: string, charStart: number, charEnd: number }>}
 */
function chunkText(
  text,
  chunkSizeTokens = DEFAULT_CHUNK_SIZE_TOKENS,
  overlapTokens = DEFAULT_OVERLAP_TOKENS
) {
  const chunkSizeChars = chunkSizeTokens * CHARS_PER_TOKEN;
  const overlapChars = overlapTokens * CHARS_PER_TOKEN;

  if (text.length <= chunkSizeChars) {
    logger.info(`Text fits in single chunk (${text.length} chars)`);
    return [{ index: 0, text, charStart: 0, charEnd: text.length }];
  }

  const chunks = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSizeChars, text.length);

    // Try to break at a sentence boundary (period + space)
    if (end < text.length) {
      const searchZone = text.substring(end - 200, end);
      const lastPeriod = searchZone.lastIndexOf('. ');
      if (lastPeriod !== -1) {
        end = end - 200 + lastPeriod + 2; // include the period
      }
    }

    const chunkText = text.substring(start, end).trim();
    if (chunkText.length > 0) {
      chunks.push({ index, text: chunkText, charStart: start, charEnd: end });
      index++;
    }

    start = Math.max(start + 1, end - overlapChars);
  }

  logger.info(`Text split into ${chunks.length} chunks`);
  return chunks;
}

/**
 * Split transcript items into chunks, preserving time context.
 * Used as an alternative when processing with timestamps.
 */
function chunkTranscriptItems(items, maxItems = 150) {
  const chunks = [];
  for (let i = 0; i < items.length; i += maxItems) {
    const slice = items.slice(i, Math.min(i + maxItems, items.length));
    chunks.push({
      index: chunks.length,
      items: slice,
      text: slice.map((item) => item.text).join(' '),
      startOffset: slice[0]?.offset || 0,
      endOffset: slice[slice.length - 1]?.offset || 0,
    });
  }
  return chunks;
}

module.exports = { chunkText, chunkTranscriptItems };
