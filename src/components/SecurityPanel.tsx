'use client';

import React from 'react';
import { CodeReviewResult } from '@/lib/types';
import { DeepPartial } from 'ai';
import { ShieldAlert, ShieldCheck, AlertTriangle, Info, CheckCircle2, Cpu } from 'lucide-react';

interface SecurityPanelProps {
  review?: DeepPartial<CodeReviewResult>;
  isLoading: boolean;
  onPreviewPatch: (suggestion: string) => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ review, isLoading, onPreviewPatch }) => {
  if (isLoading && !review?.summary) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 animate-pulse">
        <Cpu className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-sm font-mono">Running AST Analysis & OWASP Security Audit...</p>
      </div>
    );
  }

  if (!review?.summary && !isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-center">
        <ShieldCheck className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-lg font-semibold text-slate-300">Ready for Code Audit</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-sm">
          Paste your snippet on the left and click <span className="text-emerald-400 font-mono">Run DevSecOps Scan</span> to stream security feedback.
        </p>
      </div>
    );
  }

  const score = review?.score ?? 100;
  const isCritical = review?.hasCriticalVulnerability;

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-6 gap-6">
      {/* Header Badge & Security Score */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {isCritical ? (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {isCritical ? 'Critical Security Flaws Found' : 'Code Health Verified'}
            </h3>
            <p className="text-xs text-slate-400">OWASP Top 10 & Runtime Audit</p>
          </div>
        </div>

        {/* Security Score Gauge */}
        <div className="text-right">
          <div className={`text-3xl font-extrabold font-mono ${score < 50 ? 'text-red-500' : score < 80 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {score}<span className="text-xs text-slate-500">/100</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Health Score</span>
        </div>
      </div>

      {/* Summary Box */}
      {review?.summary && (
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-slate-300 leading-relaxed">
          {review.summary}
        </div>
      )}

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {review?.issues?.map((issue, idx) => {
          const severityColors = {
            CRITICAL: 'bg-red-950/40 border-red-900/60 text-red-400',
            WARNING: 'bg-yellow-950/40 border-yellow-900/60 text-yellow-400',
            INFO: 'bg-blue-950/40 border-blue-900/60 text-blue-400',
          };

          const Icon = issue?.severity === 'CRITICAL' ? AlertTriangle : issue?.severity === 'WARNING' ? AlertTriangle : Info;

          return (
            <div key={idx} className={`p-4 rounded-xl border ${severityColors[issue?.severity || 'INFO']} transition`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-bold text-xs tracking-wider uppercase">{issue?.severity}</span>
                  {issue?.line && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-slate-400 rounded">
                      Line {issue.line}
                    </span>
                  )}
                </div>
              </div>

              <h4 className="font-semibold text-sm text-slate-100 mb-1">{issue?.title}</h4>
              <p className="text-xs text-slate-300 leading-normal mb-3">{issue?.description}</p>

              {issue?.suggestion && (
                <button
                  onClick={() => onPreviewPatch(issue.suggestion!)}
                  className="w-full text-xs font-mono py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-emerald-400 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Inspect & Compare Security Fix (Diff)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};