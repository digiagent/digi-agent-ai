# Database Schema

## Overview
PostgreSQL database managed via Prisma ORM. Connection handled through the
`packages/database` module.

## Core Tables

### users
| Column     | Type     | Description            |
|-----------|----------|------------------------|
| id        | UUID     | Primary key            |
| email     | String   | Unique email address   |
| name      | String   | Display name           |
| role      | Enum     | admin, agent, member   |
| status    | Enum     | active, inactive, suspended |
| avatar    | String?  | Profile picture URL    |
| created_at| DateTime |                        |
| updated_at| DateTime |                        |

### agents
| Column      | Type     | Description          |
|------------|----------|----------------------|
| id         | UUID     | Primary key          |
| name       | String   | Agent name           |
| capabilities | JSON   | Array of capabilities |
| config     | JSON     | Agent configuration  |
| active     | Boolean  |                      |
| user_id    | UUID     | FK to users          |

### wallets (via Circle)
| Column   | Type     | Description          |
|---------|----------|----------------------|
| id      | UUID     | Primary key          |
| user_id | UUID     | FK to users          |
| address | String   | Blockchain address   |
| chain   | String   | Blockchain network   |
| balance | Decimal  | Current balance      |

### transactions
| Column     | Type     | Description       |
|-----------|----------|-------------------|
| id        | UUID     | Primary key       |
| wallet_id | UUID     | FK to wallets     |
| type      | Enum     | credit, debit     |
| amount    | Decimal  |                   |
| status    | Enum     | pending, completed, failed |
| reference | String?  | External reference |
| created_at| DateTime |                   |
