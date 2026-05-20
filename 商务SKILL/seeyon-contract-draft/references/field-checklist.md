# Field Checklist

Use this checklist before reporting success.

## Applicant

- 申请人 shows the logged-in user.
- 经办人 is not blank; default to self unless the user says otherwise.

## Contract Parties

- 对方签约主体 is selected from OA lookup, not typed as loose text.
- 对方主体编码, 成立时间, 联系人, and bank/account data are populated by OA when available.
- 我方签约主体 is selected exactly.
- 我方其他签约主体 is blank unless the instruction file says the product requires it.

## Contract Basics

- 合同名称 matches the Word title or supplied override.
- 对方签约主体类型, 一级分类, 二级分类, 三级分类 match the instruction file.
- 框架合同 and 关联立项要求 match the instruction file.
- 渠道名称, start date, and end date match the contract.

## Amount And Finance

- 合同预计总金额 is not blank or zero.
- 本币合同预计总金额 is not blank or zero.
- 币种 is correct.
- 汇率 is `1` or `1.0000` for RMB/CNY.
- 财务信息 合同金额（含税） equals the expected amount unless a different finance amount is specified.
- 大写金额 matches the numeric amount.
- 票据类型, 开票形式, and 税率 match the instruction file.

## Attachment

- 合同正文 contains the final filled Word contract attachment.
- The uploaded file name matches the intended local file.

## Draft Safety

- Save draft only.
- Reopen the draft and verify persisted values, not only the current DOM.
- Report missing fields and draft URL. Do not submit unless explicitly instructed.
