export interface Wallet {
  id: string
  totalUsd: number
  assets: WalletAsset[]
  card: VirtualCard
}

export interface WalletAsset {
  symbol: string
  name: string
  balance: number
  chain: string
}

export interface VirtualCard {
  lastFour: string
  expiry: string
  cvv: string
  frozen: boolean
}
