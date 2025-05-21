"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CodeIndexer } from '@/components/CodeIndexer';
import { CodeAssistant } from '@/components/CodeAssistant';

export default function NostalgiaAiPage() {
  const [codebaseIndex, setCodebaseIndex] = useState<string | null>(null);

  const handleIndexGenerated = (index: string) => {
    setCodebaseIndex(index);
  };

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        <div className="lg:w-1/2 h-full min-h-[500px] lg:min-h-0">
          <CodeIndexer onIndexGenerated={handleIndexGenerated} />
        </div>
        <div className="lg:w-1/2 h-full min-h-[500px] lg:min-h-0">
          <CodeAssistant codebaseIndex={codebaseIndex} />
        </div>
      </div>
    </AppLayout>
  );
}
