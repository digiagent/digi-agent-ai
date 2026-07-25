"use client"

import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Landmark,
  TrendingUp,
  ArrowRightLeft,
} from "lucide-react"
import { useMockData } from "@/components/providers/MockDataProvider"
import { useWallet } from "@/hooks/useWallet"
import Link from "next/link"

export default function WalletPage() {
  const { wallet, transactions } = useWallet()

  const actions = [
    { icon: ArrowUpRight, label: "Send", href: "#", color: "text-accent" },
    { icon: ArrowDownLeft, label: "Receive", href: "#", color: "text-positive" },
    { icon: ArrowRightLeft, label: "Swap", href: "#", color: "text-usdc" },
    { icon: Landmark, label: "Convert", href: "#", color: "text-eurc" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-3xl mx-auto"
    >
      <div className="rounded-card bg-surface border border-border p-6 mb-6 text-center">
        <p className="text-sm text-text-muted mb-1">Total Balance</p>
        <p className="text-4xl font-bold text-text-primary tabular-nums mb-2">
          ${wallet.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center justify-center gap-1">
          <TrendingUp size={14} className="text-positive" />
          <span className="text-xs text-positive">+2.4% this month</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {wallet.assets.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
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
                  {asset.symbol}
                </p>
                <p className="text-xs text-text-muted">{asset.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary tabular-nums">
                ${asset.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-text-muted">{asset.chain}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface border border-border hover:border-accent/50 transition-colors"
          >
            <action.icon size={20} className={action.color} />
            <span className="text-xs text-text-secondary">{action.label}</span>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          Transactions
        </h2>
        <div className="rounded-card bg-surface border border-border divide-y divide-border/50">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="text-sm text-text-primary">{tx.description}</p>
                <p className="text-xs text-text-muted">{tx.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    tx.amount > 0 ? "text-positive" : "text-negative"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toFixed(2)} {tx.asset}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
