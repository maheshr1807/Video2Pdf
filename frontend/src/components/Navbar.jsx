import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Zap, Home } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto">
        <div className="glass-card px-5 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              Video<span className="gradient-text">2PDF</span>
              <span className="text-primary-400 font-black"> AI</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link
              to="/generate"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/generate'
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap className="w-4 h-4" />
              Generate
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
