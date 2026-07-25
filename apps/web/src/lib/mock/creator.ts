import type { Creator } from "@/lib/types/creator"

export const mockCreator: Creator = {
  id: "creator_001",
  handle: "@AliciaQ",
  username: "aliciaq",
  type: "creator" as const,
  verified: true,
  avatar: null,
  commerceScore: 87,
  scoreBreakdown: {
    audienceReach: 92,
    engagementRate: 88,
    postingFrequency: 75,
    nicheAlignment: 91,
    locationSignal: 84,
  },
  niches: ["Lifestyle", "Finance", "Latin America"],
  socialAccounts: {
    instagram: { connected: true, followers: 18400, handle: "@aliciaq" },
    twitter: { connected: true, followers: 6200, handle: "@aliciaq" },
    tiktok: { connected: false, followers: 0, handle: null },
  },
  monthlyEarnings: 2450,
  activeCampaigns: 3,
  pendingRewards: 124.5,
}
