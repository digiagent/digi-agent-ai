"use client"

import { useMockData } from "@/components/providers/MockDataProvider"

export function useCommerceScore() {
  const { creator } = useMockData()
  return {
    score: creator.commerceScore,
    breakdown: creator.scoreBreakdown,
    tier: creator.commerceScore >= 80 ? "Pro Creator" : creator.commerceScore >= 60 ? "Rising Creator" : "Starter",
  }
}
