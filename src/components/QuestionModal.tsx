import React, { useState } from 'react';
import { GuidanceQuestion } from '../types/harness';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface QuestionModalProps {
  question: GuidanceQuestion;
  onResolve: (optionId: string, customAnswer?: string) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  onResolve,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    question.options.find((o) => o.recommended)?.id || question.options[0]?.id || ''
  );
  const [customInput, setCustomInput] = useState<string>('');

  const handleConfirm = () => {
    onResolve(selectedOption, customInput.trim() ? customInput : undefined);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      {/* Alert Header */}
      <div className="bg-amber-950/30 border border-amber-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 4: Decision Intercept
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Paused on: <strong className="text-slate-200">{question.stepTitle}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {question.title}
            </h2>
          </div>
        </div>

        {/* Dilemma explanation */}
        <div className="bg-[#0B0F17]/90 rounded-xl p-4 border border-[#1E293B] space-y-2">
          <p className="text-sm font-medium text-amber-200/90 leading-relaxed">
            {question.dilemma}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {question.context}
          </p>
        </div>

        {/* Option Selection List */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Choose Strategy:
          </label>

          <div className="space-y-2">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                      : 'bg-[#131B2B] border-[#1E293B] hover:border-slate-700'
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100">
                        {option.label}
                      </span>
                      {option.recommended && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom write-in */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Or provide custom instructions (optional):
          </label>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Use in-memory store now, but add an interface so Redis can be swapped in later."
            className="w-full bg-[#0B0F17] border border-[#1E293B] focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3">
          <button
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Confirm Decision & Resume Execution</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
