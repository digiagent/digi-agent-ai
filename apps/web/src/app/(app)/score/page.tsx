"use client"

import { motion } from "framer-motion"
import { CommerceScoreRing } from "@/components/ui/CommerceScoreRing"
import { useCommerceScore } from "@/hooks/useCommerceScore"
import { CampaignCard } from "@/components/ui/CampaignCard"
import { useMockData } from "@/components/providers/MockDataProvider"

const breakpointLabels: Record<string, string> = {
  audienceReach: "Audience Reach",
  engagementRate: "Engagement Rate",
  postingFrequency: "Posting Frequency",
  nicheAlignment: "Niche Alignment",
  locationSignal: "Location Signal",
}

export default function ScorePage() {
  const { score, breakdown, tier } = useCommerceScore()
  const { campaigns } = useMockData()

  const topCampaigns = campaigns.filter((c) => c.matchScore >= 85)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-3xl mx-auto"
    >
      <div className="flex flex-col items-center mb-8">
        <CommerceScoreRing score={score} size={240} />
        <h1 className="text-2xl font-bold text-text-primary mt-4">
          {score} / 100
        </h1>
        <p className="text-sm text-accent font-medium">{tier}</p>
      </div>

      <div className="rounded-card bg-surface border border-border p-5 mb-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          Score Breakdown
        </h2>
        <div className="space-y-3">
          {Object.entries(breakpointLabels).map(([key, label]) => {
            const value = breakdown[key as keyof typeof breakdown]
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">
                    {value}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-high overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["Lifestyle", "Finance", "Latin America", "Spanish-speaking"].map(
          (tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
            >
              {tag}
            </span>
          ),
        )}
        <span className="text-xs px-2.5 py-1 rounded-full bg-usdc/10 text-usdc border border-usdc/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-usdc" />
          AI Confidence 94%
        </span>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          AI Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
