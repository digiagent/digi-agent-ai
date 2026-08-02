"use client"

import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { motion } from "framer-motion"
import { Globe, MessageCircle, Send, Mail, Phone, Wallet } from "lucide-react"

const authOptions = [
  { icon: Globe, label: "Continue with Google", provider: "google" },
  { icon: MessageCircle, label: "Continue with X", provider: "x" },
  { icon: Send, label: "Continue with Telegram", provider: "telegram" },
  { icon: Mail, label: "Continue with Email", provider: "email" },
  { icon: Phone, label: "Continue with SMS", provider: "sms" },
  { icon: Wallet, label: "Connect Wallet", provider: "wallet" },
]

export default function SignInPage() {
  const router = useRouter()
  const { login, ready, authenticated } = usePrivy()

  const handleAuth = (provider: string) => {
    const providers: Record<string, "google" | "twitter" | "telegram" | "email" | "sms" | "wallet"> =
      {
        google: "google",
        x: "twitter",
        telegram: "telegram",
        email: "email",
        sms: "sms",
        wallet: "wallet",
      }
    const loginMethod = providers[provider] ?? "email"
    login({ loginMethods: [loginMethod] })
  }

  if (authenticated) {
    router.push("/onboarding/profile")
    return null
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-accent font-[family-name:var(--font-display)]">
            DigiPaga
          </span>
          <h1 className="text-xl font-semibold text-text-primary mt-4">
            Sign in to DigiPaga
          </h1>
        </div>

        <div className="rounded-card bg-surface border border-border p-6 space-y-3">
          {authOptions.map((option) => (
            <button
              key={option.provider}
              onClick={() => handleAuth(option.provider)}
              disabled={!ready}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-medium hover:border-accent/50 hover:bg-surface-high transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <option.icon size={18} className="text-text-secondary" />
              {option.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-text-muted text-center mt-6 leading-relaxed">
          By continuing, you agree to our{" "}
          <button className="text-accent hover:underline">Terms</button> and{" "}
          <button className="text-accent hover:underline">Privacy Policy</button>
          .
        </p>
      </motion.div>
    </div>
  )
}
