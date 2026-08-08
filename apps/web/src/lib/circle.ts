import { createRequire } from "node:module";
import { v4 as uuidv4 } from "uuid";
import type { CircleDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const require = createRequire(import.meta.url);
const CircleSdk = require("@circle-fin/developer-controlled-wallets") as typeof import("@circle-fin/developer-controlled-wallets");

const ARC_TESTNET = CircleSdk.Blockchain.ArcTestnet;

const USDC_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000001";

function getCircleClient(): CircleDeveloperControlledWalletsClient {
  return CircleSdk.initiateDeveloperControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
    entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    baseUrl: process.env.CIRCLE_API_URL ?? "https://api.circle.com",
  });
}

export async function createUserWallet(userId: string) {
  const circle = getCircleClient();

  const response = await circle.createWallets({
    blockchains: [ARC_TESTNET],
    count: 1,
    walletSetId: process.env.CIRCLE_WALLET_SET_ID!,
    idempotencyKey: uuidv4(),
    accountType: "EOA",
    metadata: [{ name: userId }],
  });

  const walletData = response.data?.wallets?.[0];
  if (!walletData?.id) {
    throw new Error("Circle did not return a wallet");
  }

  return walletData;
}

export async function listWalletBalance(walletId: string) {
  const circle = getCircleClient();

  const response = await circle.getWalletTokenBalance({
    id: walletId,
  });

  const balances = response.data?.tokenBalances ?? [];
  const findAmount = (search: string) => {
    const match = balances.find(
      (b) =>
        b.token.blockchain === ARC_TESTNET &&
        (b.token.name?.toUpperCase().includes(search) ||
          b.token.symbol?.toUpperCase().includes(search)),
    );
    return match ? Number(match.amount) : 0;
  };

  return {
    usdcBalance: findAmount("USDC"),
    eurcBalance: findAmount("EURC"),
  };
}

export async function sendUSDC(
  destinationAddress: string,
  amount: number,
  refId?: string,
) {
  const circle = getCircleClient();

  const response = await circle.createTransaction({
    walletId: process.env.CIRCLE_WALLET_ID!,
    destinationAddress,
    amount: [amount.toFixed(6)],
    tokenAddress: USDC_TOKEN_ADDRESS,
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    refId,
    idempotencyKey: uuidv4(),
  });

  return response.data;
}

export async function getTransaction(txId: string) {
  const circle = getCircleClient();
  const response = await circle.getTransaction({ id: txId });
  return response.data?.transaction ?? null;
}