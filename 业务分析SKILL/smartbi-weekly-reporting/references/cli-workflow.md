# SmartBI CLI Workflow

## 1. 工作流分层

| 层级 | 目标 | 风险控制 |
| --- | --- | --- |
| Doctor | 检查依赖、配置形状、目录权限、敏感信息风险 | 不登录 SmartBI，不读取真实导出 |
| Smoke Check | 验证脚本语法、fake config、字段约束 | 只用假数据 |
| Route Query | 根据业务问题找到候选报表和字段口径 | 公开仓库只保留方法，不保留内部路由表 |
| Read-only Export | 导出已授权的报表数据 | 真实账号和导出文件留在私有环境 |
| Report Build | 生成周报摘要或交付物 | 公开仓库只放模板，不放真实周报 |
| Writeback Guard | 对写回动作做审批、锁定、预演和回滚准备 | 默认不在公开仓库启用真实写回 |

## 2. 推荐命令形状

```bash
python3 scripts/smartbi_cli.py doctor --json
python3 scripts/smoke_smartbi_cli.py --json
python3 scripts/validate_smartbi_config.py --config configs/example.json
```

真实导出前必须满足：

- 操作者有 SmartBI 权限。
- 凭据来自运行时环境变量或私有凭据管理器。
- 输出目录在仓库外，或已被 `.gitignore` 忽略。
- 本轮任务有明确报表范围和时间范围。

## 3. 公开仓库只保留的内容

- fake config。
- fake report profile。
- 字段解释模板。
- 离线校验脚本。
- 安全边界和操作顺序。

## 4. 不进入公开仓库的内容

- SmartBI 用户名、密码、Cookie、Session。
- 内部报表 ID、租户链接、真实路由表。
- Excel/CSV 导出、截图、运行日志、`run.json`。
- 带真实成本、营收、利润、订单或个人信息的数据。
