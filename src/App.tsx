import React, { useState, useEffect } from 'react';
import { defaultEngine } from './services/harnessEngine';
import { HarnessState, Stage } from './types/harness';
import { Header } from './components/Header';
import { LinearStepper } from './components/LinearStepper';
import { SpecInputStage } from './components/SpecInputStage';
import { AdvisorStage } from './components/AdvisorStage';
import { ExecutorStage } from './components/ExecutorStage';
import { QuestionModal } from './components/QuestionModal';
import { ReviewDiffStage } from './components/ReviewDiffStage';

export const App: React.FC = () => {
  const [engineState, setEngineState] = useState<HarnessState>(defaultEngine.getState());

  useEffect(() => {
    const unsubscribe = defaultEngine.subscribe((state) => {
      setEngineState(state);
    });
    return unsubscribe;
  }, []);

  const handleStageSelect = (stage: Stage) => {
    defaultEngine.goToStage(stage);
  };

  const handleSpecPromptChange = (prompt: string) => {
    defaultEngine.setSpecPrompt(prompt);
  };

  const handleSelectPreset = (scenarioId: string) => {
    defaultEngine.loadScenario(scenarioId);
  };

  const handleGeneratePlan = async () => {
    await defaultEngine.generatePlan();
  };

  const handleApprovePlan = () => {
    defaultEngine.approvePlan();
  };

  const handleExecuteStep = async () => {
    await defaultEngine.executeCurrentStep();
  };

  const handleResolveQuestion = (optionId: string, customAnswer?: string) => {
    defaultEngine.resolveQuestion(optionId, customAnswer);
  };

  const handleRunVerification = () => {
    defaultEngine.markVerified();
  };

  const handleDeployToGithub = async () => {
    // Mark as deployed to GitHub repository
    defaultEngine.setDeploymentInfo('https://github.com/alexander-constanza/harness-interactive-studio');
  };

  const handleReset = () => {
    defaultEngine.reset();
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col font-sans">
      <Header
        status={engineState.status}
        currentStepIndex={engineState.currentStepIndex}
        totalSteps={engineState.steps.length}
        isDeployed={engineState.isDeployed}
        githubUrl={engineState.githubUrl}
        onReset={handleReset}
      />

      <LinearStepper
        currentStage={engineState.currentStage}
        status={engineState.status}
        hasActiveQuestion={!!engineState.activeQuestion}
        onSelectStage={handleStageSelect}
      />

      <main className="flex-1 px-6 pb-12 overflow-y-auto">
        {engineState.currentStage === 'spec' && (
          <SpecInputStage
            prompt={engineState.specPrompt}
            isPlanning={engineState.status === 'planning'}
            onPromptChange={handleSpecPromptChange}
            onSelectPreset={handleSelectPreset}
            onSubmit={handleGeneratePlan}
          />
        )}

        {engineState.currentStage === 'advisor' && (
          <AdvisorStage
            steps={engineState.steps}
            onApprove={handleApprovePlan}
            onBack={() => defaultEngine.goToStage('spec')}
          />
        )}

        {engineState.currentStage === 'executor' && (
          <ExecutorStage
            steps={engineState.steps}
            currentStepIndex={engineState.currentStepIndex}
            status={engineState.status}
            onExecuteStep={handleExecuteStep}
          />
        )}

        {engineState.currentStage === 'guidance' && engineState.activeQuestion && (
          <QuestionModal
            question={engineState.activeQuestion}
            onResolve={handleResolveQuestion}
          />
        )}

        {engineState.currentStage === 'review' && (
          <ReviewDiffStage
            diffs={engineState.diffs}
            verificationTests={engineState.verificationTests}
            status={engineState.status}
            isDeployed={engineState.isDeployed}
            githubUrl={engineState.githubUrl}
            onRunVerification={handleRunVerification}
            onDeployToGithub={handleDeployToGithub}
          />
        )}
      </main>
    </div>
  );
};

export default App;
