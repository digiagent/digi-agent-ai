"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SplashPage() {
  const router = useRouter()
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
    })),
  )

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center px-6 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-accent/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 max-w-md text-center z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl font-bold text-accent font-[family-name:var(--font-display)]">
            DigiPaga
          </span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent font-medium tracking-wide">
            AI
          </span>
        </div>

        <p className="text-lg text-text-secondary leading-relaxed">
          Your AI layer for money. Earn, send, and grow — just ask.
        </p>

        <button
          onClick={() => router.push("/signin")}
          className="mt-4 w-full max-w-xs py-3.5 rounded-xl bg-accent text-bg font-semibold text-base hover:bg-accent/90 transition-all hover:shadow-[0_0_24px_#9DCC4A33] active:scale-[0.98]"
        >
          Get Started
        </button>

        <p className="text-xs text-text-muted mt-4">
          Creator economy for Latin America and the Global South
        </p>
      </motion.div>
    </div>
  )
}
