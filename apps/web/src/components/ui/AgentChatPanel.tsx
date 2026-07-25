"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Bot, User } from "lucide-react"
import { useAgent } from "@/hooks/useAgent"
import { useMockData } from "@/components/providers/MockDataProvider"
import { CampaignCard } from "./CampaignCard"

interface Props {
  fullScreen?: boolean
  onClose?: () => void
}

export function AgentChatPanel({ fullScreen, onClose }: Props) {
  const { messages, isTyping, input, setInput, sendMessage, selectQuickAction, quickActions } =
    useAgent()
  const { campaigns } = useMockData()
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input.trim())
  }

  return (
    <div
      className={`flex flex-col ${
        fullScreen ? "h-full" : "h-full"
      } bg-surface rounded-card border border-border`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-accent" />
          <span className="text-sm font-semibold text-text-primary">DigiAgent</span>
          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
          <span className="text-[10px] text-positive">Online</span>
        </div>
        <select className="text-xs bg-surface-high text-text-secondary border border-border rounded-lg px-2 py-1 outline-none">
          <option>DigiAgent v0.1</option>
        </select>
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-accent" />
              </div>
            )}
            <div
              className={`max-w-[80%] ${
                msg.role === "user"
                  ? "bg-accent text-bg rounded-2xl rounded-tr-sm"
                  : "bg-surface-high text-text-primary rounded-2xl rounded-tl-sm"
              } px-4 py-2.5`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>

              {msg.cards && (
                <div className="mt-3 space-y-2">
                  {msg.cards.map((cid) => {
                    const camp = campaigns.find((c) => c.id === cid)
                    if (!camp) return null
                    return (
                      <CampaignCard key={cid} campaign={camp} compact />
                    )
                  })}
                </div>
              )}

              <p className="text-[10px] text-text-muted mt-1 opacity-60">
                {msg.timestamp}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                <User size={14} className="text-bg" />
              </div>
            )}
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-accent" />
              </div>
              <div className="bg-surface-high rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-3 py-2 border-t border-border">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => selectQuickAction(action.prompt)}
              className="whitespace-nowrap text-[11px] px-2.5 py-1.5 rounded-full bg-surface-high text-text-secondary border border-border hover:border-accent/50 hover:text-accent transition-colors flex-shrink-0"
            >
              {action.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-surface-high transition-colors text-text-muted hover:text-accent"
          >
            <Mic size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask DigiAgent anything..."
            className="flex-1 bg-surface-high border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-full bg-accent text-bg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
