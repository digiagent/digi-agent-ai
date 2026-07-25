import type { AgentMessage } from "@/lib/types/agent"

export const agentConversation: AgentMessage[] = [
  {
    role: "assistant",
    content: "Hi @AliciaQ, what do you need?",
    timestamp: "5:00 PM",
  },
  {
    role: "user",
    content: "Find me the best campaigns for my audience",
    timestamp: "5:01 PM",
  },
  {
    role: "assistant",
    content:
      "Based on your Commerce Score and audience profile, I found 3 top matches:",
    cards: ["camp_002", "camp_001", "camp_003"],
    timestamp: "5:01 PM",
  },
]

export const agentQuickActions = [
  { label: "Find campaigns", prompt: "Find campaigns matching my profile" },
  { label: "Check balance", prompt: "What is my current USDC balance?" },
  { label: "Send USDC", prompt: "I want to send USDC" },
  { label: "Swap", prompt: "Swap USDC to EURC" },
  { label: "Find yield", prompt: "Find the best yield for my idle USDC" },
  {
    label: "Generate link",
    prompt: "Generate a referral link for my top campaign",
  },
]
