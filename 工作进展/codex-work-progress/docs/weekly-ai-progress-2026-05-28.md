# Weekly AI Progress - 2026-05-28

## Overall Summary

本周 AI 工作的重点，是把一次次临时协作整理成可复用、可检查、可交接的资产。工作范围从个人效率工具扩展到业务流程自动化、业务分析方法、公开舆情采集、AI 工作环境治理和公开仓库治理。

当前 `charlesSKILL` 已从零散 Skill 和脚本整理为五条业务线：

1. 业务流程自动化。
2. 业务分析与数据工具。
3. 公开舆情与用户反馈。
4. AI 工作环境治理。
5. AI 协作沉淀与仓库治理。

## Key Progress

### 1. Repository Portfolio Reorganization

本周将 `charlesSKILL` 重新整理为项目组合型仓库，补齐了根 README、项目总览、质量评估、安全边界和自动检查。

已形成的公开安全入口：

- `README.md`：说明仓库定位、业务线、Skill 清单、目录结构和安全边界。
- `PROJECTS.md`：按项目列出业务价值、路径、状态和安全边界。
- `docs/QUALITY_REVIEW.md`：从结构完整、README、复用性、业务价值和安全边界角度评估仓库。
- `tests/smoke_check.mjs`：验证关键文件、示例配置和脚本语法。
- `.github/workflows/smoke-check.yml`：在 GitHub 上自动运行 smoke check。

结果：仓库从“文件看起来比较散”变成“别人打开后能先看懂业务地图，再进入具体项目”。

### 2. Business Process Automation

沉淀了致远 OA 合同草稿自动化方向：

- 建立 `商务SKILL/seeyon-contract-draft/`。
- 补充 `SKILL.md`、示例配置、字段校验清单和脚本入口。
- 明确只创建草稿、保存待发、人工最终确认。
- 把 OA 账号、合同文件、真实业务字段全部限定在运行时和私有空间。

价值：把重复、易错的 OA 合同录入工作转成可复用流程，并把金额、汇率、经办人、财务字段、附件等关键校验固化下来。

### 3. Business Analysis And Data Tooling

把今天新增的业务分析类项目纳入 `charlesSKILL`，但只保留公开安全的方法层。

新增目录：

- `业务分析SKILL/kol-research-analysis/`
- `业务分析SKILL/smartbi-weekly-reporting/`

KOL 方向沉淀：

- 将历史材料、投放复盘、素材表现和后链路指标整理成分析框架。
- 建立 KOL / 素材分层方法：强资产、测试资产、品牌资产、暂停资产。
- 明确不提交真实人名、报价、成本、飞书原文、会议细节或投放明细。

SmartBI 方向沉淀：

- 将周报数据工作拆成 doctor、smoke check、route query、read-only export、report build、writeback guard。
- 明确真实账号、报表 ID、内部路由表、导出表、截图和日志都不进入公开仓库。
- 保留可复用的 CLI 工作流和安全边界说明。

价值：把业务分析从“临时读取材料和跑数据”升级成可复用的分析框架和数据工具方法。

### 4. Public Opinion And User Feedback Workflows

继续维护公开舆情和用户反馈采集方向：

- Facebook 评论采集 Skill。
- 小红书 / Rednote 笔记与评论采集 Skill。
- App Store 公开评论采集 Skill。
- 统一输出字段模板。
- fake sample 输出样例。

价值：市场、投放、产品或运营需要看公开评论时，可以复用同一套字段、限制说明和采集方法，而不是每次从头写提示词。

### 5. AI Work Environment Governance

把本机 AI 管理方向整理为公开安全项目入口：

- 新增 `AI治理SKILL/local-ai-manager/`。
- 梳理 Codex 上下文体积检查、技能目录检查、自动化检查和安全卫生检查方法。
- 明确扫描结果、原始会话、环境变量、认证文件和自动化私有配置不进入公开仓库。

本周 Codex 会话上下文状态：

- active session 数：11。
- 总体积约 51.1 MB。
- 最大 session 约 8.95 MB。
- 当前没有超过 10 MB 的大 session。

价值：开始把 AI 工作环境本身纳入治理，减少上下文过大、敏感信息外泄和本机状态混乱的风险。

### 6. Communication And Local Tooling

本周还处理了多项个人 AI 工作流基础设施问题：

- 梳理钉钉机器人通道所需配置和后台操作。
- 协助建立 GitHub 使用流程，包括登录、验证、仓库查看、提交和推送。
- 排查 Chrome、VPN、本机进程、内存、终端暂停等本机使用问题。
- 解释 Codex、ChatGPT、模型接入和本地工具协作的关系。

价值：不只是完成单点任务，也在逐步建立“手机沟通、GitHub沉淀、本机运行、AI协作”的完整工作流。

## Evidence In Git

本周关键提交：

| Commit | 内容 |
| --- | --- |
| `a82fa1c` | 重新整理仓库为项目组合，新增 `PROJECTS.md` 和 GitHub Actions smoke check。 |
| `aecccc6` | 将今天新增的 KOL、SmartBI、Local AI Manager 项目以公开安全方式纳入 `charlesSKILL`。 |

关键路径：

- `PROJECTS.md`
- `业务分析SKILL/`
- `AI治理SKILL/`
- `商务SKILL/seeyon-contract-draft/`
- `舆情监控SKILL/`
- `工作进展/codex-work-progress/`
- `tests/smoke_check.mjs`

## Capability Improvements

本周明显提升的能力：

- 能把临时 AI 对话转成 GitHub 可读资产。
- 能在公开仓库和私有业务数据之间划清边界。
- 能把业务分析任务抽象成框架、模板和检查流程。
- 能把本机 AI 工作环境纳入可检查、可治理范围。
- 能使用 GitHub 提交、推送和自动检查形成可追踪进展。

## Next Week Focus

建议下周继续推进：

1. 为 SmartBI 和 KOL 各补一个完全 fake 的最小示例，展示输入、处理和输出形状。
2. 为 Seeyon、App Store、SmartBI 脱敏示例补充参数校验测试。
3. 把 Local AI Manager 抽出一个公开安全的最小 CLI demo。
4. 给 `工作进展/codex-work-progress/` 增加月度汇总入口，减少后续复盘成本。

## Public Safety Notes

本周进展只记录公开安全成果，不包含：

- 平台账号、密码、Token、Cookie、Webhook、Client Secret。
- 飞书、钉钉、SmartBI、OA 等内部链接或登录态。
- 真实合同、客户、学生、家长、老师、订单、营收、成本、投放明细。
- 原始 AI 会话、截图、日志、导出表、浏览器缓存。
