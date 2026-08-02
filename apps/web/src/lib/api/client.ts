export interface ApiWallet {
  id: string
  circleWalletId: string | null
  address: string | null
  usdcBalance: number
  eurcBalance: number
  rewardsBalance: number
}

export interface ApiUser {
  id: string
  privyId: string
  digiHandle: string
  displayName: string | null
  avatarUrl: string | null
  email: string | null
  userType: string
  walletAddress: string | null
  hasWallet: boolean
  hasProfile: boolean
}

export interface ApiSocialAccount {
  id: string
  platform: string
  handle: string
  followers: number
  connected: boolean
}

export interface ApiCommerceScore {
  id: string
  userId: string
  score: number
  audienceReach: number
  engagementRate: number
  postingFrequency: number
  nicheAlignment: number
  locationSignal: number
  niches: string[]
  aiConfidence: number
}

export interface ApiTransaction {
  id: string
  walletId: string
  circleTxId: string | null
  type: string
  description: string
  amount: number
  asset: string
  status: string
  txHash: string | null
  createdAt: string
}

export interface ApiReferral {
  id: string
  userId: string
  campaignId: string
  trackingUrl: string
  clicks: number
  conversions: number
  earnings: number
  active: boolean
  createdAt: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

class ApiClient {
  private getToken: (() => Promise<string | null>) | null = null

  setTokenProvider(provider: () => Promise<string | null>) {
    this.getToken = provider
  }

  private async headers(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    const token = this.getToken ? await this.getToken() : null
    if (token) headers["Authorization"] = `Bearer ${token}`
    return headers
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...(await this.headers()), ...(options.headers ?? {}) },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const rawError = (body as { error?: unknown })?.error
      const message =
        typeof rawError === "string"
          ? rawError
          : `Request failed with status ${res.status}`
      throw new ApiError(res.status, message)
    }

    return res.json() as Promise<T>
  }

  async verify(): Promise<{ authenticated: boolean; user: ApiUser | null }> {
    return this.request("/api/auth/verify")
  }

  async me(): Promise<{ user: ApiUser }> {
    return this.request("/api/auth/me")
  }

  async createProfile(data: {
    digiHandle: string
    displayName?: string
    avatarUrl?: string
    email?: string
    userType?: "creator" | "brand"
  }): Promise<{ user: ApiUser }> {
    return this.request("/api/auth/create-profile", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSocialAccounts(): Promise<{ accounts: ApiSocialAccount[] }> {
    return this.request("/api/social/accounts")
  }

  async linkSocialAccount(data: {
    platform: string
    handle: string
    followers?: number
  }): Promise<{ account: ApiSocialAccount }> {
    return this.request("/api/social/link", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createWallet(): Promise<{ wallet: ApiWallet }> {
    return this.request("/api/wallet/create", {
      method: "POST",
    })
  }

  async getBalance(userId?: string): Promise<{
    balance: { usdcBalance: number; eurcBalance: number; rewardsBalance: number }
  }> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : ""
    return this.request(`/api/wallet/balance${query}`)
  }

  async getActivity(): Promise<{ activity: ApiTransaction[] }> {
    return this.request("/api/wallet/activity")
  }

  async getCommerceScore(): Promise<{ commerceScore: ApiCommerceScore }> {
    return this.request("/api/commerce/commerce-score")
  }

  async pay(data: {
    amount: number
    description: string
    refId?: string
  }): Promise<{ transaction: ApiTransaction }> {
    return this.request("/api/commerce/pay", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async payout(data: {
    amount: number
    description?: string
  }): Promise<{ transaction: ApiTransaction }> {
    return this.request("/api/commerce/payout", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getReferrals(): Promise<{ referrals: ApiReferral[] }> {
    return this.request("/api/commerce/referral")
  }

  async createReferral(data: {
    campaignId: string
    trackingUrl: string
  }): Promise<{ referral: ApiReferral }> {
    return this.request("/api/commerce/referral", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const api = new ApiClient()
