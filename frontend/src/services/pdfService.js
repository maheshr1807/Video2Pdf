import api from './api';

export const analyzeWithAI = async ({ cleanedTranscript, videoTitle, outputLanguage, options }) => {
  const response = await api.post('/ai/analyze', {
    cleanedTranscript,
    videoTitle,
    outputLanguage,
    options,
  });
  return response.data.data;
};

export const generatePDF = async ({ documentData, metadata, options }) => {
  const response = await api.post('/pdf/generate', { documentData, metadata, options });
  return response.data.data;
};

export const downloadPDF = (pdfId, filename) => {
  const url = `/api/pdf/${pdfId}/download?filename=${encodeURIComponent(filename)}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
