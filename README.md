# charlesSKILL

面向业务流程提效、业务分析、公开舆情采集和 AI 协作治理的 Codex Skill 项目组合。

本仓库保存可复用的 Skill、脚本、字段规则、示例配置和公开安全说明。它不保存真实账号、密码、合同、客户资料、原始导出、截图、浏览器缓存或运行日志。

## 当前定位

这个仓库不是零散脚本集合，而是五条业务线的可复用资产库：

| 业务线 | 已沉淀内容 | 业务价值 |
| --- | --- | --- |
| 业务流程自动化 | 致远 OA 合同草稿 Skill、字段清单、运行脚本 | 把重复录入流程变成可复用、可校验、可交接的草稿生成流程 |
| 业务分析与数据工具 | KOL 研究框架、SmartBI 周报数据工具边界 | 把历史材料学习、数据路由和周报数据处理沉淀成可复用方法 |
| 公开舆情与用户反馈 | Facebook、小红书、App Store 采集 Skill 和脚本 | 帮助市场、产品、运营更快获得公开评论证据和反馈摘要 |
| AI 工作环境治理 | 本机 AI 管理、Codex 上下文治理、安全卫生检查 | 降低上下文过大、凭据暴露和本机 AI 工作环境失控风险 |
| AI 协作沉淀 | 进展记录、安全边界、质量检查、示例输出 | 让团队能看懂产出、复用资产，并避免把私有数据放进 Git |

## 仓库地图

| 分类 | 内容 | 入口 |
| --- | --- | --- |
| 项目总览 | 五条业务线、项目状态、维护规则 | [`PROJECTS.md`](./PROJECTS.md) |
| 商务SKILL | 致远 OA 合同草稿自动化 | [`商务SKILL/README.md`](./商务SKILL/README.md) |
| 业务分析SKILL | KOL 研究分析、SmartBI 周报数据工具 | [`业务分析SKILL/README.md`](./业务分析SKILL/README.md) |
| 舆情监控SKILL | Facebook、小红书、App Store 舆情/评论采集 | [`舆情监控SKILL/README.md`](./舆情监控SKILL/README.md) |
| AI治理SKILL | 本机 AI 管理和 Codex 上下文治理 | [`AI治理SKILL/README.md`](./AI治理SKILL/README.md) |
| 工作进展 | 团队复盘、交接和能力沉淀说明 | [`工作进展/README.md`](./工作进展/README.md) |
| 质量与安全 | 输出字段模板、质量评估、安全规则、smoke check | [`docs/QUALITY_REVIEW.md`](./docs/QUALITY_REVIEW.md) |

## Skill 清单

| Skill | 业务场景 | 入口 |
| --- | --- | --- |
| Seeyon Contract Draft | 根据合同文件和运行时账号，在致远 OA 创建合同申请草稿，保存待发并校验金额、汇率、经办人等关键字段 | [`商务SKILL/seeyon-contract-draft/SKILL.md`](./商务SKILL/seeyon-contract-draft/SKILL.md) |
| KOL Research Analysis | 将 KOL 历史材料、投放复盘和后链路数据转成可复用的分析框架 | [`业务分析SKILL/kol-research-analysis/README.md`](./业务分析SKILL/kol-research-analysis/README.md) |
| SmartBI Weekly Reporting | 将 SmartBI 周报数据导出、路由、校验和安全边界整理成可复用方法 | [`业务分析SKILL/smartbi-weekly-reporting/README.md`](./业务分析SKILL/smartbi-weekly-reporting/README.md) |
| Facebook Opinion Crawler | 采集 Facebook 帖子、视频、Reels、主页、小组讨论评论 | [`舆情监控SKILL/facebook/SKILL.md`](./舆情监控SKILL/facebook/SKILL.md) |
| Xiaohongshu Opinion Crawler | 采集小红书 / Rednote 笔记和评论，侧重海外/港澳台信号 | [`舆情监控SKILL/小红书/SKILL.md`](./舆情监控SKILL/小红书/SKILL.md) |
| App Store Opinion Crawler | 通过 Apple 公开接口采集 App Store 评论和地区汇总 | [`舆情监控SKILL/appstore/SKILL.md`](./舆情监控SKILL/appstore/SKILL.md) |
| Local AI Manager | 管理本机 AI 工作环境、Codex 上下文体积、技能目录和安全风险摘要 | [`AI治理SKILL/local-ai-manager/README.md`](./AI治理SKILL/local-ai-manager/README.md) |
| Codex Work Progress | 沉淀 AI 协作进展、可复用资产和安全边界 | [`工作进展/codex-work-progress/README.md`](./工作进展/codex-work-progress/README.md) |

## 目录结构

```text
charlesSKILL/
  README.md
  PROJECTS.md
  SECURITY.md
  CHANGELOG.md
  .github/workflows/
  docs/
  examples/
  tests/
  商务SKILL/
    README.md
    seeyon-contract-draft/
      SKILL.md
      agents/openai.yaml
      references/config.example.json
      references/field-checklist.md
      scripts/create_seeyon_contract_draft.mjs
  业务分析SKILL/
    README.md
    kol-research-analysis/
    smartbi-weekly-reporting/
  舆情监控SKILL/
    README.md
    facebook/
    小红书/
    appstore/
  AI治理SKILL/
    README.md
    local-ai-manager/
  工作进展/
    README.md
    codex-work-progress/
```

## 使用前提

- 商务 OA 自动化：需要用户每次提供 OA 地址、账号密码、合同文件和必要业务字段。账号密码只放在仓库外的临时配置中。
- KOL 研究分析：真实飞书材料、报价、成本、投放数据和人名留在私有空间；公开仓库只保存分析框架。
- SmartBI 周报数据：真实账号、BI 路由、报表 ID、导出表和运行日志留在私有空间；公开仓库只保存脱敏方法。
- Facebook / 小红书：需要本机可运行 `opencli`，Chrome 已登录对应平台账号，并连接 OpenCLI Browser Bridge。
- App Store：使用 Apple 公开 Search API 和 iTunes RSS，不依赖登录态。
- Local AI Manager：本机扫描结果、Codex 原始会话、自动化私有配置和系统日志不提交。
- Excel/文档交付：建议在本机私有输出目录生成，不要把真实交付物提交到仓库。

## 快速使用

### 致远 OA 合同草稿

```bash
node 商务SKILL/seeyon-contract-draft/scripts/create_seeyon_contract_draft.mjs /tmp/seeyon-contract-config.json
```

配置形状见 [`商务SKILL/seeyon-contract-draft/references/config.example.json`](./商务SKILL/seeyon-contract-draft/references/config.example.json)。真实账号密码和合同路径必须放在仓库外。

### Facebook 评论采集

```bash
node 舆情监控SKILL/facebook/scripts/opencli_facebook_expand_comments.mjs 舆情监控SKILL/facebook/targets.example.json
```

### 小红书评论采集

```bash
node 舆情监控SKILL/小红书/scripts/opencli_xiaohongshu_collect_comments.mjs 舆情监控SKILL/小红书/config.example.json
```

### App Store 评论采集

```bash
node 舆情监控SKILL/appstore/scripts/appstore_reviews_workbook.mjs 舆情监控SKILL/appstore/config.example.json
```

## 质量检查

提交前运行：

```bash
node tests/smoke_check.mjs
```

该检查只验证仓库结构、示例配置和脚本语法，不访问真实平台账号，也不读取本机私有数据。

GitHub Actions 也会在提交后运行同样的 smoke check，确保公开仓库里的示例和脚本入口没有断。

## 安全边界

不得提交：

- 平台账号、密码、Cookie、Token、私钥、验证码、会话文件。
- 未脱敏的客户、学生、家长、供应商、订单、合同、报价、营收等业务数据。
- 原始导出表格、真实评论工作簿、合同附件、截图、录屏、日志、浏览器缓存。
- 包含内部流程链接、账号信息或本机私有路径的调试输出。

更多规则见 [`SECURITY.md`](./SECURITY.md)。
