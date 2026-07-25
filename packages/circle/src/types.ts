import { z } from "zod";

export const CircleConfigSchema = z.object({
  apiKey: z.string(),
  baseUrl: z.string().default("https://api.circle.com/v1"),
  environment: z.enum(["sandbox", "production"]).default("sandbox"),
});

export type CircleConfig = z.infer<typeof CircleConfigSchema>;

export interface CircleWallet {
  id: string;
  address: string;
  blockchain: string;
  balance: CircleBalance;
}

export interface CircleBalance {
  amount: string;
  currency: string;
}

export interface CircleTransfer {
  id: string;
  sourceWalletId: string;
  destinationAddress: string;
  amount: string;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}
