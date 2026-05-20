---
name: xiaohongshu-opinion-crawler
description: Collect Xiaohongshu/Rednote public-opinion comments for a brand, product, course, education category, or overseas Chinese parent audience using OpenCLI. Use when Codex needs to search Xiaohongshu, prioritize non-mainland China signals such as Hong Kong/Taiwan/Macau/overseas regions, extract note details and comments with replies, deduplicate and classify comments, sort by newest date first, and produce spreadsheet-ready evidence and summaries.
---

# Xiaohongshu Opinion Crawler

## Core Workflow

Use this skill for Xiaohongshu comment collection when the user needs a defensible public-opinion dataset, especially for Chinese education products, online courses, parent communities, Hong Kong/Taiwan/Macau markets, or overseas Chinese families.

1. Run OpenCLI in background mode:
   ```bash
   OPENCLI_WINDOW=background OPENCLI_BROWSER_COMMAND_TIMEOUT=180 opencli ...
   ```

2. Start from exact product terms, then expand carefully:
   - Exact brand terms: `VIPTHINK`, `VIP THINK`, `豌豆思维`, `豌豆思維`
   - Product variants: `豌豆数学`, `豌豆數學`, `豌豆逻辑`, `豌豆邏輯`
   - Course terms: `数学思维`, `數學思維`, `逻辑思维`, `線上數學`, `线上数学课`, `网课`, `益智`
   - Overseas terms: `香港`, `港宝`, `台湾`, `澳门`, `美国`, `加拿大`, `澳洲`, `新加坡`, `海外华人`
   - Risk/intent terms: `评价`, `評價`, `推荐`, `避坑`, `退款`, `退费`, `续费`, `排课`, `电话轰炸`

3. Save raw search, note, and comment JSON under a dated directory such as:
   ```text
   data/xiaohongshu_<topic>_YYYYMMDD/
   ```
   Keep source URL, search query, note id, author, title, visible counts, and command errors. The workbook should be rebuildable from raw files.

4. Collect high-value notes with comments and replies:
   ```bash
   opencli xiaohongshu note "<note-url-with-xsec-token>" -f json --window background
   opencli xiaohongshu comments "<note-url-with-xsec-token>" --limit 50 --with-replies true -f json --window background
   ```

5. Filter in two stages:
   - Effective comments: remove blank/sticker-only/one-word utility replies such as `赞`, `蹲`, `同问`, `求`, `回复`.
   - Relevance: keep exact product hits first; allow category-level course terms only when the note/search/comment context is education-related.

6. Mark non-mainland evidence instead of guessing:
   - Highest confidence: comment time/location field contains `中国香港`, `香港`, `台湾`, `澳门`, `美国`, `加拿大`, `澳洲`, `新加坡`, etc.
   - Medium confidence: comment text contains overseas-region terms.
   - Context confidence: note title/content/search query contains overseas-region terms.
   Record the evidence string in the workbook.

7. Sort newest to oldest:
   - Comment detail sheets: sort by comment time/location field, falling back to note publish date.
   - Note inventory sheet: sort by note publish date.
   Normalize mixed formats such as `2025-09-15香港`, `03-10广东`, `昨天 12:37中国香港`, `5天前`.

8. Build the deliverable:
   - Xiaohongshu all deduped comment details.
   - Non-mainland effective comment details.
   - Product/course effective comment details.
   - Product/course + non-mainland effective details.
   - Note lead inventory.
   - Summary with counts, sentiment, topics, search coverage, and limitations.

## Bundled Script

Use `scripts/opencli_xiaohongshu_collect_comments.mjs` when you need a repeatable first-pass collector from search queries.

Config JSON:
```json
{
  "baseDir": "/absolute/workspace",
  "outDir": "data/xiaohongshu_overseas_YYYYMMDD",
  "queries": ["豌豆思维 香港", "VIPTHINK 海外", "豌豆思维 续费 海外"],
  "maxLeads": 120,
  "searchLimit": 50,
  "commentLimit": 50,
  "existingProgressFiles": ["data/xiaohongshu_YYYYMMDD/xhs_collect_progress.json"]
}
```

Run:
```bash
node 舆情监控SKILL/小红书/scripts/opencli_xiaohongshu_collect_comments.mjs config.json
```

The script writes search result JSON, `xhs_leads.json`, note JSON, comment JSON, and `xhs_collect_progress.json`.

## Data Rules

- Deduplicate by `noteId|commentAuthor|commentTime|commentText|replyTo`.
- Keep raw comments even when later marked as invalid or noise.
- Treat `VIP THINK` as a high-risk query because it can match generic VIP content. Exclude obvious noise such as concerts, tickets, hotels, travel, cards, and phone plans unless the text also directly mentions the product.
- Do not force a numeric target. Report the count that is available under the chosen strictness and document Xiaohongshu risk-control limits such as `SECURITY_BLOCK`.
- Prefer exact-product rows for brand reputation. Put broader category rows in a separate sheet or mark the product evidence as `课程泛词相关`.

Read `references/xiaohongshu-opencli-playbook.md` for command recipes, overseas-region terms, date parsing, workbook fields, and common failure modes.
