export type Stage = 'spec' | 'advisor' | 'executor' | 'guidance' | 'review';

export type HarnessStatus = 
  | 'idle' 
  | 'planning' 
  | 'executing' 
  | 'needs_guidance' 
  | 'verifying' 
  | 'completed' 
  | 'error';

export type ModelTier = 
  | 'opus' 
  | 'sonnet' 
  | 'haiku' 
  | 'minimax' 
  | 'gemini-flash' 
  | 'gemini-pro';

export interface PlanStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  assignedModel: ModelTier;
  targetFiles: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'needs_guidance';
  outputSummary?: string;
  logs: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
  recommended?: boolean;
}

export interface GuidanceQuestion {
  id: string;
  stepId: string;
  stepTitle: string;
  title: string;
  dilemma: string;
  context: string;
  options: QuestionOption[];
  selectedOptionId?: string;
  customAnswer?: string;
}

export interface FileDiff {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  beforeContent?: string;
  afterContent: string;
}

export interface VerificationTest {
  id: string;
  name: string;
  suite: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  durationMs?: number;
  output?: string;
}

export interface HarnessState {
  currentStage: Stage;
  status: HarnessStatus;
  specPrompt: string;
  steps: PlanStep[];
  currentStepIndex: number;
  activeQuestion?: GuidanceQuestion;
  resolvedQuestions: GuidanceQuestion[];
  diffs: FileDiff[];
  verificationTests: VerificationTest[];
  logs: string[];
  repoName: string;
  isDeployed: boolean;
  githubUrl?: string;
}
