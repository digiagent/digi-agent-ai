# System Architecture Overview

## High-Level Architecture

digi-agent-ai is a modular, multi-agent platform built on a Turborepo + pnpm
workspace monorepo. The architecture follows a layered design:

```
┌─────────────────────────────────────────────┐
│                 Apps Layer                    │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Web (Next) │  │   API (Express)       │  │
│  └──────┬───────┘  └──────────┬───────────┘  │
├─────────┼──────────────────────┼──────────────┤
│         │    Shared Packages   │              │
│  ┌──────┴───────┐  ┌──────────┴───────────┐  │
│  │  @digi/ui    │  │  @digi/types          │  │
│  │  @digi/utils │  │  @digi/config         │  │
│  └──────────────┘  └──────────────────────┘  │
├──────────────────────────────────────────────┤
│              Services Layer                   │
│  agent-engine  commerce-engine  payment       │
│  scoring       social          treasury       │
│  voice         wallet          reward         │
│  recommendation                                │
├──────────────────────────────────────────────┤
│           Integration Modules                 │
│  ┌──────────┐  ┌─────────┐  ┌─────────────┐  │
│  │  Circle  │  │   Arc   │  │  ...others   │  │
│  └──────────┘  └─────────┘  └─────────────┘  │
└──────────────────────────────────────────────┘
```

## Key Principles

1. **Package-first monorepo** — shared code lives in `packages/*`, consumed via
   workspace protocol (`workspace:*`).
2. **Thin apps** — `apps/web` and `apps/api` are thin shells that compose
   packages and services.
3. **Engine isolation** — each engine in `services/*` is independently
   deployable and testable.
4. **Integration adapters** — external services (Circle, Arc) have adapter
   modules under `packages/*`.
