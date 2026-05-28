# Local AI Manager

## 项目定位

该项目来自今天整理的私有仓库 `local-ai-manager`。在 `charlesSKILL` 中保留公开安全的项目入口和复用边界，用于说明如何管理本机 AI 工作环境、Codex 上下文、技能目录、自动化和基础安全卫生。

## 可复用价值

- 用只读方式检查系统、磁盘、项目、技能、自动化和 Codex 上下文体积。
- 帮助发现过大的 Codex 会话，降低 `413 Payload Too Large` 类问题。
- 将安全风险报告限制在路径、行号、键名、大小和风险摘要，不打印真实 secret。
- 将可逆归档和 manifest 机制作为上下文治理方法。

## 推荐目录

```text
local-ai-manager/
  README.md
  references/
    context-health-check.md
```

## 原仓库处理

| 原内容 | 处理方式 |
| --- | --- |
| manager CLI 代码 | 暂留私有仓库，后续可抽出公开安全最小版 |
| codex-context-manager skill | 已单独安装在本机 Codex skills，可作为复用方向 |
| 本机扫描输出 | 不进入公开仓库 |
| 配置和报告目录 | 不进入公开仓库 |

## 不提交内容

- `~/.codex` 原始会话、日志、数据库或本机状态文件。
- 自动化私有配置、凭据、环境变量、系统扫描报告。
- 本机路径下的敏感文件内容。
