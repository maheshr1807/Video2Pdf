import { Heart, Github, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto py-8 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white/60 text-sm">Video2PDF AI</span>
        </div>

        {/* Center */}
        <p className="text-xs text-white/30 flex items-center gap-1.5">
          Built with <Heart className="w-3 h-3 text-red-400 fill-current" /> for education
        </p>

        {/* Links */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/25">© {new Date().getFullYear()} Video2PDF AI</span>
        </div>
      </div>
    </footer>
  );
}
