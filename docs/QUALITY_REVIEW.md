# Repository Quality Review

本文件用于说明 `charlesSKILL` 的质量定位、当前优势和后续优化路线。

## 评价维度

| 维度 | 当前状态 | 说明 |
| --- | --- | --- |
| 结构完整 | 良好 | 三个平台均采用 `SKILL.md`、`references/`、`scripts/`、`agents/` 结构。 |
| README 清楚 | 已补强 | 根 README 已增加业务价值、仓库地图、快速使用、交付物规范和安全边界。 |
| 安全边界明确 | 已补强 | 新增 `SECURITY.md`，明确禁止提交真实数据、密钥、日志、截图和平台凭据。 |
| 可复用工具/交付物 | 已补强 | 三个平台均有脚本入口，并新增统一输出字段模板、fake sample 和 smoke check。 |
| 业务价值可见 | 良好 | 聚焦评论采集、舆情分析、市场/投放/产品反馈证据沉淀。 |

## 当前亮点

- 仓库主题聚焦：围绕公开平台舆情和用户评论采集。
- Skill 边界清楚：Facebook、小红书、App Store 分别有独立入口。
- 已包含平台限制说明，不夸大数据完整性。
- App Store 采集不依赖登录态，适合稳定复跑。
- Facebook / 小红书采集明确使用 OpenCLI background 模式，减少对本机使用的打扰。
- `docs/OUTPUT_FIELD_TEMPLATE.md` 统一了评论和评论汇总字段，便于跨平台比较。
- `examples/sample-opinion-summary.json` 提供公开安全的假交付物样例。
- `tests/smoke_check.mjs` 可以验证结构、示例配置和脚本语法。

## 待优化事项

1. 增加更接近真实交付格式的 fake workbook 或 CSV sample。
2. 将 smoke check 接入 GitHub Actions 或本地 pre-push 流程。
3. 为每个平台补离线端到端测试，避免依赖真实登录态。
4. 为脚本增加更多参数校验和清晰错误提示。
5. 若将来有真实交付物，只保存脱敏摘要，不提交原始工作簿。

## 建议排序

优先级从高到低：

1. `appstore`：最稳定，公开接口可复跑，适合作为第一个标准化样板。
2. `小红书`：业务价值高，但依赖登录态和平台风控，需要更强的异常记录。
3. `facebook`：适合投放和海外市场舆情，但受权限、排序和隐藏评论影响最大。

## 下一版目标

下一版可以把仓库从“Skill 集合”升级为“舆情采集工具包”：

- 每个平台都有示例配置。
- 每个平台都有统一输出字段。
- 每个平台都有 smoke test。
- 根目录有统一 `examples/` 和 fake sample workbook。
- README 中增加真实但脱敏的交付截图或字段样例。
