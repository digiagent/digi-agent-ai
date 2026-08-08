export interface DigiUser {
  id: string
  privyId: string
  digiHandle: string
  displayName?: string | null
  email?: string | null
  walletAddress?: string | null
  userType: string
}

export interface DigiWallet {
  id: string
  address?: string | null
  circleWalletId?: string | null
  usdcBalance: number
  eurcBalance: number
  rewardsBalance: number
}

export interface SyncResponse {
  user: DigiUser
  wallet: DigiWallet
  digiHandle: string
}

export interface BalanceResponse {
  usdc: number
  eurc: number
  rewards: number
  address?: string
}

export interface TransactionItem {
  id: string
  type: string
  description: string
  amount: number
  asset: string
  status: string
  txHash?: string | null
  createdAt: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  hashtag: string
  rewardUsdc: string
  twitterText: string
}

export interface VerifyTweetResponse {
  success: boolean
  txHash?: string
  explorerUrl?: string
  amount?: string
  error?: string
}

export interface TipResponse {
  success: boolean
  txHash?: string
  explorerUrl?: string
  amount?: string
  toHandle?: string
  error?: string
}
