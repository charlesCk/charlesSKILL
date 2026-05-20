# charlesSKILL

面向业务舆情与用户反馈采集的 Codex Skill 仓库。

本仓库沉淀三类可复用能力：Facebook 舆论评论采集、小红书舆论评论采集、App Store 评论采集。目标不是把原始数据堆到 GitHub，而是把可复用的采集流程、字段规则、去重逻辑、限制说明和交付物规范整理成团队可以复用的 Skill。

另外，`projects/codex-work-progress/` 用于给团队 AI 周报扫描提供公开安全的进展说明：记录 Codex 帮助完成了什么、业务价值在哪里、哪些能力变得更可复用，以及哪些本机私有信息不会上传。

## 业务价值

这些 Skill 主要服务以下场景：

- 评估品牌、课程、App 或投放活动在公开平台上的用户反馈。
- 快速汇总 Facebook、小红书、App Store 的评论明细和可复盘证据。
- 为市场、投放、商务、产品和教学团队提供结构化舆情素材。
- 把一次性人工搜索和复制，沉淀成可重复运行、可审计、可交接的工作流。

## 仓库地图

| Skill | 适用平台 | 核心产出 | 入口 |
| --- | --- | --- | --- |
| Facebook Opinion Crawler | Facebook 帖子、视频、Reels、主页、小组讨论 | 评论明细、有效评论、线索清单、限制说明 | [`facebook/SKILL.md`](./facebook/SKILL.md) |
| Xiaohongshu Opinion Crawler | 小红书 / Rednote 笔记和评论 | 全量评论、非大陆有效评论、产品课程相关评论、笔记线索 | [`小红书/SKILL.md`](./小红书/SKILL.md) |
| App Store Opinion Crawler | Apple App Store / iTunes RSS | App Store 评论明细、地区汇总、抓取源记录、评论总结 | [`appstore/SKILL.md`](./appstore/SKILL.md) |
| Codex Work Progress | AI 周报 / GitHub 进展扫描 | 工作进展、能力提升、可复用资产、安全边界 | [`projects/codex-work-progress/README.md`](./projects/codex-work-progress/README.md) |

## 目录结构

```text
charlesSKILL/
  README.md
  SECURITY.md
  docs/
    QUALITY_REVIEW.md
  facebook/
    targets.example.json
    SKILL.md
    agents/openai.yaml
    references/facebook-opencli-playbook.md
    scripts/opencli_facebook_expand_comments.mjs
  小红书/
    config.example.json
    SKILL.md
    agents/openai.yaml
    references/xiaohongshu-opencli-playbook.md
    scripts/opencli_xiaohongshu_collect_comments.mjs
  appstore/
    config.example.json
    SKILL.md
    agents/openai.yaml
    references/appstore-rss-playbook.md
    scripts/appstore_reviews_workbook.mjs
  projects/
    codex-work-progress/
      README.md
      docs/progress-log.md
      docs/reusable-assets.md
      docs/reviewer-notes.md
```

## 使用前提

不同平台依赖不同能力：

- Facebook / 小红书：需要本机可运行 `opencli`，Chrome 已登录对应平台账号，并连接 OpenCLI Browser Bridge。
- App Store：使用 Apple 公开 Search API 和 iTunes RSS，不依赖登录态。
- Excel 交付：建议结合本地 Node.js / 表格处理工具生成 `.xlsx`，不要把真实导出的工作簿直接提交到仓库。

常用后台采集环境变量：

```bash
OPENCLI_WINDOW=background
OPENCLI_BROWSER_COMMAND_TIMEOUT=180
```

说明：部分 OpenCLI 版本没有 `--headless` 参数。当前更稳妥的低打扰方式是 `OPENCLI_WINDOW=background`。

## 快速使用

### Facebook 评论采集

```bash
node facebook/scripts/opencli_facebook_expand_comments.mjs facebook/targets.example.json
```

输入示例见 [`facebook/SKILL.md`](./facebook/SKILL.md)。适合已有 Facebook 帖子 URL，需要尽量展开隐藏评论的任务。

### 小红书评论采集

```bash
node 小红书/scripts/opencli_xiaohongshu_collect_comments.mjs 小红书/config.example.json
```

输入配置见 [`小红书/SKILL.md`](./小红书/SKILL.md)。适合从品牌词、课程词、地区词批量扩展笔记线索。

### App Store 评论采集

```bash
node appstore/scripts/appstore_reviews_workbook.mjs appstore/config.example.json
```

输入配置见 [`appstore/SKILL.md`](./appstore/SKILL.md)。适合按 App ID 和国家/地区抓取用户评论并生成工作簿。

## 交付物规范

每次舆情采集建议交付：

- 原始来源记录：搜索词、帖子/笔记/App 链接、抓取时间、平台限制。
- 评论明细：作者、时间、地区或来源、内容、链接、去重键。
- 有效评论：剔除空白、表情、无意义短回复后的可分析评论。
- 汇总分析：数量、情绪、主题、代表性原文、风险点、限制说明。
- 可复盘说明：哪些内容因权限、平台过滤、删除或风控无法保证完整。

## 安全边界

本仓库只保存可公开的 Skill、脚本、字段规则、示例配置和方法文档。

不得提交：

- 平台账号、密码、Cookie、Token、私钥、验证码、会话文件。
- 未脱敏的客户、学生、家长、供应商、订单、合同、报价、营收等业务数据。
- 原始导出表格、真实评论工作簿、截图、录屏、日志、浏览器缓存。
- 包含账号信息或内部路径的调试输出。

更多规则见 [`SECURITY.md`](./SECURITY.md)。

## 质量状态

当前仓库已经具备：

- 三个明确平台 Skill。
- 每个 Skill 均有 `SKILL.md`、参考文档和脚本入口。
- 平台限制和数据规则已写入各 Skill。

下一步建议：

- 为输出工作簿统一字段模板。
- 增加最小 smoke test，验证脚本能读取配置并输出结构化错误。
- 增加 `CHANGELOG.md`，记录每次 Skill 能力变化。

质量复盘见 [`docs/QUALITY_REVIEW.md`](./docs/QUALITY_REVIEW.md)。
