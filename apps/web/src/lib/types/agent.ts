export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  cards?: string[]
}
