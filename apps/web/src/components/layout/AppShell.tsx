"use client"

import { usePathname } from "next/navigation"
import { type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { AgentChatPanel } from "@/components/ui/AgentChatPanel"

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showRightPanel = pathname === "/dashboard"

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto min-w-0 pb-16 lg:pb-0">
        {children}
      </main>
      {showRightPanel && (
        <div className="hidden lg:flex w-80 flex-shrink-0 border-l border-[#1F3326] bg-surface overflow-y-auto">
          <div className="w-full p-4">
            <AgentChatPanel />
          </div>
        </div>
      )}
      <MobileNav />
    </div>
  )
}
