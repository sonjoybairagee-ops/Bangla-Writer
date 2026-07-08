'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export function CopyButton({
  text,
  successMessage = 'Copied!',
  className,
  variant = 'outline',
  size = 'sm',
  showText = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text, successMessage);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          {showText && 'Copied'}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {showText && 'Copy'}
        </>
      )}
    </Button>
  );
}
