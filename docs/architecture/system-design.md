# System Design

## Data Flow

```
User → Web App (Next.js) → API Gateway (Express) → Engine Services
                                                         │
                                                    ┌────┴────┐
                                                    │ Circle  │
                                                    │ Arc     │
                                                    └─────────┘
```

## Component Design

### Web App (`apps/web`)
- Next.js 16 App Router (React 19)
- Tailwind CSS v4 + shadcn/ui for components
- Framer Motion for animations
- Zustand for client state, React Query for server state
- Consumes `@digi/ui`, `@digi/utils`, `@digi/types`

### API (`apps/api`)
- Express 5 server with Prisma ORM
- WebSocket support for real-time agent communication
- AI SDK integration (OpenAI, Google, Ollama)
- JWT + NextAuth authentication

### Shared Packages
- `@digi/ui` — shadcn-based component library
- `@digi/types` — TypeScript type definitions
- `@digi/utils` — utility functions (cn, formatting, etc.)
- `@digi/config` — shared configs (ESLint, TS, Tailwind)

## Security
- All secrets managed via environment variables
- JWT tokens for API authentication
- CORS configured on API gateway
- Input validation via Zod schemas
