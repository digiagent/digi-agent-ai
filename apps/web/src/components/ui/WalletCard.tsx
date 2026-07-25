"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Wallet } from "lucide-react"
import { useMockData } from "@/components/providers/MockDataProvider"
import Link from "next/link"

export function WalletCard() {
  const { wallet } = useMockData()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="rounded-card bg-surface border border-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-accent" />
          <span className="text-sm font-semibold text-text-primary">Wallet</span>
        </div>
        <Link
          href="/wallet"
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
        >
          View Wallet <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {wallet.assets.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  asset.symbol === "USDC"
                    ? "bg-usdc/20 text-usdc"
                    : asset.symbol === "EURC"
                      ? "bg-eurc/20 text-eurc"
                      : "bg-accent/20 text-accent"
                }`}
              >
                {asset.symbol[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {asset.name}
                </p>
                <p className="text-xs text-text-muted">{asset.chain}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-text-primary tabular-nums">
              ${asset.balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
