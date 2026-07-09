# Notion Career DB Guide

This document describes the Notion database required by the Living Portfolio L1 flow.

## Database

Create a fourth Notion database named `경력` and share it with the same Notion integration used by the existing sync workflow.

Required properties:

- `회사`: title. Company or organization name.
- `부서명`: text or rich text. Department or team name.
- `직책`: text or rich text. Role or level inside the department.
- `재직기간`: date. The sync builds the display period from start/end dates.
- `업무요약`: text or rich text. One sentence describing the role scope.
- `업무상세`: rich text. One responsibility or achievement per line. `<br>` separators are supported.
- `구분`: select. Employment type, for example `정규직`, `계약직`, `파견직`, `인턴`, or `기타`.
- `재직상태`: select. Use `재직 중`, `퇴사`, or `기타(휴직 등)`. This drives the `재직 중` period label.
- `퇴사사유`: text or rich text. Optional private Notion-only reference. This is not emitted to `content.js` or rendered by public pages.
- `상태`: status or select. Publish-ready value must be `발행`.
- `순서`: number. This is the sole sort key; lower numbers render first.

## Sync

Add the database ID as the GitHub Actions secret `NOTION_DB_ID_CAREER`.

If the secret is missing, the sync skips career history and prints a warning. Existing case, growth, and skill counts still run normally.

## Output

Published rows render into `SITE_CONTENT.careerHistory` in `content.js`.

The first published row by `순서` is treated as the current role on the main page career header. The display name is `{회사} · {부서명} · {직책}`. The same rows also render in `career.html`, which is `noindex` and intentionally absent from `sitemap.xml`.
