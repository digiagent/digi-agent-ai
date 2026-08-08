import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendUSDC, getTransaction } from "@/lib/circle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TIP = 0.01;
const MAX_TIP = 10;

function normalizeHandle(input: string): string {
  return input.trim().replace(/^@/, "").toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const handle = normalizeHandle(body?.handle ?? "");
    const amount: number | undefined = body?.amount;
    const fromWalletAddress: string | undefined = body?.walletAddress;
    const senderName: string | undefined = body?.from;

    if (!handle) {
      return NextResponse.json({ error: "handle is required" }, { status: 400 });
    }

    const recipient = await prisma.user.findUnique({ where: { digiHandle: handle } });
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const recipientWallet = await prisma.wallet.findUnique({
      where: { userId: recipient.id },
    });
    const destinationAddress =
      recipientWallet?.address ?? recipient.walletAddress;
    if (!destinationAddress) {
      return NextResponse.json(
        { error: `@${recipient.digiHandle} has no wallet address yet` },
        { status: 400 },
      );
    }

    const tipAmount = amount ?? DEFAULT_TIP;
    if (tipAmount <= 0 || tipAmount > MAX_TIP) {
      return NextResponse.json(
        { error: `Amount must be between 0 and ${MAX_TIP} USDC` },
        { status: 400 },
      );
    }

    const tx = await sendUSDC(destinationAddress, tipAmount);

    let circleTxId: string | undefined;
    let txHash: string | null = null;
    if (tx?.id) {
      circleTxId = tx.id;
      const detail = await getTransaction(tx.id);
      txHash = detail?.txHash ?? null;
    }

    await prisma.wallet.upsert({
      where: { userId: recipient.id },
      update: { usdcBalance: { increment: tipAmount } },
      create: {
        userId: recipient.id,
        address: destinationAddress,
        usdcBalance: tipAmount,
      },
    });

    const recipientWalletRow = await prisma.wallet.findUnique({
      where: { userId: recipient.id },
    });

    await prisma.transaction.create({
      data: {
        walletId: recipientWalletRow!.id,
        circleTxId,
        type: "tip:in",
        description: `Tip from ${senderName ?? "anon"} via tip link`,
        amount: tipAmount,
        asset: "USDC",
        status: txHash ? "confirmed" : "pending",
        txHash,
      },
    });

    if (fromWalletAddress) {
      const senderUser = await prisma.user.findFirst({
        where: { walletAddress: fromWalletAddress },
      });
      const senderWallet = senderUser
        ? await prisma.wallet.findUnique({ where: { userId: senderUser.id } })
        : null;

      if (senderWallet) {
        await prisma.transaction
          .create({
            data: {
              walletId: senderWallet.id,
              circleTxId,
              type: "tip:out",
              description: `Tip sent to @${recipient.digiHandle}`,
              amount: -tipAmount,
              asset: "USDC",
              status: txHash ? "confirmed" : "pending",
              txHash,
            },
          })
          .catch(() => null);
      }
    }

    const explorerUrl = txHash
      ? `${process.env.ARC_EXPLORER ?? "https://testnet.arcscan.app"}/tx/${txHash}`
      : null;

    return NextResponse.json({
      success: true,
      recipient: recipient.digiHandle,
      amount: tipAmount,
      asset: "USDC",
      txId: circleTxId,
      txHash,
      explorerUrl,
    });
  } catch (error) {
    console.error("wallet/tip error", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}