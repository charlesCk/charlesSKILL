---
name: seeyon-contract-draft
description: Create Seeyon/致远 OA contract application drafts from Word contract files and runtime-provided account credentials. Use when Codex needs to read a contract package, extract or confirm contract metadata, log in to a Seeyon OA tenant with user-supplied credentials, open the contract application form, fill strict business/finance fields such as signing entities, classifications, effective dates, expected amount, currency, exchange rate, handler, settlement terms, invoice settings, upload the contract attachment, save a draft only, and verify persisted form values without hardcoding private accounts, passwords, customer identities, bank data, or tenant secrets.
---

# Seeyon Contract Draft

## Inputs

Require the user to provide these at runtime. Do not store them in the skill or commit them:

- OA base URL, username, and password.
- Contract Word file or a folder containing the contract package.
- Optional process instruction file, example flow number, and explicit overrides for fields the document cannot prove.
- Confirmation that the automation should create/save a draft, not submit the workflow.

If a value is missing and cannot be inferred from the supplied files or a visible example flow, stop after a draft-safe checkpoint and report the missing fields.

## Workflow

1. Read the supplied contract file and instruction file.
   - Use `docx`/document tooling to extract text.
   - Prefer the Word title or first heading as `contractName`.
   - Extract dates, settlement terms, parties, product, channel, amount, currency, and attachment path.
   - Treat personal ID numbers, phone numbers, bank accounts, and passwords as runtime-only data.

2. Build a runtime config from the user request.
   - Start from `references/config.example.json`.
   - Put real credentials only in a local temporary config outside the repository.
   - Use `values` overrides for business choices not reliably present in the contract.

3. Automate OA headlessly.
   - Use Playwright with `headless: true`.
   - Log in from `baseUrl` using runtime credentials.
   - Open the contract module: 合同模块 -> 新 -> 合同 -> 合同申请.
   - If the menu labels differ, discover by text and only continue when the form title is 合同申请.

4. Fill the form conservatively.
   - Use visible labels and lookup dialogs before falling back to CAP4/Vue form model patching.
   - For lookup fields, select the exact intended entity. If multiple candidates exist, use the supplied code, bank account, or example flow to disambiguate.
   - Upload the final filled Word contract as 合同正文.

5. Always verify before finishing.
   - Save as draft only.
   - Reopen the draft URL or wait-send item.
   - Read persisted model values and visible text.
   - Confirm at minimum: contract amount, local-currency amount, finance amount, exchange rate, handler, parties, dates, classification, settlement terms, invoice type, tax rate, and attachment name.

## Critical Field Rules

- `合同预计总金额`, `本币合同预计总金额`, and 财务信息 `合同金额（含税）` must all carry the same amount unless the user explicitly gives a different rule.
- `汇率` must be `1` for RMB/CNY contracts. Verify it persists as `1` or `1.0000`.
- `经办人` should normally be the logged-in applicant/self. If the form leaves it blank, copy the persisted applicant member value into the handler field and save again.
- Do not submit the workflow unless the user explicitly asks to submit after reviewing the draft.
- Do not put user credentials, supplier personal data, customer personal data, contract attachments, screenshots, browser traces, or generated drafts into Git.

## Bundled Resources

- Use `scripts/create_seeyon_contract_draft.mjs` as the repeatable headless automation entrypoint.
- Use `references/config.example.json` as the config shape. Copy it to a private path such as `/tmp/seeyon-contract-config.json` before adding real credentials.
- Use `references/field-checklist.md` during verification and final reporting.

Run:

```bash
node 商务SKILL/seeyon-contract-draft/scripts/create_seeyon_contract_draft.mjs /tmp/seeyon-contract-config.json
```

The script is intentionally draft-first. It prints a JSON result with the draft URL, inferred values, missing values, and verification snapshot.
