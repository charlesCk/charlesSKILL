---
name: facebook-opinion-crawler
description: Collect Facebook public-opinion comments for a brand, product, campaign, celebrity collaboration, official page, or parent/community discussion using OpenCLI. Use when Codex needs to search Facebook, expand hidden or folded comments, extract DOM/GraphQL comment data from a logged-in Chrome session, deduplicate and classify comments, and produce spreadsheet-ready evidence.
---

# Facebook Opinion Crawler

## Core Workflow

Use this skill for Facebook comment collection when the user needs a defensible public-opinion dataset, especially for Chinese-language campaigns in Hong Kong, Taiwan, Macau, or overseas Chinese parent communities.

1. Run OpenCLI in background mode:
   ```bash
   OPENCLI_WINDOW=background OPENCLI_BROWSER_COMMAND_TIMEOUT=180 opencli ...
   ```
   If the user asks for headless mode, use `OPENCLI_WINDOW=background` unless the installed OpenCLI exposes a true `--headless` flag.

2. Start from known brand terms, then expand:
   - Exact brand/product terms: `VIP THINK`, `VIPTHINK`, `豌豆思维`, `豌豆思維`
   - Page/tag terms: `VIP THINK - HK`, `VIP THINK - TW`, `豌豆思维vipthink-hk`, `vipthinktw`
   - Intent terms: `品牌合作`, `免費試堂`, `免费试听`, `線上數學`, `數學思維`, `益智`, `評價`, `推薦`, `苦主`
   - Lead types: official pages, celebrity/KOL posts, videos/Reels, parent groups, complaint groups, posts where the brand is tagged

3. For every lead, save raw search results and source metadata:
   - Query, URL, author/page, post date, visible comment count, market, source type
   - Keep raw JSON under a stable `data/facebook_expanded/`-style directory so the workbook can be rebuilt.

4. Open high-value posts with OpenCLI Browser and extract visible comments.
   Prefer DOM extraction first, then network/GraphQL extraction when the page has folded comments.

5. Expand hidden comments precisely:
   - Use `state` or `find --text '查看更多评论'` to locate the comment-section button.
   - Avoid broad clicks on `查看全部`; that text also appears in notifications and sorting controls.
   - Click the parent `div[role=button]` whose nearby subtree contains exactly `查看更多评论`.
   - Wait 6-10 seconds, then inspect `browser network --all` for GraphQL responses containing `comment_rendering_instance_for_feed_location`.

6. Stop expanding when:
   - No `查看更多评论` button remains,
   - GraphQL `page_info.has_next_page` is `false`,
   - The visible count stops increasing after a retry,
   - Facebook displays a filter notice such as `已选中“最相关评论”，部分评论可能已被过滤`.

7. Build the deliverable:
   - Sheet 1: all deduped Facebook comment/detail rows.
   - Sheet 2: effective comments only.
   - Sheet 3: post/lead inventory.
   - Sheet 4: summary with counts, sentiment, topics, limitations, and hidden-comment treatment.
   Use the spreadsheet skill or local workbook builder already present in the workspace.

## Bundled Script

Use `scripts/opencli_facebook_expand_comments.mjs` when you have a list of post URLs and want repeatable hidden-comment expansion.

Input JSON:
```json
[
  {
    "slug": "jinny-20250708",
    "url": "https://www.facebook.com/jinnyngofficial/videos/1266725671470430/",
    "outFile": "data/facebook_expanded/comments_jinny_20250708_hidden.json",
    "maxRounds": 8
  }
]
```

Run:
```bash
node charlesSKILL/facebook/scripts/opencli_facebook_expand_comments.mjs targets.json
```

The script writes one JSON file per target, plus `state_*.txt` and `net_*.json` trace files next to the output.

## Extraction Patterns

Visible DOM extraction:
```bash
opencli browser "$SESSION" eval '(() => ({
  url: location.href,
  title: document.title,
  progress: document.body.innerText.match(/\d+\/\d+/)?.[0] || null,
  comments: Array.from(document.querySelectorAll("[aria-label^=评论者]")).map((a, i) => ({
    i,
    label: a.getAttribute("aria-label"),
    text: a.innerText,
    links: Array.from(a.querySelectorAll("a[href]")).map(x => ({text: x.innerText, href: x.href})).slice(0, 8)
  }))
}))()'
```

Network inspection:
```bash
opencli browser "$SESSION" network --all > net_all.json
opencli browser "$SESSION" network --detail 'POST www.facebook.com/api/graphql/#9' > detail_comments.json
```

GraphQL comment payloads commonly appear under:
```text
data.node.comment_rendering_instance_for_feed_location.comments.edges[]
data.feedback.comment_list_renderer.feedback.comment_rendering_instance_for_feed_location.comments.edges[]
```

Read `references/facebook-opencli-playbook.md` for command recipes and common failure modes.

## Data Rules

- Deduplicate by `comment_id` URL first; fall back to `postUrl|author|time|text`.
- Treat blank comments, sticker-only entries, `GIPHY`, `回复`, `赞`, and share-only rows as ineffective.
- Keep source limitations in the workbook: Facebook sorting, permissions, deleted comments, filtered comments, and current-login visibility can all reduce recoverable count.
- Do not promise 100% of hidden comments unless the final GraphQL page has no next page and no filter notice.
- Close owned OpenCLI sessions when done.
