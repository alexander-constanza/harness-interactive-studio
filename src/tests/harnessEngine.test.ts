import { describe, it, expect, beforeEach } from 'vitest';
import { HarnessEngine } from '../services/harnessEngine';

describe('HarnessEngine State Machine', () => {
  let engine: HarnessEngine;

  beforeEach(() => {
    engine = new HarnessEngine();
  });

  it('initializes with default stage "spec" and status "idle"', () => {
    const state = engine.getState();
    expect(state.currentStage).toBe('spec');
    expect(state.status).toBe('idle');
    expect(state.steps).toHaveLength(0);
  });

  it('generates decomposed plan from task specification', async () => {
    engine.setSpecPrompt('Build authentication service with rate limiter');
    await engine.generatePlan();

    const state = engine.getState();
    expect(state.currentStage).toBe('advisor');
    expect(state.steps.length).toBeGreaterThan(0);
    expect(state.steps[0].title).toBeDefined();
    expect(state.steps[0].assignedModel).toBeDefined();
  });

  it('approves plan and transitions to executor stage', async () => {
    engine.setSpecPrompt('Build simple utility');
    await engine.generatePlan();
    engine.approvePlan();

    const state = engine.getState();
    expect(state.currentStage).toBe('executor');
    expect(state.status).toBe('executing');
    expect(state.currentStepIndex).toBe(0);
    expect(state.steps[0].status).toBe('running');
  });

  it('escalates to guidance stage when active scenario hits ambiguity', async () => {
    engine.loadScenario('auth-validator');
    await engine.generatePlan();
    engine.approvePlan();

    // Execute Step 1
    await engine.executeCurrentStep();
    expect(engine.getState().currentStepIndex).toBe(1);

    // Execute Step 2
    await engine.executeCurrentStep();
    expect(engine.getState().currentStepIndex).toBe(2);

    // Execute Step 3 (contains intentional question)
    await engine.executeCurrentStep();
    const state = engine.getState();
    expect(state.currentStage).toBe('guidance');
    expect(state.status).toBe('needs_guidance');
    expect(state.activeQuestion).toBeDefined();
    expect(state.activeQuestion?.options.length).toBeGreaterThanOrEqual(2);
  });

  it('resolves decision interception and resumes execution', async () => {
    engine.loadScenario('auth-validator');
    await engine.generatePlan();
    engine.approvePlan();

    await engine.executeCurrentStep(); // Step 1
    await engine.executeCurrentStep(); // Step 2
    await engine.executeCurrentStep(); // Step 3 triggers guidance

    const question = engine.getState().activeQuestion;
    expect(question).toBeDefined();

    // Human decision is made
    engine.resolveQuestion('opt-mem');

    const state = engine.getState();
    expect(state.currentStage).toBe('executor');
    expect(state.status).toBe('executing');
    expect(state.activeQuestion).toBeUndefined();
    expect(state.resolvedQuestions).toHaveLength(1);
    expect(state.currentStepIndex).toBe(3); // Advanced to Step 4
  });

  it('transitions to review stage with diffs upon finishing all steps', async () => {
    engine.loadScenario('webhook-idempotency');
    await engine.generatePlan();
    engine.approvePlan();

    await engine.executeCurrentStep(); // Step 1
    await engine.executeCurrentStep(); // Step 2 (last step)

    const state = engine.getState();
    expect(state.currentStage).toBe('review');
    expect(state.status).toBe('verifying');
    expect(state.diffs.length).toBeGreaterThan(0);
    expect(state.verificationTests.length).toBeGreaterThan(0);
  });
});
