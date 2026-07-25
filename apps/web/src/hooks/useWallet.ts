"use client"

import { useMockData } from "@/components/providers/MockDataProvider"

export function useWallet() {
  const { wallet, transactions } = useMockData()
  return { wallet, transactions }
}
