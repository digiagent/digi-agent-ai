import { createRequire } from "node:module";
import type { CircleDeveloperControlledWalletsClient, TransactionState } from "@circle-fin/developer-controlled-wallets";
import { prisma } from "../lib/prisma.js";

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

  const existing = await prisma.wallet.findUnique({ where: { userId } });
  if (existing?.circleWalletId) {
    return existing;
  }

  const response = await circle.createWallets({
    blockchains: [ARC_TESTNET],
    count: 1,
    walletSetId: process.env.CIRCLE_WALLET_SET_ID!,
    idempotencyKey: crypto.randomUUID(),
  });

  const walletData = response.data?.wallets?.[0];
  if (!walletData?.id) {
    throw new Error("Circle did not return a wallet");
  }

  return prisma.wallet.upsert({
    where: { userId },
    update: {
      circleWalletId: walletData.id,
      circleWalletSetId: process.env.CIRCLE_WALLET_SET_ID,
      address: walletData.address ?? null,
    },
    create: {
      userId,
      circleWalletId: walletData.id,
      circleWalletSetId: process.env.CIRCLE_WALLET_SET_ID,
      address: walletData.address ?? null,
    },
  });
}

export async function getWalletBalance(address: string) {
  const circle = getCircleClient();

  const wallet = await prisma.wallet.findFirst({
    where: { address },
  });

  const circleWalletId =
    wallet?.circleWalletId ??
    (address === process.env.CIRCLE_WALLET_ADDRESS
      ? process.env.CIRCLE_WALLET_ID
      : undefined);

  if (!circleWalletId) {
    return { usdcBalance: 0, eurcBalance: 0, rewardsBalance: 0 };
  }

  const response = await circle.getWalletTokenBalance({
    id: circleWalletId,
    includeAll: true,
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

  const usdcAmount = findAmount("USDC");
  const eurcAmount = findAmount("EURC");

  if (wallet) {
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { usdcBalance: usdcAmount, eurcBalance: eurcAmount },
    });
  }

  return { usdcBalance: usdcAmount, eurcBalance: eurcAmount, rewardsBalance: 0 };
}

export async function sendUSDC(
  fromWalletAddress: string,
  toAddress: string,
  amount: number,
  refId?: string,
) {
  const circle = getCircleClient();

  const response = await circle.createTransaction({
    walletAddress: fromWalletAddress,
    blockchain: ARC_TESTNET,
    destinationAddress: toAddress,
    amount: [amount.toFixed(6)],
    tokenAddress: USDC_TOKEN_ADDRESS,
    fee: { type: "level", config: { feeLevel: "MEDIUM" } },
    refId,
    idempotencyKey: crypto.randomUUID(),
  });

  return response.data;
}

export async function getTransaction(txId: string) {
  const circle = getCircleClient();
  const response = await circle.getTransaction({ id: txId });
  return response.data?.transaction ?? null;
}

export async function getTransactionState(txId: string): Promise<TransactionState> {
  const tx = await getTransaction(txId);
  return tx?.state ?? CircleSdk.TransactionState.Failed;
}
