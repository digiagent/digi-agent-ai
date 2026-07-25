"use client"

import { motion } from "framer-motion"
import { Bell, TrendingUp, DollarSign, Target, Gift } from "lucide-react"
import { CommerceScoreRing } from "@/components/ui/CommerceScoreRing"
import { WalletCard } from "@/components/ui/WalletCard"
import { CampaignCard } from "@/components/ui/CampaignCard"
import { ActivityFeed } from "@/components/ui/ActivityFeed"
import { AgentChatPanel } from "@/components/ui/AgentChatPanel"
import { useMockData } from "@/components/providers/MockDataProvider"
import { useCommerceScore } from "@/hooks/useCommerceScore"
import Link from "next/link"

export default function DashboardPage() {
  const { creator } = useMockData()
  const { score, tier } = useCommerceScore()

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-text-primary">
                Welcome back, {creator.handle} 👋
              </h1>
              <p className="text-sm text-text-secondary">
                Your commerce pulse for today
              </p>
            </div>
            <button className="p-2 rounded-full bg-surface border border-border hover:border-accent/50 transition-colors relative">
              <Bell size={18} className="text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-6">
            <div className="relative flex flex-col items-center">
              <CommerceScoreRing score={score} size={180} />
              <p className="text-sm font-semibold text-text-primary mt-2">
                Commerce Score
              </p>
              <p className="text-xs text-accent font-medium">
                Excellent · Tier: {tier}
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {[
                {
                  icon: DollarSign,
                  label: "Monthly Earnings",
                  value: `$${creator.monthlyEarnings.toLocaleString()} USDC`,
                  color: "text-accent",
                },
                {
                  icon: Target,
                  label: "Active Campaigns",
                  value: String(creator.activeCampaigns),
                  color: "text-usdc",
                },
                {
                  icon: Gift,
                  label: "Pending Rewards",
                  value: `$${creator.pendingRewards.toFixed(2)}`,
                  color: "text-warning",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-card bg-surface border border-border p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon size={16} className={stat.color} />
                    <span className="text-xs text-text-secondary">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-text-primary tabular-nums">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <WalletCard />
            <Link href="/card">
              <div className="rounded-card bg-surface border border-border p-5 h-full hover:border-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-text-primary">
                    Virtual Card
                  </span>
                  <span className="text-xs text-accent">Manage</span>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-surface-high to-bg border border-border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-accent">
                      DigiPaga
                    </span>
                    <span className="text-[10px] text-text-muted">Virtual</span>
                  </div>
                  <p className="text-lg tracking-widest text-text-primary font-mono">
                    •••• •••• •••• {creator.handle[0]}
                    {creator.handle[1]}91
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">
                Recommended Campaigns
              </h3>
              <Link
                href="/campaigns"
                className="text-xs text-accent hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {creator.handle ? (
                <>
                  <CampaignCard
                    campaign={{
                      id: "camp_001",
                      merchant: "NovaFit Gear",
                      category: "Fitness",
                      type: "affiliate",
                      rewardType: "percent",
                      reward: 8,
                      estimatedMonthlyMin: 180,
                      estimatedMonthlyMax: 420,
                      matchScore: 94,
                      description: "Promote fitness apparel to your lifestyle audience.",
                      active: false,
                    }}
                  />
                  <CampaignCard
                    campaign={{
                      id: "camp_002",
                      merchant: "Sketchpad Pro",
                      category: "Productivity",
                      type: "affiliate",
                      rewardType: "percent",
                      reward: 15,
                      estimatedMonthlyMin: 220,
                      estimatedMonthlyMax: 600,
                      matchScore: 91,
                      description: "Design tool loved by creators. High conversion rate.",
                      active: false,
                    }}
                  />
                  <CampaignCard
                    campaign={{
                      id: "camp_004",
                      merchant: "Storefront Kit",
                      category: "E-commerce",
                      type: "referral",
                      rewardType: "fixed",
                      reward: 50,
                      estimatedMonthlyMin: 200,
                      estimatedMonthlyMax: 500,
                      matchScore: 85,
                      description: "Help creators launch their own stores.",
                      active: false,
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>

          <ActivityFeed />
        </motion.div>
      </div>

      <div className="hidden lg:flex w-80 border-l border-border bg-surface p-4">
        <AgentChatPanel />
      </div>
    </div>
  )
}
