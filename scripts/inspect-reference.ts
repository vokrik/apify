/**
 * Inspect a saved Apify Console page from `reference/`.
 *
 * Prints a compact outline of the DOM subtree matching a CSS selector, and (with --css) every
 * CSS rule — from the page's styled-components block and the global `assets/main.css` — whose
 * selector mentions a class used inside that subtree.
 *
 * Usage:
 *   node scripts/inspect-reference.ts <page.html> <selector> [--depth N] [--css] [--all]
 *
 * Examples:
 *   node scripts/inspect-reference.ts reference/console/store/index.html 'nav' --depth 6
 *   node scripts/inspect-reference.ts reference/console/store/index.html '[data-test="nav-store"]' --css
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { parseHTML } from "linkedom";

type Rule = { selector: string; body: string; media?: string };

const args = process.argv.slice(2);
const [file, selector] = args;
if (!file || !selector) {
  console.error(
    "Usage: node scripts/inspect-reference.ts <page.html> <selector> [--depth N] [--css] [--all]",
  );
  process.exit(1);
}
const depthIndex = args.indexOf("--depth");
const maxDepth = depthIndex === -1 ? 50 : Number(args[depthIndex + 1]);
const withCss = args.includes("--css");
const all = args.includes("--all");

const html = readFileSync(file, "utf8");
const { document } = parseHTML(html);

const matches = all ? [...document.querySelectorAll(selector)] : [document.querySelector(selector)];
if (!matches[0]) {
  console.error(`No element matches ${selector}`);
  process.exit(1);
}

const usedClasses = new Set<string>();

function outline(el: Element, depth: number): string[] {
  const indent = "  ".repeat(depth);
  const tag = el.tagName.toLowerCase();
  if (tag === "svg") {
    const viewBox = el.getAttribute("viewBox");
    return [`${indent}<svg viewBox="${viewBox}" class="${el.getAttribute("class") ?? ""}"/>`];
  }
  const attrs = [
    "class",
    "data-test",
    "href",
    "role",
    "aria-label",
    "src",
    "alt",
    "type",
    "placeholder",
  ]
    .map((a) => [a, el.getAttribute(a)] as const)
    .filter(([, v]) => v)
    .map(([a, v]) => `${a}="${a === "src" && v!.length > 80 ? v!.slice(0, 80) + "…" : v}"`)
    .join(" ");
  const lines = [`${indent}<${tag}${attrs ? " " + attrs : ""}>`];
  if (depth >= maxDepth) {
    const text = el.textContent?.trim().replace(/\s+/g, " ") ?? "";
    if (text) lines.push(`${indent}  … "${text.slice(0, 100)}"`);
    return lines;
  }
  for (const node of el.childNodes) {
    if (node.nodeType === 3) {
      const text = node.textContent?.trim();
      if (text) lines.push(`${indent}  "${text}"`);
    } else if (node.nodeType === 1) {
      lines.push(...outline(node as Element, depth + 1));
    }
  }
  return lines;
}

function parseCss(css: string, media?: string): Rule[] {
  const rules: Rule[] = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    if (
      prelude.startsWith("@media") ||
      prelude.startsWith("@supports") ||
      prelude.startsWith("@container")
    ) {
      rules.push(...parseCss(body, prelude));
    } else if (!prelude.startsWith("@")) {
      rules.push({ selector: prelude, body, media });
    }
    i = j;
  }
  return rules;
}

for (const match of matches) {
  for (const el of [match!, ...match!.querySelectorAll("*")]) {
    for (const c of el.classList) usedClasses.add(c);
  }
  console.log(outline(match!, 0).join("\n"));
  console.log("");
}

if (withCss) {
  const styled = [...document.querySelectorAll("style")].map((s) => s.textContent ?? "").join("\n");
  const mainCssPath = join(dirname(file), "assets/main.css");
  const mainCss = existsSync(mainCssPath) ? readFileSync(mainCssPath, "utf8") : "";
  const rules = [...parseCss(styled), ...parseCss(mainCss)];
  const classRe = /\.([\w-]+)/g;
  const relevant = rules.filter((r) =>
    [...r.selector.matchAll(classRe)].some((m) => usedClasses.has(m[1]!)),
  );
  console.log(`/* ${relevant.length} CSS rules */`);
  for (const r of relevant) {
    const body = r.body.replace(/;(?=.)/g, "; ");
    console.log(r.media ? `${r.media} { ${r.selector} { ${body} } }` : `${r.selector} { ${body} }`);
  }
}
