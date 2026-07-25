"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Star, Target, Wallet, Bot } from "lucide-react"

const tabs = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Star, label: "Score", href: "/score" },
  { icon: Target, label: "Campaigns", href: "/campaigns" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: Bot, label: "Agent", href: "/agent" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-high border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-accent" : "text-text-muted"
              }`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
