import React from 'react';
import { PlanStep } from '../types/harness';
import { Bot, FileCode, ArrowRight, ArrowLeft, Cpu } from 'lucide-react';

interface AdvisorStageProps {
  steps: PlanStep[];
  onApprove: () => void;
  onBack: () => void;
}

export const AdvisorStage: React.FC<AdvisorStageProps> = ({
  steps,
  onApprove,
  onBack,
}) => {
  const getModelBadge = (model: string) => {
    switch (model) {
      case 'minimax':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Cpu className="w-3 h-3" />
            MiniMax M2.7
          </span>
        );
      case 'sonnet':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950 text-blue-400 border border-blue-800">
            <Cpu className="w-3 h-3" />
            Claude Sonnet 4.6
          </span>
        );
      case 'haiku':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Cpu className="w-3 h-3" />
            Claude Haiku
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Cpu className="w-3 h-3" />
            {model}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            Step 2: Advisor Decomposition
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Planned Execution Stages
          </h2>
          <p className="text-xs text-slate-400">
            Reviewed by <strong>Opus 4.6</strong>. Work is isolated into {steps.length} atomic steps with assigned executor models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Edit Spec
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Approve & Dispatch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className="bg-[#131B2B] border border-[#1E293B] rounded-xl p-5 transition-all hover:border-slate-700 shadow-md flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
              {idx + 1}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">
                  {step.title}
                </h3>
                <div>{getModelBadge(step.assignedModel)}</div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>

              {step.targetFiles.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {step.targetFiles.map((file) => (
                      <span
                        key={file}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0B0F17] text-slate-300 border border-[#1E293B]"
                      >
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
