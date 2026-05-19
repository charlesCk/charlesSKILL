# Facebook 舆论评论采集 Skill

这个仓库封装了一套用于 Facebook 舆论评论采集的 Codex Skill：`facebook-opinion-crawler`。

它适合在品牌、产品、广告投放、明星/KOL 合作帖、官方主页、家长社群、投诉群等场景下，使用 OpenCLI 从已登录的 Chrome/Facebook 环境中检索帖子、展开隐藏评论、提取评论明细，并整理成可用于 Excel 分析的数据。

## 主要作用

- 按品牌词、产品词、投放关键词、明星/KOL 名称、社群讨论词扩展 Facebook 搜索。
- 抓取公开帖子、视频、Reels、官方主页、小组讨论中的评论。
- 使用后台模式运行 OpenCLI，尽量不影响用户正常使用电脑。
- 精准点击评论区的“查看更多评论”，尝试获取被折叠或未展开的评论。
- 从页面 DOM 和 Facebook GraphQL 网络响应中提取评论作者、时间、内容、评论链接等字段。
- 对评论去重、过滤无效内容，并为后续情绪/主题分类和 Excel 汇总提供结构化数据。
- 明确记录 Facebook 权限、排序、删除、过滤导致的不可见评论限制。

## 什么时候使用

当用户提出类似需求时，应使用这个 Skill：

- “帮我抓 Facebook 上关于某个品牌/产品的评论。”
- “继续扩展明星合作帖下面的评论。”
- “把隐藏评论、折叠评论也尽量拿下来。”
- “用 OpenCLI 后台爬 Facebook，不要影响我用电脑。”
- “把 Facebook 舆论整理成 Excel 明细和总结。”
- “查找港澳台地区 Facebook 上关于课程、教育产品、广告投放的用户反馈。”

## 使用前提

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

## Skill 位置

核心 Skill 文件在：

```text
skills/facebook-opinion-crawler/SKILL.md
```

辅助文件：

```text
skills/facebook-opinion-crawler/scripts/opencli_facebook_expand_comments.mjs
skills/facebook-opinion-crawler/references/facebook-opencli-playbook.md
skills/facebook-opinion-crawler/agents/openai.yaml
```

## 基本流程

1. 用品牌词和相关关键词搜索 Facebook：

```bash
OPENCLI_WINDOW=background OPENCLI_BROWSER_COMMAND_TIMEOUT=180 \
opencli facebook search 'VIP THINK 品牌合作' --limit 50 -f json > search_brand_collab.json
```

2. 打开高价值帖子并提取可见评论。

3. 对评论数缺口大的帖子执行隐藏评论展开：

```bash
node skills/facebook-opinion-crawler/scripts/opencli_facebook_expand_comments.mjs targets.json
```

4. 将提取结果汇总到 Excel：

- 全量评论明细
- 有效评论明细
- 帖子线索
- 评论总结

## 隐藏评论展开脚本

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
node skills/facebook-opinion-crawler/scripts/opencli_facebook_expand_comments.mjs targets.json
```

脚本会自动：

- 后台打开帖子
- 等待页面加载
- 定位评论区的“查看更多评论”
- 循环点击并等待新增评论
- 保存评论 JSON
- 保存页面 state 和 network trace 便于审计
- 结束后关闭 OpenCLI session

## 注意事项

- Facebook 搜索页显示的评论数不一定等于详情页可抓到的评论数。
- 即使成功展开 GraphQL 分页，也可能仍有评论因权限、删除、过滤、排序策略不可见。
- 不要盲点“查看全部”，它可能是通知、排序或其它控件，不一定是评论展开按钮。
- 最终交付时应在总结中写明“当前登录态可见”和“隐藏评论处理结果”。

## 典型输出

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
