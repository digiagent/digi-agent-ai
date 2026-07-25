export type AgentCapability =
  | "conversation"
  | "payment"
  | "scoring"
  | "recommendation"
  | "wallet"
  | "social"
  | "voice"
  | "affiliate";

export interface AgentAction {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  capabilities: AgentCapability[];
  config: Record<string, unknown>;
  active: boolean;
}
