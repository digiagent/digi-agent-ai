# DigiPaga AI — Agent Capability Manifest
Version: 0.1.0
Type: Autonomous Commerce Agent
Network: Arc (Circle stablecoin-native L1)

## Identity
DigiPaga AI is an autonomous commerce agent that enables creators,
freelancers, merchants, and small businesses to earn, manage, and move
money using programmable USDC — with voice, chat, and autonomous triggers.

## Core Capabilities
- COMMERCE_SCORE: Compute a commerce score (0–100) from social + business signals
- CAMPAIGN_MATCH: Match a user profile to affiliate/sponsored campaigns
- REFERRAL_GENERATE: Generate tracked referral links with reward metadata
- PAYOUT_EXECUTE: Trigger USDC payout via Circle Agent Wallet on Arc
- WALLET_QUERY: Return current balances across USDC, EURC, and rewards
- SEND_USDC: Send USDC to a handle, address, or phone number
- SWAP: Swap between USDC and EURC via Circle App Kits
- YIELD_FIND: Find and route idle balance to yield positions
- VOICE_COMMAND: Accept voice input, parse intent, execute wallet actions
- QR_GENERATE: Generate a USDC payment QR code
- FAN_NANOPAY: Accept fan micropayments as small as $0.000001 via Circle Gateway

## Payment Architecture
DigiPaga AI is an orchestration layer only.
Custody: Circle Agent Wallets (MPC-secured)
Settlement: Arc testnet (→ mainnet post-launch)
Gas: USDC-denominated (sub-second finality)
DigiPaga never holds, pools, or custodies user or merchant funds.

## Interoperability
Other agents can interact with DigiPaga AI by:
1. Reading this manifest to discover capabilities
2. Calling the REST API at /api/agent (see docs/api/overview.md)
3. Sending structured commands via the DigiPaga Protocol
   (see packages/protocol/commands/)
4. Future: MCP server at /mcp for agent-to-agent tool calls

## Allowed Actions (agent-initiated)
- Query balances
- Propose swaps (requires user confirmation)
- Send up to $50 USDC autonomously (above requires approval)
- Generate referral links
- Activate campaigns
- Route to yield (within pre-approved allocations)

## Constraints
- Cannot move funds above user-set policy limits without explicit confirmation
- Cannot access funds in external wallets not linked to the Agent Wallet
- Must display receipt (tx hash) for every completed transaction
