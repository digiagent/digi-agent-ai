"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Link2, Zap } from "lucide-react"
import { CampaignCard } from "@/components/ui/CampaignCard"
import { useMockData } from "@/components/providers/MockDataProvider"
import type { Campaign } from "@/lib/types/campaign"
import { toast } from "sonner"

const filterTabs = ["All", "Affiliate", "Sponsored", "Referral", "Digital"]

export default function CampaignsPage() {
  const { campaigns } = useMockData()
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)

  const filtered =
    activeFilter === "All"
      ? campaigns
      : campaigns.filter(
          (c) => c.type.toLowerCase() === activeFilter.toLowerCase(),
        )

  const handleActivate = (id: string) => {
    const camp = campaigns.find((c) => c.id === id)
    if (camp) setSelectedCampaign(camp)
  }

  const handleGenerateLink = () => {
    const id = crypto.randomUUID().slice(0, 8)
    setGeneratedLink(
      `https://digipaga.ai/r/${selectedCampaign?.merchant.toLowerCase().replace(/\s+/g, "-")}-${id}`,
    )
  }

  const handleSimulateSale = () => {
    toast.success("🎉 $24.00 USDC sent to your wallet!", {
      duration: 4000,
    })
  }

  const copyLink = () => {
    if (generatedLink) navigator.clipboard.writeText(generatedLink)
    toast.success("Link copied to clipboard")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-text-primary">
          {campaigns.length} opportunities found
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 pb-1 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === tab
                ? "bg-accent text-bg"
                : "bg-surface text-text-secondary border border-border hover:border-accent/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onActivate={handleActivate}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedCampaign && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => {
                setSelectedCampaign(null)
                setGeneratedLink(null)
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-primary">
                    {selectedCampaign.merchant}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedCampaign(null)
                      setGeneratedLink(null)
                    }}
                    className="p-1 rounded-full hover:bg-surface-high transition-colors"
                  >
                    <X size={20} className="text-text-muted" />
                  </button>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                  {selectedCampaign.description}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                    {selectedCampaign.matchScore}% match
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-high text-text-secondary border border-border">
                    {selectedCampaign.type}
                  </span>
                </div>

                <div className="rounded-lg bg-surface-high border border-border p-4 mb-4">
                  <p className="text-sm text-text-muted mb-1">
                    Estimated Monthly
                  </p>
                  <p className="text-xl font-bold text-text-primary">
                    ${selectedCampaign.estimatedMonthlyMin}–
                    {selectedCampaign.estimatedMonthlyMax}
                  </p>
                </div>

                {!generatedLink ? (
                  <button
                    onClick={handleGenerateLink}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-bg font-semibold hover:bg-accent/90 transition-colors mb-3"
                  >
                    <Link2 size={16} />
                    Generate my link
                  </button>
                ) : (
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-high border border-border">
                      <span className="flex-1 text-sm text-accent truncate font-mono">
                        {generatedLink}
                      </span>
                      <button
                        onClick={copyLink}
                        className="text-xs px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <button
                      onClick={handleSimulateSale}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent/10 border border-accent/30 text-accent font-semibold hover:bg-accent/20 transition-colors"
                    >
                      <Zap size={16} />
                      Simulate a Sale 🎯
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
