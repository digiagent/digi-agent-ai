# API Overview

## Base URL
```
Development: http://localhost:4000
Production:  https://api.digiagent.ai
```

## Authentication
All protected endpoints require a Bearer JWT token:
```
Authorization: Bearer <token>
```

## Endpoints

### Health
```
GET /health
→ { status: "ok", service: "api", version: "1.0.0" }
```

### Agents
```
GET    /api/agents        — List all agents
POST   /api/agents        — Create an agent
GET    /api/agents/:id    — Get agent by ID
PUT    /api/agents/:id    — Update agent
DELETE /api/agents/:id    — Delete agent
POST   /api/agents/:id/action  — Execute agent action
```

### Users
```
GET    /api/users         — List users
POST   /api/users         — Create user
GET    /api/users/:id     — Get user profile
PUT    /api/users/:id     — Update user
```

### Payments (via Circle)
```
POST   /api/payments/circle/transfer
POST   /api/payments/circle/wallet/create
GET    /api/payments/circle/wallet/:id
```

### WebSocket
```
ws://localhost:4000/ws
```
For real-time agent communication and event streaming.
