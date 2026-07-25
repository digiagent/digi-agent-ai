# User Onboarding Flow

## Steps

```
1. User visits web app → lands on splash page
2. Clicks "Get Started" → sign-up form
3. Fills in email + password → POST /api/users
4. Verification email sent → user confirms
5. Wallet created via Circle API → wallet address generated
6. Agent profile initialized → default capabilities assigned
7. Onboarding complete → redirect to dashboard
```

## State Machine

```
REGISTRATION → VERIFICATION → WALLET_CREATION → AGENT_SETUP → COMPLETE
                                                                     │
                                                              ┌──────┘
                                                              ▼
                                                         DASHBOARD
```

## Edge Cases
- Email already in use → show error with "Forgot password?" link
- Circle wallet creation fails → retry with backoff, notify support after 3
  failures
- Incomplete onboarding → resume from last completed step
