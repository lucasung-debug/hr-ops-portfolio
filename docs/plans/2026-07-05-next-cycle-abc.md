# Next-Cycle Plans — Tracks A / B / C

Date: 2026-07-05
Author: Claude (plan/gates/verification). Implementer: codex unless stated.
Prereq context: Phase 0/A/B/C of the Notion sync UX program are CLOSED
(see docs/plans/2026-07-05-*.md). Status: gates freeze on master approval
per track; tracks are independent and may run in any order.
Recommended order: C (10 min) → B-1 (audit) → A (code PR cycle).

---

## Track C — Skills DB stray category option cleanup

Problem: the 스킬 DB `카테고리` select has BOTH `Office & Document` (stray)
and `Office & Documentation` (canonical). The site renders only the four
canonical categories (Data & Analytics / Automation & Dev / HR Tech & AI /
Office & Documentation) — a row assigned to the stray option is silently
INVISIBLE on the site.

Channel: codex's own Notion MCP (verified present in its audit:
`_notion_update_data_source`, `_fetch`). No GitHub work needed.

Steps (idempotent):
1. Fetch the 스킬 DB data source (`collection://31bc27c2-afbf-80ef-9490-000b01860280`).
   List rows and report how many use the stray option (expect 0, but verify).
2. If any row uses `Office & Document`: reassign it to `Office & Documentation`
   (report which rows — this will make them appear on the site, flag that).
3. Remove the stray option from the select schema via update_data_source
   (submit the options list WITHOUT the stray entry; do not touch other options).
4. Evidence: schema options before/after; row count per category before/after.

Gates:
- G-c1: no row lost — published skill count unchanged (13) and every row still
  has a category.
- G-c2: schema select options no longer contain `Office & Document`.
- G-c3: one sync dispatch on main afterward — outcome `unchanged` (if no rows
  were reassigned) or `changed` with skill count still 13 (if reassigned);
  callout updates normally.

---

## Track A — Phase D: Notion body renderer expansion

Goal: `notionBlocksToHtml()` in scripts/generate-content.js understands more
of what the operator naturally writes. Conservative scope (parent plan §11):

In scope (exactly these):
1. `numbered_list_item` → `<ol>` list (mirror the existing bulleted flush logic).
2. `divider` → `<hr class="border-slate-200 my-4">`.
3. `callout` → styled `<div>` with icon emoji + rich text (match site's slate
   styling; NOT the notify-marker callouts — those live on the hub page, not
   in row bodies, but do not special-case markers here).
4. `quote` → `<blockquote class="border-l-4 border-slate-200 pl-4 text-slate-500">`.
5. One-level nested lists: when a list item has `has_children`, fetch children
   and render one nested `<ul>`/`<ol>` level. Deeper nesting: render flat
   (documented ceiling, `// ponytail:` note).
6. Links in rich text: `richTextToHtml()` currently DROPS hyperlinks — add
   `t.href` → `<a href="..." target="_blank" rel="noreferrer" class="underline">`
   with proper attribute escaping. NOTE: this can change output for EXISTING
   content that already contains links — that diff is intended; see G-a2.

Out of scope: toggles, child pages, images beyond the existing certificate
extraction, code blocks, sync.html polling. Do not restructure existing
functions; extend the switch and the flush logic surgically.

Self-check (ponytail rule — one runnable check): `scripts/render-check.js`,
assert-based fixtures for each new block type + one regression fixture for the
existing types; run with `node scripts/render-check.js`; exits non-zero on
mismatch. No frameworks. Keep the file (it is the renderer's regression net).

Gates:
- G-a1: `node scripts/render-check.js` passes; `node --check` passes; EOL clean.
- G-a2: baseline diff — run the sync on the PR branch (workflow --ref branch)
  before and after the renderer change; the content.js diff contains ONLY
  intended-kind changes (new anchor tags / list markup), zero text-content loss.
  Claude reviews this diff line by line.
- G-a3: PR review (Claude adversarial) → master merges.
- G-a4: E2E — master adds a numbered list + divider to ONE growth-record body,
  presses the sync button, and the elements render on the live site.
- G-a5: the hub cheatsheet bullet listing supported blocks is updated to match
  (one-line Notion edit — master, guided; API block-level edit not worth it).

Working agreements: branch `codex/phase-d-renderer`, PR to main, no merge
without Claude review; karpathy rules; no new dependencies.

---

## Track B — Content quality pass (hybrid: codex audits, Claude reviews, master decides)

Honest role split: editorial judgment is not delegable to a bulk worker.
codex produces the evidence table; Claude does the recruiter-lens critique;
master approves and edits in Notion (the new pipeline makes application
instant).

### B-1 (codex): content audit report — READ-ONLY, no edits anywhere
Source: `content.js` on latest main (no Notion access needed).
Output: `docs/review/2026-07-content-audit.md` (new file, PR or direct commit
to main — docs only), containing:
1. Inventory table: every published item (career cases, dx cases, training,
   activities, certifications, skills) with title, section, text lengths,
   and numbers/metrics quoted in the copy.
2. Evidence-link check: every `evidenceUrl`/`credentialUrl`/`certImage` URL →
   HTTP status (curl). Flag non-200s.
3. Branding-rule scan (from CLAUDE.md, verbatim rules):
   - headline must be `'원래 이랬어'를 바꾸는 HR입니다.` — confirm present;
   - `700명 규모` used (not 550명 강조) — list every occurrence of headcount;
   - forbidden strings anywhere: `제조 현장 전문`; military rank/career terms
     in hero/badges (allowed only in 주요 활동);
   - metric consistency: list all occurrences of `+12%p`, `–8%p`, `0건` and
     flag contradictions.
4. Gap flags: empty `desc`/`설명`, cases without evidenceUrl, certifications
   without credentialUrl, skills in categories with <2 items.
5. NO rewriting, NO tone suggestions — facts only.

Gates:
- G-b1: audit row count matches the live sync summary (9 cases / 12 growth /
  13 skills) — 100% coverage.
- G-b2: every URL in the inventory has a recorded HTTP status.
- G-b3: branding scan section present with explicit PASS/FLAG per rule.

### B-2 (Claude): recruiter-lens editorial review
Over the audit: per item, a critique + concrete rewrite suggestion (Korean),
prioritized by what a recruiter reads first (hero → career cases → dx).
Delivered to master as an HTML review doc for approval. No direct edits.

### B-3 (master): apply approved edits in Notion → sync button → live check.

Gates: G-b4 review delivered; G-b5 master applied chosen edits and the live
site reflects them (callout `변경 반영됨`).
