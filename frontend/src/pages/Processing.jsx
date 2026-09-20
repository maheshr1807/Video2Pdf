import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, FileText, Sparkles } from 'lucide-react';
import ProgressTracker from '../components/ProgressTracker';
import { fetchTranscript } from '../services/videoService';
import { analyzeWithAI, generatePDF } from '../services/pdfService';

const INITIAL_STEPS = [
  { id: 'transcript', label: 'Fetching transcript', detail: 'Retrieving YouTube captions...', status: 'pending' },
  { id: 'clean', label: 'Cleaning & processing text', detail: 'Removing noise, normalizing...', status: 'pending' },
  { id: 'chunk', label: 'Preparing content chunks', detail: 'Splitting for AI processing...', status: 'pending' },
  { id: 'ai', label: 'AI analyzing content', detail: 'Detecting chapters & key points...', status: 'pending' },
  { id: 'questions', label: 'Generating questions', detail: 'Creating interview & quiz...', status: 'pending' },
  { id: 'translate', label: 'Applying language settings', detail: 'Translating content...', status: 'pending' },
  { id: 'pdf', label: 'Building PDF document', detail: 'Rendering cover, chapters, TOC...', status: 'pending' },
  { id: 'done', label: 'Finalizing & saving', detail: 'Almost done!', status: 'pending' },
];

function setStepStatus(steps, id, status) {
  return steps.map((s) => (s.id === id ? { ...s, status } : s));
}

export default function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { metadata, language, options } = location.state || {};
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [error, setError] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (!metadata) {
      navigate('/', { replace: true });
      return;
    }

    if (started.current) return;
    started.current = true;

    runPipeline();
  }, []);

  const updateStep = (id, status) => {
    setSteps((prev) => setStepStatus(prev, id, status));
  };

  const runPipeline = async () => {
    try {
      // Step 1: Fetch transcript
      updateStep('transcript', 'active');
      const transcriptData = await fetchTranscript(metadata.videoId, 'en');
      updateStep('transcript', 'completed');

      // Step 2: Text is cleaned on the backend, mark done
      updateStep('clean', 'active');
      await new Promise((r) => setTimeout(r, 600));
      updateStep('clean', 'completed');

      // Step 3: Chunking (done server-side in AI route, show step)
      updateStep('chunk', 'active');
      await new Promise((r) => setTimeout(r, 400));
      updateStep('chunk', 'completed');

      // Step 4 & 5 & 6: AI analysis (all done in one API call)
      updateStep('ai', 'active');
      const documentData = await analyzeWithAI({
        cleanedTranscript: transcriptData.cleaned,
        videoTitle: metadata.title,
        outputLanguage: language,
        options,
      });
      updateStep('ai', 'completed');
      updateStep('questions', 'completed');
      updateStep('translate', 'completed');

      // Step 7: Generate PDF
      updateStep('pdf', 'active');
      const pdfResult = await generatePDF({
        documentData,
        metadata: {
          videoId: metadata.videoId,
          title: metadata.title,
          channel: metadata.channel,
          url: metadata.url,
        },
        options,
      });
      updateStep('pdf', 'completed');

      // Step 8: Done
      updateStep('done', 'active');
      await new Promise((r) => setTimeout(r, 500));
      updateStep('done', 'completed');

      // Navigate to result
      setTimeout(() => {
        navigate('/result', {
          state: {
            metadata,
            pdfResult,
            documentData,
            language,
          },
        });
      }, 800);
    } catch (err) {
      const failedStep = steps.find((s) => s.status === 'active');
      if (failedStep) updateStep(failedStep.id, 'error');
      setError(err.message || 'An unexpected error occurred during processing.');
    }
  };

  return (
    <div className="min-h-screen bg-dots flex flex-col items-center justify-center px-4 py-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-900/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* Animated brain icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 animate-pulse-slow opacity-30 blur-xl" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-glow">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {error ? 'Processing Failed' : 'Generating Your PDF'}
          </h1>
          <p className="text-white/40 text-sm">
            {error
              ? 'Something went wrong. Please try again.'
              : `Creating ${language} study notes from "${metadata?.title?.substring(0, 40)}..."`}
          </p>
        </motion.div>

        {/* Progress tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressTracker steps={steps} error={error} />
        </motion.div>

        {/* Tips while waiting */}
        {!error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 p-4 glass-card text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-semibold text-primary-300">Did you know?</span>
            </div>
            <p className="text-xs text-white/40">
              Your PDF will include a table of contents, styled chapters, code blocks, 
              key points, and practice questions — all formatted professionally.
            </p>
          </motion.div>
        )}

        {/* Retry button on error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex flex-col gap-3"
          >
            <button
              onClick={() => navigate('/generate', { state: { metadata } })}
              className="btn-primary w-full py-3"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary w-full py-3"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
