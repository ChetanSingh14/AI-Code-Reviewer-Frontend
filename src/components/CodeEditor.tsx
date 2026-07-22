'use client';

import React, { useRef, useEffect } from 'react';
import Editor, { DiffEditor, OnMount } from '@monaco-editor/react';
import { CodeReviewResult } from '@/lib/types';
import { DeepPartial } from 'ai';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  review?: DeepPartial<CodeReviewResult>;
  selectedSuggestion?: string | null;
  onClearPatch?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  review,
  selectedSuggestion,
  onClearPatch,
}) => {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Dynamically decorate lines whenever new AI review issues stream in
  useEffect(() => {
    if (!editorRef.current || !review?.issues) return;

    const newDecorations = review.issues
      .filter((issue) => issue?.line && issue.line > 0)
      .map((issue) => {
        const isCritical = issue?.severity === 'CRITICAL';
        return {
          range: new (window as any).monaco.Range(issue!.line, 1, issue!.line, 1),
          options: {
            isWholeLine: true,
            className: isCritical ? 'bg-red-950/40 border-l-4 border-red-500' : 'bg-yellow-950/40 border-l-4 border-yellow-500',
            glyphMarginClassName: isCritical ? 'bg-red-500 rounded-full' : 'bg-yellow-500 rounded-full',
            hoverMessage: { value: `**[${issue?.severity}] ${issue?.title}**: ${issue?.description}` },
          },
        };
      });

    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, newDecorations);
  }, [review?.issues]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {selectedSuggestion ? (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
            <span className="font-mono text-emerald-400 font-semibold">🔍 Security Patch Preview (Diff Mode)</span>
            <button
              onClick={onClearPatch}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
            >
              Close Diff
            </button>
          </div>
          <div className="flex-1">
            <DiffEditor
              height="100%"
              theme="vs-dark"
              language={language}
              original={code}
              modified={selectedSuggestion}
              options={{
                readOnly: true,
                renderSideBySide: true,
                minimap: { enabled: false },
              }}
            />
          </div>
        </div>
      ) : (
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: 'Fira Code, JetBrains Mono, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            glyphMargin: true,
            padding: { top: 16 },
            smoothScrolling: true,
          }}
        />
      )}
    </div>
  );
};