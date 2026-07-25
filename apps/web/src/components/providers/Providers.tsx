"use client"

import { type ReactNode } from "react"
import { MockDataProvider } from "./MockDataProvider"
import { ThemeProvider } from "./ThemeProvider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MockDataProvider>{children}</MockDataProvider>
    </ThemeProvider>
  )
}
