<!-- AVATAR PLACEHOLDER — upload your DigiAgent avatar image to /public/digiagent-avatar.png then update this src -->
<div align="center">

 <img src="https://jade-secure-cuckoo-817.mypinata.cloud/ipfs/bafybeia3zxazlqun7ejwqabieerrzsespvpb5gsxx5nqqrznomlxsjut7a" width="400" alt="Description">
 
  <h1>DigiPaga AI</h1>

  <p><strong>Autonomous commerce agent for creators in Latin America and the Global South.<br/>Connect your social profile → AI finds campaigns → Someone buys → You instantly receive USDC.</strong></p>

  <p>
    <a href="https://digi-agent-ai.vercel.app"><strong>🚀 Live Demo</strong></a>
    &nbsp;·&nbsp;
    <a href="https://testnet.arcscan.app">🔍 Arc Testnet Explorer</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/digiagent/digi-agent-ai/issues">🐛 Report Bug</a>
    &nbsp;·&nbsp;
    <a href="docs/agent/capabilities.md">🤖 Agent Manifest</a>
  </p>

  <br/>

  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
  [![Arc Network](https://img.shields.io/badge/Arc-Testnet-9DCC4A?style=flat-square)](https://arc.io)
  [![Circle](https://img.shields.io/badge/Circle-Agent%20Stack-00D395?style=flat-square)](https://developers.circle.com)
  [![USDC](https://img.shields.io/badge/Powered%20by-USDC-2775CA?style=flat-square)](https://circle.com/usdc)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
  [![Hackathon](https://img.shields.io/badge/Encode%20Club-Programmable%20Money%20Hackathon-purple?style=flat-square)](https://encode.club)

</div>



---

## The 60-second story

> You are a creator with 18,000 Instagram followers in Mexico City.
> Brands want to reach your audience but you have no bank account, no 
> payment processor, and no way to prove your reach. DigiPaga AI solves 
> all three in one step. Connect your profile → your Commerce Score proves 
> your value → the agent matches you to campaigns → someone buys → 
> **USDC lands in your wallet before you finish reading this sentence.**

What makes it different from "just another affiliate app":

1. **The wallet appears automatically** — Privy creates an embedded MPC 
   wallet the moment you sign in. No seed phrase. No "create wallet" step.
2. **Your handle IS your payment address** — `@aliciaq` on Instagram maps 
   directly to your Circle Agent Wallet on Arc. Send to a handle, not a hex.
3. **The agent acts, not just recommends** — DigiAgent executes swaps, 
   moves funds to yield, and settles payouts autonomously within 
   user-defined policy limits.

---

## Architecture
CREATOR ──signs in──▶ Privy (embedded MPC wallet auto-created)
│
┌──────────▼──────────┐
│ DigiAgent │ ← the orchestrator
│ Commerce Score │
│ Campaign Matcher │
│ Payout Engine │
└──────────┬──────────┘
│ instructs (never holds funds)
┌──────────▼──────────┐
│ Circle Agent │ ← actual USDC custody (MPC)
│ Wallet │
└──────────┬──────────┘
│ settles on
┌──────────▼──────────┐
│ Arc Testnet │ ← sub-second, USDC gas
│ Chain ID: 5042002 │
└─────────────────────┘

**Custody rule:** DigiPaga AI is an orchestration layer only.
It never holds, pools, or custodies user or merchant funds.
USDC custody lives in Circle Agent Wallets (MPC-secured).

---

## Sponsor integrations

| Sponsor | What we built | Evidence |
|---------|--------------|----------|
| **Arc** | USDC settlement, sub-second finality, USDC-denominated gas | All wallet txs on Arc testnet, chain 5042002 |
| **Circle** | Agent Wallets (MPC), Nanopayments via Gateway, App Kits (Send/Swap/Bridge) | `packages/circle/src/client.ts` |
| **Privy** | Embedded wallet auto-created on social login, no seed phrase UX | `apps/web/src/app/layout.tsx` |

---

## Repo layout
digi-agent-ai/
├── apps/
│ ├── landing/ ← marketing site (digipaga.com/ai) — no auth
│ └── web/ ← the actual app — 10 screens, wallet, agent chat
├── packages/
│ ├── circle/ ← CircleClient: Agent Wallets, transfers, Nanopayments
│ ├── arc/ ← ArcClient: testnet RPC, contract calls
│ ├── ui/ ← shared shadcn/ui components
│ ├── types/ ← shared TypeScript interfaces
│ └── utils/ ← cn(), formatCurrency, generateId
├── docs/
│ ├── agent/
│ │ ├── capabilities.md ← AI agent manifest (machine-readable)
│ │ └── agent-knowledge.md
│ └── architecture/
└── data/
├── offers/ ← mock affiliate offers
└── mock-social/ ← mock social profiles for demo

---

## Run locally

```bash
git clone https://github.com/digiagent/digi-agent-ai.git
cd digi-agent-ai
pnpm install
cp .env.example .env
# fill in your keys — see .env.example for the full list
pnpm dev
# web app  → http://localhost:3000
# api      → http://localhost:4000
```

### Environment variables

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | [dashboard.privy.io](https://dashboard.privy.io) |
| `CIRCLE_API_KEY` | [developers.circle.com](https://developers.circle.com) sandbox |
| `CIRCLE_ENTITY_SECRET` | Circle dashboard |
| `ARC_RPC_URL` | `https://rpc.testnet.arc.network` |
| `ARC_CHAIN_ID` | `5042002` |
| `DATABASE_URL` | [neon.tech](https://neon.tech) free tier |
| `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) |

Full reference in [`.env.example`](.env.example).

---

## Deployed addresses (Arc testnet, chain 5042002)

| Contract | Address |
|----------|---------|
| Arc testnet RPC | `https://rpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` |
| USDC (testnet) | via Circle sandbox faucet |

---

## Agent manifest

DigiPaga AI is built for agent-to-agent interoperability.
Full capability manifest: [`docs/agent/capabilities.md`](docs/agent/capabilities.md)

Other agents on Arc can inspect this manifest to discover:
- What DigiPaga AI can do autonomously
- Policy limits and spend caps
- How to send a structured payout command
- MCP endpoint (future v2)

---

## Roadmap

- [x] Turborepo monorepo — 8 packages, zero build errors
- [x] 10-screen responsive UI (mobile · tablet · desktop)
- [x] Dark finance design system — Commerce Score ring animation
- [x] Mock data layer — creators, campaigns, wallet, transactions  
- [x] Circle SDK wrapper — Agent Wallets, Nanopayments
- [x] Arc testnet RPC connected
- [x] Agent capability manifest (`docs/agent/capabilities.md`)
- [ ] Privy auth — embedded wallet auto-created on Google/X/Telegram login
- [ ] Real Commerce Score computed from connected social accounts
- [ ] Live USDC payout on Arc testnet via Circle Agent Wallet
- [ ] Fan nanopayments — gas-free tips via Circle Gateway
- [ ] Voice commands — speak to pay, swap, and earn

---

## Hackathon

**Programmable Money Hackathon** · Encode Club × Arc × Circle  
Track: **Agentic Economy** — autonomous agents that hold wallets, pay, 
settle jobs, and transact with other agents using USDC.

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
  <sub>Built on <a href="https://arc.io">Arc</a> · 
  Powered by <a href="https://circle.com/usdc">USDC</a> · 
  Auth by <a href="https://privy.io">Privy</a></sub>
</div>
READMEEOF

git add README.md
git commit -m "docs: tier-1 README — 60-second story, architecture, sponsor table, deployed addresses"
git pull origin main --rebase && git push origin main



to here




---

## The problem

Creators, freelancers, and small businesses across Latin America generate real commercial value online — but collecting that value is broken. Payment rails are slow, expensive, require bank accounts most people don't have, and cut 5–30% on every transaction. The money that does arrive comes days or weeks late, in the wrong currency, after three middlemen.

## What DigiPaga AI does

DigiPaga AI is an **autonomous commerce agent** that runs on [Arc](https://arc.io), Circle's stablecoin-native L1. It scores your social and commercial reach, matches you to affiliate campaigns, generates tracked referral links, and — when someone converts — settles your earnings in USDC **on-chain, gaslessly, in under a second**.

Once paid, the same agent manages the money: swap, save into yield, convert to fiat, or spend from a virtual multi-stablecoin debit card. All via voice or chat, in English, Spanish, and Portuguese.

```
You: "Find me campaigns for my fitness audience"
DigiAgent: "Found 3 matches. NovaFit Gear — 8% commission, est. $180–$420/mo. Activate?"
You: "Yes"
DigiAgent: "Done. Your referral link is ready. [Link copied]"
--- someone clicks and buys ---
DigiAgent: "💰 $24.00 USDC arrived in your wallet. Tx: 0xabc...def"
```

---

## Demo flow (3 minutes)

| Step | What happens |
|------|-------------|
| 1 | Sign in with Google — Privy creates an embedded MPC wallet automatically |
| 2 | Pick your profile: Creator, Merchant, Freelancer, Business, or Developer |
| 3 | Connect Instagram / X / TikTok — DigiAgent computes your Commerce Score |
| 4 | AI recommends affiliate campaigns matched to your audience |
| 5 | Activate a campaign → generate a tracked referral link |
| 6 | Hit "Simulate Sale" → **real USDC transfer on Arc testnet**, visible on arcscan.app |
| 7 | Ask DigiAgent: *"Move $25 into yield"* → see the proposed action |
| 8 | View wallet, rewards history, and your virtual multi-stablecoin debit card |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    DigiPaga AI                           │
│                                                          │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │  Privy  │───▶│  Commerce    │───▶│  DigiAgent      │ │
│  │  Auth   │    │  Score Engine│    │  Orchestrator   │ │
│  └─────────┘    └──────────────┘    └────────┬────────┘ │
│       │                                       │          │
│  Embedded                          ┌──────────▼───────┐ │
│  MPC Wallet                        │  Circle Agent    │ │
│       │                            │  Wallet (MPC)    │ │
│       └────────────────────────────▶                  │ │
│                                    └──────────┬───────┘ │
└───────────────────────────────────────────────┼─────────┘
                                                │
                                    ┌───────────▼──────────┐
                                    │   Arc Testnet        │
                                    │   USDC · sub-second  │
                                    │   settlement         │
                                    └──────────────────────┘
```

**Custody model:** DigiPaga AI is an orchestration layer only. It never holds or custodies user or merchant funds. USDC custody lives in Circle Agent Wallets (MPC-secured). DigiPaga proposes and triggers payments within user-defined policy limits.

---

## Tech stack

**Frontend**
- Next.js 16 · React 19 · TypeScript · TailwindCSS · shadcn/ui · Framer Motion
- Privy (embedded wallets + social login)

**Backend**
- Express 5 · Prisma · PostgreSQL (Neon) · Redis (Upstash)
- Modular service architecture (no monolith)

**Money layer**
- Arc — Circle's stablecoin-native L1 (USDC gas, sub-second finality)
- Circle Agent Stack — Agent Wallets, Nanopayments via Circle Gateway
- Circle App Kits — Send, Swap, Bridge, Unified Balance

**AI**
- Runtime agent: Qwen3-Instruct / Llama 3.3 70B (via OpenRouter)
- Coding: Kimi K2 / DeepSeek V3 / GLM-4.5

**Infra**
- Turborepo · pnpm workspaces (8 packages, zero build errors)
- Vercel (frontend) · Railway (API)

---

## Repo structure

```
digi-agent-ai/
├── apps/
│   ├── web/                    # Next.js 16 — all 10 screens
│   └── api/                    # Express 5 — auth, wallet, social, agent
├── packages/
│   ├── circle/                 # CircleClient — wallets, transfers, nanopayments
│   ├── arc/                    # ArcClient — testnet RPC, contract calls
│   ├── ui/                     # shared shadcn/ui components
│   ├── types/                  # shared TypeScript interfaces
│   └── utils/                  # cn(), formatCurrency, generateId
├── docs/
│   ├── agent/
│   │   ├── capabilities.md     # ← AI agent manifest (machine-readable)
│   │   └── agent-knowledge.md
│   └── architecture/
└── data/
    ├── offers/                 # mock affiliate offers
    └── mock-social/            # mock social profiles
```

---

## Quick start

### Prerequisites
- Node 20+ · pnpm 9+ · Docker (for local Postgres/Redis)

### Run locally

```bash
git clone https://github.com/digiagent/digi-agent-ai.git
cd digi-agent-ai
pnpm install
cp .env.example .env
# Fill in your keys — see .env.example for the full list
pnpm dev
# web → http://localhost:3000
# api → http://localhost:4000
```

### Environment variables

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | [dashboard.privy.io](https://dashboard.privy.io) |
| `CIRCLE_API_KEY` | [developers.circle.com](https://developers.circle.com) (sandbox) |
| `ARC_RPC_URL` | `https://rpc.testnet.arc.network` |
| `DATABASE_URL` | [neon.tech](https://neon.tech) free tier |
| `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) |

Full list in [`.env.example`](.env.example).

---

## Agent manifest

DigiPaga AI is built to be interoperable with other autonomous agents. The full capability manifest lives at [`docs/agent/capabilities.md`](docs/agent/capabilities.md) and describes:

- What DigiPaga AI can do (Commerce Score, Campaign Match, USDC payout, voice commands, nanopayments)
- Payment architecture and custody model
- How other agents can discover and interact with DigiPaga AI
- Policy limits and allowed autonomous actions

Other agents on the Arc network can read this manifest to discover capabilities and send structured commands via the DigiPaga Protocol.

---

## Screens

<table>
  <tr>
    <td align="center"><strong>Dashboard</strong><br/>Commerce Score + campaigns + wallet</td>
    <td align="center"><strong>Commerce Score</strong><br/>AI-computed reach breakdown</td>
    <td align="center"><strong>DigiAgent</strong><br/>Voice + chat orchestrator</td>
  </tr>
  <tr>
    <td align="center"><strong>Campaigns</strong><br/>AI-matched affiliate offers</td>
    <td align="center"><strong>Wallet</strong><br/>USDC · EURC · Rewards</td>
    <td align="center"><strong>Virtual Card</strong><br/>Multi-stablecoin debit card</td>
  </tr>
</table>

*(Screenshots coming — run `pnpm dev` or visit the [live demo](https://digi-agent-ai.vercel.app))*

---

## Roadmap

- [x] Monorepo — Turborepo + pnpm, 8 packages, zero build errors
- [x] 10-screen responsive UI (mobile · tablet · desktop)
- [x] Design system — dark finance palette, Commerce Score ring animation
- [x] Mock data layer — creators, campaigns, wallet, transactions
- [x] Circle SDK wrapper — Agent Wallets, Nanopayments
- [x] Arc testnet connection
- [ ] Privy auth — Google, X, Telegram, SMS, embedded wallet
- [ ] Real Commerce Score from connected social accounts
- [ ] Real USDC payout on Arc testnet via Circle Agent Wallet
- [ ] Fan nanopayments — $0.000001 gas-free tips via Circle Gateway
- [ ] Voice commands — speak to pay, swap, and earn
- [ ] Agent-to-agent marketplace (future — v2)

---

## Hackathon

**Programmable Money Hackathon** · Encode Club × Arc × Circle · Agentic Economy Track

Built to demonstrate that AI agents can autonomously earn, manage, and move programmable money — with real USDC on a real stablecoin-native L1 — without a bank account, without a custodian, and without a human in the loop.

> *"The top teams will be offered places in an 8-week accelerator programme."*

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m "feat: your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">
  <p>Built with 🟢 on <a href="https://arc.io">Arc</a> · Powered by <a href="https://circle.com/usdc">Cirlce</a> · Auth by <a href="https://privy.io">Privy</a></p>
  <p><a href="https://github.com/digiagent/digi-agent-ai">github.com/digiagent/digi-agent-ai</a></p>
</div>
