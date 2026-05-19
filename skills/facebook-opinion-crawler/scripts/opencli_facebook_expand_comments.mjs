#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: node opencli_facebook_expand_comments.mjs targets.json");
  process.exit(2);
}

const cwd = process.cwd();
const targets = JSON.parse(await fs.readFile(inputFile, "utf8"));
if (!Array.isArray(targets)) {
  console.error("targets.json must be an array");
  process.exit(2);
}

function run(args) {
  return execFileSync("opencli", args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      OPENCLI_WINDOW: process.env.OPENCLI_WINDOW || "background",
      OPENCLI_BROWSER_COMMAND_TIMEOUT: process.env.OPENCLI_BROWSER_COMMAND_TIMEOUT || "180",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function parseMoreRefs(stateText) {
  const refs = new Set();
  const lines = stateText.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/\[(\d+)\]<div[^>\n]*role=button/);
    if (!match) continue;
    const near = lines.slice(i, i + 6).join("\n");
    if (near.includes("查看更多评论")) refs.add(Number(match[1]));
  }
  return [...refs].sort((a, b) => a - b);
}

async function writeExtract(session, target, note) {
  const js = `(() => ({
    url: location.href,
    title: document.title,
    progress: document.body.innerText.match(/\\d+\\/\\d+/)?.[0] || null,
    filterNotice: /部分评论可能已被过滤|部分留言可能已被過濾/.test(document.body.innerText),
    comments: Array.from(document.querySelectorAll("[aria-label^=评论者]")).map((a, i) => ({
      i,
      label: a.getAttribute("aria-label"),
      text: a.innerText,
      links: Array.from(a.querySelectorAll("a[href]")).map(x => ({ text: x.innerText, href: x.href })).slice(0, 8)
    })),
    bodyTail: document.body.innerText.slice(-3000),
    note: ${JSON.stringify(note)}
  }))()`;
  const json = run(["browser", session, "eval", js]);
  await fs.mkdir(path.dirname(target.outFile), { recursive: true });
  await fs.writeFile(target.outFile, json);
}

for (const target of targets) {
  if (!target.slug || !target.url || !target.outFile) {
    console.error("Each target needs slug, url, and outFile");
    process.exitCode = 2;
    continue;
  }

  const session = `fb_${target.slug}`.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
  const outDir = path.dirname(target.outFile);
  const trace = [];

  try {
    await fs.mkdir(outDir, { recursive: true });
    run(["browser", session, "open", target.url]);
    run(["browser", session, "wait", "time", String(target.initialWaitSeconds || 8)]);
    try { run(["browser", session, "keys", "Escape"]); } catch {}

    let previousCount = -1;
    const maxRounds = target.maxRounds ?? 8;
    for (let round = 0; round < maxRounds; round += 1) {
      const state = run(["browser", session, "state"]);
      await fs.writeFile(path.join(outDir, `state_${target.slug}_${round}.txt`), state);

      const count = (state.match(/aria-label=评论者/g) || []).length;
      const refs = parseMoreRefs(state);
      trace.push({ round, count, refs });

      if (!refs.length) break;
      if (count === previousCount && round > 0) break;
      previousCount = count;

      let clicked = false;
      for (const ref of refs.slice(0, target.clicksPerRound || 1)) {
        try {
          run(["browser", session, "click", String(ref)]);
          clicked = true;
          run(["browser", session, "wait", "time", String(target.afterClickWaitSeconds || 7)]);
        } catch (error) {
          trace.push({ round, ref, error: String(error.stderr || error.message).slice(0, 500) });
        }
      }
      if (!clicked) break;
    }

    await writeExtract(session, target, { trace });
    const network = run(["browser", session, "network", "--all"]);
    await fs.writeFile(path.join(outDir, `net_${target.slug}_all.json`), network);
  } catch (error) {
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(target.outFile, JSON.stringify({
      url: target.url,
      comments: [],
      error: String(error.stderr || error.message),
      note: { trace },
    }, null, 2));
    process.exitCode = 1;
  } finally {
    try { run(["browser", session, "close"]); } catch {}
  }
}
