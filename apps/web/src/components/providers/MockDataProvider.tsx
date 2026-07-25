"use client"

import { createContext, useContext, type ReactNode } from "react"
import { mockCreator } from "@/lib/mock/creator"
import { mockWallet } from "@/lib/mock/wallet"
import { mockCampaigns } from "@/lib/mock/campaigns"
import { mockTransactions } from "@/lib/mock/transactions"
import type { Creator } from "@/lib/types/creator"
import type { Wallet } from "@/lib/types/wallet"
import type { Campaign } from "@/lib/types/campaign"
import type { MockTransaction } from "@/lib/mock/transactions"

interface MockDataContext {
  creator: Creator
  wallet: Wallet
  campaigns: Campaign[]
  transactions: MockTransaction[]
}

const MockDataContext = createContext<MockDataContext | null>(null)

export function MockDataProvider({ children }: { children: ReactNode }) {
  return (
    <MockDataContext.Provider
      value={{
        creator: mockCreator,
        wallet: mockWallet,
        campaigns: mockCampaigns,
        transactions: mockTransactions,
      }}
    >
      {children}
    </MockDataContext.Provider>
  )
}

export function useMockData(): MockDataContext {
  const ctx = useContext(MockDataContext)
  if (!ctx) throw new Error("useMockData must be used within MockDataProvider")
  return ctx
}
