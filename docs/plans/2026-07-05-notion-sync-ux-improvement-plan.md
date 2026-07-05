# Notion Sync UX Improvement Plan (Approach B)

Date: 2026-07-05 (rev 1.1 — see History)
Author: Claude (orchestrator — planning/quality/verification only)
Implementer: codex (all code phases AND the Phase-0 credential audit AND
API-scriptable Notion edits). Claude does NOT modify code or Notion content.
Status: PROVISIONAL until master approves; gates FREEZE on approval.

## 1. Problem And Goal

Operator profile: non-developer. Usage pattern: rarely edits, then batch-edits
right before job-application events.

Confirmed pain points (operator interview, 2026-07-05):

1. Forgets which fields to fill on each visit (3 DBs, inconsistent property names).
2. Edits are invisible until the next daily cron (KST 09:00) and there is no
   confirmation that an edit reached the site.
3. Entry path into the right Notion pages is cumbersome.
4. Notion body formatting support on the site is narrow (out of scope here — Phase D, deferred).

Goal (one sentence): the operator can open one Notion hub page, edit with
self-explanatory templates, press one button, and see confirmation inside
Notion that the site is updated — within ~2 minutes.

## 2. Non-Goals (do not do these)

- No build tools, no framework. Pure HTML/JS/Tailwind CDN only (CLAUDE.md).
- No Notion API key in any frontend code.
- No `EDITOR_TOKEN`, GitHub PAT, or any credential value hardcoded or printed
  anywhere (repo, logs, chat, docs). Audit steps report presence/scopes only.
- No Notion block-renderer expansion in this pass (deferred to Phase D).
- No change to branding-locked strings in `index.html` / `content.js` hardcoded section.
- No renaming of Notion DB properties inside code — code already supports aliases.

## 3. Roles

| Who | Does |
|---|---|
| codex | Phase 0-A credential audit, Phase A + B implementation, Phase C API-scriptable Notion edits |
| master | Phase 0-B manual steps ONLY where the audit proves something is missing; final approvals; live checks |
| Claude | This plan, gate verification on PR (adversarial review), Phase C spec + review. No code, no direct Notion writes |

## 4. Frozen Gates (summary — verify each with evidence, not self-report)

- G-0: audit report exists listing, for each capability in §5, VERIFIED / MISSING
  with the command or API call used as evidence — and no credential value appears
  in any log or report.
- G-A1: `POST /api/sync` with wrong/missing token returns 401. With correct token
  returns 2xx and a new `sync-notion.yml` workflow run appears on `main` within 60s.
- G-A2: `sync.html` works end-to-end in a browser: enter editor password → click →
  visible success state. No secrets in repo (grep evidence).
- G-A3: `node --check` passes; no new npm dependency outside `scripts/`
  (Pages Functions must stay dependency-free).
- G-B0: on the FIRST run after deploy, the status callout is auto-created on the
  hub page (find-or-create) — no human created it and no block id was manually copied.
- G-B1: after a triggered run with NO Notion changes, the callout shows an
  "unchanged" message with a fresh KST timestamp.
- G-B2: after a run WITH a real content change, the callout shows "updated" plus
  row counts (cases/growth/skills/assets).
- G-B3: notify step can never fail the sync: simulate notify failure (e.g. bad
  page id override) → workflow still succeeds and commit behavior is unaffected.
- G-C1: after property renames in Notion (`카테코리`→`카테고리`, `선택`→`상태`),
  a manual dispatch run succeeds and site output is unchanged.
- G-E2E: full walkthrough — master edits one Notion field, presses the button on
  `sync.html`, sees the Notion callout update, and sees the change live on the
  site, all within ~2 minutes.

## 5. Phase 0-A — Credential & capability audit (codex, read-only, FIRST)

Purpose: find out what already exists before asking master to create anything.
Report VERIFIED / MISSING per item, with the exact check used. NEVER print
token values, even partially.

| # | Capability | How codex checks (evidence) |
|---|---|---|
| A1 | gh CLI authenticated on this machine, and its scopes | `gh auth status` (scopes line only) |
| A2 | gh can dispatch the sync workflow | `gh workflow run sync-notion.yml` then `gh run list --limit 1` shows a fresh run (harmless: sync is idempotent) |
| A3 | GitHub repo secrets present | `gh secret list` (names only) — expect `NOTION_API_KEY`, `NOTION_DB_ID_*`, `NOTION_PAGE_ID_SETTINGS` |
| A4 | Notion integration WRITE capability | one-off dry-run inside Actions (where `NOTION_API_KEY` lives): append a test paragraph block to the hub page, then delete it; log only HTTP statuses. May be a temporary `workflow_dispatch` step or a `--capability-check` flag on the Phase-B notify script |
| A5 | Any local Notion/Cloudflare credentials on this PC | search env vars / `.env` files; report file paths + variable NAMES only |
| A6 | Cloudflare Pages env vars readable/writable from CLI | expected MISSING (no wrangler); confirm and say so |

Decision rules after audit:
- A2 verified does NOT remove the need for a browser-button token: the gh CLI
  token is a broad-scope personal token and MUST NOT be copied into Cloudflare.
  The button requires its own least-privilege token (P0-B1) regardless.
- A4 verified removes ALL manual Notion setup (Phase B self-provisions).
- A4 missing → master flips "Update content" + "Insert content" on the
  integration in Notion settings (one toggle, guided).

## 6. Phase 0-B — Manual steps (master, ONLY what the audit proves missing)

P0-B1. GitHub fine-grained PAT for the sync button (expected: always needed):
  - GitHub → Settings → Developer settings → Fine-grained tokens → Generate.
  - Repository access: ONLY `lucasung-debug/hr-ops-portfolio`.
  - Permissions: Actions = Read and write. Nothing else.
  - Store as Cloudflare Pages env var `GH_WORKFLOW_TOKEN` (Production).
  - Never paste the token into chat, code, or docs.
P0-B2. Notion integration write capability toggle — only if A4 = MISSING.

## 7. Phase A — "Sync now" button (codex)

New files only.

### A-1. `functions/api/sync.js` (new Cloudflare Pages Function)

Follow the existing pattern in `functions/api/content.js` (respond helper,
CORS/security headers, Bearer parsing). Behavior:

- `POST /api/sync`
  - Auth: `Authorization: Bearer <token>`; token must equal `env.EDITOR_TOKEN`
    (identical check to `content.js` PUT). Missing/mismatch → 401 JSON.
  - Action: `fetch('https://api.github.com/repos/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml/dispatches', { method:'POST', headers:{ 'Authorization': 'Bearer ' + env.GH_WORKFLOW_TOKEN, 'Accept': 'application/vnd.github+json', 'User-Agent': 'hr-ops-portfolio-sync' }, body: JSON.stringify({ ref: 'main' }) })`
    - Note: GitHub REST requires a `User-Agent` header. GitHub returns 204 on success.
  - Success → `{ ok: true }` with status 202.
  - GitHub error → 502 `{ error: 'GitHub dispatch failed' }` (never echo GitHub
    response bodies or any token).
  - `env.GH_WORKFLOW_TOKEN` missing → 500 `{ error: 'Server not configured' }`.
- `OPTIONS` → 204 with same CORS headers as `content.js`.
- No rate limiting in v1 (token-gated, single operator). Add a
  `// ponytail:` note naming this ceiling.

### A-2. `sync.html` (new static page)

- Same look-and-feel stack as `admin.html`: Tailwind CDN + Pretendard, `lang="ko"`.
- Content: title "사이트 반영", one password input (type=password, placeholder
  `편집자 비밀번호`), one primary button `지금 사이트에 반영`, one status area.
- On click: `fetch('/api/sync', { method:'POST', headers:{ 'Authorization': 'Bearer ' + token } })`.
  - 202 → `✅ 동기화 시작! 1~2분 뒤 Notion 허브의 '마지막 반영' 칸을 확인하세요.`
    plus two links: the Notion hub page URL and
    `https://github.com/lucasung-debug/hr-ops-portfolio/actions/workflows/sync-notion.yml`.
  - 401 → `비밀번호가 올바르지 않습니다.`
  - other → `동기화 요청 실패 — 잠시 후 다시 시도하세요.`
- Keep it under ~120 lines. No polling in v1. All user-facing text in Korean.

### A-3. Verification evidence codex must attach (Claude re-checks)

- `curl -X POST .../api/sync` without token → 401 body shown.
- `curl` with correct token (master runs it; token never appears in logs) → 202,
  and `gh run list --workflow sync-notion.yml --limit 1` shows a fresh run.
- Secret grep evidence: no PAT/EDITOR_TOKEN values anywhere in the repo.

## 8. Phase B — Sync result written back into Notion (codex)

### B-1. `scripts/generate-content.js` (small addition, surgical)

- After building content, write a machine summary to `scripts/.sync-summary.json`:
  `{ cases, career, dx, growth, training, activities, certifications, skills, skillCategories, assets, contentBytes }`
  using numbers already computed for `printSyncSummary`.
- Add `scripts/.sync-summary.json` to `.gitignore` (tracked file; one line).
- Do not restructure existing functions; keep the diff minimal.

### B-2. `scripts/notify-notion.js` (new) — self-provisioning, zero manual setup

- Usage: `node scripts/notify-notion.js <changed|unchanged|failed>`.
- Env: `NOTION_API_KEY` (required), `NOTION_SYNC_HUB_PAGE_ID` (optional override).
- Hub page id default: hardcode the `Git-Notion Sync` page id
  (`31bc27c2afbf8004a5b6e4b15d1faf9c`) as a constant — same convention as
  `EVIDENCE_PAGE_URL`; the page URL is already public in this repo's docs.
- Find-or-create (this removes all manual block setup — G-B0):
  1. List the hub page's top-level blocks.
  2. Find the first callout whose text starts with the marker `마지막 반영` or `마지막 확인`.
  3. If none, create the callout at the top of the page.
  4. Update its rich_text to a single line:
     - changed:   `✅ 마지막 반영: {YYYY-MM-DD HH:mm KST} — 변경 반영됨 · 케이스 {n} · 성장 {n} · 스킬 {n} · 이미지 {n}`
     - unchanged: `✅ 마지막 확인: {timestamp KST} — 변경 없음 (사이트가 이미 최신)`
     - failed:    `❌ 동기화 실패: {timestamp KST} — GitHub Actions 로그 확인 필요`
- Reads `scripts/.sync-summary.json` if present; counts omitted gracefully if absent.
- Support `--capability-check` flag for audit A4: append one test paragraph to the
  hub page, delete it, print HTTP statuses only, exit 0/1.
- MUST be failure-safe in notify mode: wrap in try/catch, log a warning, always
  `process.exit(0)` (G-B3). A broken notification must never break the sync.
- KST formatting via `Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', ... })`.

### B-3. `.github/workflows/sync-notion.yml` (edit commit step + add notify step)

```yaml
      - name: Commit and push if changed
        id: commit
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add content.js
          if [ -d assets/notion ]; then git add assets/notion; fi
          if git diff --staged --quiet; then
            echo "outcome=unchanged" >> "$GITHUB_OUTPUT"
          else
            git commit -m "chore: auto-sync content from Notion"
            git pull --rebase
            git push
            echo "outcome=changed" >> "$GITHUB_OUTPUT"
          fi

      - name: Notify Notion (status callout)
        if: always()
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
        run: node scripts/notify-notion.js "${{ steps.commit.outputs.outcome || 'failed' }}"
```

- Preserve existing behavior exactly when nothing changed (no commit).
- No new GitHub variables or secrets are required for Phase B.

### B-4. Verification evidence codex must attach

- First dispatch run → Actions log shows callout was CREATED (G-B0), then master
  confirms it is visible on the hub page.
- One dispatch run with no Notion edits → log shows notify ran with `unchanged`;
  callout text updated (G-B1).
- One dispatch run after a trivial Notion edit → callout shows `변경 반영됨` with
  counts; exactly one auto-sync commit exists (G-B2).
- Simulated failure: run notify locally/in-Actions with a bogus
  `NOTION_SYNC_HUB_PAGE_ID` override → exits 0, prints warning (G-B3).

## 9. Phase C — Notion-side reorganization (codex scripts + master UI steps; AFTER A/B are live)

Ownership split — Claude specs and reviews, codex executes everything the Notion
API supports, master does the few UI-only steps the public API cannot do:

C-1 (codex, scriptable). Property renames — safe due to alias layer on `main`:
  - 스킬 DB: `카테코리` → `카테고리`; `선택` → `상태` (Notion API: database update).
  - Then one manual dispatch run; verify G-C1.
C-2 (codex, scriptable). Hub page restructure per Claude's spec:
  - Top: status callout (auto-created by B) + link to `sync.html` + live-site link.
  - Middle: three prominent links — 케이스 스터디 DB / 성장 기록 DB / 스킬 DB.
  - Bottom: one-page cheatsheet: "발행하려면 상태를 '발행'으로 → sync.html에서
    반영 → 콜아웃 확인".
  - Execution note: run where `NOTION_API_KEY` is available (a one-off script in
    Actions, or locally if audit A5 found a local key).
C-3 (master, UI-only). Notion DATABASE TEMPLATES (pre-filled 상태=초안, correct
  유형, body placeholders) — the public API cannot create database templates, so
  master creates them in the Notion UI following Claude's click-by-click guide.
C-4. Every Phase-C change is proposed in writing first and approved by master
  before execution (Notion content is master's workspace).

## 10. Sequencing And Rollback

Order: 0-A audit → 0-B (gaps only) → A → B → (verify E2E) → C. A and B may share
one branch/PR: `codex/notion-sync-ux-b`.
- A rollback: delete `sync.html` + `functions/api/sync.js`.
- B rollback: revert workflow step + delete notify script (summary write is inert).
- C rollback: rename properties back (aliases cover both directions); hub layout
  restorable from page history.

## 11. Working Agreements For codex

- Follow karpathy guidelines: minimal surgical diff, no drive-by refactoring,
  match existing code style (Korean comments OK — repo convention), keep new
  functions short.
- Branch from latest `main`; PR to `main`; do not merge without Claude gate
  review + master approval.
- Preserve LF/CRLF hygiene: normal diff and `--ignore-all-space` diff must match.
- TASK_DONE must include: audit table (G-0), file list, gate-by-gate evidence
  (curl outputs, run ids, callout text), and any deviation from this plan flagged
  explicitly. Deviations require plan revision (Act phase), not silent edits —
  gates are frozen for the implementer.

## 12. Deferred (Phase D backlog, not in this pass)

- `notionBlocksToHtml()` expansion: numbered lists, callouts, dividers, nested lists.
- Documented block-support matrix in the hub cheatsheet.
- `sync.html` run-status polling (public repo Actions API allows unauthenticated reads).

## History

- 1.0 (2026-07-05) Initial plan: Phase 0 all-manual (PAT + capability toggle +
  manual callout block id capture); Phase C executed by Claude via MCP.
- 1.1 (2026-07-05) Master feedback applied: (a) Phase 0 split into 0-A codex
  credential audit first / 0-B manual-only-if-missing; (b) manual callout block
  setup ELIMINATED — notify script self-provisions via find-or-create (new gate
  G-B0), no `NOTION_SYNC_STATUS_BLOCK_ID` variable needed; (c) Phase C execution
  moved from Claude-MCP to codex scripts, except UI-only database templates
  (master, guided) — Claude is spec/review only end to end.
