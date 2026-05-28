# SmartBI Weekly Reporting

## 项目定位

该项目来自今天整理的私有仓库 `weekly-reporting-smartbi`。在 `charlesSKILL` 中只保留公开安全的工具说明、目录边界和复用方法，用于说明 SmartBI 周报数据工作如何被结构化为可验证的 CLI/脚本流程。

原私有仓库包含内部 BI 路由、报表 ID、业务口径、配置链路、可能的导出产物和真实业务字段，不适合整包放入公开仓库。

## 可复用价值

- 将 SmartBI 数据导出从手工操作转成可配置、可校验、可复跑的工具链。
- 支持离线 doctor/smoke check，先验证配置和脚本，再接入真实账号。
- 将“读数据”“路由报表”“生成周报”“写回校验”分开，降低误操作风险。
- 对凭据、Cookie、导出表、截图、运行日志设置明确边界。

## 推荐目录

```text
smartbi-weekly-reporting/
  README.md
  references/
    cli-workflow.md
    security-boundary.md
```

## 私有仓库内容处理

| 原内容类型 | 是否纳入 charlesSKILL | 原因 |
| --- | --- | --- |
| CLI 工作流说明 | 纳入脱敏摘要 | 可复用方法，不含真实数据 |
| 安全边界 | 纳入公开安全版 | 对公开仓库有帮助 |
| 脚本源码 | 暂不整包纳入 | 涉及内部 SmartBI 操作路径和真实业务口径 |
| configs / inputs / outputs | 不纳入 | 可能包含内部报表、路由、业务字段和真实导出痕迹 |
| 运行日志、截图、工作簿 | 不纳入 | 明确禁止提交 |

## 下一步可做

- 将 SmartBI 工具拆出一个完全脱敏的最小示例 CLI。
- 添加 fake config、fake report profile 和 fake output。
- 把离线校验逻辑移植为公开安全 smoke test。
