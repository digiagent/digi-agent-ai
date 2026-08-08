"use client"

import { use, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, ExternalLink, Coffee, Check } from "lucide-react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { toast } from "sonner"
import Link from "next/link"

function normalizeHandle(input: string): string {
  return input.trim().replace(/^@/, "").toLowerCase()
}

export default function TipPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle: rawHandle } = use(params)
  const handle = normalizeHandle(rawHandle)
  const { ready, authenticated, login } = usePrivy()
  const { wallets } = useWallets()

  const [amount, setAmount] = useState("0.01")
  const [fromName, setFromName] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{
    txHash?: string
    explorerUrl?: string | null
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const walletAddress = wallets[0]?.address

  const sendTip = async () => {
    if (!ready || !authenticated) {
      login()
      return
    }
    const tipAmount = Number(amount)
    if (!tipAmount || tipAmount <= 0 || tipAmount > 10) {
      toast.error("Enter an amount between 0.01 and 10 USDC")
      return
    }
    setSending(true)
    try {
      const res = await fetch("/api/wallet/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          amount: tipAmount,
          walletAddress,
          from: fromName || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Tip failed")
        return
      }
      setResult({ txHash: data.txHash, explorerUrl: data.explorerUrl })
      toast.success(`Sent ${tipAmount} USDC to @${handle}!`)
    } catch {
      toast.error("Could not send tip, try again")
    } finally {
      setSending(false)
    }
  }

  const copyShare = async () => {
    await navigator.clipboard.writeText(
      `Support @${handle} — send a USDC tip on Arc via DigiAgent 🎁`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col items-center px-4 pb-10">
      <Link href="/" className="self-start pt-5 flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={16} /> Back to app
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm mt-8"
      >
        <div className="rounded-3xl bg-surface border border-border p-6 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent mb-3">
            {handle.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-xl font-bold">@{handle}</h1>
          <p className="text-sm text-text-secondary mt-1">
            Say thanks with a USDC tip on Arc
          </p>

          {!result ? (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-bg/60 border border-border">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-2xl font-bold text-text-primary px-3 py-2 outline-none [appearance:textfield]"
                />
                <span className="text-sm font-semibold text-accent pr-3">
                  USDC
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["0.02", "0.05", "0.10"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                      amount === val
                        ? "bg-accent/15 border-accent/40 text-accent"
                        : "bg-bg/60 border-border text-text-secondary"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <input
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-bg/60 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />

              <button
                onClick={sendTip}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent text-bg font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
              >
                <Coffee size={18} />
                {sending
                  ? "Sending…"
                  : ready && authenticated
                    ? "Send tip"
                    : "Sign in with Google to tip"}
              </button>

              {!ready || !authenticated ? (
                <p className="text-xs text-text-muted">
                  You sign in once — your tip lands in {handle}&apos;s wallet on
                  Arc testnet.
                </p>
              ) : null}

              <button
                onClick={copyShare}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                Copy “thanks @{handle}” share text
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-accent/10 border border-accent/30 p-4">
                <p className="text-sm font-semibold text-accent">
                  Tip sent 🎉
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {Number(amount).toFixed(2)} USDC → @{handle}
                </p>
              </div>
              {result.explorerUrl ? (
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-sm text-accent hover:underline"
                >
                  View transaction <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-xs text-text-muted">
                  Transaction pending… check the explorer in a moment.
                </p>
              )}
              <button
                onClick={() => {
                  setResult(null)
                  setAmount("0.01")
                }}
                className="w-full py-3 rounded-2xl bg-surface-high border border-border text-sm font-medium text-text-primary hover:border-accent/50 transition-colors"
              >
                Send another
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-text-muted mt-6">
          Powered by DigiAgent · USDC on Arc testnet
        </p>
      </motion.div>
    </div>
  )
}