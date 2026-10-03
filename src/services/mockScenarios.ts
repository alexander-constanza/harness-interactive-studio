import { PlanStep, GuidanceQuestion, FileDiff, VerificationTest } from '../types/harness';

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  specPrompt: string;
  steps: PlanStep[];
  question?: GuidanceQuestion;
  diffs: FileDiff[];
  verificationTests: VerificationTest[];
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'auth-validator',
    name: 'Secure Token Auth & Rate Limiter',
    description: 'Builds bearer token validation middleware with sliding window rate limiting and test suite.',
    specPrompt: 'Build an authenticated API middleware that validates bearer tokens, enforces a 100 req/min sliding-window rate limit, and includes unit tests.',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Define Types & Security Interfaces',
        description: 'Define AuthContext, TokenClaims, and RateLimitPolicy interfaces in TypeScript.',
        assignedModel: 'minimax',
        targetFiles: ['src/auth/types.ts'],
        status: 'pending',
        outputSummary: 'Exported TokenClaims, AuthenticatedRequest, and RateLimitResult interfaces.',
        logs: [
          '[minimax] Analyzing security requirements and token structure',
          '[minimax] Generating src/auth/types.ts with strict typing',
          '[minimax] Verified zero type errors'
        ]
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Implement Token Validation Middleware',
        description: 'Create verifyToken middleware checking signature expiry, subject validity, and issuing claims.',
        assignedModel: 'sonnet',
        targetFiles: ['src/auth/middleware.ts'],
        status: 'pending',
        outputSummary: 'Created verifyToken() middleware with timing-safe signature comparison.',
        logs: [
          '[sonnet] Importing crypto and TokenClaims',
          '[sonnet] Implementing timing-safe HMAC/RSA signature verification',
          '[sonnet] Attached validated user payload to request context'
        ]
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Implement Sliding Window Rate Limiter',
        description: 'Construct rate limiter rejecting requests exceeding threshold within rolling 60-second window.',
        assignedModel: 'minimax',
        targetFiles: ['src/auth/rateLimiter.ts'],
        status: 'pending',
        outputSummary: 'Rate limiter ready with exponential backoff headers.',
        logs: [
          '[minimax] Checking cache storage requirements',
          '[minimax] Encounted architectural ambiguity: memory store vs distributed Redis',
          '[minimax] Halting step: escalating to human advisor via Question Protocol'
        ]
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Automated Test Verification',
        description: 'Run Vitest suite verifying token acceptance, rejection, and rate limit boundaries.',
        assignedModel: 'haiku',
        targetFiles: ['src/auth/__tests__/auth.test.ts'],
        status: 'pending',
        outputSummary: '6 tests passing covering expired tokens, malformed headers, and burst traffic.',
        logs: [
          '[haiku] Running vitest run src/auth/__tests__/auth.test.ts',
          '[haiku] PASS: Valid bearer token passes context',
          '[haiku] PASS: Expired token returns 401 Unauthorized',
          '[haiku] PASS: 101st request returns 429 Too Many Requests'
        ]
      }
    ],
    question: {
      id: 'q-auth-store',
      stepId: 'step-3',
      stepTitle: 'Implement Sliding Window Rate Limiter',
      title: 'Rate Limit Storage Engine Selection',
      dilemma: 'The specification does not clarify whether the sliding window counter should persist across distributed servers or reside in-memory for local development.',
      context: 'An in-memory LRU cache requires zero dependencies and starts immediately, whereas Redis is needed if multiple container instances run behind a load balancer.',
      options: [
        {
          id: 'opt-mem',
          label: 'In-Memory Sliding Window (Zero external dependencies)',
          description: 'Fast, lightweight local Map with timestamp expiration. Best for standalone services and unit tests.',
          recommended: true
        },
        {
          id: 'opt-redis',
          label: 'Distributed Redis Atomic Multi-Exec',
          description: 'Production-grade distributed counter using redis sorted sets (ZADD/ZREMRANGEBYSCORE). Requires Redis connection string.'
        },
        {
          id: 'opt-hybrid',
          label: 'Pluggable Storage Adapter Interface',
          description: 'Exposes a RateLimitStore interface with MemoryStore as default and RedisStore as optional provider.'
        }
      ]
    },
    diffs: [
      {
        path: 'src/auth/types.ts',
        status: 'added',
        additions: 38,
        deletions: 0,
        beforeContent: '',
        afterContent: `export interface TokenClaims {
  sub: string;
  role: 'admin' | 'user' | 'service';
  exp: number;
  iat: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimitStore {
  increment(key: string, windowSeconds: number): Promise<RateLimitResult>;
}`
      },
      {
        path: 'src/auth/middleware.ts',
        status: 'added',
        additions: 45,
        deletions: 0,
        beforeContent: '',
        afterContent: `import { Request, Response, NextFunction } from 'express';
import { TokenClaims } from './types';

export function verifyToken(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    const token = authHeader.substring(7);
    try {
      const claims = validateSignatureAndExpiry(token, secret);
      (req as any).user = claims;
      next();
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  };
}`
      },
      {
        path: 'src/auth/rateLimiter.ts',
        status: 'added',
        additions: 52,
        deletions: 0,
        beforeContent: '',
        afterContent: `import { RateLimitResult, RateLimitStore } from './types';

export class MemoryRateLimitStore implements RateLimitStore {
  private windows = new Map<string, number[]>();

  async increment(key: string, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);
    const timestamps = (this.windows.get(key) || []).filter(t => t > windowStart);
    
    const allowed = timestamps.length < 100;
    if (allowed) {
      timestamps.push(now);
      this.windows.set(key, timestamps);
    }

    return {
      allowed,
      remaining: Math.max(0, 100 - timestamps.length),
      resetAt: (timestamps[0] || now) + (windowSeconds * 1000)
    };
  }
}`
      }
    ],
    verificationTests: [
      {
        id: 'test-1',
        name: 'rejects requests with missing Authorization header',
        suite: 'Auth Middleware Suite',
        status: 'passed',
        durationMs: 14,
        output: 'Received 401 Unauthorized with error: Missing or malformed Authorization header'
      },
      {
        id: 'test-2',
        name: 'allows valid signed token and sets req.user context',
        suite: 'Auth Middleware Suite',
        status: 'passed',
        durationMs: 19,
        output: 'Context successfully populated with sub: "usr_9921", role: "admin"'
      },
      {
        id: 'test-3',
        name: 'enforces 100 requests limit within rolling 60s window',
        suite: 'Rate Limiter Suite',
        status: 'passed',
        durationMs: 42,
        output: 'Requests 1-100 allowed (remaining: 0). Request 101 returned allowed: false'
      },
      {
        id: 'test-4',
        name: 'prunes expired timestamps accurately',
        suite: 'Rate Limiter Suite',
        status: 'passed',
        durationMs: 25,
        output: 'Window correctly resets counter when elapsed time exceeds 60,000ms'
      }
    ]
  },
  {
    id: 'webhook-idempotency',
    name: 'Stripe Webhook Receiver with Idempotency',
    description: 'Handles Stripe payment event webhooks with cryptographic signature verification and deduplication.',
    specPrompt: 'Implement a Stripe webhook route that verifies signing secrets, guards against replay attacks using idempotency keys, and records successful receipts.',
    steps: [
      {
        id: 'w-step-1',
        stepNumber: 1,
        title: 'Cryptographic Signature Verification',
        description: 'Verify HMAC-SHA256 signature against Stripe-Signature header.',
        assignedModel: 'sonnet',
        targetFiles: ['src/webhooks/verifySignature.ts'],
        status: 'pending',
        outputSummary: 'Signature verified with timing-safe comparison.',
        logs: ['[sonnet] Parsing Stripe header timestamp and v1 signatures', '[sonnet] Computing HMAC-SHA256 digest']
      },
      {
        id: 'w-step-2',
        stepNumber: 2,
        title: 'Idempotency Cache & Duplicate Rejection',
        description: 'Reject duplicated event IDs with HTTP 200 OK without re-running payment effects.',
        assignedModel: 'minimax',
        targetFiles: ['src/webhooks/idempotency.ts'],
        status: 'pending',
        outputSummary: 'Idempotency registry active with 24h retention.',
        logs: ['[minimax] Registered idempotency check before dispatching payload handler']
      }
    ],
    diffs: [
      {
        path: 'src/webhooks/verifySignature.ts',
        status: 'added',
        additions: 34,
        deletions: 0,
        afterContent: `import crypto from 'crypto';

export function verifyStripeSignature(payload: string, header: string, secret: string): boolean {
  const parts = header.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const signature = parts.find(p => p.startsWith('v1='))?.slice(3);
  if (!timestamp || !signature) return false;

  const expected = crypto.createHmac('sha256', secret).update(\`\${timestamp}.\${payload}\`).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}`
      }
    ],
    verificationTests: [
      {
        id: 'wt-1',
        name: 'validates genuine Stripe signature',
        suite: 'Webhook Suite',
        status: 'passed',
        durationMs: 12
      },
      {
        id: 'wt-2',
        name: 'ignores duplicate webhook event gracefully',
        suite: 'Webhook Suite',
        status: 'passed',
        durationMs: 18
      }
    ]
  }
];
