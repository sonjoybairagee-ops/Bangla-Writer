'use client';

import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';

// Example of how to use translations in any component
export function ExampleComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <p>{t('dashboard.subtitle')}</p>
      <Button>{t('common.save')}</Button>
    </div>
  );
}
