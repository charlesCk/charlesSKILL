---
name: appstore-opinion-crawler
description: Collect Apple App Store/iTunes customer reviews for a brand, product, course app, iOS app, or App Store app ID. Use when Codex needs to look up iOS app IDs, pull App Store reviews across countries or regions, handle Apple RSS quirks and fallback raw files, deduplicate reviews, classify sentiment/topics, sort review details newest first, and produce spreadsheet-ready review workbooks.
---

# App Store Opinion Crawler

## Core Workflow

Use this skill when the user asks to collect or organize Apple App Store reviews for a company product, especially when the deliverable should be an Excel workbook sorted by review time.

1. Identify target App IDs.
   - Use Apple Search API when the user gives only product names:
     ```text
     https://itunes.apple.com/search?term=<encoded-term>&entity=software&limit=10&country=<country>
     ```
   - Record `trackId`, `trackName`, `bundleId`, `sellerName`, `version`, `userRatingCount`, and `trackViewUrl`.
   - For VIPTHINK/豌豆思维, known IDs include:
     - `1387156850`: student app, `豌豆素质（学生端）/ VIPTHINK豌豆思維`
     - `1462031301`: parent app, `豌豆素质家长端`

2. Fetch reviews by country/region with Apple iTunes RSS:
   ```text
   https://itunes.apple.com/<country-code>/rss/customerreviews/id=<app-id>/sortBy=mostRecent/json
   ```
   Use headers:
   ```text
   user-agent: Mozilla/5.0 appstore-review-collector
   accept-language: zh-CN,zh;q=0.9,en;q=0.8
   accept: application/json,text/plain,*/*
   ```

3. Cover relevant markets.
   For Chinese education products, default to:
   ```text
   cn, us, hk, tw, mo, sg, au, ca, gb, my, nz
   ```

4. Save raw JSON for every app/country source under a dated directory such as:
   ```text
   data/appstore_YYYYMMDD/
   ```
   Keep success/failure, feed update time, count, adopted source, and raw file path.

5. Handle RSS quirks.
   - Some country endpoints intermittently return an empty feed even when reviews exist.
   - Retry with the same URL and required headers.
   - If the current run returns zero but a trusted local raw Apple RSS file exists, use it as a fallback and mark the source as `fallback:<file>`.
   - Do not invent missing reviews.

6. Deduplicate by:
   ```text
   appId|countryCode|reviewId|author|updated|title|content
   ```

7. Sort review detail rows newest first.
   The main detail sheets must be sorted by review `updated` timestamp from recent to old. Keep display time readable, not Excel serial numbers.

8. Build workbook sheets:
   - `AppStore评论明细`
   - `有效评论明细`
   - `应用地区汇总`
   - `抓取源记录`
   - `评论总结`

## Bundled Script

Use `scripts/appstore_reviews_workbook.mjs` for repeatable collection and workbook generation.

Config JSON:
```json
{
  "baseDir": "/absolute/workspace",
  "rawDir": "data/appstore_YYYYMMDD",
  "outFile": "outputs/vipthink_comments/VIPTHINK_AppStore评论明细_YYYYMMDD.xlsx",
  "apps": [
    { "appId": "1387156850", "appKey": "student", "appName": "豌豆素质（学生端）/ VIPTHINK豌豆思維" },
    { "appId": "1462031301", "appKey": "parent", "appName": "豌豆素质家长端" }
  ],
  "countries": [
    { "code": "cn", "name": "中国大陆" },
    { "code": "us", "name": "美国" },
    { "code": "hk", "name": "中国香港" }
  ],
  "fallbackFiles": {
    "1387156850|cn": "data/appstore_reviews_cn.json"
  }
}
```

Run:
```bash
node 舆情监控SKILL/appstore/scripts/appstore_reviews_workbook.mjs config.json
```

The script writes raw JSON files and exports a polished `.xlsx` workbook.

## Data Rules

- Keep title and content separately.
- Keep both full update time and date-only fields.
- Mark effective comments but keep all raw review rows.
- Classify sentiment and topic with transparent heuristics; do not overstate model certainty.
- Put source limitations in `评论总结` and exact source status in `抓取源记录`.
- If counts vary between runs because Apple RSS temporarily returns empty feeds, prefer the latest successful live source; otherwise use explicitly configured fallbacks and mark them.

Read `references/appstore-rss-playbook.md` for endpoint patterns, fields, sorting, and common failure modes.
