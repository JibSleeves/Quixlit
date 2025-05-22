"use client";

import React from 'react';
import { ModelManager } from '@/components/ModelManager';

export default function ModelsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Model Management</h1>
      <ModelManager />
    </main>
  );
}
