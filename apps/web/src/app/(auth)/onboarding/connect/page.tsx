"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Camera, MessageCircle, Music, User, Clapperboard } from "lucide-react"

const platforms = [
  { id: "instagram", icon: Camera, name: "Instagram", followers: "18.4K", comingSoon: false },
  { id: "twitter", icon: MessageCircle, name: "X / Twitter", followers: "6.2K", comingSoon: false },
  { id: "tiktok", icon: Music, name: "TikTok", followers: "0", comingSoon: false },
  { id: "linkedin", icon: User, name: "LinkedIn", followers: "3.1K", comingSoon: false },
  { id: "youtube", icon: Clapperboard, name: "YouTube", followers: "0", comingSoon: true },
]

export default function OnboardingConnectPage() {
  const router = useRouter()
  const [connected, setConnected] = useState<Record<string, boolean>>({
    instagram: true,
    twitter: true,
  })

  const toggleConnect = (id: string) => {
    if (platforms.find((p) => p.id === id)?.comingSoon) return
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-1 rounded-full bg-accent" />
          <div className="flex-1 h-1 rounded-full bg-accent" />
        </div>

        <h1 className="text-xl font-semibold text-text-primary mb-2">
          Connect your accounts
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          DigiPaga AI analyzes your reach to find the best opportunities.
        </p>

        <div className="space-y-2 mb-8">
          {platforms.map((platform) => {
            const isConnected = connected[platform.id]
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border"
              >
                <div className="flex items-center gap-3">
                  <platform.icon
                    size={20}
                    className={
                      isConnected ? "text-accent" : "text-text-muted"
                    }
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {platform.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {platform.followers} followers
                    </p>
                  </div>
                </div>

                {platform.comingSoon ? (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-surface-high text-text-muted border border-border">
                    Coming soon
                  </span>
                ) : isConnected ? (
                  <span className="flex items-center gap-1 text-[11px] text-accent font-medium">
                    <Check size={14} /> Connected
                  </span>
                ) : (
                  <button
                    onClick={() => toggleConnect(platform.id)}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-accent text-bg font-medium hover:bg-accent/90 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3.5 rounded-xl bg-accent text-bg font-semibold text-base hover:bg-accent/90 transition-all"
          >
            Finish Setup
          </button>
          <Link
            href="/dashboard"
            className="w-full text-center text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip for now
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
