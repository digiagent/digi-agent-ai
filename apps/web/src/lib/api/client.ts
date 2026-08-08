const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request(path: string, options?: RequestInit): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error: ${res.status} - ${error}`);
  }
  return res.json();
}

export const api = {
  request,
  get: async (path: string) => request(path),
  post: async (path: string, body: any) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),

  // Auth
  verify: (privyId?: string, walletAddress?: string, displayName?: string, email?: string) =>
    request('/auth/verify' + (privyId ? `?privyId=${privyId}` : '')),
  syncUser: (data: any) => request('/auth/sync', { method: 'POST', body: JSON.stringify(data) }),
  createProfile: (data: any) => request('/auth/sync', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (data: any) => request('/auth/sync', { method: 'POST', body: JSON.stringify(data) }),

  // Onboarding / Social
  linkSocialAccount: (data: any) => request('/social/connect', { method: 'POST', body: JSON.stringify(data) }),
  getSocialScore: (userId: string) => request(`/social/score/${userId}`),
  getSocialAccounts: (userId?: string) =>
    request(userId ? `/social/accounts/${userId}` : '/social/accounts'),

  // Wallet
  getWalletBalance: (userId: string) => request(`/wallet/balance/${userId}`),
  getBalance: (userId?: string) =>
    request(userId ? `/wallet/balance/${userId}` : '/wallet/balance'),
  getTransactions: (userId: string) => request(`/wallet/transactions/${userId}`),
  getActivity: (userId?: string) =>
    request(userId ? `/wallet/activity/${userId}` : '/wallet/activity'),

  // Commerce / Campaigns
  getCampaigns: () => request('/commerce/campaigns'),
  verifyTweet: (data: any) => request('/commerce/verify-tweet', { method: 'POST', body: JSON.stringify(data) }),
  claimCampaign: (data: any) => request('/commerce/verify-tweet', { method: 'POST', body: JSON.stringify(data) }),
  getCommerceScore: (userId?: string) =>
    request(userId ? `/commerce/score/${userId}` : '/commerce/score'),

  // Tips
  sendTip: (data: any) => request('/wallet/tip', { method: 'POST', body: JSON.stringify(data) }),

  // Mock
  getMockData: () => request('/mock/data'),
};