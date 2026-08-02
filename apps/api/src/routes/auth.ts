import { Router, type Router as RouterType } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { createUserWallet } from "../services/circle.js";

const router: RouterType = Router();

const createProfileSchema = z.object({
  digiHandle: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores"),
  displayName: z.string().min(1).max(60).optional(),
  avatarUrl: z.string().url().optional(),
  email: z.string().email().optional(),
  userType: z.enum(["creator", "brand"]).default("creator"),
});

router.get("/verify", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
    include: {
      wallet: true,
      commerceScore: true,
      socialAccounts: true,
    },
  });

  res.json({
    authenticated: true,
    user: user
      ? {
          id: user.id,
          privyId: user.privyId,
          digiHandle: user.digiHandle,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          email: user.email,
          userType: user.userType,
          walletAddress: user.walletAddress,
          hasWallet: Boolean(user.wallet?.circleWalletId),
          hasProfile: true,
        }
      : null,
  });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
    include: {
      wallet: true,
      commerceScore: true,
      socialAccounts: true,
      referrals: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  res.json({ user });
});

router.post("/create-profile", requireAuth, async (req, res) => {
  const parsed = createProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { digiHandle, displayName, avatarUrl, email, userType } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { digiHandle },
  });
  if (existing) {
    return res.status(409).json({ error: "digiHandle is already taken" });
  }

  const user = await prisma.user.create({
    data: {
      privyId: req.user!.privyId,
      digiHandle,
      displayName: displayName ?? null,
      avatarUrl: avatarUrl ?? null,
      email: email ?? req.user!.email ?? null,
      userType,
    },
  });

  try {
    const wallet = await createUserWallet(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { walletAddress: wallet.address },
    });
  } catch (err) {
    console.error("Wallet creation deferred:", err);
  }

  res.status(201).json({ user });
});

export default router;
