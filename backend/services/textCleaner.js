const { logger } = require('../utils/logger');

/**
 * Remove timestamp markers like [00:01] or [00:00:01] from transcript lines.
 */
function removeTimestamps(text) {
  return text
    .replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]/g, '')
    .replace(/\(\d{1,2}:\d{2}(?::\d{2})?\)/g, '');
}

/**
 * Remove repeated consecutive words (common in auto-captions):
 * "the the function" → "the function"
 */
function removeRepetitions(text) {
  return text.replace(/\b(\w+)( \1)+\b/gi, '$1');
}

/**
 * Basic transcription noise reduction.
 */
function removeNoise(text) {
  return text
    .replace(/\[Music\]/gi, '')
    .replace(/\[Applause\]/gi, '')
    .replace(/\[Laughter\]/gi, '')
    .replace(/\[inaudible\]/gi, '')
    .replace(/\[crosstalk\]/gi, '')
    .replace(/\s{3,}/g, '  ') // collapse excessive whitespace
    .trim();
}

/**
 * Capitalise first letter of sentences.
 */
function normalizeSentences(text) {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
}

/**
 * Add punctuation heuristically (add period at end of lines without punctuation).
 */
function addBasicPunctuation(text) {
  const lines = text.split('\n');
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return trimmed;
      if (/[.!?,;:]$/.test(trimmed)) return trimmed;
      // Don't add period to lines that look like headings or very short fragments
      if (trimmed.length < 3) return trimmed;
      return trimmed + '.';
    })
    .join('\n');
}

/**
 * Convert transcript items to a single cleaned text block.
 */
function cleanTranscriptItems(items) {
  // Join all text from items
  const rawText = items.map((item) => item.text || '').join(' ');

  let cleaned = rawText;
  cleaned = removeTimestamps(cleaned);
  cleaned = removeNoise(cleaned);
  cleaned = removeRepetitions(cleaned);

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Basic sentence normalization
  cleaned = normalizeSentences(cleaned);

  logger.debug(`Text cleaned: ${rawText.length} chars → ${cleaned.length} chars`);
  return cleaned;
}

/**
 * Convert raw timestamped text (from transcriptItemsToRaw) to cleaned text.
 */
function cleanRawTranscript(rawText) {
  let cleaned = rawText;
  cleaned = removeTimestamps(cleaned);
  cleaned = removeNoise(cleaned);
  cleaned = removeRepetitions(cleaned);
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = normalizeSentences(cleaned);
  return cleaned;
}

module.exports = { cleanTranscriptItems, cleanRawTranscript, removeTimestamps, removeNoise };
