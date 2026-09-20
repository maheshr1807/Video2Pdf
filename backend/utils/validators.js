/**
 * Validates a YouTube URL and extracts the video ID.
 * Supports formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://youtube.com/watch?v=VIDEO_ID&...
 *   - https://m.youtube.com/watch?v=VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 */
function extractVideoId(url) {
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

function isValidYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return extractVideoId(trimmed) !== null;
}

function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
}

module.exports = { extractVideoId, isValidYouTubeUrl, sanitizeText };
