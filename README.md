# Harness Interactive Studio ⚡

> **Calm, Step-by-Step AI Agent Orchestration & Build Studio**

Harness Interactive Studio eliminates the cognitive overload typical of multi-agent architectures and raw terminal build harnesses. Instead of dumping chaotic logs, background processes, and unformatted streams onto the screen all at once, it presents a clean, linear, five-stage studio:

```
[ 1. Task Specification ] 
           ↓
[ 2. Advisor Decomposition (Opus 4.6) ] 
           ↓
[ 3. Focused Step Execution (MiniMax / Sonnet) ] 
           ↓
[ 4. Decision Intercept (Human-in-the-Loop) ] 
           ↓
[ 5. Diff Inspection & Automated Verification ]
```

---

## Key Features

1. **Focused Viewport:** Only the active execution step is shown front-and-center. Distracting background noise is eliminated.
2. **Dual-Tier Model Governance:** 
   - **Advisor (Opus 4.6):** Strategic planning and task decomposition without burning tokens on file I/O.
   - **Executors (MiniMax M2.7 / Claude Sonnet / Haiku):** Cost-effective, isolated task execution.
3. **Question Interception Protocol:** When an executor encounters architectural ambiguity or missing constraints, it halts cleanly with a `NEEDS_GUIDANCE` status and emits a structured decision card with recommended options.
4. **Diff & Verification Inspector:** Review exact file additions, deletions, and automated test assertions before finalizing or deploying.
5. **Pre-configured Real-World Scenarios:** Instant exploration with scenarios like *Secure Token Auth & Rate Limiter* or *Stripe Webhook Receiver with Idempotency*.

---

## Quick Start

### 1. Installation
```bash
cd apps/harness-interactive-studio
npm install
```

### 2. Start Development Studio
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## Architectural Map

```
apps/harness-interactive-studio/
├── src/
│   ├── types/
│   │   └── harness.ts          # Core domain models (Stages, Steps, Questions, Diffs)
│   ├── services/
│   │   ├── harnessEngine.ts    # Observable state machine & lifecycle controller
│   │   └── mockScenarios.ts    # Deterministic scenarios & guidance dilemmas
│   ├── components/
│   │   ├── Header.tsx          # Studio status & GitHub deployment indicators
│   │   ├── LinearStepper.tsx   # 5-stage breadcrumb navigation bar
│   │   ├── SpecInputStage.tsx  # Stage 1: Clean goal definition & scenario picker
│   │   ├── AdvisorStage.tsx    # Stage 2: Decomposed atomic plan cards
│   │   ├── ExecutorStage.tsx   # Stage 3: Step-by-step active executor viewport
│   │   ├── QuestionModal.tsx   # Stage 4: Decision interception & human resolution
│   │   └── ReviewDiffStage.tsx # Stage 5: Diff viewer & test verification suite
│   ├── tests/
│   │   ├── harnessEngine.test.ts # State machine & escalation test suite
│   │   └── stepper.test.tsx      # UI component interaction tests
│   ├── App.tsx                 # Root coordinator
│   └── main.tsx                # React entrypoint
```

---

## License
MIT
