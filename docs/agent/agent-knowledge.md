# Agent Knowledge Layer

## Purpose
This document serves as the knowledge base for AI agents operating within the
digi-agent-ai ecosystem. Agents use this context to understand their
capabilities, constraints, and integration points.

## Agent Identity
- **Name:** digi-agent
- **Type:** Autonomous AI agent
- **Version:** 1.0.0
- **Framework:** AI SDK (Vercel)

## Capabilities
| Capability       | Description                              | Module                |
|-----------------|------------------------------------------|-----------------------|
| conversation    | Natural language chat                    | packages/ai           |
| payment         | Send/receive USDC via Circle             | packages/circle       |
| scoring         | Reputation and trust scoring             | packages/scoring      |
| recommendation  | Content/product recommendations          | packages/ai           |
| wallet          | Wallet management                        | packages/wallet       |
| social          | Social media engagement                  | packages/affiliate    |
| voice           | Speech-to-text and text-to-speech        | packages/voice        |
| affiliate       | Affiliate link management                | packages/affiliate    |

## Integration Points

### Circle (USDC Payments)
- Create wallets
- Check balances
- Transfer USDC
- View transaction history

### Arc (Blockchain)
- Smart contract interactions
- Token management
- On-chain data queries

## Communication Protocol
- REST API for synchronous operations
- WebSocket for real-time events
- Server-Sent Events (SSE) for streaming responses

## Constraints
- Rate limit: 100 requests/minute per agent
- Max wallet balance: $10,000 USD
- Daily transfer limit: $1,000 USD (adjustable by admin)
- Supported blockchains: Ethereum, Polygon, Solana

## Error Handling
Agents should implement exponential backoff for transient failures and escalate
persistent errors to the admin dashboard.
