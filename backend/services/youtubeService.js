const axios = require('axios');
const { extractVideoId } = require('../utils/validators');
const { logger } = require('../utils/logger');

/**
 * Formats ISO 8601 duration (e.g. PT1H2M3S) to seconds
 */
function parseDuration(isoDuration) {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Get YouTube video metadata via the oEmbed API + infer basics
 * We use oEmbed (no API key needed) + youtube-transcript for language info
 */
async function getVideoMetadata(url) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw Object.assign(new Error('Invalid YouTube URL'), { statusCode: 400, code: 'INVALID_URL' });
  }

  try {
    // Use oEmbed for basic metadata (no API key required)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await axios.get(oembedUrl, { timeout: 10000 });
    const oembed = oembedResponse.data;

    const metadata = {
      videoId,
      title: oembed.title || 'Unknown Title',
      channel: oembed.author_name || 'Unknown Channel',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailFallback: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    };

    logger.info(`Video metadata fetched: ${metadata.title}`);
    return metadata;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw Object.assign(new Error('Video not found or is private/unavailable.'), {
        statusCode: 404,
        code: 'VIDEO_NOT_FOUND',
      });
    }
    throw Object.assign(
      new Error('Failed to fetch video metadata. The video may be unavailable.'),
      { statusCode: 502, code: 'METADATA_FETCH_ERROR' }
    );
  }
}

module.exports = { getVideoMetadata, extractVideoId };
