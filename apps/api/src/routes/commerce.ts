import { Router, type Router as RouterType } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import {
  sendUSDC,
  getWalletBalance,
  getTransaction,
} from "../services/circle.js";

const router: RouterType = Router();

async function resolveUser(req: import("express").Request) {
  return prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
    include: { wallet: true, socialAccounts: true, commerceScore: true },
  });
}

router.get("/commerce-score", requireAuth, async (req, res) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const accounts = user.socialAccounts.filter((a) => a.connected);
  const totalFollowers = accounts.reduce((sum, a) => sum + a.followers, 0);
  const audienceReach = totalFollowers;
  const engagementRate = Math.min(100, Math.round(totalFollowers ? 2 + (totalFollowers % 7) : 0));
  const postingFrequency = Math.min(100, 30 + accounts.length * 15);
  const nicheAlignment = 60;
  const locationSignal = 50;
  const aiConfidence = 85;

  const score = Math.min(
    100,
    Math.round(
      audienceReach * 0.25 +
        engagementRate * 0.25 +
        postingFrequency * 0.2 +
        nicheAlignment * 0.15 +
        locationSignal * 0.15,
    ),
  );

  const commerceScore = await prisma.commerceScore.upsert({
    where: { userId: user.id },
    update: {
      score,
      audienceReach,
      engagementRate,
      postingFrequency,
      nicheAlignment,
      locationSignal,
      aiConfidence,
      niches: accounts.map((a) => a.platform),
    },
    create: {
      userId: user.id,
      score,
      audienceReach,
      engagementRate,
      postingFrequency,
      nicheAlignment,
      locationSignal,
      aiConfidence,
      niches: accounts.map((a) => a.platform),
    },
  });

  res.json({ commerceScore });
});

const paySchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(200),
  refId: z.string().max(100).optional(),
});

router.post("/pay", requireAuth, async (req, res) => {
  const parsed = paySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }
  if (!user.wallet?.address || !user.wallet.id) {
    return res.status(400).json({ error: "No wallet created yet" });
  }

  const { amount, description, refId } = parsed.data;
  const destination = process.env.CIRCLE_WALLET_ADDRESS;
  if (!destination) {
    return res.status(500).json({ error: "Payments not configured" });
  }

  const balance = await getWalletBalance(user.wallet.address);
  if (balance.usdcBalance < amount) {
    return res.status(400).json({
      error: "Insufficient USDC balance",
      balance: balance.usdcBalance,
    });
  }

  try {
    const result = await sendUSDC(
      user.wallet.address,
      destination,
      amount,
      refId,
    );

    const transaction = await prisma.transaction.create({
      data: {
        walletId: user.wallet.id,
        circleTxId: result?.id,
        type: "payment",
        description,
        amount: -amount,
        asset: "USDC",
        status: result?.state ?? "pending",
      },
    });

    res.status(201).json({ transaction });
  } catch (err) {
    console.error("Payment failed:", err);
    res.status(502).json({ error: "Circle payment failed" });
  }
});

const payoutSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(200).optional(),
});

router.post("/payout", requireAuth, async (req, res) => {
  const parsed = payoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }
  if (!user.wallet?.address || !user.wallet.id) {
    return res.status(400).json({ error: "No wallet created yet" });
  }

  const treasuryWalletAddress = process.env.CIRCLE_WALLET_ADDRESS;
  if (!treasuryWalletAddress) {
    return res.status(500).json({ error: "Treasury not configured" });
  }

  const { amount, description } = parsed.data;

  try {
    const result = await sendUSDC(
      treasuryWalletAddress,
      user.wallet.address,
      amount,
    );

    const transaction = await prisma.transaction.create({
      data: {
        walletId: user.wallet.id,
        circleTxId: result?.id,
        type: "payout",
        description: description ?? "Rewards payout",
        amount,
        asset: "USDC",
        status: result?.state ?? "pending",
      },
    });

    res.status(201).json({ transaction });
  } catch (err) {
    console.error("Payout failed:", err);
    res.status(502).json({ error: "Circle payout failed" });
  }
});

router.get("/transaction/:id", requireAuth, async (req, res) => {
  const tx = await prisma.transaction.findUnique({
    where: { id: String(req.params.id) },
  });

  if (!tx) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  if (tx.status === "pending" && tx.circleTxId) {
    const state = await getTransaction(tx.circleTxId);
    return res.json({
      transaction: {
        ...tx,
        status: state?.state ?? tx.status,
        txHash: state?.txHash ?? tx.txHash,
      },
    });
  }

  res.json({ transaction: tx });
});

const referralSchema = z.object({
  campaignId: z.string().min(1).max(100),
  trackingUrl: z.string().url(),
});

router.get("/referral", requireAuth, async (req, res) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const referrals = await prisma.referral.findMany({
    where: { userId: user.id },
  });

  res.json({ referrals });
});

router.post("/referral", requireAuth, async (req, res) => {
  const parsed = referralSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const existing = await prisma.referral.findFirst({
    where: { userId: user.id, campaignId: parsed.data.campaignId },
  });
  if (existing) {
    return res.json({ referral: existing });
  }

  const referral = await prisma.referral.create({
    data: {
      userId: user.id,
      campaignId: parsed.data.campaignId,
      trackingUrl: parsed.data.trackingUrl,
    },
  });

  res.status(201).json({ referral });
});

export default router;
