import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendUSDC, getTransaction } from "@/lib/circle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CAMPAIGNS: Record<
  string,
  { hashtag: string; rewardUsdc: string; cutoff: string }
> = {
  camp_arc_001: {
    hashtag: "#ArcNetwork",
    rewardUsdc: "1",
    cutoff: "2026-09-30T23:59:59Z",
  },
  camp_circle_002: {
    hashtag: "#USDCOnArc",
    rewardUsdc: "1",
    cutoff: "2026-09-30T23:59:59Z",
  },
  camp_digipaga_003: {
    hashtag: "#DigiAgent",
    rewardUsdc: "1",
    cutoff: "2026-12-31T23:59:59Z",
  },
};

const TWITTER_UA =
  "Mozilla/5.0 (compatible; DigiAgentBot/1.0; +https://digi-agent-ai.vercel.app)";

async function fetchTweet(tweetUrl: string): Promise<{
  id: string;
  text: string | null;
}> {
  const res = await fetch(tweetUrl, {
    headers: { "User-Agent": TWITTER_UA },
  });
  if (!res.ok) {
    throw new Error(`Tweet fetch failed with status ${res.status}`);
  }

  const html = await res.text();
  const idMatch = tweetUrl.match(/\/status\/(\d+)/);
  const id = idMatch?.[1] ?? "";

  let text: string | null = null;
  const metaMatch = html.match(/name="description" content="([^"]+)"/i);
  if (metaMatch?.[1]) {
    text = metaMatch[1];
  } else {
    const ogMatch = html.match(/property="og:description" content="([^"]+)"/i);
    if (ogMatch?.[1]) text = ogMatch[1];
  }

  return { id, text };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const tweetUrl: string | undefined = body?.tweetUrl;
    const privyId: string | undefined = body?.privyId;
    const campaignId: string | undefined = body?.campaignId;

    if (!tweetUrl || !/^https:\/\/(twitter\.com|x\.com)\//.test(tweetUrl)) {
      return NextResponse.json(
        { error: "A valid twitter.com or x.com URL is required" },
        { status: 400 },
      );
    }
    if (!privyId) {
      return NextResponse.json({ error: "privyId is required" }, { status: 400 });
    }
    const campaign = CAMPAIGNS[campaignId ?? ""];
    if (!campaign) {
      return NextResponse.json(
        { error: "Unknown campaign", available: Object.keys(CAMPAIGNS) },
        { status: 400 },
      );
    }

    if (new Date(campaign.cutoff).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This campaign is no longer active" },
        { status: 410 },
      );
    }

    const user = await prisma.user.findUnique({ where: { privyId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });
    const destinationAddress =
      wallet?.address ?? user.walletAddress ?? body?.walletAddress;
    if (!destinationAddress) {
      return NextResponse.json(
        { error: "No wallet address on file for this user" },
        { status: 400 },
      );
    }

    const tweet = await fetchTweet(tweetUrl);
    if (!tweet.text || !tweet.text.includes(campaign.hashtag)) {
      return NextResponse.json(
        {
          error: `Tweet must include ${campaign.hashtag}`,
          tweetText: tweet.text,
        },
        { status: 422 },
      );
    }

    const alreadyClaimed = await prisma.transaction.findFirst({
      where: {
        wallet: { userId: user.id },
        type: `campaign:${campaignId}`,
        description: { contains: tweet.id },
      },
    });
    if (alreadyClaimed) {
      return NextResponse.json(
        { error: "This tweet was already claimed" },
        { status: 409 },
      );
    }

    const rewardAmount = Number(campaign.rewardUsdc);
    const tx = await sendUSDC(destinationAddress, rewardAmount, tweet.id);

    let circleTxId: string | undefined;
    let txHash: string | null = null;
    if (tx?.id) {
      circleTxId = tx.id;
      const detail = await getTransaction(tx.id);
      txHash = detail?.txHash ?? null;
    }

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: { rewardsBalance: { increment: rewardAmount } },
      create: {
        userId: user.id,
        address: destinationAddress,
        rewardsBalance: rewardAmount,
      },
    });

    const walletRow = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    await prisma.transaction.create({
      data: {
        walletId: walletRow!.id,
        circleTxId,
        type: `campaign:${campaignId}`,
        description: `Verified ${campaign.hashtag} tweet ${tweet.id}`,
        amount: rewardAmount,
        asset: "USDC",
        status: txHash ? "confirmed" : "pending",
        txHash,
      },
    });

    const explorerUrl = txHash
      ? `${process.env.ARC_EXPLORER ?? "https://testnet.arcscan.app"}/tx/${txHash}`
      : null;

    return NextResponse.json({
      success: true,
      campaignId,
      hashtag: campaign.hashtag,
      amount: rewardAmount,
      asset: "USDC",
      txId: circleTxId,
      txHash,
      explorerUrl,
    });
  } catch (error) {
    console.error("verify-tweet error", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}