"use client"

import { motion } from "framer-motion"
import { AgentChatPanel } from "@/components/ui/AgentChatPanel"

export default function AgentPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full p-0 flex flex-col"
    >
      <div className="flex-1 flex flex-col">
        <AgentChatPanel fullScreen />
      </div>
    </motion.div>
  )
}
