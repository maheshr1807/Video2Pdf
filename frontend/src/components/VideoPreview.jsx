import { motion } from 'framer-motion';
import { ExternalLink, Clock, User } from 'lucide-react';

export default function VideoPreview({ metadata }) {
  if (!metadata) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-card p-4 max-w-2xl mx-auto"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            onError={(e) => { e.target.src = metadata.thumbnailFallback; }}
            className="w-32 h-20 object-cover rounded-xl"
          />
          <div className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[9px] border-l-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-2">
            {metadata.title}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {metadata.channel && (
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <User className="w-3 h-3" />
                {metadata.channel}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="badge-success text-xs">✓ Video found</span>
            <a
              href={metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View on YouTube
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
