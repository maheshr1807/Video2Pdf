import api from './api';

export const analyzeVideo = async (url) => {
  const response = await api.post('/videos/analyze', { url });
  return response.data.data;
};

export const fetchTranscript = async (videoId, preferredLang = 'en') => {
  const response = await api.post('/transcripts/extract', { videoId, preferredLang });
  return response.data.data;
};
