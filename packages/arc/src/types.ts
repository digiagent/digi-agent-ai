import { z } from "zod";

export const ArcConfigSchema = z.object({
  rpcUrl: z.string(),
  chainId: z.number(),
  privateKey: z.string().optional(),
});

export type ArcConfig = z.infer<typeof ArcConfigSchema>;

export interface ArcContract {
  address: string;
  abi: Record<string, unknown>[];
  name: string;
}

export interface ArcTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  timestamp?: string;
}
