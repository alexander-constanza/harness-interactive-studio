import React, { useState } from 'react';
import { PlanStep, HarnessStatus } from '../types/harness';
import { Play, CheckCircle2, ChevronDown, ChevronRight, Terminal, Cpu, FileCode, Clock } from 'lucide-react';

interface ExecutorStageProps {
  steps: PlanStep[];
  currentStepIndex: number;
  status: HarnessStatus;
  onExecuteStep: () => void;
}

export const ExecutorStage: React.FC<ExecutorStageProps> = ({
  steps,
  currentStepIndex,
  status,
  onExecuteStep,
}) => {
  const [showLogs, setShowLogs] = useState(false);
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-slate-400">
        No active step.
      </div>
    );
  }

  const isRunning = status === 'executing';

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {/* Step Tracker Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#1E293B] pb-3">
        <span>
          Executing Step <strong className="text-white">{currentStepIndex + 1}</strong> of <strong className="text-white">{steps.length}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx < currentStepIndex || s.status === 'completed'
                  ? 'bg-emerald-400'
                  : idx === currentStepIndex
                  ? 'bg-sky-400 ring-2 ring-sky-400/30'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Focus Card: ONLY THE CURRENT ACTIVE STEP */}
      <div className="bg-[#131B2B] border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-800">
              Active Focus
            </span>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>Executor: <strong className="text-slate-200">{currentStep.assignedModel.toUpperCase()}</strong></span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {currentStep.title}
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {currentStep.targetFiles.length > 0 && (
            <div className="bg-[#0B0F17] rounded-xl p-3 border border-[#1E293B] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3 h-3" /> Target File Workspace
              </span>
              <div className="font-mono text-xs text-sky-300">
                {currentStep.targetFiles.join(', ')}
              </div>
            </div>
          )}

          {currentStep.outputSummary && (
            <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Step Output:</strong>
                {currentStep.outputSummary}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={onExecuteStep}
              disabled={isRunning}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all ${
                isRunning
                  ? 'bg-slate-800 text-slate-400 cursor-wait'
                  : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isRunning ? (
                <>
                  <Clock className="w-4 h-4 animate-spin text-sky-300" />
                  <span>Executing Isolated Step...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Step {currentStepIndex + 1}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Raw Output Logs (Collapsible so it doesn't clutter the screen) */}
      <div className="bg-[#131B2B]/60 border border-[#1E293B] rounded-xl overflow-hidden">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Under the Hood (Raw Worker Logs)</span>
          </div>
          {showLogs ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {showLogs && (
          <div className="bg-[#0B0F17] p-4 border-t border-[#1E293B] font-mono text-xs text-slate-300 space-y-1 max-h-56 overflow-y-auto">
            {currentStep.logs.length === 0 ? (
              <div className="text-slate-600 italic">No output logged yet.</div>
            ) : (
              currentStep.logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
