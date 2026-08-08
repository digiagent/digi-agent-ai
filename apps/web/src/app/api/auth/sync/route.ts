import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createUserWallet } from "@/lib/circle";

export const runtime = "nodejs";

function generateHandle(privyId: string): string {
  const base = privyId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toLowerCase();
  return `${base}${Date.now().toString(36).slice(-4)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const privyId: string | undefined = body?.privyId;
    const walletAddress: string | undefined = body?.walletAddress;
    const displayName: string | undefined = body?.displayName;
    const email: string | undefined = body?.email;

    if (!privyId) {
      return NextResponse.json({ error: "privyId is required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { privyId } });

    if (!user) {
      let digiHandle = generateHandle(privyId);
      while (await prisma.user.findUnique({ where: { digiHandle } })) {
        digiHandle = generateHandle(privyId);
      }
      user = await prisma.user.create({
        data: {
          privyId,
          digiHandle,
          displayName: displayName ?? null,
          email: email ?? null,
          walletAddress: walletAddress ?? null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(displayName ? { displayName } : {}),
          ...(email ? { email } : {}),
          ...(walletAddress ? { walletAddress } : {}),
        },
      });
    }

    let wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet?.circleWalletId) {
      try {
        const circleWallet = await createUserWallet(user.id);
        wallet = await prisma.wallet.upsert({
          where: { userId: user.id },
          update: {
            circleWalletId: circleWallet.id,
            circleWalletSetId: process.env.CIRCLE_WALLET_SET_ID,
            address: circleWallet.address ?? null,
          },
          create: {
            userId: user.id,
            circleWalletId: circleWallet.id,
            circleWalletSetId: process.env.CIRCLE_WALLET_SET_ID,
            address: circleWallet.address ?? null,
          },
        });
      } catch {
        wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        privyId: user.privyId,
        digiHandle: user.digiHandle,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        email: user.email,
        userType: user.userType,
        walletAddress: user.walletAddress,
      },
      wallet: wallet
        ? {
            id: wallet.id,
            circleWalletId: wallet.circleWalletId,
            address: wallet.address,
            usdcBalance: wallet.usdcBalance,
            eurcBalance: wallet.eurcBalance,
            rewardsBalance: wallet.rewardsBalance,
          }
        : null,
      digiHandle: user.digiHandle,
    });
  } catch (error) {
    console.error("auth/sync error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}