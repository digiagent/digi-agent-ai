"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, DollarSign, Target, Gift, Copy, Link2, Check, Share2 } from "lucide-react"
import { CommerceScoreRing } from "@/components/ui/CommerceScoreRing"
import { WalletCard } from "@/components/ui/WalletCard"
import { CampaignCard } from "@/components/ui/CampaignCard"
import { ActivityFeed } from "@/components/ui/ActivityFeed"
import { useMockData } from "@/components/providers/MockDataProvider"
import { useCommerceScore } from "@/hooks/useCommerceScore"
import { toast } from "sonner"
import Link from "next/link"

export default function DashboardPage() {
  const { creator } = useMockData()
  const { score, tier } = useCommerceScore()
  const [copied, setCopied] = useState(false)

  const tipLink = `https://digi-agent-ai.vercel.app/tip/@${creator.handle}`

  const copyTipLink = async () => {
    await navigator.clipboard.writeText(tipLink)
    setCopied(true)
    toast.success("Tip link copied")
    setTimeout(() => setCopied(false), 1500)
  }

  const shareTipLink = async () => {
    const text = `Send me a USDC tip on Arc: ${tipLink} 🎁`
    if (navigator.share) {
      await navigator.share({ title: "Tip me USDC", text, url: tipLink })
    } else {
      await navigator.clipboard.writeText(text)
      toast.success("Share text copied")
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 min-w-0">
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

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0">
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
          <div className="rounded-card bg-surface border border-border p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-text-primary">
                My Tip Link
              </span>
              <span className="text-xs text-accent">Receive USDC</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-high border border-border mb-3">
              <Link2 size={14} className="text-accent flex-shrink-0" />
              <span className="flex-1 text-sm text-text-secondary truncate font-mono">
                {tipLink}
              </span>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <button
                onClick={copyTipLink}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent text-bg text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={shareTipLink}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
            <Link
              href={`/tip/@${creator.handle}`}
              className="mt-2 text-center text-xs text-text-muted hover:text-accent transition-colors"
            >
              Preview public tip page
            </Link>
          </div>
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
  )
}
