'use client';

import React, { useState } from 'react';
import { useObject } from '@ai-sdk/react';
import { CodeReviewSchema } from '@/lib/types';
import { CodeEditor } from '@/components/CodeEditor';
import { SecurityPanel } from '@/components/SecurityPanel';
import { Play, Sparkles, RefreshCw } from 'lucide-react';

const INITIAL_CODE = `function login(user, pass) {
  // Vulnerable to SQL Injection
  let query = "SELECT * FROM users WHERE username='" + user + "' AND password='" + pass + "'";
  return db.execute(query);
}`;

export default function WorkspacePage() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [language, setLanguage] = useState('javascript');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Connects Next.js client directly to live Express SSE Stream
  const { object: review, submit, isLoading } = useObject({
    api: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api/v1/review',
    schema: CodeReviewSchema,
  });

  const handleRunScan = () => {
    setSelectedSuggestion(null);
    submit({ code, language });
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">DevSecOps AI Code Reviewer</h1>
            <p className="text-[11px] text-slate-500 font-mono">Powered by Gemini 2.5 Flash & SSE Engine</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono px-3 py-2 rounded-lg outline-none focus:border-emerald-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
          </select>

          <button
            onClick={handleRunScan}
            disabled={isLoading}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition shadow-lg shadow-emerald-950/40"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isLoading ? 'Scanning...' : 'Run Security Scan'}
          </button>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Monaco Code Editor */}
        <div className="col-span-7 h-full">
          <CodeEditor
            code={code}
            language={language}
            onChange={setCode}
            review={review}
            selectedSuggestion={selectedSuggestion}
            onClearPatch={() => setSelectedSuggestion(null)}
          />
        </div>

        {/* Right Column: Security Feedback Panel */}
        <div className="col-span-5 h-full">
          <SecurityPanel
            review={review}
            isLoading={isLoading}
            onPreviewPatch={(suggestion) => setSelectedSuggestion(suggestion)}
          />
        </div>
      </main>
    </div>
  );
}