import React from 'react';
import { HarnessStatus } from '../types/harness';
import { Terminal, RefreshCw, Github, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  status: HarnessStatus;
  currentStepIndex: number;
  totalSteps: number;
  isDeployed: boolean;
  githubUrl?: string;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  currentStepIndex,
  totalSteps,
  isDeployed,
  githubUrl,
  onReset,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'idle':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Ready
          </span>
        );
      case 'planning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-950 text-sky-400 border border-sky-800 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Advisor Planning
          </span>
        );
      case 'executing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950 text-blue-400 border border-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            Step {currentStepIndex + 1} of {totalSteps} Executing
          </span>
        );
      case 'needs_guidance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950 text-amber-300 border border-amber-700 animate-bounce">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Decision Required
          </span>
        );
      case 'verifying':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-950 text-purple-400 border border-purple-800">
            Verifying Suite
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full bg-[#0B0F17] border-b border-[#1E293B] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-base font-bold text-white tracking-tight">Harness Interactive Studio</h1>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-400">Calm, step-by-step multi-agent build studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDeployed && githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Repo
            </a>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Reset to Stage 1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Flow
          </button>
        </div>
      </div>
    </header>
  );
};
