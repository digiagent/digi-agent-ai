"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Snowflake } from "lucide-react"
import { useMockData } from "@/components/providers/MockDataProvider"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export function VirtualDebitCard() {
  const { wallet, creator } = useMockData()
  const { card } = wallet
  const [flipped, setFlipped] = useState(false)
  const prefersReduced = useReducedMotion()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="perspective-[1000px] w-full max-w-sm mx-auto">
      <motion.div
        className="relative w-full aspect-[1.586] cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-surface-high to-bg border border-border p-5 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent font-[family-name:var(--font-display)]">
              DigiPaga
            </span>
            <div className="relative">
              <div className="absolute inset-0 bg-accent/10 blur-sm rounded-full" />
              <div className="flex gap-1">
                <span className="w-6 h-4 rounded-[3px] bg-usdc" />
                <span className="w-6 h-4 rounded-[3px] bg-eurc" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-lg tracking-[0.2em] text-text-primary font-mono">
              •••• •••• •••• {card.lastFour}
            </p>
            <p className="text-sm text-text-muted">{creator.handle}</p>
          </div>

          <div className="absolute top-1/3 right-6 w-16 h-16 bg-accent-glow rounded-full blur-xl opacity-30" />
          <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/5 rounded-full blur-sm" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-surface-high to-bg border border-border p-5 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-accent font-[family-name:var(--font-display)]">
              DigiPaga
            </span>
            <span className="text-xs text-text-muted">Virtual Card</span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-muted mb-1">Card Number</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary font-mono tabular-nums">
                  4532 7891 2345 {card.lastFour}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(`453278912345${card.lastFour}`)
                  }}
                  className="p-1 hover:bg-surface rounded transition-colors"
                >
                  <Copy size={14} className="text-text-muted" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-xs text-text-muted mb-1">Expiry</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary font-mono">
                    {card.expiry}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(card.expiry)
                    }}
                    className="p-1 hover:bg-surface rounded transition-colors"
                  >
                    <Copy size={14} className="text-text-muted" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-muted mb-1">CVV</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary font-mono">
                    {card.cvv}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard("123")
                    }}
                    className="p-1 hover:bg-surface rounded transition-colors"
                  >
                    <Copy size={14} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-text-muted text-center">
            Tap to flip back
          </p>
        </div>
      </motion.div>
    </div>
  )
}
