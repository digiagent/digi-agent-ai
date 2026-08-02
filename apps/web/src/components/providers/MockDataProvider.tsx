"use client"

import { createContext, useContext, useMemo, type ReactNode } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import { mockCreator } from "@/lib/mock/creator"
import { mockWallet } from "@/lib/mock/wallet"
import { mockCampaigns } from "@/lib/mock/campaigns"
import { mockTransactions, type MockTransaction } from "@/lib/mock/transactions"
import type { Creator } from "@/lib/types/creator"
import type { Wallet } from "@/lib/types/wallet"
import type { Campaign } from "@/lib/types/campaign"

interface MockDataContext {
  creator: Creator
  wallet: Wallet
  campaigns: Campaign[]
  transactions: MockTransaction[]
  loading: boolean
}

const MockDataContext = createContext<MockDataContext | null>(null)

export function MockDataProvider({ children }: { children: ReactNode }) {
  const { authenticated, ready } = usePrivy()
  const isAuthed = ready && authenticated

  const userQuery = useQuery({
    queryKey: ["auth", "verify"],
    queryFn: () => api.verify(),
    enabled: isAuthed,
    staleTime: 30_000,
  })

  const userId = userQuery.data?.user?.id

  const balanceQuery = useQuery({
    queryKey: ["wallet", "balance", userId],
    queryFn: () => api.getBalance(userId),
    enabled: isAuthed && Boolean(userId),
    staleTime: 30_000,
  })

  const activityQuery = useQuery({
    queryKey: ["wallet", "activity"],
    queryFn: () => api.getActivity(),
    enabled: isAuthed,
    staleTime: 30_000,
  })

  const scoreQuery = useQuery({
    queryKey: ["commerce", "score"],
    queryFn: () => api.getCommerceScore(),
    enabled: isAuthed,
    staleTime: 60_000,
  })

  const socialQuery = useQuery({
    queryKey: ["social", "accounts"],
    queryFn: () => api.getSocialAccounts(),
    enabled: isAuthed,
    staleTime: 60_000,
  })

  const data = useMemo<MockDataContext>(() => {
    if (!isAuthed) {
      return {
        creator: mockCreator,
        wallet: mockWallet,
        campaigns: mockCampaigns,
        transactions: mockTransactions,
        loading: false,
      }
    }

    const apiUser = userQuery.data?.user
    const commerceScore = scoreQuery.data?.commerceScore
    const balance = balanceQuery.data?.balance
    const activity = activityQuery.data?.activity
    const accounts = socialQuery.data?.accounts ?? []

    const totalUsd =
      (balance?.usdcBalance ?? 0) +
      (balance?.eurcBalance ?? 0) +
      (balance?.rewardsBalance ?? 0)

    const walletAssets = [
      {
        symbol: "USDC",
        name: "USD Coin",
        balance: balance?.usdcBalance ?? 0,
        chain: "Arc",
      },
      {
        symbol: "EURC",
        name: "EUR Coin",
        balance: balance?.eurcBalance ?? 0,
        chain: "Arc",
      },
      {
        symbol: "RWD",
        name: "Rewards",
        balance: balance?.rewardsBalance ?? 0,
        chain: "Arc",
      },
    ]

    const handle = apiUser?.digiHandle ?? mockCreator.handle
    const realTransactions: MockTransaction[] = (activity ?? []).map((tx) => ({
      id: tx.id,
      type: tx.type === "payout" || tx.amount > 0 ? "reward" : "send",
      description: tx.description,
      amount: tx.amount,
      asset: tx.asset,
      status: tx.status === "COMPLETE" || tx.status === "CONFIRMED" ? "completed" : "pending",
      date: new Date(tx.createdAt).toLocaleDateString(),
    }))

    const socialAccounts: Creator["socialAccounts"] = {
      instagram: { connected: false, followers: 0, handle: null },
      twitter: { connected: false, followers: 0, handle: null },
      tiktok: { connected: false, followers: 0, handle: null },
    }
    for (const account of accounts) {
      const key = account.platform === "x" ? "twitter" : account.platform
      socialAccounts[key as keyof typeof socialAccounts] = {
        connected: account.connected,
        followers: account.followers,
        handle: account.handle ? `@${account.handle}` : null,
      }
    }

    const creator: Creator = {
      ...mockCreator,
      handle,
      username: apiUser?.digiHandle ?? mockCreator.username,
      commerceScore: commerceScore?.score ?? mockCreator.commerceScore,
      scoreBreakdown: commerceScore
        ? {
            audienceReach: commerceScore.audienceReach,
            engagementRate: commerceScore.engagementRate,
            postingFrequency: commerceScore.postingFrequency,
            nicheAlignment: commerceScore.nicheAlignment,
            locationSignal: commerceScore.locationSignal,
          }
        : mockCreator.scoreBreakdown,
      niches: commerceScore?.niches?.length
        ? commerceScore.niches
        : mockCreator.niches,
      socialAccounts,
      monthlyEarnings: realTransactions
        .filter((tx) => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0),
      pendingRewards: balance?.rewardsBalance ?? mockCreator.pendingRewards,
    }

    const wallet: Wallet = {
      id: "wallet_live",
      totalUsd,
      assets: walletAssets,
      card: mockWallet.card,
    }

    return {
      creator,
      wallet,
      campaigns: mockCampaigns,
      transactions: realTransactions.length
        ? realTransactions
        : mockTransactions,
      loading:
        userQuery.isLoading || balanceQuery.isLoading || activityQuery.isLoading,
    }
  }, [
    isAuthed,
    userQuery.data,
    userQuery.isLoading,
    userId,
    balanceQuery.data,
    balanceQuery.isLoading,
    activityQuery.data,
    activityQuery.isLoading,
    scoreQuery.data,
    socialQuery.data,
  ])

  return (
    <MockDataContext.Provider value={data}>
      {children}
    </MockDataContext.Provider>
  )
}

export function useMockData(): MockDataContext {
  const ctx = useContext(MockDataContext)
  if (!ctx) throw new Error("useMockData must be used within MockDataProvider")
  return ctx
}
