#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

function usage() {
  console.log(`Usage:
  node opencli_xiaohongshu_collect_comments.mjs config.json

Config:
  {
    "baseDir": "/absolute/workspace",
    "outDir": "data/xiaohongshu_overseas_YYYYMMDD",
    "queries": ["豌豆思维 香港", "VIPTHINK 海外"],
    "maxLeads": 120,
    "searchLimit": 50,
    "commentLimit": 50,
    "existingProgressFiles": ["data/xiaohongshu_YYYYMMDD/xhs_collect_progress.json"]
  }`);
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  usage();
  process.exit(0);
}

const configFile = process.argv[2];
if (!configFile) {
  usage();
  process.exit(2);
}

const config = JSON.parse(await fs.readFile(configFile, "utf8"));
const baseDir = config.baseDir || process.cwd();
const outDir = path.resolve(baseDir, config.outDir || `data/xiaohongshu_${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`);
const queries = config.queries || [];
const maxLeads = Number(config.maxLeads || 120);
const searchLimit = Number(config.searchLimit || 50);
const commentLimit = Number(config.commentLimit || 50);
const existingProgressFiles = config.existingProgressFiles || [];

if (!queries.length) throw new Error("config.queries must contain at least one search query");

function run(args) {
  return execFileSync("opencli", args, {
    cwd: baseDir,
    encoding: "utf8",
    env: {
      ...process.env,
      OPENCLI_WINDOW: "background",
      OPENCLI_BROWSER_COMMAND_TIMEOUT: "180",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function slugFromUrl(url) {
  return String(url).match(/(?:explore|search_result)\/([0-9a-f]+)/i)?.[1]
    || String(url).replace(/[^a-zA-Z0-9]+/g, "_").slice(0, 60);
}

function numericLikes(value) {
  const text = String(value || "");
  const n = Number.parseFloat(text.replace(/[^\d.]/g, "") || "0");
  return /万/.test(text) ? Math.round(n * 10000) : Math.round(n);
}

function norm(value) {
  return String(value ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function scoreLead(row, query = "") {
  const s = norm(`${query} ${row.title || ""} ${row.author || ""}`).toLowerCase();
  let score = 0;
  if (/vipthink|vip think|豌豆思维|豌豆思維/.test(s)) score += 12;
  if (/豌豆数学|豌豆數學|豌豆逻辑|豌豆邏輯|豌豆/.test(s)) score += 8;
  if (/香港|港宝|港寶|澳门|澳門|台湾|台灣|美国|美國|加拿大|澳洲|澳大利亚|新加坡|英国|英國|海外|华人|華人|雪梨|悉尼|多伦多|温哥华/.test(s)) score += 5;
  if (/数学思维|數學思維|逻辑思维|邏輯思維|网课|網課|线上课|線上課|数学课|數學課|课程|課程|小朋友|孩子|娃|启蒙/.test(s)) score += 3;
  if (/评价|評價|推荐|推薦|避坑|退款|退费|续费|續費|排课|排課|电话|騷擾|骚扰|放弃|纠结/.test(s)) score += 3;
  if (/the weeknd|演唱会|concert|抢票|座位|门票|vip坐票|旅行|酒店|航空|信用卡|电话卡|茶姬|展会|青旅/i.test(s)) score -= 20;
  return score;
}

async function safeJson(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return null; }
}

await fs.mkdir(outDir, { recursive: true });

const existing = new Set();
for (const progressFile of existingProgressFiles) {
  const resolved = path.resolve(baseDir, progressFile);
  const progress = await safeJson(resolved);
  if (!Array.isArray(progress)) continue;
  for (const item of progress) if (item?.lead?.slug) existing.add(item.lead.slug);
}

const searchProgress = [];
const leadMap = new Map();

for (const query of queries) {
  const searchFile = path.join(outDir, `search_${query.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, "_")}.json`);
  try {
    const raw = run(["xiaohongshu", "search", query, "--limit", String(searchLimit), "--window", "background", "-f", "json"]);
    await fs.writeFile(searchFile, raw);
    const rows = JSON.parse(raw);
    searchProgress.push({ query, file: searchFile, ok: true, count: Array.isArray(rows) ? rows.length : 0 });
    if (Array.isArray(rows)) {
      for (const row of rows) {
        if (!row.url) continue;
        const slug = slugFromUrl(row.url);
        if (existing.has(slug)) continue;
        const item = { ...row, slug, query, score: scoreLead(row, query), likes_num: numericLikes(row.likes) };
        if (item.score < 6) continue;
        const prev = leadMap.get(slug);
        if (!prev || item.score > prev.score || (item.score === prev.score && item.likes_num > prev.likes_num)) {
          leadMap.set(slug, item);
        }
      }
    }
  } catch (error) {
    const message = String(error.stderr || error.message);
    await fs.writeFile(searchFile, JSON.stringify({ error: message, query }, null, 2));
    searchProgress.push({ query, file: searchFile, ok: false, error: message.slice(0, 1000) });
  }
  await fs.writeFile(path.join(outDir, "search_progress.json"), JSON.stringify(searchProgress, null, 2));
}

const leads = [...leadMap.values()]
  .sort((a, b) => b.score - a.score || b.likes_num - a.likes_num)
  .slice(0, maxLeads);
await fs.writeFile(path.join(outDir, "xhs_leads.json"), JSON.stringify(leads, null, 2));

const results = [];
for (const lead of leads) {
  const noteFile = path.join(outDir, `note_${lead.slug}.json`);
  const commentsFile = path.join(outDir, `comments_${lead.slug}.json`);
  const result = { lead, note_file: noteFile, comments_file: commentsFile };

  try {
    const note = run(["xiaohongshu", "note", lead.url, "--window", "background", "-f", "json"]);
    await fs.writeFile(noteFile, note);
    result.note_ok = true;
  } catch (error) {
    result.note_ok = false;
    result.note_error = String(error.stderr || error.message).slice(0, 1000);
    await fs.writeFile(noteFile, JSON.stringify({ error: result.note_error, lead }, null, 2));
  }

  try {
    const comments = run(["xiaohongshu", "comments", lead.url, "--limit", String(commentLimit), "--with-replies", "true", "--window", "background", "-f", "json"]);
    await fs.writeFile(commentsFile, comments);
    const parsed = JSON.parse(comments);
    result.comments_ok = true;
    result.comments_count = Array.isArray(parsed) ? parsed.length : 0;
  } catch (error) {
    result.comments_ok = false;
    result.comments_error = String(error.stderr || error.message).slice(0, 1000);
    await fs.writeFile(commentsFile, JSON.stringify({ error: result.comments_error, lead }, null, 2));
  }

  results.push(result);
  await fs.writeFile(path.join(outDir, "xhs_collect_progress.json"), JSON.stringify(results, null, 2));
}

console.log(JSON.stringify({
  search_queries: queries.length,
  leads: leads.length,
  note_ok: results.filter(r => r.note_ok).length,
  comments_ok: results.filter(r => r.comments_ok).length,
  comments_count: results.reduce((sum, r) => sum + (r.comments_count || 0), 0),
  outDir,
}, null, 2));
