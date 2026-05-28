# Repository Quality Review

本文件用于说明 `charlesSKILL` 的质量定位、当前优势和后续优化路线。当前仓库按三条业务线整理：业务流程自动化、公开舆情与用户反馈、AI 协作沉淀与治理。

## 评价维度

| 维度 | 当前状态 | 说明 |
| --- | --- | --- |
| 结构完整 | 良好 | 已按商务自动化、舆情监控、工作进展三类归档，并新增 `PROJECTS.md` 作为项目组合入口。 |
| README 清楚 | 已补强 | 根 README 已增加业务线定位、仓库地图、快速使用、质量检查和安全边界。 |
| 安全边界明确 | 已补强 | 新增 `SECURITY.md`，明确禁止提交真实数据、密钥、日志、截图和平台凭据。 |
| 可复用工具/交付物 | 已补强 | Seeyon、Facebook、小红书、App Store 均有 Skill 或脚本入口，并新增统一输出字段模板、fake sample 和 smoke check。 |
| 业务价值可见 | 良好 | 覆盖 OA 合同草稿、公开评论采集、市场/投放/产品反馈证据沉淀，以及团队复盘材料。 |

## 当前亮点

- 仓库主题从单点脚本升级为三条业务线的 AI workflow portfolio。
- `PROJECTS.md` 让项目状态、路径、业务价值和安全边界更容易被快速理解。
- Skill 边界清楚：Seeyon、Facebook、小红书、App Store 分别有独立入口。
- Seeyon 合同草稿流程补充了金额、汇率、经办人、财务字段、附件等关键校验。
- 已包含平台限制说明，不夸大数据完整性。
- App Store 采集不依赖登录态，适合稳定复跑。
- Facebook / 小红书采集明确使用 OpenCLI background 模式，减少对本机使用的打扰。
- `docs/OUTPUT_FIELD_TEMPLATE.md` 统一了评论和评论汇总字段，便于跨平台比较。
- `examples/sample-opinion-summary.json` 提供公开安全的假交付物样例。
- `tests/smoke_check.mjs` 和 GitHub Actions 可以验证结构、示例配置和脚本语法。

## 待优化事项

1. 增加更接近真实交付格式的 fake workbook 或 CSV sample。
2. 为 Seeyon 和三类舆情脚本补充参数校验测试。
3. 为每个平台补离线端到端测试，避免依赖真实登录态。
4. 为脚本增加更多参数校验和清晰错误提示。
5. 若将来有真实交付物，只保存脱敏摘要，不提交原始工作簿。

## 建议排序

优先级从高到低：

1. `seeyon-contract-draft`：贴近内部业务流程，字段校验价值高，但需持续适配真实 OA 表单变化。
2. `appstore`：最稳定，公开接口可复跑，适合作为舆情采集标准化样板。
3. `小红书`：业务价值高，但依赖登录态和平台风控，需要更强的异常记录。
4. `facebook`：适合投放和海外市场舆情，但受权限、排序和隐藏评论影响最大。
5. `codex-work-progress`：适合展示可复用资产和阶段成果，需要随重要提交持续维护。

## 下一版目标

下一版可以把仓库从“项目组合”继续升级为更标准的“AI 业务自动化工具包”：

- 每个项目都有示例配置。
- 每个项目都有统一输出字段或结果说明。
- 每个脚本都有 smoke test 或参数校验测试。
- 根目录有统一 `examples/` 和 fake sample workbook / CSV。
- README 中增加真实但脱敏的交付截图或字段样例。
