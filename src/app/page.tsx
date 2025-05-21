
"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { CodeIndexer } from '@/components/CodeIndexer';
import { CodeAssistant } from '@/components/CodeAssistant';
import { CodeRefactorer } from '@/components/CodeRefactorer'; // Import the new component

export default function NostalgiaAiPage() {
  const [codebaseIndex, setCodebaseIndex] = useState<string | null>(null);

  const handleIndexGenerated = (index: string) => {
    setCodebaseIndex(index);
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div className="lg:col-span-1 h-full min-h-[500px] lg:min-h-0">
          <CodeIndexer onIndexGenerated={handleIndexGenerated} />
        </div>
        <div className="lg:col-span-1 h-full min-h-[500px] lg:min-h-0">
          <CodeAssistant codebaseIndex={codebaseIndex} />
        </div>
        <div className="lg:col-span-1 h-full min-h-[500px] lg:min-h-0">
          <CodeRefactorer />
        </div>
      </div>
    </AppLayout>
  );
}
