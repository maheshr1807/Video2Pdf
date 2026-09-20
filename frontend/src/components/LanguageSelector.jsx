import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'Tamil', label: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'Hindi', label: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'Malayalam', label: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'Telugu', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'Kannada', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'Bengali', label: 'Bengali (বাংলা)', flag: '🇮🇳' },
  { code: 'Marathi', label: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'Arabic', label: 'Arabic (العربية)', flag: '🇦🇪' },
  { code: 'Japanese', label: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'Chinese', label: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'French', label: 'French (Français)', flag: '🇫🇷' },
  { code: 'Spanish', label: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'German', label: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'Portuguese', label: 'Portuguese (Português)', flag: '🇧🇷' },
];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="language-select" className="flex items-center gap-2 text-sm font-semibold text-white/80">
        <Globe className="w-4 h-4 text-primary-400" />
        Output Language
      </label>
      <div className="relative">
        <select
          id="language-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none input-field pr-10 cursor-pointer font-medium"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-gray-900 text-white">
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {value !== 'English' && (
        <p className="text-xs text-amber-400/70 flex items-start gap-1">
          <span>💡</span>
          <span>Explanations will be translated to {value}. Code and technical terms remain in English.</span>
        </p>
      )}
    </div>
  );
}
