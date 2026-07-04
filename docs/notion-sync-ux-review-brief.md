# Notion Sync UX Review Brief

Date: 2026-07-04

Repository: `lucasung-debug/hr-ops-portfolio`
Local path: `C:\Users\propo\Desktop\AI\projects\portfolio\hr-ops-portfolio`
Deployment model: GitHub Actions generates `content.js`; Cloudflare Pages deploys the site from GitHub. This is not a VPS workflow.

## Current Status

- Local `main` is aligned with `origin/main`.
- Latest verified commit: `1ec34a3e2415a3211d93d800b5184e52b9e33bf6`
- Working tree was clean before this note was added.
- Previous local-only `.gitignore` and `AGENTS.md` changes were preserved in Git stash: `stash@{0}: codex-pre-sync-hr-ops-portfolio-20260704T164959`
- This brief records analysis only. No sync code, Notion content, GitHub workflow, or Cloudflare deployment behavior has been changed.

Update after initial review:

- A local implementation branch was created: `codex/notion-sync-ux-safety`.
- That branch currently contains a draft code change in `scripts/generate-content.js`.
- The draft removes generated timestamp churn, fails closed on Notion publish-filter validation errors, adds status/category aliases, and prints a sync summary.
- After diff review, the branch also stabilizes Notion temporary file URLs by downloading them into `assets/notion/` and referencing stable local paths from generated `content.js`.
- The earlier assumption that signed URL work could wait was incorrect: the latest daily commit changed one timestamp line and two signed certificate image URL lines.
- `.github/workflows/sync-notion.yml` was updated so generated assets are staged with `content.js`.
- The workflow Node.js runtime was raised from 18 to 20 because the generator now uses global `fetch()` for Notion asset downloads.
- The draft has not been pushed to GitHub and has not changed Cloudflare Pages or Notion.

## Sources Reviewed

### Notion

Hub page:
- `Git-Notion Sync`
- URL: `https://app.notion.com/p/31bc27c2afbf8004a5b6e4b15d1faf9c`

Fetched child sources:
- `성장 기록 DB`
  - Data source: `collection://31bc27c2-afbf-814d-8b10-000b9a62f60f`
- `케이스 스터디 DB`
  - Data source: `collection://31bc27c2-afbf-8053-862e-000b90654b98`
- `스킬 DB`
  - Data source: `collection://31bc27c2-afbf-80ef-9490-000b01860280`
- `사이트 설정`
  - Page URL: `https://app.notion.com/p/31bc27c2afbf80f29c1ae880af4ea80e`

Fetched embedded guide pages:
- `케이스 스터디 DB` guide page: `31bc27c2-afbf-8172-b4fe-fb9b0da3d74f`
- `성장 기록 DB` guide page: `31bc27c2-afbf-81fd-b658-e751ef7253a5`
- `스킬 DB` guide page: `31bc27c2-afbf-81f2-829f-c1d7cb529226`

Notion limitation encountered:
- `query_data_sources` failed because the workspace does not have the required Notion Business plan with Notion AI.
- Evidence is therefore based on `fetch`, `search`, repository code, and generated `content.js`, not SQL row exports.

### Repository Files

- `.github/workflows/sync-notion.yml`
- `scripts/generate-content.js`
- `content.js`
- `docs/notion-growth-db-guide.md`
- `CLAUDE.md`
- `index.html`
- `print.html`

## Pipeline Summary

Current flow:

```text
Notion databases and settings page
  -> GitHub Actions workflow: .github/workflows/sync-notion.yml
  -> node scripts/generate-content.js
  -> generated content.js
  -> GitHub commit and push
  -> Cloudflare Pages deployment
```

The workflow runs on a daily schedule:

- `.github/workflows/sync-notion.yml` uses cron `0 0 * * *`, which is KST 09:00.
- It can also be triggered manually with `workflow_dispatch`.
- It installs dependencies under `scripts`.
- It runs `node scripts/generate-content.js`.
- It commits only `content.js` if the staged diff is non-empty.

## Findings And Evidence

### Finding 1: Daily commits can happen without meaningful content changes

Severity: High for Git history noise and deployment churn.

Evidence:

- The latest commit `1ec34a3e2415a3211d93d800b5184e52b9e33bf6` changed only `content.js`.
- Git diff showed 3 insertions and 3 deletions.
- The changes were:
  - The generated timestamp changed from `2026-07-03T00:24:04.477Z` to `2026-07-04T00:23:29.033Z`.
  - A Notion-hosted Tableau image URL changed because Notion/S3 issued a new signed temporary URL.
- `scripts/generate-content.js` injects a new timestamp with `new Date().toISOString()`.
- `scripts/generate-content.js` uses Notion file URLs directly for training images via `img.file.url`.

Why this matters:

- GitHub receives a commit even when portfolio content did not materially change.
- Cloudflare Pages may redeploy for signed URL and timestamp churn.
- History becomes harder to review because daily noise looks like content updates.
- Signed Notion file URLs are temporary and are poor stable public asset references.

Likely improvement direction:

- Stop writing a changing generation timestamp into `content.js`, or write it only when the semantic payload changes.
- Do not leave Notion signed file URLs in generated `content.js`; store Notion temporary files as stable generated assets under the repository or another durable asset host.
- The current branch uses the repository-local generated asset approach first because it is simpler than Cloudflare R2 and works with Cloudflare Pages static hosting.

Open question for Claude:

- Is repository-local generated asset storage sufficient for these certificate images, or should this later move to Cloudflare R2?

### Finding 2: Notion input has brittle property names and status semantics

Severity: High for input UX and maintainability.

Evidence:

- `케이스 스터디 DB` uses `상태` with select options `초안` and `발행`.
- `성장 기록 DB` uses `상태` with select options `초안` and `발행`.
- `스킬 DB` uses `선택` with select options `초안` and `발행`.
- `스킬 DB` category property is named `카테코리`, and `scripts/generate-content.js` depends on that exact typo.
- `scripts/generate-content.js` reads:
  - `선택` for skill publish status.
  - `카테코리` for skill category.
  - `상태` for case and growth publish status.
- The `스킬 DB` guide warns that the category value must exactly match one of the allowed values.

Why this matters:

- A user has to remember database-specific publication fields.
- A typo in a property name has become part of the code contract.
- The model is hard to explain: two databases use `상태`, one uses `선택`.
- Future database cleanup risks breaking the sync script unless aliases are supported.

Likely improvement direction:

- Keep backward compatibility in code, but introduce canonical aliases:
  - `publishStatus`: read from `상태` or `선택`.
  - `category`: read from `카테고리`, `카테코리`, or the existing property.
- Do not immediately rename Notion properties unless the migration plan is explicit.
- Add validation output that tells the operator which records are skipped and why.
- Treat publishing filter failures as hard errors, not as a reason to query the full database.

Open question for Claude:

- Should we normalize only in code first, or also migrate the Notion schema names after adding compatibility?

### Finding 2A: Filter validation failures can silently remove the publish filter

Severity: Critical for accidental publication risk.

Evidence:

- `scripts/generate-content.js` defines `queryAll()` at lines 216-239.
- If Notion returns `validation_error` while a filter exists, the catch block deletes `params.filter` and queries again.
- The current comment says this is a property-name mismatch fallback: "filter error, switch to full query."
- Publishing filters are applied through this shared helper:
  - Case studies use `상태 == 발행`.
  - Growth records use `상태 == 발행`.
  - Skills use `선택 == 발행`.
- Therefore, if a publish-status property name, type, or option breaks, the script can fetch every row instead of failing.

Why this matters:

- Draft rows can be included in generated `content.js` without a hard workflow failure.
- This is worse than a missing field because the failure mode is silent publication, not visible breakage.
- The risk is tightly coupled to Finding 2 because the schema already uses mixed status property names.

Likely improvement direction:

- For production sync, make filter `validation_error` a hard failure.
- If unfiltered fallback is ever needed for debugging, guard it behind an explicit environment flag and mark the output unsafe for deployment.
- Add a sync summary that prints published count, draft/skipped count, and any schema errors before the commit step.

Open question for Claude:

- Should `queryAll()` remove the fallback entirely, or should it support an explicit debug-only fallback path while production sync fails closed?

### Finding 3: Settings are stored as free text, not structured data

Severity: Medium for usability, high for avoidable input mistakes.

Evidence:

- `사이트 설정` is a normal page.
- Settings are written as lines like:
  - `resume_kr: https://...`
  - `academic_school: ...`
  - `academic_gpa_total: ...`
- `scripts/generate-content.js` first tries to read page properties.
- If properties are missing, it parses body text with a `key: value` regex.
- Current fetched `사이트 설정` page content shows the values in free-text body lines, not as visible structured database rows.

Why this matters:

- A missing colon, renamed key, or accidental line break can silently break settings.
- The user cannot get Notion-level field descriptions, select controls, or validation.
- This is harder to edit than a simple "Settings DB" table.

Likely improvement direction:

- Short-term: keep current page but add validation for required keys and a readable sync summary.
- Medium-term: convert settings to a small Notion database or a page with real properties.
- Preserve compatibility with the current text format during transition.

Open question for Claude:

- Is a settings database worth the added schema complexity, or should we keep the page and improve validation only?

### Finding 4: Notion body rendering supports only a narrow block subset

Severity: Medium for authoring UX.

Evidence:

- `notionBlocksToHtml()` handles:
  - headings
  - paragraphs
  - bulleted lists
  - tables
- Current guides encourage rich Notion body authoring.
- The function does not handle common authoring blocks such as:
  - numbered lists
  - callouts
  - toggles
  - child pages
  - links as first-class links beyond rich text `href`
  - nested lists
  - code blocks
  - dividers
  - images except special certificate extraction in `fetchGrowth()`

Why this matters:

- The Notion page can look correct to the operator but render incompletely on the website.
- The authoring experience is constrained by undocumented renderer behavior.
- It raises the cost of writing clean portfolio entries.

Likely improvement direction:

- Expand `notionBlocksToHtml()` with a documented block support matrix.
- Add a validation or warning report for unsupported blocks.
- Keep the first pass conservative: numbered lists, callouts, dividers, links, and nested list basics.

Open question for Claude:

- Which Notion blocks should be supported first based on the portfolio's actual editing patterns?

### Finding 5: The sync has weak operator feedback

Severity: Medium.

Evidence:

- `sync-notion.yml` only commits `content.js` if changed.
- `generate-content.js` prints "Fetching Notion data..." and "content.js written".
- There is no structured summary of:
  - number of published rows
  - skipped drafts
  - missing required fields
  - unsupported blocks
  - changed semantic sections
  - volatile-only changes

Why this matters:

- The operator cannot easily tell whether a Notion edit was applied.
- A broken or skipped row may not be obvious until checking the live site.
- Claude/Codex handoff is harder because the Action log lacks a useful content-level report.

Likely improvement direction:

- Generate a sync report in the GitHub Actions log.
- Optionally write a small `sync-report.json` artifact, but do not commit it by default.
- Fail the workflow only for critical schema or required-field errors; warn for drafts and optional missing data.

Open question for Claude:

- Should warnings fail the workflow, or should only hard schema errors fail?

## Recommended Implementation Order

1. Remove generated timestamp and signed URL churn.
   - Highest impact-to-effort ratio.
   - Prevent timestamp-only and Notion temporary URL-only commits from triggering unnecessary GitHub and Cloudflare churn.
   - The local branch implements repository-local generated assets before considering Cloudflare R2.

2. Fail closed on publish-filter validation errors.
   - Prevent accidental draft publication if a Notion property name, type, or option changes.
   - This should be handled before broader schema cleanup because it is a publication safety issue.

3. Add validation and a human-readable sync summary.
   - Makes future Notion edits safer.
   - Helps the operator know what changed before checking the site.

4. Add property aliases and compatibility layer.
   - Reduces Notion UX friction without risky immediate schema migration.

5. Improve Notion body rendering.
   - Useful but should be scoped after the core sync becomes stable and observable.

6. Revisit Notion schema design.
   - Consider templates, forms, buttons, or a Settings DB after the sync script supports backward-compatible parsing.

## Suggested Review Prompt For Claude

Use this prompt when asking Claude for a second opinion:

```text
Please review the Notion-to-Cloudflare portfolio sync architecture in this repository.

Context:
- Repo: lucasung-debug/hr-ops-portfolio
- Deployment is GitHub Actions -> content.js -> Cloudflare Pages, not VPS.
- The Notion hub page is "Git-Notion Sync".
- Current sync code is in .github/workflows/sync-notion.yml and scripts/generate-content.js.
- The latest daily commit changed only generated timestamp and a Notion temporary S3 image URL.

Review focus:
1. Do you agree that the first priority should be removing generated timestamp churn before building a durable asset workflow?
2. Do you agree that queryAll() should fail closed when a publish filter causes a Notion validation_error, instead of deleting the filter and querying every row?
3. What is the safest way to distinguish semantic content changes from volatile generated values?
4. Should we introduce schema aliases in code before renaming Notion properties like "카테코리"?
5. What validation report would be most useful for a non-developer operator editing Notion?
6. Which Notion block types should be supported first in notionBlocksToHtml()?

Please challenge the assumptions and suggest the smallest safe implementation plan.
```

## Non-Goals For The Next Pass

- Do not expose Notion API keys to frontend code.
- Do not replace Cloudflare Pages with VPS deployment.
- Do not introduce a frontend build system unless there is a strong reason.
- Do not rename Notion schema fields without a compatibility phase.
- Do not commit generated daily noise as proof that content changed.
- Do not introduce Cloudflare R2 or another asset migration before measuring the remaining churn after timestamp removal.
