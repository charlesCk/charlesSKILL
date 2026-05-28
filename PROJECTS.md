# Project Portfolio

`charlesSKILL` is organized as a public-safe portfolio of reusable AI workflow assets. The repository is meant to show what can be reused by teammates, what business value each area creates, and which data must stay outside Git.

## 1. Business Process Automation

| Project | Path | Value | Status |
| --- | --- | --- | --- |
| Seeyon Contract Draft | `商务SKILL/seeyon-contract-draft/` | Turns repeated OA contract entry into a draft-only automation workflow with field checks for amount, exchange rate, finance fields, handler, and attachments. | Reusable skill, example config, checklist, and script entrypoint are available. |

Safety boundary:

- Runtime OA address, account, password, and contract files must be supplied outside the repository.
- The script creates and verifies drafts only; final submission remains a human decision.

## 2. Business Analysis And Data Tooling

| Project | Path | Value | Status |
| --- | --- | --- | --- |
| KOL Research Analysis | `业务分析SKILL/kol-research-analysis/` | Turns private KOL history review into a reusable analysis framework for material, authorization, acquisition, appointment, conversion, and regional comparison. | Public-safe framework and template are available; raw KOL data remains private. |
| SmartBI Weekly Reporting | `业务分析SKILL/smartbi-weekly-reporting/` | Turns SmartBI reporting work into a reusable method for CLI validation, route lookup, read-only export, reporting, and writeback safety. | Public-safe workflow and security boundary are available; internal BI maps and exports remain private. |

Safety boundary:

- KOL source documents, names, quotations, costs, revenue, and meeting details stay outside Git.
- SmartBI credentials, report IDs, internal route maps, exports, screenshots, and logs stay outside Git.

## 3. Public Opinion And User Feedback

| Project | Path | Value | Status |
| --- | --- | --- | --- |
| Facebook Opinion Crawler | `舆情监控SKILL/facebook/` | Collects and expands visible Facebook comments for market, campaign, and user feedback review. | Reusable skill, OpenCLI playbook, target example, and script entrypoint are available. |
| Xiaohongshu Opinion Crawler | `舆情监控SKILL/小红书/` | Collects note and comment signals from Xiaohongshu / Rednote, with attention to overseas, Hong Kong, Macau, and Taiwan signals. | Reusable skill, OpenCLI playbook, config example, and script entrypoint are available. |
| App Store Opinion Crawler | `舆情监控SKILL/appstore/` | Collects public App Store reviews by app and country/region through Apple public endpoints. | Reusable skill, RSS/API playbook, config example, and script entrypoint are available. |

Safety boundary:

- Only public-safe examples are committed.
- Real exports, screenshots, browser state, and platform credentials stay local.
- Platform limits and incomplete data must be recorded in output limitations.

## 4. AI Work Environment Governance

| Project | Path | Value | Status |
| --- | --- | --- | --- |
| Local AI Manager | `AI治理SKILL/local-ai-manager/` | Defines a local-first way to inspect AI workspace health, Codex context size, skill directories, automations, and basic security hygiene. | Public-safe project entry and context health-check method are available; local scan results remain private. |

Safety boundary:

- Codex raw sessions, local scan reports, environment values, auth files, and automation private configs stay outside Git.

## 5. AI Work Progress And Governance

| Project | Path | Value | Status |
| --- | --- | --- | --- |
| Codex Work Progress | `工作进展/codex-work-progress/` | Summarizes reusable assets, quality improvement, business value, and public safety decisions for team review and handoff. | Progress log, reviewer notes, and reusable asset index are available. |
| Repository Governance | `README.md`, `SECURITY.md`, `docs/QUALITY_REVIEW.md`, `tests/smoke_check.mjs` | Makes the repository easier to evaluate, safer to publish, and less dependent on private chat context. | Root entry, security rules, quality review, fake sample, and smoke check are available. |

Safety boundary:

- Progress notes describe public-safe work outcomes only.
- Local sessions, credentials, raw business files, logs, screenshots, and generated deliverables are excluded.

## Recommended Review Order

1. `README.md` for the overall purpose and quick map.
2. `PROJECTS.md` for project-level business value and status.
3. `SECURITY.md` for public repository boundaries.
4. `docs/QUALITY_REVIEW.md` for quality criteria and next steps.
5. Each project `SKILL.md` for reusable workflow details.

## Maintenance Rules

- Add every new project to this file before or during the same commit that introduces it.
- Add or update a smoke check when a new script, config shape, or required file is introduced.
- Update `CHANGELOG.md` for meaningful public-safe changes.
- Keep examples fake and small; keep real outputs outside Git.
