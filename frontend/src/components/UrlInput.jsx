import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Search, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { analyzeVideo } from '../services/videoService';

const isValidYouTubeUrl = (url) => {
  return /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/.test(url);
};

export default function UrlInput({ onVideoAnalyzed }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const isValid = url.trim() && isValidYouTubeUrl(url.trim());

  const handleAnalyze = async () => {
    if (!isValid || loading) return;
    setError('');
    setLoading(true);

    try {
      const metadata = await analyzeVideo(url.trim());
      onVideoAnalyzed(metadata, url.trim());
    } catch (err) {
      setError(err.message || 'Failed to analyze video. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const clearUrl = () => {
    setUrl('');
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input container */}
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 2px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.15)'
            : '0 0 0 1px rgba(255,255,255,0.1)',
        }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center bg-white/8 rounded-2xl overflow-hidden border border-white/10"
      >
        {/* Icon */}
        <div className="pl-4 pr-2 flex-shrink-0">
          <Link2 className="w-5 h-5 text-primary-400" />
        </div>

        {/* Input */}
        <input
          id="youtube-url-input"
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(''); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Paste YouTube URL here... (e.g. https://youtube.com/watch?v=...)"
          className="flex-1 py-4 px-2 bg-transparent text-white placeholder-white/40 text-sm font-medium focus:outline-none"
          disabled={loading}
          aria-label="YouTube video URL"
          autoComplete="off"
        />

        {/* Clear button */}
        <AnimatePresence>
          {url && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearUrl}
              className="p-2 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Clear URL"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Analyze button */}
        <button
          id="analyze-btn"
          onClick={handleAnalyze}
          disabled={!isValid || loading}
          className="m-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center gap-2
                     bg-gradient-to-r from-primary-600 to-accent-600
                     hover:from-primary-500 hover:to-accent-500
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-all duration-200
                     shadow-glow hover:shadow-glow-lg"
          aria-label="Analyze YouTube video"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Analyze
            </>
          )}
        </button>
      </motion.div>

      {/* Validation hint */}
      <AnimatePresence>
        {url && !isValid && !loading && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2 text-xs text-amber-400/80 flex items-center gap-1.5 pl-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Please enter a valid YouTube URL
          </motion.p>
        )}

        {isValid && !loading && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2 text-xs text-emerald-400/80 flex items-center gap-1.5 pl-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid YouTube URL detected
          </motion.p>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample URLs */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-xs text-white/30">Try:</span>
        {[
          { label: 'Short Tutorial', url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk' },
        ].map((sample) => (
          <button
            key={sample.label}
            onClick={() => { setUrl(sample.url); setError(''); }}
            className="text-xs text-primary-400 hover:text-primary-300 underline decoration-dotted transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
