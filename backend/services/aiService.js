const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { logger } = require('../utils/logger');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

function getModel() {
  return genAI.getGenerativeModel({ model: config.geminiModel });
}

/**
 * Wrapper for generateContent with exponential backoff to handle 503/429 errors.
 */
async function generateContentWithRetry(model, prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      if ((err.status === 503 || err.status === 429 || err.message.includes('503') || err.message.includes('429')) && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 2000;
        logger.warn(`AI API error (${err.status || 'rate limit/503'}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}

/**
 * Helper: parse JSON from AI response (handles markdown code fences).
 */
function parseJsonResponse(text) {
  let clean = text.trim();
  // Remove ```json ... ``` or ``` ... ``` fences
  clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(clean);
  } catch {
    // Attempt to extract JSON object/array from response
    const jsonMatch = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error(`Failed to parse AI JSON response: ${clean.substring(0, 200)}`);
  }
}

/**
 * Prompt 1: Detect major chapters/topics from the full transcript.
 * Returns { chapters: [{ title, description }] }
 */
async function detectChapters(cleanedTranscript, videoTitle) {
  const model = getModel();
  const prompt = `You are an expert educational content analyzer.

Analyze the following YouTube tutorial transcript and identify the major chapters or topics covered.

Video Title: "${videoTitle}"

Transcript:
${cleanedTranscript.substring(0, 8000)}

Return ONLY valid JSON in this exact format:
{
  "chapters": [
    {
      "title": "Chapter title here",
      "description": "One sentence description of what this chapter covers"
    }
  ]
}

Rules:
- Identify 4-10 main chapters/topics
- Chapter titles should be clear and educational
- Do not include timestamps or chapter numbers in titles
- Return ONLY the JSON, no other text`;

  logger.info('Detecting chapters...');
  const result = await generateContentWithRetry(model, prompt);
  const text = result.response.text();
  return parseJsonResponse(text);
}

/**
 * Prompt 2: Summarize a chunk and extract structured educational content.
 * Returns { summary, keyPoints, examples }
 */
async function analyzeChunk(chunkText, chapterTitle, outputLanguage) {
  const model = getModel();
  const langInstruction =
    outputLanguage && outputLanguage !== 'en'
      ? `Write the summary, keyPoints, and explanation in ${outputLanguage}. Preserve all code, commands, file paths, and technical syntax in English.`
      : 'Write in English.';

  const prompt = `You are an expert educational content creator.

Analyze this portion of a tutorial transcript about "${chapterTitle}" and extract structured learning material.

${langInstruction}

Transcript chunk:
${chunkText}

Return ONLY valid JSON in this exact format:
{
  "summary": "Clear 2-4 sentence summary of the main content",
  "keyPoints": [
    "Key point 1",
    "Key point 2",
    "Key point 3"
  ],
  "examples": [
    {
      "explanation": "What this example demonstrates",
      "language": "programming language (e.g., python, javascript, java) or 'text'",
      "code": "The actual code or command example, or empty string if none"
    }
  ]
}

Rules:
- keyPoints should be 3-7 concise, actionable points
- For examples, only include if there are actual code examples or commands mentioned
- Code must be exactly as mentioned in the transcript — do not invent code
- Return ONLY the JSON`;

  const result = await generateContentWithRetry(model, prompt);
  const text = result.response.text();
  return parseJsonResponse(text);
}

/**
 * Prompt 3: Generate interview questions and MCQs from the structured content.
 * Returns { interviewQuestions, mcqs }
 */
async function generateQuestions(documentStructure, outputLanguage) {
  const model = getModel();
  const langInstruction =
    outputLanguage && outputLanguage !== 'en'
      ? `Write questions and answers in ${outputLanguage}. Preserve technical terms and code in English.`
      : 'Write in English.';

  // Build a condensed summary for the prompt
  const summaryText = documentStructure.chapters
    .map((ch) => `${ch.title}: ${ch.summary}`)
    .join('\n');

  const prompt = `You are an expert educational content creator.

Based on this tutorial content, generate study questions.

${langInstruction}

Tutorial: "${documentStructure.title}"
Topics covered:
${summaryText}

Return ONLY valid JSON in this exact format:
{
  "interviewQuestions": [
    {
      "question": "Interview question here",
      "answer": "Detailed answer here"
    }
  ],
  "mcqs": [
    {
      "question": "MCQ question here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Rules:
- Generate 5-8 interview questions with detailed answers
- Generate 5-8 MCQs with 4 options each
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- Questions should test understanding, not just memorization
- Return ONLY the JSON`;

  logger.info('Generating questions...');
  const result = await generateContentWithRetry(model, prompt);
  const text = result.response.text();
  return parseJsonResponse(text);
}

/**
 * Prompt 4: Generate a comprehensive introduction section.
 */
async function generateIntroduction(videoTitle, chapters, outputLanguage) {
  const model = getModel();
  const langInstruction =
    outputLanguage && outputLanguage !== 'en'
      ? `Write in ${outputLanguage}.`
      : 'Write in English.';

  const chapterList = chapters.map((ch) => `- ${ch.title}`).join('\n');

  const prompt = `You are writing the introduction for an educational PDF document.

${langInstruction}

Video: "${videoTitle}"
Topics covered:
${chapterList}

Write a professional introduction paragraph (3-5 sentences) that:
1. Describes what this tutorial covers
2. Who this material is suitable for
3. What the reader will learn

Return ONLY the introduction text, no JSON, no headers, no extra formatting.`;

  const result = await generateContentWithRetry(model, prompt);
  return result.response.text().trim();
}

/**
 * Main pipeline: orchestrate all AI processing.
 * @param {Object} params
 * @param {string} params.cleanedTranscript
 * @param {string[]} params.chunks
 * @param {string} params.videoTitle
 * @param {string} params.outputLanguage - ISO language name (e.g., 'Tamil', 'Hindi', 'English')
 * @param {Object} params.options - { includeSummary, includeKeyPoints, includeExamples, includeQuiz, includeInterviewQuestions }
 */
async function runAIPipeline({ cleanedTranscript, chunks, videoTitle, outputLanguage, options }) {
  logger.info(`Starting AI pipeline for: ${videoTitle} → ${outputLanguage}`);

  // Step 1: Detect chapters from the full transcript
  const chaptersData = await detectChapters(cleanedTranscript, videoTitle);
  const chapterTitles = chaptersData.chapters || [];

  logger.info(`Detected ${chapterTitles.length} chapters`);

  // Step 2: Analyze each chunk and assign to chapters
  const chapterResults = [];

  // Distribute chunks across chapters
  const chunksPerChapter = Math.max(1, Math.ceil(chunks.length / Math.max(chapterTitles.length, 1)));

  for (let i = 0; i < chapterTitles.length; i++) {
    const chapter = chapterTitles[i];
    const startChunk = i * chunksPerChapter;
    const endChunk = Math.min(startChunk + chunksPerChapter, chunks.length);

    const relevantChunks = chunks.slice(startChunk, endChunk);
    const chunkText = relevantChunks.join('\n\n');

    if (!chunkText.trim()) {
      // Use full transcript portion for this chapter
      const portion = cleanedTranscript.substring(
        Math.floor((i / chapterTitles.length) * cleanedTranscript.length),
        Math.floor(((i + 1) / chapterTitles.length) * cleanedTranscript.length)
      );
      if (!portion.trim()) continue;
    }

    logger.info(`Analyzing chapter ${i + 1}/${chapterTitles.length}: ${chapter.title}`);

    try {
      const textToAnalyze = chunkText.trim() || cleanedTranscript.substring(
        Math.floor((i / chapterTitles.length) * cleanedTranscript.length),
        Math.floor(((i + 1) / chapterTitles.length) * cleanedTranscript.length)
      );

      const analysis = await analyzeChunk(
        textToAnalyze.substring(0, 4000),
        chapter.title,
        outputLanguage
      );

      chapterResults.push({
        title: chapter.title,
        description: chapter.description,
        summary: analysis.summary || '',
        keyPoints: analysis.keyPoints || [],
        examples: analysis.examples || [],
      });
    } catch (err) {
      logger.warn(`Failed to analyze chapter "${chapter.title}": ${err.message}`);
      // Include chapter with minimal content to avoid total failure
      chapterResults.push({
        title: chapter.title,
        description: chapter.description,
        summary: chapter.description || 'Content from this section.',
        keyPoints: [],
        examples: [],
      });
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Step 3: Generate introduction
  const introduction = await generateIntroduction(videoTitle, chapterTitles, outputLanguage);

  // Step 4: Build intermediate document structure
  const documentStructure = {
    title: videoTitle,
    language: outputLanguage,
    introduction,
    chapters: chapterResults,
  };

  // Step 5: Generate questions (if requested)
  let questionsData = { interviewQuestions: [], mcqs: [] };
  if (options.includeQuiz || options.includeInterviewQuestions) {
    try {
      questionsData = await generateQuestions(documentStructure, outputLanguage);
    } catch (err) {
      logger.warn(`Question generation failed: ${err.message}`);
    }
  }

  // Step 6: Build final structured JSON
  const finalDocument = {
    title: videoTitle,
    language: outputLanguage,
    generatedAt: new Date().toISOString(),
    introduction,
    chapters: chapterResults,
    interviewQuestions: options.includeInterviewQuestions ? questionsData.interviewQuestions : [],
    mcqs: options.includeQuiz ? questionsData.mcqs : [],
  };

  logger.info('AI pipeline completed successfully');
  return finalDocument;
}

module.exports = { runAIPipeline, detectChapters, analyzeChunk, generateQuestions };
