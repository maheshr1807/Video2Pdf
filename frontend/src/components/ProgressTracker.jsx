import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

const STEP_ICONS = {
  pending: Circle,
  active: Loader2,
  completed: CheckCircle2,
  error: XCircle,
};

const STEP_COLORS = {
  pending: 'text-white/30',
  active: 'text-primary-400',
  completed: 'text-emerald-400',
  error: 'text-red-400',
};

export default function ProgressTracker({ steps, currentStep, error }) {
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white/70">Processing...</span>
          <span className="text-sm font-bold text-primary-300">
            {Math.round((steps.filter((s) => s.status === 'completed').length / steps.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-bar rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width: `${(steps.filter((s) => s.status === 'completed').length / steps.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-2">
        <AnimatePresence>
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[step.status] || Circle;
            const colorClass = STEP_COLORS[step.status] || STEP_COLORS.pending;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`step-item ${step.status}`}
              >
                {/* Step icon */}
                <div className={`flex-shrink-0 ${colorClass}`}>
                  <Icon
                    className={`w-5 h-5 ${step.status === 'active' ? 'animate-spin' : ''}`}
                  />
                </div>

                {/* Step text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    step.status === 'completed' ? 'text-emerald-300' :
                    step.status === 'active' ? 'text-white' :
                    step.status === 'error' ? 'text-red-300' :
                    'text-white/30'
                  }`}>
                    {step.label}
                  </p>
                  {step.detail && step.status === 'active' && (
                    <p className="text-xs text-primary-400/70 mt-0.5 animate-pulse">{step.detail}</p>
                  )}
                </div>

                {/* Status badge */}
                {step.status === 'completed' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="badge-success flex-shrink-0"
                  >
                    Done
                  </motion.span>
                )}
                {step.status === 'active' && (
                  <span className="badge-primary flex-shrink-0 animate-pulse">Working</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">Processing Failed</p>
              <p className="text-xs text-red-400/80 mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
