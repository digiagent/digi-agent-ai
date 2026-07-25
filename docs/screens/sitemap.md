# Site Map

## Public Routes
```
/                   — Landing / splash page
/auth/login         — Login page
/auth/register      — Registration page
/auth/verify        — Email verification
```

## Authenticated Routes
```
/dashboard          — Main dashboard (agent overview)
/dashboard/agents   — Agent management
/dashboard/agents/[id] — Single agent detail
/dashboard/wallet   — Wallet & balances
/dashboard/analytics — Performance metrics
/dashboard/settings — User settings
/dashboard/activity — Activity log
```

## API Routes (Express)
```
GET    /health
POST   /auth/login
POST   /auth/register
GET    /api/agents
POST   /api/agents
GET    /api/agents/:id
PUT    /api/agents/:id
DELETE /api/agents/:id
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
POST   /api/payments/circle/transfer
POST   /api/payments/circle/wallet/create
GET    /api/payments/circle/wallet/:id
```

## Layout Structure
```
┌─────────────────────────────────┐
│         Navigation              │
├──────────┬──────────────────────┤
│ Sidebar  │   Main Content       │
│ (nav)    │   (page content)     │
│          │                      │
├──────────┴──────────────────────┤
│         Footer                  │
└─────────────────────────────────┘
```
