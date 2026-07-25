"use client"

import { type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
