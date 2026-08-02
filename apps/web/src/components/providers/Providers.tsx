"use client"

import { useEffect, useMemo, type ReactNode } from "react"
import { PrivyProvider, usePrivy } from "@privy-io/react-auth"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import { MockDataProvider } from "./MockDataProvider"
import { ThemeProvider } from "./ThemeProvider"

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
    [],
  )

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["google", "twitter", "wallet"],
        appearance: { theme: "dark", accentColor: "#9DCC4A" },
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthTokenBridge>
            <MockDataProvider>{children}</MockDataProvider>
          </AuthTokenBridge>
        </ThemeProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

function AuthTokenBridge({ children }: { children: ReactNode }) {
  const { getAccessToken } = usePrivy()

  useEffect(() => {
    api.setTokenProvider(() => getAccessToken())
  }, [getAccessToken])

  return <>{children}</>
}
