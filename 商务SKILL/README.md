# 商务SKILL

该目录存放商务流程自动化相关的 Codex Skills。

## 当前能力

| Skill | 场景 | 入口 |
| --- | --- | --- |
| Seeyon Contract Draft | 根据合同文件和运行时账号，在致远 OA 创建合同申请草稿 | [`seeyon-contract-draft/SKILL.md`](./seeyon-contract-draft/SKILL.md) |

## 安全要求

- 账号、密码、验证码、Cookie、Token、合同正文、客户个人信息、银行卡、身份证号都只能在运行时从用户提供的私有路径读取。
- 不要把真实合同、截图、OA 流程链接、浏览器 trace、运行日志提交到 Git。
- 自动化默认只保存草稿，不提交审批流。

## 使用方式

复制 [`seeyon-contract-draft/references/config.example.json`](./seeyon-contract-draft/references/config.example.json) 到仓库外的私有路径，补充本次合同的 OA 地址、账号密码、合同路径和业务字段后运行：

```bash
node 商务SKILL/seeyon-contract-draft/scripts/create_seeyon_contract_draft.mjs /tmp/seeyon-contract-config.json
```
