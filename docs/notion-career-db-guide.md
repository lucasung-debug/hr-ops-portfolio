# Notion Career DB Guide

This document describes the Notion database required by the Living Portfolio L1 flow.

## Database

Create a fourth Notion database named `경력` and share it with the same Notion integration used by the existing sync workflow.

Required properties:

- `회사`: title. Company or organization name.
- `직책`: text or rich text. Role, team, and level as the reader should see it.
- `기간`: text. Display-only period, for example `2026.07 ~ 재직 중`.
- `한줄요약`: text or rich text. One sentence describing the role scope.
- `핵심성과`: rich text. One achievement per line. Each line should start with the metric, for example `700명 ...`.
- `상태`: status or select. Publish-ready value must be `발행`.
- `순서`: number. This is the sole sort key; lower numbers render first.

## Sync

Add the database ID as the GitHub Actions secret `NOTION_DB_ID_CAREER`.

If the secret is missing, the sync skips career history and prints a warning. Existing case, growth, and skill counts still run normally.

## Output

Published rows render into `SITE_CONTENT.careerHistory` in `content.js`.

The first row by `순서` is treated as the current role on the main page career header. The same rows also render in `career.html`, which is `noindex` and intentionally absent from `sitemap.xml`.
