import React from 'react';
import { PRESET_SCENARIOS } from '../services/mockScenarios';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface SpecInputStageProps {
  prompt: string;
  isPlanning: boolean;
  onPromptChange: (prompt: string) => void;
  onSelectPreset: (scenarioId: string) => void;
  onSubmit: () => void;
}

export const SpecInputStage: React.FC<SpecInputStageProps> = ({
  prompt,
  isPlanning,
  onPromptChange,
  onSelectPreset,
  onSubmit,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          Step 1: Define Goal
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          What are we building today?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Keep it focused. The <strong>Advisor model</strong> will review this specification and break it down into clean, isolated execution steps.
        </p>
      </div>

      {/* Main Prompt Card */}
      <div className="bg-[#131B2B] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Task Specification
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g. Build an authenticated API middleware that validates bearer tokens, enforces a 100 req/min sliding-window rate limit, and includes unit tests."
          rows={4}
          className="w-full bg-[#0B0F17] border border-[#1E293B] focus:border-sky-500 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all resize-none"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            {prompt.length} characters
          </span>

          <button
            onClick={onSubmit}
            disabled={!prompt.trim() || isPlanning}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md ${
              !prompt.trim() || isPlanning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-400 shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isPlanning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Deconstructing Plan...
              </>
            ) : (
              <>
                <span>Generate Advisor Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Or Choose a Pre-configured Scenario to Test</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario.id)}
              className="text-left bg-[#131B2B]/60 hover:bg-[#131B2B] border border-[#1E293B] hover:border-sky-500/50 rounded-xl p-4 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200 group-hover:text-sky-300">
                  {scenario.name}
                </span>
                <span className="text-xs text-slate-500">
                  {scenario.steps.length} steps
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {scenario.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
