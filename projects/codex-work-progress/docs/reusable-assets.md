# Reusable Assets

This file lists the current reusable assets in `charlesSKILL` and explains how they support business work.

## Skill Assets

| Asset | Type | Reuse Scenario |
| --- | --- | --- |
| `facebook/SKILL.md` | Codex skill | Guide public Facebook opinion and comment collection. |
| `facebook/references/facebook-opencli-playbook.md` | Reference playbook | Explain Facebook OpenCLI collection steps and limitations. |
| `facebook/scripts/opencli_facebook_expand_comments.mjs` | Script | Expand visible comment threads from configured Facebook targets. |
| `小红书/SKILL.md` | Codex skill | Guide Xiaohongshu note and comment collection. |
| `小红书/references/xiaohongshu-opencli-playbook.md` | Reference playbook | Explain Xiaohongshu search, collection, and useful comment filtering. |
| `小红书/scripts/opencli_xiaohongshu_collect_comments.mjs` | Script | Collect note/comment signals from configured search terms. |
| `appstore/SKILL.md` | Codex skill | Guide App Store public review collection. |
| `appstore/references/appstore-rss-playbook.md` | Reference playbook | Explain Apple Search API and RSS review retrieval. |
| `appstore/scripts/appstore_reviews_workbook.mjs` | Script | Build App Store review workbooks from public review feeds. |

## Governance Assets

| Asset | Purpose |
| --- | --- |
| `README.md` | Explain business value, repository map, usage, deliverable standard, and safety boundary. |
| `SECURITY.md` | Define public repository safety rules. |
| `.gitignore` | Keep local credentials, generated data, logs, and raw outputs out of Git. |
| `docs/QUALITY_REVIEW.md` | Map the repository to quality criteria and improvement roadmap. |
| `projects/codex-work-progress/` | Provide scan-friendly progress evidence for weekly GitHub review. |

## Current Reuse Level

| Area | Reuse Level | Notes |
| --- | --- | --- |
| Facebook | Medium | Workflow and script exist; needs smoke test and sample output. |
| Xiaohongshu | Medium | Workflow and script exist; needs smoke test and sample output. |
| App Store | Medium-high | Uses public endpoints; easiest to verify and reuse. |
| Repository governance | High | README, security boundary, quality review, and ignore rules are in place. |
| Weekly report visibility | Medium-high | Progress handoff now exists; future commits should update `progress-log.md`. |

## How Reviewers Should Interpret This Repository

This repository is not a raw data warehouse. It should be evaluated as a reusable AI workflow repository.

Good signs:

- Skills explain how to perform a task repeatedly.
- Scripts and examples show how inputs should be shaped.
- Security docs explain what is intentionally excluded.
- Progress docs show what improved over time.

Weak signs to watch in future reviews:

- Real exported data or screenshots appear in Git.
- Scripts change without README or skill updates.
- A new platform workflow is added without examples or safety notes.
- Progress work happens only in chat and is not summarized in Git.
