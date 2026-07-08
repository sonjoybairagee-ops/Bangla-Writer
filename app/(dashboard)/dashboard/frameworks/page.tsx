'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function FrameworksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Framework Brain</h1>
        <p className="text-slate-600">
          Upload copywriting frameworks and swipe files for AI to learn from
        </p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
          <p className="text-slate-600">
            Framework Brain will allow you to upload and teach AI your favorite
            copywriting frameworks, swipe files, and proven formulas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
