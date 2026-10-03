import React from 'react';
import { Stage, HarnessStatus } from '../types/harness';
import { CheckCircle2, Circle, ArrowRight, ShieldAlert } from 'lucide-react';

interface LinearStepperProps {
  currentStage: Stage;
  status: HarnessStatus;
  hasActiveQuestion: boolean;
  onSelectStage: (stage: Stage) => void;
}

const STAGES: { id: Stage; label: string; number: number }[] = [
  { id: 'spec', label: 'Task Specification', number: 1 },
  { id: 'advisor', label: 'Advisor Plan', number: 2 },
  { id: 'executor', label: 'Focused Execution', number: 3 },
  { id: 'guidance', label: 'Decision Intercept', number: 4 },
  { id: 'review', label: 'Review & Verify', number: 5 },
];

export const LinearStepper: React.FC<LinearStepperProps> = ({
  currentStage,
  hasActiveQuestion,
  onSelectStage,
}) => {
  const getStageIndex = (stage: Stage) => STAGES.findIndex((s) => s.id === stage);
  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="w-full bg-[#131B2B] border-b border-[#1E293B] px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {STAGES.map((stage, idx) => {
          // If stage is guidance and there's no active question, hide or dim
          if (stage.id === 'guidance' && !hasActiveQuestion && currentStage !== 'guidance') {
            return null;
          }

          const isActive = currentStage === stage.id;
          const isCompleted = idx < currentIndex;
          const isGuidanceAlert = stage.id === 'guidance' && hasActiveQuestion;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isGuidanceAlert
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
                    : isActive
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                    : isCompleted
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    : 'text-slate-500 cursor-default opacity-60'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold">
                  {isGuidanceAlert ? (
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold">
                      {stage.number}
                    </span>
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <span>{stage.label}</span>
              </button>

              {idx < STAGES.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-700 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
