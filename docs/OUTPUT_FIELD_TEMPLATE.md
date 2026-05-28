# Output Field Template

This template defines the recommended public-safe output structure for comment, review, and public opinion collection tasks.

The goal is to make Facebook, Xiaohongshu, and App Store outputs easier to compare across projects and easier to hand off to business teams.

## Required Sheets Or Sections

| Section | Purpose | Required |
| --- | --- | --- |
| `source_records` | What was searched or fetched, when, and with which platform limits. | Yes |
| `comment_details` | One row per collected comment or review. | Yes |
| `effective_comments` | Filtered comments useful for business analysis. | Yes |
| `summary` | Counts, themes, sentiment, risks, and recommended next actions. | Yes |
| `limitations` | Access limits, platform filtering, deleted content, or data completeness notes. | Yes |

## `source_records`

| Field | Description | Example |
| --- | --- | --- |
| `platform` | Source platform. | `App Store` |
| `query_or_target` | Search term, post URL, note URL, app ID, or review feed. | `VIPTHINK Hong Kong` |
| `source_url` | Public source URL when available. | `https://example.com/public-post` |
| `collected_at` | ISO timestamp or local collection date. | `2026-05-20T10:00:00+08:00` |
| `collection_method` | Script, skill, or manual review method. | `appstore_reviews_workbook.mjs` |
| `status` | `ok`, `partial`, or `blocked`. | `partial` |
| `limit_note` | Why the result may be incomplete. | `Platform hides some replies behind login state.` |

## `comment_details`

| Field | Description |
| --- | --- |
| `platform` | Facebook, Xiaohongshu, App Store, or another public platform. |
| `source_id` | Post, note, app, or feed identifier. |
| `source_title` | Public source title if available. |
| `source_url` | Public source URL if available. |
| `comment_id` | Platform comment or review ID if available. |
| `author_display` | Public display name only. Do not add private account data. |
| `published_at` | Comment or review time when available. |
| `region` | Public region or configured country/region. |
| `rating` | Rating value when available. |
| `content` | Comment or review text. |
| `language` | Optional detected language. |
| `dedupe_key` | Stable key for de-duplication. |
| `is_effective` | `yes` or `no`. |
| `sentiment` | `positive`, `neutral`, `negative`, or `question/suggestion`. |
| `topic` | High-level business topic. |
| `risk_tag` | Optional risk label. |
| `evidence_url` | Public link for review. |

## `summary`

| Field | Description |
| --- | --- |
| `total_sources` | Count of searched or fetched targets. |
| `total_comments` | Count of collected comments or reviews. |
| `effective_comments` | Count of comments useful for business analysis. |
| `top_topics` | Top topic list with counts. |
| `sentiment_mix` | Sentiment distribution. |
| `representative_quotes` | Short selected public quotes, with source links when possible. |
| `business_reading` | What the business team should learn from the data. |
| `next_actions` | Recommended follow-up actions. |

## Safety Rules

- Use fake sample data in Git.
- Keep real workbooks, exports, logs, screenshots, and browser captures local.
- Do not include cookies, login state, internal account IDs, customer data, or private contact information.
- If a field cannot be made public-safe, omit it and explain the omission in `limitations`.
