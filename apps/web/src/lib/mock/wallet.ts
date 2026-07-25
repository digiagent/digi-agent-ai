import type { Wallet } from "@/lib/types/wallet"

export const mockWallet: Wallet = {
  id: "wallet_001",
  totalUsd: 4250.0,
  assets: [
    { symbol: "USDC", name: "USD Coin", balance: 2450.0, chain: "Arc" },
    { symbol: "EURC", name: "EUR Coin", balance: 180.0, chain: "Arc" },
    { symbol: "RWD", name: "Rewards", balance: 124.5, chain: "Arc" },
  ],
  card: {
    lastFour: "4291",
    expiry: "09/28",
    cvv: "***",
    frozen: false,
  },
}
