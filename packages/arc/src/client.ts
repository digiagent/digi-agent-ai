import type { ArcConfig, ArcContract, ArcTransaction } from "./types";

export class ArcClient {
  private config: ArcConfig;

  constructor(config: ArcConfig) {
    this.config = config;
  }

  async deployContract(
    name: string,
    bytecode: string,
    abi: Record<string, unknown>[],
  ): Promise<ArcContract> {
    throw new Error("Arc deployContract not implemented");
  }

  async callContract(
    contractAddress: string,
    method: string,
    args: unknown[],
  ): Promise<unknown> {
    throw new Error("Arc callContract not implemented");
  }

  async getTransaction(txHash: string): Promise<ArcTransaction> {
    throw new Error("Arc getTransaction not implemented");
  }

  async getBalance(address: string): Promise<string> {
    throw new Error("Arc getBalance not implemented");
  }
}
