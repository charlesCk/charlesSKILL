# Codex Work Progress

This directory is a public-safe progress handoff for team review and project continuity.

It summarizes what Charles has built with Codex, where the reusable assets live, what improved during the latest work cycle, and which private runtime details are intentionally excluded. It is designed for teammates to understand work progress without needing access to local Codex sessions or private business data.

## Business Purpose

The current Codex work focuses on turning repeated manual business research into reusable, reviewable AI workflows.

Main business outcomes:

- Public opinion and comment collection can be repeated across Facebook, Xiaohongshu, and App Store.
- Platform-specific collection rules are written as skills instead of staying in one-off chat history.
- Outputs are shaped for later reporting: source records, comment details, useful comments, summary analysis, and limitation notes.
- Public repository safety is improved through clear security boundaries, examples, and ignore rules.
- Repository progress becomes easier for teammates to review and reuse.

## Current Deliverables

| Area | Current asset | Value |
| --- | --- | --- |
| Seeyon OA contract drafting | `商务SKILL/seeyon-contract-draft/SKILL.md`, `商务SKILL/seeyon-contract-draft/scripts/create_seeyon_contract_draft.mjs` | Create draft-only contract applications from runtime-provided contracts and accounts, with strict verification rules. |
| Facebook opinion collection | `舆情监控SKILL/facebook/SKILL.md`, `舆情监控SKILL/facebook/scripts/opencli_facebook_expand_comments.mjs` | Collect and expand public Facebook comment threads with reusable OpenCLI guidance. |
| Xiaohongshu opinion collection | `舆情监控SKILL/小红书/SKILL.md`, `舆情监控SKILL/小红书/scripts/opencli_xiaohongshu_collect_comments.mjs` | Search notes, collect comments, and separate useful non-mainland/product-related signals. |
| App Store review collection | `舆情监控SKILL/appstore/SKILL.md`, `舆情监控SKILL/appstore/scripts/appstore_reviews_workbook.mjs` | Collect public App Store reviews by app and country/region through Apple public endpoints. |
| Repository governance | `README.md`, `SECURITY.md`, `.gitignore`, `docs/QUALITY_REVIEW.md` | Make the repository easier to evaluate, safer to publish, and more reusable for teammates. |
| Progress handoff | `工作进展/codex-work-progress/` | Tell reviewers what changed, why it matters, and where the proof lives. |

## Progress Highlights

Recent work converted the repository from a small set of scripts into a more legible AI work asset library.

- Added three platform-specific Codex skills for comment and review collection.
- Added script entry points and example configs for each platform.
- Reorganized the repository so each skill has a consistent local shape.
- Rewrote the root README around business value, repository map, quick usage, deliverable standard, and security boundaries.
- Added a quality review document that maps the repository to evaluation criteria.
- Added this progress handoff so teammates can see the work story, not only commit messages.

## Improvement Signals

What improved compared with the initial state:

- From one-off tasks to reusable skills.
- From platform-specific trial work to documented workflows.
- From unclear public boundary to explicit security rules.
- From script-only assets to business-facing deliverable standards.
- From scattered progress evidence to a review-friendly progress folder.

## Recommended Review Order

For team review, read in this order:

1. Root `README.md` for the overall repository purpose and map.
2. `docs/QUALITY_REVIEW.md` for quality criteria and next steps.
3. Each platform `SKILL.md` for reusable workflow design.
4. `工作进展/codex-work-progress/docs/progress-log.md` for latest work progress.
5. `工作进展/codex-work-progress/docs/reusable-assets.md` for asset-level evidence.

## Public Safety Boundary

This folder intentionally does not include:

- Codex local session files.
- OpenCLI browser cache or login state.
- DingTalk, Feishu, GitHub, Apple, Facebook, Xiaohongshu, or OpenAI credentials.
- Raw customer, student, parent, supplier, revenue, order, contract, or comment exports.
- Real generated workbooks, screenshots, logs, or browser captures.

Only public-safe summaries, paths, and reusable workflow descriptions are included.
