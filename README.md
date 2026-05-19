# 舆论评论采集 Skills

这个仓库封装了用于社交平台舆论评论采集的 Codex Skills，目前包含：

- `charlesSKILL/facebook`
- `charlesSKILL/小红书`

后续新增平台统一放在 `charlesSKILL/` 下面，例如：

```text
charlesSKILL/
├── facebook/
├── 小红书/
└── 后续平台/
```

## Xiaohongshu Opinion Crawler

`xiaohongshu-opinion-crawler` 用于小红书/Rednote 舆论评论采集，特别适合品牌、教育产品、线上课程、港澳台投放、海外华人家长社区等场景。

### 主要作用

- 使用 OpenCLI 后台模式搜索小红书笔记，不影响用户正常使用电脑。
- 从品牌词、产品词、课程词、地区词和风险词扩展线索。
- 抓取笔记详情、一级评论和楼中楼回复。
- 对评论去重、过滤无效短回复、识别明显噪音。
- 标记非大陆相关依据，例如评论地区字段、评论正文、笔记/搜索语境。
- 标记产品/课程相关依据，例如品牌直提及、豌豆系列词、数学思维/线上课泛词。
- 按日期从最近到最远排序明细。
- 产出适合 Excel 汇总的数据结构：全量、非大陆有效、产品课程有效、产品非大陆有效、笔记线索、评论总结。

### 什么时候使用

当用户提出类似需求时，应使用这个 Skill：

- “开始爬小红书平台相关产品评论。”
- “需要非大陆的小红书评论，整理成 Excel。”
- “把小红书评论按日期从最近到最远排序。”
- “抓取豌豆思维/VIPTHINK/线上数学课/数学思维课相关小红书舆情。”
- “需要记录哪些评论来自港澳台、海外华人、美国、澳洲、加拿大、新加坡等语境。”

### 使用前提

需要满足以下条件：

- 本机已安装并可运行 `opencli`。
- Chrome 已登录小红书账号。
- OpenCLI Browser Bridge 扩展已连接。
- 采集时建议使用：

```bash
OPENCLI_WINDOW=background
OPENCLI_BROWSER_COMMAND_TIMEOUT=180
```

### Skill 位置

```text
charlesSKILL/小红书/SKILL.md
charlesSKILL/小红书/scripts/opencli_xiaohongshu_collect_comments.mjs
charlesSKILL/小红书/references/xiaohongshu-opencli-playbook.md
charlesSKILL/小红书/agents/openai.yaml
```

### 基本流程

1. 使用品牌词、课程词、地区词搜索小红书：

```bash
OPENCLI_WINDOW=background OPENCLI_BROWSER_COMMAND_TIMEOUT=180 \
opencli xiaohongshu search '豌豆思维 香港' --limit 50 --window background -f json
```

2. 抓取笔记详情和评论：

```bash
opencli xiaohongshu note '<带 xsec_token 的完整笔记链接>' -f json --window background
opencli xiaohongshu comments '<带 xsec_token 的完整笔记链接>' --limit 50 --with-replies true -f json --window background
```

3. 或使用封装脚本批量采集：

```bash
node charlesSKILL/小红书/scripts/opencli_xiaohongshu_collect_comments.mjs config.json
```

4. 将原始 JSON 汇总为 Excel，建议包含：

```text
小红书全量评论明细
非大陆有效评论明细
产品课程有效评论明细
产品非大陆有效评论
小红书笔记线索
评论总结
```

## Facebook Opinion Crawler

`facebook-opinion-crawler` 是用于 Facebook 舆论评论采集的 Codex Skill。

它适合在品牌、产品、广告投放、明星/KOL 合作帖、官方主页、家长社群、投诉群等场景下，使用 OpenCLI 从已登录的 Chrome/Facebook 环境中检索帖子、展开隐藏评论、提取评论明细，并整理成可用于 Excel 分析的数据。

### 主要作用

- 按品牌词、产品词、投放关键词、明星/KOL 名称、社群讨论词扩展 Facebook 搜索。
- 抓取公开帖子、视频、Reels、官方主页、小组讨论中的评论。
- 使用后台模式运行 OpenCLI，尽量不影响用户正常使用电脑。
- 精准点击评论区的“查看更多评论”，尝试获取被折叠或未展开的评论。
- 从页面 DOM 和 Facebook GraphQL 网络响应中提取评论作者、时间、内容、评论链接等字段。
- 对评论去重、过滤无效内容，并为后续情绪/主题分类和 Excel 汇总提供结构化数据。
- 明确记录 Facebook 权限、排序、删除、过滤导致的不可见评论限制。

### 什么时候使用

当用户提出类似需求时，应使用这个 Skill：

- “帮我抓 Facebook 上关于某个品牌/产品的评论。”
- “继续扩展明星合作帖下面的评论。”
- “把隐藏评论、折叠评论也尽量拿下来。”
- “用 OpenCLI 后台爬 Facebook，不要影响我用电脑。”
- “把 Facebook 舆论整理成 Excel 明细和总结。”
- “查找港澳台地区 Facebook 上关于课程、教育产品、广告投放的用户反馈。”

### 使用前提

需要满足以下条件：

- 本机已安装并可运行 `opencli`。
- Chrome 已登录目标 Facebook 账号。
- OpenCLI Browser Bridge 扩展已连接。
- 采集时建议使用：

```bash
OPENCLI_WINDOW=background
OPENCLI_BROWSER_COMMAND_TIMEOUT=180
```

说明：部分 OpenCLI 版本没有真正的 `--headless` 参数，后台模式是当前更稳定的不打扰方案。

### Skill 位置

核心 Skill 文件在：

```text
charlesSKILL/facebook/SKILL.md
```

辅助文件：

```text
charlesSKILL/facebook/scripts/opencli_facebook_expand_comments.mjs
charlesSKILL/facebook/references/facebook-opencli-playbook.md
charlesSKILL/facebook/agents/openai.yaml
```

### 基本流程

1. 用品牌词和相关关键词搜索 Facebook：

```bash
OPENCLI_WINDOW=background OPENCLI_BROWSER_COMMAND_TIMEOUT=180 \
opencli facebook search 'VIP THINK 品牌合作' --limit 50 -f json > search_brand_collab.json
```

2. 打开高价值帖子并提取可见评论。

3. 对评论数缺口大的帖子执行隐藏评论展开：

```bash
node charlesSKILL/facebook/scripts/opencli_facebook_expand_comments.mjs targets.json
```

4. 将提取结果汇总到 Excel：

- 全量评论明细
- 有效评论明细
- 帖子线索
- 评论总结

### 隐藏评论展开脚本

准备 `targets.json`：

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

运行：

```bash
node charlesSKILL/facebook/scripts/opencli_facebook_expand_comments.mjs targets.json
```

脚本会自动：

- 后台打开帖子
- 等待页面加载
- 定位评论区的“查看更多评论”
- 循环点击并等待新增评论
- 保存评论 JSON
- 保存页面 state 和 network trace 便于审计
- 结束后关闭 OpenCLI session

### 注意事项

- Facebook 搜索页显示的评论数不一定等于详情页可抓到的评论数。
- 即使成功展开 GraphQL 分页，也可能仍有评论因权限、删除、过滤、排序策略不可见。
- 不要盲点“查看全部”，它可能是通知、排序或其它控件，不一定是评论展开按钮。
- 最终交付时应在总结中写明“当前登录态可见”和“隐藏评论处理结果”。

### 典型输出

建议最终输出为 Excel，包含：

```text
Facebook全量评论明细
Facebook有效评论明细
Facebook帖子线索
评论总结
```

评论明细建议字段：

```text
平台区域, 市场, 来源类型, 帖子作者, 帖子标题, 帖子日期, 帖子链接,
内容类型, 评论作者, 评论时间, 评论内容, 情绪, 主题, 是否有效,
评论链接, 抓取备注
```
