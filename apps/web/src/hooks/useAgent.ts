"use client"

import { useState } from "react"
import { agentConversation, agentQuickActions } from "@/lib/mock"
import type { AgentMessage } from "@/lib/types/agent"

export function useAgent() {
  const [messages, setMessages] = useState<AgentMessage[]>(agentConversation)
  const [isTyping, setIsTyping] = useState(false)
  const [input, setInput] = useState("")

  const sendMessage = (text: string) => {
    const userMsg: AgentMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const reply: AgentMessage = {
        role: "assistant",
        content: "I'm processing your request. In the full version, I'd analyze this and respond with actionable insights. For now, this is a mock response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, reply])
      setIsTyping(false)
    }, 1500)
  }

  const selectQuickAction = (prompt: string) => {
    setInput(prompt)
    sendMessage(prompt)
  }

  return {
    messages,
    isTyping,
    input,
    setInput,
    sendMessage,
    selectQuickAction,
    quickActions: agentQuickActions,
  }
}
