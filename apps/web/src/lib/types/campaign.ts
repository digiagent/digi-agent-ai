export interface Campaign {
  id: string
  merchant: string
  category: string
  type: 'affiliate' | 'sponsored' | 'referral' | 'digital'
  rewardType: 'percent' | 'fixed'
  reward: number
  estimatedMonthlyMin: number
  estimatedMonthlyMax: number
  matchScore: number
  description: string
  active: boolean
}
