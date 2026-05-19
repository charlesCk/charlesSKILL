# Xiaohongshu OpenCLI Playbook

## Preflight

Run live help before assuming command signatures:

```bash
opencli list -f yaml
opencli xiaohongshu -h
opencli xiaohongshu search -h
opencli xiaohongshu comments -h
```

Use `rednote` only when the current registry shows it is equivalent and accepts the same signed URLs.

## Search Strategy

Start narrow, then broaden:

```bash
opencli xiaohongshu search "豌豆思维 香港" --limit 50 --window background -f json
opencli xiaohongshu search "VIPTHINK 海外" --limit 50 --window background -f json
opencli xiaohongshu search "豌豆思维 续费 海外" --limit 50 --window background -f json
opencli xiaohongshu search "数学思维课 评价 海外" --limit 50 --window background -f json
```

Good expansion terms:

- Markets: `香港`, `港宝`, `台湾`, `澳门`, `美国`, `加拿大`, `澳洲`, `新加坡`, `英国`, `海外`, `华人`.
- Product/course: `VIPTHINK`, `VIP THINK`, `豌豆思维`, `豌豆思維`, `豌豆数学`, `豌豆數學`, `数学思维`, `逻辑思维`, `线上数学课`.
- Opinion/risk: `评价`, `評價`, `推荐`, `避坑`, `退款`, `退费`, `续费`, `排课`, `电话轰炸`, `销售`.

Noise terms to down-rank unless there is an exact product hit:

```text
the weeknd, 演唱会, concert, 抢票, 座位, 门票, vip坐票,
旅行, 酒店, 航空, 信用卡, 电话卡, 茶姬, 展会, 青旅
```

## Comment Collection

OpenCLI Xiaohongshu comments require a full signed note URL with `xsec_token` from search results:

```bash
opencli xiaohongshu note "<full-note-url>" -f json --window background
opencli xiaohongshu comments "<full-note-url>" --limit 50 --with-replies true -f json --window background
```

Capture failures into progress JSON. `SECURITY_BLOCK` is a platform risk-control signal; do not loop forever on the same URL. Continue with other leads and report the limitation.

## Non-Mainland Evidence

Use evidence labels rather than a single opaque boolean:

- `评论时间/地区字段命中`: strongest; examples include `2025-09-15中国香港`, `2天前台湾`.
- `评论正文命中`: the user self-identifies or discusses a non-mainland region.
- `笔记/搜索语境命中`: the note or query is overseas-focused, but the individual commenter location is not directly visible.

Common region terms:

```text
香港, 港宝, 港寶, 澳门, 澳門, 台湾, 台灣, 美国, 美國,
加拿大, 澳洲, 澳大利亚, 新加坡, 英国, 英國, 日本, 韩国,
海外, 华人, 華人, 国际, 國際, 雪梨, 悉尼, 墨尔本, 多伦多,
温哥华, 洛杉矶, 纽约, 湾区, 台北, 高雄, 台中, 新北, HK,
TW, USA, US, Canada, Australia, Singapore
```

## Date Sorting

Sort newest first. Normalize:

- Full dates: `2025-09-15香港`, `2025/09/15`.
- Month/day dates: `03-10广东`; infer current year, but if the date is in the future relative to the run date, subtract one year.
- Relative dates: `今天`, `昨天`, `5天前`, `3小时前`, `20分钟前`.

Comment sheets should sort by comment time first, then fall back to note publish date. Lead sheets should sort by note publish date.

## Recommended Workbook Fields

Comment details:

```text
平台, 笔记ID, 笔记标题, 笔记作者, 来源关键词, 发布日期, 笔记链接,
评论序号, 评论作者, 评论时间/地区, 评论内容, 评论点赞,
是否楼中楼, 回复对象, 是否有效, 是否非大陆相关, 命中地区/词,
非大陆判定依据, 是否产品/课程相关, 产品相关依据, 是否噪音,
情绪, 主题, 抓取备注
```

Lead inventory:

```text
平台, 笔记ID, 标题, 作者, 来源关键词, 发布日期, 链接, 点赞,
收藏, 显示评论数, 已抓评论/回复数, 是否非大陆语境,
非大陆依据, 噪音判断, 正文, 评论抓取状态, 错误信息
```

Summary:

- Raw deduped comment count.
- Effective comment count.
- Non-mainland effective count.
- Product/course effective count.
- Product/course + non-mainland effective count.
- Sentiment/topic counts.
- Search queries and failure limits.

## Classification Heuristics

Sentiment:

- Negative: `避坑`, `退款`, `退费`, `不给排课`, `电话轰炸`, `骚扰`, `不续`, `太贵`, `骗子`, `没效果`, `投诉`, `硬推`.
- Positive: `推荐`, `值得`, `不错`, `进步`, `喜欢`, `有效`, `提升`, `适合`, `耐心`.
- Consultation/neutral: `多少钱`, `价格`, `怎么`, `哪个`, `求推荐`, `试听`, `对比`, `报名`, `链接`.

Topics:

- Fulfillment/refund: 排课、退款、退费、投诉.
- Sales touch/renewal: 电话、微信、轰炸、骚扰、续报、硬推.
- Price/value: 价格、费用、贵、性价比.
- Course effectiveness/fit: 效果、进步、适合、启蒙、数学、逻辑.
- Competitor comparison: 火花、学而思、斑马、猿辅导、对比.
- Conversion consultation: 试听、体验课、报课、报名.
