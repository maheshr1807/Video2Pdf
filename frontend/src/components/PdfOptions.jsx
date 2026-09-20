import { motion } from 'framer-motion';
import { FileText, Lightbulb, Code2, HelpCircle, MessageSquare } from 'lucide-react';

const OPTIONS = [
  {
    key: 'includeSummary',
    icon: FileText,
    label: 'Chapter Summaries',
    description: 'Concise summaries for each chapter',
    defaultOn: true,
  },
  {
    key: 'includeKeyPoints',
    icon: Lightbulb,
    label: 'Key Points',
    description: 'Bullet-point highlights per chapter',
    defaultOn: true,
  },
  {
    key: 'includeExamples',
    icon: Code2,
    label: 'Code Examples',
    description: 'Code snippets extracted from the tutorial',
    defaultOn: true,
  },
  {
    key: 'includeInterviewQuestions',
    icon: MessageSquare,
    label: 'Interview Questions',
    description: '5–8 Q&A pairs for interview prep',
    defaultOn: true,
  },
  {
    key: 'includeQuiz',
    icon: HelpCircle,
    label: 'Practice Quiz (MCQ)',
    description: 'Multiple choice questions with answers',
    defaultOn: true,
  },
];

export default function PdfOptions({ options, onChange }) {
  const toggle = (key) => {
    onChange({ ...options, [key]: !options[key] });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-white/80">PDF Contents</h3>
      <div className="grid grid-cols-1 gap-2">
        {OPTIONS.map(({ key, icon: Icon, label, description }) => {
          const isOn = options[key] !== false;
          return (
            <motion.button
              key={key}
              id={`option-${key}`}
              onClick={() => toggle(key)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                isOn
                  ? 'bg-primary-500/10 border-primary-500/30 text-white'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${
                  isOn
                    ? 'bg-primary-500 border-primary-400'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {isOn && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Icon */}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isOn ? 'text-primary-400' : 'text-white/30'}`} />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{label}</p>
                <p className={`text-xs mt-0.5 ${isOn ? 'text-white/50' : 'text-white/25'}`}>{description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
