# Progress Log

This log is written for GitHub-based weekly reporting. It focuses on what changed, why it matters, and where the reusable evidence lives.

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

- `facebook/SKILL.md`
- `小红书/SKILL.md`
- `appstore/SKILL.md`

### Added Script Entrypoints

Added platform scripts and example configs:

- `facebook/scripts/opencli_facebook_expand_comments.mjs`
- `小红书/scripts/opencli_xiaohongshu_collect_comments.mjs`
- `appstore/scripts/appstore_reviews_workbook.mjs`
- `facebook/targets.example.json`
- `小红书/config.example.json`
- `appstore/config.example.json`

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

### Added Weekly Report Handoff

Added `projects/codex-work-progress/` so weekly scanners can understand the work story.

Business value:

- Helps Liuya's AI weekly report task identify progress beyond raw commit counts.
- Shows business-facing progress, reusable assets, quality improvements, and safety limits in one place.

## Next Planned Improvements

- Add smoke tests for each script's config loading and validation path.
- Add a shared output field template for comment workbooks.
- Add `CHANGELOG.md` to track skill-level changes over time.
- Add tiny fake sample outputs that show expected deliverable shape without using real business data.
