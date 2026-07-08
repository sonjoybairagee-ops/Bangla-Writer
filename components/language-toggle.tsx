'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Globe className="h-4 w-4" />
        English
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'bn'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Globe className="h-4 w-4" />
        বাংলা
      </button>
    </div>
  );
}

// Compact version for mobile
export function LanguageToggleCompact() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'EN' : 'বাং'}
    </Button>
  );
}
