import { HarnessState, Stage, PlanStep } from '../types/harness';
import { PRESET_SCENARIOS, PresetScenario } from './mockScenarios';

export class HarnessEngine {
  private state: HarnessState;
  private listeners: Set<(state: HarnessState) => void> = new Set();
  private activeScenario: PresetScenario | null = null;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): HarnessState {
    return {
      currentStage: 'spec',
      status: 'idle',
      specPrompt: '',
      steps: [],
      currentStepIndex: 0,
      activeQuestion: undefined,
      resolvedQuestions: [],
      diffs: [],
      verificationTests: [],
      logs: ['[System] Harness Interactive Studio initialized. Ready for task specification.'],
      repoName: 'alexander-constanza/harness-interactive-studio',
      isDeployed: false,
    };
  }

  public getState(): HarnessState {
    return { ...this.state };
  }

  public subscribe(listener: (state: HarnessState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.state.logs = [...this.state.logs, `[${timestamp}] ${message}`];
  }

  public setSpecPrompt(prompt: string) {
    this.state.specPrompt = prompt;
    this.notify();
  }

  public loadScenario(scenarioId: string) {
    const scenario = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    this.activeScenario = scenario;
    this.state = {
      ...this.getInitialState(),
      specPrompt: scenario.specPrompt,
      logs: [`[System] Loaded preset scenario: "${scenario.name}".`],
    };
    this.notify();
  }

  public async generatePlan(): Promise<void> {
    if (!this.state.specPrompt.trim()) return;

    this.state.status = 'planning';
    this.state.currentStage = 'advisor';
    this.addLog('[Advisor: Opus 4.6] Deconstructing specification into atomic executor tasks...');
    this.notify();

    // If an active scenario is loaded, use its steps; otherwise create sensible default steps
    let steps: PlanStep[];
    if (this.activeScenario && this.state.specPrompt === this.activeScenario.specPrompt) {
      steps = JSON.parse(JSON.stringify(this.activeScenario.steps));
    } else {
      steps = [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Interface Design & Contract Definition',
          description: `Define TypeScript types and contracts for: ${this.state.specPrompt.slice(0, 45)}...`,
          assignedModel: 'minimax',
          targetFiles: ['src/core/contracts.ts'],
          status: 'pending',
          logs: ['[minimax] Analyzing API boundaries and schema'],
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Core Implementation',
          description: 'Implement business logic in isolated module with error boundaries.',
          assignedModel: 'sonnet',
          targetFiles: ['src/core/engine.ts'],
          status: 'pending',
          logs: ['[sonnet] Synthesizing core algorithmic logic'],
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: 'Automated Test Verification',
          description: 'Construct unit test suite verifying boundary conditions and expected invariants.',
          assignedModel: 'haiku',
          targetFiles: ['src/core/__tests__/engine.test.ts'],
          status: 'pending',
          logs: ['[haiku] Running automated unit assertions'],
        },
      ];
    }

    this.state.steps = steps;
    this.state.status = 'idle';
    this.addLog(`[Advisor] Plan generated with ${steps.length} sequential execution stages.`);
    this.notify();
  }

  public approvePlan() {
    if (this.state.steps.length === 0) return;
    this.state.currentStage = 'executor';
    this.state.status = 'executing';
    this.state.currentStepIndex = 0;
    this.state.steps[0].status = 'running';
    this.addLog(`[Orchestrator] Plan approved. Dispatching Step 1 to ${this.state.steps[0].assignedModel.toUpperCase()}...`);
    this.notify();
  }

  public async executeCurrentStep(): Promise<void> {
    const currentIndex = this.state.currentStepIndex;
    const currentStep = this.state.steps[currentIndex];
    if (!currentStep) return;

    this.state.status = 'executing';
    currentStep.status = 'running';
    this.notify();

    // Check if this step has an escalation / question in the active scenario
    if (
      this.activeScenario?.question &&
      this.activeScenario.question.stepId === currentStep.id &&
      !this.state.resolvedQuestions.some((q) => q.id === this.activeScenario?.question?.id)
    ) {
      // Simulate brief work before hitting dilemma
      this.addLog(`[${currentStep.assignedModel}] Examining files: ${currentStep.targetFiles.join(', ')}...`);
      this.addLog(`[${currentStep.assignedModel}] Blocked: Encountered ambiguity. Halting with NEEDS_GUIDANCE.`);
      
      currentStep.status = 'needs_guidance';
      this.state.status = 'needs_guidance';
      this.state.activeQuestion = this.activeScenario.question;
      this.state.currentStage = 'guidance';
      this.notify();
      return;
    }

    // Otherwise, simulate step completion
    currentStep.status = 'completed';
    this.addLog(`[${currentStep.assignedModel}] Completed step "${currentStep.title}".`);
    
    // Check if next step exists
    if (currentIndex + 1 < this.state.steps.length) {
      this.state.currentStepIndex = currentIndex + 1;
      this.state.steps[currentIndex + 1].status = 'pending';
      this.addLog(`[Orchestrator] Advanced to Step ${currentIndex + 2}: "${this.state.steps[currentIndex + 1].title}".`);
    } else {
      // All steps completed! Transition to review stage
      this.transitionToReview();
    }
    this.notify();
  }

  public resolveQuestion(optionId: string, customAnswer?: string) {
    if (!this.state.activeQuestion) return;

    const question = this.state.activeQuestion;
    question.selectedOptionId = optionId;
    question.customAnswer = customAnswer;

    const selectedOpt = question.options.find((o) => o.id === optionId);
    const chosenLabel = selectedOpt ? selectedOpt.label : customAnswer || optionId;

    this.addLog(`[Human Decision] Intercept resolved: "${chosenLabel}". Resuming worker.`);

    this.state.resolvedQuestions = [...this.state.resolvedQuestions, question];
    this.state.activeQuestion = undefined;

    // Resume the step
    const currentStep = this.state.steps[this.state.currentStepIndex];
    if (currentStep) {
      currentStep.status = 'completed';
      currentStep.logs.push(`[Guidance Received] Applied decision: ${chosenLabel}`);
    }

    this.state.status = 'executing';
    this.state.currentStage = 'executor';

    if (this.state.currentStepIndex + 1 < this.state.steps.length) {
      this.state.currentStepIndex += 1;
      this.state.steps[this.state.currentStepIndex].status = 'pending';
      this.addLog(`[Orchestrator] Advanced to Step ${this.state.currentStepIndex + 1}: "${this.state.steps[this.state.currentStepIndex].title}".`);
    } else {
      this.transitionToReview();
    }

    this.notify();
  }

  private transitionToReview() {
    this.state.currentStage = 'review';
    this.state.status = 'verifying';
    this.state.diffs = this.activeScenario?.diffs || [
      {
        path: 'src/core/contracts.ts',
        status: 'added',
        additions: 24,
        deletions: 0,
        afterContent: 'export interface GeneratedContract {\n  id: string;\n  status: "verified";\n}'
      }
    ];
    this.state.verificationTests = this.activeScenario?.verificationTests || [
      {
        id: 'vt-1',
        name: 'verifies interface contract conformity',
        suite: 'General Suite',
        status: 'passed',
        durationMs: 16
      }
    ];
    this.addLog('[Review] All worker steps finished. Diff ready for inspection and test verification.');
  }

  public markVerified() {
    this.state.status = 'completed';
    this.addLog('[Verification] Automated test suite passed 100%. Ready for GitHub deployment.');
    this.notify();
  }

  public setDeploymentInfo(githubUrl: string) {
    this.state.isDeployed = true;
    this.state.githubUrl = githubUrl;
    this.addLog(`[Deployment] Deployed to GitHub: ${githubUrl}`);
    this.notify();
  }

  public goToStage(stage: Stage) {
    this.state.currentStage = stage;
    this.notify();
  }

  public reset() {
    this.activeScenario = null;
    this.state = this.getInitialState();
    this.notify();
  }
}

export const defaultEngine = new HarnessEngine();
