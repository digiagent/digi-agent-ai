"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import type { Campaign } from "@/lib/types/campaign"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface Props {
  campaign: Campaign
  onActivate?: (id: string) => void
  compact?: boolean
}

export function CampaignCard({ campaign, onActivate, compact }: Props) {
  const prefersReduced = useReducedMotion()
  const initials = campaign.merchant
    .split(" ")
    .map((w) => w[0])
    .join("")

  return (
    <motion.div
      whileHover={prefersReduced ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={`rounded-card bg-surface border border-border hover:border-accent/50 transition-colors ${
        compact ? "p-3" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-text-primary truncate ${compact ? "text-sm" : "text-base"}`}>
              {campaign.merchant}
            </h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium whitespace-nowrap">
              {campaign.matchScore}% match
            </span>
          </div>
          <p className={`text-text-muted ${compact ? "text-[11px]" : "text-xs"}`}>
            {campaign.category} · {campaign.type}
          </p>
        </div>
      </div>

      <p className={`text-text-secondary mb-3 line-clamp-2 ${compact ? "text-[11px]" : "text-sm"}`}>
        {campaign.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={`text-accent font-bold ${compact ? "text-xs" : "text-sm"}`}>
            {campaign.rewardType === "percent"
              ? `${campaign.reward}% commission`
              : `$${campaign.reward} fixed`}
          </p>
          <p className={`text-text-muted ${compact ? "text-[10px]" : "text-xs"}`}>
            Est. ${campaign.estimatedMonthlyMin}–${campaign.estimatedMonthlyMax}/mo
          </p>
        </div>
      </div>

      {onActivate && (
        <button
          onClick={() => onActivate(campaign.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Zap size={14} />
          Activate
        </button>
      )}
    </motion.div>
  )
}
