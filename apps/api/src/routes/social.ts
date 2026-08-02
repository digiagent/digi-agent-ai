import { Router, type Router as RouterType } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const router: RouterType = Router();

const linkAccountSchema = z.object({
  platform: z.enum(["instagram", "tiktok", "youtube", "x", "snapchat"]),
  handle: z.string().min(1).max(60),
  followers: z.number().int().min(0).default(0),
});

router.get("/accounts", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
  });
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id },
  });

  res.json({ accounts });
});

router.post("/link", requireAuth, async (req, res) => {
  const parsed = linkAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const user = await prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
  });
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const { platform, handle, followers } = parsed.data;

  const account = await prisma.socialAccount.upsert({
    where: { userId_platform: { userId: user.id, platform } },
    update: { handle, followers, connected: true },
    create: {
      userId: user.id,
      platform,
      handle,
      followers,
      connected: true,
    },
  });

  res.status(201).json({ account });
});

router.delete("/link/:platform", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { privyId: req.user!.privyId },
  });
  if (!user) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const platform = String(req.params.platform);
  const allowed = ["instagram", "tiktok", "youtube", "x", "snapchat"];
  if (!allowed.includes(platform)) {
    return res.status(400).json({ error: "Unsupported platform" });
  }

  await prisma.socialAccount.deleteMany({
    where: { userId: user.id, platform },
  });

  res.json({ success: true });
});

router.post("/callback", async (req, res) => {
  const { platform, handle, userId, followers } = req.body as {
    platform?: string;
    handle?: string;
    userId?: string;
    followers?: number;
  };

  if (!platform || !handle || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const account = await prisma.socialAccount.upsert({
    where: {
      userId_platform: { userId, platform },
    },
    update: {
      handle,
      followers: typeof followers === "number" ? followers : 0,
      connected: true,
    },
    create: {
      userId,
      platform,
      handle,
      followers: typeof followers === "number" ? followers : 0,
      connected: true,
    },
  });

  res.json({ account });
});

export default router;
