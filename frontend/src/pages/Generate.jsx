import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Settings2 } from 'lucide-react';
import VideoPreview from '../components/VideoPreview';
import LanguageSelector from '../components/LanguageSelector';
import PdfOptions from '../components/PdfOptions';
import toast from 'react-hot-toast';

export default function Generate() {
  const location = useLocation();
  const navigate = useNavigate();
  const metadata = location.state?.metadata;

  const [language, setLanguage] = useState('English');
  const [options, setOptions] = useState({
    includeSummary: true,
    includeKeyPoints: true,
    includeExamples: true,
    includeInterviewQuestions: true,
    includeQuiz: true,
  });

  useEffect(() => {
    if (!metadata) {
      navigate('/', { replace: true });
    }
  }, [metadata, navigate]);

  const handleGenerate = () => {
    const anySelected = Object.values(options).some(Boolean);
    if (!anySelected) {
      toast.error('Please select at least one PDF content option.');
      return;
    }
    navigate('/processing', {
      state: { metadata, language, options },
    });
  };

  if (!metadata) return null;

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary-600/8 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent-600/8 blur-3xl" />
      </div>

      <div className="relative flex-1 max-w-3xl mx-auto w-full px-4 pt-28 pb-16">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </motion.button>

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-glow">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Configure PDF</h1>
          </div>
          <p className="text-white/40 text-sm pl-12">
            Set your preferences and generate a personalized study PDF.
          </p>
        </motion.div>

        {/* Video card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <VideoPreview metadata={metadata} />
        </motion.div>

        {/* Settings card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 space-y-6"
        >
          {/* Language selector */}
          <LanguageSelector value={language} onChange={setLanguage} />

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* PDF Options */}
          <PdfOptions options={options} onChange={setOptions} />
        </motion.div>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 rounded-xl bg-primary-500/8 border border-primary-500/15 text-xs text-primary-300/70"
        >
          <strong className="text-primary-300">⏱ Processing Time:</strong> Typically 2–5 minutes depending on video length and selected options. AI processing happens in real time.
        </motion.div>

        {/* Generate button */}
        <motion.button
          id="generate-pdf-btn"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onClick={handleGenerate}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full mt-6 py-4 text-base"
        >
          <Zap className="w-5 h-5" />
          Generate PDF in {language}
        </motion.button>
      </div>
    </div>
  );
}
