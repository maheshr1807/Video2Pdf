import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Plus, CheckCircle2, BookOpen, HelpCircle, MessageSquare, Globe } from 'lucide-react';
import ChapterCard from '../components/ChapterCard';
import { downloadPDF } from '../services/pdfService';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { metadata, pdfResult, documentData, language } = location.state || {};

  useEffect(() => {
    if (!pdfResult) {
      navigate('/', { replace: true });
    }
  }, [pdfResult, navigate]);

  if (!pdfResult || !documentData) return null;

  const handleDownload = () => {
    try {
      downloadPDF(pdfResult.pdfId, pdfResult.filename);
      toast.success('PDF download started!');
    } catch {
      toast.error('Download failed. Please try again.');
    }
  };

  const handlePreview = () => {
    window.open(pdfResult.pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-emerald-600/6 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-primary-600/8 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto w-full px-4 pt-28 pb-16">

        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center mb-10"
        >
          {/* Celebration icon */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse-slow" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">
            Your PDF is Ready! 🎉
          </h1>
          <p className="text-white/40 text-sm">
            {documentData.title} • {language} • {pdfResult.pageEstimate} pages
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            { icon: BookOpen, label: 'Chapters', value: pdfResult.chapterCount },
            { icon: FileText, label: 'Pages (est.)', value: pdfResult.pageEstimate },
            { icon: Globe, label: 'Language', value: language },
            { icon: HelpCircle, label: 'Questions', value: (documentData.interviewQuestions?.length || 0) + (documentData.mcqs?.length || 0) },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <Icon className="w-5 h-5 text-primary-400 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <button
            id="download-pdf-btn"
            onClick={handleDownload}
            className="btn-primary flex-1 py-4 text-base"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            id="preview-pdf-btn"
            onClick={handlePreview}
            className="btn-secondary flex-1 py-4 text-base"
          >
            <Eye className="w-5 h-5" />
            Preview in Browser
          </button>
          <button
            id="generate-another-btn"
            onClick={() => navigate('/')}
            className="btn-secondary sm:flex-none px-6 py-4 text-base"
          >
            <Plus className="w-5 h-5" />
            New PDF
          </button>
        </motion.div>

        {/* Preview: Introduction */}
        {documentData.introduction && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5 mb-4"
          >
            <h2 className="text-sm font-semibold text-primary-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Introduction
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">{documentData.introduction}</p>
          </motion.div>
        )}

        {/* Chapters preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-400" />
            Chapters Preview
          </h2>
          <div className="space-y-3">
            {documentData.chapters.map((chapter, idx) => (
              <ChapterCard key={idx} chapter={chapter} index={idx} />
            ))}
          </div>
        </motion.div>

        {/* Interview Questions preview */}
        {documentData.interviewQuestions?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 mb-4"
          >
            <h2 className="text-sm font-semibold text-primary-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Interview Questions ({documentData.interviewQuestions.length})
            </h2>
            <div className="space-y-3">
              {documentData.interviewQuestions.slice(0, 3).map((item, i) => (
                <div key={i} className="border-l-2 border-primary-500/40 pl-3">
                  <p className="text-sm font-medium text-white">{item.question}</p>
                  <p className="text-xs text-white/40 mt-1 line-clamp-2">{item.answer}</p>
                </div>
              ))}
              {documentData.interviewQuestions.length > 3 && (
                <p className="text-xs text-white/30">
                  +{documentData.interviewQuestions.length - 3} more in the PDF
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Final download CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button onClick={handleDownload} className="btn-primary px-10 py-4">
            <Download className="w-5 h-5" />
            Download Full PDF
          </button>
          <p className="text-xs text-white/25 mt-3">
            {pdfResult.fileSizeKB} KB • Generated by Video2PDF AI
          </p>
        </motion.div>
      </div>
    </div>
  );
}
