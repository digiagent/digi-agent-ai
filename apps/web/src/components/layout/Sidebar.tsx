"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Wallet,
  Repeat,
  Landmark,
  TrendingUp,
  CreditCard,
  Star,
  Target,
  Link2,
  BarChart3,
  Bot,
} from "lucide-react"
import { useMockData } from "@/components/providers/MockDataProvider"

const navSections = [
  {
    label: "MONEY",
    items: [
      { icon: ArrowUpRight, label: "Send Money", href: "#" },
      { icon: ArrowDownLeft, label: "Request Money", href: "#" },
      { icon: FileText, label: "Pay Bills", href: "#" },
      { icon: FileText, label: "Send Invoice", href: "#" },
    ],
  },
  {
    label: "WALLET",
    items: [
      { icon: Wallet, label: "My Wallets", href: "/wallet" },
      { icon: Repeat, label: "Smart Swap", href: "#" },
      { icon: Landmark, label: "Convert to Fiat", href: "#" },
      { icon: TrendingUp, label: "Find Yield", href: "#" },
      { icon: CreditCard, label: "Buy / Sell", href: "#" },
    ],
  },
  {
    label: "EARN",
    items: [
      { icon: Star, label: "Commerce Score", href: "/score" },
      { icon: Target, label: "Campaigns", href: "/campaigns" },
      { icon: Link2, label: "My Referrals", href: "#" },
      { icon: BarChart3, label: "Analytics", href: "#" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { creator, wallet } = useMockData()

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-high border-r border-border flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-accent font-[family-name:var(--font-display)]">
            DigiPaga
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
            AI
          </span>
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-bg">
            {creator.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {creator.handle}
            </p>
            <span className="text-[10px] px-1 py-0.5 rounded-full bg-accent/10 text-accent">
              Verified
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-text-primary tabular-nums mt-2">
          ${wallet.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] text-text-muted">Total Balance USD</p>
      </div>

      <nav className="flex-1 py-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            <p className="px-4 py-1 text-[10px] text-text-muted font-semibold tracking-wider">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive = pathname === item.href && item.href !== "#"
              const isAgent = item.label === "DigiAgent"
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent/10 text-accent border-l-2 border-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  } ${isAgent ? "relative" : ""}`}
                >
                  {isAgent && (
                    <span className="absolute inset-0 rounded animate-pulse-glow opacity-30" />
                  )}
                  <item.icon
                    size={16}
                    className={isAgent ? "text-accent" : ""}
                  />
                  <span className={isAgent ? "text-accent font-medium" : ""}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/agent"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-colors"
        >
          <Bot size={18} className="text-accent" />
          <span className="text-sm font-medium text-accent">DigiAgent</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-positive animate-pulse" />
        </Link>
      </div>
    </aside>
  )
}
