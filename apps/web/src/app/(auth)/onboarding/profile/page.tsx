"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { api } from "@/lib/api/client"

const profiles = [
  { emoji: "🎨", title: "Creator", desc: "Instagram, TikTok, YouTube", type: "creator" },
  { emoji: "🛒", title: "Merchant", desc: "I sell products or services", type: "brand" },
  { emoji: "💼", title: "Freelancer", desc: "I offer skills for hire", type: "creator" },
  { emoji: "🏢", title: "Business", desc: "I run a team or company", type: "brand" },
  { emoji: "👩‍💻", title: "Developer", desc: "I build products", type: "creator" },
]

export default function OnboardingProfilePage() {
  const router = useRouter()
  const { user } = usePrivy()
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = async () => {
    if (!selected) return
    setSubmitting(true)
    setError(null)

    const profile = profiles.find((p) => p.title === selected)
    const email = user?.email?.address
    const displayName = user?.google?.name ?? user?.twitter?.name ?? null
    const baseHandle =
      email?.split("@")[0] ??
      displayName?.toLowerCase().replace(/\s+/g, "") ??
      `user_${Math.floor(Math.random() * 10000)}`
    const digiHandle = baseHandle.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20)

    try {
      await api.createProfile({
        digiHandle,
        displayName: displayName ?? baseHandle,
        email,
        userType: profile?.type === "brand" ? "brand" : "creator",
      })
      router.push("/onboarding/connect")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile")
      setSubmitting(false)
    }
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
          <div className="flex-1 h-1 rounded-full bg-border" />
        </div>

        <h1 className="text-xl font-semibold text-text-primary mb-2">
          What describes you?
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Choose the option that best fits your profile.
        </p>

        {error && (
          <p className="text-xs text-negative bg-negative/10 border border-negative/20 rounded-lg p-2 mb-4">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {profiles.map((profile) => {
            const isSelected = selected === profile.title
            return (
              <button
                key={profile.title}
                onClick={() => setSelected(profile.title)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-surface hover:border-accent/30"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Check size={12} className="text-bg" />
                  </div>
                )}
                <span className="text-2xl">{profile.emoji}</span>
                <span className="text-sm font-semibold text-text-primary">
                  {profile.title}
                </span>
                <span className="text-[10px] text-text-muted text-center leading-tight">
                  {profile.desc}
                </span>
              </button>
            )
          })}
        </div>

        <button
          disabled={!selected || submitting}
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-accent text-bg font-semibold text-base hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Setting up…" : "Next"}
        </button>
      </motion.div>
    </div>
  )
}
