#!/usr/bin/env node
import { existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "dist", "client", "assets", "templates");
const runtimeAssets = new Set([
  "clean-equal-height-report-pages",
  "consulting-equal-height-report-pages",
  "dark-equal-height-report-pages",
  "editorial-equal-height-report-pages",
]);

if (!existsSync(templateDir)) {
  throw new Error("Missing production template directory: " + templateDir);
}

for (const entry of readdirSync(templateDir)) {
  if (!runtimeAssets.has(entry)) {
    rmSync(path.join(templateDir, entry), { recursive: true, force: true });
  }
}

console.log("Pruned unused template-generation assets from dist/client.");
