export interface Creator {
  id: string
  handle: string
  username: string
  type: 'creator' | 'merchant' | 'freelancer' | 'business' | 'developer'
  verified: boolean
  avatar: string | null
  commerceScore: number
  scoreBreakdown: ScoreBreakdown
  niches: string[]
  socialAccounts: Record<string, SocialAccount>
  monthlyEarnings: number
  activeCampaigns: number
  pendingRewards: number
}

export interface ScoreBreakdown {
  audienceReach: number
  engagementRate: number
  postingFrequency: number
  nicheAlignment: number
  locationSignal: number
}

export interface SocialAccount {
  connected: boolean
  followers: number
  handle: string | null
}
