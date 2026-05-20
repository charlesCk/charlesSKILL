# Security Policy

本仓库是公开仓库，只能保存可复用的 Skill、脚本、示例配置和公开安全文档。

## 禁止提交

- `.env`、`.env.*`、真实配置文件。
- API Key、Access Token、Cookie、Session、私钥、证书、验证码、恢复码。
- 致远 OA、Facebook、小红书、飞书、钉钉、GitHub、Apple 等平台的登录态或抓包凭据。
- 真实客户、学生、家长、供应商、订单、合同、报价、营收、成本、利润等业务数据。
- 原始导出文件、真实评论工作簿、合同附件、OA 流程链接、截图、录屏、浏览器缓存、运行日志。
- 未脱敏的 AI 对话记录、内部路径、账号 ID、租户 ID、Webhook URL。

## 可以提交

- `SKILL.md`。
- `references/` 下的平台公开规则、字段说明、操作流程。
- `scripts/` 下不含密钥的采集、整理、导出脚本。
- `agents/openai.yaml` 等不含真实密钥的模型配置模板。
- `config.example.json`、`.env.example`、fake data 或公开来源样例。
- 不含真实租户、账号、合同、个人信息的运行配置模板和字段校验清单。

## 上传前检查

提交前至少执行：

```bash
git status --short
git diff --cached --name-only
rg -n -i "(token|secret|password|passwd|cookie|api[_-]?key|access[_-]?key|client[_-]?secret|private key|BEGIN [A-Z ]*PRIVATE KEY|webhook|bearer)" .
rg -n -i "(客户|学生|家长|合同|报价|收入|营收|利润|成本|订单|支付|内部|机密|账号|密码|手机号|身份证)" .
```

如果命中真实敏感内容，先删除、脱敏或移动到本地私有目录，不要继续提交。

## 平台限制说明

这些 Skill 只能采集当前登录账号可见、平台允许访问或公开接口可返回的内容。不要承诺 100% 覆盖所有隐藏评论、删除评论、被过滤评论或私密内容。

交付报告中必须说明：

- 当前账号可见范围。
- 平台排序、过滤、风控、权限限制。
- 数据抓取时间。
- 评论去重和有效评论筛选规则。
