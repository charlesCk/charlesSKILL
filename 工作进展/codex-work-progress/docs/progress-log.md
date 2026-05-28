# Progress Log

This log is written for team review and project continuity. It focuses on what changed, why it matters, and where the reusable evidence lives.

## 2026-05-20

### Added Business Contract Draft Skill

Created a public-safe Seeyon OA contract draft skill:

- `商务SKILL/seeyon-contract-draft/SKILL.md`
- `商务SKILL/seeyon-contract-draft/references/config.example.json`
- `商务SKILL/seeyon-contract-draft/references/field-checklist.md`
- `商务SKILL/seeyon-contract-draft/scripts/create_seeyon_contract_draft.mjs`

Business value:

- Turns a fragile manual OA contract entry process into a reusable draft-only workflow.
- Requires each future user to provide their own OA account and contract file at runtime.
- Captures hard-won validation rules for amount carry-over, RMB exchange rate, finance amount, and handler/self fields.
- Keeps credentials, personal data, contracts, screenshots, and OA links out of Git.

### Reorganized Repository Categories

Moved assets into clearer business-facing folders:

- `商务SKILL/`
- `舆情监控SKILL/`
- `工作进展/`

Business value:

- Makes the repository easier to review by capability area.
- Keeps crawler skills separate from internal business-process automation.
- Keeps progress evidence in its own folder for later review.

### Strengthened Reviewability

Added public-safe assets that make the repository easier to review and verify:

- `CHANGELOG.md`
- `docs/OUTPUT_FIELD_TEMPLATE.md`
- `examples/sample-opinion-summary.json`
- `tests/smoke_check.mjs`

Business value:

- Reviewers can see both activity and quality improvement.
- Teammates can understand the expected output fields before running any platform crawler.
- Fake samples show the deliverable shape while keeping real business exports out of Git.
- Smoke checks reduce the risk of broken examples or syntax errors.

## 2026-05-19

### Built Platform Skills

Added three reusable Codex skill areas:

- Facebook opinion crawler.
- Xiaohongshu opinion crawler.
- App Store review crawler.

Business value:

- Reduces manual searching and copying across public platforms.
- Gives business teams a repeatable way to collect public feedback and review evidence.
- Creates a shared method for comment detail, useful comment filtering, summary analysis, and limitation notes.

Evidence:

- `舆情监控SKILL/facebook/SKILL.md`
- `舆情监控SKILL/小红书/SKILL.md`
- `舆情监控SKILL/appstore/SKILL.md`

### Added Script Entrypoints

Added platform scripts and example configs:

- `舆情监控SKILL/facebook/scripts/opencli_facebook_expand_comments.mjs`
- `舆情监控SKILL/小红书/scripts/opencli_xiaohongshu_collect_comments.mjs`
- `舆情监控SKILL/appstore/scripts/appstore_reviews_workbook.mjs`
- `舆情监控SKILL/facebook/targets.example.json`
- `舆情监控SKILL/小红书/config.example.json`
- `舆情监控SKILL/appstore/config.example.json`

Business value:

- Teammates can reuse the workflow without reconstructing prompts from chat history.
- Example configs show required input shape without exposing private targets or accounts.

### Improved Repository Quality

Reworked repository presentation and governance:

- Rewrote root `README.md`.
- Added `SECURITY.md`.
- Added `docs/QUALITY_REVIEW.md`.
- Expanded `.gitignore`.

Business value:

- Makes the repository easier for managers and teammates to evaluate.
- Reduces public GitHub publishing risk.
- Clarifies what is reusable and what must stay local.

### Added Progress Handoff

Added `工作进展/codex-work-progress/` so teammates can understand the work story.

Business value:

- Helps teammates identify progress beyond raw commit counts.
- Shows business-facing progress, reusable assets, quality improvements, and safety limits in one place.

## Next Planned Improvements

- Add smoke tests for each script's config loading and validation path.
- Add a shared output field template for comment workbooks.
- Add `CHANGELOG.md` to track skill-level changes over time.
- Add tiny fake sample outputs that show expected deliverable shape without using real business data.
