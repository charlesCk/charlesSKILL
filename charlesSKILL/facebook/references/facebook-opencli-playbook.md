# Facebook OpenCLI Playbook

## Health Check

Run once per session:
```bash
opencli doctor
opencli facebook search --help
opencli browser --help
```

OpenCLI 1.7.x may not expose a true `--headless` flag. Use:
```bash
OPENCLI_WINDOW=background
OPENCLI_BROWSER_COMMAND_TIMEOUT=180
```

## Search Expansion

Start with exact terms, then broaden:
```bash
opencli facebook search 'VIP THINK 品牌合作' --limit 50 -f json > search_brand_collab.json
opencli facebook search '豌豆思維 vipthink hk 網上學數學' --limit 50 -f json > search_hk_math.json
opencli facebook search 'VIPTHINK 數學線上課程 品牌合作' --limit 50 -f json > search_tw_math.json
opencli facebook search '豌豆思維 苦主' --limit 50 -f json > search_complaints.json
```

Prefer leads with visible comment counts, celebrity/KOL authors, official pages, and parent groups. Save empty searches too; they document coverage.

## Open and Extract

```bash
SESSION=fb_target
URL='https://www.facebook.com/...'

OPENCLI_WINDOW=background OPENCLI_BROWSER_COMMAND_TIMEOUT=180 opencli browser "$SESSION" open "$URL"
opencli browser "$SESSION" wait time 8
opencli browser "$SESSION" keys Escape
opencli browser "$SESSION" eval '(() => ({
  url: location.href,
  title: document.title,
  progress: document.body.innerText.match(/\d+\/\d+/)?.[0] || null,
  comments: Array.from(document.querySelectorAll("[aria-label^=评论者]")).map((a, i) => ({
    i,
    label: a.getAttribute("aria-label"),
    text: a.innerText,
    links: Array.from(a.querySelectorAll("a[href]")).map(x => ({text:x.innerText, href:x.href})).slice(0,8)
  }))
}))()' > comments_target.json
```

## Hidden Comments

First inspect:
```bash
opencli browser "$SESSION" state > state.txt
rg -n '查看更多评论|\\d+/\\d+|评论者|查看.*回复|部分评论可能已被过滤' state.txt
```

When a parent ref appears above `查看更多评论`, click that ref:
```bash
opencli browser "$SESSION" click 124
opencli browser "$SESSION" wait time 8
```

If refs are hard to parse manually, run:
```bash
node charlesSKILL/facebook/scripts/opencli_facebook_expand_comments.mjs targets.json
```

## GraphQL Confirmation

After clicking:
```bash
opencli browser "$SESSION" network --all > net_all.json
```

Look for shapes containing:
```text
comment_rendering_instance_for_feed_location.comments.edges
comments.page_info.has_next_page
comments.page_info.end_cursor
```

Fetch a detail body:
```bash
opencli browser "$SESSION" network --detail 'POST www.facebook.com/api/graphql/#9' > detail_comments.json
```

Common comment fields:
```text
edge.node.id
edge.node.legacy_fbid
edge.node.author.name
edge.node.author.url
edge.node.body.text
edge.node.created_time
edge.node.url
```

## Failure Modes

- `查看全部` can mean notification or sort controls; avoid broad clicks.
- Some pages show `2/10`, then return only 8 comments with `has_next_page=false`; the remaining comments may be filtered, deleted, or permission-limited.
- Video/Reel pages may require a longer wait after click before GraphQL appears.
- Search result counts can differ from detail pages.
- If a page redirects to `/notifications`, close the session and reopen the original URL.

## Workbook Columns

Recommended detail columns:
```text
平台区域, 市场, 来源类型, 帖子作者, 帖子标题, 帖子日期, 帖子链接,
内容类型, 评论作者, 评论时间, 评论内容, 情绪, 主题, 是否有效,
评论链接, 抓取备注
```

Summary should include:
```text
抓取日期, 工具链, 覆盖范围, 全量去重记录数, 有效评论数,
负向数, 正向数, 咨询/中性数, 市场分布, 来源分布,
主要负向主题, 核心风险, 核心机会, 隐藏评论处理, 抓取限制
```
