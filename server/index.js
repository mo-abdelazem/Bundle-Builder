import express from "express";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, "..", "src", "data", "catalog.json");
const PORT = process.env.PORT || 8787;

const app = express();

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/catalog", async (_req, res) => {
  try {
    const raw = await readFile(CATALOG_PATH, "utf-8");
    res.type("application/json").send(raw);
  } catch (err) {
    console.error("Failed to read catalog:", err);
    res.status(500).json({ error: "Could not load catalog" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`  GET /api/catalog`);
  console.log(`  GET /api/health`);
});
