# Codex Context Health Check

## 检查目标

| 项目 | 说明 |
| --- | --- |
| Session size | 找出过大的 Codex session，避免上下文载荷过大 |
| Archive status | 确认可逆归档是否有 manifest |
| Skill directory | 检查本机 skill 是否结构完整 |
| Automation configs | 只记录存在性和风险摘要，不打印私有内容 |
| Security hygiene | 只报告敏感键名、路径和风险等级 |

## 输出原则

可以输出：

- 文件路径。
- 文件大小。
- 风险类型。
- 建议动作。
- 是否已归档、是否有 manifest。

不要输出：

- 原始对话内容。
- 环境变量值。
- Token、Cookie、Session、密码。
- 自动化 prompt 中的私有业务数据。

## 建议流程

1. 先做只读扫描。
2. 标记大文件和高风险路径。
3. 需要归档时生成 manifest，保证可逆。
4. 归档后再次检查 session 目录体积。
5. 只在用户确认后删除或移动任何真实文件。
