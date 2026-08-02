import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import commerceRoutes from "./routes/commerce.js";
import socialRoutes from "./routes/social.js";
import walletRoutes from "./routes/wallet.js";

const app = express();
const port = process.env["PORT"] ?? 4000;

const allowedOrigins = (
  process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:3001"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get("/", (_req, res) => {
  res.json({
    service: "DigiAgent API",
    status: "ok",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/commerce", commerceRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
