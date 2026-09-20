import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Globe, Download, Zap, ArrowRight, Play } from 'lucide-react';
import UrlInput from '../components/UrlInput';
import VideoPreview from '../components/VideoPreview';

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Gemini AI extracts chapters, summaries & key insights' },
  { icon: Globe, title: 'Multilingual', desc: 'Output in English, Tamil, Hindi, Arabic & 15+ languages' },
  { icon: BookOpen, title: 'Structured Notes', desc: 'Chapters, key points, examples & practice questions' },
  { icon: Download, title: 'Instant PDF', desc: 'Professional PDF ready for download in minutes' },
];

const STATS = [
  { value: '15+', label: 'Languages' },
  { value: 'AI', label: 'Powered' },
  { value: 'PDF', label: 'Output' },
];

export default function Home() {
  const navigate = useNavigate();
  const [videoMetadata, setVideoMetadata] = useState(null);

  const handleVideoAnalyzed = (metadata) => {
    setVideoMetadata(metadata);
  };

  const handleProceed = () => {
    if (videoMetadata) {
      navigate('/generate', { state: { metadata: videoMetadata } });
    }
  };

  return (
    <div className="min-h-screen bg-dots flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-900/20 blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="badge-primary text-sm px-4 py-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Learning Tool
          </span>
        </motion.div>

        {/* Hero title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 text-shadow"
        >
          Turn YouTube
          <br />
          <span className="gradient-text">Tutorials Into</span>
          <br />
          Study PDFs
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-lg text-white/50 max-w-xl mb-4"
        >
          Paste any YouTube tutorial URL. Our AI extracts the transcript, identifies chapters, 
          generates key points, code examples, and creates a professional structured PDF — in any language.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6 mb-10"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-white/40 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* URL Input */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl"
        >
          <UrlInput onVideoAnalyzed={handleVideoAnalyzed} />
        </motion.div>

        {/* Video Preview */}
        <AnimatePresence>
          {videoMetadata && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="w-full max-w-2xl mt-5 space-y-4"
            >
              <VideoPreview metadata={videoMetadata} />

              {/* Proceed button */}
              <motion.button
                id="proceed-generate-btn"
                onClick={handleProceed}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-4 text-base"
              >
                <Zap className="w-5 h-5" />
                Configure & Generate PDF
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-5 text-center cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-600/20 border border-primary-500/20 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-20 w-full max-w-3xl text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-white/40 text-sm mb-10">Three simple steps to your study PDF</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { step: '01', title: 'Paste URL', desc: 'Drop any YouTube tutorial link' },
              { step: '02', title: 'AI Processes', desc: 'Transcript → Chapters → Notes' },
              { step: '03', title: 'Download PDF', desc: 'Professional study document ready' },
            ].map(({ step, title, desc }, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl glass-card border border-primary-500/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-black gradient-text">{step}</span>
                  </div>
                  <h4 className="font-semibold text-white text-sm">{title}</h4>
                  <p className="text-xs text-white/40 mt-1">{desc}</p>
                </div>
                {i < 2 && (
                  <ArrowRight className="w-5 h-5 text-white/20 hidden sm:block flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
