export interface MockTransaction {
  id: string
  type: "reward" | "send" | "swap" | "receive" | "yield"
  description: string
  amount: number
  asset: string
  status: "completed" | "pending" | "failed"
  date: string
}

export const mockTransactions: MockTransaction[] = [
  { id: "tx_001", type: "reward", description: "Sketchpad Pro commission", amount: 24.0, asset: "USDC", status: "completed", date: "2026-07-22" },
  { id: "tx_002", type: "send", description: "Sent to @oscar", amount: -10.0, asset: "USDC", status: "completed", date: "2026-07-21" },
  { id: "tx_003", type: "swap", description: "USDC to EURC", amount: -50.0, asset: "USDC", status: "completed", date: "2026-07-20" },
  { id: "tx_004", type: "reward", description: "NovaFit Gear commission", amount: 18.4, asset: "USDC", status: "completed", date: "2026-07-19" },
  { id: "tx_005", type: "receive", description: "Fan tip from @marialuisa", amount: 0.25, asset: "USDC", status: "completed", date: "2026-07-18" },
  { id: "tx_006", type: "yield", description: "Yield earned", amount: 1.2, asset: "USDC", status: "completed", date: "2026-07-17" },
]
