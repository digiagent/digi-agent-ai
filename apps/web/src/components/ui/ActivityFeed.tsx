"use client"

import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Gift,
  Sparkles,
} from "lucide-react"
import { useMockData } from "@/components/providers/MockDataProvider"

const typeIcons: Record<string, React.ElementType> = {
  reward: Gift,
  send: ArrowUpRight,
  swap: Repeat,
  receive: ArrowDownLeft,
  yield: Sparkles,
}

const typeColors: Record<string, string> = {
  reward: "text-positive",
  send: "text-negative",
  swap: "text-warning",
  receive: "text-positive",
  yield: "text-accent",
}

export function ActivityFeed() {
  const { transactions } = useMockData()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="rounded-card bg-surface border border-border p-5"
    >
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {transactions.map((tx, i) => {
          const Icon = typeIcons[tx.type] || Gift
          const colorClass = typeColors[tx.type] || "text-text-muted"
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-surface-high flex items-center justify-center ${colorClass}`}>
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-sm text-text-primary">{tx.description}</p>
                  <p className="text-xs text-text-muted">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    tx.amount > 0 ? "text-positive" : tx.amount < 0 ? "text-negative" : "text-text-primary"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount.toFixed(2)} {tx.asset}
                </p>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    tx.status === "completed"
                      ? "bg-positive/10 text-positive"
                      : tx.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-negative/10 text-negative"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
