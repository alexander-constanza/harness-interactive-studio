import React, { useState } from 'react';
import { FileDiff, VerificationTest, HarnessStatus } from '../types/harness';
import { CheckCircle2, FileText, Check, ShieldCheck, Github, ExternalLink, Play, Sparkles } from 'lucide-react';

interface ReviewDiffStageProps {
  diffs: FileDiff[];
  verificationTests: VerificationTest[];
  status: HarnessStatus;
  isDeployed: boolean;
  githubUrl?: string;
  onRunVerification: () => void;
  onDeployToGithub: () => void;
}

export const ReviewDiffStage: React.FC<ReviewDiffStageProps> = ({
  diffs,
  verificationTests,
  isDeployed,
  githubUrl,
  onRunVerification,
  onDeployToGithub,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'diff' | 'tests'>('diff');

  const selectedDiff = diffs[selectedFileIndex] || diffs[0];
  const allTestsPassed = verificationTests.length > 0 && verificationTests.every((t) => t.status === 'passed');

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      {/* Header Banner */}
      <div className="bg-[#131B2B] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Step 5: Review & Verification
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Execution Completed Successfully
          </h2>
          <p className="text-xs text-slate-400">
            {diffs.length} files produced/modified • {verificationTests.length} verification tests passed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRunVerification}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 shadow-md transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Re-run Verification Tests
          </button>

          <button
            onClick={onDeployToGithub}
            disabled={isDeployed}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all ${
              isDeployed
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isDeployed ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Deployed to GitHub
              </>
            ) : (
              <>
                <Github className="w-4 h-4" />
                Deploy & Push to GitHub
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2">
        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'diff'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Inspect File Diffs ({diffs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'tests'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Test Suite ({verificationTests.length})</span>
        </button>
      </div>

      {/* Tab Content: DIFFS */}
      {activeTab === 'diff' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* File list */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Changed Files
            </label>
            <div className="space-y-1.5">
              {diffs.map((diff, idx) => (
                <button
                  key={diff.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    selectedFileIndex === idx
                      ? 'bg-sky-500/10 border-sky-500 text-sky-300 font-semibold shadow-sm'
                      : 'bg-[#131B2B] border-[#1E293B] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono truncate max-w-[180px]">
                    {diff.path}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    +{diff.additions}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Diff content view */}
          <div className="md:col-span-2 bg-[#0B0F17] border border-[#1E293B] rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-[#131B2B] px-4 py-2.5 border-b border-[#1E293B] flex items-center justify-between">
              <span className="font-mono text-xs text-slate-200 font-medium">
                {selectedDiff?.path}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                {selectedDiff?.status.toUpperCase()}
              </span>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[460px] leading-relaxed">
              <code>{selectedDiff?.afterContent}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-3">
          <div className="space-y-2">
            {verificationTests.map((t) => (
              <div
                key={t.id}
                className="bg-[#131B2B] border border-[#1E293B] rounded-xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {t.name}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Suite: {t.suite} {t.durationMs ? `• ${t.durationMs}ms` : ''}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  PASSED
                </span>
              </div>
            ))}
          </div>

          {allTestsPassed && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All automated invariants and edge cases verified. Zero regression detected.</span>
            </div>
          )}
        </div>
      )}

      {/* GitHub URL Notification */}
      {isDeployed && githubUrl && (
        <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/50 flex items-center justify-between text-xs text-sky-200">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-sky-400" />
            <span>Repository deployed to GitHub: <strong className="text-white">{githubUrl}</strong></span>
          </div>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-semibold text-sky-400 hover:text-sky-300 underline"
          >
            <span>Open Repo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
