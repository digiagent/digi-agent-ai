"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Snowflake, Copy, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { VirtualDebitCard } from "@/components/ui/VirtualDebitCard"
import { useMockData } from "@/components/providers/MockDataProvider"
import { toast } from "sonner"

export default function CardPage() {
  const { wallet, transactions } = useMockData()
  const [frozen, setFrozen] = useState(wallet.card.frozen)

  const cardTransactions = transactions.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto"
    >
      <h1 className="text-xl font-semibold text-text-primary mb-6">
        Virtual Card
      </h1>

      <VirtualDebitCard />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-3">
            <Snowflake
              size={18}
              className={frozen ? "text-usdc" : "text-text-muted"}
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Freeze Card
              </p>
              <p className="text-xs text-text-muted">
                {frozen
                  ? "Card is frozen"
                  : "Temporarily block all transactions"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFrozen(!frozen)
              toast.success(frozen ? "Card unfrozen" : "Card frozen")
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              frozen ? "bg-accent" : "bg-surface-high border border-border"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                frozen ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <Copy size={18} className="text-accent" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">
                Set Spend Limit
              </p>
              <p className="text-xs text-text-muted">Current: No limit</p>
            </div>
          </div>
          <span className="text-xs text-accent">Change</span>
        </button>

        <div className="rounded-card bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Recent Card Transactions
            </h2>
          </div>
          <div className="space-y-3">
            {cardTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.amount > 0
                        ? "bg-positive/10"
                        : "bg-negative/10"
                    }`}
                  >
                    {tx.amount > 0 ? (
                      <ArrowDownLeft
                        size={14}
                        className="text-positive"
                      />
                    ) : (
                      <ArrowUpRight
                        size={14}
                        className="text-negative"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary">
                      {tx.description}
                    </p>
                    <p className="text-xs text-text-muted">{tx.date}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    tx.amount > 0 ? "text-positive" : "text-negative"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toFixed(2)} {tx.asset}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
