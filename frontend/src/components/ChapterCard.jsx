import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Code2, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export default function ChapterCard({ chapter, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <button
        id={`chapter-${index}-toggle`}
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors duration-200"
      >
        {/* Chapter number */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm leading-tight">{chapter.title}</h3>
          {!expanded && chapter.summary && (
            <p className="text-xs text-white/40 mt-1 line-clamp-1">{chapter.summary}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {chapter.keyPoints?.length > 0 && (
            <span className="badge-primary hidden sm:flex">{chapter.keyPoints.length} points</span>
          )}
          {chapter.examples?.filter((e) => e.code)?.length > 0 && (
            <span className="badge bg-violet-500/20 text-violet-300 border border-violet-500/30 hidden sm:flex">
              {chapter.examples.filter((e) => e.code).length} examples
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </div>
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Summary */}
          {chapter.summary && (
            <p className="text-sm text-white/70 leading-relaxed">{chapter.summary}</p>
          )}

          {/* Key Points */}
          {chapter.keyPoints?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-primary-400" />
                <h4 className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Key Points</h4>
              </div>
              <ul className="space-y-1.5">
                {chapter.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Examples */}
          {chapter.examples?.filter((e) => e.code)?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-3.5 h-3.5 text-violet-400" />
                <h4 className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Code Examples</h4>
              </div>
              <div className="space-y-3">
                {chapter.examples
                  .filter((e) => e.code)
                  .map((example, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                      {/* Code header */}
                      <div className="bg-primary-950 px-3 py-1.5 flex items-center justify-between">
                        <span className="text-xs font-mono text-primary-300 font-semibold">
                          {example.language?.toUpperCase() || 'CODE'}
                        </span>
                        <span className="text-white/20 text-xs">■ ■ ■</span>
                      </div>
                      {/* Code body */}
                      <pre className="bg-[#13111F] p-3 text-xs font-mono text-cyan-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {example.code}
                      </pre>
                      {example.explanation && (
                        <div className="bg-white/5 px-3 py-2">
                          <p className="text-xs text-white/50 italic">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
