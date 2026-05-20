# charlesSKILL

面向业务流程提效、舆情监控和工作进展沉淀的 Codex Skill 仓库。

本仓库保存可复用的 Skill、脚本、字段规则、示例配置和公开安全说明。它不保存真实账号、密码、合同、客户资料、原始导出、截图、浏览器缓存或运行日志。

## 仓库地图

| 分类 | 内容 | 入口 |
| --- | --- | --- |
| 商务SKILL | 致远 OA 合同草稿自动化 | [`商务SKILL/README.md`](./商务SKILL/README.md) |
| 舆情监控SKILL | Facebook、小红书、App Store 舆情/评论采集 | [`舆情监控SKILL/README.md`](./舆情监控SKILL/README.md) |
| 工作进展 | GitHub 周报和团队复盘可读的进展说明 | [`工作进展/README.md`](./工作进展/README.md) |

## Skill 清单

| Skill | 业务场景 | 入口 |
| --- | --- | --- |
| Seeyon Contract Draft | 根据合同文件和运行时账号，在致远 OA 创建合同申请草稿，保存待发并校验金额、汇率、经办人等关键字段 | [`商务SKILL/seeyon-contract-draft/SKILL.md`](./商务SKILL/seeyon-contract-draft/SKILL.md) |
| Facebook Opinion Crawler | 采集 Facebook 帖子、视频、Reels、主页、小组讨论评论 | [`舆情监控SKILL/facebook/SKILL.md`](./舆情监控SKILL/facebook/SKILL.md) |
| Xiaohongshu Opinion Crawler | 采集小红书 / Rednote 笔记和评论，侧重海外/港澳台信号 | [`舆情监控SKILL/小红书/SKILL.md`](./舆情监控SKILL/小红书/SKILL.md) |
| App Store Opinion Crawler | 通过 Apple 公开接口采集 App Store 评论和地区汇总 | [`舆情监控SKILL/appstore/SKILL.md`](./舆情监控SKILL/appstore/SKILL.md) |
| Codex Work Progress | 沉淀 AI 协作进展、可复用资产和安全边界 | [`工作进展/codex-work-progress/README.md`](./工作进展/codex-work-progress/README.md) |

## 目录结构

```text
charlesSKILL/
  README.md
  SECURITY.md
  CHANGELOG.md
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
  舆情监控SKILL/
    README.md
    facebook/
    小红书/
    appstore/
  工作进展/
    README.md
    codex-work-progress/
```

## 使用前提

- 商务 OA 自动化：需要用户每次提供 OA 地址、账号密码、合同文件和必要业务字段。账号密码只放在仓库外的临时配置中。
- Facebook / 小红书：需要本机可运行 `opencli`，Chrome 已登录对应平台账号，并连接 OpenCLI Browser Bridge。
- App Store：使用 Apple 公开 Search API 和 iTunes RSS，不依赖登录态。
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

## 安全边界

不得提交：

- 平台账号、密码、Cookie、Token、私钥、验证码、会话文件。
- 未脱敏的客户、学生、家长、供应商、订单、合同、报价、营收等业务数据。
- 原始导出表格、真实评论工作簿、合同附件、截图、录屏、日志、浏览器缓存。
- 包含内部流程链接、账号信息或本机私有路径的调试输出。

更多规则见 [`SECURITY.md`](./SECURITY.md)。
