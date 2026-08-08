"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Link2, Zap, ArrowRight, CheckCircle2 } from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { toast } from "sonner"
import { CampaignCard } from "@/components/ui/CampaignCard"
import { useMockData } from "@/components/providers/MockDataProvider"
import type { Campaign } from "@/lib/types/campaign"
import { api } from "@/lib/api/client"

const EARN_CAMPAIGNS = [
  {
    id: "camp_arc_001",
    title: "Post about the Arc Network",
    hashtag: "#ArcNetwork",
    reward: "$1 USDC",
    tweet:
      "Building on the future — $ARC is the next-gen L1. 🛰️ #ArcNetwork #DigiAgent",
    description:
      "Post about the Arc Network L1 and earn $1 in USDC on Arc testnet.",
  },
  {
    id: "camp_circle_002",
    title: "Post about USDC on Arc",
    hashtag: "#USDCOnArc",
    reward: "$1 USDC",
    tweet:
      "USDC is now live on Arc! 💚 Stable, lightning fast settlements. #USDCOnArc #DigiAgent",
    description: "Share the USDC-on-Arc story and earn $1 USDC.",
  },
  {
    id: "camp_digipaga_003",
    title: "Post about DigiAgent",
    hashtag: "#DigiAgent",
    reward: "$1 USDC",
    tweet:
      "DigiAgent is the AI agent that pays you to create. Earn USDC on Arc every post. ✨ #DigiAgent",
    description: "Talk about DigiAgent, the platform you are on right now.",
  },
]

const filterTabs = ["All", "Affiliate", "Sponsored", "Referral", "Digital"]

export default function CampaignsPage() {
  const { campaigns } = useMockData()
  const { user, ready } = usePrivy()
  const { wallets } = useWallets()
  const [activeTab, setActiveTab] = useState<"earn" | "campaigns">("earn")
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [verified, setVerified] = useState<Record<string, { txHash?: string; explorerUrl?: string | null }>>({})
  const [verifying, setVerifying] = useState<string | null>(null)
  const [tweetUrl, setTweetUrl] = useState<Record<string, string>>({})
  const privyId = user?.id ?? undefined
  const walletAddress = wallets[0]?.address

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

  const openTweet = (tweet: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const verifyTweet = async (camp: (typeof EARN_CAMPAIGNS)[number]) => {
    if (!privyId) {
      toast.error("Sign in to verify your post")
      return
    }
    const url = tweetUrl[camp.id]?.trim()
    if (!url) {
      toast.error("Paste a link to your post on X/Twitter")
      return
    }
    if (!/^https:\/\/(twitter\.com|x\.com)\//.test(url)) {
      toast.error("Link must be a twitter.com or x.com status URL")
      return
    }
    setVerifying(camp.id)
    try {
      const res = await fetch("/api/commerce/verify-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: camp.id,
          tweetUrl: url,
          privyId,
          walletAddress,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Verification failed")
        return
      }
      setVerified((prev) => ({
        ...prev,
        [camp.id]: { txHash: data.txHash, explorerUrl: data.explorerUrl },
      }))
      toast.success(`${camp.reward} claimed — USDC on its way!`)
    } catch {
      toast.error("Could not reach verification service")
    } finally {
      setVerifying(null)
    }
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
          Earn & Campaigns
        </h1>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-surface border border-border mb-6 max-w-md">
        {(["earn", "campaigns"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-accent text-bg"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "earn" ? "Earn" : "Campaigns"}
          </button>
        ))}
      </div>

      {activeTab === "earn" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EARN_CAMPAIGNS.map((camp) => {
            const done = verified[camp.id]
            return (
              <div
                key={camp.id}
                className="rounded-card bg-surface border border-border p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    Post-to-Earn
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {camp.reward}
                  </span>
                </div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {camp.title}
                </h3>
                <p className="text-xs text-text-secondary mb-4 flex-1">
                  {camp.description}
                </p>
                <div className="mt-auto space-y-2">
                  <button
                    onClick={() => openTweet(camp.tweet)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-bg/60 border border-border text-text-primary font-semibold hover:border-accent/50 transition-colors"
                  >
                    <X size={16} />
                    Post on X
                  </button>
                  {done ? (
                    <div className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-semibold">
                      <CheckCircle2 size={14} /> Claimed
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={tweetUrl[camp.id] ?? ""}
                        onChange={(e) =>
                          setTweetUrl((prev) => ({
                            ...prev,
                            [camp.id]: e.target.value,
                          }))
                        }
                        placeholder="https://x.com/you/status/…"
                        className="w-full text-sm px-3 py-2.5 rounded-xl bg-bg/60 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                      />
                      <button
                        onClick={() => verifyTweet(camp)}
                        disabled={verifying === camp.id}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-bg font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
                      >
                        <Zap size={16} />
                        {verifying === camp.id ? "Verifying…" : "I posted · Verify"}
                      </button>
                    </div>
                  )}
                  {done?.explorerUrl && (
                    <a
                      href={done.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 text-xs text-accent hover:underline"
                    >
                      View on explorer <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <>
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
        </>
      )}

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