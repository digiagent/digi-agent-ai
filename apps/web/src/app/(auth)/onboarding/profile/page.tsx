"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const profiles = [
  { emoji: "🎨", title: "Creator", desc: "Instagram, TikTok, YouTube" },
  { emoji: "🛒", title: "Merchant", desc: "I sell products or services" },
  { emoji: "💼", title: "Freelancer", desc: "I offer skills for hire" },
  { emoji: "🏢", title: "Business", desc: "I run a team or company" },
  { emoji: "👩‍💻", title: "Developer", desc: "I build products" },
]

export default function OnboardingProfilePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

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
          disabled={!selected}
          onClick={() => router.push("/onboarding/connect")}
          className="w-full py-3.5 rounded-xl bg-accent text-bg font-semibold text-base hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </motion.div>
    </div>
  )
}
