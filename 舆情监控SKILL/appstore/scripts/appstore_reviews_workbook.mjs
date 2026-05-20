#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

function usage() {
  console.log(`Usage:
  node appstore_reviews_workbook.mjs config.json

Config:
  {
    "baseDir": "/absolute/workspace",
    "rawDir": "data/appstore_YYYYMMDD",
    "outFile": "outputs/vipthink_comments/VIPTHINK_AppStore评论明细_YYYYMMDD.xlsx",
    "apps": [{"appId":"1387156850","appKey":"student","appName":"豌豆素质（学生端）/ VIPTHINK豌豆思維"}],
    "countries": [{"code":"cn","name":"中国大陆"}],
    "fallbackFiles": {"1387156850|cn":"data/appstore_reviews_cn.json"}
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
const rawDir = path.resolve(baseDir, config.rawDir || `data/appstore_${new Date().toISOString().slice(0, 10).replaceAll("-", "")}`);
const outFile = path.resolve(baseDir, config.outFile || `outputs/appstore_reviews_${new Date().toISOString().slice(0, 10)}.xlsx`);
const apps = config.apps || [];
const countries = config.countries || [];
const fallbackFiles = config.fallbackFiles || {};

if (!apps.length) throw new Error("config.apps must contain at least one app");
if (!countries.length) throw new Error("config.countries must contain at least one country");

function norm(value) {
  return String(value ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function label(value) {
  return norm(value?.label ?? value);
}

function parseReview(entry, app, country) {
  const updated = label(entry.updated);
  return {
    platform: "App Store",
    appId: app.appId,
    appName: app.appName,
    countryCode: country.code,
    countryName: country.name,
    reviewId: label(entry.id),
    author: label(entry.author?.name),
    updated,
    updatedMs: Date.parse(updated) || 0,
    rating: Number(label(entry["im:rating"]) || 0),
    version: label(entry["im:version"]),
    title: label(entry.title),
    content: label(entry.content),
    voteSum: Number(label(entry["im:voteSum"]) || 0),
    voteCount: Number(label(entry["im:voteCount"]) || 0),
    link: label(entry.link?.attributes?.href),
  };
}

function effective(row) {
  const text = norm(`${row.title} ${row.content}`);
  return text.length >= 2 && !/^(赞|好|很好|不错|good|nice)$/i.test(text);
}

function sentiment(row) {
  const text = norm(`${row.title} ${row.content}`);
  if (/差|不好|垃圾|退费|退款|打不开|闪退|卡|耗电|气死|骗局|骗子|投诉|续费|收费|烧钱|毁了|无法|不能|有问题|bug|buggy|expensive|crash|bad|terrible/i.test(text)) return "负向";
  if (/好|很好|不错|喜欢|推荐|棒|优秀|满意|方便|进步|有效|赞|great|good|excellent|love|helpful/i.test(text)) return "正向";
  if (/怎么|为什么|请问|希望|建议|能否|多少钱|价格|where|how|why/i.test(text)) return "咨询/建议";
  return "中性";
}

function topic(row) {
  const text = norm(`${row.title} ${row.content}`);
  if (/耗电|后台|电池|battery/i.test(text)) return "App性能/耗电";
  if (/打不开|登录|登陆|闪退|卡|bug|无法|不能|加载|crash|login/i.test(text)) return "App稳定性/登录";
  if (/钱|收费|续费|退费|退款|贵|烧钱|价格|会员|expensive|refund/i.test(text)) return "价格/续费/退款";
  if (/课程|老师|学习|数学|思维|孩子|上课|课|效果|进步|class|math|course/i.test(text)) return "课程体验/效果";
  if (/更新|版本|升级|新版|update|version/i.test(text)) return "版本更新";
  return "其他";
}

function isoDate(ms) {
  return ms ? new Date(ms).toISOString().slice(0, 10) : "";
}

function displayTime(value) {
  return norm(value).replace("T", " ").replace(/([+-]\d{2}):?(\d{2})$/, " GMT$1:$2");
}

function col(n) {
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function addSheet(wb, name, header, rows, widths = {}) {
  const sh = wb.worksheets.add(name);
  const values = [header, ...rows];
  const end = col(header.length);
  sh.getRange(`A1:${end}${values.length}`).values = values;
  sh.tables.add(`A1:${end}${values.length}`, true);
  sh.getRange(`A1:${end}1`).format.fill.color = "#234f68";
  sh.getRange(`A1:${end}1`).format.font.color = "#ffffff";
  sh.getRange(`A1:${end}${values.length}`).format.wrapText = true;
  for (const [letter, width] of Object.entries(widths)) sh.getRange(`${letter}:${letter}`).format.columnWidth = width;
  try { sh.getRange(`A1:${end}${Math.min(values.length, 120)}`).format.autofitRows(); } catch {}
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 appstore-review-collector",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "accept": "application/json,text/plain,*/*",
    },
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

async function readFallback(file, app, country) {
  if (!file) return [];
  const resolved = path.resolve(baseDir, file);
  const fallback = await fs.readFile(resolved, "utf8").then(JSON.parse).catch(() => null);
  return asArray(fallback?.feed?.entry)
    .filter(entry => entry?.["im:rating"] && entry?.content)
    .map(entry => parseReview(entry, app, country));
}

await fs.mkdir(rawDir, { recursive: true });
await fs.mkdir(path.dirname(outFile), { recursive: true });

const rows = [];
const fetchStats = [];

for (const app of apps) {
  for (const country of countries) {
    const url = `https://itunes.apple.com/${country.code}/rss/customerreviews/id=${app.appId}/sortBy=mostRecent/json`;
    const rawFile = path.join(rawDir, `reviews_${app.appKey || app.appId}_${app.appId}_${country.code}.json`);
    try {
      const json = await fetchJson(url);
      await fs.writeFile(rawFile, JSON.stringify(json, null, 2));
      const liveReviews = asArray(json.feed?.entry)
        .filter(entry => entry?.["im:rating"] && entry?.content)
        .map(entry => parseReview(entry, app, country));
      const fallbackReviews = await readFallback(fallbackFiles[`${app.appId}|${country.code}`], app, country);
      const finalReviews = liveReviews.length === 0 && fallbackReviews.length > 0 ? fallbackReviews : liveReviews;
      const sourceNote = finalReviews === fallbackReviews ? `fallback:${fallbackFiles[`${app.appId}|${country.code}`]}` : "live";
      rows.push(...finalReviews);
      fetchStats.push({ app: app.appName, appId: app.appId, country: country.name, countryCode: country.code, ok: true, count: finalReviews.length, liveCount: liveReviews.length, sourceNote, feedUpdated: label(json.feed?.updated), rawFile });
    } catch (error) {
      await fs.writeFile(rawFile, JSON.stringify({ error: String(error.message), url }, null, 2));
      fetchStats.push({ app: app.appName, appId: app.appId, country: country.name, countryCode: country.code, ok: false, count: 0, liveCount: 0, sourceNote: "error", error: String(error.message), rawFile });
    }
  }
}

const seen = new Set();
const deduped = [];
for (const row of rows) {
  const key = `${row.appId}|${row.countryCode}|${row.reviewId}|${row.author}|${row.updated}|${row.title}|${row.content}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push({ ...row, effective: effective(row) ? "是" : "否", sentiment: sentiment(row), topic: topic(row) });
}

deduped.sort((a, b) => b.updatedMs - a.updatedMs || a.appId.localeCompare(b.appId) || a.countryCode.localeCompare(b.countryCode));

const detailHeader = ["平台", "App ID", "应用名称", "国家/地区", "地区代码", "评论ID", "评论作者", "更新时间", "日期", "评分", "版本", "标题", "评论内容", "有用票数", "投票数", "是否有效", "情绪", "主题", "评论链接"];
const detailRows = deduped.map(row => [
  row.platform, row.appId, row.appName, row.countryName, row.countryCode, row.reviewId, row.author,
  displayTime(row.updated), isoDate(row.updatedMs), row.rating, row.version, row.title, row.content,
  row.voteSum, row.voteCount, row.effective, row.sentiment, row.topic, row.link,
]);

const effectiveRows = detailRows.filter(row => row[15] === "是");

function countBy(rowsToCount, index) {
  const obj = {};
  for (const row of rowsToCount) obj[row[index]] = (obj[row[index]] || 0) + 1;
  return obj;
}

function avg(values) {
  const nums = values.map(Number).filter(Number.isFinite);
  if (!nums.length) return "";
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2));
}

function topPairs(obj, n = 10) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} ${v}`).join("；");
}

const groupMap = new Map();
for (const row of detailRows) {
  const key = `${row[1]}|${row[3]}`;
  if (!groupMap.has(key)) groupMap.set(key, []);
  groupMap.get(key).push(row);
}
const regionRows = [...groupMap.entries()].map(([key, group]) => {
  const [appId, region] = key.split("|");
  const dates = group.map(row => row[8]).filter(Boolean).sort();
  return [
    appId, group[0][2], region, group[0][4], group.length, avg(group.map(row => row[9])),
    group.filter(row => row[16] === "负向").length,
    group.filter(row => row[16] === "正向").length,
    dates[0] || "", dates.at(-1) || "",
  ];
}).sort((a, b) => String(a[1]).localeCompare(String(b[1]), "zh-Hans-CN") || String(a[3]).localeCompare(String(b[3])));

const bySentiment = countBy(effectiveRows, 16);
const byTopic = countBy(effectiveRows, 17);
const summaryRows = [
  ["抓取日期", new Date().toISOString().slice(0, 10)],
  ["数据源", "Apple iTunes RSS Customer Reviews"],
  ["覆盖 App", apps.map(app => `${app.appName} (${app.appId})`).join("；")],
  ["覆盖国家/地区", countries.map(c => `${c.name}(${c.code})`).join("；")],
  ["抓取成功源数", fetchStats.filter(x => x.ok).length],
  ["抓取失败源数", fetchStats.filter(x => !x.ok).length],
  ["去重评论数", detailRows.length],
  ["有效评论数", effectiveRows.length],
  ["平均评分", avg(detailRows.map(row => row[9]))],
  ["最新评论日期", detailRows[0]?.[8] || ""],
  ["最早评论日期", detailRows.at(-1)?.[8] || ""],
  ["评分分布", topPairs(countBy(detailRows, 9), 5)],
  ["情绪分布", topPairs(bySentiment, 5)],
  ["主题分布", topPairs(byTopic, 8)],
  ["排序说明", "评论明细按更新时间从近到远排序。"],
  ["接口限制", "Apple RSS 按国家/地区返回当前可见最新评论；部分地区无评论或不返回历史分页；实时接口偶发空结果时可使用配置的 Apple RSS 原始文件兜底。"],
];

const fetchRows = fetchStats.map(x => [x.appId, x.app, x.country, x.countryCode, x.ok ? "成功" : "失败", x.count, x.liveCount ?? x.count, x.sourceNote || "live", x.feedUpdated || "", x.rawFile, x.error || ""]);

const wb = Workbook.create();
addSheet(wb, "AppStore评论明细", detailHeader, detailRows, { C: 260, H: 190, L: 260, M: 620, S: 380 });
addSheet(wb, "有效评论明细", detailHeader, effectiveRows, { C: 260, H: 190, L: 260, M: 620, S: 380 });
addSheet(wb, "应用地区汇总", ["App ID", "应用名称", "国家/地区", "地区代码", "评论数", "平均评分", "负向数", "正向数", "最早日期", "最新评论日期"], regionRows, { B: 300, C: 150 });
addSheet(wb, "抓取源记录", ["App ID", "应用名称", "国家/地区", "地区代码", "状态", "最终评论数", "实时评论数", "采用来源", "Feed更新时间", "原始文件", "错误"], fetchRows, { B: 300, H: 280, J: 520, K: 360 });
addSheet(wb, "评论总结", ["指标", "内容"], summaryRows, { A: 220, B: 900 });

await (await SpreadsheetFile.exportXlsx(wb)).save(outFile);
console.log(JSON.stringify({ outFile, reviews: detailRows.length, effective: effectiveRows.length, fetchStats }, null, 2));
