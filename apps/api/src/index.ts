import "dotenv/config";
import express from "express";

const app = express();
const port = process.env["PORT"] ?? 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api", version: "1.0.0" });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
