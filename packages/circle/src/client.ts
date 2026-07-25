import type { CircleConfig, CircleWallet, CircleTransfer } from "./types";

export class CircleClient {
  private config: CircleConfig;

  constructor(config: CircleConfig) {
    this.config = config;
  }

  async createWallet(): Promise<CircleWallet> {
    throw new Error("Circle createWallet not implemented");
  }

  async getWallet(walletId: string): Promise<CircleWallet> {
    throw new Error("Circle getWallet not implemented");
  }

  async transfer(
    sourceWalletId: string,
    destinationAddress: string,
    amount: string,
  ): Promise<CircleTransfer> {
    throw new Error("Circle transfer not implemented");
  }

  async getTransfers(walletId: string): Promise<CircleTransfer[]> {
    throw new Error("Circle getTransfers not implemented");
  }
}
