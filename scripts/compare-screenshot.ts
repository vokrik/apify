/**
 * Visual fidelity check: renders a prototype URL in Chromium and composes it side by side
 * (plus a 50% overlay) with a reference screenshot of the real Apify Console.
 *
 * The reference is scaled to the viewport width, so a 2x Retina screenshot of a 1440px-wide
 * window compares 1:1 with a 1440px viewport.
 *
 * Usage:
 *   node scripts/compare-screenshot.ts <reference.png> [--url http://localhost:5173/]
 *     [--scroll 0] [--width 1440] [--height 900] [--out .context/compare.png]
 *     [--clip x,y,w,h]   (CSS px of the viewport, to zoom into a region)
 *     [--ref-origin x,y] [--ref-scale 2]
 *       For a *cropped* reference screenshot: the CSS px position of the crop's top-left corner
 *       in the viewport, and the image's pixels per CSS px (2 for Retina).
 *
 * Start the app first (`pnpm dev`). Output: <out> (side by side) and <out>-overlay.png.
 */
import { readFileSync, writeFileSync } from "node:fs";

import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const reference = args[0];
if (!reference) {
  console.error("Usage: node scripts/compare-screenshot.ts <reference.png> [--url …] [--scroll N]");
  process.exit(1);
}
const opt = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1]!;
};
const url = opt("url", "http://localhost:5173/");
const scroll = Number(opt("scroll", "0"));
const width = Number(opt("width", "1440"));
const height = Number(opt("height", "900"));
const out = opt("out", ".context/compare.png");
const clipArg = opt("clip", "");
const clip = clipArg ? clipArg.split(",").map(Number) : [0, 0, width, height];
const originArg = opt("ref-origin", "");
const refOrigin = originArg ? originArg.split(",").map(Number) : null;
const refScale = Number(opt("ref-scale", "2"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
// Start every comparison from a clean demo state (no dismissed banners etc.).
await page.addInitScript(() => localStorage.clear());
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate((y) => window.scrollTo(0, y), scroll);
await page.waitForTimeout(200);
const actual = (await page.screenshot()).toString("base64");
const ref = readFileSync(reference).toString("base64");

const compose = await browser.newPage();
const [sideBySide, overlay] = await compose.evaluate(
  async ({ actualB64, refB64, vw, box, origin, scale }) => {
    // Runs inside the browser page, so it can't be hoisted to module scope.
    // oxlint-disable-next-line unicorn/consistent-function-scoping
    const load = async (b64: string) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      return img;
    };
    const [a, r] = await Promise.all([load(actualB64), load(refB64)]);
    const [cx, cy, cw, ch] = box as [number, number, number, number];
    const s = 2; // output at 2x
    const draw = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      dx: number,
      crop?: { origin: number[]; scale: number },
    ) => {
      if (crop) {
        const [ox, oy] = crop.origin as [number, number];
        const k = crop.scale;
        ctx.drawImage(img, (cx - ox) * k, (cy - oy) * k, cw * k, ch * k, dx, 0, cw * s, ch * s);
        return;
      }
      const k = img.width / vw; // source px per CSS px
      ctx.drawImage(img, cx * k, cy * k, cw * k, ch * k, dx, 0, cw * s, ch * s);
    };
    const refCrop = origin ? { origin, scale } : undefined;
    const c1 = document.createElement("canvas");
    c1.width = cw * s * 2 + 8;
    c1.height = ch * s;
    const x1 = c1.getContext("2d")!;
    x1.fillStyle = "#ff00ff";
    x1.fillRect(0, 0, c1.width, c1.height);
    draw(x1, r, 0, refCrop);
    draw(x1, a, cw * s + 8);
    const c2 = document.createElement("canvas");
    c2.width = cw * s;
    c2.height = ch * s;
    const x2 = c2.getContext("2d")!;
    draw(x2, r, 0, refCrop);
    x2.globalAlpha = 0.5;
    draw(x2, a, 0);
    return [c1.toDataURL("image/png"), c2.toDataURL("image/png")].map((d) => d.split(",")[1]!);
  },
  { actualB64: actual, refB64: ref, vw: width, box: clip, origin: refOrigin, scale: refScale },
);
writeFileSync(out, Buffer.from(sideBySide!, "base64"));
writeFileSync(out.replace(/\.png$/, "-overlay.png"), Buffer.from(overlay!, "base64"));
console.log(`Wrote ${out} (left: reference, right: prototype) and the overlay.`);
await browser.close();
