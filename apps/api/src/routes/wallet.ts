import { Router, type Router as RouterType } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import {
  createUserWallet,
  getWalletBalance,
  getTransaction,
} from "../services/circle.js";

const router: RouterType = Router();

async function resolveUser(req: import("express").Request) {
  return prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
    include: { wallet: true },
  });
}

router.post("/create", requireAuth, async (req, res) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const wallet = await createUserWallet(user.id);
  await prisma.user.update({
    where: { id: user.id },
    data: { walletAddress: wallet.address ?? null },
  });

  res.status(201).json({ wallet });
});

router.get("/balance", requireAuth, async (req, res) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const address = user.wallet?.address ?? process.env.CIRCLE_WALLET_ADDRESS;

  if (!address) {
    return res.status(200).json({
      balance: { usdcBalance: 0, eurcBalance: 0, rewardsBalance: 0 },
    });
  }

  const balance = await getWalletBalance(address);
  res.json({ balance });
});

router.get("/activity", requireAuth, async (req, res) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const transactions = await prisma.transaction.findMany({
    where: { walletId: user.wallet?.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const enriched = await Promise.all(
    transactions.map(async (tx) => {
      if (tx.status === "pending" && tx.circleTxId) {
        try {
          const state = await getTransaction(tx.circleTxId);
          return {
            ...tx,
            status: state?.state ?? tx.status,
            txHash: state?.txHash ?? tx.txHash,
          };
        } catch {
          return tx;
        }
      }
      return tx;
    }),
  );

  res.json({ activity: enriched });
});

export default router;
